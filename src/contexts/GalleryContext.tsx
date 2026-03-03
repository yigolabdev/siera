import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { uploadFile, deleteFile, getFileURL, uploadImageMultiSize } from '../lib/firebase/storage';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { useAuth } from './AuthContextEnhanced';
import { Photo } from '../types';
import { waitForFirebase } from '../lib/firebase/config';
import { SUPER_ADMIN_EMAILS } from '../constants';

interface GalleryContextType {
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
  uploadPhotos: (files: File[], eventId: string, eventTitle: string, galleryTitle: string) => Promise<void>;
  updateAlbumPhotos: (photoIds: string[], updates: { title?: string; eventId?: string; eventTitle?: string }) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  toggleLike: (photoId: string, userId: string) => Promise<void>;
  getPhotosByEvent: (eventId: string) => Photo[];
  getPhotosByYearMonth: (year: string, month: string) => Photo[];
  refreshPhotos: () => Promise<void>;
  _activate: () => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider = ({ children }: { children: ReactNode }) => {
  const { user, firebaseUser, isLoading: authLoading } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lazy loading: useGallery() 훅이 호출될 때만 데이터 로드
  const [_activated, _setActivated] = useState(false);
  const _activate = useCallback(() => _setActivated(true), []);

  // Firebase에서 사진 데이터 로드 - 활성화된 후에만
  useEffect(() => {
    if (!_activated) return;

    const loadPhotos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getDocuments<Photo>('photos');
        if (result.success && result.data) {
          setPhotos(result.data);
        } else {
          setPhotos([]);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Firebase 사진 데이터 로드 실패:', message);
        setError(message);
        logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
          context: 'GalleryContext.loadPhotos',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      loadPhotos();
    }
  }, [_activated, firebaseUser, authLoading]);

  // 사진 업로드
  const uploadPhotos = useCallback(async (
    files: File[],
    eventId: string,
    eventTitle: string,
    galleryTitle: string
  ) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      const uploadPromises = files.map(async (file, index) => {
        const timestamp = Date.now();
        const fileName = `${eventId}_${timestamp}_${index}.${file.name.split('.').pop()}`;
        const basePath = `gallery/${eventId}`;
        
        const multiResult = await uploadImageMultiSize(basePath, fileName, file);
        
        if (!multiResult.original.success || !multiResult.original.url) {
          throw new Error(`파일 업로드 실패: ${multiResult.original.error || '알 수 없는 오류'}`);
        }

        const photoId = `photo_${timestamp}_${index}`;
        const now = new Date().toISOString();
        const photoData: Photo = {
          id: photoId,
          eventId,
          eventTitle,
          eventYear: now.substring(0, 4),
          eventMonth: now.substring(5, 7),
          uploadedBy: user.id,
          uploadedByName: user.name,
          uploadedAt: now,
          imageUrl: multiResult.original.url,
          thumbnailUrl: multiResult.thumbnail.url || undefined,
          mediumUrl: multiResult.medium.url || undefined,
          title: galleryTitle,
          caption: '',
          likes: 0,
          likedBy: [],
        };
        
        const result = await setDocument('photos', photoId, photoData);
        
        if (result.success) {
          return photoData;
        }
        throw new Error('사진 메타데이터 저장 실패');
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      setPhotos(prev => [...prev, ...uploadedPhotos]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ 사진 업로드 실패:', message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.STORAGE);
      throw error;
    }
  }, [user]);

  // 앨범 사진 일괄 수정 (제목, 산행 변경)
  const updateAlbumPhotos = useCallback(async (
    photoIds: string[],
    updates: { title?: string; eventId?: string; eventTitle?: string }
  ) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      const updateData: Record<string, any> = { updatedAt: new Date().toISOString() };
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.eventId !== undefined) updateData.eventId = updates.eventId;
      if (updates.eventTitle !== undefined) updateData.eventTitle = updates.eventTitle;

      const updatePromises = photoIds.map(photoId =>
        updateDocument('photos', photoId, updateData)
      );
      await Promise.all(updatePromises);

      // 로컬 상태 업데이트
      setPhotos(prev => prev.map(p =>
        photoIds.includes(p.id)
          ? { ...p, ...updates }
          : p
      ));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ 앨범 수정 실패:', message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE);
      throw error;
    }
  }, [user]);

  // 사진 삭제 (권한 확인 포함)
  const deletePhoto = useCallback(async (photoId: string) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) {
        throw new Error('사진을 찾을 수 없습니다.');
      }

      // 권한 확인: 업로더 본인이거나 관리자(chairman/committee) 또는 슈퍼 관리자만 삭제 가능
      const isOwner = photo.uploadedBy === user.id;
      const isAdmin = user.role === 'chairman' || user.role === 'committee' || SUPER_ADMIN_EMAILS.includes(user.email);
      
      if (!isOwner && !isAdmin) {
        throw new Error('사진을 삭제할 권한이 없습니다.');
      }

      // Storage에서 파일 삭제
      const storagePath = photo.imageUrl.split('/o/')[1]?.split('?')[0];
      if (storagePath) {
        await deleteFile(decodeURIComponent(storagePath));
      }

      // Firestore에서 메타데이터 삭제
      const result = await deleteDocument('photos', photoId);
      if (result.success) {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
      } else {
        throw new Error(result.error || '사진 삭제 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ 사진 삭제 실패:', message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.STORAGE, { photoId });
      throw error;
    }
  }, [photos, user]);

  // 좋아요 토글
  const toggleLike = useCallback(async (photoId: string, userId: string) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;

      const isLiked = photo.likedBy.includes(userId);
      const newLikedBy = isLiked
        ? photo.likedBy.filter(id => id !== userId)
        : [...photo.likedBy, userId];

      const result = await updateDocument('photos', photoId, {
        likes: newLikedBy.length,
        likedBy: newLikedBy,
      });

      if (result.success) {
        setPhotos(prev => prev.map(p =>
          p.id === photoId
            ? { ...p, likes: newLikedBy.length, likedBy: newLikedBy }
            : p
        ));
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { photoId });
    }
  }, [photos]);

  // 이벤트별 사진 조회
  const getPhotosByEvent = useCallback((eventId: string) => {
    return photos.filter(p => p.eventId === eventId);
  }, [photos]);

  // 년월별 사진 조회
  const getPhotosByYearMonth = useCallback((year: string, month: string) => {
    return photos.filter(p => p.eventYear === year && p.eventMonth === month);
  }, [photos]);

  // 사진 새로고침
  const refreshPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getDocuments<Photo>('photos');
      if (result.success && result.data) {
        setPhotos(result.data);
      } else {
        setPhotos([]);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Firebase 사진 데이터 새로고침 실패:', message);
      setError(message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'GalleryContext.refreshPhotos',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    photos,
    isLoading,
    error,
    uploadPhotos,
    updateAlbumPhotos,
    deletePhoto,
    toggleLike,
    getPhotosByEvent,
    getPhotosByYearMonth,
    refreshPhotos,
    _activate,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  // Lazy loading: 이 훅이 호출될 때 데이터 로드 활성화
  useEffect(() => { context._activate(); }, [context._activate]);
  return context;
};

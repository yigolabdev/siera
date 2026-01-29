import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { uploadFile, deleteFile, getFileURL } from '../lib/firebase/storage';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { useAuth } from './AuthContextEnhanced';
import { Photo } from '../types';
import { waitForFirebase } from '../lib/firebase/config';

interface GalleryContextType {
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
  uploadPhotos: (files: File[], eventId: string, eventTitle: string, galleryTitle: string) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  toggleLike: (photoId: string, userId: string) => Promise<void>;
  getPhotosByEvent: (eventId: string) => Photo[];
  getPhotosByYearMonth: (year: string, month: string) => Photo[];
  refreshPhotos: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider = ({ children }: { children: ReactNode }) => {
  const { user, firebaseUser, isLoading: authLoading } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const loadPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 [GalleryContext] photos 데이터 로드 시작');

      const result = await getDocuments<Photo>('photos');
      if (result.success && result.data) {
        setPhotos(result.data);
        console.log('✅ Firebase에서 사진 데이터 로드:', result.data.length, '개');
      } else {
        console.log('ℹ️ Firebase에서 로드된 사진 데이터가 없습니다.');
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
  }, []);

  // Firebase에서 사진 데이터 로드 - 로그인 상태 변경 시 재로드
  useEffect(() => {
    const initializeData = async () => {
      console.log('🔄 [GalleryContext] 데이터 로드 시작, 인증 상태:', {
        isAuthenticated: !!firebaseUser,
        email: firebaseUser?.email,
        hasLoadedOnce
      });
      
      // 로그인 상태이거나 아직 한 번도 로드하지 않았을 때만 로드
      if (firebaseUser || !hasLoadedOnce) {
        await loadPhotos();
        setHasLoadedOnce(true);
      }
    };
    
    // Auth 로딩이 완료된 후에만 실행
    if (!authLoading) {
      initializeData();
    }
  }, [firebaseUser, authLoading, loadPhotos]);

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
      console.log('📤 사진 업로드 시작:', {
        fileCount: files.length,
        eventId,
        eventTitle,
        galleryTitle,
        userId: user.id,
        userName: user.name
      });

      const uploadPromises = files.map(async (file, index) => {
        console.log(`📤 업로드 중 [${index + 1}/${files.length}]:`, file.name);

        // Storage에 파일 업로드
        const timestamp = Date.now();
        const fileName = `${eventId}_${timestamp}_${index}.${file.name.split('.').pop()}`;
        const storagePath = `gallery/${eventId}/${fileName}`;
        
        console.log('📁 Storage 경로:', storagePath);
        
        const uploadResult = await uploadFile(storagePath, file);
        console.log('✅ Storage 업로드 결과:', uploadResult);
        
        if (!uploadResult.success || !uploadResult.url) {
          throw new Error(`파일 업로드 실패: ${uploadResult.error || '알 수 없는 오류'}`);
        }

        // Firestore에 메타데이터 저장
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
          imageUrl: uploadResult.url,
          title: galleryTitle, // 갤러리 제목 (모든 사진에 동일하게 적용)
          caption: '', // 개별 사진 설명은 빈 문자열
          likes: 0,
          likedBy: [],
        };

        console.log('💾 Firestore 저장 중:', photoId);
        
        const result = await setDocument('photos', photoId, photoData);
        console.log('✅ Firestore 저장 결과:', result);
        
        if (result.success) {
          return photoData;
        }
        throw new Error('사진 메타데이터 저장 실패');
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      setPhotos(prev => [...prev, ...uploadedPhotos]);
      console.log(`✅ ${uploadedPhotos.length}개 사진 업로드 완료`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ 사진 업로드 실패:', message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.STORAGE);
      throw error;
    }
  }, [user]);

  // 사진 삭제
  const deletePhoto = useCallback(async (photoId: string) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) {
        throw new Error('사진을 찾을 수 없습니다.');
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
        console.log('✅ 사진 삭제 완료');
      } else {
        throw new Error(result.error || '사진 삭제 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.STORAGE, { photoId });
      throw error;
    }
  }, [photos]);

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
    await loadPhotos();
  }, [loadPhotos]);

  const value = {
    photos,
    isLoading,
    error,
    uploadPhotos,
    deletePhoto,
    toggleLike,
    getPhotosByEvent,
    getPhotosByYearMonth,
    refreshPhotos,
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
  return context;
};

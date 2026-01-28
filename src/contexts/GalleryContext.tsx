import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { uploadFile, deleteFile, getFileURL } from '../lib/firebase/storage';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';

export interface Photo {
  id: string;
  eventId: string;
  eventTitle: string;
  eventYear: string;
  eventMonth: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  imageUrl: string;
  caption?: string;
  likes: number;
  likedBy: string[];
}

interface GalleryContextType {
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
  uploadPhotos: (files: File[], eventId: string, eventTitle: string, captions: string[]) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  toggleLike: (photoId: string, userId: string) => Promise<void>;
  getPhotosByEvent: (eventId: string) => Photo[];
  getPhotosByYearMonth: (year: string, month: string) => Photo[];
  refreshPhotos: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase에서 사진 데이터 로드
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getDocuments<Photo>('photos');
      if (result.success && result.data) {
        setPhotos(result.data);
        console.log('✅ Firebase에서 사진 데이터 로드:', result.data.length);
      } else {
        console.log('ℹ️ Firebase에서 로드된 사진 데이터가 없습니다.');
      }
    } catch (err: any) {
      console.error('❌ Firebase 사진 데이터 로드 실패:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 사진 업로드
  const uploadPhotos = useCallback(async (
    files: File[],
    eventId: string,
    eventTitle: string,
    captions: string[]
  ) => {
    try {
      const uploadPromises = files.map(async (file, index) => {
        // Storage에 파일 업로드
        const timestamp = Date.now();
        const fileName = `${eventId}_${timestamp}_${index}.${file.name.split('.').pop()}`;
        const storagePath = `gallery/${eventId}/${fileName}`;
        
        const uploadResult = await uploadFile(storagePath, file);
        if (!uploadResult.success || !uploadResult.url) {
          throw new Error('파일 업로드 실패');
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
          uploadedBy: 'current-user-id', // TODO: 실제 user ID로 교체
          uploadedByName: 'Current User', // TODO: 실제 user name으로 교체
          uploadedAt: now,
          imageUrl: uploadResult.url,
          caption: captions[index] || '',
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
      console.log(`✅ ${uploadedPhotos.length}개 사진 업로드 완료`);
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.STORAGE);
      throw err;
    }
  }, []);

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
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.STORAGE, { photoId });
      throw err;
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
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { photoId });
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
  }, []);

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

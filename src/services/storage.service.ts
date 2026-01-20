/**
 * Storage Service
 * Firebase Storage를 이용한 파일 업로드/다운로드 서비스
 */

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadResult,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * 파일 업로드 옵션
 */
export interface UploadOptions {
  onProgress?: (progress: number) => void;
  metadata?: {
    contentType?: string;
    customMetadata?: Record<string, string>;
  };
}

/**
 * 파일 업로드 결과
 */
export interface UploadFileResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * 프로필 이미지 업로드
 */
export async function uploadProfileImage(
  userId: string,
  file: File,
  options?: UploadOptions
): Promise<UploadFileResult> {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `profiles/${userId}/${fileName}`;
    const storageRef = ref(storage, filePath);

    if (options?.onProgress) {
      // 진행률 추적이 필요한 경우
      const uploadTask = uploadBytesResumable(storageRef, file, options.metadata);

      return new Promise((resolve) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            options.onProgress?.(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            resolve({
              success: false,
              error: error.message,
            });
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                success: true,
                url,
                path: filePath,
              });
            } catch (error: any) {
              resolve({
                success: false,
                error: error.message,
              });
            }
          }
        );
      });
    } else {
      // 간단한 업로드
      const snapshot = await uploadBytes(storageRef, file, options?.metadata);
      const url = await getDownloadURL(snapshot.ref);

      return {
        success: true,
        url,
        path: filePath,
      };
    }
  } catch (error: any) {
    console.error('Profile image upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 갤러리 이미지 업로드
 */
export async function uploadGalleryImage(
  eventId: string,
  file: File,
  options?: UploadOptions
): Promise<UploadFileResult> {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `gallery/${eventId}/${fileName}`;
    const storageRef = ref(storage, filePath);

    if (options?.onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file, options.metadata);

      return new Promise((resolve) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            options.onProgress?.(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            resolve({
              success: false,
              error: error.message,
            });
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                success: true,
                url,
                path: filePath,
              });
            } catch (error: any) {
              resolve({
                success: false,
                error: error.message,
              });
            }
          }
        );
      });
    } else {
      const snapshot = await uploadBytes(storageRef, file, options?.metadata);
      const url = await getDownloadURL(snapshot.ref);

      return {
        success: true,
        url,
        path: filePath,
      };
    }
  } catch (error: any) {
    console.error('Gallery image upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 여러 이미지 업로드
 */
export async function uploadMultipleImages(
  eventId: string,
  files: File[],
  options?: UploadOptions
): Promise<UploadFileResult[]> {
  const results: UploadFileResult[] = [];

  for (const file of files) {
    const result = await uploadGalleryImage(eventId, file, options);
    results.push(result);
  }

  return results;
}

/**
 * 이벤트 커버 이미지 업로드
 */
export async function uploadEventCoverImage(
  eventId: string,
  file: File,
  options?: UploadOptions
): Promise<UploadFileResult> {
  try {
    const fileName = `cover_${Date.now()}_${file.name}`;
    const filePath = `events/${eventId}/${fileName}`;
    const storageRef = ref(storage, filePath);

    const snapshot = await uploadBytes(storageRef, file, options?.metadata);
    const url = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      url,
      path: filePath,
    };
  } catch (error: any) {
    console.error('Event cover image upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 파일 삭제
 */
export async function deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Delete file error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 폴더의 모든 파일 목록 가져오기
 */
export async function listFilesInFolder(folderPath: string): Promise<{
  success: boolean;
  files?: string[];
  error?: string;
}> {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);

    const fileUrls: string[] = [];
    for (const itemRef of result.items) {
      const url = await getDownloadURL(itemRef);
      fileUrls.push(url);
    }

    return {
      success: true,
      files: fileUrls,
    };
  } catch (error: any) {
    console.error('List files error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 이미지 크기 최적화 (클라이언트 사이드)
 */
export async function optimizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.9
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // 비율 유지하면서 크기 조정
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Image optimization failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default {
  uploadProfileImage,
  uploadGalleryImage,
  uploadMultipleImages,
  uploadEventCoverImage,
  deleteFile,
  listFilesInFolder,
  optimizeImage,
};

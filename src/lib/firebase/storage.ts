import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadMetadata,
} from 'firebase/storage';
import { storage } from './config';

/**
 * 파일 업로드 (단순)
 */
export const uploadFile = async (
  path: string,
  file: File,
  metadata?: UploadMetadata
) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      url: downloadURL,
      fullPath: snapshot.ref.fullPath,
    };
  } catch (error: any) {
    console.error('Upload file error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 파일 업로드 (진행률 포함)
 */
export const uploadFileWithProgress = (
  path: string,
  file: File,
  onProgress?: (progress: number) => void,
  metadata?: UploadMetadata
) => {
  return new Promise<{
    success: boolean;
    url?: string;
    fullPath?: string;
    error?: string;
  }>((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
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
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            success: true,
            url: downloadURL,
            fullPath: uploadTask.snapshot.ref.fullPath,
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
};

/**
 * 파일 다운로드 URL 가져오기
 */
export const getFileURL = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    
    return {
      success: true,
      url,
    };
  } catch (error: any) {
    console.error('Get file URL error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 파일 삭제
 */
export const deleteFile = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    
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
};

/**
 * 폴더의 모든 파일 목록 가져오기
 */
export const listFiles = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url,
        };
      })
    );
    
    return {
      success: true,
      files,
      folders: result.prefixes.map((prefix) => prefix.fullPath),
    };
  } catch (error: any) {
    console.error('List files error:', error);
    return {
      success: false,
      error: error.message,
      files: [],
      folders: [],
    };
  }
};

/**
 * 이미지 최적화 업로드
 */
export const uploadImage = async (
  path: string,
  file: File,
  maxWidth = 1920,
  quality = 0.8
): Promise<{
  success: boolean;
  url?: string;
  fullPath?: string;
  error?: string;
}> => {
  return new Promise((resolve) => {
    // 이미지 리사이징
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // 크기 조정
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Blob으로 변환
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              resolve({
                success: false,
                error: 'Failed to convert image',
              });
              return;
            }
            
            // 업로드
            const result = await uploadFile(path, new File([blob], file.name, {
              type: file.type,
            }));
            
            resolve(result);
          },
          file.type,
          quality
        );
      };
    };
    
    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Failed to read file',
      });
    };
  });
};

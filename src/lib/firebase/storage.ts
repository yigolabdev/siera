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
 * File 또는 Blob을 업로드할 수 있습니다
 */
export const uploadFile = async (
  path: string,
  file: File | Blob,
  metadata?: UploadMetadata
) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ [Storage] 파일 업로드 성공:', {
      path,
      url: downloadURL,
      size: file.size,
      type: file.type || (file instanceof File ? file.type : 'unknown'),
    });
    
    return {
      success: true,
      url: downloadURL,
      fullPath: snapshot.ref.fullPath,
    };
  } catch (error: any) {
    console.error('❌ [Storage] 파일 업로드 실패:', error);
    console.error('상세 정보:', {
      path,
      fileSize: file.size,
      fileType: file.type || (file instanceof File ? file.type : 'unknown'),
      errorCode: error.code,
      errorMessage: error.message,
    });
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
 * 이미지를 캔버스에 리사이즈하여 Blob으로 반환 (내부 유틸리티)
 */
const resizeToBlob = (
  img: HTMLImageElement,
  maxWidth: number,
  quality: number,
  outputType: string
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) { resolve(null); return; }
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) { resolve(blob); return; }
        canvas.toBlob((fb) => resolve(fb), 'image/jpeg', quality);
      },
      outputType,
      quality
    );
  });
};

/**
 * 이미지를 HTMLImageElement로 로드 (내부 유틸리티)
 */
const loadImageElement = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
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
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const outputType = supportedTypes.includes(file.type) ? file.type : 'image/jpeg';
  const outputExt = outputType === 'image/png' ? '.png' : outputType === 'image/webp' ? '.webp' : '.jpg';
  const outputName = file.name.replace(/\.[^.]+$/, outputExt);

  try {
    const img = await loadImageElement(file);
    const blob = await resizeToBlob(img, maxWidth, quality, outputType);
    if (!blob) return { success: false, error: 'Failed to convert image to blob' };
    return await uploadFile(path, new File([blob], outputName, { type: outputType }));
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

interface MultiSizeResult {
  original: { success: boolean; url?: string; error?: string };
  medium: { success: boolean; url?: string; error?: string };
  thumbnail: { success: boolean; url?: string; error?: string };
}

/**
 * 멀티사이즈 이미지 업로드 (원본 1920px + 중간 1200px + 썸네일 400px)
 */
export const uploadImageMultiSize = async (
  basePath: string,
  fileName: string,
  file: File
): Promise<MultiSizeResult> => {
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const outputType = supportedTypes.includes(file.type) ? file.type : 'image/jpeg';
  const outputExt = outputType === 'image/png' ? '.png' : outputType === 'image/webp' ? '.webp' : '.jpg';
  const outputName = fileName.replace(/\.[^.]+$/, outputExt);

  const fail = (error: string) => ({ success: false as const, error });

  try {
    const img = await loadImageElement(file);

    const [origBlob, medBlob, thumbBlob] = await Promise.all([
      resizeToBlob(img, 1920, 0.85, outputType),
      resizeToBlob(img, 1200, 0.80, outputType),
      resizeToBlob(img, 400, 0.75, outputType),
    ]);

    const upload = async (blob: Blob | null, subPath: string) => {
      if (!blob) return fail('Blob conversion failed');
      return await uploadFile(
        `${basePath}/${subPath}/${outputName}`,
        new File([blob], outputName, { type: outputType })
      );
    };

    const [original, medium, thumbnail] = await Promise.all([
      origBlob
        ? uploadFile(`${basePath}/${outputName}`, new File([origBlob], outputName, { type: outputType }))
        : Promise.resolve(fail('Original blob failed')),
      upload(medBlob, 'medium'),
      upload(thumbBlob, 'thumb'),
    ]);

    return { original, medium, thumbnail };
  } catch (err: any) {
    const e = fail(err.message);
    return { original: e, medium: e, thumbnail: e };
  }
};

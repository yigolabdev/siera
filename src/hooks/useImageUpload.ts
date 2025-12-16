import { useState, useRef, ChangeEvent } from 'react';
import { isValidImageFile } from '../utils/validation';

interface UseImageUploadReturn {
  imageUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  triggerFileInput: () => void;
  isUploading: boolean;
  error: string | null;
}

/**
 * 이미지 업로드 로직을 처리하는 커스텀 훅
 */
export function useImageUpload(initialImage: string | null = null): UseImageUploadReturn {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = isValidImageFile(file);
    if (!validation.valid) {
      setError(validation.error || '파일 업로드 실패');
      return;
    }

    setIsUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError('파일 읽기 실패');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    imageUrl,
    fileInputRef,
    handleImageUpload,
    handleRemoveImage,
    triggerFileInput,
    isUploading,
    error,
  };
}


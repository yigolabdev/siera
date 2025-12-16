import { VALIDATION } from '../constants';

/**
 * 이메일 유효성 검사
 */
export const isValidEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_PATTERN.test(email);
};

/**
 * 전화번호 유효성 검사
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  return VALIDATION.PHONE_PATTERN.test(phone);
};

/**
 * 비밀번호 유효성 검사
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
};

/**
 * 이미지 파일 유효성 검사
 */
export const isValidImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '이미지 파일만 업로드 가능합니다.' };
  }
  
  if (file.size > VALIDATION.MAX_IMAGE_SIZE) {
    return { valid: false, error: '파일 크기는 5MB를 초과할 수 없습니다.' };
  }
  
  return { valid: true };
};

/**
 * 필수 필드 검사
 */
export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): { valid: boolean; missingFields: string[] } => {
  const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
  
  return {
    valid: missingFields.length === 0,
    missingFields,
  };
};


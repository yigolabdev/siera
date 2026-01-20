/**
 * Validation Utils
 * 폼 및 데이터 유효성 검증 유틸리티
 */

import { REGEX_PATTERNS } from '../constants';

/**
 * 검증 결과
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * 검증 규칙
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

/**
 * 필드별 검증 규칙
 */
export type ValidationRules = Record<string, ValidationRule>;

/**
 * 이메일 검증
 */
export function validateEmail(email: string): boolean {
  return REGEX_PATTERNS.EMAIL.test(email);
}

/**
 * 전화번호 검증
 */
export function validatePhone(phone: string): boolean {
  return REGEX_PATTERNS.PHONE.test(phone);
}

/**
 * 비밀번호 검증
 */
export function validatePassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: '비밀번호는 최소 6자 이상이어야 합니다.',
    };
  }

  if (password.length > 50) {
    return {
      isValid: false,
      message: '비밀번호는 최대 50자까지 가능합니다.',
    };
  }

  // 강력한 비밀번호 권장 (선택사항)
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return {
      isValid: true,
      message: '보안을 위해 영문자와 숫자를 함께 사용하는 것을 권장합니다.',
    };
  }

  return { isValid: true };
}

/**
 * URL 검증
 */
export function validateUrl(url: string): boolean {
  return REGEX_PATTERNS.URL.test(url);
}

/**
 * 날짜 검증 (YYYY-MM-DD)
 */
export function validateDate(date: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

/**
 * 단일 필드 검증
 */
export function validateField(
  value: any,
  rules: ValidationRule,
  fieldName?: string
): { isValid: boolean; error?: string } {
  // Required 검증
  if (rules.required && !value) {
    return {
      isValid: false,
      error: `${fieldName || '필드'}는 필수 입력 항목입니다.`,
    };
  }

  // 값이 없고 required가 아니면 통과
  if (!value && !rules.required) {
    return { isValid: true };
  }

  // MinLength 검증
  if (rules.minLength && String(value).length < rules.minLength) {
    return {
      isValid: false,
      error: `${fieldName || '필드'}는 최소 ${rules.minLength}자 이상이어야 합니다.`,
    };
  }

  // MaxLength 검증
  if (rules.maxLength && String(value).length > rules.maxLength) {
    return {
      isValid: false,
      error: `${fieldName || '필드'}는 최대 ${rules.maxLength}자까지 입력 가능합니다.`,
    };
  }

  // Min 검증 (숫자)
  if (rules.min !== undefined && Number(value) < rules.min) {
    return {
      isValid: false,
      error: `${fieldName || '필드'}는 ${rules.min} 이상이어야 합니다.`,
    };
  }

  // Max 검증 (숫자)
  if (rules.max !== undefined && Number(value) > rules.max) {
    return {
      isValid: false,
      error: `${fieldName || '필드'}는 ${rules.max} 이하여야 합니다.`,
    };
  }

  // Pattern 검증
  if (rules.pattern && !rules.pattern.test(String(value))) {
    return {
      isValid: false,
      error: `${fieldName || '필드'} 형식이 올바르지 않습니다.`,
    };
  }

  // Custom 검증
  if (rules.custom) {
    const result = rules.custom(value);
    if (typeof result === 'string') {
      return {
        isValid: false,
        error: result,
      };
    }
    if (!result) {
      return {
        isValid: false,
        error: `${fieldName || '필드'} 검증에 실패했습니다.`,
      };
    }
  }

  return { isValid: true };
}

/**
 * 폼 전체 검증
 */
export function validateForm(
  data: Record<string, any>,
  rules: ValidationRules
): ValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.entries(rules).forEach(([fieldName, rule]) => {
    const value = data[fieldName];
    const result = validateField(value, rule, fieldName);

    if (!result.isValid) {
      errors[fieldName] = result.error || '검증 실패';
      isValid = false;
    }
  });

  return { isValid, errors };
}

/**
 * 회원가입 폼 검증
 */
export function validateRegistrationForm(data: {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phoneNumber: string;
  occupation?: string;
  position?: string;
}): ValidationResult {
  const rules: ValidationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    email: {
      required: true,
      pattern: REGEX_PATTERNS.EMAIL,
    },
    password: {
      required: true,
      minLength: 6,
      maxLength: 50,
    },
    passwordConfirm: {
      required: true,
      custom: (value) => {
        if (value !== data.password) {
          return '비밀번호가 일치하지 않습니다.';
        }
        return true;
      },
    },
    phoneNumber: {
      required: true,
      pattern: REGEX_PATTERNS.PHONE,
    },
  };

  return validateForm(data, rules);
}

/**
 * 로그인 폼 검증
 */
export function validateLoginForm(data: {
  email: string;
  password: string;
}): ValidationResult {
  const rules: ValidationRules = {
    email: {
      required: true,
      pattern: REGEX_PATTERNS.EMAIL,
    },
    password: {
      required: true,
      minLength: 6,
    },
  };

  return validateForm(data, rules);
}

/**
 * 산행 등록 폼 검증
 */
export function validateEventForm(data: {
  title: string;
  mountain: string;
  date: string;
  meetingTime: string;
  meetingPlace: string;
  difficulty: string;
  distance?: number;
  duration?: number;
}): ValidationResult {
  const rules: ValidationRules = {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    mountain: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    date: {
      required: true,
      custom: (value) => {
        if (!validateDate(value)) {
          return '올바른 날짜 형식이 아닙니다. (YYYY-MM-DD)';
        }
        const eventDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (eventDate < today) {
          return '과거 날짜는 선택할 수 없습니다.';
        }
        return true;
      },
    },
    meetingTime: {
      required: true,
    },
    meetingPlace: {
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    difficulty: {
      required: true,
    },
  };

  return validateForm(data, rules);
}

/**
 * 게시글 작성 폼 검증
 */
export function validatePostForm(data: {
  title: string;
  content: string;
  category: string;
}): ValidationResult {
  const rules: ValidationRules = {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    content: {
      required: true,
      minLength: 10,
      maxLength: 10000,
    },
    category: {
      required: true,
    },
  };

  return validateForm(data, rules);
}

/**
 * 파일 검증
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { isValid: boolean; error?: string } {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  } = options;

  // 파일 크기 검증
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `파일 크기는 ${Math.round(maxSize / 1024 / 1024)}MB 이하여야 합니다.`,
    };
  }

  // 파일 타입 검증
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: '지원하지 않는 파일 형식입니다.',
    };
  }

  // 파일 확장자 검증
  if (allowedExtensions.length > 0) {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `허용된 파일 확장자: ${allowedExtensions.join(', ')}`,
      };
    }
  }

  return { isValid: true };
}

// 이미지 파일 검증 (alias)
export function isValidImageFile(file: File): { valid: boolean; error?: string } {
  const result = validateFile(file);
  return {
    valid: result.isValid,
    error: result.error,
  };
}

/**
 * 여러 파일 검증
 */
export function validateFiles(
  files: File[],
  options: {
    maxFiles?: number;
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { isValid: boolean; errors: string[] } {
  const { maxFiles = 10 } = options;
  const errors: string[] = [];

  // 파일 개수 검증
  if (files.length > maxFiles) {
    errors.push(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
    return { isValid: false, errors };
  }

  // 각 파일 검증
  files.forEach((file, index) => {
    const result = validateFile(file, options);
    if (!result.isValid) {
      errors.push(`파일 ${index + 1}: ${result.error}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateUrl,
  validateDate,
  validateField,
  validateForm,
  validateRegistrationForm,
  validateLoginForm,
  validateEventForm,
  validatePostForm,
  validateFile,
  validateFiles,
};

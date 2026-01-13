/**
 * 에러 처리 유틸리티
 */

import { ERROR_MESSAGES } from '../constants';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * 에러 메시지 추출
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

/**
 * 네트워크 에러 확인
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.toLowerCase().includes('network') || 
           error.message.toLowerCase().includes('fetch');
  }
  return false;
};

/**
 * 에러 로깅
 */
export const logError = (error: unknown, context?: string) => {
  const message = getErrorMessage(error);
  const timestamp = new Date().toISOString();
  
  console.error(`[${timestamp}] ${context || 'Error'}:`, message);
  
  if (error instanceof Error && error.stack) {
    console.error('Stack trace:', error.stack);
  }
};

/**
 * Toast 메시지 표시 (향후 toast 라이브러리 통합)
 */
export const showErrorToast = (error: unknown) => {
  const message = getErrorMessage(error);
  console.error('Error Toast:', message);
  // TODO: 실제 toast 라이브러리 통합
};

/**
 * 안전한 async 함수 실행
 */
export const safeAsync = async <T>(
  fn: () => Promise<T>,
  onError?: (error: unknown) => void
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    logError(error);
    if (onError) {
      onError(error);
    } else {
      showErrorToast(error);
    }
    return null;
  }
};

/**
 * Try-catch 래퍼
 */
export const tryCatch = <T>(
  fn: () => T,
  fallback: T,
  onError?: (error: unknown) => void
): T => {
  try {
    return fn();
  } catch (error) {
    logError(error);
    if (onError) {
      onError(error);
    }
    return fallback;
  }
};

/**
 * 에러 바운더리용 에러 핸들러
 */
export const handleErrorBoundary = (error: Error, errorInfo: React.ErrorInfo) => {
  logError(error, 'ErrorBoundary');
  console.error('Component Stack:', errorInfo.componentStack);
  
  // TODO: 에러 리포팅 서비스로 전송 (Sentry 등)
};

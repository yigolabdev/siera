/**
 * Error Handler
 * 전역 에러 처리 및 로깅 시스템
 */

/**
 * 에러 레벨
 */
export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * 에러 카테고리
 */
export enum ErrorCategory {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  DATABASE = 'database',
  STORAGE = 'storage',
  UNKNOWN = 'unknown',
}

/**
 * 구조화된 에러 타입
 */
export interface StructuredError {
  level: ErrorLevel;
  category: ErrorCategory;
  message: string;
  code?: string;
  timestamp: string;
  userId?: string;
  context?: Record<string, any>;
  stack?: string;
}

/**
 * 에러 핸들러 설정
 */
const ERROR_CONFIG = {
  enableConsoleLog: true,
  enableRemoteLog: false, // 프로덕션에서는 true로 설정
  remoteLogEndpoint: '/api/logs',
  maxStackLength: 500,
};

/**
 * 에러 로그 저장소 (개발 환경용)
 */
const errorLogs: StructuredError[] = [];

/**
 * 에러 로깅
 */
export function logError(
  error: unknown,
  level: ErrorLevel = ErrorLevel.ERROR,
  category: ErrorCategory = ErrorCategory.UNKNOWN,
  context?: Record<string, any>
): void {
  // unknown 타입을 Error | string으로 변환
  let errorMessage: string;
  let errorStack: string | undefined;
  
  if (error instanceof Error) {
    errorMessage = error.message;
    errorStack = error.stack?.slice(0, ERROR_CONFIG.maxStackLength);
  } else if (typeof error === 'string') {
    errorMessage = error;
    errorStack = undefined;
  } else {
    errorMessage = 'Unknown error';
    errorStack = undefined;
  }
  
  const structuredError: StructuredError = {
    level,
    category,
    message: errorMessage,
    timestamp: new Date().toISOString(),
    context,
    stack: errorStack,
  };

  // 로컬 저장 (최대 100개)
  errorLogs.push(structuredError);
  if (errorLogs.length > 100) {
    errorLogs.shift();
  }

  // 콘솔 로그
  if (ERROR_CONFIG.enableConsoleLog) {
    const logFn = level === ErrorLevel.ERROR || level === ErrorLevel.CRITICAL ? console.error : console.warn;
    logFn(`[${level.toUpperCase()}] [${category}]`, structuredError.message, context);
  }

  // 원격 로깅 (프로덕션)
  if (ERROR_CONFIG.enableRemoteLog && level !== ErrorLevel.INFO) {
    sendErrorToRemote(structuredError);
  }
}

/**
 * 원격 로그 전송
 */
async function sendErrorToRemote(error: StructuredError): Promise<void> {
  try {
    await fetch(ERROR_CONFIG.remoteLogEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(error),
    });
  } catch (err) {
    console.error('Failed to send error log to remote:', err);
  }
}

/**
 * Firebase 에러 메시지 변환
 */
export function getFirebaseErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
    'auth/invalid-email': '유효하지 않은 이메일 주소입니다.',
    'auth/operation-not-allowed': '이 작업은 허용되지 않습니다.',
    'auth/weak-password': '비밀번호가 너무 약합니다. (최소 6자 이상)',
    'auth/user-disabled': '비활성화된 계정입니다.',
    'auth/user-not-found': '사용자를 찾을 수 없습니다.',
    'auth/wrong-password': '잘못된 비밀번호입니다.',
    'auth/too-many-requests': '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    'auth/network-request-failed': '네트워크 오류가 발생했습니다.',
    'permission-denied': '권한이 없습니다.',
    'not-found': '데이터를 찾을 수 없습니다.',
    'already-exists': '이미 존재하는 데이터입니다.',
    'resource-exhausted': '할당량을 초과했습니다.',
    'unauthenticated': '인증이 필요합니다.',
    'unavailable': '서비스를 사용할 수 없습니다.',
  };

  return errorMessages[errorCode] || '알 수 없는 오류가 발생했습니다.';
}

/**
 * API 에러 처리
 */
export function handleApiError(error: any): string {
  logError(error, ErrorLevel.ERROR, ErrorCategory.NETWORK, {
    url: error.config?.url,
    method: error.config?.method,
  });

  if (error.response) {
    // 서버 응답이 있는 경우
    const status = error.response.status;
    const message = error.response.data?.message;

    if (status === 401) {
      return '인증이 만료되었습니다. 다시 로그인해주세요.';
    } else if (status === 403) {
      return '접근 권한이 없습니다.';
    } else if (status === 404) {
      return '요청한 리소스를 찾을 수 없습니다.';
    } else if (status === 500) {
      return '서버 오류가 발생했습니다.';
    }

    return message || '요청 처리 중 오류가 발생했습니다.';
  } else if (error.request) {
    // 요청은 보냈지만 응답을 받지 못한 경우
    return '서버와 연결할 수 없습니다. 네트워크를 확인해주세요.';
  }

  // 기타 에러
  return error.message || '알 수 없는 오류가 발생했습니다.';
}

/**
 * 전역 에러 핸들러 설정
 */
export function setupGlobalErrorHandler(): void {
  // 처리되지 않은 Promise 거부
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    logError(
      event.reason,
      ErrorLevel.ERROR,
      ErrorCategory.UNKNOWN,
      { type: 'unhandledrejection' }
    );
  });

  // 처리되지 않은 에러
  window.addEventListener('error', (event) => {
    event.preventDefault();
    logError(
      event.error || event.message,
      ErrorLevel.ERROR,
      ErrorCategory.UNKNOWN,
      {
        type: 'error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    );
  });
}

/**
 * 에러 로그 조회
 */
export function getErrorLogs(level?: ErrorLevel, category?: ErrorCategory): StructuredError[] {
  let logs = [...errorLogs];

  if (level) {
    logs = logs.filter((log) => log.level === level);
  }

  if (category) {
    logs = logs.filter((log) => log.category === category);
  }

  return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/**
 * 에러 로그 클리어
 */
export function clearErrorLogs(): void {
  errorLogs.length = 0;
}

/**
 * 에러 로그 내보내기 (디버깅용)
 */
export function exportErrorLogs(): string {
  return JSON.stringify(errorLogs, null, 2);
}

/**
 * Try-Catch 래퍼
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: any) => void,
  category: ErrorCategory = ErrorCategory.UNKNOWN
): Promise<T | null> {
  try {
    return await fn();
  } catch (error: any) {
    logError(error, ErrorLevel.ERROR, category);
    
    if (errorHandler) {
      errorHandler(error);
    }

    return null;
  }
}

/**
 * 동기 함수용 Try-Catch 래퍼
 */
export function tryCatchSync<T>(
  fn: () => T,
  errorHandler?: (error: any) => void,
  category: ErrorCategory = ErrorCategory.UNKNOWN
): T | null {
  try {
    return fn();
  } catch (error: any) {
    logError(error, ErrorLevel.ERROR, category);
    
    if (errorHandler) {
      errorHandler(error);
    }

    return null;
  }
}

export default {
  logError,
  handleApiError,
  getFirebaseErrorMessage,
  setupGlobalErrorHandler,
  getErrorLogs,
  clearErrorLogs,
  exportErrorLogs,
  tryCatch,
  tryCatchSync,
  ErrorLevel,
  ErrorCategory,
};

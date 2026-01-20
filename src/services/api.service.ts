/**
 * API Service Layer
 * 모든 API 호출을 중앙에서 관리하는 서비스 레이어
 */

import { auth } from '../lib/firebase';

/**
 * API 응답 타입
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API 설정
 */
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

/**
 * 요청 헤더 생성
 */
async function getHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Firebase Auth 토큰 추가
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      const token = await currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }
  }

  return headers;
}

/**
 * HTTP 요청 래퍼 (retry 로직 포함)
 */
async function request<T>(
  url: string,
  options: RequestInit = {},
  attempt = 1
): Promise<ApiResponse<T>> {
  try {
    const headers = await getHeaders();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 응답 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code
      );
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    // Retry 로직
    if (attempt < API_CONFIG.retryAttempts && !error.name?.includes('Abort')) {
      await new Promise((resolve) =>
        setTimeout(resolve, API_CONFIG.retryDelay * attempt)
      );
      return request<T>(url, options, attempt + 1);
    }

    console.error('API Request Error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}

/**
 * GET 요청
 */
export async function get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
  const url = new URL(endpoint, API_CONFIG.baseUrl || window.location.origin);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return request<T>(url.toString(), { method: 'GET' });
}

/**
 * POST 요청
 */
export async function post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  const url = new URL(endpoint, API_CONFIG.baseUrl || window.location.origin);
  
  return request<T>(url.toString(), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT 요청
 */
export async function put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  const url = new URL(endpoint, API_CONFIG.baseUrl || window.location.origin);
  
  return request<T>(url.toString(), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * PATCH 요청
 */
export async function patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  const url = new URL(endpoint, API_CONFIG.baseUrl || window.location.origin);
  
  return request<T>(url.toString(), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE 요청
 */
export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  const url = new URL(endpoint, API_CONFIG.baseUrl || window.location.origin);
  
  return request<T>(url.toString(), { method: 'DELETE' });
}

/**
 * 파일 업로드
 */
export async function uploadFile<T>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<ApiResponse<T>> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const headers = await getHeaders();
    delete (headers as any)['Content-Type']; // Let browser set Content-Type for FormData

    const url = new URL(endpoint, API_CONFIG.baseUrl || window.location.origin);
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(
        `Upload failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error.message || 'File upload failed',
    };
  }
}

/**
 * API 헬스 체크
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await get('/health');
    return response.success;
  } catch {
    return false;
  }
}

export default {
  get,
  post,
  put,
  patch,
  delete: del,
  uploadFile,
  healthCheck,
};

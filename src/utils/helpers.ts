/**
 * 공통 유틸리티 함수
 * 
 * 날짜/통화 포맷팅 함수는 format.ts에 있습니다.
 * 중복을 피하기 위해 format.ts를 import하여 사용하세요.
 */

import type { Difficulty } from '../types';
import { DIFFICULTY_LEVELS } from '../constants';

/**
 * 난이도에 따른 배지 색상 반환
 */
export const getDifficultyColor = (difficulty: Difficulty | string): string => {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.VERY_EASY:
    case '하':
      return 'success';
    case DIFFICULTY_LEVELS.EASY:
    case '중하':
      return 'info';
    case DIFFICULTY_LEVELS.MEDIUM:
    case '중':
      return 'warning';
    case DIFFICULTY_LEVELS.HARD:
    case DIFFICULTY_LEVELS.VERY_HARD:
    case '중상':
    case '상':
      return 'danger';
    default:
      return 'primary';
  }
};

/**
 * 참여율에 따른 배지 색상 반환
 */
export const getAttendanceRateColor = (rate: number): string => {
  if (rate >= 90) return 'success';
  if (rate >= 80) return 'primary';
  if (rate >= 70) return 'warning';
  return 'danger';
};

/**
 * 참여율에 따른 진행바 색상 반환
 */
export const getAttendanceProgressColor = (rate: number): string => {
  if (rate >= 90) return 'bg-success-600';
  if (rate >= 80) return 'bg-primary-600';
  if (rate >= 70) return 'bg-warning-600';
  return 'bg-danger-600';
};

/**
 * 날씨 상태에 따른 아이콘 정보 반환
 */
export const getWeatherInfo = (condition: string) => {
  const weatherMap = {
    sunny: { color: 'text-amber-400', bg: 'bg-amber-50', text: '맑음' },
    cloudy: { color: 'text-slate-400', bg: 'bg-slate-50', text: '흐림' },
    rainy: { color: 'text-blue-500', bg: 'bg-blue-50', text: '비' },
    snowy: { color: 'text-cyan-400', bg: 'bg-cyan-50', text: '눈' },
  };
  
  return weatherMap[condition as keyof typeof weatherMap] || weatherMap.cloudy;
};

/**
 * 배열을 페이지네이션
 */
export const paginateArray = <T,>(array: T[], page: number, itemsPerPage: number): T[] => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array.slice(startIndex, endIndex);
};

/**
 * 총 페이지 수 계산
 */
export const getTotalPages = (totalItems: number, itemsPerPage: number): number => {
  return Math.ceil(totalItems / itemsPerPage);
};

/**
 * 검색어로 객체 필터링
 */
export const filterBySearchTerm = <T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return items;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      return value && String(value).toLowerCase().includes(lowerSearchTerm);
    })
  );
};

/**
 * 배열을 특정 필드로 정렬
 */
export const sortByField = <T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  order: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aString = String(aValue);
    const bString = String(bValue);
    return order === 'asc'
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString);
  });
};

/**
 * 랜덤 ID 생성
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 클립보드에 텍스트 복사
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

/**
 * Debounce 함수
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle 함수
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

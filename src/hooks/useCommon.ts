import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce, filterBySearchTerm, paginateArray, getTotalPages } from '../utils/helpers';
import { TIMING, PAGINATION } from '../constants';

/**
 * 검색 기능을 제공하는 Hook
 */
export function useSearch<T extends Record<string, any>>(
  items: T[],
  searchFields: (keyof T)[],
  debounceTime: number = TIMING.DEBOUNCE_SEARCH
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounced search term update
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [searchTerm, debounceTime]);

  const filteredItems = useMemo(
    () => filterBySearchTerm(items, debouncedSearchTerm, searchFields),
    [items, debouncedSearchTerm, searchFields]
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  };
}

/**
 * 페이지네이션 기능을 제공하는 Hook
 */
export function usePagination<T>(
  items: T[],
  itemsPerPage: number = PAGINATION.DEFAULT_PAGE_SIZE
) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => getTotalPages(items.length, itemsPerPage),
    [items.length, itemsPerPage]
  );

  const paginatedItems = useMemo(
    () => paginateArray(items, currentPage, itemsPerPage),
    [items, currentPage, itemsPerPage]
  );

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

/**
 * 로컬 스토리지 상태 관리 Hook
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

/**
 * 모달 상태 관리 Hook
 */
export function useModal(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

/**
 * 폼 상태 관리 Hook
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit?: (values: T) => void | Promise<void>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setFieldError,
    setValues,
  };
}

/**
 * Toggle 상태 관리 Hook
 */
export function useToggle(initialState: boolean = false) {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => setState(prev => !prev), []);
  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);

  return {
    state,
    toggle,
    setTrue,
    setFalse,
  };
}

/**
 * Debounced 값 Hook
 */
export function useDebounce<T>(value: T, delay: number = TIMING.DEBOUNCE_INPUT): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 클립보드 복사 Hook
 */
export function useClipboard(timeout: number = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), timeout);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      setIsCopied(false);
      return false;
    }
  }, [timeout]);

  return { isCopied, copy };
}

/**
 * 이전 값 추적 Hook
 */
export function usePrevious<T>(value: T): T | undefined {
  const [current, setCurrent] = useState<T>(value);
  const [previous, setPrevious] = useState<T>();

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
}

/**
 * 마운트 상태 확인 Hook
 */
export function useIsMounted(): () => boolean {
  const isMounted = useState(true);

  useEffect(() => {
    return () => {
      isMounted[1](false);
    };
  }, []);

  return () => isMounted[0];
}

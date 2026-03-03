import { useState, useEffect } from 'react';
import { TIMING } from '../constants';

/**
 * 로딩 안전 타임아웃 훅
 *
 * Firestore 등 외부 데이터 로딩이 지정 시간 이상 지속될 때
 * 무한 로딩 상태(빈 페이지)를 방지하기 위해 강제로 로딩을 해제합니다.
 *
 * @param timeoutMs 타임아웃 시간 (기본: TIMING.PAGE_LOADING_TIMEOUT)
 * @param label 디버그용 컴포넌트 식별 라벨
 * @returns timedOut - 타임아웃 발생 여부
 */
export function useLoadingSafetyTimeout(
  timeoutMs: number = TIMING.PAGE_LOADING_TIMEOUT,
  label?: string,
): boolean {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
      if (label) {
        console.warn(`⚠️ ${label} 로딩 타임아웃 (${timeoutMs / 1000}초) - 강제 렌더링`);
      }
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [timeoutMs, label]);

  return timedOut;
}

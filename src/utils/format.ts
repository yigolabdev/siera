/**
 * 날짜 포맷팅 유틸리티
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * 상대적 시간 표시 (예: "2시간 전")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  
  return formatDate(dateString);
};

/**
 * 숫자를 한국 통화 형식으로 포맷팅
 */
export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseInt(amount.replace(/[^0-9]/g, '')) : amount;
  return `₩${numAmount.toLocaleString('ko-KR')}`;
};

/**
 * 전화번호 포맷팅
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * 전화번호 입력 중 자동 하이픈 추가
 * 010-1234-5678, 02-123-4567, 031-123-4567 등 다양한 형식 지원
 */
export const formatPhoneNumberInput = (value: string): string => {
  // 숫자만 추출
  const numbers = value.replace(/\D/g, '');
  
  // 길이에 따라 다른 포맷 적용
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    // 010-1234 or 02-123
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else if (numbers.length <= 10) {
    // 010-1234-567 or 02-123-456
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  } else {
    // 010-1234-5678 (11자리)
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
};

/**
 * 전화번호에서 하이픈 제거 (DB 저장용)
 */
export const removePhoneNumberHyphens = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
};

/**
 * 참석률 계산
 */
export const calculateAttendanceRate = (attended: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((attended / total) * 100);
};

/**
 * D-Day 계산
 */
export const calculateDDay = (targetDate: string): number => {
  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * D-Day 텍스트 생성
 */
export const getDDayText = (targetDate: string): string => {
  const dDay = calculateDDay(targetDate);
  
  if (dDay === 0) return 'D-Day';
  if (dDay > 0) return `D-${dDay}`;
  return `D+${Math.abs(dDay)}`;
};

/**
 * 산행 신청 마감일 계산 (출발일 기준 10일 전)
 */
export const calculateApplicationDeadline = (eventDate: string): Date => {
  const deadline = new Date(eventDate);
  deadline.setDate(deadline.getDate() - 10);
  deadline.setHours(23, 59, 59, 999); // 마감일 23:59:59까지
  return deadline;
};

/**
 * 산행 신청 마감 여부 확인
 */
export const isApplicationClosed = (eventDate: string): boolean => {
  const deadline = calculateApplicationDeadline(eventDate);
  const now = new Date();
  return now > deadline;
};

/**
 * 산행 신청 마감까지 남은 일수
 */
export const getDaysUntilDeadline = (eventDate: string): number => {
  const deadline = calculateApplicationDeadline(eventDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * 산행 신청 마감일 포맷팅
 */
export const formatDeadline = (eventDate: string): string => {
  const deadline = calculateApplicationDeadline(eventDate);
  return deadline.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) + ' 23:59';
};

/**
 * 날짜 범위 포맷팅
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start.toDateString() === end.toDateString()) {
    return formatDate(startDate);
  }
  
  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
};

/**
 * 시간 포맷팅 (HH:MM)
 */
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

/**
 * ISO 날짜를 YYYY-MM-DD 형식으로 변환
 */
export const formatISODate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * 월 포맷팅 (YYYY년 MM월)
 */
export const formatMonth = (month: string): string => {
  const [year, mon] = month.split('-');
  return `${year}년 ${parseInt(mon)}월`;
};

/**
 * 숫자에 천 단위 콤마 추가
 */
export const formatNumber = (num: number | string): string => {
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  return numValue.toLocaleString('ko-KR');
};

/**
 * 퍼센트 포맷팅
 */
export const formatPercentage = (value: number, decimals = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * 텍스트 줄임 (말줄임표)
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * 한국어 조사 선택 (은/는, 이/가, 을/를)
 */
export const getKoreanParticle = (word: string, type: '은는' | '이가' | '을를'): string => {
  if (!word) return '';
  
  const lastChar = word.charCodeAt(word.length - 1);
  const hasJongseong = (lastChar - 0xAC00) % 28 > 0;
  
  const particles = {
    '은는': hasJongseong ? '은' : '는',
    '이가': hasJongseong ? '이' : '가',
    '을를': hasJongseong ? '을' : '를',
  };
  
  return particles[type];
};


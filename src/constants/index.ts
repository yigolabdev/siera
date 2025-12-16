// ==================== App Constants ====================
export const APP_NAME = '시애라';
export const APP_SUBTITLE = '';
export const APP_SLOGAN = '함께 오르는 산, 함께 나누는 가치';

// ==================== Storage Keys ====================
export const STORAGE_KEYS = {
  USER: 'user',
  SAVED_EMAIL: 'savedEmail',
  THEME: 'theme',
} as const;

// ==================== Validation ====================
export const VALIDATION = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_PASSWORD_LENGTH: 8,
  PHONE_PATTERN: /^010-\d{4}-\d{4}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// ==================== UI Constants ====================
export const DIFFICULTY_LABELS = {
  easy: '초급',
  medium: '중급',
  hard: '상급',
} as const;

export const DIFFICULTY_COLORS = {
  easy: {
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
  },
  hard: {
    bg: 'bg-red-100',
    text: 'text-red-800',
  },
} as const;

export const POST_CATEGORY_LABELS = {
  general: '자유',
  info: '정보',
  question: '질문',
} as const;

export const POST_CATEGORY_COLORS = {
  general: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
  },
  info: {
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  question: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
  },
} as const;

export const SCHEDULE_TYPE_LABELS = {
  departure: '출발',
  stop: '정차',
  return: '복귀',
  arrival: '도착',
} as const;

export const PAYMENT_STATUS_LABELS = {
  pending: '납부대기',
  completed: '납부완료',
  failed: '납부실패',
} as const;

export const PAYMENT_STATUS_COLORS = {
  pending: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  failed: {
    bg: 'bg-red-100',
    text: 'text-red-800',
  },
} as const;

// ==================== Routes ====================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  GUEST_APPLICATION: '/guest-application',
  EVENTS: '/events',
  GALLERY: '/gallery',
  INFO: '/info',
  BOARD: '/board',
  MEMBERS: '/members',
  ATTENDANCE: '/attendance',
  PROFILE: '/profile',
  ADMIN: {
    EVENTS: '/admin/events',
    MEMBERS: '/admin/members',
    TEAMS: '/admin/teams',
  },
} as const;


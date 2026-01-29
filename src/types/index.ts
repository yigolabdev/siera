// ==================== User Types ====================
export type UserRole = 'admin' | 'chairman' | 'committee' | 'member' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  birthYear?: string;
  
  // 직장 정보
  company?: string;
  position?: string;  // 직장 직책 (예: "대표이사", "부장" 등)
  occupation?: string; // Deprecated: Use company + position instead
  
  // 시스템 권한 (시애라 클럽 내 역할)
  role: UserRole;  // 'chairman' | 'committee' | 'member' 등
  
  joinDate?: string;
  isApproved: boolean;
  isActive?: boolean;  // 활성화 상태 (기본값: true)
  profileImage?: string;
  bio?: string;
  attendanceRate?: number; // 참여율 (%)
  
  // 추가 필드
  createdAt?: string;
  updatedAt?: string;
  isAuthenticated?: boolean;  // Firebase Auth 연동 여부
  referredBy?: string;  // 추천인
  hikingLevel?: string;  // 산행 능력
}

// Member는 User의 alias
export type Member = User;

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: string;
  birthYear: string;
  company: string;
  position: string;
  referredBy?: string; // 추천인
  hikingLevel?: string; // 산행 능력
  applicationMessage?: string; // 신청 메시지
}

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  birthYear: string;
  company: string;
  position: string;
  occupation?: string; // Deprecated: Use company instead
  referredBy?: string;
  hikingLevel: string;
  applicationMessage?: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  rejectedAt?: string;
}

// ==================== Event Types ====================
export type Difficulty = '하' | '중하' | '중' | '중상' | '상';
export type ScheduleType = 'departure' | 'stop' | 'lunch' | 'networking' | 'return' | 'arrival';

export interface ScheduleItem {
  time: string;
  location: string;
  type: ScheduleType;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  distance: string;
  schedule?: ScheduleItem[];
  difficulty?: Difficulty;
  duration?: string;
}

export interface PaymentInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  deadline?: string;
  managerName: string;
  managerPhone: string;
  cost?: string; // 참가비 (admin에서 사용)
}

export interface EventWeather {
  temperature: number;        // 현재 기온 (°C)
  feelsLike: number;          // 체감 온도 (°C)
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy'; // 날씨 상태
  precipitation: number;      // 강수 확률 (%)
  windSpeed: number;          // 풍속 (m/s)
  humidity: number;           // 습도 (%)
  uvIndex: 'low' | 'moderate' | 'high' | 'very-high'; // UV 지수
  lastUpdated: string;        // 마지막 업데이트 시각 (ISO 8601)
}

export interface HikingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  mountain?: string;
  altitude?: string;
  difficulty: Difficulty;
  description: string;
  maxParticipants: number;
  currentParticipants?: number; // 현재 참여자 수 (계산됨)
  cost: string;
  imageUrl?: string;
  schedule?: ScheduleItem[];
  courses?: Course[];
  teams?: Team[];
  paymentInfo?: PaymentInfo;
  emergencyContactId?: string; // 당일 비상연락처 (운영진 ID)
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  isSpecial?: boolean;
  isPublished?: boolean; // 공개 여부
  isDraft?: boolean; // 임시 저장 여부
  status?: 'draft' | 'open' | 'closed' | 'ongoing' | 'completed'; // 산행 상태
  applicationDeadline?: string; // 신청 마감일 (YYYY-MM-DD)
  createdAt?: string; // 생성일
  isRegistered?: boolean; // 현재 사용자의 신청 여부 (클라이언트 사이드)
  weather?: EventWeather; // 날씨 정보 (하루 1회 업데이트)
}

// ==================== Team Types ====================
export interface TeamMember {
  id: string;
  name: string;
  company: string;
  position?: string; // 직책
  occupation?: string; // Deprecated: Use company instead
  phoneNumber?: string;
  isGuest?: boolean; // 게스트 여부
}

export interface Team {
  id: string;
  eventId: string;
  eventTitle?: string;
  number?: number;
  name: string;
  leaderId: string;
  leaderName: string;
  leaderCompany?: string;
  leaderPosition?: string;
  leaderOccupation?: string; // Deprecated: Use leaderCompany instead
  leaderPhone?: string;
  members: TeamMember[];
}

// ==================== Participation Types ====================
export type ParticipationStatus = 'attending' | 'not-attending' | 'pending' | 'confirmed' | 'cancelled';

export interface EventParticipation {
  eventId: string;
  userId: string;
  status: ParticipationStatus;
  registeredAt: string;
}

export interface Participant {
  id: string;
  eventId?: string;
  memberId?: string;  // members 컬렉션 참조
  name: string;
  email?: string;
  company?: string;
  position?: string;
  occupation?: string; // Deprecated: Use company instead
  phoneNumber?: string;
  status: ParticipationStatus;
}

// ParticipationContext에서 사용하는 상세 참가 정보
export interface Participation {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  isGuest: boolean;
  status: ParticipationStatus;
  registeredAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
  teamId?: string;
  teamName?: string;
  paymentStatus?: 'pending' | 'completed' | 'confirmed' | 'cancelled';
  specialRequirements?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Photo/Gallery Types ====================
export interface Photo {
  id: string;
  eventId: string;
  eventTitle: string;  // 산행 제목
  eventYear: string;   // 연도 (필터링용)
  eventMonth: string;  // 월 (필터링용)
  uploadedBy: string;  // ✅ 표준화: 업로더 ID
  uploadedByName: string;  // ✅ 표준화: 업로더 이름
  uploadedAt: string;
  imageUrl: string;
  title?: string;      // 갤러리 제목 (전체 사진 세트의 제목)
  caption?: string;    // Deprecated: 개별 사진 설명은 사용하지 않음
  likes: number;
  likedBy: string[];  // 좋아요 누른 사용자 ID 목록
}

// ==================== Community Types ====================
export type PostCategory = 'general' | 'info' | 'question' | 'poem';  // poem 추가

export interface Post {
  id: string;
  category: PostCategory;
  title: string;
  author: string;  // ✅ 표준화: 작성자 이름
  authorId: string;  // ✅ 표준화: 작성자 ID
  content: string;
  date: string;  // 표시용 날짜
  views: number;
  comments: number;
  likes: number;
  likedBy: string[];  // 좋아요 누른 사용자 ID 목록
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;  // ✅ 표준화: 댓글 작성자 이름
  authorId: string;  // ✅ 표준화: 작성자 ID
  content: string;
  date: string;  // 표시용 날짜
  likes: number;
  likedBy: string[];  // 좋아요 누른 사용자 ID 목록
  parentId?: string;  // 대댓글용 (optional)
  createdAt: string;
  updatedAt: string;
}

// ==================== Notice Types ====================
export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;  // 표시용 날짜
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== Payment Types ====================
export type PaymentStatus = 'pending' | 'completed' | 'confirmed' | 'failed' | 'cancelled';

export interface Payment {
  id: string;
  participationId?: string; // 참가 신청 ID (연결)
  eventId: string;
  userId: string;
  userName: string;
  isGuest?: boolean;
  company: string;
  position: string;
  occupation?: string; // Deprecated: Use company instead
  phoneNumber: string;
  phone?: string; // Deprecated: Use phoneNumber instead
  email: string;
  applicationDate: string;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  amount: number;
  paymentMethod?: string;
  transactionId?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Attendance Types ====================
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  attendanceStatus: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  recordedBy: string;  // 기록한 관리자 ID
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceStats {
  userId: string;
  userName: string;
  totalEvents: number;
  attended: number;
  absent: number;
  excused: number;
  late: number;
  attendanceRate: number;
}

// ==================== Executive Types ====================
export interface Executive {
  id: string;
  memberId?: string;  // members 컬렉션 참조 (optional for backwards compatibility)
  name: string;
  position: string;  // 시애라 클럽 직책 (예: "회장", "총무" 등)
  phoneNumber: string;  // ✅ 표준화: phone → phoneNumber
  email?: string;
  category: 'chairman' | 'committee';
  company?: string;
  startTerm?: string;  // 임기 시작 (예: "2024-01")
  endTerm?: string;    // 임기 종료 (예: "2026-12")
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Hiking History Types ====================
export interface HikingHistoryItem {
  id: string;
  year: string;
  month: string;
  date: string;
  mountain: string;
  location: string;
  participants: number;
  distance?: string;
  duration?: string;
  difficulty?: Difficulty;
  weather?: string;
  temperature?: string;
  imageUrl?: string;
  isSpecial?: boolean;
  summary?: string;
  photoCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface HikingComment {
  id: string;
  hikeId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Poem Types ====================
export interface Poem {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  content: string;
  month: string;
  createdAt: string;
  updatedAt?: string;
}

// ==================== Guest Application Types ====================
export interface GuestApplication {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;  // ✅ 표준화: phone → phoneNumber
  phone?: string; // Deprecated: Use phoneNumber instead
  company?: string;
  position?: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  referredBy?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

// ==================== Rules Types ====================
export interface RulesAmendment {
  version: string;
  date: string;
  description: string;
}

export interface RulesData {
  id: string;
  content: string;
  version: string;
  effectiveDate: string;
  amendments: RulesAmendment[];
  createdAt: string;
  updatedAt: string;
}

// ==================== Utility Types ====================
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ==================== API Response Types ====================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== Form Types ====================
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export type FormState<T extends Record<string, any>> = {
  [K in keyof T]: FormField;
};

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

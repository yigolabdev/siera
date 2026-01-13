// ==================== User Types ====================
export type UserRole = 'admin' | 'chairman' | 'committee' | 'member' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  occupation?: string;
  position?: string;
  company?: string;
  role: UserRole;
  joinDate?: string;
  isApproved: boolean;
  profileImage?: string;
  bio?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  occupation: string;
  company: string;
}

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  occupation: string;
  company: string;
  referredBy?: string;
  hikingLevel: string;
  applicationMessage?: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// ==================== Event Types ====================
export type Difficulty = '하' | '중하' | '중' | '중상' | '상';
export type ScheduleType = 'departure' | 'stop' | 'return' | 'arrival';

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
  managerName: string;
  managerPhone: string;
}

export interface HikingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  mountain: string;
  altitude?: string;
  difficulty: Difficulty;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  cost: string;
  imageUrl?: string;
  schedule?: ScheduleItem[];
  courses?: Course[];
  teams?: Team[];
  paymentInfo?: PaymentInfo;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  isSpecial?: boolean;
}

// ==================== Team Types ====================
export interface TeamMember {
  id: string;
  name: string;
  occupation: string;
  company: string;
  phone?: string;
  position?: string;
}

export interface Team {
  id: string;
  eventId: string;
  number?: number;
  name: string;
  leaderId: string;
  leaderName: string;
  leaderOccupation: string;
  leaderCompany?: string;
  leaderPosition?: string;
  leaderPhone?: string;
  members: TeamMember[];
}

// ==================== Participation Types ====================
export type ParticipationStatus = 'attending' | 'not-attending' | 'pending' | 'confirmed';

export interface EventParticipation {
  eventId: string;
  userId: string;
  status: ParticipationStatus;
  registeredAt: string;
}

export interface Participant {
  id: string;
  name: string;
  occupation: string;
  phone: string;
  status: ParticipationStatus;
}

// ==================== Gallery Types ====================
export interface Photo {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  imageUrl: string;
  caption: string;
  uploadedAt: string;
  likes: number;
}

// ==================== Community Types ====================
export type PostCategory = 'general' | 'info' | 'question';

export interface Post {
  id: string;
  userId: string;
  author: string;
  title: string;
  content: string;
  category: PostCategory;
  createdAt: string;
  updatedAt: string;
  views: number;
  comments: number;
  likes: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

// ==================== Notice Types ====================
export interface Notice {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== Payment Types ====================
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface Payment {
  id: string;
  userId?: string;
  title: string;
  amount: string;
  purpose?: string;
  status: PaymentStatus;
  paidAt?: string;
  dueDate: string;
  bankInfo?: string;
}

// ==================== Statistics Types ====================
export interface AttendanceStats {
  userId: string;
  userName: string;
  totalEvents: number;
  attended: number;
  attendanceRate: number;
}

// ==================== Executive Types ====================
export interface Executive {
  id: string;
  memberId: string;
  name: string;
  title: string;
  category: 'chairman' | 'committee';
  occupation: string;
  company: string;
  phone: string;
  email: string;
  profileImage?: string;
  bio?: string;
  startTerm: string;
  endTerm: string;
}

// ==================== Poem Types ====================
export interface Poem {
  id: string;
  title: string;
  author: string;
  content: string;
  month: string;
  createdAt: string;
}

// ==================== Guest Application Types ====================
export interface GuestApplication {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  phone: string;
  email: string;
  occupation: string;
  company: string;
  reason: string;
  referredBy?: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
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


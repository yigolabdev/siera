// ==================== User Types ====================
export type UserRole = 'admin' | 'member' | 'guest';

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
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  occupation: string;
  company: string;
}

// ==================== Event Types ====================
export type Difficulty = 'easy' | 'medium' | 'hard';
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
  schedule: ScheduleItem[];
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
  mountain?: string;
  altitude?: string;
  difficulty: Difficulty;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  cost: string;
  imageUrl?: string;
  schedule: ScheduleItem[];
  courses?: Course[];
  teams?: Team[];
  paymentInfo?: PaymentInfo;
}

// ==================== Team Types ====================
export interface TeamMember {
  id: string;
  name: string;
  occupation: string;
  company: string;
}

export interface Team {
  id: string;
  name: string;
  leaderId: string;
  leaderName: string;
  leaderOccupation: string;
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


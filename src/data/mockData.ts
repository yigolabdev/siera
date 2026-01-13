// 중앙화된 Mock 데이터
// 실제 프로덕션에서는 API에서 가져올 데이터

export interface HikingEvent {
  id: string;
  title: string;
  mountain: string;
  date: string;
  location: string;
  altitude?: string;
  difficulty: '하' | '중하' | '중' | '중상' | '상';
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  cost: string;
  imageUrl: string;
  isSpecial?: boolean;
  schedule?: ScheduleItem[];
  courses?: Course[];
  paymentInfo?: PaymentInfo;
}

export interface ScheduleItem {
  time: string;
  location: string;
  type: 'departure' | 'stop' | 'arrival';
}

export interface Course {
  name: string;
  difficulty: string;
  distance: string;
  duration: string;
  description: string;
}

export interface PaymentInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  managerName: string;
  managerPhone: string;
}

export interface Member {
  id: number;
  name: string;
  position: 'chairman' | 'committee' | 'member';
  occupation: string;
  company: string;
  joinDate: string;
  email: string;
  phone: string;
  profileImage: string;
  attendanceRate: number;
  bio: string;
}

export interface Executive {
  id: string;
  name: string;
  title: string;
  occupation: string;
  company: string;
  profileImage: string;
  joinDate: string;
  term: string;
  bio: string;
}

export interface Applicant {
  id: number;
  name: string;
  phone: string;
  email: string;
  course: string;
  paymentStatus: '입금 완료' | '입금 대기';
  appliedAt: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  isPinned: boolean;
  views: number;
}

export interface Post {
  id: number;
  category: 'general' | 'info' | 'question' | 'poem';
  title: string;
  content: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
}

export interface Photo {
  id: string;
  eventTitle: string;
  eventYear: string;
  eventMonth: string;
  uploadedBy: string;
  uploadedAt: string;
  imageUrl: string;
}

export interface HikingHistoryItem {
  id: string;
  year: string;
  month: string;
  date: string;
  mountain: string;
  location: string;
  participants: number;
  distance: string;
  duration: string;
  difficulty: '하' | '중하' | '중' | '중상' | '상';
  weather: string;
  temperature: string;
  image: string;
  isSpecial: boolean;
}

// Mock 데이터
export const mockCurrentEvent: HikingEvent = {
  id: '1',
  title: '앙봉산 정상 등반',
  mountain: '앙봉산',
  date: '2026-01-15',
  location: '경기도 가평군',
  altitude: '737.2m',
  difficulty: '중',
  description: '앙봉산 정상(737.2m)을 목표로 하는 1월 정기 산행입니다.',
  maxParticipants: 25,
  currentParticipants: 18,
  cost: '60,000원',
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
  isSpecial: false,
  schedule: [
    { time: '07:15', location: '종합운동장역 6번 출구 앞 집결 및 출발', type: 'departure' },
    { time: '08:30-13:30', location: '산행코스 (A조)', type: 'stop' },
    { time: '17:00', location: '종합운동장역 복귀', type: 'arrival' },
  ],
  courses: [
    {
      name: 'A코스',
      difficulty: '중',
      distance: '8.5km',
      duration: '5시간 30분',
      description: '정상까지 정규 코스',
    },
    {
      name: 'B코스',
      difficulty: '중하',
      distance: '6.2km',
      duration: '4시간',
      description: '완만한 능선 코스',
    },
  ],
  paymentInfo: {
    bankName: '국민은행',
    accountNumber: '123-456-789012',
    accountHolder: '시애라',
    managerName: '김산행',
    managerPhone: '010-1234-5678',
  },
};

export const mockMembers: Member[] = [
  {
    id: 1,
    name: '김대한',
    position: 'chairman',
    occupation: '회장',
    company: '○○그룹',
    joinDate: '2020-01-15',
    email: 'kim.daehan@example.com',
    phone: '010-1234-5678',
    profileImage: 'https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?w=400&h=400&fit=crop',
    attendanceRate: 95,
    bio: '○○그룹 회장으로 재직 중이며, 시애라 창립 멤버입니다.',
  },
  {
    id: 2,
    name: '이민국',
    position: 'committee',
    occupation: '대표이사',
    company: '△△건설',
    joinDate: '2020-03-20',
    email: 'lee.minguk@example.com',
    phone: '010-2345-6789',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    attendanceRate: 88,
    bio: '△△건설 대표이사로 건설 업계 30년 경력의 베테랑입니다.',
  },
  // 추가 회원 데이터는 필요시 여기에 추가
];

export const mockExecutives: Executive[] = [
  {
    id: 'exec-1',
    name: '김대한',
    title: '회장',
    occupation: '○○그룹 회장',
    company: '○○그룹',
    profileImage: 'https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?w=400&h=400&fit=crop',
    joinDate: '2020-01-15',
    term: '2024-2026',
    bio: '○○그룹 회장으로 재직 중이며, 시애라 창립 멤버입니다.',
  },
  {
    id: 'exec-2',
    name: '이민국',
    title: '부회장',
    occupation: '△△건설 대표이사',
    company: '△△건설',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    joinDate: '2020-03-20',
    term: '2024-2026',
    bio: '△△건설 대표이사로 건설 업계 30년 경력의 베테랑입니다.',
  },
  {
    id: 'exec-3',
    name: '박세계',
    title: '감사',
    occupation: '□□금융 부사장',
    company: '□□금융',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    joinDate: '2020-06-10',
    term: '2024-2026',
    bio: '□□금융 부사장으로 금융 전문가입니다.',
  },
  {
    id: 'exec-4',
    name: '최우주',
    title: '재무',
    occupation: '◇◇제약 전무이사',
    company: '◇◇제약',
    profileImage: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=400&fit=crop',
    joinDate: '2021-01-05',
    term: '2024-2026',
    bio: '◇◇제약 전무이사로 바이오 산업을 선도하고 있습니다.',
  },
];

// 날씨 정보 (기상청 API 연동 예정)
export interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  precipitation: number;
  windSpeed: number;
  humidity: number;
  uvIndex: 'low' | 'moderate' | 'high' | 'very-high';
}

export const mockWeatherData: WeatherData = {
  temperature: 8,
  feelsLike: 5,
  condition: 'cloudy',
  precipitation: 20,
  windSpeed: 3.5,
  humidity: 65,
  uvIndex: 'moderate',
};

// 앱 설정 정보
export interface AppConfig {
  clubName: string;
  clubNameKanji: string;
  foundedYear: string;
  contactEmail: string;
  contactPhone: string;
  defaultEventCost: string;
  annualMembershipFee: string;
}

export const appConfig: AppConfig = {
  clubName: '시애라',
  clubNameKanji: '詩愛羅',
  foundedYear: '2020',
  contactEmail: 'contact@sierra.com',
  contactPhone: '010-1234-5678',
  defaultEventCost: '60,000원',
  annualMembershipFee: '120,000원',
};

// 통계 계산 함수들
export const calculateStats = {
  // 총 회원 수
  getTotalMembers: (members: Member[]) => members.length,
  
  // 활성 회원 수
  getActiveMembers: (members: Member[]) => 
    members.filter(m => m.attendanceRate > 0).length,
  
  // 평균 참여율
  getAverageAttendanceRate: (members: Member[]) => {
    if (members.length === 0) return 0;
    const sum = members.reduce((acc, m) => acc + m.attendanceRate, 0);
    return Math.round(sum / members.length);
  },
  
  // 직급별 회원 수
  getMembersByPosition: (members: Member[], position: 'chairman' | 'committee' | 'member') =>
    members.filter(m => m.position === position).length,
};


import { HikingEvent, Participant } from '../types';

// Mock 신청자 데이터
export const mockParticipants: Record<string, Participant[]> = {
  '1': [
    {
      id: '1',
      name: '홍길동',
      occupation: '○○그룹',
      phone: '010-1234-5678',
      status: 'confirmed',
    },
    {
      id: '2',
      name: '김산행',
      occupation: '○○그룹',
      phone: '010-2345-6789',
      status: 'confirmed',
    },
    {
      id: '3',
      name: '이등산',
      occupation: '△△건설',
      phone: '010-3456-7890',
      status: 'confirmed',
    },
    {
      id: '4',
      name: '박트레킹',
      occupation: '□□금융',
      phone: '010-4567-8901',
      status: 'confirmed',
    },
    {
      id: '5',
      name: '최하이킹',
      occupation: '◇◇제약',
      phone: '010-5678-9012',
      status: 'confirmed',
    },
    {
      id: '6',
      name: '정봉우리',
      occupation: '☆☆병원',
      phone: '010-6789-0123',
      status: 'confirmed',
    },
    {
      id: '7',
      name: '홍정상',
      occupation: '※※법률사무소',
      phone: '010-7890-1234',
      status: 'confirmed',
    },
    {
      id: '8',
      name: '강백운',
      occupation: '◎◎IT',
      phone: '010-8901-2345',
      status: 'confirmed',
    },
    {
      id: '9',
      name: '윤설악',
      occupation: '▽▽건축',
      phone: '010-9012-3456',
      status: 'confirmed',
    },
    {
      id: '10',
      name: '임지리',
      occupation: '★★무역',
      phone: '010-0123-4567',
      status: 'confirmed',
    },
    {
      id: '11',
      name: '조한라',
      occupation: '◆◆투자',
      phone: '010-1111-2222',
      status: 'confirmed',
    },
    {
      id: '12',
      name: '문북한',
      occupation: '◈◈컨설팅',
      phone: '010-2222-3333',
      status: 'confirmed',
    },
    {
      id: '13',
      name: '신계룡',
      occupation: '▲▲물류',
      phone: '010-3333-4444',
      status: 'confirmed',
    },
    {
      id: '14',
      name: '장태백',
      occupation: '▼▼제조',
      phone: '010-4444-5555',
      status: 'confirmed',
    },
    {
      id: '15',
      name: '권덕유',
      occupation: '◐◐통신',
      phone: '010-5555-6666',
      status: 'confirmed',
    },
    {
      id: '16',
      name: '서오대',
      occupation: '◑◑교육',
      phone: '010-6666-7777',
      status: 'pending',
    },
    {
      id: '17',
      name: '오속리',
      occupation: '◒◒인프라',
      phone: '010-7777-8888',
      status: 'pending',
    },
    {
      id: '18',
      name: '배치악',
      occupation: '◓◓미디어',
      phone: '010-8888-9999',
      status: 'pending',
    },
  ],
};

export const mockEvents: HikingEvent[] = [
  {
    id: '1',
    title: '북한산 백운대 등반',
    date: '2026-02-15',
    location: '북한산 국립공원',
    mountain: '앙봉산',
    altitude: '737.2m',
    difficulty: '중',
    description: '백운대 정상을 목표로 하는 1월 정기 산행입니다.',
    maxParticipants: 25,
    currentParticipants: 15,
    cost: '60,000원',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    paymentInfo: {
      bankName: '국민은행',
      accountNumber: '123-456-789012',
      accountHolder: '시애라',
      managerName: '김산행',
      managerPhone: '010-1234-5678',
    },
    schedule: [
      { time: '07:15', location: '종합운동장역 6번 출구 앞 집결 및 출발', type: 'departure' },
      { time: '08:30-13:30', location: '산행코스 (A조)', type: 'stop' },
      { time: '17:00', location: '종합운동장역 복귀', type: 'arrival' },
    ],
    courses: [
      {
        id: 'course-a',
        name: 'A조',
        description: '한국APT - 약수터 - 성당칼림길 - 능선길 - 무적고개칼림길 - 왕산사칼림길 - 팔각정 - 정상(737.2m) - 팔각정 - 왕산사칼림길 - 왕산사(약 8.5킬로)',
        distance: '약 8.5킬로',
        schedule: [
          { time: '08:30', location: '한국APT 출발', type: 'departure' },
          { time: '09:00', location: '약수터', type: 'stop' },
          { time: '10:00', location: '성당칼림길', type: 'stop' },
          { time: '11:00', location: '능선길', type: 'stop' },
          { time: '12:00', location: '정상 (737.2m)', type: 'stop' },
          { time: '13:30', location: '왕산사 도착', type: 'arrival' },
        ],
      },
      {
        id: 'course-b',
        name: 'B조',
        description: '왕산사 - 관문봉칼림길 - 팔각정 - 정상(737.2m) - 팔각정 - 왕산사칼림길 - 왕산사(약 4.2킬로)',
        distance: '약 4.2킬로',
        schedule: [
          { time: '08:30', location: '왕산사 출발', type: 'departure' },
          { time: '09:30', location: '관문봉칼림길', type: 'stop' },
          { time: '10:30', location: '팔각정', type: 'stop' },
          { time: '11:30', location: '정상 (737.2m)', type: 'stop' },
          { time: '13:00', location: '왕산사 도착', type: 'arrival' },
        ],
      },
    ],
  },
];

export const mockPastEvents = [
  {
    id: 'past-1',
    title: '설악산 대청봉 등반',
    date: '2025-12-15',
    participants: 22,
  },
  {
    id: 'past-2',
    title: '지리산 노고단 산행',
    date: '2025-11-20',
    participants: 25,
  },
  {
    id: 'past-3',
    title: '북한산 백운대 등반',
    date: '2025-10-18',
    participants: 20,
  },
];


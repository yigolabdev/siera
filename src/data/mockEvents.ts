import { HikingEvent } from '../types';

export const mockEvents: HikingEvent[] = [
  {
    id: '1',
    title: '북한산 백운대 등반',
    date: '2026-01-15',
    location: '북한산 국립공원',
    mountain: '앙봉산',
    altitude: '737.2m',
    difficulty: 'medium',
    description: '백운대 정상을 목표로 하는 1월 정기 산행입니다.',
    maxParticipants: 25,
    currentParticipants: 18,
    cost: '60,000원',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
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


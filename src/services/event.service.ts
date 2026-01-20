/**
 * Event Service
 * 산행 이벤트 관련 API 서비스
 */

import { HikingEvent, Participant } from '../types';
import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
} from '../lib/firebase/firestore';
import { where, orderBy } from 'firebase/firestore';

const COLLECTION_NAME = 'events';
const PARTICIPANTS_COLLECTION = 'participants';

/**
 * 모든 산행 조회
 */
export async function getAllEvents(): Promise<HikingEvent[]> {
  const result = await getDocuments<HikingEvent>(COLLECTION_NAME, [
    orderBy('date', 'desc'),
  ]);

  if (result.success && result.data) {
    return result.data;
  }

  return [];
}

/**
 * 다가오는 산행 조회
 */
export async function getUpcomingEvents(): Promise<HikingEvent[]> {
  const today = new Date().toISOString().split('T')[0];
  
  const result = await queryDocuments<HikingEvent>(
    COLLECTION_NAME,
    [{ field: 'date', operator: '>=', value: today }],
    'date',
    'asc'
  );

  if (result.success && result.data) {
    return result.data;
  }

  return [];
}

/**
 * 현재 진행 중인 산행 조회 (가장 가까운 미래 산행)
 */
export async function getCurrentEvent(): Promise<HikingEvent | null> {
  const upcomingEvents = await getUpcomingEvents();
  
  if (upcomingEvents.length > 0) {
    return upcomingEvents[0];
  }

  return null;
}

/**
 * 과거 산행 조회
 */
export async function getPastEvents(): Promise<HikingEvent[]> {
  const today = new Date().toISOString().split('T')[0];
  
  const result = await queryDocuments<HikingEvent>(
    COLLECTION_NAME,
    [{ field: 'date', operator: '<', value: today }],
    'date',
    'desc'
  );

  if (result.success && result.data) {
    return result.data;
  }

  return [];
}

/**
 * 산행 ID로 조회
 */
export async function getEventById(eventId: string): Promise<HikingEvent | null> {
  const result = await getDocument<HikingEvent>(COLLECTION_NAME, eventId);

  if (result.success && result.data) {
    return result.data;
  }

  return null;
}

/**
 * 산행 추가
 */
export async function addEvent(event: Omit<HikingEvent, 'id'>): Promise<{ success: boolean; id?: string; error?: string }> {
  return await createDocument(COLLECTION_NAME, event);
}

/**
 * 산행 업데이트
 */
export async function updateEvent(
  eventId: string,
  updates: Partial<HikingEvent>
): Promise<{ success: boolean; error?: string }> {
  return await updateDocument(COLLECTION_NAME, eventId, updates);
}

/**
 * 산행 삭제
 */
export async function deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
  // 관련 참석자 데이터도 함께 삭제
  const participants = await getEventParticipants(eventId);
  
  for (const participant of participants) {
    if (participant.id) {
      await deleteDocument(PARTICIPANTS_COLLECTION, participant.id);
    }
  }

  return await deleteDocument(COLLECTION_NAME, eventId);
}

/**
 * 산행 참석자 조회
 */
export async function getEventParticipants(eventId: string): Promise<Participant[]> {
  const result = await queryDocuments<Participant>(
    PARTICIPANTS_COLLECTION,
    [{ field: 'eventId', operator: '==', value: eventId }],
    'createdAt',
    'asc'
  );

  if (result.success && result.data) {
    return result.data;
  }

  return [];
}

/**
 * 참석자 추가
 */
export async function addParticipant(
  eventId: string,
  participant: Omit<Participant, 'id' | 'eventId'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  return await createDocument(PARTICIPANTS_COLLECTION, {
    ...participant,
    eventId,
  });
}

/**
 * 참석자 상태 업데이트
 */
export async function updateParticipantStatus(
  participantId: string,
  status: 'attending' | 'absent' | 'pending'
): Promise<{ success: boolean; error?: string }> {
  return await updateDocument(PARTICIPANTS_COLLECTION, participantId, {
    status,
  });
}

/**
 * 참석자 삭제
 */
export async function removeParticipant(participantId: string): Promise<{ success: boolean; error?: string }> {
  return await deleteDocument(PARTICIPANTS_COLLECTION, participantId);
}

/**
 * 회원의 참석 이력 조회
 */
export async function getMemberAttendanceHistory(memberId: string): Promise<{
  events: HikingEvent[];
  totalEvents: number;
  attendedEvents: number;
  attendanceRate: number;
}> {
  // 회원이 참석한 이벤트 ID 가져오기
  const participantResult = await queryDocuments<Participant>(
    PARTICIPANTS_COLLECTION,
    [
      { field: 'memberId', operator: '==', value: memberId },
      { field: 'status', operator: '==', value: 'attending' },
    ]
  );

  if (!participantResult.success || !participantResult.data) {
    return {
      events: [],
      totalEvents: 0,
      attendedEvents: 0,
      attendanceRate: 0,
    };
  }

  const eventIds = participantResult.data.map((p) => p.eventId);
  const events: HikingEvent[] = [];

  // 각 이벤트 정보 가져오기
  for (const eventId of eventIds) {
    const event = await getEventById(eventId);
    if (event) {
      events.push(event);
    }
  }

  const totalEvents = (await getPastEvents()).length;
  const attendedEvents = events.length;
  const attendanceRate = totalEvents > 0 
    ? Math.round((attendedEvents / totalEvents) * 100) 
    : 0;

  return {
    events: events.sort((a, b) => b.date.localeCompare(a.date)),
    totalEvents,
    attendedEvents,
    attendanceRate,
  };
}

/**
 * 산행 통계 조회
 */
export async function getEventStats(): Promise<{
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  averageParticipants: number;
}> {
  const allEvents = await getAllEvents();
  const upcoming = await getUpcomingEvents();
  const past = await getPastEvents();

  let totalParticipants = 0;
  for (const event of allEvents) {
    const participants = await getEventParticipants(event.id!);
    totalParticipants += participants.length;
  }

  const averageParticipants = allEvents.length > 0 
    ? Math.round(totalParticipants / allEvents.length) 
    : 0;

  return {
    totalEvents: allEvents.length,
    upcomingEvents: upcoming.length,
    pastEvents: past.length,
    averageParticipants,
  };
}

export default {
  getAllEvents,
  getUpcomingEvents,
  getCurrentEvent,
  getPastEvents,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent,
  getEventParticipants,
  addParticipant,
  updateParticipantStatus,
  removeParticipant,
  getMemberAttendanceHistory,
  getEventStats,
};

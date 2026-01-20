import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { HikingEvent, Participant } from '../types';
import { mockEvents, mockParticipants } from '../data/mockEvents';
import { getDocuments, setDocument, updateDocument as firestoreUpdate, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';

// 조 편성 타입 정의
export interface TeamMember {
  id: string;
  name: string;
  phone: string;
  company: string;
}

export interface Team {
  id: string;
  eventId: string;
  number: number;
  name: string;
  leaderId: string;
  leaderName: string;
  leaderPhone: string;
  leaderCompany: string;
  members: TeamMember[];
}

interface EventContextType {
  events: HikingEvent[];
  currentEvent: HikingEvent | null;
  specialEvent: HikingEvent | null; // 특별 산행 추가
  participants: Record<string, Participant[]>;
  teams: Record<string, Team[]>; // eventId를 키로 하는 조 편성 데이터
  isLoading: boolean;
  error: string | null;
  addEvent: (event: HikingEvent) => Promise<void>;
  updateEvent: (id: string, event: Partial<HikingEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventById: (id: string) => HikingEvent | undefined;
  getParticipantsByEventId: (eventId: string) => Participant[];
  addParticipant: (eventId: string, participant: Participant) => Promise<void>;
  updateParticipantStatus: (eventId: string, participantId: string, status: 'confirmed' | 'pending') => Promise<void>;
  getTeamsByEventId: (eventId: string) => Team[];
  setTeamsForEvent: (eventId: string, teams: Team[]) => Promise<void>;
  refreshEvents: () => Promise<void>;
  refreshParticipants: (eventId: string) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<HikingEvent[]>([]);
  const [participants, setParticipants] = useState<Record<string, Participant[]>>({});
  const [teams, setTeams] = useState<Record<string, Team[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFirebase, setUseFirebase] = useState(false); // Firebase 사용 여부
  
  // Firebase 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);
  
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Firebase에서 이벤트 로드 시도
      const eventsResult = await getDocuments<HikingEvent>('events');
      
      if (eventsResult.success && eventsResult.data && eventsResult.data.length > 0) {
        // Firebase 데이터 사용
        setEvents(eventsResult.data);
        setUseFirebase(true);
        console.log('✅ Firebase에서 이벤트 데이터 로드:', eventsResult.data.length);
        
        // Firebase에서 조편성 데이터 로드
        const teamsResult = await getDocuments<Team>('teams');
        if (teamsResult.success && teamsResult.data) {
          // eventId별로 그룹화
          const teamsByEvent: Record<string, Team[]> = {};
          teamsResult.data.forEach(team => {
            if (!teamsByEvent[team.eventId]) {
              teamsByEvent[team.eventId] = [];
            }
            teamsByEvent[team.eventId].push(team);
          });
          setTeams(teamsByEvent);
          console.log('✅ Firebase에서 조편성 데이터 로드:', teamsResult.data.length);
        }
      } else {
        // Mock 데이터 사용 (Fallback)
        setEvents(mockEvents);
        setParticipants(mockParticipants);
        setUseFirebase(false);
        console.log('ℹ️ Mock 데이터 사용 (Firebase 데이터 없음)');
      }
    } catch (err: any) {
      console.warn('⚠️ Firebase 로드 실패, Mock 데이터 사용:', err.message);
      setEvents(mockEvents);
      setParticipants(mockParticipants);
      setUseFirebase(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 현재 진행 중인 이벤트 (가장 가까운 미래 이벤트) - useMemo로 최적화
  const currentEvent = useMemo(() => {
    const event = events
      .filter(event => new Date(event.date) >= new Date() && !event.isSpecial)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
    
    if (event) {
      // currentParticipants 동적 계산
      const participantCount = participants[event.id]?.length || 0;
      return {
        ...event,
        currentParticipants: participantCount
      };
    }
    return null;
  }, [events, participants]);

  // 특별 산행 (isSpecial이 true이고 가장 가까운 미래 이벤트)
  const specialEvent = useMemo(() => {
    const event = events
      .filter(event => new Date(event.date) >= new Date() && event.isSpecial === true)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
    
    if (event) {
      // currentParticipants 동적 계산
      const participantCount = participants[event.id]?.length || 0;
      return {
        ...event,
        currentParticipants: participantCount
      };
    }
    return null;
  }, [events, participants]);

  const addEvent = useCallback(async (event: HikingEvent) => {
    try {
      if (useFirebase) {
        const result = await setDocument('events', event.id, event);
        if (result.success) {
          setEvents(prev => [...prev, event]);
        } else {
          throw new Error(result.error || '이벤트 추가 실패');
        }
      } else {
        setEvents(prev => [...prev, event]);
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { eventId: event.id });
      throw err;
    }
  }, [useFirebase]);

  const updateEvent = useCallback(async (id: string, updatedEvent: Partial<HikingEvent>) => {
    try {
      if (useFirebase) {
        const result = await firestoreUpdate('events', id, updatedEvent);
        if (result.success) {
          setEvents(prev => prev.map(event => 
            event.id === id ? { ...event, ...updatedEvent } : event
          ));
        } else {
          throw new Error(result.error || '이벤트 수정 실패');
        }
      } else {
        setEvents(prev => prev.map(event => 
          event.id === id ? { ...event, ...updatedEvent } : event
        ));
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { eventId: id });
      throw err;
    }
  }, [useFirebase]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      if (useFirebase) {
        const result = await deleteDocument('events', id);
        if (result.success) {
          setEvents(prev => prev.filter(event => event.id !== id));
        } else {
          throw new Error(result.error || '이벤트 삭제 실패');
        }
      } else {
        setEvents(prev => prev.filter(event => event.id !== id));
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { eventId: id });
      throw err;
    }
  }, [useFirebase]);

  const getEventById = useCallback((id: string) => {
    const event = events.find(event => event.id === id);
    if (event) {
      // currentParticipants 동적 계산
      const participantCount = participants[id]?.length || 0;
      return {
        ...event,
        currentParticipants: participantCount
      };
    }
    return undefined;
  }, [events, participants]);

  const getParticipantsByEventId = useCallback((eventId: string) => {
    return participants[eventId] || [];
  }, [participants]);

  const addParticipant = useCallback(async (eventId: string, participant: Participant) => {
    try {
      if (useFirebase) {
        const participantData = {
          ...participant,
          eventId,
          createdAt: new Date().toISOString(),
        };
        const result = await setDocument('participants', participant.id, participantData);
        if (result.success) {
          setParticipants(prev => ({
            ...prev,
            [eventId]: [...(prev[eventId] || []), participant],
          }));
          
          // 이벤트의 currentParticipants 업데이트
          setEvents(prev => prev.map(event => 
            event.id === eventId 
              ? { ...event, currentParticipants: (event.currentParticipants || 0) + 1 }
              : event
          ));
        } else {
          throw new Error(result.error || '참석자 추가 실패');
        }
      } else {
        setParticipants(prev => ({
          ...prev,
          [eventId]: [...(prev[eventId] || []), participant],
        }));
        
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, currentParticipants: (event.currentParticipants || 0) + 1 }
            : event
        ));
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { eventId, participantId: participant.id });
      throw err;
    }
  }, [useFirebase]);

  const updateParticipantStatus = useCallback(async (eventId: string, participantId: string, status: 'confirmed' | 'pending') => {
    try {
      if (useFirebase) {
        const result = await firestoreUpdate('participants', participantId, { status });
        if (result.success) {
          setParticipants(prev => ({
            ...prev,
            [eventId]: (prev[eventId] || []).map(p => 
              p.id === participantId ? { ...p, status } : p
            ),
          }));
        } else {
          throw new Error(result.error || '참석자 상태 수정 실패');
        }
      } else {
        setParticipants(prev => ({
          ...prev,
          [eventId]: (prev[eventId] || []).map(p => 
            p.id === participantId ? { ...p, status } : p
          ),
        }));
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { eventId, participantId });
      throw err;
    }
  }, [useFirebase]);

  // 조 편성 관련 함수
  const getTeamsByEventId = useCallback((eventId: string) => {
    return teams[eventId] || [];
  }, [teams]);

  const setTeamsForEvent = useCallback(async (eventId: string, eventTeams: Team[]) => {
    try {
      if (useFirebase) {
        // Firebase에 조 편성 데이터 저장
        // 각 팀을 개별 문서로 저장
        const promises = eventTeams.map(team => 
          setDocument('teams', team.id, { ...team, eventId })
        );
        await Promise.all(promises);
      }
      
      setTeams(prev => ({
        ...prev,
        [eventId]: eventTeams,
      }));
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { eventId });
      throw err;
    }
  }, [useFirebase]);
  
  // 이벤트 새로고침
  const refreshEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getDocuments<HikingEvent>('events');
      if (result.success && result.data) {
        setEvents(result.data);
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 참석자 새로고침
  const refreshParticipants = useCallback(async (eventId: string) => {
    try {
      const result = await getDocuments<Participant & { eventId: string }>('participants');
      if (result.success && result.data) {
        const eventParticipants = result.data.filter(p => p.eventId === eventId);
        setParticipants(prev => ({
          ...prev,
          [eventId]: eventParticipants,
        }));
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { eventId });
    }
  }, []);

  // Context value를 useMemo로 메모이제이션
  const value = useMemo(() => ({
    events,
    currentEvent,
    specialEvent, // 특별 산행 추가
    participants,
    teams,
    isLoading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getParticipantsByEventId,
    addParticipant,
    updateParticipantStatus,
    getTeamsByEventId,
    setTeamsForEvent,
    refreshEvents,
    refreshParticipants,
  }), [
    events,
    currentEvent,
    specialEvent, // 의존성 추가
    participants,
    teams,
    isLoading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getParticipantsByEventId,
    addParticipant,
    updateParticipantStatus,
    getTeamsByEventId,
    setTeamsForEvent,
    refreshEvents,
    refreshParticipants,
  ]);

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

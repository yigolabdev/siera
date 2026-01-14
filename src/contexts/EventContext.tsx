import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { HikingEvent } from '../data/mockData';
import { mockEvents, mockParticipants } from '../data/mockEvents';
import { Participant } from '../types';

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
  addEvent: (event: HikingEvent) => void;
  updateEvent: (id: string, event: Partial<HikingEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => HikingEvent | undefined;
  getParticipantsByEventId: (eventId: string) => Participant[];
  addParticipant: (eventId: string, participant: Participant) => void;
  updateParticipantStatus: (eventId: string, participantId: string, status: 'confirmed' | 'pending') => void;
  getTeamsByEventId: (eventId: string) => Team[];
  setTeamsForEvent: (eventId: string, teams: Team[]) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<HikingEvent[]>(mockEvents);
  const [participants, setParticipants] = useState<Record<string, Participant[]>>(mockParticipants);
  const [teams, setTeams] = useState<Record<string, Team[]>>({});
  
  // 현재 진행 중인 이벤트 (가장 가까운 미래 이벤트) - useMemo로 최적화
  const currentEvent = useMemo(() => {
    return events
      .filter(event => new Date(event.date) >= new Date() && !event.isSpecial)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
  }, [events]);

  // 특별 산행 (isSpecial이 true이고 가장 가까운 미래 이벤트)
  const specialEvent = useMemo(() => {
    return events
      .filter(event => new Date(event.date) >= new Date() && event.isSpecial === true)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
  }, [events]);

  const addEvent = useCallback((event: HikingEvent) => {
    setEvents(prev => [...prev, event]);
  }, []);

  const updateEvent = useCallback((id: string, updatedEvent: Partial<HikingEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    ));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  const getEventById = useCallback((id: string) => {
    return events.find(event => event.id === id);
  }, [events]);

  const getParticipantsByEventId = useCallback((eventId: string) => {
    return participants[eventId] || [];
  }, [participants]);

  const addParticipant = useCallback((eventId: string, participant: Participant) => {
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
  }, []);

  const updateParticipantStatus = useCallback((eventId: string, participantId: string, status: 'confirmed' | 'pending') => {
    setParticipants(prev => ({
      ...prev,
      [eventId]: (prev[eventId] || []).map(p => 
        p.id === participantId ? { ...p, status } : p
      ),
    }));
  }, []);

  // 조 편성 관련 함수
  const getTeamsByEventId = useCallback((eventId: string) => {
    return teams[eventId] || [];
  }, [teams]);

  const setTeamsForEvent = useCallback((eventId: string, eventTeams: Team[]) => {
    setTeams(prev => ({
      ...prev,
      [eventId]: eventTeams,
    }));
  }, []);

  // Context value를 useMemo로 메모이제이션
  const value = useMemo(() => ({
    events,
    currentEvent,
    specialEvent, // 특별 산행 추가
    participants,
    teams,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getParticipantsByEventId,
    addParticipant,
    updateParticipantStatus,
    getTeamsByEventId,
    setTeamsForEvent,
  }), [
    events,
    currentEvent,
    specialEvent, // 의존성 추가
    participants,
    teams,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getParticipantsByEventId,
    addParticipant,
    updateParticipantStatus,
    getTeamsByEventId,
    setTeamsForEvent,
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

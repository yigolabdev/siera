import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { getDocuments, setDocument, updateDocument as firestoreUpdate, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';

export interface Participation {
  id: string;
  eventId: string; // 어떤 산행인지
  userId: string; // 참가한 사용자 ID
  userName: string;
  userEmail: string;
  isGuest: boolean;
  status: 'attending' | 'not-attending' | 'pending' | 'cancelled';
  registeredAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
  teamId?: string; // 배정된 조 ID
  teamName?: string; // 배정된 조 이름
  paymentStatus?: 'completed' | 'pending' | 'confirmed';
  specialRequirements?: string; // 특별 요청사항
  createdAt: string;
  updatedAt: string;
}

interface ParticipationContextType {
  participations: Participation[];
  isLoading: boolean;
  error: string | null;
  addParticipation: (participation: Omit<Participation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateParticipation: (id: string, participation: Partial<Participation>) => Promise<void>;
  deleteParticipation: (id: string) => Promise<void>;
  getParticipationById: (id: string) => Participation | undefined;
  getParticipationsByEvent: (eventId: string) => Participation[];
  getParticipationsByUser: (userId: string) => Participation[];
  getUserParticipationForEvent: (userId: string, eventId: string) => Participation | undefined;
  registerForEvent: (eventId: string, userId: string, userName: string, userEmail: string, isGuest?: boolean) => Promise<void>;
  cancelParticipation: (id: string, reason?: string) => Promise<void>;
  updateParticipationStatus: (id: string, status: Participation['status']) => Promise<void>;
  assignTeam: (id: string, teamId: string, teamName: string) => Promise<void>;
  refreshParticipations: () => Promise<void>;
}

const ParticipationContext = createContext<ParticipationContextType | undefined>(undefined);

export const ParticipationProvider = ({ children }: { children: ReactNode }) => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Firebase 초기 데이터 로드
  useEffect(() => {
    loadParticipations();
  }, []);
  
  const loadParticipations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getDocuments<Participation>('participations');
      
      if (result.success && result.data) {
        setParticipations(result.data);
        console.log('✅ Firebase에서 참가 데이터 로드:', result.data.length);
      } else {
        setParticipations([]);
        console.log('ℹ️ Firebase에서 로드된 참가 데이터가 없습니다.');
      }
    } catch (err: any) {
      console.error('❌ Firebase 참가 데이터 로드 실패:', err.message);
      setError(err.message);
      setParticipations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addParticipation = useCallback(async (participationData: Omit<Participation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = `participation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      const participation: Participation = {
        ...participationData,
        id,
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await setDocument('participations', id, participation);
      if (result.success) {
        setParticipations(prev => [...prev, participation]);
        console.log('✅ 참가 신청 추가 성공:', id);
      } else {
        throw new Error(result.error || '참가 신청 추가 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { participation: participationData });
      throw err;
    }
  }, []);

  const updateParticipation = useCallback(async (id: string, updatedParticipation: Partial<Participation>) => {
    try {
      const updateData = {
        ...updatedParticipation,
        updatedAt: new Date().toISOString(),
      };
      
      const result = await firestoreUpdate('participations', id, updateData);
      if (result.success) {
        setParticipations(prev => prev.map(participation => 
          participation.id === id ? { ...participation, ...updateData } : participation
        ));
        console.log('✅ 참가 신청 수정 성공:', id);
      } else {
        throw new Error(result.error || '참가 신청 수정 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { participationId: id });
      throw err;
    }
  }, []);

  const deleteParticipation = useCallback(async (id: string) => {
    try {
      const result = await deleteDocument('participations', id);
      if (result.success) {
        setParticipations(prev => prev.filter(participation => participation.id !== id));
        console.log('✅ 참가 신청 삭제 성공:', id);
      } else {
        throw new Error(result.error || '참가 신청 삭제 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { participationId: id });
      throw err;
    }
  }, []);

  const registerForEvent = useCallback(async (
    eventId: string, 
    userId: string, 
    userName: string, 
    userEmail: string,
    isGuest: boolean = false
  ) => {
    try {
      // 이미 등록되어 있는지 확인
      const existingParticipation = participations.find(
        p => p.eventId === eventId && p.userId === userId
      );
      
      if (existingParticipation) {
        throw new Error('이미 이 산행에 신청하셨습니다.');
      }
      
      await addParticipation({
        eventId,
        userId,
        userName,
        userEmail,
        isGuest,
        status: 'pending',
        registeredAt: new Date().toISOString(),
      });
      
      console.log('✅ 산행 신청 완료:', { eventId, userId });
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { eventId, userId });
      throw err;
    }
  }, [participations, addParticipation]);

  const cancelParticipation = useCallback(async (id: string, reason?: string) => {
    try {
      await updateParticipation(id, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancellationReason: reason,
      });
      console.log('✅ 참가 취소 완료:', id);
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { participationId: id });
      throw err;
    }
  }, [updateParticipation]);

  const updateParticipationStatus = useCallback(async (id: string, status: Participation['status']) => {
    try {
      await updateParticipation(id, { status });
      console.log('✅ 참가 상태 변경 완료:', { id, status });
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { participationId: id });
      throw err;
    }
  }, [updateParticipation]);

  const assignTeam = useCallback(async (id: string, teamId: string, teamName: string) => {
    try {
      await updateParticipation(id, {
        teamId,
        teamName,
      });
      console.log('✅ 조 배정 완료:', { id, teamId, teamName });
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { participationId: id });
      throw err;
    }
  }, [updateParticipation]);

  const refreshParticipations = useCallback(async () => {
    await loadParticipations();
  }, []);

  const getParticipationById = useCallback((id: string) => {
    return participations.find(participation => participation.id === id);
  }, [participations]);

  const getParticipationsByEvent = useCallback((eventId: string) => {
    return participations.filter(participation => participation.eventId === eventId);
  }, [participations]);

  const getParticipationsByUser = useCallback((userId: string) => {
    return participations.filter(participation => participation.userId === userId);
  }, [participations]);

  const getUserParticipationForEvent = useCallback((userId: string, eventId: string) => {
    return participations.find(
      participation => participation.userId === userId && participation.eventId === eventId
    );
  }, [participations]);

  const value = useMemo(() => ({
    participations,
    isLoading,
    error,
    addParticipation,
    updateParticipation,
    deleteParticipation,
    getParticipationById,
    getParticipationsByEvent,
    getParticipationsByUser,
    getUserParticipationForEvent,
    registerForEvent,
    cancelParticipation,
    updateParticipationStatus,
    assignTeam,
    refreshParticipations,
  }), [
    participations,
    isLoading,
    error,
    addParticipation,
    updateParticipation,
    deleteParticipation,
    getParticipationById,
    getParticipationsByEvent,
    getParticipationsByUser,
    getUserParticipationForEvent,
    registerForEvent,
    cancelParticipation,
    updateParticipationStatus,
    assignTeam,
    refreshParticipations,
  ]);

  return <ParticipationContext.Provider value={value}>{children}</ParticipationContext.Provider>;
};

export const useParticipations = () => {
  const context = useContext(ParticipationContext);
  if (context === undefined) {
    throw new Error('useParticipations must be used within a ParticipationProvider');
  }
  return context;
};

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';

export interface GuestApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string; // 참여 이유
  referredBy?: string; // 추천인
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

interface GuestApplicationContextType {
  guestApplications: GuestApplication[];
  isLoading: boolean;
  error: string | null;
  addGuestApplication: (application: Omit<GuestApplication, 'id' | 'appliedAt' | 'status'>) => Promise<void>;
  approveGuestApplication: (applicationId: string) => Promise<void>;
  rejectGuestApplication: (applicationId: string, reason?: string) => Promise<void>;
  refreshGuestApplications: () => Promise<void>;
  getApplicationsByStatus: (status: GuestApplication['status']) => GuestApplication[];
  getApplicationsByEvent: (eventId: string) => GuestApplication[];
}

const GuestApplicationContext = createContext<GuestApplicationContextType | undefined>(undefined);

export const GuestApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [guestApplications, setGuestApplications] = useState<GuestApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase에서 게스트 신청 데이터 로드
  useEffect(() => {
    loadGuestApplications();
  }, []);

  const loadGuestApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getDocuments<GuestApplication>('guestApplications');
      if (result.success && result.data) {
        // 최신 신청순 정렬
        const sortedApplications = result.data.sort((a, b) => 
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        );
        setGuestApplications(sortedApplications);
        console.log('✅ Firebase에서 게스트 신청 데이터 로드:', sortedApplications.length);
      } else {
        console.log('ℹ️ Firebase에서 로드된 게스트 신청 데이터가 없습니다.');
        setGuestApplications([]);
      }
    } catch (err: any) {
      console.error('❌ Firebase 게스트 신청 데이터 로드 실패:', err.message);
      setError(err.message);
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'GuestApplicationContext.loadGuestApplications',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 게스트 신청 추가
  const addGuestApplication = async (
    applicationData: Omit<GuestApplication, 'id' | 'appliedAt' | 'status'>
  ) => {
    try {
      const newApplication: Omit<GuestApplication, 'id'> = {
        ...applicationData,
        appliedAt: new Date().toISOString(),
        status: 'pending',
      };

      console.log('📤 게스트 신청 추가:', newApplication);

      // ID 생성
      const id = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const applicationWithId: GuestApplication = {
        ...newApplication,
        id,
      };

      const result = await setDocument('guestApplications', id, applicationWithId);

      if (result.success) {
        setGuestApplications(prev => [applicationWithId, ...prev]);
        console.log('✅ 게스트 신청 추가 완료:', id);
      } else {
        throw new Error(result.error || '게스트 신청 추가 실패');
      }
    } catch (err: any) {
      console.error('❌ 게스트 신청 추가 실패:', err.message);
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'GuestApplicationContext.addGuestApplication',
      });
      throw err;
    }
  };

  // 게스트 신청 승인
  const approveGuestApplication = async (applicationId: string) => {
    try {
      console.log('✅ 게스트 신청 승인 처리:', applicationId);
      
      const result = await updateDocument('guestApplications', applicationId, {
        status: 'approved',
        approvedAt: new Date().toISOString(),
      });

      if (result.success) {
        setGuestApplications(prev =>
          prev.map(app =>
            app.id === applicationId
              ? { ...app, status: 'approved' as const, approvedAt: new Date().toISOString() }
              : app
          )
        );
        
        console.log('✅ 게스트 신청 승인 완료:', applicationId);
      } else {
        throw new Error(result.error || '게스트 신청 승인 실패');
      }
    } catch (err: any) {
      console.error('❌ 게스트 신청 승인 실패:', err.message);
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'GuestApplicationContext.approveGuestApplication',
        applicationId,
      });
      throw err;
    }
  };

  // 게스트 신청 거절
  const rejectGuestApplication = async (applicationId: string, reason?: string) => {
    try {
      console.log('❌ 게스트 신청 거절 처리:', applicationId);
      
      const result = await updateDocument('guestApplications', applicationId, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
      });

      if (result.success) {
        setGuestApplications(prev =>
          prev.map(app =>
            app.id === applicationId
              ? { 
                  ...app, 
                  status: 'rejected' as const, 
                  rejectedAt: new Date().toISOString(),
                  rejectionReason: reason 
                }
              : app
          )
        );
        
        console.log('✅ 게스트 신청 거절 완료:', applicationId);
      } else {
        throw new Error(result.error || '게스트 신청 거절 실패');
      }
    } catch (err: any) {
      console.error('❌ 게스트 신청 거절 실패:', err.message);
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'GuestApplicationContext.rejectGuestApplication',
        applicationId,
      });
      throw err;
    }
  };

  // 새로고침
  const refreshGuestApplications = async () => {
    await loadGuestApplications();
  };

  // 상태별 필터링
  const getApplicationsByStatus = (status: GuestApplication['status']) => {
    return guestApplications.filter(app => app.status === status);
  };

  // 산행별 필터링
  const getApplicationsByEvent = (eventId: string) => {
    return guestApplications.filter(app => app.eventId === eventId);
  };

  const value: GuestApplicationContextType = {
    guestApplications,
    isLoading,
    error,
    addGuestApplication,
    approveGuestApplication,
    rejectGuestApplication,
    refreshGuestApplications,
    getApplicationsByStatus,
    getApplicationsByEvent,
  };

  return (
    <GuestApplicationContext.Provider value={value}>
      {children}
    </GuestApplicationContext.Provider>
  );
};

export const useGuestApplications = () => {
  const context = useContext(GuestApplicationContext);
  if (!context) {
    throw new Error('useGuestApplications must be used within GuestApplicationProvider');
  }
  return context;
};

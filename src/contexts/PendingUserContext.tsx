import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { PendingUser } from '../types';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';

interface PendingUserContextType {
  pendingUsers: PendingUser[];
  isLoading: boolean;
  error: string | null;
  approvePendingUser: (userId: string) => Promise<void>;
  rejectPendingUser: (userId: string, reason?: string) => Promise<void>;
  refreshPendingUsers: () => Promise<void>;
  getPendingUsersByStatus: (status: PendingUser['status']) => PendingUser[];
}

const PendingUserContext = createContext<PendingUserContextType | undefined>(undefined);

export const PendingUserProvider = ({ children }: { children: ReactNode }) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase에서 가입 대기 사용자 데이터 로드
  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getDocuments<PendingUser>('pendingUsers');
      if (result.success && result.data) {
        // 최신 신청순 정렬
        const sortedUsers = result.data.sort((a, b) => 
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        );
        setPendingUsers(sortedUsers);
        console.log('✅ Firebase에서 가입 대기자 데이터 로드:', sortedUsers.length);
      } else {
        console.log('ℹ️ Firebase에서 로드된 가입 대기자 데이터가 없습니다.');
        setPendingUsers([]);
      }
    } catch (err: any) {
      console.error('❌ Firebase 가입 대기자 데이터 로드 실패:', err.message);
      setError(err.message);
      logError(err, ErrorLevel.ERROR, ErrorCategory.FIREBASE, {
        context: 'PendingUserContext.loadPendingUsers',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 가입 승인
  const approvePendingUser = async (userId: string) => {
    try {
      console.log('✅ 가입 승인 처리:', userId);
      
      // Firebase에서 상태 업데이트
      const result = await updateDocument('pendingUsers', userId, {
        status: 'approved',
        approvedAt: new Date().toISOString(),
      });

      if (result.success) {
        // 로컬 상태 업데이트
        setPendingUsers(prev =>
          prev.map(user =>
            user.id === userId
              ? { ...user, status: 'approved' as const }
              : user
          )
        );
        
        console.log('✅ 가입 승인 완료:', userId);
        
        // TODO: 실제로는 이 시점에 Firebase Authentication에 사용자 계정 생성하고
        // members 컬렉션에 추가하는 로직이 필요합니다.
      } else {
        throw new Error(result.error || '가입 승인 실패');
      }
    } catch (err: any) {
      console.error('❌ 가입 승인 실패:', err.message);
      logError(err, ErrorLevel.ERROR, ErrorCategory.FIREBASE, {
        context: 'PendingUserContext.approvePendingUser',
        userId,
      });
      throw err;
    }
  };

  // 가입 거절
  const rejectPendingUser = async (userId: string, reason?: string) => {
    try {
      console.log('❌ 가입 거절 처리:', userId);
      
      // Firebase에서 상태 업데이트
      const result = await updateDocument('pendingUsers', userId, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
      });

      if (result.success) {
        // 로컬 상태 업데이트
        setPendingUsers(prev =>
          prev.map(user =>
            user.id === userId
              ? { ...user, status: 'rejected' as const }
              : user
          )
        );
        
        console.log('✅ 가입 거절 완료:', userId);
      } else {
        throw new Error(result.error || '가입 거절 실패');
      }
    } catch (err: any) {
      console.error('❌ 가입 거절 실패:', err.message);
      logError(err, ErrorLevel.ERROR, ErrorCategory.FIREBASE, {
        context: 'PendingUserContext.rejectPendingUser',
        userId,
      });
      throw err;
    }
  };

  // 새로고침
  const refreshPendingUsers = async () => {
    await loadPendingUsers();
  };

  // 상태별 필터링
  const getPendingUsersByStatus = (status: PendingUser['status']) => {
    return pendingUsers.filter(user => user.status === status);
  };

  const value: PendingUserContextType = {
    pendingUsers,
    isLoading,
    error,
    approvePendingUser,
    rejectPendingUser,
    refreshPendingUsers,
    getPendingUsersByStatus,
  };

  return (
    <PendingUserContext.Provider value={value}>
      {children}
    </PendingUserContext.Provider>
  );
};

export const usePendingUsers = () => {
  const context = useContext(PendingUserContext);
  if (!context) {
    throw new Error('usePendingUsers must be used within PendingUserProvider');
  }
  return context;
};

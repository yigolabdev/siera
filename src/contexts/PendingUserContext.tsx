import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { PendingUser } from '../types';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { waitForFirebase } from '../lib/firebase/config';
import { useAuth } from './AuthContextEnhanced';

interface PendingUserContextType {
  pendingUsers: PendingUser[];
  isLoading: boolean;
  error: string | null;
  approvePendingUser: (userId: string) => Promise<void>;
  rejectPendingUser: (userId: string, reason?: string) => Promise<void>;
  refreshPendingUsers: () => Promise<void>;
  getPendingUsersByStatus: (status: PendingUser['status']) => PendingUser[];
  _activate: () => void;
}

const PendingUserContext = createContext<PendingUserContextType | undefined>(undefined);

export const PendingUserProvider = ({ children }: { children: ReactNode }) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Lazy loading
  const [_activated, _setActivated] = useState(false);
  const _activate = useCallback(() => _setActivated(true), []);
  
  // 🔥 AuthContext 사용
  const auth = useAuth();

  // Firebase에서 가입 대기 사용자 데이터 로드 - 로그인 상태 변경 시 재로드
  useEffect(() => {
    if (!_activated) return;
    const initializeData = async () => {
      // 로그인 상태이거나 아직 한 번도 로드하지 않았을 때만 로드
      if (auth.firebaseUser || !hasLoadedOnce) {
        await loadPendingUsers();
        setHasLoadedOnce(true);
      }
    };
    
    // Auth 로딩이 완료된 후에만 실행
    if (!auth.isLoading) {
      initializeData();
    }
  }, [_activated, auth.firebaseUser, auth.isLoading]);

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
      } else {
        setPendingUsers([]);
      }
    } catch (err: any) {
      console.error('❌ Firebase 가입 대기자 데이터 로드 실패:', err.message);
      setError(err.message);
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'PendingUserContext.loadPendingUsers',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 가입 승인
  const approvePendingUser = async (userId: string) => {
    try {
      // 1. pendingUser 정보 가져오기
      const pendingUser = pendingUsers.find(u => u.id === userId);
      if (!pendingUser) {
        throw new Error('가입 대기자를 찾을 수 없습니다.');
      }
      
      // 2. members 컬렉션에 정회원으로 추가
      const memberData = {
        id: pendingUser.id,
        name: pendingUser.name,
        email: pendingUser.email,
        phoneNumber: pendingUser.phoneNumber,
        gender: pendingUser.gender,
        birthYear: pendingUser.birthYear,
        company: pendingUser.company,
        position: pendingUser.position,
        bio: pendingUser.applicationMessage || '',
        role: 'member' as const,
        isApproved: true,
        isActive: true,
        isAuthenticated: true,
        joinDate: new Date().toISOString().split('T')[0],
        attendanceRate: 0,
        profileImage: pendingUser.profileImage || null,
        authProvider: pendingUser.authProvider || '',
        referredBy: pendingUser.referredBy,
        hikingLevel: pendingUser.hikingLevel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const memberResult = await setDocument('members', userId, memberData);
      
      if (!memberResult.success) {
        console.error('❌ members 컬렉션 추가 실패:', memberResult.error);
        throw new Error(memberResult.error || 'members 컬렉션 추가 실패');
      }
      
      // 3. pendingUsers 문서 삭제 (승인 완료 후 혼란 방지)
      const deleteResult = await deleteDocument('pendingUsers', userId);

      if (!deleteResult.success) {
        // 삭제 실패해도 members에 추가는 완료됨 - 경고만 출력
        console.warn('⚠️ pendingUsers 문서 삭제 실패 (정회원 등록은 완료됨):', deleteResult.error);
      }

      // 4. 로컬 상태 업데이트 (목록에서 제거)
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err: any) {
      console.error('❌ 가입 승인 실패:', err.message);
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'PendingUserContext.approvePendingUser',
        userId,
      });
      throw err;
    }
  };

  // 가입 거절
  const rejectPendingUser = async (userId: string, reason?: string) => {
    try {
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
      } else {
        throw new Error(result.error || '가입 거절 실패');
      }
    } catch (err: any) {
      console.error('❌ 가입 거절 실패:', err.message);
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
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
    _activate,
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
  useEffect(() => { context._activate(); }, [context._activate]);
  return context;
};

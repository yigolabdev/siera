import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { getDocuments, setDocument, updateDocument as firestoreUpdate, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { Member } from '../types';
import { waitForFirebase } from '../lib/firebase/config';
import { useAuth } from './AuthContextEnhanced';

interface MemberContextType {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  addMember: (member: Member) => Promise<void>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMemberById: (id: string) => Member | undefined;
  getActiveMembers: () => Member[];
  getTotalMembers: () => number;
  getMembersByPosition: (position: 'chairman' | 'committee' | 'member') => Member[];
  refreshMembers: () => Promise<void>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  // 🔥 AuthContext 사용
  const auth = useAuth();
  
  // Firebase 초기 데이터 로드 - 로그인 상태 변경 시 재로드
  useEffect(() => {
    const initializeData = async () => {
      console.log('🔄 [MemberContext] 데이터 로드 시작, 인증 상태:', {
        isAuthenticated: !!auth.firebaseUser,
        email: auth.firebaseUser?.email,
        hasLoadedOnce
      });
      
      // 로그인 상태이거나 아직 한 번도 로드하지 않았을 때만 로드
      if (auth.firebaseUser || !hasLoadedOnce) {
        await loadInitialData();
        setHasLoadedOnce(true);
      }
    };
    
    // Auth 로딩이 완료된 후에만 실행
    if (!auth.isLoading) {
      initializeData();
    }
  }, [auth.firebaseUser, auth.isLoading]);
  
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 [MemberContext] members 데이터 로드 시작');
      
      // Firebase에서 회원 데이터 로드
      const membersResult = await getDocuments<Member>('members');
      
      if (membersResult.success && membersResult.data) {
        setMembers(membersResult.data);
        console.log('✅ Firebase에서 회원 데이터 로드:', membersResult.data.length, '명');
      } else {
        console.log('ℹ️ Firebase에서 로드된 회원 데이터가 없습니다.');
        setMembers([]);
      }
    } catch (err: any) {
      console.error('❌ Firebase 회원 데이터 로드 실패:', err.message);
      setError(err.message);
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'MemberContext.loadInitialData',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = useCallback(async (member: Member) => {
    try {
      const memberData = {
        ...member,
        createdAt: new Date().toISOString(),
      };
      const result = await setDocument('members', member.id, memberData);
      if (result.success) {
        setMembers(prev => [...prev, member]);
      } else {
        throw new Error(result.error || '회원 추가 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { memberId: member.id });
      throw err;
    }
  }, []);

  const updateMember = useCallback(async (id: string, updatedMember: Partial<Member>) => {
    try {
      const result = await firestoreUpdate('members', id, updatedMember);
      if (result.success) {
        setMembers(prev => prev.map(member => 
          member.id === id ? { ...member, ...updatedMember } : member
        ));
      } else {
        throw new Error(result.error || '회원 수정 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { memberId: id });
      throw err;
    }
  }, []);

  const deleteMember = useCallback(async (id: string) => {
    try {
      const result = await deleteDocument('members', id);
      if (result.success) {
        setMembers(prev => prev.filter(member => member.id !== id));
      } else {
        throw new Error(result.error || '회원 삭제 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { memberId: id });
      throw err;
    }
  }, []);

  const getMemberById = useCallback((id: string) => {
    return members.find(member => member.id === id);
  }, [members]);

  const getActiveMembers = useCallback(() => {
    return members.filter(m => m.isApproved); // isApproved로 활성 회원 필터링
  }, [members]);

  const getTotalMembers = useCallback(() => {
    return members.length;
  }, [members]);

  const getMembersByPosition = useCallback((position: 'chairman' | 'committee' | 'member') => {
    return members.filter(member => member.role === position); // position -> role 사용
  }, [members]);
  
  const refreshMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getDocuments<Member>('members');
      if (result.success && result.data) {
        setMembers(result.data);
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const value = useMemo(() => ({
    members,
    isLoading,
    error,
    addMember,
    updateMember,
    deleteMember,
    getMemberById,
    getActiveMembers,
    getTotalMembers,
    getMembersByPosition,
    refreshMembers,
  }), [
    members,
    isLoading,
    error,
    addMember,
    updateMember,
    deleteMember,
    getMemberById,
    getActiveMembers,
    getTotalMembers,
    getMembersByPosition,
    refreshMembers,
  ]);

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMembers = () => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
};

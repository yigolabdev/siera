import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Member, mockMembers } from '../data/mockData';
import { getDocuments, setDocument, updateDocument as firestoreUpdate, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';

interface MemberContextType {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  addMember: (member: Member) => Promise<void>;
  updateMember: (id: number, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: number) => Promise<void>;
  getMemberById: (id: number) => Member | undefined;
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
  const [useFirebase, setUseFirebase] = useState(false);
  
  // Firebase 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);
  
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Firebase에서 회원 데이터 로드 시도
      const membersResult = await getDocuments<Member>('members');
      
      if (membersResult.success && membersResult.data && membersResult.data.length > 0) {
        // Firebase 데이터 사용
        setMembers(membersResult.data);
        setUseFirebase(true);
        console.log('✅ Firebase에서 회원 데이터 로드:', membersResult.data.length);
      } else {
        // Mock 데이터 사용 (Fallback)
        setMembers(mockMembers);
        setUseFirebase(false);
        console.log('ℹ️ Mock 회원 데이터 사용 (Firebase 데이터 없음)');
      }
    } catch (err: any) {
      console.warn('⚠️ Firebase 로드 실패, Mock 회원 데이터 사용:', err.message);
      setMembers(mockMembers);
      setUseFirebase(false);
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = useCallback(async (member: Member) => {
    try {
      if (useFirebase) {
        const memberData = {
          ...member,
          createdAt: new Date().toISOString(),
        };
        const result = await setDocument('members', member.id.toString(), memberData);
        if (result.success) {
          setMembers(prev => [...prev, member]);
        } else {
          throw new Error(result.error || '회원 추가 실패');
        }
      } else {
        setMembers(prev => [...prev, member]);
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { memberId: member.id });
      throw err;
    }
  }, [useFirebase]);

  const updateMember = useCallback(async (id: number, updatedMember: Partial<Member>) => {
    try {
      if (useFirebase) {
        const result = await firestoreUpdate('members', id.toString(), updatedMember);
        if (result.success) {
          setMembers(prev => prev.map(member => 
            member.id === id ? { ...member, ...updatedMember } : member
          ));
        } else {
          throw new Error(result.error || '회원 수정 실패');
        }
      } else {
        setMembers(prev => prev.map(member => 
          member.id === id ? { ...member, ...updatedMember } : member
        ));
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { memberId: id });
      throw err;
    }
  }, [useFirebase]);

  const deleteMember = useCallback(async (id: number) => {
    try {
      if (useFirebase) {
        const result = await deleteDocument('members', id.toString());
        if (result.success) {
          setMembers(prev => prev.filter(member => member.id !== id));
        } else {
          throw new Error(result.error || '회원 삭제 실패');
        }
      } else {
        setMembers(prev => prev.filter(member => member.id !== id));
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { memberId: id });
      throw err;
    }
  }, [useFirebase]);

  const getMemberById = useCallback((id: number) => {
    return members.find(member => member.id === id);
  }, [members]);

  const getActiveMembers = useCallback(() => {
    return members; // isActive 필드 추가 시 필터링
  }, [members]);

  const getTotalMembers = useCallback(() => {
    return members.length;
  }, [members]);

  const getMembersByPosition = useCallback((position: 'chairman' | 'committee' | 'member') => {
    return members.filter(member => member.position === position);
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

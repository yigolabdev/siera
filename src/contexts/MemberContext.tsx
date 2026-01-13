import { createContext, useContext, useState, ReactNode } from 'react';
import { Member, mockMembers } from '../data/mockData';

interface MemberContextType {
  members: Member[];
  addMember: (member: Member) => void;
  updateMember: (id: number, member: Partial<Member>) => void;
  deleteMember: (id: number) => void;
  getMemberById: (id: number) => Member | undefined;
  getActiveMembers: () => Member[];
  getTotalMembers: () => number;
  getMembersByPosition: (position: 'chairman' | 'committee' | 'member') => Member[];
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>(mockMembers);

  const addMember = (member: Member) => {
    setMembers(prev => [...prev, member]);
  };

  const updateMember = (id: number, updatedMember: Partial<Member>) => {
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, ...updatedMember } : member
    ));
  };

  const deleteMember = (id: number) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const getMemberById = (id: number) => {
    return members.find(member => member.id === id);
  };

  const getActiveMembers = () => {
    return members; // isActive 필드 추가 시 필터링
  };

  const getTotalMembers = () => {
    return members.length;
  };

  const getMembersByPosition = (position: 'chairman' | 'committee' | 'member') => {
    return members.filter(member => member.position === position);
  };

  return (
    <MemberContext.Provider value={{
      members,
      addMember,
      updateMember,
      deleteMember,
      getMemberById,
      getActiveMembers,
      getTotalMembers,
      getMembersByPosition,
    }}>
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

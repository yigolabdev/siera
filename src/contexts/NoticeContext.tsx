import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

export interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  isPinned: boolean;
}

interface NoticeContextType {
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  updateNotice: (id: number, notice: Omit<Notice, 'id' | 'date'>) => void;
  deleteNotice: (id: number) => void;
  togglePin: (id: number) => void;
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

// 초기 공지사항은 빈 배열 (관리자가 직접 작성)
const initialNotices: Notice[] = [];

export const NoticeProvider = ({ children }: { children: ReactNode }) => {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);

  const addNotice = useCallback((notice: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      id: notices.length > 0 ? Math.max(...notices.map(n => n.id)) + 1 : 1,
      date: new Date().toISOString().split('T')[0],
      ...notice,
    };
    setNotices(prev => [newNotice, ...prev]);
  }, [notices.length]);

  const updateNotice = useCallback((id: number, notice: Omit<Notice, 'id' | 'date'>) => {
    setNotices(prev => prev.map(n =>
      n.id === id ? { ...n, ...notice } : n
    ));
  }, []);

  const deleteNotice = useCallback((id: number) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  }, []);

  const togglePin = useCallback((id: number) => {
    setNotices(prev => prev.map(n =>
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    ));
  }, []);

  const value = useMemo(
    () => ({
      notices,
      addNotice,
      updateNotice,
      deleteNotice,
      togglePin,
    }),
    [notices, addNotice, updateNotice, deleteNotice, togglePin]
  );

  return (
    <NoticeContext.Provider value={value}>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotices = () => {
  const context = useContext(NoticeContext);
  if (context === undefined) {
    throw new Error('useNotices must be used within a NoticeProvider');
  }
  return context;
};

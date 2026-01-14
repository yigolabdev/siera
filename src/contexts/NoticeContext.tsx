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

const initialNotices: Notice[] = [
  {
    id: 1,
    title: '2026년 1월 정기산행 안내',
    content: '1월 15일(월) 앙봉산 정상 등반을 진행합니다. 오전 7시 15분 종합운동장역 6번 출구 앞 집결 예정이오니 참석하실 회원님들은 미리 신청 부탁드립니다.',
    date: '2026-01-01',
    isPinned: true,
  },
  {
    id: 2,
    title: '2026년 연회비 납부 안내',
    content: '2026년도 연회비 납부를 시작합니다. 계좌번호: 국민은행 123-456-789012 (예금주: 시애라)',
    date: '2026-01-02',
    isPinned: true,
  },
  {
    id: 3,
    title: '신년 하례식 일정 공지',
    content: '2026년 신년 하례식을 1월 5일(금) 저녁 7시에 진행합니다. 장소는 강남 ○○호텔입니다.',
    date: '2026-01-03',
    isPinned: false,
  },
  {
    id: 4,
    title: '겨울철 산행 안전 수칙',
    content: '겨울철 산행 시 미끄럼 방지 아이젠과 보온 의류를 반드시 준비해주시기 바랍니다.',
    date: '2025-12-28',
    isPinned: false,
  },
  {
    id: 5,
    title: '12월 정기산행 결과 보고',
    content: '12월 정기산행이 성황리에 마무리되었습니다. 참석해주신 35명의 회원님들께 감사드립니다.',
    date: '2025-12-20',
    isPinned: false,
  },
];

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

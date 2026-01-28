import { createContext, useContext, useState, ReactNode } from 'react';
import { Poem } from '../types';

interface PoemContextType {
  poems: Poem[];
  currentPoem: Poem | null;
  addPoem: (poem: Omit<Poem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePoem: (id: string, poem: Partial<Poem>) => void;
  deletePoem: (id: string) => void;
  getPoemByMonth: (month: string) => Poem | undefined;
  getCurrentMonthPoem: () => Poem | undefined;
}

const PoemContext = createContext<PoemContextType | undefined>(undefined);

// 기본 시 데이터
const defaultPoem: Poem = {
  id: '1',
  title: '괜찮아',
  author: '한강',
  content: `태어나 두 달이 되었을 때
아이는 처녀막다 울었다
배고파서도 아니고 어디가
아파서도 아니고
아무 이유도 없이
해질녘부터 밤까지 꼬박 세 시간

거품 같은 아이가 까져버릴까 봐
나는 두 팔로 껴안고
집 안을 수없이 돌며 몰았다
왜 그래.
왜 그래.
왜 그래.
내 눈물이 떠어저
아이의 눈물에 섞이기도 했다

그러던 어느 날
무든 말해보다
누가 가르쳐준 것도 아닌데
괜찮아.
괜찮아.
이젠 괜찮아.

거짓말처럼
아이의 울음이 그치진 않았지만
느그러진 건 오히려
내 울음이었지만, 다만
우연의 말지않았지만
머질 뒤부터 아이는 저녁 울음을 멈췄다

서른 넘어야 그걸게 알았다
내 안의 당신이 호느겼 때
어떻게 해야 하는지
울부짖는 아이의 얼굴을 돌며보듯
쩌디찬 거품 같은 눈물을 잠해
괜찮아.
왜 그래, 가 아니라
괜찮아.
이젠 괜찮아.`,
  month: '2026-01',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const PoemProvider = ({ children }: { children: ReactNode }) => {
  const [poems, setPoems] = useState<Poem[]>([defaultPoem]);
  
  // 현재 월의 시 가져오기
  const currentPoem = poems.find(p => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return p.month === currentMonth;
  }) || poems[poems.length - 1]; // 현재 월이 없으면 가장 최근 시

  const addPoem = (poemData: Omit<Poem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPoem: Poem = {
      ...poemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPoems(prev => [...prev, newPoem]);
  };

  const updatePoem = (id: string, updatedData: Partial<Poem>) => {
    setPoems(prev => prev.map(poem => 
      poem.id === id 
        ? { ...poem, ...updatedData, updatedAt: new Date().toISOString() }
        : poem
    ));
  };

  const deletePoem = (id: string) => {
    setPoems(prev => prev.filter(poem => poem.id !== id));
  };

  const getPoemByMonth = (month: string) => {
    return poems.find(p => p.month === month);
  };

  const getCurrentMonthPoem = () => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return getPoemByMonth(currentMonth) || poems[poems.length - 1];
  };

  return (
    <PoemContext.Provider value={{
      poems,
      currentPoem,
      addPoem,
      updatePoem,
      deletePoem,
      getPoemByMonth,
      getCurrentMonthPoem,
    }}>
      {children}
    </PoemContext.Provider>
  );
};

export const usePoems = () => {
  const context = useContext(PoemContext);
  if (context === undefined) {
    throw new Error('usePoems must be used within a PoemProvider');
  }
  return context;
};

// Export types for backwards compatibility
export type { Poem } from '../types';

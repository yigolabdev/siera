import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ApplicationStatus = 'open' | 'closed' | 'full' | 'no-event';

interface DevModeContextType {
  isDevMode: boolean;
  toggleDevMode: () => void;
  applicationStatus: ApplicationStatus;
  setApplicationStatus: (status: ApplicationStatus) => void;
  specialApplicationStatus: ApplicationStatus; // 특별산행 상태 추가
  setSpecialApplicationStatus: (status: ApplicationStatus) => void;
  resetToDefault: () => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export const useDevMode = () => {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error('useDevMode must be used within DevModeProvider');
  }
  return context;
};

export const DevModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDevMode, setIsDevMode] = useState(() => {
    const saved = localStorage.getItem('siera-dev-mode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>(() => {
    const saved = localStorage.getItem('siera-app-status');
    // 명시적으로 'open' (신청 가능)을 기본값으로 설정
    if (!saved || saved === 'null' || saved === 'undefined') {
      return 'open';
    }
    return saved as ApplicationStatus;
  });

  // 특별산행 상태 추가
  const [specialApplicationStatus, setSpecialApplicationStatus] = useState<ApplicationStatus>(() => {
    const saved = localStorage.getItem('siera-special-app-status');
    // 기본값: 'open' (신청 가능)
    if (!saved || saved === 'null' || saved === 'undefined') {
      return 'open';
    }
    return saved as ApplicationStatus;
  });

  // LocalStorage에 저장
  useEffect(() => {
    localStorage.setItem('siera-dev-mode', JSON.stringify(isDevMode));
  }, [isDevMode]);

  useEffect(() => {
    localStorage.setItem('siera-app-status', applicationStatus);
  }, [applicationStatus]);

  useEffect(() => {
    localStorage.setItem('siera-special-app-status', specialApplicationStatus);
  }, [specialApplicationStatus]);

  const toggleDevMode = () => {
    setIsDevMode(!isDevMode);
  };

  const resetToDefault = () => {
    setApplicationStatus('open');
    setSpecialApplicationStatus('open');
  };

  const value: DevModeContextType = {
    isDevMode,
    toggleDevMode,
    applicationStatus,
    setApplicationStatus,
    specialApplicationStatus,
    setSpecialApplicationStatus,
    resetToDefault,
  };

  return <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>;
};

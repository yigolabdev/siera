import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ApplicationStatus = 'open' | 'closed' | 'full' | 'no-event';

interface DevModeContextType {
  isDevMode: boolean;
  toggleDevMode: () => void;
  applicationStatus: ApplicationStatus;
  setApplicationStatus: (status: ApplicationStatus) => void;
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
    return (saved as ApplicationStatus) || 'open';
  });

  // LocalStorage에 저장
  useEffect(() => {
    localStorage.setItem('siera-dev-mode', JSON.stringify(isDevMode));
  }, [isDevMode]);

  useEffect(() => {
    localStorage.setItem('siera-app-status', applicationStatus);
  }, [applicationStatus]);

  const toggleDevMode = () => {
    setIsDevMode(!isDevMode);
  };

  const resetToDefault = () => {
    setApplicationStatus('open');
  };

  const value: DevModeContextType = {
    isDevMode,
    toggleDevMode,
    applicationStatus,
    setApplicationStatus,
    resetToDefault,
  };

  return <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>;
};

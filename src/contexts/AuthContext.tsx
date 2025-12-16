import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, RegisterData } from '../types';
import { userStorage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  updateProfileImage: (imageUrl: string | null) => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로컬스토리지에서 사용자 정보 복원
  useEffect(() => {
    try {
      const savedUser = userStorage.get();
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Failed to restore user session:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: 실제 API 호출로 대체
      // Mock 로그인 로직
      if (email === 'admin@siera.com' && password === 'admin123') {
        const adminUser: User = {
          id: '1',
          name: '관리자',
          email: 'admin@siera.com',
          role: 'admin',
          isApproved: true,
          joinDate: '2026-01-01',
        };
        setUser(adminUser);
        userStorage.set(adminUser);
        return true;
      } else if (email && password) {
        const memberUser: User = {
          id: '2',
          name: '홍길동',
          email: email,
          role: 'member',
          isApproved: true,
          joinDate: '2026-01-15',
          phoneNumber: '010-1234-5678',
          occupation: '○○그룹',
          position: '회장',
          company: '○○그룹',
        };
        setUser(memberUser);
        userStorage.set(memberUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      userStorage.remove();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // TODO: 실제 API 호출로 대체
      // Mock 회원가입 로직 - 관리자 승인 대기 상태로 생성
      console.log('회원가입 신청:', userData);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const updateProfileImage = (imageUrl: string | null) => {
    if (user) {
      const updatedUser = { ...user, profileImage: imageUrl || undefined };
      setUser(updatedUser);
      userStorage.set(updatedUser);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      userStorage.set(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    updateProfileImage,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


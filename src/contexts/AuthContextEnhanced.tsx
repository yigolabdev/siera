/**
 * Enhanced Auth Context with Firebase Integration
 * Firebase Auth와 통합된 인증 컨텍스트
 */

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User, RegisterData } from '../types';
import { userStorage } from '../utils/storage';
import { signIn as firebaseSignIn, signUp, signOut as firebaseSignOut, onAuthChange } from '../lib/firebase/auth';
import { getDocument, setDocument, updateDocument } from '../lib/firebase/firestore';
import { logError, ErrorCategory, ErrorLevel } from '../utils/errorHandler';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  updateProfileImage: (imageUrl: string | null) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
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
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Firestore에서 사용자 정보 가져오기
   */
  const fetchUserFromFirestore = useCallback(async (uid: string): Promise<User | null> => {
    try {
      const result = await getDocument<User>('members', uid);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return null;
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { uid });
      return null;
    }
  }, []);

  /**
   * Firebase Auth 상태 변경 리스너
   */
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        
        // Firestore에서 사용자 정보 가져오기
        const userData = await fetchUserFromFirestore(firebaseUser.uid);
        
        if (userData) {
          setUser(userData);
          userStorage.set(userData);
        } else {
          // Firestore에 사용자 정보가 없는 경우 (새 사용자)
          // Firebase Auth 정보로 기본 User 객체 생성
          
          // 🔥 개발용: 특정 이메일을 관리자로 설정
          const isDevAdmin = firebaseUser.email === 'choi@yigolab.com';
          
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || (isDevAdmin ? '최효준 (개발자)' : ''),
            email: firebaseUser.email || '',
            role: isDevAdmin ? 'chairman' : 'member',
            isApproved: isDevAdmin ? true : false, // 개발자는 자동 승인
            joinDate: new Date().toISOString().split('T')[0],
          };
          
          setUser(newUser);
          userStorage.set(newUser);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        userStorage.remove();
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserFromFirestore]);

  /**
   * 로그인
   */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      const result = await firebaseSignIn(email, password);

      if (result.success && result.user) {
        // 사용자 정보는 onAuthChange에서 처리됨
        return true;
      }

      setError(result.error || '로그인에 실패했습니다.');
      return false;
    } catch (err: any) {
      const errorMessage = err.message || '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      logError(err, ErrorLevel.ERROR, ErrorCategory.AUTH, { email });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 로그아웃
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await firebaseSignOut();
      setUser(null);
      setFirebaseUser(null);
      userStorage.remove();
    } catch (err: any) {
      const errorMessage = err.message || '로그아웃 중 오류가 발생했습니다.';
      setError(errorMessage);
      logError(err, ErrorLevel.ERROR, ErrorCategory.AUTH);
      throw err;
    }
  }, []);

  /**
   * 회원가입
   */
  const register = useCallback(async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    try {
      setError(null);
      setIsLoading(true);

      // Firebase Auth 회원가입
      const result = await signUp(userData.email, userData.password, userData.name);

      if (!result.success || !result.user) {
        return {
          success: false,
          message: result.error || '회원가입에 실패했습니다.',
        };
      }

      // Firestore에 사용자 정보 저장
      const newUser: User = {
        id: result.user.uid,
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        occupation: userData.occupation,
        position: userData.position,
        company: userData.company,
        role: 'member',
        isApproved: false, // 관리자 승인 필요
        joinDate: new Date().toISOString().split('T')[0],
      };

      const saveResult = await setDocument('members', result.user.uid, newUser);

      if (!saveResult.success) {
        return {
          success: false,
          message: '사용자 정보 저장에 실패했습니다.',
        };
      }

      return {
        success: true,
        message: '회원가입이 완료되었습니다. 관리자 승인 후 이용 가능합니다.',
      };
    } catch (err: any) {
      const errorMessage = err.message || '회원가입 중 오류가 발생했습니다.';
      setError(errorMessage);
      logError(err, ErrorLevel.ERROR, ErrorCategory.AUTH, { email: userData.email });
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 프로필 이미지 업데이트
   */
  const updateProfileImage = useCallback(async (imageUrl: string | null): Promise<void> => {
    if (!user) return;

    try {
      const updates = { profileImage: imageUrl || undefined };
      
      await updateDocument('members', user.id, updates);
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      userStorage.set(updatedUser);
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { userId: user.id });
      throw err;
    }
  }, [user]);

  /**
   * 사용자 정보 업데이트
   */
  const updateUser = useCallback(async (userData: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      await updateDocument('members', user.id, userData);
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      userStorage.set(updatedUser);
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { userId: user.id });
      throw err;
    }
  }, [user]);

  /**
   * 사용자 정보 새로고침
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      const userData = await fetchUserFromFirestore(user.id);
      if (userData) {
        setUser(userData);
        userStorage.set(userData);
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { userId: user.id });
    }
  }, [user, fetchUserFromFirestore]);

  /**
   * Memoized values
   */
  const isAuthenticated = useMemo(() => !!user && !!firebaseUser, [user, firebaseUser]);
  const isAdmin = useMemo(() => user?.role === 'chairman' || user?.role === 'committee', [user]);

  /**
   * Context value
   */
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      firebaseUser,
      login,
      logout,
      register,
      updateProfileImage,
      updateUser,
      refreshUser,
      isAuthenticated,
      isAdmin,
      isLoading,
      error,
    }),
    [
      user,
      firebaseUser,
      login,
      logout,
      register,
      updateProfileImage,
      updateUser,
      refreshUser,
      isAuthenticated,
      isAdmin,
      isLoading,
      error,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

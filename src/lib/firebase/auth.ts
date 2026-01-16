import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './config';

/**
 * 회원가입
 */
export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 사용자 프로필 업데이트
    await updateProfile(userCredential.user, {
      displayName,
    });
    
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 로그인
 */
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 로그아웃
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 비밀번호 재설정 이메일 발송
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 인증 상태 변경 리스너
 */
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * 현재 로그인된 사용자 가져오기
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * 사용자 토큰 가져오기
 */
export const getUserToken = async (forceRefresh = false) => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const token = await user.getIdToken(forceRefresh);
    return token;
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
};

/**
 * 사용자 토큰 결과 (커스텀 클레임 포함)
 */
export const getUserTokenResult = async (forceRefresh = false) => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const tokenResult = await user.getIdTokenResult(forceRefresh);
    return {
      token: tokenResult.token,
      claims: tokenResult.claims,
    };
  } catch (error) {
    console.error('Get token result error:', error);
    return null;
  }
};

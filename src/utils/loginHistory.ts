import { setDocument, updateDocument } from '../lib/firebase/firestore';
import { LoginHistory } from '../types';

/**
 * User Agent에서 디바이스 정보 추출
 */
const getDeviceInfo = (userAgent: string): {
  device: string;
  browser: string;
  os: string;
} => {
  const ua = userAgent.toLowerCase();
  
  // 디바이스 타입
  let device = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device = 'mobile';
  } else if (/tablet|ipad/i.test(ua)) {
    device = 'tablet';
  }
  
  // 브라우저
  let browser = 'Unknown';
  if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';
  else if (ua.includes('msie') || ua.includes('trident')) browser = 'Internet Explorer';
  
  // 운영체제
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  return { device, browser, os };
};

/**
 * 클라이언트 IP 주소 가져오기 (선택적)
 * 실제 환경에서는 서버 사이드에서 처리하는 것이 더 정확
 */
const getClientIP = async (): Promise<string | undefined> => {
  try {
    // 무료 IP 조회 서비스 사용 (선택적)
    // const response = await fetch('https://api.ipify.org?format=json');
    // const data = await response.json();
    // return data.ip;
    
    // 또는 서버에서 IP를 받아오는 방식
    return undefined; // 현재는 비활성화
  } catch (error) {
    console.error('IP 조회 실패:', error);
    return undefined;
  }
};

/**
 * 로그인 이력 기록
 * 
 * @param userId - 사용자 ID
 * @param userName - 사용자 이름
 * @param userEmail - 사용자 이메일
 * @param loginMethod - 로그인 방법 ('email' | 'google' | 'phone')
 */
export const recordLoginHistory = async (
  userId: string,
  userName: string,
  userEmail: string,
  loginMethod: 'email' | 'google' | 'phone'
): Promise<void> => {
  try {
    const now = new Date().toISOString();
    const userAgent = navigator.userAgent;
    const deviceInfo = getDeviceInfo(userAgent);
    
    // IP 주소 가져오기 (선택적)
    const ipAddress = await getClientIP();
    
    // 1. loginHistory 컬렉션에 상세 이력 저장
    const loginHistoryId = `login_${userId}_${Date.now()}`;
    const loginHistory: LoginHistory = {
      id: loginHistoryId,
      userId,
      userName,
      userEmail,
      loginAt: now,
      ipAddress,
      userAgent,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      loginMethod,
    };
    
    const historyResult = await setDocument('loginHistory', loginHistoryId, loginHistory);
    
    if (!historyResult.success) {
      console.error('로그인 이력 저장 실패:', historyResult.error);
      // 이력 저장 실패해도 로그인은 진행
    }
    
    // 2. members 컬렉션의 사용자 문서 업데이트
    // 로그인 카운트 증가 및 최근 로그인 정보 업데이트
    await updateDocument('members', userId, {
      loginCount: (await getCurrentLoginCount(userId)) + 1,
      lastLoginAt: now,
      lastLoginIP: ipAddress,
      lastLoginDevice: `${deviceInfo.device} / ${deviceInfo.browser} / ${deviceInfo.os}`,
      updatedAt: now,
    });
    
    console.log('✅ 로그인 이력 기록 완료:', {
      userId,
      userName,
      loginMethod,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
    });
  } catch (error) {
    console.error('❌ 로그인 이력 기록 실패:', error);
    // 이력 기록 실패해도 로그인은 진행되도록 에러를 던지지 않음
  }
};

/**
 * 현재 로그인 카운트 가져오기
 */
const getCurrentLoginCount = async (userId: string): Promise<number> => {
  try {
    // Firestore에서 현재 카운트 가져오기
    const { getDocument } = await import('../lib/firebase/firestore');
    const result = await getDocument('members', userId);
    
    if (result.success && result.data) {
      return (result.data as any).loginCount || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('로그인 카운트 조회 실패:', error);
    return 0;
  }
};

/**
 * 사용자의 로그인 이력 조회
 * 
 * @param userId - 사용자 ID
 * @param limit - 조회할 이력 개수 (기본값: 10)
 * @returns 로그인 이력 배열
 */
export const getUserLoginHistory = async (
  userId: string,
  limit: number = 10
): Promise<LoginHistory[]> => {
  try {
    const { getDocuments } = await import('../lib/firebase/firestore');
    const result = await getDocuments<LoginHistory>('loginHistory');
    
    if (result.success && result.data) {
      // userId로 필터링하고 최신순 정렬
      return result.data
        .filter(history => history.userId === userId)
        .sort((a, b) => new Date(b.loginAt).getTime() - new Date(a.loginAt).getTime())
        .slice(0, limit);
    }
    
    return [];
  } catch (error) {
    console.error('로그인 이력 조회 실패:', error);
    return [];
  }
};

/**
 * 전체 로그인 이력 조회 (관리자용)
 * 
 * @param limit - 조회할 이력 개수 (기본값: 50)
 * @returns 로그인 이력 배열
 */
export const getAllLoginHistory = async (
  limit: number = 50
): Promise<LoginHistory[]> => {
  try {
    const { getDocuments } = await import('../lib/firebase/firestore');
    const result = await getDocuments<LoginHistory>('loginHistory');
    
    if (result.success && result.data) {
      // 최신순 정렬
      return result.data
        .sort((a, b) => new Date(b.loginAt).getTime() - new Date(a.loginAt).getTime())
        .slice(0, limit);
    }
    
    return [];
  } catch (error) {
    console.error('전체 로그인 이력 조회 실패:', error);
    return [];
  }
};

/**
 * 특정 기간의 로그인 통계
 * 
 * @param startDate - 시작 날짜
 * @param endDate - 종료 날짜
 * @returns 로그인 통계
 */
export const getLoginStatistics = async (
  startDate: Date,
  endDate: Date
): Promise<{
  totalLogins: number;
  uniqueUsers: number;
  byDevice: Record<string, number>;
  byBrowser: Record<string, number>;
  byMethod: Record<string, number>;
}> => {
  try {
    const { getDocuments } = await import('../lib/firebase/firestore');
    const result = await getDocuments<LoginHistory>('loginHistory');
    
    if (!result.success || !result.data) {
      return {
        totalLogins: 0,
        uniqueUsers: 0,
        byDevice: {},
        byBrowser: {},
        byMethod: {},
      };
    }
    
    // 기간 필터링
    const filteredHistory = result.data.filter(history => {
      const loginDate = new Date(history.loginAt);
      return loginDate >= startDate && loginDate <= endDate;
    });
    
    // 통계 계산
    const uniqueUserIds = new Set(filteredHistory.map(h => h.userId));
    const byDevice: Record<string, number> = {};
    const byBrowser: Record<string, number> = {};
    const byMethod: Record<string, number> = {};
    
    filteredHistory.forEach(history => {
      if (history.device) {
        byDevice[history.device] = (byDevice[history.device] || 0) + 1;
      }
      if (history.browser) {
        byBrowser[history.browser] = (byBrowser[history.browser] || 0) + 1;
      }
      byMethod[history.loginMethod] = (byMethod[history.loginMethod] || 0) + 1;
    });
    
    return {
      totalLogins: filteredHistory.length,
      uniqueUsers: uniqueUserIds.size,
      byDevice,
      byBrowser,
      byMethod,
    };
  } catch (error) {
    console.error('로그인 통계 조회 실패:', error);
    return {
      totalLogins: 0,
      uniqueUsers: 0,
      byDevice: {},
      byBrowser: {},
      byMethod: {},
    };
  }
};

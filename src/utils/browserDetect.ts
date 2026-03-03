/**
 * 브라우저 감지 유틸리티
 * 카카오톡 인앱 브라우저 등 제한된 환경에서의 분기 처리
 */

/**
 * 카카오톡 인앱 브라우저인지 확인
 */
export const isKakaoTalkBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('kakaotalk');
};

/**
 * 네이버 인앱 브라우저인지 확인
 */
export const isNaverBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('naver');
};

/**
 * 인앱 브라우저인지 확인 (카카오톡, 네이버, 인스타그램, 페이스북 등)
 */
export const isInAppBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes('kakaotalk') ||
    ua.includes('naver') ||
    ua.includes('instagram') ||
    ua.includes('fbav') || // Facebook
    ua.includes('fban') ||
    ua.includes('line/')
  );
};

/**
 * Android 기기인지 확인
 */
export const isAndroid = (): boolean => {
  return /android/i.test(navigator.userAgent);
};

/**
 * iOS 기기인지 확인
 */
export const isIOS = (): boolean => {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
};

/**
 * 외부 브라우저로 열기
 * 카카오톡/네이버 등 인앱 브라우저에서 외부 브라우저로 이동
 * 
 * Android: intent:// 스킴으로 Chrome에서 열기 (가장 확실)
 * iOS: 카카오톡 외부 브라우저 스킴 → 실패 시 Safari 강제 실행
 */
export const openInExternalBrowser = (url?: string): void => {
  const targetUrl = url || window.location.href;
  const ua = navigator.userAgent;

  if (/android/i.test(ua)) {
    // Android: intent scheme + Chrome 패키지 + fallback URL (가장 확실한 방법)
    const intentUrl = 'intent://' +
      targetUrl.replace(/https?:\/\//i, '') +
      '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' +
      encodeURIComponent(targetUrl) + ';end';
    location.replace(intentUrl);
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    // iOS: 카카오톡 공식 외부 브라우저 스킴 (location.replace 사용)
    location.replace(
      'kakaotalk://web/openExternal?url=' + encodeURIComponent(targetUrl)
    );
  } else {
    // 기타: window.open 시도
    window.open(targetUrl, '_blank');
  }
};

/**
 * iOS Safari 강제 실행 (x-web-search 스킴)
 * 카카오톡 외부 브라우저 스킴이 실패했을 때 최후의 수단
 * 클립보드에 URL 복사 후 Safari를 열어 붙여넣기 유도
 */
export const openSafariFallback = async (url?: string): Promise<boolean> => {
  const targetUrl = url || window.location.href;
  const copied = await copyUrlToClipboard(targetUrl);
  if (copied) {
    // x-web-search:// 스킴으로 Safari 강제 실행
    location.href = 'x-web-search://?';
    return true;
  }
  return false;
};

/**
 * URL을 클립보드에 복사
 */
export const copyUrlToClipboard = async (url?: string): Promise<boolean> => {
  const targetUrl = url || window.location.href;
  try {
    await navigator.clipboard.writeText(targetUrl);
    return true;
  } catch {
    // fallback: execCommand
    try {
      const textarea = document.createElement('textarea');
      textarea.value = targetUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
};

import DOMPurify from 'dompurify';

/**
 * 사용자 입력 HTML을 안전하게 정제
 * 허용된 태그와 속성만 남기고 나머지는 제거
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
};

/**
 * 텍스트만 추출 (HTML 태그 완전 제거)
 * 단순 텍스트 표시가 필요한 경우 사용
 */
export const sanitizeText = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
};

/**
 * URL 검증 및 sanitize
 */
export const sanitizeUrl = (url: string): string => {
  const sanitized = DOMPurify.sanitize(url);
  // javascript:, data: 등의 위험한 프로토콜 차단
  if (sanitized.match(/^(javascript|data|vbscript):/i)) {
    return '';
  }
  return sanitized;
};

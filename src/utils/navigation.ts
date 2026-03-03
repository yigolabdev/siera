/**
 * 네비게이션 유틸리티
 *
 * 대부분의 페이지 전환에는 React Router의 navigate()를 사용해야 합니다.
 * navigate()는 전체 페이지 리로드 없이 클라이언트 사이드 라우팅을 수행하므로
 * React 상태가 유지되고 빈 페이지 문제가 발생하지 않습니다.
 *
 * navigateHard는 로그아웃 등 앱 상태를 완전히 초기화해야 하는 경우에만 사용하세요.
 */

/**
 * 전체 페이지 리로드를 수반하는 네비게이션 (하드 리로드)
 *
 * ⚠️ 주의: 이 함수는 React 상태를 모두 초기화합니다.
 * 인증 후 라우팅에는 React Router의 navigate()를 사용하세요.
 *
 * 사용 시점 (제한적):
 * - 로그아웃 후 초기 화면 이동
 * - 앱 상태가 비정상일 때 강제 초기화
 */
export function navigateHard(path: string): void {
  window.location.href = path;
}

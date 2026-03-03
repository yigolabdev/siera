/**
 * 운영진 직책 표시 순서 유틸리티
 * 
 * 회장단: 회장 → 운영위원장 → 등산대장 → 운영감사 → 재무감사
 * 운영위원회: 부위원장 → 재무 → 기획 → 홍보/청년
 */

// 회장단 직책 순서
const CHAIRMAN_POSITION_ORDER: Record<string, number> = {
  '회장': 0,
  '운영위원장': 1,
  '등산대장': 2,
  '운영감사': 3,
  '재무감사': 4,
};

// 운영위원회 직책 순서
const COMMITTEE_POSITION_ORDER: Record<string, number> = {
  '부위원장': 0,
  '재무': 1,
  '기획': 2,
  '홍보/청년': 3,
  '홍보': 4,
  '청년': 5,
};

/**
 * 직책 순서 값을 반환합니다.
 * 정의되지 않은 직책은 마지막에 표시됩니다.
 */
export const getPositionOrder = (category: string, position: string): number => {
  if (category === 'chairman') {
    return CHAIRMAN_POSITION_ORDER[position] ?? 99;
  }
  return COMMITTEE_POSITION_ORDER[position] ?? 99;
};

/**
 * 운영진을 카테고리(회장단 → 운영위원회) 및 직책 순서로 정렬합니다.
 */
export const sortExecutives = <T extends { category: string; position: string }>(
  executives: T[]
): T[] => {
  return [...executives].sort((a, b) => {
    // 1. 카테고리: 회장단(chairman) → 운영위원회(committee)
    const categoryOrder: Record<string, number> = { chairman: 0, committee: 1 };
    const catDiff = (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99);
    if (catDiff !== 0) return catDiff;

    // 2. 같은 카테고리 내 직책 순서
    const posA = getPositionOrder(a.category, a.position);
    const posB = getPositionOrder(b.category, b.position);
    return posA - posB;
  });
};

/**
 * 같은 카테고리 내에서 직책 순서로 정렬합니다.
 */
export const sortByPosition = <T extends { category: string; position: string }>(
  executives: T[],
  category: 'chairman' | 'committee'
): T[] => {
  return [...executives]
    .filter(e => e.category === category)
    .sort((a, b) => {
      const posA = getPositionOrder(category, a.position);
      const posB = getPositionOrder(category, b.position);
      return posA - posB;
    });
};

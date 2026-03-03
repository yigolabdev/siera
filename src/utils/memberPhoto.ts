/**
 * 회원 이름 → 프로필 사진 경로 자동 매핑
 * public/Photo/ 폴더의 파일명과 매칭합니다.
 */

const PHOTO_MAP: Record<string, string> = {
  '감정규': '/Photo/감정규.png',
  '구수현': '/Photo/구수현.png',
  '김금자': '/Photo/김금자.jpg',
  '김대희': '/Photo/김대희.jpg',
  '김만재': '/Photo/김만재.jpg',
  '김명식': '/Photo/김명식.jpg',
  '김명호': '/Photo/김명호.jpg',
  '김미경': '/Photo/김미경.png',
  '김성부': '/Photo/김성부.jpg',
  '김성식': '/Photo/김성식.jpg',
  '김성욱': '/Photo/김성욱.jpg',
  '김성철': '/Photo/김성철.jpg',
  '김순신': '/Photo/김순신.jpg',
  '김시천': '/Photo/김시천.jpg',
  '김연선': '/Photo/김연선.jpg',
  '김영덕': '/Photo/김영덕.jpg',
  '김용우': '/Photo/김용우.jpg',
  '김용훈': '/Photo/김용훈.jpg',
  '김정겸': '/Photo/김정겸.jpg',
  '김종훈': '/Photo/김종훈.jpg',
  '김지문': '/Photo/김지문.jpg',
  '김창일': '/Photo/김창일.jpg',
  '김형문': '/Photo/김형문.jpg',
  '남기열': '/Photo/남기열.png',
  '명수연': '/Photo/명수연.jpg',
  '모신희': '/Photo/모신희.jpg',
  '문소진': '/Photo/문소진.jpg',
  '박내성': '/Photo/박내성.jpg',
  '박보경': '/Photo/박보경.jpg',
  '박재갑': '/Photo/박재갑.jpg',
  '박정호': '/Photo/박정호.jpg',
  '박주성': '/Photo/박주성.jpg',
  '백종훈': '/Photo/백종훈.jpg',
  '복진선': '/Photo/복진선.jpg',
  '서영철': '/Photo/서영철.jpg',
  '서용교': '/Photo/서용교.jpg',
  '서희재': '/Photo/서희재.jpg',
  '성상웅': '/Photo/성상웅.jpg',
  '손문승': '/Photo/손문승.jpg',
  '손인숙': '/Photo/손인숙.jpg',
  '신동기': '/Photo/신동기.jpg',
  '신동배': '/Photo/신동배.jpg',
  '신영인': '/Photo/신영인.jpg',
  '신현암': '/Photo/신현암.jpg',
  '심경택': '/Photo/심경택.jpg',
  '심기석': '/Photo/심기석.jpg',
  '안승준': '/Photo/안승준.jpg',
  '엄태민': '/Photo/엄태민.jpg',
  '오경임': '/Photo/오경임.jpg',
  '유용혁': '/Photo/유용혁.jpg',
  '유종식': '/Photo/유종식.jpg',
  '유희찬': '/Photo/유희찬.jpg',
  '윤재승': '/Photo/윤재승.jpg',
  '이광렬': '/Photo/이광렬.jpg',
  '이동만': '/Photo/이동만P.jpg',
  '조 춘': '/Photo/조춘.jpg',
  '이사라': '/Photo/이사라.jpg',
  '이상국': '/Photo/이상국.jpg',
  '이승도': '/Photo/이승도.jpg',
  '이승현': '/Photo/이승현.jpg',
  '이연근': '/Photo/이연근.jpg',
  '이영복': '/Photo/이영복.jpg',
  '이응정': '/Photo/이응정.jpg',
  '이종덕': '/Photo/이종덕.jpg',
  '이창열': '/Photo/이창열.jpg',
  '이현희': '/Photo/이현희.jpg',
  '인영기': '/Photo/인영기.jpg',
  '장명자': '/Photo/장명자.jpg',
  '전덕희': '/Photo/전덕희.jpg',
  '전성훈': '/Photo/전성훈.jpg',
  '전혜선': '/Photo/전혜선.jpg',
  '정미선': '/Photo/정미선.jpg',
  '정상식': '/Photo/정상식.jpg',
  '정선용': '/Photo/정선용.jpg',
  '정정태': '/Photo/정정태.jpg',
  '정종완': '/Photo/정종완.jpg',
  '정진수': '/Photo/정진수.jpg',
  '정택범': '/Photo/정택범.jpg',
  '정호철': '/Photo/정호철.jpg',
  '조경석': '/Photo/조경석.jpg',
  '조춘': '/Photo/조춘.jpg',
  '주정환': '/Photo/주정환.jpg',
  '지광윤': '/Photo/지광윤.jpg',
  '최동만': '/Photo/최동만.jpg',
  '최두영': '/Photo/최두영.jpg',
  '최성일': '/Photo/최성일.jpg',
  '최원호': '/Photo/최원호.jpg',
  '최인호': '/Photo/최인호.jpg',
  '최종원': '/Photo/최종원.jpg',
  '최창규': '/Photo/최창규.jpg',
  '최태은': '/Photo/최태은.jpg',
  '하태을': '/Photo/하태을.jpg',
  '한재우': '/Photo/한재우.jpg',
  '허명현': '/Photo/허명현.jpg',
  '허빈': '/Photo/허빈.jpg',
  '황유경': '/Photo/황유경.png',
  '황재호': '/Photo/황재호.jpg',
};

/**
 * 동명이인 전화번호 기반 사진 매칭
 * 이름이 같은 회원을 전화번호로 구분하여 올바른 사진을 반환합니다.
 */
const PHONE_PHOTO_MAP: Record<string, string> = {
  '01036762071': '/Photo/이동만P.jpg',  // 이동만 - ㈜케이씨에이 실장
  '01037459933': '/Photo/이동만R.jpg',  // 이동만 - ㈜디엠월드 대표
};

/**
 * 회원 이름으로 프로필 사진 경로를 반환합니다.
 * 우선순위: Firestore profileImage > 전화번호 매칭 > 이름 매칭
 * 
 * @param name 회원 이름
 * @param existingProfileImage Firestore에 저장된 기존 profileImage (선택)
 * @param phoneNumber 전화번호 (동명이인 구분용, 선택)
 * @returns 사진 경로 또는 null
 */
export const getMemberPhoto = (name: string, existingProfileImage?: string | null, phoneNumber?: string): string | null => {
  // Firestore에 저장된 프로필 이미지가 있으면 우선 사용
  if (existingProfileImage) {
    return existingProfileImage;
  }

  // 전화번호 기반 매칭 (동명이인 구분)
  if (phoneNumber) {
    const cleanPhone = phoneNumber.replace(/[-\s]/g, '');
    if (PHONE_PHOTO_MAP[cleanPhone]) {
      return PHONE_PHOTO_MAP[cleanPhone];
    }
  }

  // 이름으로 Photo 폴더에서 매칭
  const trimmedName = name?.trim();
  if (!trimmedName) return null;

  // 1차: 정확한 이름 매칭
  // 2차: 공백 제거 후 매칭 (예: "조 춘" → "조춘")
  return PHOTO_MAP[trimmedName] 
    || PHOTO_MAP[trimmedName.replace(/\s/g, '')] 
    || null;
};

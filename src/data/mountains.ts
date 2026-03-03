/**
 * 한국 산 데이터베이스
 * 100대 명산 + 수도권/강원도 주요 산 포함
 * 출처: 산림청 100대 명산 목록, 국토지리정보원
 */

export interface MountainData {
  name: string;          // 산 이름
  altitude: number;      // 고도 (미터)
  location: string;      // 소재지
  is100Famous?: boolean; // 100대 명산 여부
}

/**
 * 산 이름으로 검색 (부분 일치)
 */
export function searchMountains(query: string): MountainData[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  return MOUNTAINS.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.location.toLowerCase().includes(q)
  ).sort((a, b) => {
    // 이름이 정확히 일치하는 것을 먼저
    const aExact = a.name.toLowerCase() === q;
    const bExact = b.name.toLowerCase() === q;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    // 이름이 시작하는 것을 그 다음
    const aStarts = a.name.toLowerCase().startsWith(q);
    const bStarts = b.name.toLowerCase().startsWith(q);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    // 100대 명산 우선
    if (a.is100Famous && !b.is100Famous) return -1;
    if (!a.is100Famous && b.is100Famous) return 1;
    // 고도 높은 순
    return b.altitude - a.altitude;
  });
}

export const MOUNTAINS: MountainData[] = [
  // ============================
  // 100대 명산
  // ============================
  { name: "가리산", altitude: 1050.9, location: "강원 홍천군·춘천시", is100Famous: true },
  { name: "가리왕산", altitude: 1561.9, location: "강원 정선군·평창군", is100Famous: true },
  { name: "가야산", altitude: 1432.6, location: "경남 합천군·거창군, 경북 성주군", is100Famous: true },
  { name: "가지산", altitude: 1240.9, location: "울산, 경북 청도군, 경남 밀양시", is100Famous: true },
  { name: "감악산", altitude: 674.9, location: "경기 파주시·양주시·연천군", is100Famous: true },
  { name: "강천산", altitude: 583.7, location: "전남 담양군, 전북 순창군", is100Famous: true },
  { name: "계룡산", altitude: 845.1, location: "충남 공주시·계룡시·논산시, 대전", is100Famous: true },
  { name: "계방산", altitude: 1579.1, location: "강원 홍천군·평창군", is100Famous: true },
  { name: "공작산", altitude: 887.0, location: "강원 홍천군", is100Famous: true },
  { name: "관악산", altitude: 632.2, location: "서울 관악구, 경기 안양시·과천시", is100Famous: true },
  { name: "구병산", altitude: 876.5, location: "충북 보은군", is100Famous: true },
  { name: "금산", altitude: 705.0, location: "경남 남해군", is100Famous: true },
  { name: "금수산", altitude: 1015.8, location: "충북 제천시·단양군", is100Famous: true },
  { name: "금오산", altitude: 976.5, location: "경북 구미시·김천시·칠곡군", is100Famous: true },
  { name: "금정산", altitude: 801.5, location: "부산 금정구·북구, 경남 양산시", is100Famous: true },
  { name: "깃대봉", altitude: 585.3, location: "전남 신안군(홍도)", is100Famous: true },
  { name: "남산", altitude: 468.0, location: "경북 경주시", is100Famous: true },
  { name: "내연산", altitude: 710.0, location: "경북 포항시·영덕군", is100Famous: true },
  { name: "내장산", altitude: 763.2, location: "전북 정읍시·순창군", is100Famous: true },
  { name: "대덕산", altitude: 1307.0, location: "강원 태백시·영월군", is100Famous: true },
  { name: "대둔산", altitude: 878.4, location: "충남 논산시·금산군, 전북 완주군", is100Famous: true },
  { name: "대암산", altitude: 1304.0, location: "강원 인제군·양구군", is100Famous: true },
  { name: "대야산", altitude: 930.7, location: "경북 문경시, 충북 괴산군", is100Famous: true },
  { name: "덕유산", altitude: 1614.2, location: "전북 무주군·장수군, 경남 거창군·함양군", is100Famous: true },
  { name: "덕항산", altitude: 1071.0, location: "강원 삼척시·태백시", is100Famous: true },
  { name: "도락산", altitude: 964.0, location: "충북 단양군", is100Famous: true },
  { name: "도봉산", altitude: 739.5, location: "서울 도봉구·강북구, 경기 의정부시·양주시", is100Famous: true },
  { name: "두륜산", altitude: 703.0, location: "전남 해남군", is100Famous: true },
  { name: "두타산", altitude: 1353.0, location: "강원 삼척시·동해시", is100Famous: true },
  { name: "마니산", altitude: 472.1, location: "인천 강화군", is100Famous: true },
  { name: "마이산", altitude: 686.0, location: "전북 진안군", is100Famous: true },
  { name: "명성산", altitude: 922.6, location: "경기 포천시, 강원 철원군", is100Famous: true },
  { name: "명지산", altitude: 1267.3, location: "경기 가평군", is100Famous: true },
  { name: "모악산", altitude: 793.5, location: "전북 김제시·완주군·전주시", is100Famous: true },
  { name: "무등산", altitude: 1186.8, location: "광주 동구·북구, 전남 담양군·화순군", is100Famous: true },
  { name: "무학산", altitude: 761.4, location: "경남 마산시·창원시", is100Famous: true },
  { name: "미륵산", altitude: 461.0, location: "경남 통영시", is100Famous: true },
  { name: "민주지산", altitude: 1241.7, location: "충북 영동군, 경북 김천시, 전북 무주군", is100Famous: true },
  { name: "방장산", altitude: 743.0, location: "전남 장성군, 전북 고창군·정읍시", is100Famous: true },
  { name: "방태산", altitude: 1444.0, location: "강원 인제군·홍천군", is100Famous: true },
  { name: "백덕산", altitude: 1350.0, location: "강원 영월군·평창군", is100Famous: true },
  { name: "백암산", altitude: 741.2, location: "전남 장성군, 전북 정읍시", is100Famous: true },
  { name: "백운산", altitude: 1218.0, location: "전남 광양시", is100Famous: true },
  { name: "변산", altitude: 508.6, location: "전북 부안군", is100Famous: true },
  { name: "북한산", altitude: 836.5, location: "서울 강북구·은평구, 경기 고양시·양주시", is100Famous: true },
  { name: "비슬산", altitude: 1083.6, location: "대구 달성군, 경북 청도군", is100Famous: true },
  { name: "삼악산", altitude: 654.0, location: "강원 춘천시", is100Famous: true },
  { name: "서대산", altitude: 903.5, location: "충남 금산군", is100Famous: true },
  { name: "선운산", altitude: 336.0, location: "전북 고창군", is100Famous: true },
  { name: "설악산", altitude: 1708.0, location: "강원 속초시·인제군·양양군", is100Famous: true },
  { name: "성인봉", altitude: 986.7, location: "경북 울릉군", is100Famous: true },
  { name: "소백산", altitude: 1439.5, location: "충북 단양군, 경북 영주시", is100Famous: true },
  { name: "소요산", altitude: 587.5, location: "경기 동두천시·포천시", is100Famous: true },
  { name: "속리산", altitude: 1057.8, location: "충북 보은군·괴산군, 경북 상주시", is100Famous: true },
  { name: "신불산", altitude: 1159.3, location: "울산 울주군, 경남 양산시·밀양시", is100Famous: true },
  { name: "연화산", altitude: 527.8, location: "경남 고성군", is100Famous: true },
  { name: "오대산", altitude: 1563.4, location: "강원 평창군·홍천군·강릉시", is100Famous: true },
  { name: "오봉산", altitude: 779.0, location: "강원 춘천시·화천군", is100Famous: true },
  { name: "용문산", altitude: 1157.0, location: "경기 양평군", is100Famous: true },
  { name: "용화산", altitude: 878.4, location: "강원 춘천시·화천군", is100Famous: true },
  { name: "운문산", altitude: 1195.0, location: "경북 청도군·경산시, 경남 밀양시", is100Famous: true },
  { name: "운악산", altitude: 935.5, location: "경기 포천시·가평군", is100Famous: true },
  { name: "운장산", altitude: 1126.0, location: "전북 진안군·완주군", is100Famous: true },
  { name: "월악산", altitude: 1094.0, location: "충북 제천시·충주시", is100Famous: true },
  { name: "월출산", altitude: 808.7, location: "전남 영암군·강진군", is100Famous: true },
  { name: "유명산", altitude: 862.0, location: "경기 가평군·양평군", is100Famous: true },
  { name: "응봉산", altitude: 999.0, location: "강원 삼척시", is100Famous: true },
  { name: "장안산", altitude: 1237.0, location: "전북 장수군", is100Famous: true },
  { name: "재약산", altitude: 1108.0, location: "경남 밀양시, 울산 울주군", is100Famous: true },
  { name: "적상산", altitude: 1034.0, location: "전북 무주군", is100Famous: true },
  { name: "점봉산", altitude: 1424.0, location: "강원 인제군·양양군", is100Famous: true },
  { name: "조계산", altitude: 884.0, location: "전남 순천시", is100Famous: true },
  { name: "주왕산", altitude: 720.6, location: "경북 청송군", is100Famous: true },
  { name: "주흘산", altitude: 1106.0, location: "경북 문경시", is100Famous: true },
  { name: "지리산", altitude: 1915.4, location: "경남 함양군·산청군·하동군, 전남 구례군, 전북 남원시", is100Famous: true },
  { name: "지리산(통영)", altitude: 397.0, location: "경남 통영시", is100Famous: true },
  { name: "천관산", altitude: 724.0, location: "전남 장흥군", is100Famous: true },
  { name: "천마산", altitude: 812.4, location: "경기 남양주시", is100Famous: true },
  { name: "천성산", altitude: 920.2, location: "경남 양산시", is100Famous: true },
  { name: "천태산", altitude: 714.7, location: "충북 영동군", is100Famous: true },
  { name: "청량산", altitude: 870.0, location: "경북 봉화군", is100Famous: true },
  { name: "추월산", altitude: 731.0, location: "전남 담양군", is100Famous: true },
  { name: "축령산", altitude: 879.0, location: "강원 춘천시·홍천군", is100Famous: true },
  { name: "치악산", altitude: 1288.0, location: "강원 원주시·횡성군", is100Famous: true },
  { name: "칠갑산", altitude: 561.0, location: "충남 청양군", is100Famous: true },
  { name: "태백산", altitude: 1566.7, location: "강원 태백시·영월군, 경북 봉화군", is100Famous: true },
  { name: "태화산", altitude: 1027.0, location: "강원 영월군", is100Famous: true },
  { name: "팔공산", altitude: 1192.3, location: "대구 동구·군위군, 경북 경산시·영천시·칠곡군", is100Famous: true },
  { name: "팔영산", altitude: 608.6, location: "전남 고흥군", is100Famous: true },
  { name: "한라산", altitude: 1947.3, location: "제주 제주시·서귀포시", is100Famous: true },
  { name: "화악산", altitude: 1468.0, location: "강원 화천군, 경기 가평군", is100Famous: true },
  { name: "화왕산", altitude: 757.2, location: "경남 창녕군", is100Famous: true },
  { name: "황매산", altitude: 1108.0, location: "경남 산청군·합천군", is100Famous: true },
  { name: "황석산", altitude: 1190.0, location: "경남 함양군·거창군", is100Famous: true },
  { name: "황악산", altitude: 1111.4, location: "경북 김천시·충북 영동군", is100Famous: true },
  { name: "황장산", altitude: 1077.0, location: "경북 문경시", is100Famous: true },
  { name: "희양산", altitude: 998.5, location: "경북 문경시, 충북 괴산군", is100Famous: true },

  // ============================
  // 수도권 주요 산
  // ============================
  { name: "수락산", altitude: 637.7, location: "서울 노원구, 경기 의정부시·남양주시" },
  { name: "불암산", altitude: 507.9, location: "서울 노원구·중랑구, 경기 남양주시" },
  { name: "아차산", altitude: 295.7, location: "서울 광진구, 경기 구리시" },
  { name: "인왕산", altitude: 338.2, location: "서울 종로구·서대문구" },
  { name: "안산", altitude: 295.9, location: "서울 서대문구·마포구" },
  { name: "남산", altitude: 262.0, location: "서울 중구·용산구" },
  { name: "청계산", altitude: 618.0, location: "서울 서초구, 경기 성남시·의왕시·과천시" },
  { name: "광교산", altitude: 582.0, location: "경기 수원시·용인시" },
  { name: "수리산", altitude: 489.0, location: "경기 군포시·안양시·안산시" },
  { name: "남한산", altitude: 522.0, location: "경기 광주시·성남시·하남시" },
  { name: "검단산", altitude: 657.2, location: "경기 하남시·광주시" },
  { name: "앵무봉", altitude: 622.0, location: "경기 양평군" },
  { name: "축령산(남양주)", altitude: 886.0, location: "경기 남양주시·가평군" },
  { name: "화야산", altitude: 755.8, location: "경기 가평군" },
  { name: "연인산", altitude: 1068.0, location: "경기 가평군·포천시" },
  { name: "종자산", altitude: 805.0, location: "경기 포천시" },
  { name: "왕방산", altitude: 737.2, location: "강원 춘천시" },
  { name: "대모산", altitude: 293.0, location: "서울 강남구·서초구" },
  { name: "구룡산", altitude: 306.0, location: "서울 서초구·강남구" },
  { name: "우면산", altitude: 293.0, location: "서울 서초구·관악구" },
  { name: "봉화산", altitude: 147.7, location: "서울 중랑구" },
  { name: "매봉산", altitude: 347.5, location: "경기 양주시" },
  { name: "천보산", altitude: 423.0, location: "경기 포천시" },

  // ============================
  // 강원도 주요 산
  // ============================
  { name: "발왕산", altitude: 1458.0, location: "강원 평창군" },
  { name: "함백산", altitude: 1573.0, location: "강원 태백시·정선군" },
  { name: "매봉산(태백)", altitude: 1303.0, location: "강원 태백시" },
  { name: "두위봉", altitude: 1466.0, location: "강원 정선군·평창군" },
  { name: "백석산", altitude: 1365.0, location: "강원 인제군" },
  { name: "민둥산", altitude: 1118.8, location: "강원 정선군" },
  { name: "가덕산", altitude: 1186.0, location: "강원 횡성군" },
  { name: "향로봉", altitude: 1296.0, location: "강원 인제군" },
  { name: "청태산", altitude: 1200.0, location: "강원 횡성군·평창군" },
  { name: "봉복산", altitude: 1022.0, location: "강원 춘천시·홍천군" },
  { name: "오음산", altitude: 930.0, location: "강원 홍천군" },
  { name: "팔봉산", altitude: 327.0, location: "강원 홍천군" },
  { name: "대관령", altitude: 832.0, location: "강원 평창군·강릉시" },

  // ============================
  // 충청도 주요 산
  // ============================
  { name: "천안 광덕산", altitude: 699.0, location: "충남 천안시" },
  { name: "덕숭산", altitude: 495.0, location: "충남 예산군" },
  { name: "오서산", altitude: 791.0, location: "충남 보령시·홍성군" },
  { name: "성주산", altitude: 680.0, location: "충남 보령시" },
  { name: "망이산", altitude: 472.0, location: "충북 진천군" },
  { name: "좌구산", altitude: 657.0, location: "충북 괴산군" },

  // ============================
  // 경상도 주요 산
  // ============================
  { name: "토함산", altitude: 745.0, location: "경북 경주시" },
  { name: "영남알프스", altitude: 1240.0, location: "울산·경남·경북" },
  { name: "무학산(마산)", altitude: 761.4, location: "경남 창원시" },
  { name: "비봉산", altitude: 672.0, location: "경남 거제시" },
  { name: "천성산(원효산)", altitude: 920.0, location: "경남 양산시" },
  { name: "금관산", altitude: 580.0, location: "부산 서구" },

  // ============================
  // 전라도 주요 산
  // ============================
  { name: "백양산", altitude: 741.0, location: "전남 장성군" },
  { name: "축령산(전남)", altitude: 621.0, location: "전남 장성군" },
  { name: "불갑산", altitude: 516.0, location: "전남 영광군" },
  { name: "천봉산", altitude: 638.0, location: "전남 장흥군" },
  { name: "제암산", altitude: 807.0, location: "전남 보성군·장흥군" },
  { name: "유달산", altitude: 228.3, location: "전남 목포시" },
  { name: "경각산", altitude: 578.0, location: "전북 무주군" },
  { name: "모래재", altitude: 472.0, location: "전북 남원시" },

  // ============================
  // 제주도 주요 산
  // ============================
  { name: "성산일출봉", altitude: 179.0, location: "제주 서귀포시" },
  { name: "산방산", altitude: 395.2, location: "제주 서귀포시" },
  { name: "한라산 영실", altitude: 1700.0, location: "제주 서귀포시" },
  { name: "사라오름", altitude: 1324.0, location: "제주 제주시" },
  { name: "어리목", altitude: 1700.0, location: "제주 제주시" },
];

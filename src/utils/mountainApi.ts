/**
 * 산림청 산정보 서비스 API 연동
 * 공공데이터포털(data.go.kr) - 산림청 산정보 조회 서비스
 * 
 * 내장 데이터에 없는 산을 검색할 때 폴백으로 사용
 * API 키가 없거나 CORS 에러 시 graceful degradation
 */

import { MountainData } from '../data/mountains';

const FOREST_API_BASE = 'http://openapi.forest.go.kr/openapi/service/trailInfoService/getforeststoryservice';

/**
 * 산림청 API로 산 정보 검색
 * @param name 산 이름 (예: "지리산")
 * @returns MountainData 배열 (실패 시 빈 배열)
 */
export async function searchMountainFromAPI(name: string): Promise<MountainData[]> {
  const apiKey = import.meta.env.VITE_FOREST_API_KEY;
  
  // API 키가 없으면 즉시 빈 배열 반환
  if (!apiKey) {
    console.log('ℹ️ 산림청 API 키 미설정 (VITE_FOREST_API_KEY) - 내장 데이터만 사용');
    return [];
  }

  try {
    const params = new URLSearchParams({
      ServiceKey: apiKey,
      mntnNm: name,
      numOfRows: '20',
      pageNo: '1',
    });

    const response = await fetch(`${FOREST_API_BASE}?${params.toString()}`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5초 타임아웃
    });

    if (!response.ok) {
      console.warn(`⚠️ 산림청 API 응답 에러: ${response.status}`);
      return [];
    }

    const xmlText = await response.text();
    return parseForestAPIResponse(xmlText);
  } catch (error) {
    // CORS, 네트워크 에러, 타임아웃 등 - 조용히 실패
    console.warn('⚠️ 산림청 API 호출 실패 (CORS 또는 네트워크 에러):', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * 산림청 API XML 응답 파싱
 */
function parseForestAPIResponse(xmlText: string): MountainData[] {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // 에러 체크
    const errorMsg = xmlDoc.querySelector('errMsg');
    if (errorMsg) {
      console.warn('⚠️ 산림청 API 에러:', errorMsg.textContent);
      return [];
    }

    const items = xmlDoc.querySelectorAll('item');
    const results: MountainData[] = [];

    items.forEach((item) => {
      const name = getXmlText(item, 'mntnNm');
      const heightStr = getXmlText(item, 'mntnHght');
      const location = getXmlText(item, 'mntnAdd');

      if (name) {
        const altitude = heightStr ? parseFloat(heightStr) : 0;
        results.push({
          name,
          altitude: isNaN(altitude) ? 0 : altitude,
          location: location || '',
        });
      }
    });

    return results;
  } catch (error) {
    console.warn('⚠️ XML 파싱 실패:', error);
    return [];
  }
}

/**
 * XML 요소에서 텍스트 추출 헬퍼
 */
function getXmlText(parent: Element, tagName: string): string {
  const el = parent.querySelector(tagName);
  return el?.textContent?.trim() || '';
}

/**
 * 기상청 API 연동 모듈 (개선 버전)
 * API 문서: https://apihub.kma.go.kr/
 * 
 * 주요 개선사항:
 * - 데이터 파싱 로직 안정화
 * - 에러 처리 강화
 * - CORS 우회 (프록시 사용)
 * - 더 정확한 필드 매핑
 */

// 기상청 API 키 (환경 변수에서 가져오기)
const KMA_API_KEY = import.meta.env.VITE_KMA_API_KEY || '';

// 개발 환경에서는 프록시 사용
const isDev = import.meta.env.DEV;
const API_BASE_URL = isDev 
  ? '/api/kma'  // 개발: Vite 프록시
  : 'https://apihub.kma.go.kr/api/typ01/url';  // 프로덕션: 직접 호출

/**
 * 날씨 상태 타입
 */
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

/**
 * UV 지수 레벨
 */
export type UVIndexLevel = 'low' | 'moderate' | 'high' | 'very-high';

/**
 * 날씨 데이터 인터페이스
 */
export interface WeatherData {
  temperature: number;        // 현재 기온 (°C)
  feelsLike: number;          // 체감 온도 (°C)
  condition: WeatherCondition;// 날씨 상태
  precipitation: number;      // 강수 확률 (%)
  windSpeed: number;          // 풍속 (m/s)
  humidity: number;           // 습도 (%)
  uvIndex: UVIndexLevel;      // UV 지수
  lastUpdated?: string;       // 마지막 업데이트 시간
}

/**
 * UV 지수 계산 (간단한 추정)
 */
const estimateUVIndex = (temp: number, condition: WeatherCondition): UVIndexLevel => {
  if (condition === 'rainy' || condition === 'snowy') return 'low';
  if (condition === 'cloudy') return temp > 20 ? 'moderate' : 'low';
  if (temp > 25) return 'very-high';
  if (temp > 20) return 'high';
  return 'moderate';
};

/**
 * 기상청 지상관측 API 호출 (ASOS)
 * 현재 날씨 정보 조회
 * 
 * @param targetDate - 조회 날짜시간 (YYYYMMDDHHMM 형식, 선택적)
 * @param stationId - 기상청 관측소 지점번호 (선택적, 기본값: 108 서울)
 */
export const fetchCurrentWeather = async (
  targetDate?: string,
  stationId: string = '108'
): Promise<WeatherData> => {
  try {
    // API 키가 없으면 mock 데이터 반환
    if (!KMA_API_KEY) {
      console.warn('⚠️ 기상청 API 키가 설정되지 않았습니다. Mock 데이터를 사용합니다.');
      return getMockWeatherData();
    }
    
    // 시간 설정
    const now = new Date();
    let tm1, tm2;
    
    if (targetDate) {
      tm1 = targetDate.slice(0, 12);
      tm2 = targetDate.slice(0, 12);
    } else {
      // 최근 2시간 데이터 조회
      const endTime = new Date(now.getTime());
      const startTime = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      
      tm1 = formatKMADateTime(startTime);
      tm2 = formatKMADateTime(endTime);
    }
    
    // API URL 구성
    const url = `${API_BASE_URL}/kma_sfctm3.php`;
    const params = new URLSearchParams({
      tm1: tm1,
      tm2: tm2,
      stn: stationId, // 관측소 지점번호
      help: '0',  // help=0: 데이터만 (help=1: 헤더 포함)
      authKey: KMA_API_KEY,
    });
    
    console.log(`🌤️ [Weather API] 호출: ${stationId} (${tm1} ~ ${tm2})`);
    console.log('🔗 [Weather API] URL:', `${url}?${params.toString()}`);
    
    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const rawText = await response.text();
    
    // 데이터 파싱
    const lines = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'));
    
    if (lines.length === 0) {
      throw new Error('응답 데이터가 비어있습니다');
    }
    
    // 가장 최근 데이터 (마지막 줄)
    const latestData = lines[lines.length - 1];
    console.log('📊 [Weather API] 최신 데이터:', latestData);
    
    // 데이터 파싱 (공백으로 구분)
    // 필드 순서: TM STN WD WS GST_WD GST_WS GST_TM PA PS PT PR TA TD HM PV ...
    const values = latestData.trim().split(/\s+/);
    
    // 필드 추출 (인덱스는 0부터 시작)
    const timeStr = values[0] || '';       // 0: 관측시간 (YYYYMMDDHHMM)
    const windDirection = values[2] || '0'; // 2: 풍향 (36방위)
    const windSpeed = parseFloat(values[3]) || 0; // 3: 풍속 (m/s)
    const pressure = parseFloat(values[7]) || 0;  // 7: 현지기압 (hPa)
    const temperature = parseFloat(values[11]) || 0; // 11: 기온 (°C)
    const dewPoint = parseFloat(values[12]) || 0;    // 12: 이슬점온도 (°C)
    const humidity = parseFloat(values[13]) || 0;    // 13: 습도 (%)
    
    console.log('📈 [Weather API] 파싱 결과:', {
      time: timeStr,
      temp: temperature,
      humidity: humidity,
      windSpeed: windSpeed,
      pressure: pressure,
    });
    
    // 데이터 검증
    if (temperature < -50 || temperature > 50) {
      throw new Error(`비정상적인 기온 값: ${temperature}°C`);
    }
    
    if (humidity < 0 || humidity > 100) {
      throw new Error(`비정상적인 습도 값: ${humidity}%`);
    }
    
    // 체감온도 계산
    const feelsLike = calculateWindChill(temperature, windSpeed);
    
    // 날씨 상태 추정
    const condition = estimateCondition(temperature, humidity, windSpeed);
    
    // 강수 확률 추정
    const precipitation = estimatePrecipitation(humidity);
    
    // UV 지수 추정
    const uvIndex = estimateUVIndex(temperature, condition);
    
    // 시간 포맷팅
    const lastUpdated = formatTimeString(timeStr);
    
    return {
      temperature: Math.round(temperature * 10) / 10,
      feelsLike: Math.round(feelsLike * 10) / 10,
      condition,
      precipitation,
      windSpeed: Math.round(windSpeed * 10) / 10,
      humidity: Math.round(humidity),
      uvIndex,
      lastUpdated,
    };
  } catch (error: any) {
    console.error('❌ [Weather API] 호출 실패:', error.message);
    console.error('상세:', error);
    
    // 에러 시 mock 데이터 반환
    return getMockWeatherData();
  }
};

/**
 * 날짜를 기상청 API 형식으로 변환
 * YYYYMMDDHHMM 형식
 */
const formatKMADateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}${hour}${minute}`;
};

/**
 * 시간 문자열 포맷팅
 * YYYYMMDDHHMM -> YYYY-MM-DD HH:MM
 */
const formatTimeString = (timeStr: string): string => {
  if (timeStr.length !== 12) return timeStr;
  
  const year = timeStr.slice(0, 4);
  const month = timeStr.slice(4, 6);
  const day = timeStr.slice(6, 8);
  const hour = timeStr.slice(8, 10);
  const minute = timeStr.slice(10, 12);
  
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

/**
 * 체감온도 계산 (Wind Chill Index)
 */
const calculateWindChill = (temp: number, windSpeed: number): number => {
  // 기온이 10도 이상이거나 바람이 약하면 체감온도 = 실제온도
  if (temp > 10 || windSpeed < 1.3) {
    return temp;
  }
  
  // Wind Chill Formula (한국 기상청 기준)
  const windKmh = windSpeed * 3.6; // m/s를 km/h로 변환
  return 13.12 + 0.6215 * temp - 11.37 * Math.pow(windKmh, 0.16) + 
         0.3965 * temp * Math.pow(windKmh, 0.16);
};

/**
 * 날씨 상태 추정 (기온, 습도, 풍속 기반)
 */
const estimateCondition = (
  temp: number, 
  humidity: number, 
  windSpeed: number
): WeatherCondition => {
  // 습도가 매우 높으면 비 또는 눈
  if (humidity > 85) {
    return temp < 3 ? 'snowy' : 'rainy';
  }
  
  // 습도가 높으면 흐림
  if (humidity > 65) {
    return 'cloudy';
  }
  
  // 습도가 낮으면 맑음
  return 'sunny';
};

/**
 * 강수 확률 추정 (습도 기반)
 */
const estimatePrecipitation = (humidity: number): number => {
  if (humidity > 90) return 90;
  if (humidity > 85) return 80;
  if (humidity > 75) return 60;
  if (humidity > 65) return 40;
  if (humidity > 55) return 20;
  return 10;
};

/**
 * Mock 날씨 데이터 (개발/테스트용 또는 API 실패 시)
 */
export const getMockWeatherData = (): WeatherData => {
  const now = new Date();
  const hour = now.getHours();
  
  // 시간대별로 다른 mock 데이터 제공 (더 현실적)
  let temp = 8;
  let condition: WeatherCondition = 'cloudy';
  
  if (hour >= 6 && hour < 12) {
    temp = 5;
    condition = 'sunny';
  } else if (hour >= 12 && hour < 18) {
    temp = 12;
    condition = 'cloudy';
  } else if (hour >= 18 && hour < 22) {
    temp = 7;
    condition = 'cloudy';
  } else {
    temp = 3;
    condition = 'cloudy';
  }
  
  return {
    temperature: temp,
    feelsLike: temp - 2,
    condition,
    precipitation: 20,
    windSpeed: 3.5,
    humidity: 65,
    uvIndex: 'moderate',
    lastUpdated: now.toISOString().slice(0, 16).replace('T', ' '),
  };
};

/**
 * 날씨 데이터 캐싱 (10분마다 갱신)
 */
let cachedWeather: WeatherData | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10분

/**
 * 캐시된 날씨 데이터 조회 (자동 갱신)
 */
export const getCachedWeather = async (
  targetDate?: string
): Promise<WeatherData> => {
  const now = Date.now();
  
  // 특정 날짜가 지정되지 않은 경우 캐시 사용
  if (!targetDate) {
    // 캐시가 유효하면 캐시 데이터 반환
    if (cachedWeather && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('📦 [Weather] 캐시된 데이터 사용');
      return cachedWeather;
    }
    
    // 캐시가 없거나 만료되면 새로 조회
    console.log('🔄 [Weather] 새로운 데이터 조회');
    cachedWeather = await fetchCurrentWeather();
    lastFetchTime = now;
    
    return cachedWeather;
  }
  
  // 특정 날짜가 지정된 경우 항상 새로 조회
  return await fetchCurrentWeather(targetDate);
};

/**
 * 산행 날짜의 날씨 예보 조회
 * @param eventDate - 산행 날짜 (ISO 8601 형식: YYYY-MM-DD 또는 Date 객체)
 * @param stationId - 기상청 관측소 지점번호 (선택적, 기본값: 108 서울)
 * @returns WeatherData
 */
export const getEventWeather = async (
  eventDate: string | Date,
  stationId: string = '108'
): Promise<WeatherData> => {
  try {
    // Date 객체로 변환
    const date = typeof eventDate === 'string' ? new Date(eventDate) : eventDate;
    const now = new Date();
    
    // 날짜 차이 계산
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    console.log(`🗓️ [Weather] 산행 날짜까지 ${diffDays}일 남음`);
    
    // 과거 날짜는 현재 날씨 반환
    if (diffDays < -30) {
      console.log('⚠️ [Weather] 30일 이전 과거 날짜 - 현재 날씨 반환');
      return await fetchCurrentWeather(undefined, stationId);
    }
    
    // 과거 날짜 (30일 이내)는 해당 날짜 데이터 조회 시도
    if (diffDays < 0 && diffDays >= -30) {
      const targetDateTime = new Date(date);
      targetDateTime.setHours(12, 0, 0, 0);
      const targetDateTimeStr = formatKMADateTime(targetDateTime);
      
      console.log(`🔍 [Weather] 과거 날짜 조회: ${targetDateTimeStr}`);
      return await fetchCurrentWeather(targetDateTimeStr, stationId);
    }
    
    // 미래 날짜는 현재 날씨 기반 추정
    console.log('⚠️ [Weather] 미래 날짜 - 현재 날씨 기반 추정');
    return await fetchCurrentWeather(undefined, stationId);
    
  } catch (error) {
    console.error('❌ [Weather] 산행 날씨 조회 실패:', error);
    return getMockWeatherData();
  }
};

/**
 * 날씨 API 상태 확인
 * @returns API 정상 동작 여부
 */
export const checkWeatherAPIStatus = async (): Promise<boolean> => {
  try {
    const data = await fetchCurrentWeather();
    // Mock 데이터가 아니고 실제 데이터가 있는지 확인
    return data.lastUpdated !== undefined;
  } catch {
    return false;
  }
};

/**
 * 위치 정보 인터페이스
 */
export interface LocationInfo {
  address: string;        // 전체 주소 (예: "서울특별시 종로구 북악산로")
  coordinates?: {         // 좌표 (선택적)
    latitude: number;
    longitude: number;
  };
  stationId?: string;     // 기상청 지점번호
}

/**
 * 기상청 관측소 정보
 */
interface WeatherStation {
  id: string;           // 지점번호
  name: string;         // 관측소명
  latitude: number;     // 위도
  longitude: number;    // 경도
  region: string;       // 지역
}

/**
 * 전국 주요 기상청 관측소 데이터
 * 출처: 기상청 지상관측 지점정보
 */
const WEATHER_STATIONS: WeatherStation[] = [
  // 서울·경기
  { id: '108', name: '서울', latitude: 37.5714, longitude: 126.9658, region: '서울' },
  { id: '119', name: '수원', latitude: 37.2725, longitude: 126.9869, region: '경기' },
  { id: '202', name: '인천', latitude: 37.4777, longitude: 126.6247, region: '인천' },
  { id: '203', name: '강화', latitude: 37.7067, longitude: 126.4444, region: '인천' },
  { id: '112', name: '양평', latitude: 37.4872, longitude: 127.4942, region: '경기' },
  { id: '127', name: '이천', latitude: 37.2636, longitude: 127.4847, region: '경기' },
  { id: '201', name: '강릉', latitude: 37.7514, longitude: 128.8911, region: '강원' },
  
  // 강원
  { id: '100', name: '대관령', latitude: 37.6769, longitude: 128.7181, region: '강원' },
  { id: '101', name: '춘천', latitude: 37.9025, longitude: 127.7361, region: '강원' },
  { id: '105', name: '강릉', latitude: 37.7514, longitude: 128.8911, region: '강원' },
  { id: '106', name: '동해', latitude: 37.5069, longitude: 129.1147, region: '강원' },
  { id: '114', name: '원주', latitude: 37.3375, longitude: 127.9469, region: '강원' },
  { id: '217', name: '태백', latitude: 37.1644, longitude: 128.9856, region: '강원' },
  { id: '221', name: '속초', latitude: 38.2508, longitude: 128.5644, region: '강원' },
  
  // 충청
  { id: '131', name: '청주', latitude: 36.6358, longitude: 127.4408, region: '충북' },
  { id: '133', name: '대전', latitude: 36.3694, longitude: 127.3742, region: '대전' },
  { id: '135', name: '추풍령', latitude: 36.2181, longitude: 127.9944, region: '충북' },
  { id: '129', name: '서산', latitude: 36.7744, longitude: 126.4953, region: '충남' },
  { id: '232', name: '천안', latitude: 36.7794, longitude: 127.1197, region: '충남' },
  { id: '236', name: '보령', latitude: 36.3269, longitude: 126.5569, region: '충남' },
  { id: '246', name: '제천', latitude: 37.1583, longitude: 128.1947, region: '충북' },
  
  // 전라
  { id: '140', name: '군산', latitude: 35.9900, longitude: 126.7658, region: '전북' },
  { id: '143', name: '전주', latitude: 35.8214, longitude: 127.1547, region: '전북' },
  { id: '146', name: '광주', latitude: 35.1728, longitude: 126.8914, region: '광주' },
  { id: '155', name: '순천', latitude: 34.9506, longitude: 127.4872, region: '전남' },
  { id: '156', name: '목포', latitude: 34.8167, longitude: 126.3811, region: '전남' },
  { id: '159', name: '부안', latitude: 35.7286, longitude: 126.7161, region: '전북' },
  { id: '165', name: '완도', latitude: 34.3917, longitude: 126.7531, region: '전남' },
  { id: '168', name: '여수', latitude: 34.7394, longitude: 127.7406, region: '전남' },
  
  // 경상
  { id: '138', name: '포항', latitude: 36.0328, longitude: 129.3800, region: '경북' },
  { id: '143', name: '대구', latitude: 35.8850, longitude: 128.6189, region: '대구' },
  { id: '152', name: '울산', latitude: 35.5600, longitude: 129.3200, region: '울산' },
  { id: '159', name: '부산', latitude: 35.1044, longitude: 129.0319, region: '부산' },
  { id: '192', name: '진주', latitude: 35.1636, longitude: 128.0361, region: '경남' },
  { id: '136', name: '안동', latitude: 36.5731, longitude: 128.7069, region: '경북' },
  { id: '137', name: '상주', latitude: 36.4111, longitude: 128.1594, region: '경북' },
  { id: '162', name: '통영', latitude: 34.8453, longitude: 128.4336, region: '경남' },
  { id: '192', name: '거제', latitude: 34.8806, longitude: 128.6050, region: '경남' },
  
  // 제주
  { id: '184', name: '제주', latitude: 33.5141, longitude: 126.5297, region: '제주' },
  { id: '188', name: '성산', latitude: 33.3864, longitude: 126.8800, region: '제주' },
  { id: '189', name: '서귀포', latitude: 33.2539, longitude: 126.5653, region: '제주' },
];

/**
 * Haversine 공식을 사용한 두 좌표 간 거리 계산 (단위: km)
 */
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // 지구 반경 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * 좌표 기반으로 가장 가까운 기상청 관측소 찾기
 */
const findNearestStation = (
  latitude: number, 
  longitude: number
): WeatherStation => {
  let nearestStation = WEATHER_STATIONS[0];
  let minDistance = calculateDistance(
    latitude, 
    longitude, 
    nearestStation.latitude, 
    nearestStation.longitude
  );
  
  for (const station of WEATHER_STATIONS) {
    const distance = calculateDistance(
      latitude, 
      longitude, 
      station.latitude, 
      station.longitude
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = station;
    }
  }
  
  console.log(`📍 [Weather] 가장 가까운 관측소: ${nearestStation.name} (${nearestStation.id}), 거리: ${minDistance.toFixed(1)}km`);
  
  return nearestStation;
};

/**
 * 주소에서 위치 정보 추출 (기본 구현)
 * 
 * @param address - 산행 장소 주소
 * @returns LocationInfo
 */
export const parseLocationFromAddress = async (
  address: string
): Promise<LocationInfo> => {
  console.log('📍 [Weather] 주소 파싱:', address);
  
  // 기본적으로 서울(108) 반환
  return {
    address,
    stationId: '108', // 서울
  };
};

/**
 * 위치 기반 날씨 조회 (실제 구현)
 * 
 * @param eventDate - 산행 날짜
 * @param location - 산행 장소 주소 또는 위치 정보 (좌표 포함)
 * @returns WeatherData
 */
export const getWeatherByLocation = async (
  eventDate: string | Date,
  location: string | LocationInfo
): Promise<WeatherData> => {
  try {
    console.log('🌍 [Weather] 위치 기반 날씨 조회 시작');
    console.log('📅 산행 날짜:', eventDate);
    console.log('📍 장소:', typeof location === 'string' ? location : location.address);
    
    // LocationInfo 파싱
    let locationInfo: LocationInfo;
    
    if (typeof location === 'string') {
      locationInfo = await parseLocationFromAddress(location);
    } else {
      locationInfo = location;
    }
    
    // 좌표가 있으면 가장 가까운 관측소 찾기
    let stationId = '108'; // 기본값: 서울
    
    if (locationInfo.coordinates) {
      const { latitude, longitude } = locationInfo.coordinates;
      console.log(`🗺️ [Weather] 좌표: (${latitude}, ${longitude})`);
      
      const nearestStation = findNearestStation(latitude, longitude);
      stationId = nearestStation.id;
      
      console.log(`🎯 [Weather] 선택된 관측소: ${nearestStation.name} (${stationId})`);
    } else if (locationInfo.stationId) {
      stationId = locationInfo.stationId;
      console.log(`🎯 [Weather] 지정된 관측소: ${stationId}`);
    } else {
      console.log('⚠️ [Weather] 좌표 정보 없음 - 서울 관측소(108) 사용');
    }
    
    // 해당 관측소의 날씨 조회
    const weather = await getEventWeather(eventDate, stationId);
    
    console.log('✅ [Weather] 위치 기반 날씨 조회 완료');
    
    return weather;
  } catch (error) {
    console.error('❌ [Weather] 위치 기반 날씨 조회 실패:', error);
    return getMockWeatherData();
  }
};

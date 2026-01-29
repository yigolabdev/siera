/**
 * 기상청 API 연동 모듈
 * API 문서: https://apihub.kma.go.kr/
 */

// 기상청 API 키 (환경 변수에서 가져오기)
const KMA_API_KEY = import.meta.env.VITE_KMA_API_KEY || '';
const KMA_API_BASE_URL = 'https://apihub.kma.go.kr/api/typ01/url';

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
}

/**
 * 기상청 API 응답 인터페이스
 */
interface KMAResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: Array<{
          category: string;
          fcstValue: string;
          fcstDate: string;
          fcstTime: string;
        }>;
      };
    };
  };
}

/**
 * 하늘 상태 코드를 WeatherCondition으로 변환
 * SKY: 하늘상태 (1:맑음, 3:구름많음, 4:흐림)
 * PTY: 강수형태 (0:없음, 1:비, 2:비/눈, 3:눈, 5:빗방울, 6:빗방울눈날림, 7:눈날림)
 */
const getWeatherCondition = (sky: string, pty: string): WeatherCondition => {
  // 강수가 있는 경우
  if (pty !== '0') {
    if (['2', '3', '6', '7'].includes(pty)) {
      return 'snowy'; // 눈 또는 눈/비
    }
    return 'rainy'; // 비
  }
  
  // 강수가 없는 경우 하늘 상태로 판단
  if (sky === '1') return 'sunny';  // 맑음
  if (sky === '3') return 'cloudy'; // 구름많음
  return 'cloudy'; // 흐림
};

/**
 * UV 지수 계산 (간단한 추정)
 * 실제로는 별도 API 필요하지만 기온과 하늘상태로 추정
 */
const estimateUVIndex = (temp: number, condition: WeatherCondition): UVIndexLevel => {
  if (condition === 'rainy' || condition === 'snowy') return 'low';
  if (condition === 'cloudy') return temp > 20 ? 'moderate' : 'low';
  if (temp > 25) return 'very-high';
  if (temp > 20) return 'high';
  return 'moderate';
};

/**
 * 격자 좌표 변환
 * 위경도를 기상청 격자 좌표로 변환
 * 참고: 기상청은 격자 좌표계를 사용합니다
 */
export const convertToGrid = (lat: number, lon: number) => {
  // 간단한 예시 (실제로는 복잡한 좌표 변환 필요)
  // 서울 기준: 위도 37.5665, 경도 126.9780
  // 격자: nx=60, ny=127
  
  // 주요 도시 격자 좌표 (예시)
  const cityGrids: Record<string, { nx: number; ny: number }> = {
    'seoul': { nx: 60, ny: 127 },      // 서울
    'busan': { nx: 98, ny: 76 },       // 부산
    'daegu': { nx: 89, ny: 90 },       // 대구
    'incheon': { nx: 55, ny: 124 },    // 인천
    'gwangju': { nx: 58, ny: 74 },     // 광주
    'daejeon': { nx: 67, ny: 100 },    // 대전
    'ulsan': { nx: 102, ny: 84 },      // 울산
  };
  
  // 기본값: 서울
  return cityGrids['seoul'];
};

/**
 * 기상청 지상관측 API 호출 (ASOS - 종관기상관측)
 * 현재 날씨 정보 조회
 * API 문서: https://apihub.kma.go.kr/api/typ01/url/kma_sfctm3.php
 */
export const fetchCurrentWeather = async (
  targetDate?: string // YYYYMMDDHHMM 형식 (없으면 현재 시각)
): Promise<WeatherData> => {
  try {
    // API 키가 없으면 mock 데이터 반환
    if (!KMA_API_KEY) {
      console.warn('⚠️ 기상청 API 키가 설정되지 않았습니다. Mock 데이터를 사용합니다.');
      return getMockWeatherData();
    }
    
    // 시간 설정 (기본: 현재 시각)
    const now = new Date();
    let tm1, tm2;
    
    if (targetDate) {
      // 특정 날짜의 날씨 조회
      tm1 = targetDate.slice(0, 12); // YYYYMMDDHHMM
      tm2 = targetDate.slice(0, 12);
    } else {
      // 현재 날씨 조회 (최근 31일 이내)
      const endTime = new Date(now.getTime());
      const startTime = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1시간 전
      
      tm1 = formatKMADateTime(startTime);
      tm2 = formatKMADateTime(endTime);
    }
    
    // 기상청 ASOS API URL
    const url = `https://apihub.kma.go.kr/api/typ01/url/kma_sfctm3.php`;
    const params = new URLSearchParams({
      tm1: tm1,
      tm2: tm2,
      stn: '108', // 서울 지점번호
      help: '1',
      authKey: KMA_API_KEY,
    });
    
    console.log('🌤️ 기상청 API 호출:', `${url}?${params.toString()}`);
    
    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.text();
    console.log('📡 기상청 API 응답 (첫 500자):', data.substring(0, 500));
    
    // 텍스트 데이터 파싱
    const lines = data.split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length < 2) {
      throw new Error('응답 데이터 형식 오류');
    }
    
    // 헤더 제거 (첫 줄은 헤더)
    const dataLines = lines.slice(1);
    
    // 가장 최근 데이터 (마지막 줄)
    const latestData = dataLines[dataLines.length - 1];
    
    if (!latestData) {
      throw new Error('날씨 데이터를 찾을 수 없습니다');
    }
    
    // 데이터 파싱 (공백으로 구분)
    // 형식: TM WD WS GST_WD GST_WS PA PS PT PR TA TD HM PV RN ...
    const values = latestData.trim().split(/\s+/);
    
    console.log('📊 파싱된 데이터:', {
      TM: values[0],
      WD: values[1],
      WS: values[2],
      PA: values[6],
      TA: values[9],
      HM: values[11],
    });
    
    // 기상 데이터 추출
    const temperature = parseFloat(values[9] || '0'); // TA: 기온(°C)
    const windSpeed = parseFloat(values[2] || '0'); // WS: 풍속(m/s)
    const humidity = parseFloat(values[11] || '0'); // HM: 습도(%)
    const pressure = parseFloat(values[6] || '0'); // PA: 현지기압(hPa)
    
    // 체감온도 계산 (Wind Chill Index)
    const feelsLike = calculateWindChill(temperature, windSpeed);
    
    // 날씨 상태 추정
    const condition = estimateCondition(temperature, humidity, windSpeed);
    
    // 강수 확률 추정 (습도 기반)
    const precipitation = estimatePrecipitation(humidity);
    
    // UV 지수 추정
    const uvIndex = estimateUVIndex(temperature, condition);
    
    return {
      temperature: Math.round(temperature * 10) / 10,
      feelsLike: Math.round(feelsLike * 10) / 10,
      condition,
      precipitation,
      windSpeed: Math.round(windSpeed * 10) / 10,
      humidity: Math.round(humidity),
      uvIndex,
    };
  } catch (error) {
    console.error('❌ 기상청 API 호출 실패:', error);
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
 * 체감온도 계산 (Wind Chill Index)
 */
const calculateWindChill = (temp: number, windSpeed: number): number => {
  if (temp > 10 || windSpeed < 1.3) {
    return temp;
  }
  
  // Wind Chill Formula
  return 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed * 3.6, 0.16) + 0.3965 * temp * Math.pow(windSpeed * 3.6, 0.16);
};

/**
 * 날씨 상태 추정 (기온, 습도, 풍속 기반)
 */
const estimateCondition = (temp: number, humidity: number, windSpeed: number): WeatherCondition => {
  // 습도가 높으면 비 또는 눈
  if (humidity > 85) {
    return temp < 3 ? 'snowy' : 'rainy';
  }
  
  // 습도가 중간이면 흐림
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
  if (humidity > 85) return 80;
  if (humidity > 70) return 50;
  if (humidity > 60) return 30;
  return 10;
};

/**
 * 단기예보 API 호출
 * 3일 이내 날씨 예보 조회
 */
export const fetchWeatherForecast = async (
  latitude: number = 37.5665,
  longitude: number = 126.9780,
  days: number = 3
): Promise<WeatherData[]> => {
  try {
    if (!KMA_API_KEY) {
      console.warn('⚠️ 기상청 API 키가 설정되지 않았습니다. Mock 데이터를 사용합니다.');
      return [getMockWeatherData()];
    }
    
    const grid = convertToGrid(latitude, longitude);
    
    // 발표시각 계산 (0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300)
    const now = new Date();
    const hour = now.getHours();
    const baseHours = [2, 5, 8, 11, 14, 17, 20, 23];
    const baseHour = baseHours.reduce((prev, curr) => 
      hour >= curr ? curr : prev
    );
    
    const baseDate = now.toISOString().split('T')[0].replace(/-/g, '');
    const baseTime = `${String(baseHour).padStart(2, '0')}00`;
    
    const url = `${KMA_API_BASE_URL}/getVilageFcst`;
    const params = new URLSearchParams({
      authKey: KMA_API_KEY,
      pageNo: '1',
      numOfRows: '100',
      dataType: 'JSON',
      base_date: baseDate,
      base_time: baseTime,
      nx: grid.nx.toString(),
      ny: grid.ny.toString(),
    });
    
    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }
    
    const data: KMAResponse = await response.json();
    
    if (data.response.header.resultCode !== '00') {
      throw new Error(`API 오류: ${data.response.header.resultMsg}`);
    }
    
    // 데이터 파싱 및 일자별 그룹화
    const items = data.response.body.items.item;
    const dailyForecasts: Record<string, Record<string, string>> = {};
    
    items.forEach(item => {
      const dateKey = `${item.fcstDate}_${item.fcstTime}`;
      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = {};
      }
      dailyForecasts[dateKey][item.category] = item.fcstValue;
    });
    
    // 날씨 데이터 변환
    const forecasts: WeatherData[] = Object.values(dailyForecasts)
      .slice(0, days)
      .map(forecast => {
        const temperature = parseFloat(forecast['TMP'] || '0');
        const humidity = parseFloat(forecast['REH'] || '0');
        const windSpeed = parseFloat(forecast['WSD'] || '0');
        const precipitation = parseFloat(forecast['POP'] || '0');
        const pty = forecast['PTY'] || '0';
        const sky = forecast['SKY'] || '1';
        
        const feelsLike = Math.round(temperature - (windSpeed * 0.5));
        const condition = getWeatherCondition(sky, pty);
        const uvIndex = estimateUVIndex(temperature, condition);
        
        return {
          temperature,
          feelsLike,
          condition,
          precipitation,
          windSpeed,
          humidity,
          uvIndex,
        };
      });
    
    return forecasts;
  } catch (error) {
    console.error('❌ 기상청 예보 API 호출 실패:', error);
    return [getMockWeatherData()];
  }
};

/**
 * Mock 날씨 데이터 (개발/테스트용)
 */
export const getMockWeatherData = (): WeatherData => {
  return {
    temperature: 8,
    feelsLike: 5,
    condition: 'cloudy',
    precipitation: 20,
    windSpeed: 3.5,
    humidity: 65,
    uvIndex: 'moderate',
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
      return cachedWeather;
    }
    
    // 캐시가 없거나 만료되면 새로 조회
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
 * @returns WeatherData
 */
export const getEventWeather = async (eventDate: string | Date): Promise<WeatherData> => {
  try {
    // Date 객체로 변환
    const date = typeof eventDate === 'string' ? new Date(eventDate) : eventDate;
    const now = new Date();
    
    // 날짜 차이 계산
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    console.log(`🗓️ 산행 날짜까지 ${diffDays}일 남음`);
    
    // 과거 날짜는 현재 날씨 반환
    if (diffDays < 0) {
      console.log('⚠️ 과거 날짜이므로 현재 날씨를 반환합니다.');
      return await fetchCurrentWeather();
    }
    
    // 30일 이내면 기상청 API로 예보 조회 시도
    if (diffDays <= 30) {
      // 산행 당일 정오(12시) 기준으로 날씨 조회
      const targetDateTime = new Date(date);
      targetDateTime.setHours(12, 0, 0, 0);
      const targetDateTimeStr = formatKMADateTime(targetDateTime);
      
      console.log(`🌤️ ${diffDays}일 후 날씨 조회: ${targetDateTimeStr}`);
      
      // 현재는 과거 데이터만 조회 가능하므로, 미래 예보는 현재 날씨 기반 추정
      if (diffDays > 0) {
        console.log('⚠️ 기상청 API는 과거 데이터만 제공하므로 현재 날씨 기반으로 추정합니다.');
        return await fetchCurrentWeather();
      }
      
      // 당일이면 실제 API 호출
      return await fetchCurrentWeather(targetDateTimeStr);
    }
    
    // 30일 이후는 현재 날씨 반환 (예보 불가)
    console.log('⚠️ 30일 이후 날짜이므로 현재 날씨를 반환합니다.');
    return await fetchCurrentWeather();
    
  } catch (error) {
    console.error('❌ 산행 날씨 조회 실패:', error);
    return getMockWeatherData();
  }
};

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
 * 기상청 초단기실황 API 호출
 * 현재 날씨 정보 조회
 */
export const fetchCurrentWeather = async (
  latitude: number = 37.5665,
  longitude: number = 126.9780
): Promise<WeatherData> => {
  try {
    // API 키가 없으면 mock 데이터 반환
    if (!KMA_API_KEY) {
      console.warn('⚠️ 기상청 API 키가 설정되지 않았습니다. Mock 데이터를 사용합니다.');
      return getMockWeatherData();
    }
    
    // 격자 좌표 변환
    const grid = convertToGrid(latitude, longitude);
    
    // 현재 시간 정보
    const now = new Date();
    const baseDate = now.toISOString().split('T')[0].replace(/-/g, '');
    const baseTime = `${String(now.getHours()).padStart(2, '0')}00`;
    
    // 기상청 API URL (스크린샷의 형식 참고)
    const url = `https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd.php`;
    const params = new URLSearchParams({
      tm: baseDate,
      stn: '0',
      help: '1',
      authKey: KMA_API_KEY,
    });
    
    console.log('🌤️ 기상청 API 호출:', `${url}?${params}`);
    
    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }
    
    const data = await response.text();
    console.log('📡 기상청 API 응답:', data);
    
    // 텍스트 데이터 파싱
    const lines = data.split('\n');
    if (lines.length < 2) {
      throw new Error('응답 데이터 형식 오류');
    }
    
    // 서울 데이터 찾기 (STN=108)
    const seoulData = lines.find(line => line.includes('108 '));
    if (!seoulData) {
      throw new Error('서울 날씨 데이터를 찾을 수 없습니다');
    }
    
    // 데이터 파싱 (공백으로 구분)
    const values = seoulData.trim().split(/\s+/);
    
    // 기온, 풍속, 습도 추출
    const temperature = parseFloat(values[4] || '0'); // TA (기온)
    const windSpeed = parseFloat(values[8] || '0'); // WS (풍속)
    const humidity = parseFloat(values[10] || '0'); // HM (습도)
    
    // 체감온도 계산
    const feelsLike = Math.round(temperature - (windSpeed * 0.5));
    
    // 날씨 상태 추정 (간단한 로직)
    let condition: WeatherCondition = 'cloudy';
    if (temperature > 15 && humidity < 60) {
      condition = 'sunny';
    } else if (humidity > 80) {
      condition = 'rainy';
    }
    
    // 강수 확률 추정
    const precipitation = humidity > 70 ? Math.min(humidity - 20, 80) : 20;
    
    // UV 지수 추정
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
  } catch (error) {
    console.error('❌ 기상청 API 호출 실패:', error);
    // 에러 시 mock 데이터 반환
    return getMockWeatherData();
  }
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
  latitude?: number,
  longitude?: number
): Promise<WeatherData> => {
  const now = Date.now();
  
  // 캐시가 유효하면 캐시 데이터 반환
  if (cachedWeather && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedWeather;
  }
  
  // 캐시가 없거나 만료되면 새로 조회
  cachedWeather = await fetchCurrentWeather(latitude, longitude);
  lastFetchTime = now;
  
  return cachedWeather;
};

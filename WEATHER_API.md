# 기상청 API 연동 가이드

프로젝트에서 기상청 API를 사용하여 실시간 날씨 정보를 표시하는 방법입니다.

## 📡 1단계: 기상청 API 키 발급

### 회원가입 및 인증키 발급

1. **[기상청 API 허브](https://apihub.kma.go.kr/)** 접속
2. 우측 상단 **"회원가입"** 클릭
3. 이메일 인증 및 회원 정보 입력
4. 로그인 후 **마이페이지** 접속
5. **인증키 발급** 메뉴 선택
6. **일반 인증키(Encoding)** 신청
7. 발급받은 인증키 복사

---

## 🔧 2단계: 환경 변수 설정

### `.env` 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 API 키를 추가합니다:

```bash
# 기존 Firebase 설정
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# 기상청 API 설정 (여기에 발급받은 키를 입력)
VITE_KMA_API_KEY=여기에_발급받은_API_키_입력
```

### ⚠️ 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요
- `.gitignore`에 `.env`가 포함되어 있는지 확인하세요
- `.env.example` 파일을 참고하여 작성하세요

---

## 📚 3단계: API 사용 방법

### 기본 사용

```typescript
import { getCachedWeather, fetchCurrentWeather } from '../utils/weather';

// 1. 캐시된 날씨 조회 (권장)
const weather = await getCachedWeather();

// 2. 실시간 날씨 조회 (API 직접 호출)
const weather = await fetchCurrentWeather(37.5665, 126.9780);

console.log(weather);
// {
//   temperature: 8,        // 현재 기온 (°C)
//   feelsLike: 5,          // 체감 온도 (°C)
//   condition: 'cloudy',   // 날씨 상태
//   precipitation: 20,     // 강수 확률 (%)
//   windSpeed: 3.5,        // 풍속 (m/s)
//   humidity: 65,          // 습도 (%)
//   uvIndex: 'moderate'    // UV 지수
// }
```

### React 컴포넌트에서 사용

```typescript
import { useState, useEffect } from 'react';
import { getCachedWeather, WeatherData } from '../utils/weather';

function MyComponent() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  
  useEffect(() => {
    const loadWeather = async () => {
      const data = await getCachedWeather();
      setWeather(data);
    };
    
    loadWeather();
    
    // 10분마다 자동 갱신
    const interval = setInterval(loadWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (!weather) return <div>날씨 로딩 중...</div>;
  
  return (
    <div>
      <h1>현재 기온: {weather.temperature}°C</h1>
      <p>체감 온도: {weather.feelsLike}°C</p>
      <p>날씨: {weather.condition}</p>
    </div>
  );
}
```

---

## 🗺️ 4단계: 지역별 날씨 조회

### 위경도 좌표 사용

```typescript
// 서울
await fetchCurrentWeather(37.5665, 126.9780);

// 부산
await fetchCurrentWeather(35.1796, 129.0756);

// 제주
await fetchCurrentWeather(33.4996, 126.5312);
```

### 격자 좌표 변환

기상청 API는 격자 좌표계를 사용합니다. `weather.ts`의 `convertToGrid` 함수가 자동으로 변환합니다.

**주요 도시 격자 좌표 (이미 설정됨):**

| 도시   | 격자 X (nx) | 격자 Y (ny) |
|--------|-------------|-------------|
| 서울   | 60          | 127         |
| 부산   | 98          | 76          |
| 대구   | 89          | 90          |
| 인천   | 55          | 124         |
| 광주   | 58          | 74          |
| 대전   | 67          | 100         |
| 울산   | 102         | 84          |

---

## 🎨 5단계: UI 컴포넌트 통합

### 날씨 아이콘 표시

```typescript
import { Sun, Cloud, CloudRain, CloudSnow } from 'lucide-react';

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'sunny':
      return { icon: Sun, color: 'text-amber-400', text: '맑음' };
    case 'cloudy':
      return { icon: Cloud, color: 'text-slate-400', text: '흐림' };
    case 'rainy':
      return { icon: CloudRain, color: 'text-blue-500', text: '비' };
    case 'snowy':
      return { icon: CloudSnow, color: 'text-cyan-400', text: '눈' };
  }
};
```

### 날씨 카드 UI

```typescript
<Card>
  <div className="flex items-center gap-2">
    <WeatherIcon className="w-8 h-8 text-blue-500" />
    <div>
      <p className="text-2xl font-bold">{weather.temperature}°C</p>
      <p className="text-sm text-slate-500">{weatherInfo.text}</p>
    </div>
  </div>
  
  <div className="mt-4 grid grid-cols-2 gap-3">
    <div>
      <p className="text-xs text-slate-500">습도</p>
      <p className="font-semibold">{weather.humidity}%</p>
    </div>
    <div>
      <p className="text-xs text-slate-500">풍속</p>
      <p className="font-semibold">{weather.windSpeed}m/s</p>
    </div>
  </div>
</Card>
```

---

## 📊 API 함수 상세

### `getCachedWeather(latitude?, longitude?)`

**설명**: 캐시된 날씨 데이터를 반환합니다. 10분마다 자동 갱신됩니다.

**매개변수:**
- `latitude` (optional): 위도 (기본값: 37.5665 - 서울)
- `longitude` (optional): 경도 (기본값: 126.9780 - 서울)

**반환값**: `Promise<WeatherData>`

**사용 예:**
```typescript
const weather = await getCachedWeather();
const weather = await getCachedWeather(35.1796, 129.0756); // 부산
```

---

### `fetchCurrentWeather(latitude?, longitude?)`

**설명**: 기상청 초단기실황 API를 직접 호출하여 현재 날씨를 조회합니다.

**매개변수:**
- `latitude` (optional): 위도
- `longitude` (optional): 경도

**반환값**: `Promise<WeatherData>`

**사용 예:**
```typescript
const weather = await fetchCurrentWeather(37.5665, 126.9780);
```

---

### `fetchWeatherForecast(latitude?, longitude?, days?)`

**설명**: 단기예보 API를 호출하여 3일 이내 날씨 예보를 조회합니다.

**매개변수:**
- `latitude` (optional): 위도
- `longitude` (optional): 경도
- `days` (optional): 예보 일수 (기본값: 3)

**반환값**: `Promise<WeatherData[]>`

**사용 예:**
```typescript
const forecast = await fetchWeatherForecast(37.5665, 126.9780, 3);
forecast.forEach((day, index) => {
  console.log(`${index + 1}일 후: ${day.temperature}°C`);
});
```

---

### `getMockWeatherData()`

**설명**: 테스트용 Mock 날씨 데이터를 반환합니다. API 키가 없을 때 자동으로 사용됩니다.

**반환값**: `WeatherData`

**사용 예:**
```typescript
const mockWeather = getMockWeatherData();
```

---

## 🔄 데이터 흐름

```
사용자 → getCachedWeather()
           ↓
      캐시 확인 (10분 이내?)
           ↓
    Yes ←─────→ No
     ↓              ↓
  캐시 반환    fetchCurrentWeather()
                    ↓
               기상청 API 호출
                    ↓
               격자 좌표 변환
                    ↓
               데이터 파싱
                    ↓
               캐시 저장
                    ↓
               데이터 반환
```

---

## 🛠️ 개발 모드

### API 키 없이 개발하기

API 키를 설정하지 않으면 자동으로 Mock 데이터를 사용합니다:

```typescript
// .env 파일에 VITE_KMA_API_KEY가 없으면
const weather = await getCachedWeather();
// → Mock 데이터 반환 (콘솔에 경고 메시지)
```

**Mock 데이터:**
```javascript
{
  temperature: 8,
  feelsLike: 5,
  condition: 'cloudy',
  precipitation: 20,
  windSpeed: 3.5,
  humidity: 65,
  uvIndex: 'moderate'
}
```

---

## 🐛 문제 해결

### API 호출 실패

**증상**: 날씨 데이터가 Mock 데이터로 고정됨

**원인 및 해결:**
1. **API 키 확인**
   ```bash
   # .env 파일 확인
   VITE_KMA_API_KEY=여기에_키_입력
   ```

2. **API 키 활성화 확인**
   - 기상청 API 허브 로그인
   - 마이페이지 → 인증키 관리
   - 키 상태가 "활성" 인지 확인

3. **브라우저 콘솔 확인**
   ```
   F12 → Console 탭
   → 에러 메시지 확인
   ```

---

### CORS 에러

**증상**: `Access-Control-Allow-Origin` 에러

**해결 방법:**

기상청 API는 서버에서만 호출 가능합니다. 프록시 서버 설정:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api/kma': {
        target: 'https://apihub.kma.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kma/, '')
      }
    }
  }
});
```

---

### 격자 좌표 불일치

**증상**: 원하는 지역의 날씨가 아닌 다른 지역 날씨 표시

**해결 방법:**

`weather.ts`의 `convertToGrid` 함수에 해당 지역 격자 좌표 추가:

```typescript
const cityGrids: Record<string, { nx: number; ny: number }> = {
  'seoul': { nx: 60, ny: 127 },
  'your-city': { nx: XX, ny: YY }, // 추가
};
```

격자 좌표는 [기상청 격자 좌표 찾기](https://www.weather.go.kr/w/index.do)에서 확인 가능합니다.

---

## 📖 참고 자료

- [기상청 API 허브](https://apihub.kma.go.kr/)
- [기상청 API 문서](https://apihub.kma.go.kr/api/typ01/url)
- [단기예보 조회 API](https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws_txt_min)
- [초단기실황 조회 API](https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd.php)

---

## 🎯 실제 사용 예시

### Home 페이지

```typescript
// src/pages/Home.tsx

import { useState, useEffect } from 'react';
import { getCachedWeather, WeatherData } from '../utils/weather';

const Home = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 8,
    feelsLike: 5,
    condition: 'cloudy',
    precipitation: 20,
    windSpeed: 3.5,
    humidity: 65,
    uvIndex: 'moderate',
  });
  
  useEffect(() => {
    const loadWeather = async () => {
      try {
        const weather = await getCachedWeather();
        setWeatherData(weather);
      } catch (error) {
        console.error('날씨 데이터 로드 실패:', error);
      }
    };
    
    loadWeather();
    
    // 10분마다 날씨 갱신
    const interval = setInterval(loadWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div>
      <h1>현재 날씨</h1>
      <p>기온: {weatherData.temperature}°C</p>
      <p>습도: {weatherData.humidity}%</p>
    </div>
  );
};
```

---

**마지막 업데이트**: 2026-01-29  
**작성자**: Sierra Hiking Club Dev Team

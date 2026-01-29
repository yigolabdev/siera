import { useState } from 'react';
import { Cloud, RefreshCw, CheckCircle, XCircle, ArrowLeft, Calendar, Thermometer, Wind, Droplets, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchCurrentWeather, getEventWeather, WeatherData } from '../../utils/weather';

const WeatherTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [testDate, setTestDate] = useState('');

  const handleTestCurrentWeather = async () => {
    setIsLoading(true);
    setError(null);
    setApiResponse(null);
    
    try {
      console.log('🧪 [WeatherTest] 현재 날씨 API 테스트 시작');
      const data = await fetchCurrentWeather();
      
      setWeatherData(data);
      setApiResponse(JSON.stringify(data, null, 2));
      console.log('✅ [WeatherTest] API 호출 성공:', data);
    } catch (err: any) {
      console.error('❌ [WeatherTest] API 호출 실패:', err);
      setError(err.message || 'API 호출 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEventWeather = async () => {
    if (!testDate) {
      alert('테스트할 날짜를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setApiResponse(null);
    
    try {
      console.log('🧪 [WeatherTest] 특정 날짜 날씨 API 테스트 시작:', testDate);
      const data = await getEventWeather(testDate);
      
      setWeatherData(data);
      setApiResponse(JSON.stringify(data, null, 2));
      console.log('✅ [WeatherTest] API 호출 성공:', data);
    } catch (err: any) {
      console.error('❌ [WeatherTest] API 호출 실패:', err);
      setError(err.message || 'API 호출 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return '☀️';
      case 'cloudy':
        return '☁️';
      case 'rainy':
        return '🌧️';
      case 'snowy':
        return '❄️';
      default:
        return '🌤️';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return '맑음';
      case 'cloudy':
        return '흐림';
      case 'rainy':
        return '비';
      case 'snowy':
        return '눈';
      default:
        return '알 수 없음';
    }
  };

  const getUVText = (uvIndex: string) => {
    switch (uvIndex) {
      case 'low':
        return '낮음';
      case 'moderate':
        return '보통';
      case 'high':
        return '높음';
      case 'very-high':
        return '매우 높음';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            관리자 대시보드로 돌아가기
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Cloud className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">날씨 API 테스트</h1>
          </div>
          <p className="text-slate-600">
            기상청 API 연동 상태를 확인하고 실제 데이터를 테스트할 수 있습니다.
          </p>
        </div>

        {/* API 정보 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">API 정보</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="font-semibold text-slate-700 min-w-[100px]">API 제공:</span>
              <span className="text-slate-600">기상청 (KMA - Korea Meteorological Administration)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-semibold text-slate-700 min-w-[100px]">API 종류:</span>
              <span className="text-slate-600">지상관측 (ASOS - Automated Surface Observing System)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-semibold text-slate-700 min-w-[100px]">API URL:</span>
              <span className="text-slate-600 font-mono text-xs">
                https://apihub.kma.go.kr/api/typ01/url/kma_sfctm3.php
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-semibold text-slate-700 min-w-[100px]">API 키 상태:</span>
              <span className={`font-medium ${import.meta.env.VITE_KMA_API_KEY ? 'text-green-600' : 'text-red-600'}`}>
                {import.meta.env.VITE_KMA_API_KEY ? '✓ 설정됨' : '✗ 미설정'}
              </span>
            </div>
            {import.meta.env.VITE_KMA_API_KEY && (
              <div className="flex items-start gap-3">
                <span className="font-semibold text-slate-700 min-w-[100px]">API 키:</span>
                <span className="text-slate-600 font-mono text-xs">
                  {import.meta.env.VITE_KMA_API_KEY.substring(0, 10)}...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 테스트 버튼 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 현재 날씨 테스트 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">현재 날씨 조회</h3>
            <p className="text-sm text-slate-600 mb-4">
              현재 시점의 날씨 정보를 조회합니다. (서울 기준)
            </p>
            <button
              onClick={handleTestCurrentWeather}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  테스트 중...
                </>
              ) : (
                <>
                  <Cloud className="w-5 h-5" />
                  현재 날씨 조회
                </>
              )}
            </button>
          </div>

          {/* 특정 날짜 날씨 테스트 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">특정 날짜 날씨 조회</h3>
            <p className="text-sm text-slate-600 mb-4">
              산행 날짜의 날씨 정보를 조회합니다.
            </p>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleTestEventWeather}
              disabled={isLoading || !testDate}
              className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  테스트 중...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  날짜별 날씨 조회
                </>
              )}
            </button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">API 호출 실패</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 날씨 데이터 결과 */}
        {weatherData && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-slate-900">API 응답 성공</h2>
            </div>

            {/* 날씨 요약 카드 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-100 mb-1">날씨</p>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{getWeatherIcon(weatherData.condition)}</span>
                    <span className="text-3xl font-bold">{getConditionText(weatherData.condition)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 mb-1">기온</p>
                  <p className="text-5xl font-bold">{weatherData.temperature}°</p>
                  <p className="text-blue-100 text-sm mt-1">체감 {weatherData.feelsLike}°</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-blue-400">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Droplets className="w-4 h-4" />
                    <p className="text-xs text-blue-100">강수확률</p>
                  </div>
                  <p className="text-lg font-bold">{weatherData.precipitation}%</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Wind className="w-4 h-4" />
                    <p className="text-xs text-blue-100">풍속</p>
                  </div>
                  <p className="text-lg font-bold">{weatherData.windSpeed}m/s</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Droplets className="w-4 h-4" />
                    <p className="text-xs text-blue-100">습도</p>
                  </div>
                  <p className="text-lg font-bold">{weatherData.humidity}%</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Sun className="w-4 h-4" />
                    <p className="text-xs text-blue-100">UV</p>
                  </div>
                  <p className="text-lg font-bold">{getUVText(weatherData.uvIndex)}</p>
                </div>
              </div>
            </div>

            {/* JSON 응답 */}
            {apiResponse && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">JSON 응답</h3>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono">{apiResponse}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 사용 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">테스트 안내</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>현재 날씨 조회:</strong> 실시간 기상 관측 데이터를 가져옵니다. (최근 1시간 이내 데이터)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>특정 날짜 날씨:</strong> 기상청 API는 과거 데이터만 제공하므로, 미래 날짜는 현재 날씨 기반 추정값입니다.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>데이터 범위:</strong> 최근 31일 이내의 과거 데이터만 조회 가능합니다.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>API 키 오류:</strong> API 키가 없거나 만료된 경우 Mock 데이터가 반환됩니다.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Console 로그:</strong> 브라우저 개발자 도구(F12)의 Console 탭에서 상세한 API 호출 로그를 확인할 수 있습니다.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeatherTest;

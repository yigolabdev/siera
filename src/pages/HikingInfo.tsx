import { useState, useEffect } from 'react';
import { Mountain, AlertTriangle, Clock, Thermometer, Wind, Cloud, Droplets, Eye, CreditCard, Calendar, CloudRain, Sun, CloudSnow, CloudDrizzle, CloudFog } from 'lucide-react';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
}

interface ForecastDay {
  date: string;
  day: string;
  temp: number;
  description: string;
  icon: string;
}

const HikingInfo = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 산행 날짜 (2026-01-15, 수요일)
  const hikingDate = new Date('2026-01-15');
  const today = new Date();
  
  // 날씨 데이터 가져오기
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // OpenWeatherMap API 키 (환경 변수로 관리하는 것이 좋습니다)
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo';
        const city = 'Gapyeong,KR'; // 가평, 한국
        
        // 현재 날씨 가져오기
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=kr`;
        const currentResponse = await fetch(currentWeatherUrl);
        
        if (currentResponse.ok) {
          const currentData = await currentResponse.json();
          const sunrise = new Date(currentData.sys.sunrise * 1000);
          const sunset = new Date(currentData.sys.sunset * 1000);
          
          setWeather({
            temperature: Math.round(currentData.main.temp),
            feelsLike: Math.round(currentData.main.feels_like),
            humidity: currentData.main.humidity,
            windSpeed: Math.round(currentData.wind.speed),
            visibility: Math.round(currentData.visibility / 1000), // m to km
            description: currentData.weather[0].description,
            icon: currentData.weather[0].icon,
            sunrise: sunrise.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
            sunset: sunset.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
          });
        } else {
          // API 키가 없거나 실패한 경우 더미 데이터 사용
          setWeather({
            temperature: 15,
            feelsLike: 13,
            humidity: 65,
            windSpeed: 3,
            visibility: 10,
            description: '맑음',
            icon: '01d',
            sunrise: '07:30',
            sunset: '17:45',
          });
        }
        
        // 7일 예보 가져오기
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=kr`;
        const forecastResponse = await fetch(forecastUrl);
        
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json();
          const dailyForecasts: ForecastDay[] = [];
          const processedDates = new Set();
          
          forecastData.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000);
            const dateStr = date.toLocaleDateString('ko-KR');
            
            if (!processedDates.has(dateStr) && dailyForecasts.length < 7) {
              processedDates.add(dateStr);
              dailyForecasts.push({
                date: dateStr,
                day: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()],
                temp: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon,
              });
            }
          });
          
          setForecast(dailyForecasts);
        } else {
          // 더미 데이터 사용
          setForecast([
            { date: '01/15', day: '월', temp: 15, description: '맑음', icon: '01d' },
            { date: '01/16', day: '화', temp: 12, description: '구름많음', icon: '02d' },
            { date: '01/17', day: '수', temp: 10, description: '비', icon: '10d' },
            { date: '01/18', day: '목', temp: 13, description: '맑음', icon: '01d' },
            { date: '01/19', day: '금', temp: 14, description: '구름많음', icon: '03d' },
            { date: '01/20', day: '토', temp: 16, description: '맑음', icon: '01d' },
            { date: '01/21', day: '일', temp: 17, description: '맑음', icon: '01d' },
          ]);
        }
      } catch (error) {
        console.error('날씨 데이터를 가져오는데 실패했습니다:', error);
        // 에러 시 더미 데이터 사용
        setWeather({
          temperature: 15,
          feelsLike: 13,
          humidity: 65,
          windSpeed: 3,
          visibility: 10,
          description: '맑음',
          icon: '01d',
          sunrise: '07:30',
          sunset: '17:45',
        });
        setForecast([
          { date: '01/15', day: '월', temp: 15, description: '맑음', icon: '01d' },
          { date: '01/16', day: '화', temp: 12, description: '구름많음', icon: '02d' },
          { date: '01/17', day: '수', temp: 10, description: '비', icon: '10d' },
          { date: '01/18', day: '목', temp: 13, description: '맑음', icon: '01d' },
          { date: '01/19', day: '금', temp: 14, description: '구름많음', icon: '03d' },
          { date: '01/20', day: '토', temp: 16, description: '맑음', icon: '01d' },
          { date: '01/21', day: '일', temp: 17, description: '맑음', icon: '01d' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, []);
  
  const mountains = [
    {
      name: '북한산',
      altitude: '836m',
      difficulty: '중급',
      duration: '4-5시간',
      description: '서울 근교의 대표적인 산으로 백운대, 인수봉, 만경대 등의 명소가 있습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    },
    {
      name: '설악산',
      altitude: '1,708m',
      difficulty: '상급',
      duration: '8-10시간',
      description: '국내 최고의 명산으로 대청봉을 중심으로 다양한 등산 코스가 있습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    },
    {
      name: '지리산',
      altitude: '1,915m',
      difficulty: '상급',
      duration: '1박2일',
      description: '한반도의 지붕이라 불리는 명산으로 장엄한 산세를 자랑합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    },
  ];
  
  const safetyTips = [
    {
      icon: AlertTriangle,
      title: '등산 전 준비사항',
      tips: [
        '일기예보를 꼭 확인하세요',
        '등산화, 등산복, 등산 스틱을 준비하세요',
        '충분한 물과 간식을 챙기세요',
        '휴대폰 배터리를 충전하세요',
      ],
    },
    {
      icon: Mountain,
      title: '등산 중 주의사항',
      tips: [
        '자신의 체력에 맞는 페이스를 유지하세요',
        '일행과 떨어지지 않도록 주의하세요',
        '표지판과 리본을 확인하며 이동하세요',
        '쓰레기는 반드시 되가져가세요',
      ],
    },
    {
      icon: Thermometer,
      title: '기상 변화 대응',
      tips: [
        '보온 의류를 여벌로 준비하세요',
        '비옷이나 우산을 챙기세요',
        '급격한 기상 변화 시 하산을 고려하세요',
        '체온 유지에 신경 쓰세요',
      ],
    },
  ];
  
  const equipment = [
    { name: '등산화', description: '발목을 보호하고 미끄럼 방지 기능이 있는 등산화' },
    { name: '등산복', description: '땀 배출이 좋고 보온성이 우수한 기능성 의류' },
    { name: '배낭', description: '20-30L 용량의 편안한 배낭' },
    { name: '등산 스틱', description: '무릎 보호와 균형 유지를 위한 스틱' },
    { name: '물', description: '1.5L 이상의 충분한 식수' },
    { name: '간식', description: '초콜릿, 견과류 등 고칼로리 간식' },
    { name: '구급약', description: '밴드, 소독약, 진통제 등' },
    { name: '헤드랜턴', description: '비상시를 대비한 조명' },
  ];
  
  // 날씨 아이콘 매핑
  const getWeatherIcon = (icon: string) => {
    const iconClass = "h-8 w-8";
    if (icon.startsWith('01')) return <Sun className={`${iconClass} text-amber-500`} />; // 맑음
    if (icon.startsWith('02')) return <Cloud className={`${iconClass} text-sky-400`} />; // 구름조금
    if (icon.startsWith('03') || icon.startsWith('04')) return <Cloud className={`${iconClass} text-slate-400`} />; // 구름많음
    if (icon.startsWith('09') || icon.startsWith('10')) return <CloudRain className={`${iconClass} text-blue-500`} />; // 비
    if (icon.startsWith('11')) return <CloudDrizzle className={`${iconClass} text-indigo-500`} />; // 천둥번개
    if (icon.startsWith('13')) return <CloudSnow className={`${iconClass} text-cyan-400`} />; // 눈
    if (icon.startsWith('50')) return <CloudFog className={`${iconClass} text-gray-400`} />; // 안개
    return <Sun className={`${iconClass} text-amber-400`} />;
  };
  
  const payments = [
    {
      id: 1,
      title: '2026년 연회비',
      amount: '200,000원',
      dueDate: '2026-01-31',
      status: 'pending' as const,
    },
    {
      id: 2,
      title: '1월 정기산행 회비',
      amount: '50,000원',
      dueDate: '2026-01-10',
      status: 'completed' as const,
    },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">등산 정보</h1>
        <p className="text-xl text-gray-600">
          안전하고 즐거운 산행을 위한 정보를 확인하세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Weather */}
          <div className="card bg-gradient-to-r from-blue-50 to-sky-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">산행 당일 날씨</h2>
              <div className="flex items-center space-x-2 px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-bold">
                <Calendar className="h-4 w-4" />
                <span>2026년 1월 15일 (수)</span>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : weather ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <Thermometer className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-gray-500 text-sm">기온</p>
                      <p className="text-xl font-bold text-gray-900">{weather.temperature}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Wind className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-gray-500 text-sm">풍속</p>
                      <p className="text-xl font-bold text-gray-900">{weather.windSpeed}m/s</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Droplets className="h-8 w-8 text-blue-400" />
                    <div>
                      <p className="text-gray-500 text-sm">습도</p>
                      <p className="text-xl font-bold text-gray-900">{weather.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Eye className="h-8 w-8 text-gray-500" />
                    <div>
                      <p className="text-gray-500 text-sm">가시거리</p>
                      <p className="text-xl font-bold text-gray-900">{weather.visibility}km</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl">
                        {getWeatherIcon(weather.icon)}
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-medium">현재 날씨</p>
                        <p className="text-lg font-bold text-slate-900">{weather.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 font-medium">체감 온도</p>
                      <p className="text-lg font-bold text-slate-900">{weather.feelsLike}°C</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">일출: {weather.sunrise}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">일몰: {weather.sunset}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                날씨 정보를 불러올 수 없습니다.
              </div>
            )}
          </div>
          
          {/* Mountains Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">추천 산 정보</h2>
            <div className="grid grid-cols-1 gap-6">
              {mountains.map((mountain, index) => (
                <div key={index} className="card">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img 
                      src={mountain.imageUrl}
                      alt={mountain.name}
                      className="w-full md:w-48 h-48 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{mountain.name}</h3>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500 mb-1">높이</p>
                          <p className="font-bold text-gray-900">{mountain.altitude}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500 mb-1">난이도</p>
                          <p className="font-bold text-gray-900">{mountain.difficulty}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500 mb-1">소요시간</p>
                          <p className="font-bold text-gray-900">{mountain.duration}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{mountain.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Safety Tips */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">안전 수칙</h2>
            <div className="grid grid-cols-1 gap-6">
              {safetyTips.map((section, index) => (
                <div key={index} className="card">
                  <div className="flex items-center space-x-3 mb-4">
                    <section.icon className="h-8 w-8 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start space-x-2">
                        <span className="text-primary-600 mt-1">•</span>
                        <span className="text-gray-700 text-base">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          {/* Equipment Checklist */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">등산 장비 체크리스트</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipment.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input 
                    type="checkbox" 
                    className="mt-1 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar - Weather & Payment Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Weekly Weather */}
            <div className="card bg-gradient-to-br from-sky-50 to-blue-50">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Cloud className="h-6 w-6 text-blue-600" />
                <span>7일 예보</span>
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-[40px]">
                          <p className="text-sm font-bold text-slate-900">{day.day}</p>
                          <p className="text-xs text-slate-500">{day.date}</p>
                        </div>
                        <div className="p-1.5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                          {getWeatherIcon(day.icon)}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{day.temp}°C</p>
                        <p className="text-xs text-slate-600">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>안내:</strong> 날씨는 산행 당일 변경될 수 있으니 출발 전 반드시 재확인하세요.
                </p>
              </div>
            </div>
            
            {/* Payment Info */}
            <div className="card bg-gradient-to-br from-primary-50 to-green-50">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <CreditCard className="h-6 w-6 text-primary-600" />
                <span>입금 정보</span>
              </h2>
              
              <div className="space-y-4 mb-6">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-4 bg-white rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-base">{payment.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status === 'completed' ? '완료' : '대기'}
                      </span>
                    </div>
                    <div className="space-y-1 text-gray-700">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-bold">₩</span>
                        <span className="text-base font-bold text-primary-600">{payment.amount}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>납부기한: {payment.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-bold text-gray-900 mb-3">계좌 정보</h3>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">은행</span>
                    <span>국민은행</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">계좌번호</span>
                    <span>123-456-789012</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">예금주</span>
                    <span>시애라</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  <strong>입금 시 주의:</strong> 입금자명에 회원님의 성함을 정확히 기재해주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HikingInfo;


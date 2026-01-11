import { useState, useEffect } from 'react';
import { Mountain, AlertTriangle, Clock, Thermometer, Wind, Cloud, Droplets, Eye, Calendar, CloudRain, Sun, CloudSnow, CloudDrizzle, CloudFog, MapPin, TrendingUp, Check } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

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
      difficultyVariant: 'warning' as const,
      duration: '4-5시간',
      description: '서울 근교의 대표적인 산으로 백운대, 인수봉, 만경대 등의 명소가 있습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    },
    {
      name: '설악산',
      altitude: '1,708m',
      difficulty: '상급',
      difficultyVariant: 'danger' as const,
      duration: '8-10시간',
      description: '국내 최고의 명산으로 대청봉을 중심으로 다양한 등산 코스가 있습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    },
    {
      name: '지리산',
      altitude: '1,915m',
      difficulty: '상급',
      difficultyVariant: 'danger' as const,
      duration: '1박2일',
      description: '한반도의 지붕이라 불리는 명산으로 장엄한 산세를 자랑합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    },
  ];
  
  const safetyTips = [
    {
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
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
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
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
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
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
    { name: '등산화', description: '발목을 보호하고 미끄럼 방지 기능이 있는 등산화', icon: '👟' },
    { name: '등산복', description: '땀 배출이 좋고 보온성이 우수한 기능성 의류', icon: '👕' },
    { name: '배낭', description: '20-30L 용량의 편안한 배낭', icon: '🎒' },
    { name: '등산 스틱', description: '무릎 보호와 균형 유지를 위한 스틱', icon: '🥾' },
    { name: '물', description: '1.5L 이상의 충분한 식수', icon: '💧' },
    { name: '간식', description: '초콜릿, 견과류 등 고칼로리 간식', icon: '🍫' },
    { name: '구급약', description: '밴드, 소독약, 진통제 등', icon: '🏥' },
    { name: '헤드랜턴', description: '비상시를 대비한 조명', icon: '🔦' },
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
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">등산 정보</h1>
        <p className="text-xl text-slate-600">
          안전하고 즐거운 산행을 위한 정보를 확인하세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Weather */}
          <Card className="hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Cloud className="w-7 h-7 text-blue-600" />
                산행 당일 날씨
              </h2>
              <Badge variant="info">2026년 1월 15일 (수)</Badge>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : weather ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                    <Thermometer className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-slate-600 text-sm mb-1">기온</p>
                    <p className="text-3xl font-bold text-slate-900">{weather.temperature}°C</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                    <Wind className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-slate-600 text-sm mb-1">풍속</p>
                    <p className="text-3xl font-bold text-slate-900">{weather.windSpeed}m/s</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl">
                    <Droplets className="w-6 h-6 mx-auto mb-2 text-teal-600" />
                    <p className="text-slate-600 text-sm mb-1">습도</p>
                    <p className="text-3xl font-bold text-slate-900">{weather.humidity}%</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <Eye className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-slate-600 text-sm mb-1">가시거리</p>
                    <p className="text-3xl font-bold text-slate-900">{weather.visibility}km</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">현재 날씨</p>
                      <p className="text-xl font-bold text-slate-900">{weather.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 mb-1">체감 온도</p>
                      <p className="text-xl font-bold text-slate-900">{weather.feelsLike}°C</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex justify-between text-sm">
                    <Badge variant="warning">일출: {weather.sunrise}</Badge>
                    <Badge variant="info">일몰: {weather.sunset}</Badge>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-500">
                날씨 정보를 불러올 수 없습니다.
              </div>
            )}
          </Card>
          
          {/* Mountains Info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Mountain className="w-7 h-7 text-green-600" />
              추천 산 정보
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {mountains.map((mountain, index) => (
                <Card key={index} className="hover:shadow-xl hover:border-primary-600 transition-all">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative overflow-hidden rounded-xl w-full md:w-48 h-48 flex-shrink-0">
                      <img 
                        src={mountain.imageUrl}
                        alt={mountain.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant={mountain.difficultyVariant}>{mountain.difficulty}</Badge>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">{mountain.name}</h3>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-600 mb-1">높이</p>
                          <p className="font-bold text-slate-900">{mountain.altitude}</p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-600 mb-1">난이도</p>
                          <p className="font-bold text-slate-900">{mountain.difficulty}</p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-600 mb-1">소요시간</p>
                          <p className="font-bold text-slate-900">{mountain.duration}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{mountain.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Safety Tips */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-7 h-7 text-red-600" />
              안전 수칙
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {safetyTips.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Card key={index} className={`${section.bgColor} border-2 hover:shadow-lg transition-all`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 bg-white rounded-lg`}>
                        <Icon className={`w-6 h-6 ${section.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {/* Equipment Checklist */}
          <Card className="hover:shadow-xl transition-all">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-purple-600" />
              등산 장비 체크리스트
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipment.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-primary-600 hover:shadow-md transition-all">
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-slate-600 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Sidebar - Weather Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Weekly Weather */}
            <Card className="hover:shadow-xl transition-all">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary-600" />
                7일 예보
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="text-center min-w-[40px]">
                          <p className="text-sm font-bold text-slate-900">{day.day}</p>
                          <p className="text-xs text-slate-500">{day.date}</p>
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
              <div className="mt-4 p-3 bg-amber-50 border-2 border-amber-200 rounded-xl">
                <p className="text-sm text-amber-900 font-medium">
                  ⚠️ 날씨는 산행 당일 변경될 수 있으니 출발 전 반드시 재확인하세요.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HikingInfo;

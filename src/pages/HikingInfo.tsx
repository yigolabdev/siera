import { Mountain, AlertTriangle, Clock, Thermometer, Wind, Cloud, Droplets, Eye, CreditCard, Calendar } from 'lucide-react';

const HikingInfo = () => {
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
  
  const weeklyWeather = [
    { day: '월', date: '01/15', temp: '15°C', condition: '맑음', icon: '☀️' },
    { day: '화', date: '01/16', temp: '12°C', condition: '구름', icon: '☁️' },
    { day: '수', date: '01/17', temp: '10°C', condition: '비', icon: '🌧️' },
    { day: '목', date: '01/18', temp: '13°C', condition: '맑음', icon: '☀️' },
    { day: '금', date: '01/19', temp: '14°C', condition: '구름', icon: '⛅' },
    { day: '토', date: '01/20', temp: '16°C', condition: '맑음', icon: '☀️' },
    { day: '일', date: '01/21', temp: '17°C', condition: '맑음', icon: '☀️' },
  ];
  
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">오늘의 산행 날씨</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <Thermometer className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-gray-500 text-sm">기온</p>
                  <p className="text-xl font-bold text-gray-900">15°C</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Wind className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-gray-500 text-sm">풍속</p>
                  <p className="text-xl font-bold text-gray-900">3m/s</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Droplets className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-gray-500 text-sm">습도</p>
                  <p className="text-xl font-bold text-gray-900">65%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Eye className="h-8 w-8 text-gray-500" />
                <div>
                  <p className="text-gray-500 text-sm">가시거리</p>
                  <p className="text-xl font-bold text-gray-900">10km</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="text-gray-600">일출: 07:30</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-600">일몰: 17:45</span>
                </div>
              </div>
            </div>
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
                <span>주간 날씨</span>
              </h2>
              <div className="space-y-3">
                {weeklyWeather.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">{day.day}</p>
                        <p className="text-xs text-gray-500">{day.date}</p>
                      </div>
                      <span className="text-2xl">{day.icon}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{day.temp}</p>
                      <p className="text-xs text-gray-600">{day.condition}</p>
                    </div>
                  </div>
                ))}
              </div>
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


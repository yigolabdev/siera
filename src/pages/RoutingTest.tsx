import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Home, 
  Calendar, 
  Users, 
  UserCog, 
  Mountain,
  FileText,
  Info,
  LogIn,
  UserPlus,
  Trophy,
  Image,
  Settings,
  CheckCircle,
  Code
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const RoutingTest = () => {
  const navigate = useNavigate();
  const [testLog, setTestLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setTestLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // 라우팅 테스트 버튼들
  const routes = [
    // 메인/랜딩
    { 
      path: '/', 
      name: '메인 랜딩 페이지', 
      icon: Home, 
      color: 'bg-blue-600 hover:bg-blue-700',
      category: '메인'
    },
    { 
      path: '/about', 
      name: 'About 페이지', 
      icon: Info, 
      color: 'bg-blue-600 hover:bg-blue-700',
      category: '메인'
    },
    { 
      path: '/register', 
      name: '회원가입', 
      icon: UserPlus, 
      color: 'bg-blue-600 hover:bg-blue-700',
      category: '메인'
    },
    { 
      path: '/guest-application', 
      name: '게스트 신청', 
      icon: UserPlus, 
      color: 'bg-blue-600 hover:bg-blue-700',
      category: '메인'
    },
    { 
      path: '/quick-apply', 
      name: '빠른 신청', 
      icon: LogIn, 
      color: 'bg-blue-600 hover:bg-blue-700',
      category: '메인'
    },
    
    // 인증된 사용자 (홈)
    { 
      path: '/home', 
      name: '홈 대시보드', 
      icon: Home, 
      color: 'bg-emerald-600 hover:bg-emerald-700',
      category: '회원'
    },
    { 
      path: '/home/events', 
      name: '산행 일정', 
      icon: Calendar, 
      color: 'bg-emerald-600 hover:bg-emerald-700',
      category: '회원'
    },
    { 
      path: '/home/gallery', 
      name: '사진 갤러리', 
      icon: Image, 
      color: 'bg-emerald-600 hover:bg-emerald-700',
      category: '회원'
    },
    { 
      path: '/home/info', 
      name: '산행 정보', 
      icon: Info, 
      color: 'bg-emerald-600 hover:bg-emerald-700',
      category: '회원'
    },
    { 
      path: '/home/board', 
      name: '게시판', 
      icon: FileText, 
      color: 'bg-emerald-600 hover:bg-emerald-700',
      category: '회원'
    },
    { 
      path: '/home/members', 
      name: '회원 목록', 
      icon: Users, 
      color: 'bg-emerald-600 hover:bg-emerald-700',
      category: '회원'
    },
    { 
      path: '/home/attendance', 
      name: '출석 현황', 
      icon: Trophy, 
      color: 'bg-emerald-600 hover:bg-emerald-700',
      category: '회원'
    },
    { 
      path: '/home/profile', 
      name: '프로필', 
      icon: UserCog, 
      color: 'bg-emerald-600 hover:bg-emerald-700',
      category: '회원'
    },
    
    // 관리자 페이지
    { 
      path: '/admin/events', 
      name: '산행 관리', 
      icon: Mountain, 
      color: 'bg-purple-600 hover:bg-purple-700',
      category: '관리자'
    },
    { 
      path: '/admin/members', 
      name: '회원 관리', 
      icon: Users, 
      color: 'bg-purple-600 hover:bg-purple-700',
      category: '관리자'
    },
    { 
      path: '/admin/payment', 
      name: '입금 관리', 
      icon: CreditCard, 
      color: 'bg-purple-600 hover:bg-purple-700',
      category: '관리자'
    },
    { 
      path: '/dev/routing-test', 
      name: '라우팅 테스트 (현재)', 
      icon: Code, 
      color: 'bg-purple-600 hover:bg-purple-700',
      category: '관리자'
    },
  ];

  const handleNavigation = (path: string, name: string) => {
    addLog(`🚀 ${name} (${path})로 이동 시도`);
    try {
      navigate(path);
      addLog(`✅ ${name}로 이동 성공`);
    } catch (error) {
      addLog(`❌ ${name}로 이동 실패: ${error}`);
    }
  };

  const clearLog = () => {
    setTestLog([]);
  };

  // 카테고리별로 라우트 그룹화
  const groupedRoutes = routes.reduce((acc, route) => {
    if (!acc[route.category]) {
      acc[route.category] = [];
    }
    acc[route.category].push(route);
    return acc;
  }, {} as Record<string, typeof routes>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              라우팅 테스트
            </h1>
            <p className="text-xl text-slate-600">
              모든 라우팅 경로를 테스트할 수 있는 개발용 페이지입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 안내 카드 */}
      <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              💡 개발자 도구
            </h3>
            <div className="text-sm text-amber-800 space-y-1">
              <p>• 아래 버튼을 클릭하여 각 페이지로 이동할 수 있습니다.</p>
              <p>• 이동 시도 및 결과는 하단 로그에 기록됩니다.</p>
              <p>• 인증이 필요한 페이지는 로그인 상태에 따라 접근이 제한됩니다.</p>
              <p>• <strong>이 페이지는 개발용이므로 프로덕션 배포 전 제거해야 합니다.</strong></p>
            </div>
          </div>
        </div>
      </Card>

      {/* 라우팅 버튼 그리드 */}
      <div className="space-y-8 mb-8">
        {Object.entries(groupedRoutes).map(([category, categoryRoutes]) => (
          <div key={category}>
            <div className="flex items-center gap-3 mb-4">
              <Badge 
                variant={
                  category === '메인' ? 'primary' : 
                  category === '회원' ? 'success' : 
                  'danger'
                }
                className="text-sm font-bold"
              >
                {category}
              </Badge>
              <h2 className="text-2xl font-bold text-slate-900">{category} 페이지</h2>
              <span className="text-sm text-slate-500">({categoryRoutes.length}개)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <button
                    key={route.path}
                    onClick={() => handleNavigation(route.path, route.name)}
                    className={`${route.color} text-white p-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-left group`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm opacity-90">{route.path}</div>
                      <div className="text-base font-bold">{route.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 테스트 로그 */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">테스트 로그</h3>
              <p className="text-sm text-slate-600">
                라우팅 테스트 결과가 실시간으로 표시됩니다
              </p>
            </div>
          </div>
          <button
            onClick={clearLog}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
          >
            로그 지우기
          </button>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 min-h-[300px] max-h-[400px] overflow-y-auto font-mono text-sm">
          {testLog.length === 0 ? (
            <div className="flex items-center justify-center h-[280px] text-slate-500">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>버튼을 클릭하여 라우팅 테스트를 시작하세요</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {testLog.map((log, index) => (
                <div 
                  key={index} 
                  className={`${
                    log.includes('✅') ? 'text-green-400' : 
                    log.includes('❌') ? 'text-red-400' : 
                    'text-blue-400'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Badge variant="success">✅ 성공</Badge>
            <span>정상 이동</span>
            <span className="text-slate-400">|</span>
            <Badge variant="danger">❌ 실패</Badge>
            <span>오류 발생</span>
            <span className="text-slate-400">|</span>
            <Badge variant="primary">🚀 시도</Badge>
            <span>이동 시도</span>
          </div>
        </div>
      </Card>

      {/* 통계 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-slate-600 text-sm mb-2">전체 라우트</div>
          <div className="text-3xl font-bold text-slate-900">{routes.length}개</div>
        </Card>
        <Card className="text-center">
          <div className="text-slate-600 text-sm mb-2">테스트 횟수</div>
          <div className="text-3xl font-bold text-slate-900">{testLog.length}회</div>
        </Card>
        <Card className="text-center">
          <div className="text-slate-600 text-sm mb-2">성공률</div>
          <div className="text-3xl font-bold text-emerald-600">
            {testLog.length > 0 
              ? `${Math.round((testLog.filter(log => log.includes('✅')).length / testLog.filter(log => log.includes('🚀')).length) * 100)}%`
              : '0%'
            }
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RoutingTest;

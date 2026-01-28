import { TrendingUp, Award, Calendar, Users, BarChart3, Target, Trophy, Medal } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useMembers } from '../contexts/MemberContext';
import { useEvents } from '../contexts/EventContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Attendance = () => {
  const { members, isLoading } = useMembers();
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState<'rate' | 'count'>('rate');
  
  // TODO: 실제로는 별도의 attendance 컬렉션에서 출석 데이터를 가져와야 함
  // 현재는 members의 attendanceRate를 사용
  const attendanceData = useMemo(() => {
    return members
      .map((member, index) => ({
        id: member.id,
        rank: index + 1,
        name: member.name,
        position: member.position === 'chairman' ? '회장' : 
                 member.position === 'committee' ? '운영위원' : '회원',
        totalEvents: 0, // TODO: 실제 참석 가능 산행 수
        attended: 0, // TODO: 실제 참석한 산행 수
        rate: member.attendanceRate || 0,
        profileImage: member.profileImage || undefined,
      }))
      .sort((a, b) => {
        if (activeTab === 'rate') {
          return b.rate - a.rate;
        }
        return b.attended - a.attended;
      })
      .map((member, index) => ({
        ...member,
        rank: index + 1,
      }));
  }, [members, activeTab]);
  
  // 월별 통계 (TODO: 실제 출석 데이터 기반으로 계산)
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const stats = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // 해당 월의 산행 수
      const monthEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === date.getFullYear() && 
               eventDate.getMonth() === date.getMonth();
      }).length;
      
      stats.push({
        month: monthKey,
        events: monthEvents,
        avgAttendance: 0, // TODO: 실제 평균 출석률 계산
      });
    }
    
    return stats;
  }, [events]);
  
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-warning-400 to-warning-600 rounded-full shadow-lg">
          <Trophy className="h-6 w-6 text-white" />
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full shadow-lg">
          <Medal className="h-6 w-6 text-white" />
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full shadow-lg">
          <Award className="h-6 w-6 text-white" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full">
        <span className="text-xl font-bold text-slate-600">{rank}</span>
      </div>
    );
  };
  
  const getProgressColor = (rate: number) => {
    if (rate >= 90) return 'bg-success-600';
    if (rate >= 80) return 'bg-primary-600';
    if (rate >= 70) return 'bg-warning-600';
    return 'bg-danger-600';
  };
  
  const getRateBadge = (rate: number) => {
    if (rate >= 90) return <Badge variant="success">{rate.toFixed(1)}%</Badge>;
    if (rate >= 80) return <Badge variant="primary">{rate.toFixed(1)}%</Badge>;
    if (rate >= 70) return <Badge variant="warning">{rate.toFixed(1)}%</Badge>;
    return <Badge variant="danger">{rate.toFixed(1)}%</Badge>;
  };
  
  const totalEvents = 48;
  const avgAttendanceRate = Math.round(
    attendanceData.reduce((sum, member) => sum + member.rate, 0) / attendanceData.length
  );
  
  // 탭에 따라 정렬된 데이터
  const sortedData = activeTab === 'rate'
    ? [...attendanceData].sort((a, b) => b.rate - a.rate)
    : [...attendanceData].sort((a, b) => b.attended - a.attended);
  
  // 정렬된 데이터에 순위 재할당
  const rankedData = sortedData.map((member, index) => ({
    ...member,
    rank: index + 1
  }));
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">출석 현황을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats - 모바일에서 숨김 */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-sm text-slate-600 mb-1">총 산행 횟수</p>
          <p className="text-3xl font-bold text-slate-900">{totalEvents}회</p>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-sm text-slate-600 mb-1">평균 참가자</p>
          <p className="text-3xl font-bold text-slate-900">35명</p>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-sm text-slate-600 mb-1">평균 참여율</p>
          <p className="text-3xl font-bold text-slate-900">{avgAttendanceRate}%</p>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-sm text-slate-600 mb-1">최고 참여율</p>
          <p className="text-3xl font-bold text-slate-900">
            {Math.max(...attendanceData.map(m => m.rate)).toFixed(1)}%
          </p>
        </Card>
      </div>
      
      {/* Monthly Trend */}
      <Card className="mb-8 hover:shadow-xl transition-all">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-slate-600" />
          월별 참여 추이
        </h2>
        <div className="space-y-4">
          {monthlyStats.map((stat, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-4">
                <Badge variant="primary">{stat.month}</Badge>
                <div className="flex-grow">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>평균 {stat.avgAttendance}명 참석</span>
                    <span className="font-bold">{Math.round((stat.avgAttendance / 45) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-slate-900 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(stat.avgAttendance / 45) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Ranking Table */}
      <Card className="hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-slate-600" />
            회원별 참여 현황
          </h2>
          
          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('rate')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'rate'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              참여율
            </button>
            <button
              onClick={() => setActiveTab('count')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'count'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              참여 횟수
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {rankedData.map((member) => (
            <div 
              key={member.id} 
              className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all hover:shadow-lg ${
                member.rank <= 3
                  ? 'bg-slate-50 border-slate-300'
                  : 'bg-white border-slate-200 hover:border-slate-400'
              }`}
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                {getRankBadge(member.rank)}
              </div>
              
              {/* Profile */}
              <img 
                src={member.profileImage}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
              />
              
              {/* Info */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                  <Badge variant="primary">{member.position}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Attendance Count */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      <span className="font-bold text-lg text-slate-900">{member.attended}</span>
                      <span className="text-slate-500">/{member.totalEvents}회 참석</span>
                    </span>
                  </div>
                  
                  {/* Right: Attendance Rate */}
                  <div className="flex items-center gap-3">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600">참여율</span>
                        {getRateBadge(member.rate)}
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(member.rate)}`}
                          style={{ width: `${member.rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Info Box */}
      <Card className="mt-6 bg-slate-50 border-2 border-slate-200">
        <p className="text-slate-700">
          <strong className="text-slate-900">참고:</strong> 참여율은 2023년 2월 이후 (또는 그 이후 가입한 회원은 가입 이후) 진행된 전체 산행 대비 참석한 산행의 비율입니다.
        </p>
      </Card>
    </div>
  );
};

export default Attendance;

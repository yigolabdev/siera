import { TrendingUp, Award, Calendar, Users, BarChart3 } from 'lucide-react';

const Attendance = () => {
  const attendanceData = [
    {
      id: 1,
      rank: 1,
      name: '김대한',
      position: '회장',
      totalEvents: 48,
      attended: 46,
      rate: 95.8,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      rank: 2,
      name: '최우주',
      position: '임원',
      totalEvents: 36,
      attended: 32,
      rate: 88.9,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      rank: 3,
      name: '이민국',
      position: '부회장',
      totalEvents: 42,
      attended: 37,
      rate: 88.1,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      rank: 4,
      name: '정지구',
      position: '회원',
      totalEvents: 32,
      attended: 27,
      rate: 84.4,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    {
      id: 5,
      rank: 5,
      name: '박세계',
      position: '임원',
      totalEvents: 40,
      attended: 33,
      rate: 82.5,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    {
      id: 6,
      rank: 6,
      name: '홍천지',
      position: '회원',
      totalEvents: 28,
      attended: 22,
      rate: 78.6,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
  ];
  
  const monthlyStats = [
    { month: '2023-07', events: 1, avgAttendance: 32 },
    { month: '2023-08', events: 1, avgAttendance: 35 },
    { month: '2023-09', events: 1, avgAttendance: 38 },
    { month: '2023-10', events: 1, avgAttendance: 36 },
    { month: '2023-11', events: 1, avgAttendance: 34 },
    { month: '2023-12', events: 1, avgAttendance: 37 },
  ];
  
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return <Award className="h-8 w-8 text-yellow-500" />;
    } else if (rank === 2) {
      return <Award className="h-8 w-8 text-gray-400" />;
    } else if (rank === 3) {
      return <Award className="h-8 w-8 text-orange-600" />;
    }
    return <span className="text-2xl font-bold text-gray-400">{rank}</span>;
  };
  
  const getProgressColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-600';
    if (rate >= 80) return 'bg-blue-600';
    if (rate >= 70) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  const totalEvents = 48;
  const avgAttendanceRate = Math.round(
    attendanceData.reduce((sum, member) => sum + member.rate, 0) / attendanceData.length
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">참여율 현황</h1>
        <p className="text-xl text-gray-600">
          회원님들의 산행 참여율을 확인하세요.
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center space-x-4">
            <Calendar className="h-10 w-10 text-blue-600" />
            <div>
              <p className="text-gray-500 font-medium">총 산행 횟수</p>
              <p className="text-3xl font-bold text-gray-900">{totalEvents}회</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-4">
            <Users className="h-10 w-10 text-green-600" />
            <div>
              <p className="text-gray-500 font-medium">평균 참가자</p>
              <p className="text-3xl font-bold text-gray-900">35명</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-10 w-10 text-purple-600" />
            <div>
              <p className="text-gray-500 font-medium">평균 참여율</p>
              <p className="text-3xl font-bold text-gray-900">{avgAttendanceRate}%</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-4">
            <Award className="h-10 w-10 text-yellow-600" />
            <div>
              <p className="text-gray-500 font-medium">최고 참여율</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.max(...attendanceData.map(m => m.rate)).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Monthly Trend */}
      <div className="card mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="h-6 w-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">월별 참여 추이</h2>
        </div>
        <div className="space-y-4">
          {monthlyStats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium w-24 text-base">
                {stat.month}
              </span>
              <div className="flex-grow">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>평균 {stat.avgAttendance}명 참석</span>
                  <span>{Math.round((stat.avgAttendance / 45) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(stat.avgAttendance / 45) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Ranking Table */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <Award className="h-6 w-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">회원별 참여율 순위</h2>
        </div>
        
        <div className="space-y-4">
          {attendanceData.map((member) => (
            <div 
              key={member.id} 
              className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                member.rank <= 3 ? 'bg-gradient-to-r from-primary-50 to-green-50' : 'bg-gray-50'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-12">
                {getRankBadge(member.rank)}
              </div>
              
              {/* Profile */}
              <img 
                src={member.profileImage}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              
              {/* Info */}
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded">
                    {member.position}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span>전체 {member.totalEvents}회</span>
                  <span>참석 {member.attended}회</span>
                  <span>불참 {member.totalEvents - member.attended}회</span>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center space-x-3">
                  <div className="flex-grow">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(member.rate)}`}
                        style={{ width: `${member.rate}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xl font-bold text-gray-900 w-16 text-right">
                    {member.rate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-base">
          <strong>참고:</strong> 참여율은 가입 이후 진행된 전체 산행 대비 참석한 산행의 비율입니다.
        </p>
      </div>
    </div>
  );
};

export default Attendance;


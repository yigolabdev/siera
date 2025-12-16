import { Users, Search, Mail, Briefcase, Award } from 'lucide-react';
import { useState } from 'react';

const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  
  const positions = [
    { id: 'all', name: '전체' },
    { id: 'president', name: '회장' },
    { id: 'vice-president', name: '부회장' },
    { id: 'executive', name: '임원' },
    { id: 'member', name: '회원' },
  ];
  
  const members = [
    {
      id: 1,
      name: '김대한',
      position: 'president',
      occupation: '○○그룹 회장',
      company: '○○그룹',
      joinDate: '2020-01-15',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      attendanceRate: 95,
    },
    {
      id: 2,
      name: '이민국',
      position: 'vice-president',
      occupation: '△△건설 대표이사',
      company: '△△건설',
      joinDate: '2020-03-20',
      email: 'lee@example.com',
      phone: '010-2345-6789',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      attendanceRate: 88,
    },
    {
      id: 3,
      name: '박세계',
      position: 'executive',
      occupation: '□□금융 부사장',
      company: '□□금융',
      joinDate: '2020-06-10',
      email: 'park@example.com',
      phone: '010-3456-7890',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      attendanceRate: 82,
    },
    {
      id: 4,
      name: '최우주',
      position: 'executive',
      occupation: '◇◇제약 전무이사',
      company: '◇◇제약',
      joinDate: '2021-01-05',
      email: 'choi@example.com',
      phone: '010-4567-8901',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      attendanceRate: 90,
    },
    {
      id: 5,
      name: '정지구',
      position: 'member',
      occupation: '☆☆병원 원장',
      company: '☆☆병원',
      joinDate: '2021-03-15',
      email: 'jung@example.com',
      phone: '010-5678-9012',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      attendanceRate: 85,
    },
    {
      id: 6,
      name: '홍천지',
      position: 'member',
      occupation: '※※법률사무소 대표변호사',
      company: '※※법률사무소',
      joinDate: '2021-06-20',
      email: 'hong@example.com',
      phone: '010-6789-0123',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      attendanceRate: 78,
    },
  ];
  
  const filteredMembers = members.filter(member => {
    const matchesPosition = selectedPosition === 'all' || member.position === selectedPosition;
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPosition && matchesSearch;
  });
  
  const getPositionBadge = (position: string) => {
    const badges: { [key: string]: { bg: string; text: string; label: string } } = {
      president: { bg: 'bg-red-100', text: 'text-red-800', label: '회장' },
      'vice-president': { bg: 'bg-orange-100', text: 'text-orange-800', label: '부회장' },
      executive: { bg: 'bg-blue-100', text: 'text-blue-800', label: '임원' },
      member: { bg: 'bg-green-100', text: 'text-green-800', label: '회원' },
    };
    const badge = badges[position] || badges.member;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">회원명부</h1>
        <p className="text-xl text-gray-600">
          시애라 회원님들의 정보를 확인하세요.
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center space-x-4">
            <Users className="h-10 w-10 text-blue-600" />
            <div>
              <p className="text-gray-500 font-medium">전체 회원</p>
              <p className="text-3xl font-bold text-gray-900">{members.length}명</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-4">
            <Award className="h-10 w-10 text-red-600" />
            <div>
              <p className="text-gray-500 font-medium">임원진</p>
              <p className="text-3xl font-bold text-gray-900">
                {members.filter(m => m.position !== 'member').length}명
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-4">
            <Briefcase className="h-10 w-10 text-green-600" />
            <div>
              <p className="text-gray-500 font-medium">일반 회원</p>
              <p className="text-3xl font-bold text-gray-900">
                {members.filter(m => m.position === 'member').length}명
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-4">
            <Users className="h-10 w-10 text-purple-600" />
            <div>
              <p className="text-gray-500 font-medium">평균 참여율</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(members.reduce((sum, m) => sum + m.attendanceRate, 0) / members.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="이름, 직업, 회사명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {positions.map((position) => (
            <button
              key={position.id}
              onClick={() => setSelectedPosition(position.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedPosition === position.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {position.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="card">
            <div className="flex items-start space-x-4">
              <img 
                src={member.profileImage}
                alt={member.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  {getPositionBadge(member.position)}
                </div>
                <div className="space-y-1 mb-3">
                  <div className="flex items-start space-x-2">
                    <Briefcase className="h-4 w-4 text-gray-500 mt-1" />
                    <div className="text-sm">
                      <p className="text-gray-900 font-medium">{member.occupation}</p>
                      <p className="text-gray-600">{member.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Mail className="h-4 w-4" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-500">가입일: {member.joinDate}</span>
                <span className="text-sm font-bold text-primary-600">
                  참여율 {member.attendanceRate}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default Members;


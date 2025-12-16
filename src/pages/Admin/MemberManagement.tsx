import { useState } from 'react';
import { Search, Check, X, Mail, Phone, Briefcase, UserCheck, UserX, Shield } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  occupation: string;
  company: string;
  role: 'admin' | 'member';
  isApproved: boolean;
  joinDate: string;
}

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: '관리자',
      email: 'admin@siera.com',
      phoneNumber: '010-0000-0000',
      occupation: '관리자',
      company: '시애라',
      role: 'admin',
      isApproved: true,
      joinDate: '2020-01-01',
    },
    {
      id: '2',
      name: '홍길동',
      email: 'hong@example.com',
      phoneNumber: '010-1234-5678',
      occupation: '○○그룹 회장',
      company: '○○그룹',
      role: 'member',
      isApproved: true,
      joinDate: '2026-01-10',
    },
    {
      id: '3',
      name: '김철수',
      email: 'kim@example.com',
      phoneNumber: '010-2345-6789',
      occupation: '△△건설 대표이사',
      company: '△△건설',
      role: 'member',
      isApproved: false,
      joinDate: '2026-01-15',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');

  const handleApprove = (id: string) => {
    if (confirm('이 회원을 승인하시겠습니까?')) {
      setMembers(members.map(m => m.id === id ? { ...m, isApproved: true } : m));
    }
  };

  const handleReject = (id: string) => {
    if (confirm('이 회원을 거부하시겠습니까?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const handleToggleAdmin = (id: string) => {
    setMembers(members.map(m => {
      if (m.id === id) {
        const newRole = m.role === 'admin' ? 'member' : 'admin';
        return { ...m, role: newRole };
      }
      return m;
    }));
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'approved' ? member.isApproved :
      !member.isApproved;
    
    return matchesSearch && matchesFilter;
  });

  const pendingCount = members.filter(m => !m.isApproved).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">회원 관리</h1>
        <p className="text-xl text-gray-600">
          회원 가입 승인 및 회원 정보를 관리할 수 있습니다.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center space-x-4">
            <UserCheck className="h-10 w-10 text-green-600" />
            <div>
              <p className="text-gray-500 font-medium">승인된 회원</p>
              <p className="text-3xl font-bold text-gray-900">
                {members.filter(m => m.isApproved).length}명
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-4">
            <UserX className="h-10 w-10 text-yellow-600" />
            <div>
              <p className="text-gray-500 font-medium">승인 대기</p>
              <p className="text-3xl font-bold text-gray-900">{pendingCount}명</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <div>
              <p className="text-gray-500 font-medium">관리자</p>
              <p className="text-3xl font-bold text-gray-900">
                {members.filter(m => m.role === 'admin').length}명
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 이메일, 회사명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filterStatus === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filterStatus === 'approved'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              승인완료
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap relative ${
                filterStatus === 'pending'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              승인대기
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        {filteredMembers.map((member) => (
          <div key={member.id} className={`card ${!member.isApproved ? 'border-l-4 border-yellow-500' : ''}`}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-grow">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  {member.role === 'admin' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
                      관리자
                    </span>
                  )}
                  {!member.isApproved && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full">
                      승인대기
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{member.phoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{member.occupation}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{member.company}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  가입일: {member.joinDate}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                {!member.isApproved ? (
                  <>
                    <button
                      onClick={() => handleApprove(member.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 whitespace-nowrap"
                    >
                      <Check className="h-5 w-5" />
                      <span>승인</span>
                    </button>
                    <button
                      onClick={() => handleReject(member.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2 whitespace-nowrap"
                    >
                      <X className="h-5 w-5" />
                      <span>거부</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleToggleAdmin(member.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 whitespace-nowrap ${
                      member.role === 'admin'
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    <span>{member.role === 'admin' ? '일반회원으로' : '관리자로 지정'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <UserX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;


import { useState } from 'react';
import { Search, Shield, Users, Crown, UserCog } from 'lucide-react';

type UserRole = 'admin' | 'staff' | 'member';

interface Member {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  occupation: string;
  company: string;
  role: UserRole;
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
      joinDate: '2020-01-01',
    },
    {
      id: '2',
      name: '김운영',
      email: 'staff@example.com',
      phoneNumber: '010-1111-2222',
      occupation: '산악대장',
      company: '시애라',
      role: 'staff',
      joinDate: '2021-03-15',
    },
    {
      id: '3',
      name: '홍길동',
      email: 'hong@example.com',
      phoneNumber: '010-1234-5678',
      occupation: '○○그룹 회장',
      company: '○○그룹',
      role: 'member',
      joinDate: '2026-01-10',
    },
    {
      id: '4',
      name: '김철수',
      email: 'kim@example.com',
      phoneNumber: '010-2345-6789',
      occupation: '△△건설 대표이사',
      company: '△△건설',
      role: 'member',
      joinDate: '2026-01-15',
    },
    {
      id: '5',
      name: '이영희',
      email: 'lee@example.com',
      phoneNumber: '010-3456-7890',
      occupation: '변호사',
      company: '법무법인 정의',
      role: 'member',
      joinDate: '2025-12-20',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');

  const handleChangeRole = (memberId: string, newRole: UserRole) => {
    if (confirm(`이 회원의 권한을 변경하시겠습니까?`)) {
      setMembers(members.map(m => 
        m.id === memberId ? { ...m, role: newRole } : m
      ));
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: '관리자', icon: Crown };
      case 'staff':
        return { label: '운영진', icon: UserCog };
      case 'member':
        return { label: '일반회원', icon: Users };
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterRole === 'all' || member.role === filterRole;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    admin: members.filter(m => m.role === 'admin').length,
    staff: members.filter(m => m.role === 'staff').length,
    member: members.filter(m => m.role === 'member').length,
    total: members.length,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">회원 권한 관리</h1>
              <p className="text-xl text-slate-400">회원의 권한 등급을 관리할 수 있습니다</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">전체 회원</p>
                  <p className="text-4xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">관리자</p>
                  <p className="text-4xl font-bold text-white">{stats.admin}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <Crown className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">운영진</p>
                  <p className="text-4xl font-bold text-white">{stats.staff}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <UserCog className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">일반회원</p>
                  <p className="text-4xl font-bold text-white">{stats.member}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <Users className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="이름, 이메일, 회사명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-500"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterRole('all')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    filterRole === 'all'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setFilterRole('admin')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    filterRole === 'admin'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  관리자
                </button>
                <button
                  onClick={() => setFilterRole('staff')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    filterRole === 'staff'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  운영진
                </button>
                <button
                  onClick={() => setFilterRole('member')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    filterRole === 'member'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  일반회원
                </button>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            {filteredMembers.map((member) => {
              const roleBadgeInfo = getRoleBadge(member.role);
              const RoleIcon = roleBadgeInfo.icon;

              return (
                <div key={member.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-emerald-500/50 transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30 flex items-center gap-2">
                          <RoleIcon className="w-4 h-4" />
                          {roleBadgeInfo.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-medium">이메일:</span>
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-medium">전화번호:</span>
                          <span>{member.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-medium">직업:</span>
                          <span>{member.occupation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-medium">회사:</span>
                          <span>{member.company}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-500 mt-3">
                        가입일: {member.joinDate}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[180px]">
                      <p className="text-sm font-semibold text-slate-400 mb-1">권한 변경</p>
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value as UserRole)}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white font-medium cursor-pointer hover:bg-slate-700 transition-colors"
                      >
                        <option value="admin">관리자</option>
                        <option value="staff">운영진</option>
                        <option value="member">일반회원</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMembers.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
              <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-xl text-slate-400">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;

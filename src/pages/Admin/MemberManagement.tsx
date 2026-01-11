import { useState } from 'react';
import { Users, Shield, UserCog, Search, UserCheck, UserPlus, Check, X, Eye, Calendar, Briefcase, Building2, Phone, Mail, Mountain, MessageSquare, Edit, Save, Plus, Award, AlertCircle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { UserRole, PendingUser } from '../../types';
import { mockPendingUsers } from '../../data/mockPendingUsers';
import { formatDate } from '../../utils/format';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  company: string;
  joinDate: string;
  role: UserRole;
}

interface ExecutivePosition {
  id: string;
  title: '회장' | '부회장' | '운영진' | '감사' | '재무';
  memberName?: string;
  memberId?: number;
  startTerm: string;  // YYYY-MM
  endTerm: string;    // YYYY-MM
}

interface GuestApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string; // 참여 이유
  referredBy?: string; // 추천인
}

const MemberManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'members' | 'approval' | 'executives' | 'guestApplications'>('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedPendingUser, setSelectedPendingUser] = useState<PendingUser | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [editingExecutive, setEditingExecutive] = useState<ExecutivePosition | null>(null);
  
  // 비밀번호 확인 모달 상태
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordAction, setPasswordAction] = useState<(() => void) | null>(null);

  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: '김대한',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      occupation: '○○그룹 회장',
      company: '○○그룹',
      joinDate: '2020-01-15',
      role: 'admin',
    },
    {
      id: 2,
      name: '이민국',
      email: 'lee@example.com',
      phone: '010-2345-6789',
      occupation: '△△건설 대표이사',
      company: '△△건설',
      joinDate: '2020-03-20',
      role: 'staff',
    },
    {
      id: 3,
      name: '박세계',
      email: 'park@example.com',
      phone: '010-3456-7890',
      occupation: '□□금융 부사장',
      company: '□□금융',
      joinDate: '2020-06-10',
      role: 'staff',
    },
    {
      id: 4,
      name: '최우주',
      email: 'choi@example.com',
      phone: '010-4567-8901',
      occupation: '◇◇제약 전무이사',
      company: '◇◇제약',
      joinDate: '2021-01-05',
      role: 'member',
    },
    {
      id: 5,
      name: '정지구',
      email: 'jung@example.com',
      phone: '010-5678-9012',
      occupation: '☆☆병원 원장',
      company: '☆☆병원',
      joinDate: '2021-03-15',
      role: 'member',
    },
  ]);

  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(mockPendingUsers);

  // 게스트 신청 목록
  const [guestApplications, setGuestApplications] = useState<GuestApplication[]>([
    {
      id: '1',
      name: '홍길동',
      email: 'hong@example.com',
      phone: '010-1111-2222',
      eventId: '1',
      eventTitle: '북한산 백운대 등반',
      eventDate: '2026-02-15',
      appliedAt: '2026-01-20 10:30',
      status: 'pending',
      reason: '등산을 시작한지 1년이 되었고, 시애라 산악회의 체계적인 산행에 참여하고 싶습니다.',
      referredBy: '김대한',
    },
    {
      id: '2',
      name: '이영희',
      email: 'lee.yh@example.com',
      phone: '010-3333-4444',
      eventId: '1',
      eventTitle: '북한산 백운대 등반',
      eventDate: '2026-02-15',
      appliedAt: '2026-01-21 14:20',
      status: 'pending',
      reason: '건강한 취미생활을 위해 등산에 관심이 생겼습니다.',
    },
    {
      id: '3',
      name: '박철수',
      email: 'park.cs@example.com',
      phone: '010-5555-6666',
      eventId: '1',
      eventTitle: '북한산 백운대 등반',
      eventDate: '2026-02-15',
      appliedAt: '2026-01-19 09:15',
      status: 'approved',
      reason: '산행 경험이 많으며, 새로운 동호회 활동에 참여하고 싶습니다.',
      referredBy: '이민국',
    },
  ]);

  const [guestFilter, setGuestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedGuestApplication, setSelectedGuestApplication] = useState<GuestApplication | null>(null);
  const [isGuestDetailModalOpen, setIsGuestDetailModalOpen] = useState(false);

  // 운영진 목록 - 미리 정의된 5개 직책
  const [executives, setExecutives] = useState<ExecutivePosition[]>([
    {
      id: '1',
      title: '회장',
      memberName: '김대한',
      memberId: 1,
      startTerm: '2024-01',
      endTerm: '2026-12',
    },
    {
      id: '2',
      title: '부회장',
      memberName: '이민국',
      memberId: 2,
      startTerm: '2024-01',
      endTerm: '2026-12',
    },
    {
      id: '3',
      title: '감사',
      memberName: '박세계',
      memberId: 3,
      startTerm: '2024-01',
      endTerm: '2026-12',
    },
    {
      id: '4',
      title: '재무',
      startTerm: '2024-01',
      endTerm: '2026-12',
    },
    {
      id: '5',
      title: '운영진',
      startTerm: '2024-01',
      endTerm: '2026-12',
    },
  ]);

  const [executiveFormData, setExecutiveFormData] = useState({
    title: '',
    memberId: 0,
    startTerm: '',
    endTerm: '',
  });

  // 비밀번호 검증 요청 함수
  const requestPasswordVerification = (action: () => void) => {
    setPasswordAction(() => action);
    setPasswordInput('');
    setIsPasswordModalOpen(true);
  };

  // 비밀번호 확인 처리
  const handlePasswordConfirm = () => {
    // TODO: 실제 비밀번호 검증 로직으로 대체 필요
    // 현재는 간단한 데모용 비밀번호 사용
    if (passwordInput === 'admin1234') {
      setIsPasswordModalOpen(false);
      setPasswordInput('');
      if (passwordAction) {
        passwordAction();
      }
      setPasswordAction(null);
    } else {
      alert('비밀번호가 올바르지 않습니다.');
      setPasswordInput('');
    }
  };

  // 비밀번호 모달 취소
  const handlePasswordCancel = () => {
    setIsPasswordModalOpen(false);
    setPasswordInput('');
    setPasswordAction(null);
  };

  const handleRoleChange = (memberId: number, newRole: UserRole) => {
    if (confirm(`정말 권한을 변경하시겠습니까?`)) {
      requestPasswordVerification(() => {
        setMembers(prev =>
          prev.map(member =>
            member.id === memberId ? { ...member, role: newRole } : member
          )
        );
        alert('권한이 변경되었습니다.');
      });
    }
  };

  const handleApprove = (userId: string) => {
    setPendingUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, status: 'approved' as const }
          : user
      )
    );
    alert('회원가입이 승인되었습니다.');
    setIsDetailModalOpen(false);
  };

  const handleReject = (userId: string) => {
    const reason = prompt('거절 사유를 입력해주세요 (선택):');
    setPendingUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, status: 'rejected' as const }
          : user
      )
    );
    alert('회원가입이 거절되었습니다.');
    setIsDetailModalOpen(false);
  };

  const handleViewDetail = (user: PendingUser) => {
    setSelectedPendingUser(user);
    setIsDetailModalOpen(true);
  };

  // 게스트 신청 처리 함수
  const handleApproveGuest = (applicationId: string) => {
    setGuestApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? { ...app, status: 'approved' as const }
          : app
      )
    );
    alert('게스트 신청이 승인되었습니다.');
    setIsGuestDetailModalOpen(false);
  };

  const handleRejectGuest = (applicationId: string) => {
    const reason = prompt('거절 사유를 입력해주세요 (선택):');
    setGuestApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? { ...app, status: 'rejected' as const }
          : app
      )
    );
    alert('게스트 신청이 거절되었습니다.');
    setIsGuestDetailModalOpen(false);
  };

  const handleViewGuestDetail = (application: GuestApplication) => {
    setSelectedGuestApplication(application);
    setIsGuestDetailModalOpen(true);
  };

  // 운영진 관리 함수
  const handleOpenExecutiveModal = (executive: ExecutivePosition) => {
    setEditingExecutive(executive);
    setExecutiveFormData({
      title: executive.title,
      memberId: executive.memberId || 0,
      startTerm: executive.startTerm,
      endTerm: executive.endTerm,
    });
    setIsExecutiveModalOpen(true);
  };

  const handleSaveExecutive = () => {
    if (!executiveFormData.startTerm || !executiveFormData.endTerm) {
      alert('임기를 모두 입력해주세요.');
      return;
    }

    const member = executiveFormData.memberId ? members.find(m => m.id === executiveFormData.memberId) : undefined;

    // 비밀번호 검증 요청
    requestPasswordVerification(() => {
      if (editingExecutive) {
        // 수정
        setExecutives(prev =>
          prev.map(exec =>
            exec.id === editingExecutive.id
              ? {
                  ...exec,
                  memberName: member?.name,
                  memberId: executiveFormData.memberId || undefined,
                  startTerm: executiveFormData.startTerm,
                  endTerm: executiveFormData.endTerm,
                }
              : exec
          )
        );
        alert('운영진 정보가 수정되었습니다.');
      }
      setIsExecutiveModalOpen(false);
    });
  };

  const handleDeleteExecutive = (id: string) => {
    if (confirm('정말 이 운영진을 해임하시겠습니까?')) {
      // 비밀번호 검증 요청
      requestPasswordVerification(() => {
        setExecutives(prev => prev.map(exec =>
          exec.id === id
            ? {
                ...exec,
                memberName: undefined,
                memberId: undefined,
              }
            : exec
        ));
        alert('운영진이 해임되었습니다.');
      });
    }
  };

  const getHikingLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: '초급',
      intermediate: '중급',
      advanced: '상급',
    };
    return labels[level] || level;
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      member.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredPendingUsers = pendingUsers.filter(user => {
    if (approvalFilter === 'all') return true;
    return user.status === approvalFilter;
  });

  const memberStats = {
    total: members.length,
    admin: members.filter(m => m.role === 'admin').length,
    staff: members.filter(m => m.role === 'staff').length,
    member: members.filter(m => m.role === 'member').length,
  };

  const approvalStats = {
    pending: pendingUsers.filter(u => u.status === 'pending').length,
    approved: pendingUsers.filter(u => u.status === 'approved').length,
    rejected: pendingUsers.filter(u => u.status === 'rejected').length,
    total: pendingUsers.length,
  };

  const executiveStats = {
    total: executives.length,
    assigned: executives.filter(e => e.memberId).length,
    vacant: executives.filter(e => !e.memberId).length,
  };

  const guestStats = {
    pending: guestApplications.filter(g => g.status === 'pending').length,
    approved: guestApplications.filter(g => g.status === 'approved').length,
    rejected: guestApplications.filter(g => g.status === 'rejected').length,
    total: guestApplications.length,
  };

  const filteredGuestApplications = guestApplications.filter(app => {
    if (guestFilter === 'all') return true;
    return app.status === guestFilter;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge variant="danger">관리자</Badge>;
      case 'staff':
        return <Badge variant="info">운영진</Badge>;
      case 'member':
        return <Badge variant="success">일반회원</Badge>;
      default:
        return <Badge variant="primary">회원</Badge>;
    }
  };

  const getStatusBadge = (status: PendingUser['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">승인대기</Badge>;
      case 'approved':
        return <Badge variant="success">승인완료</Badge>;
      case 'rejected':
        return <Badge variant="danger">거절됨</Badge>;
      default:
        return null;
    }
  };

  const isTermActive = (startTerm: string, endTerm: string) => {
    const today = new Date();
    const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    return currentYearMonth >= startTerm && currentYearMonth <= endTerm;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">회원 관리</h1>
        <p className="text-xl text-slate-600">
          회원 정보를 관리하고 가입 신청을 승인하며 운영진을 관리할 수 있습니다.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-slate-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 px-1 border-b-2 font-bold text-lg transition-colors flex items-center gap-2 ${
                activeTab === 'members'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Users className="w-5 h-5" />
              회원 관리
              <Badge variant={activeTab === 'members' ? 'primary' : 'info'}>{memberStats.total}</Badge>
            </button>
            <button
              onClick={() => setActiveTab('approval')}
              className={`py-4 px-1 border-b-2 font-bold text-lg transition-colors flex items-center gap-2 ${
                activeTab === 'approval'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              가입 승인
              {approvalStats.pending > 0 && (
                <Badge variant={activeTab === 'approval' ? 'danger' : 'warning'}>{approvalStats.pending}</Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab('guestApplications')}
              className={`py-4 px-1 border-b-2 font-bold text-lg transition-colors flex items-center gap-2 ${
                activeTab === 'guestApplications'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Mountain className="w-5 h-5" />
              게스트 신청
              {guestStats.pending > 0 && (
                <Badge variant={activeTab === 'guestApplications' ? 'danger' : 'warning'}>{guestStats.pending}</Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab('executives')}
              className={`py-4 px-1 border-b-2 font-bold text-lg transition-colors flex items-center gap-2 ${
                activeTab === 'executives'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Award className="w-5 h-5" />
              운영진 관리
              <Badge variant={activeTab === 'executives' ? 'primary' : 'info'}>{executiveStats.total}</Badge>
            </button>
          </nav>
        </div>
      </div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-slate-600 text-sm mb-1">전체 회원</p>
              <p className="text-3xl font-bold text-slate-900">{memberStats.total}명</p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-slate-600 text-sm mb-1">관리자</p>
              <p className="text-3xl font-bold text-slate-900">{memberStats.admin}명</p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <UserCog className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-slate-600 text-sm mb-1">운영진</p>
              <p className="text-3xl font-bold text-slate-900">{memberStats.staff}명</p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-slate-600 text-sm mb-1">일반회원</p>
              <p className="text-3xl font-bold text-slate-900">{memberStats.member}명</p>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="이름, 이메일, 전화번호, 직업, 회사로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  roleFilter === 'all'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setRoleFilter('admin')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  roleFilter === 'admin'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                관리자
              </button>
              <button
                onClick={() => setRoleFilter('staff')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  roleFilter === 'staff'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                운영진
              </button>
              <button
                onClick={() => setRoleFilter('member')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  roleFilter === 'member'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                일반회원
              </button>
            </div>
          </div>

          {/* Member List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <Card key={member.id} className="hover:shadow-xl hover:border-primary-600 transition-all">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                      {getRoleBadge(member.role)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{member.occupation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="w-4 h-4" />
                        <span>{member.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>가입: {member.joinDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <label htmlFor={`role-${member.id}`} className="block text-sm font-semibold text-slate-700 mb-2">
                      역할 변경
                    </label>
                    <select
                      id={`role-${member.id}`}
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                      className="input-field"
                    >
                      <option value="admin">관리자</option>
                      <option value="staff">운영진</option>
                      <option value="member">일반회원</option>
                    </select>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="lg:col-span-3 text-center py-12">
                <p className="text-xl text-slate-500">해당하는 회원이 없습니다.</p>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Approval Tab */}
      {activeTab === 'approval' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <UserPlus className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-slate-600 text-sm mb-1">전체 신청</p>
              <p className="text-3xl font-bold text-slate-900">{approvalStats.total}명</p>
            </Card>

            <Card className="text-center bg-yellow-50 border-yellow-200 hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-yellow-700 text-sm mb-1">승인대기</p>
              <p className="text-3xl font-bold text-yellow-900">{approvalStats.pending}명</p>
            </Card>

            <Card className="text-center bg-green-50 border-green-200 hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-green-700 text-sm mb-1">승인완료</p>
              <p className="text-3xl font-bold text-green-900">{approvalStats.approved}명</p>
            </Card>

            <Card className="text-center bg-red-50 border-red-200 hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-red-700 text-sm mb-1">거절됨</p>
              <p className="text-3xl font-bold text-red-900">{approvalStats.rejected}명</p>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setApprovalFilter('all')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                approvalFilter === 'all'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setApprovalFilter('pending')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                approvalFilter === 'pending'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              승인대기 ({approvalStats.pending})
            </button>
            <button
              onClick={() => setApprovalFilter('approved')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                approvalFilter === 'approved'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              승인완료
            </button>
            <button
              onClick={() => setApprovalFilter('rejected')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                approvalFilter === 'rejected'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              거절됨
            </button>
          </div>

          {/* Pending User List */}
          <div className="space-y-4">
            {filteredPendingUsers.length > 0 ? (
              filteredPendingUsers.map(user => (
                <Card key={user.id} className="hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                        {getStatusBadge(user.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{user.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{user.occupation}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {user.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-semibold flex items-center gap-2"
                          >
                            <Check className="h-5 w-5" />
                            <span>승인</span>
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold flex items-center gap-2"
                          >
                            <X className="h-5 w-5" />
                            <span>거절</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewDetail(user)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold flex items-center gap-2"
                      >
                        <Eye className="h-5 w-5" />
                        <span>상세보기</span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <p className="text-xl text-slate-500">해당하는 신청이 없습니다.</p>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Executives Tab */}
      {activeTab === 'executives' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-slate-600 text-sm mb-1">전체 직책</p>
              <p className="text-3xl font-bold text-slate-900">{executiveStats.total}개</p>
            </Card>

            <Card className="text-center bg-blue-50 border-blue-200 hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-blue-700 text-sm mb-1">임명됨</p>
              <p className="text-3xl font-bold text-blue-900">{executiveStats.assigned}명</p>
            </Card>

            <Card className="text-center bg-amber-50 border-amber-200 hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <UserPlus className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-amber-700 text-sm mb-1">공석</p>
              <p className="text-3xl font-bold text-amber-900">{executiveStats.vacant}개</p>
            </Card>
          </div>

          {/* Executives List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {executives.map((executive) => {
              const member = members.find(m => m.id === executive.memberId);
              const isActive = isTermActive(executive.startTerm, executive.endTerm);
              
              return (
                <Card 
                  key={executive.id} 
                  className={`hover:shadow-xl transition-all ${
                    isActive ? 'border-l-4 border-l-primary-500' : 'opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-slate-900">{executive.title}</h3>
                        {isActive ? (
                          <Badge variant="success">현재 임기</Badge>
                        ) : (
                          <Badge variant="info">종료</Badge>
                        )}
                      </div>

                      {executive.memberId && member ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-900">
                            <UserCheck className="w-5 h-5 text-primary-600" />
                            <span className="font-bold text-lg">{executive.memberName}</span>
                          </div>
                          <div className="text-sm text-slate-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              <span>{member.occupation}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              <span>{member.company}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600">
                          <UserPlus className="w-5 h-5" />
                          <span className="font-semibold">공석 (미임명)</span>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">
                            임기: {executive.startTerm} ~ {executive.endTerm}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleOpenExecutiveModal(executive)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={executive.memberId ? "수정" : "임명"}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {executive.memberId && (
                        <button
                          onClick={() => handleDeleteExecutive(executive.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="해임"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {executives.length === 0 && (
            <Card className="text-center py-12">
              <Award className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="text-xl text-slate-500">운영진 직책이 설정되지 않았습니다.</p>
            </Card>
          )}

          {/* Info Notice */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">운영진 관리 안내</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• 운영진 직책을 추가하고 회원을 임명할 수 있습니다.</li>
                  <li>• 임기를 설정하여 기간별로 관리할 수 있습니다.</li>
                  <li>• 공석인 직책은 "미임명" 상태로 표시되며, 나중에 임명할 수 있습니다.</li>
                  <li>• 이 정보는 회원 명부의 운영진 페이지와 연동됩니다.</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Guest Applications Tab */}
      {activeTab === 'guestApplications' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <Mountain className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-slate-600 text-sm mb-1">전체 신청</p>
              <p className="text-3xl font-bold text-slate-900">{guestStats.total}명</p>
            </Card>

            <Card className="text-center bg-yellow-50 border-yellow-200 hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-yellow-700 text-sm mb-1">승인대기</p>
              <p className="text-3xl font-bold text-yellow-900">{guestStats.pending}명</p>
            </Card>

            <Card className="text-center bg-green-50 border-green-200 hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-green-700 text-sm mb-1">승인완료</p>
              <p className="text-3xl font-bold text-green-900">{guestStats.approved}명</p>
            </Card>

            <Card className="text-center bg-red-50 border-red-200 hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-red-700 text-sm mb-1">거절됨</p>
              <p className="text-3xl font-bold text-red-900">{guestStats.rejected}명</p>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setGuestFilter('all')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                guestFilter === 'all'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setGuestFilter('pending')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                guestFilter === 'pending'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              승인대기 ({guestStats.pending})
            </button>
            <button
              onClick={() => setGuestFilter('approved')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                guestFilter === 'approved'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              승인완료
            </button>
            <button
              onClick={() => setGuestFilter('rejected')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                guestFilter === 'rejected'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              거절됨
            </button>
          </div>

          {/* Guest Application List */}
          <div className="space-y-4">
            {filteredGuestApplications.length > 0 ? (
              filteredGuestApplications.map(application => (
                <Card key={application.id} className="hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{application.name}</h3>
                        <Badge variant={
                          application.status === 'approved' ? 'success' :
                          application.status === 'rejected' ? 'danger' : 'warning'
                        }>
                          {application.status === 'approved' ? '승인완료' :
                           application.status === 'rejected' ? '거절됨' : '승인대기'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mountain className="w-4 h-4" />
                          <span>{application.eventTitle}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>산행일: {application.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{application.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveGuest(application.id)}
                            className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-semibold flex items-center gap-2"
                          >
                            <Check className="h-5 w-5" />
                            <span>승인</span>
                          </button>
                          <button
                            onClick={() => handleRejectGuest(application.id)}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold flex items-center gap-2"
                          >
                            <X className="h-5 w-5" />
                            <span>거절</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewGuestDetail(application)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold flex items-center gap-2"
                      >
                        <Eye className="h-5 w-5" />
                        <span>상세보기</span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <p className="text-xl text-slate-500">해당하는 신청이 없습니다.</p>
              </Card>
            )}
          </div>

          {/* Guest Detail Modal */}
          <Modal
            isOpen={isGuestDetailModalOpen}
            onClose={() => setIsGuestDetailModalOpen(false)}
            title="게스트 신청 상세정보"
            size="lg"
          >
            {selectedGuestApplication && (
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-slate-900">{selectedGuestApplication.name}</h3>
                    <Badge variant={
                      selectedGuestApplication.status === 'approved' ? 'success' :
                      selectedGuestApplication.status === 'rejected' ? 'danger' : 'warning'
                    }>
                      {selectedGuestApplication.status === 'approved' ? '승인완료' :
                       selectedGuestApplication.status === 'rejected' ? '거절됨' : '승인대기'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* 신청 산행 정보 */}
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-3">신청 산행</h4>
                    <Card className="bg-blue-50 border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Mountain className="w-5 h-5 text-blue-600" />
                        <p className="font-bold text-slate-900">{selectedGuestApplication.eventTitle}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{selectedGuestApplication.eventDate}</span>
                      </div>
                    </Card>
                  </div>

                  {/* 기본 정보 */}
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-3">기본 정보</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">이메일</p>
                        <p className="text-slate-900 font-medium">{selectedGuestApplication.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">전화번호</p>
                        <p className="text-slate-900 font-medium">{selectedGuestApplication.phone}</p>
                      </div>
                      {selectedGuestApplication.referredBy && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-slate-600 mb-1">추천인</p>
                          <p className="text-slate-900 font-medium">{selectedGuestApplication.referredBy}</p>
                        </div>
                      )}
                      <div className="md:col-span-2">
                        <p className="text-sm text-slate-600 mb-1">신청일</p>
                        <p className="text-slate-900 font-medium">{selectedGuestApplication.appliedAt}</p>
                      </div>
                    </div>
                  </div>

                  {/* 참여 이유 */}
                  {selectedGuestApplication.reason && (
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-3">참여 이유</h4>
                      <Card className="bg-slate-50">
                        <p className="text-slate-700 whitespace-pre-wrap">{selectedGuestApplication.reason}</p>
                      </Card>
                    </div>
                  )}

                  {/* Actions */}
                  {selectedGuestApplication.status === 'pending' && (
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => handleRejectGuest(selectedGuestApplication.id)}
                        className="flex-1 px-6 py-3 bg-red-100 text-red-700 border-2 border-red-300 rounded-xl font-bold hover:bg-red-200 transition-all"
                      >
                        거절
                      </button>
                      <button
                        onClick={() => handleApproveGuest(selectedGuestApplication.id)}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
                      >
                        승인
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Modal>
        </>
      )}

      {/* Pending User Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="가입 신청 상세정보"
        size="lg"
      >
        {selectedPendingUser && (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-slate-900">{selectedPendingUser.name}</h3>
                {getStatusBadge(selectedPendingUser.status)}
              </div>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">기본 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">이메일</p>
                    <p className="text-slate-900 font-medium">{selectedPendingUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">전화번호</p>
                    <p className="text-slate-900 font-medium">{selectedPendingUser.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">직업</p>
                    <p className="text-slate-900 font-medium">{selectedPendingUser.occupation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">회사/기관</p>
                    <p className="text-slate-900 font-medium">{selectedPendingUser.company}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">추가 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">추천인</p>
                    <p className="text-slate-900 font-medium">{selectedPendingUser.referredBy || '없음'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">산행 능력</p>
                    <p className="text-slate-900 font-medium">{getHikingLevelLabel(selectedPendingUser.hikingLevel)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-600 mb-1">신청일</p>
                    <p className="text-slate-900 font-medium">{formatDate(selectedPendingUser.appliedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Application Message */}
              {selectedPendingUser.applicationMessage && (
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">신청 메시지</h4>
                  <Card className="bg-slate-50">
                    <p className="text-slate-700 whitespace-pre-wrap">{selectedPendingUser.applicationMessage}</p>
                  </Card>
                </div>
              )}

              {/* Actions */}
              {selectedPendingUser.status === 'pending' && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => handleReject(selectedPendingUser.id)}
                    className="flex-1 px-6 py-3 bg-red-100 text-red-700 border-2 border-red-300 rounded-xl font-bold hover:bg-red-200 transition-all"
                  >
                    거절
                  </button>
                  <button
                    onClick={() => handleApprove(selectedPendingUser.id)}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
                  >
                    승인
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Executive Modal */}
      <Modal
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        title={editingExecutive ? `${editingExecutive.title} 임명/수정` : '운영진 관리'}
        size="lg"
      >
        <div className="p-6">
          <div className="space-y-5">
            {/* 직책명 표시 (수정 불가) */}
            <div>
              <label className="block text-slate-700 font-semibold mb-2">
                직책
              </label>
              <div className="px-4 py-3 bg-slate-100 rounded-lg border border-slate-300">
                <p className="text-lg font-bold text-slate-900">{editingExecutive?.title}</p>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-2">
                회원 선택 {editingExecutive?.memberId ? '' : <Badge variant="warning">공석</Badge>}
              </label>
              <select
                value={executiveFormData.memberId}
                onChange={(e) => setExecutiveFormData({ ...executiveFormData, memberId: parseInt(e.target.value) })}
                className="input-field"
              >
                <option value={0}>미임명 (공석)</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.occupation} ({member.company})
                  </option>
                ))}
              </select>
              <p className="text-sm text-slate-500 mt-2">
                운영진으로 임명할 회원을 선택하세요.
              </p>
            </div>

            <div className="border-t pt-5">
              <p className="text-sm font-semibold text-slate-700 mb-4">임기 설정 <Badge variant="danger">필수</Badge></p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    시작
                  </label>
                  <input
                    type="month"
                    value={executiveFormData.startTerm}
                    onChange={(e) => setExecutiveFormData({ ...executiveFormData, startTerm: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    종료 <Badge variant="danger">필수</Badge>
                  </label>
                  <input
                    type="month"
                    value={executiveFormData.endTerm}
                    onChange={(e) => setExecutiveFormData({ ...executiveFormData, endTerm: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              onClick={() => setIsExecutiveModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              취소
            </button>
            <button
              onClick={handleSaveExecutive}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              저장
            </button>
          </div>
        </div>
      </Modal>

      {/* Password Verification Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={handlePasswordCancel}
        title="관리자 비밀번호 확인"
        size="sm"
      >
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                중요한 작업을 수행하기 위해 관리자 비밀번호가 필요합니다.
              </p>
            </div>
            
            <label className="block text-slate-700 font-semibold mb-2">
              비밀번호 <Badge variant="danger">필수</Badge>
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordConfirm();
                }
              }}
              className="input-field"
              placeholder="관리자 비밀번호를 입력하세요"
              autoFocus
            />
            <p className="text-xs text-slate-500 mt-2">
              데모 비밀번호: <code className="px-2 py-1 bg-slate-100 rounded">admin1234</code>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePasswordCancel}
              className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
            >
              취소
            </button>
            <button
              onClick={handlePasswordConfirm}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              확인
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MemberManagement;

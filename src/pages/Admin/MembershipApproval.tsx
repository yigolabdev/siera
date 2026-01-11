import { useState } from 'react';
import { UserPlus, Check, X, Eye, Calendar, Briefcase, Building2, Phone, Mail, Mountain, MessageSquare, UserCheck } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { mockPendingUsers } from '../../data/mockPendingUsers';
import { PendingUser } from '../../types';
import { formatDate } from '../../utils/format';

export default function MembershipApproval() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(mockPendingUsers);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const getHikingLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: '초급',
      intermediate: '중급',
      advanced: '상급',
    };
    return labels[level] || level;
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
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const filteredUsers = pendingUsers.filter(user => {
    if (filter === 'all') return true;
    return user.status === filter;
  });

  const stats = {
    pending: pendingUsers.filter(u => u.status === 'pending').length,
    approved: pendingUsers.filter(u => u.status === 'approved').length,
    rejected: pendingUsers.filter(u => u.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">가입 승인 관리</h1>
              <p className="text-xl text-slate-400">회원가입 신청을 검토하고 승인/거절할 수 있습니다</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <UserPlus className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">대기 중</p>
                  <p className="text-4xl font-bold text-white">{stats.pending}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <UserCheck className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">승인 완료</p>
                  <p className="text-4xl font-bold text-white">{stats.approved}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">거절</p>
                  <p className="text-4xl font-bold text-white">{stats.rejected}</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <X className="w-8 h-8 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setFilter('pending')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filter === 'pending'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                대기 중 ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filter === 'approved'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                승인 완료 ({stats.approved})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filter === 'rejected'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                거절 ({stats.rejected})
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                전체 ({pendingUsers.length})
              </button>
            </div>
          </div>

          {/* User List */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
                <UserPlus className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {filter === 'pending' ? '대기 중인 신청이 없습니다' : '해당하는 신청이 없습니다'}
                </h3>
                <p className="text-slate-400">
                  {filter === 'pending' ? '새로운 회원가입 신청이 접수되면 여기에 표시됩니다.' : '다른 탭을 확인해보세요.'}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-emerald-500/50 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                        {user.status === 'pending' && (
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30">
                            대기 중
                          </span>
                        )}
                        {user.status === 'approved' && (
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30">
                            승인 완료
                          </span>
                        )}
                        {user.status === 'rejected' && (
                          <span className="px-3 py-1 bg-slate-800 text-slate-400 text-sm font-medium rounded-full border border-slate-700">
                            거절됨
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <span>{user.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-slate-500" />
                          <span>{user.occupation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-500" />
                          <span>{user.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mountain className="w-4 h-4 text-slate-500" />
                          <span>산행능력: {getHikingLevelLabel(user.hikingLevel)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span>신청일: {formatDate(user.appliedAt)}</span>
                        </div>
                      </div>

                      {user.referredBy && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">추천인: {user.referredBy}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetail(user)}
                        className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-700"
                      >
                        <Eye className="w-4 h-4" />
                        상세보기
                      </button>
                      {user.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/30"
                          >
                            <Check className="w-4 h-4" />
                            승인
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-700"
                          >
                            <X className="w-4 h-4" />
                            거절
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detail Modal */}
          <Modal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            title="회원가입 신청 상세"
            size="lg"
          >
            {selectedUser && (
              <div className="p-6 space-y-6 bg-slate-900 text-white">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
                  {selectedUser.status === 'pending' && (
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30">
                      대기 중
                    </span>
                  )}
                  {selectedUser.status === 'approved' && (
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30">
                      승인 완료
                    </span>
                  )}
                  {selectedUser.status === 'rejected' && (
                    <span className="px-3 py-1 bg-slate-800 text-slate-400 text-sm font-medium rounded-full border border-slate-700">
                      거절됨
                    </span>
                  )}
                </div>

                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">기본 정보</h3>
                  <div className="space-y-3 bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-400">이메일</p>
                        <p className="font-medium text-white">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-400">전화번호</p>
                        <p className="font-medium text-white">{selectedUser.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-400">신청일</p>
                        <p className="font-medium text-white">{formatDate(selectedUser.appliedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">직업 정보</h3>
                  <div className="space-y-3 bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-400">직업</p>
                        <p className="font-medium text-white">{selectedUser.occupation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-400">회사/기관</p>
                        <p className="font-medium text-white">{selectedUser.company}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hiking Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">산행 정보</h3>
                  <div className="space-y-3 bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3">
                      <Mountain className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-400">산행능력</p>
                        <p className="font-medium text-white">{getHikingLevelLabel(selectedUser.hikingLevel)}</p>
                      </div>
                    </div>
                    {selectedUser.referredBy && (
                      <div className="flex items-center gap-3">
                        <UserCheck className="w-5 h-5 text-emerald-400" />
                        <div>
                          <p className="text-sm text-slate-400">추천인</p>
                          <p className="font-medium text-emerald-400">{selectedUser.referredBy}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Application Message */}
                {selectedUser.applicationMessage && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      가입신청 문구
                    </h3>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedUser.applicationMessage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedUser.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => handleApprove(selectedUser.id)}
                      className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
                    >
                      <Check className="w-5 h-5" />
                      승인하기
                    </button>
                    <button
                      onClick={() => handleReject(selectedUser.id)}
                      className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <X className="w-5 h-5" />
                      거절하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}

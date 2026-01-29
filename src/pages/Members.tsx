import { Users, Search, Mail, Briefcase, Award, X, Shield, TrendingUp, UserCheck, Calendar, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useMembers } from '../contexts/MemberContext';
import { useExecutives } from '../contexts/ExecutiveContext';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Members = () => {
  const { members, isLoading } = useMembers();
  const { executives, isLoading: isExecutivesLoading } = useExecutives();
  const [searchTerm, setSearchTerm] = useState('');
  const [showExecutiveModal, setShowExecutiveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // 디버깅: 회원 데이터 로드 확인
  console.log('👥 Members 페이지 - 전체 회원 수:', members.length);
  console.log('👥 Members 페이지 - 회원 목록:', members);
  console.log('👥 Members 페이지 - 운영진 수:', executives.length);
  console.log('👥 Members 페이지 - 운영진 목록:', executives);
  
  // 회원을 운영진과 일반 회원으로 분리
  // executives 컬렉션의 데이터를 사용하고, members 데이터와 병합
  const executivesWithMemberData = useMemo(() => {
    return executives.map(exec => {
      const memberData = members.find(m => m.id === exec.memberId);
      return {
        ...exec,
        ...memberData,
        // executive의 position을 우선 사용 (시애라 직책)
        executivePosition: exec.position,
        // member의 position은 직장 직책
        jobPosition: memberData?.position,
      };
    });
  }, [executives, members]);
  
  const regularMembers = useMemo(() => {
    // executives에 포함되지 않은 회원만 일반 회원으로 표시
    const executiveMemberIds = new Set(executives.map(e => e.memberId));
    return members.filter(m => !executiveMemberIds.has(m.id));
  }, [members, executives]);
  
  console.log('👥 운영진 (병합 데이터):', executivesWithMemberData.length, executivesWithMemberData);
  console.log('👥 일반 회원:', regularMembers.length, regularMembers);

  // 검색 필터링
  const filteredMembers = useMemo(() => {
    if (!searchTerm) return regularMembers;
    const term = searchTerm.toLowerCase();
    return regularMembers.filter(
      m => m.name.toLowerCase().includes(term) ||
           m.company?.toLowerCase().includes(term) ||
           m.position?.toLowerCase().includes(term)
    );
  }, [regularMembers, searchTerm]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(start, start + itemsPerPage);
  }, [filteredMembers, currentPage]);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '관리자';
      case 'chairman': return '회장단';
      case 'committee': return '운영위원';
      case 'guest': return '게스트';
      default: return '회원';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'chairman': return 'primary';
      case 'committee': return 'info';
      default: return 'default';
    }
  };

  if (isLoading || isExecutivesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">회원 명부를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">회원 명부</h1>
        <p className="text-slate-600">시애라클럽 회원 명단입니다.</p>
      </div>

      {/* 로딩 상태 */}
      {(isLoading || isExecutivesLoading) ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-900 mx-auto mb-4"></div>
            <p className="text-xl text-slate-600 font-medium">회원 정보를 불러오는 중...</p>
          </div>
        </div>
      ) : (
        <>
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">전체 회원</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{members.length}명</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">회장단</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {executivesWithMemberData.filter(e => e.category === 'chairman').length}명
              </p>
            </div>
            <Shield className="w-8 h-8 text-amber-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">운영위원</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {executivesWithMemberData.filter(e => e.category === 'committee').length}명
              </p>
            </div>
            <Award className="w-8 h-8 text-emerald-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">일반 회원</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{regularMembers.length}명</p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* 운영진 섹션 */}
      {executivesWithMemberData.length > 0 && (
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">운영진</h2>
            <button
              onClick={() => setShowExecutiveModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              전체 보기
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {executivesWithMemberData.slice(0, 5).map((exec) => (
              <div
                key={exec.id}
                className="text-center p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setSelectedMember(exec)}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 bg-slate-200">
                  {exec.profileImage ? (
                    <img
                      src={exec.profileImage}
                      alt={exec.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Users className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{exec.name}</h3>
                <Badge variant={exec.category === 'chairman' ? 'primary' : 'info'} size="sm">
                  {exec.executivePosition}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 검색 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="이름, 회사, 직책으로 검색..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 회원 목록 */}
      {filteredMembers.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {searchTerm ? '검색 결과가 없습니다' : '등록된 회원이 없습니다'}
          </h3>
          <p className="text-slate-600">
            {searchTerm ? '다른 검색어를 입력해보세요.' : '첫 번째 회원을 등록해보세요.'}
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedMembers.map((member) => (
              <Card
                key={member.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-slate-200">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Users className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 truncate">{member.name}</h3>
                      <Badge variant={getRoleBadgeVariant(member.role)} size="sm">
                        {getRoleLabel(member.role)}
                      </Badge>
                    </div>
                    
                    {member.company && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="truncate">{member.company}</span>
                      </div>
                    )}
                    
                    {member.position && (
                      <p className="text-sm text-slate-600 truncate">{member.position}</p>
                    )}
                    
                    {member.attendanceRate !== undefined && (
                      <div className="mt-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
                          참여율 {member.attendanceRate}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* 회원 상세 모달 */}
      {selectedMember && (
        <Modal
          onClose={() => setSelectedMember(null)}
          title="회원 정보"
        >
          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-slate-200 ring-4 ring-slate-100 shadow-lg">
                {selectedMember.profileImage ? (
                  <img
                    src={selectedMember.profileImage}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Users className="w-20 h-20" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedMember.name}</h2>
              {selectedMember.executivePosition ? (
                <Badge variant={selectedMember.category === 'chairman' ? 'primary' : 'info'}>
                  {selectedMember.executivePosition}
                </Badge>
              ) : (
                <Badge variant={getRoleBadgeVariant(selectedMember.role)}>
                  {getRoleLabel(selectedMember.role)}
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              {selectedMember.executivePosition && (
                <div className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-emerald-700 font-semibold">시애라 클럽 직책</p>
                    <p className="font-medium text-emerald-900">{selectedMember.executivePosition}</p>
                    <p className="text-xs text-emerald-600 mt-1">
                      {selectedMember.category === 'chairman' ? '회장단' : '운영위원회'}
                    </p>
                  </div>
                </div>
              )}

              {selectedMember.company && (
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">회사</p>
                    <p className="font-medium text-slate-900">{selectedMember.company}</p>
                  </div>
                </div>
              )}

              {(selectedMember.jobPosition || selectedMember.position) && (
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">직책 (직장)</p>
                    <p className="font-medium text-slate-900">
                      {selectedMember.jobPosition || selectedMember.position}
                    </p>
                  </div>
                </div>
              )}

              {selectedMember.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">이메일</p>
                    <p className="font-medium text-slate-900">{selectedMember.email}</p>
                  </div>
                </div>
              )}

              {selectedMember.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">연락처</p>
                    <p className="font-medium text-slate-900">{selectedMember.phone}</p>
                  </div>
                </div>
              )}

              {selectedMember.joinDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">가입일</p>
                    <p className="font-medium text-slate-900">{selectedMember.joinDate}</p>
                  </div>
                </div>
              )}

              {selectedMember.attendanceRate !== undefined && (
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">참여율</p>
                    <p className="font-medium text-blue-600">{selectedMember.attendanceRate}%</p>
                  </div>
                </div>
              )}

              {selectedMember.bio && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-slate-600 mb-2">소개</p>
                  <p className="text-slate-900">{selectedMember.bio}</p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* 운영진 전체 보기 모달 */}
      {showExecutiveModal && (
        <Modal
          onClose={() => setShowExecutiveModal(false)}
          title="운영진"
        >
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {executivesWithMemberData.map((exec) => (
                <div
                  key={exec.id}
                  className="text-center p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setShowExecutiveModal(false);
                    setSelectedMember(exec);
                  }}
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 bg-slate-200">
                    {exec.profileImage ? (
                      <img
                        src={exec.profileImage}
                        alt={exec.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Users className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{exec.name}</h3>
                  <Badge variant={exec.category === 'chairman' ? 'primary' : 'info'} size="sm">
                    {exec.executivePosition}
                  </Badge>
                  {exec.company && (
                    <p className="text-xs text-slate-600 mt-1 truncate">{exec.company}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
      </>
      )}
    </div>
  );
};

export default Members;

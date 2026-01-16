import { useState } from 'react';
import { Users, Phone, Mail, Edit2, Save, X, Plus, Trash2, Calendar, AlertCircle, Check, Shield, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  company: string;
}

interface Executive {
  id: number;
  memberId?: number;
  name: string;
  position: string;
  phone: string;
  email?: string;
  category: 'chairman' | 'committee';
  startTerm?: string; // YYYY-MM
  endTerm?: string;   // YYYY-MM
  bio?: string;       // 자기소개
}

const ExecutiveManagement = () => {
  // Mock 회원 데이터
  const [members] = useState<Member[]>([
    { id: 1, name: '정호철', email: 'jung@example.com', phone: '010-5399-4363', occupation: '○○그룹', company: '회장' },
    { id: 2, name: '이응정', email: 'lee@example.com', phone: '010-8876-0605', occupation: '△△건설', company: '대표이사' },
    { id: 3, name: '신영인', email: 'shin@example.com', phone: '010-6305-3027', occupation: '□□금융', company: '부사장' },
    { id: 4, name: '최원호', email: 'choi@example.com', phone: '010-6546-3387', occupation: '◇◇제약', company: '전무이사' },
    { id: 5, name: '유희찬', email: 'yoo@example.com', phone: '010-9064-7797', occupation: '☆☆병원', company: '원장' },
    { id: 6, name: '김용훈', email: 'kim@example.com', phone: '010-7510-8500', occupation: '※※법률', company: '대표변호사' },
    { id: 7, name: '이현희', email: 'lee2@example.com', phone: '010-8277-7602', occupation: '◎◎IT', company: '대표' },
    { id: 8, name: '심경택', email: 'sim@example.com', phone: '010-5505-9815', occupation: '▽▽건축', company: '사장' },
    { id: 9, name: '권택준', email: 'kwon@example.com', phone: '010-7411-7859', occupation: '♧♧통신', company: '부장' },
    { id: 10, name: '한재우', email: 'han@example.com', phone: '010-6769-0275', occupation: '♤♤무역', company: '이사' },
  ]);

  const [executives, setExecutives] = useState<Executive[]>([
    // 회장단
    { id: 1, memberId: 1, name: '정호철', position: '회장', phone: '010-5399-4363', category: 'chairman', startTerm: '2024-01', endTerm: '2026-12', bio: '○○그룹 회장으로 재직 중이며, 시애라 창립 멤버입니다.' },
    { id: 2, memberId: 2, name: '이응정', position: '운영위원장', phone: '010-8876-0605', category: 'chairman', startTerm: '2024-01', endTerm: '2026-12', bio: '△△건설 대표이사로 건설 업계 30년 경력의 베테랑입니다.' },
    { id: 4, memberId: 4, name: '최원호', position: '등산대장', phone: '010-6546-3387', category: 'chairman', startTerm: '2024-01', endTerm: '2026-12', bio: '◇◇제약 전무이사로 바이오 산업을 선도하고 있습니다.' },
    { id: 3, memberId: 3, name: '신영인', position: '운영감사', phone: '010-6305-3027', category: 'chairman', startTerm: '2024-01', endTerm: '2026-12', bio: '□□금융 부사장으로 금융 전문가입니다.' },
    { id: 5, memberId: 5, name: '유희찬', position: '재무감사', phone: '010-9064-7797', category: 'chairman', startTerm: '2024-01', endTerm: '2026-12', bio: '☆☆병원 원장으로 의료계에서 활동하고 있습니다.' },
    // 운영위원
    { id: 6, memberId: 6, name: '김용훈', position: '부위원장', phone: '010-7510-8500', category: 'committee', startTerm: '2024-01', endTerm: '2026-12', bio: '※※법률사무소 대표변호사로 기업법무 전문가입니다.' },
    { id: 7, memberId: 7, name: '이현희', position: '재무', phone: '010-8277-7602', category: 'committee', startTerm: '2024-01', endTerm: '2026-12', bio: '◎◎IT 대표로 IT 산업을 이끌고 있습니다.' },
    { id: 8, memberId: 8, name: '심경택', position: '기획', phone: '010-5505-9815', category: 'committee', startTerm: '2024-01', endTerm: '2026-12', bio: '▽▽건축 사장으로 건축 분야의 리더입니다.' },
    { id: 9, memberId: 9, name: '권택준', position: '홍보/청년', phone: '010-7411-7859', category: 'committee', startTerm: '2024-01', endTerm: '2026-12', bio: '♧♧통신 부장으로 통신 분야 전문가입니다.' },
    { id: 10, memberId: 10, name: '한재우', position: '홍보/청년', phone: '010-6769-0275', category: 'committee', startTerm: '2024-01', endTerm: '2026-12', bio: '♤♤무역 이사로 글로벌 비즈니스를 담당하고 있습니다.' },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Executive | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newExecutive, setNewExecutive] = useState<Omit<Executive, 'id'>>({
    memberId: undefined,
    name: '',
    position: '',
    phone: '',
    email: '',
    category: 'chairman',
    startTerm: '',
    endTerm: '',
    bio: '',
  });

  // 비밀번호 확인 모달
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordAction, setPasswordAction] = useState<(() => void) | null>(null);

  // 회원 검색
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [editSearchQuery, setEditSearchQuery] = useState('');
  const [showEditSearchResults, setShowEditSearchResults] = useState(false);

  const chairmanBoard = executives.filter(e => e.category === 'chairman');
  const committee = executives.filter(e => e.category === 'committee');

  // 임기 활성화 여부 확인
  const isTermActive = (startTerm?: string, endTerm?: string) => {
    if (!startTerm || !endTerm) return false;
    const today = new Date();
    const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    return currentYearMonth >= startTerm && currentYearMonth <= endTerm;
  };

  // 비밀번호 확인 요청
  const requestPasswordVerification = (action: () => void) => {
    setPasswordAction(() => action);
    setPasswordInput('');
    setIsPasswordModalOpen(true);
  };

  // 비밀번호 확인 처리
  const handlePasswordConfirm = () => {
    // TODO: 실제 비밀번호 검증 로직으로 대체 필요
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

  // 수정 시작
  const handleEdit = (executive: Executive) => {
    setEditingId(executive.id);
    setEditForm({ ...executive });
    setEditSearchQuery(''); // 검색창 초기화
    setShowEditSearchResults(false);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setEditSearchQuery(''); // 검색창 초기화
    setShowEditSearchResults(false);
  };

  // 수정 저장
  const handleSaveEdit = () => {
    if (editForm) {
      if (!editForm.startTerm || !editForm.endTerm) {
        alert('임기를 모두 입력해주세요.');
        return;
      }
      
      requestPasswordVerification(() => {
        setExecutives(prev =>
          prev.map(exec => (exec.id === editForm.id ? editForm : exec))
        );
        setEditingId(null);
        setEditForm(null);
        setEditSearchQuery(''); // 검색창 초기화
        setShowEditSearchResults(false);
        alert('운영진 정보가 수정되었습니다.');
      });
    }
  };

  // 새 운영진 추가
  const handleAddNew = () => {
    if (!newExecutive.position || !newExecutive.startTerm || !newExecutive.endTerm) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!newExecutive.memberId) {
      alert('회원을 선택해주세요.');
      return;
    }

    requestPasswordVerification(() => {
      const member = members.find(m => m.id === newExecutive.memberId);
      if (!member) return;

      const newId = Math.max(...executives.map(e => e.id), 0) + 1;
      setExecutives(prev => [...prev, { 
        ...newExecutive, 
        id: newId,
        name: member.name,
        phone: member.phone,
        email: member.email,
      }]);
      setNewExecutive({
        memberId: undefined,
        name: '',
        position: '',
        phone: '',
        email: '',
        category: 'chairman',
        startTerm: '',
        endTerm: '',
      });
      setSearchQuery(''); // 검색창 초기화
      setShowSearchResults(false);
      setIsAdding(false);
      alert('운영진이 추가되었습니다.');
    });
  };

  // 삭제
  const handleDelete = (id: number) => {
    requestPasswordVerification(() => {
      if (confirm('정말 삭제하시겠습니까?')) {
        setExecutives(prev => prev.filter(exec => exec.id !== id));
        alert('운영진이 삭제되었습니다.');
      }
    });
  };

  // 회원 검색 필터링
  const getFilteredMembers = (query: string) => {
    if (!query.trim()) return [];
    return members.filter(member =>
      member.name.toLowerCase().includes(query.toLowerCase()) ||
      member.occupation.toLowerCase().includes(query.toLowerCase()) ||
      member.company.toLowerCase().includes(query.toLowerCase())
    );
  };

  // 회원 선택 시 정보 자동 입력 (새 운영진 추가)
  const handleMemberSelectNew = (member: Member) => {
    setNewExecutive({
      ...newExecutive,
      memberId: member.id,
      name: member.name,
      phone: member.phone,
      email: member.email,
    });
    setSearchQuery(member.name);
    setShowSearchResults(false);
  };

  // 회원 선택 시 정보 자동 입력 (기존 운영진 수정)
  const handleMemberSelectEdit = (member: Member) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        memberId: member.id,
        name: member.name,
        phone: member.phone,
        email: member.email,
      });
      setEditSearchQuery(member.name);
      setShowEditSearchResults(false);
    }
  };

  // 검색창 초기화
  const resetSearch = (isNew: boolean) => {
    if (isNew) {
      setSearchQuery('');
      setShowSearchResults(false);
      setNewExecutive({
        ...newExecutive,
        memberId: undefined,
        name: '',
        phone: '',
        email: '',
      });
    } else {
      setEditSearchQuery('');
      setShowEditSearchResults(false);
    }
  };

  // 운영진 카드 렌더링
  const renderExecutiveCard = (executive: Executive) => {
    const isEditing = editingId === executive.id;
    const data = isEditing ? editForm! : executive;

    return (
      <div
        key={executive.id}
        className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
      >
        {isEditing ? (
          // 수정 모드
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                회원 검색 *
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={editSearchQuery || data.name}
                    onChange={(e) => {
                      setEditSearchQuery(e.target.value);
                      setShowEditSearchResults(true);
                    }}
                    onFocus={() => setShowEditSearchResults(true)}
                    className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="회원 이름, 직급, 회사 검색..."
                  />
                  {editSearchQuery && (
                    <button
                      onClick={() => resetSearch(false)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* 검색 결과 드롭다운 */}
                {showEditSearchResults && editSearchQuery && getFilteredMembers(editSearchQuery).length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {getFilteredMembers(editSearchQuery).map((member) => (
                      <button
                        key={member.id}
                        onClick={() => handleMemberSelectEdit(member)}
                        className="w-full px-3 py-2 text-left hover:bg-primary-50 transition-colors border-b border-slate-100 last:border-b-0"
                      >
                        <p className="text-sm font-medium text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-600">
                          {member.occupation} {member.company}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                회원 DB에서 검색하여 선택하세요.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                직책 *
              </label>
              <input
                type="text"
                value={data.position}
                onChange={(e) => setEditForm({ ...data, position: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="직책"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  임기 시작 *
                </label>
                <input
                  type="month"
                  value={data.startTerm || ''}
                  onChange={(e) => setEditForm({ ...data, startTerm: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  임기 종료 *
                </label>
                <input
                  type="month"
                  value={data.endTerm || ''}
                  onChange={(e) => setEditForm({ ...data, endTerm: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                저장
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-400 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                취소
              </button>
            </div>
          </div>
        ) : (
          // 보기 모드
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-bold text-slate-900">{data.name}</h4>
                  <Badge variant={data.category === 'chairman' ? 'success' : 'info'}>
                    {data.position}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(executive)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(executive.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {data.bio && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-sm text-slate-600 leading-relaxed">{data.bio}</p>
              </div>
            )}
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{data.phone}</span>
              </div>
              {data.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{data.email}</span>
                </div>
              )}
              {data.startTerm && data.endTerm && (
                <div className="flex items-center gap-2 pt-2 mt-2 border-t border-slate-200">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-xs">
                    {data.startTerm} ~ {data.endTerm}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">운영진 관리</h1>
        <p className="text-xl text-slate-600">
          시에라클럽의 운영진 정보를 관리합니다.
        </p>
      </div>

      {/* 중요 안내 */}
      <div className="mb-8 p-5 bg-warning-50 border-2 border-warning-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-warning-700 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-warning-900 mb-2 text-lg">중요 안내</h3>
            <p className="text-warning-800 leading-relaxed">
              운영진 정보의 추가, 수정, 삭제는 <strong>회장의 승인이 필요</strong>합니다. 
              변경 사항 저장 시 관리자 비밀번호 확인을 통해 본인 인증이 진행됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 운영진 섹션 */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">운영진</h2>
              <p className="text-sm text-slate-600">{executives.length}명</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {executives.map(exec => renderExecutiveCard(exec))}
        </div>
      </Card>

      {/* 새 운영진 추가 모달 */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              새 운영진 추가
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  회원 검색 <Badge variant="danger">필수</Badge>
                </label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchResults(true);
                      }}
                      onFocus={() => setShowSearchResults(true)}
                      className="w-full pl-11 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="회원 이름, 직급, 회사 검색..."
                    />
                    {searchQuery && (
                      <button
                        onClick={() => resetSearch(true)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  {/* 검색 결과 드롭다운 */}
                  {showSearchResults && searchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {getFilteredMembers(searchQuery).length > 0 ? (
                        getFilteredMembers(searchQuery).map((member) => (
                          <button
                            key={member.id}
                            onClick={() => handleMemberSelectNew(member)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0"
                          >
                            <p className="font-medium text-slate-900">{member.name}</p>
                            <p className="text-sm text-slate-600">
                              {member.occupation} {member.company}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{member.phone}</p>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-slate-500">
                          검색 결과가 없습니다.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  회원 DB에서 검색하여 선택하세요. 선택 시 정보가 자동으로 입력됩니다.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  직책 <Badge variant="danger">필수</Badge>
                </label>
                <input
                  type="text"
                  value={newExecutive.position}
                  onChange={(e) =>
                    setNewExecutive({ ...newExecutive, position: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 회장, 부위원장, 재무"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    임기 시작 <Badge variant="danger">필수</Badge>
                  </label>
                  <input
                    type="month"
                    value={newExecutive.startTerm}
                    onChange={(e) =>
                      setNewExecutive({ ...newExecutive, startTerm: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    임기 종료 <Badge variant="danger">필수</Badge>
                  </label>
                  <input
                    type="month"
                    value={newExecutive.endTerm}
                    onChange={(e) =>
                      setNewExecutive({ ...newExecutive, endTerm: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {newExecutive.memberId && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">선택된 회원 정보</p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>이름: {newExecutive.name}</p>
                    <p>연락처: {newExecutive.phone}</p>
                    {newExecutive.email && <p>이메일: {newExecutive.email}</p>}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddNew}
                disabled={!newExecutive.memberId || !newExecutive.position || !newExecutive.startTerm || !newExecutive.endTerm}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                추가
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewExecutive({
                    memberId: undefined,
                    name: '',
                    position: '',
                    phone: '',
                    email: '',
                    category: 'chairman',
                    startTerm: '',
                    endTerm: '',
                    bio: '',
                  });
                  setSearchQuery(''); // 검색창 초기화
                  setShowSearchResults(false);
                }}
                className="flex-1 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-400 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                취소
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* 비밀번호 확인 모달 */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                관리자 비밀번호 확인
              </h3>
            </div>
            
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  운영진 정보를 변경하려면 관리자 비밀번호가 필요합니다.
                </p>
              </div>
              
              <label className="block text-sm font-medium text-slate-700 mb-2">
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex-1 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-400 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handlePasswordConfirm}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                확인
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExecutiveManagement;

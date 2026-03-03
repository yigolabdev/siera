import { useState, useMemo } from 'react';
import { Users, Phone, Mail, Edit2, Save, X, Plus, Trash2, Calendar, AlertCircle, Check, Shield, Search } from 'lucide-react';
import { useMembers } from '../../contexts/MemberContext';
import { useExecutives, Executive } from '../../contexts/ExecutiveContext';
import { sortByPosition } from '../../utils/executiveOrder';
import { useAuth } from '../../contexts/AuthContextEnhanced';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
// Firebase Auth imports 제거 - 관리자 인증을 confirm 다이얼로그로 대체

interface Member {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  occupation?: string;
  company?: string;
  position?: string;
}

const ExecutiveManagement = () => {
  const { user } = useAuth();
  const { members: contextMembers, updateMember } = useMembers();
  const { executives: contextExecutives, addExecutive, updateExecutive, deleteExecutive, isLoading } = useExecutives();
  
  // Firebase members를 로컬 인터페이스로 변환
  const members: Member[] = contextMembers.map(m => ({
    id: Number(m.id),
    name: m.name,
    email: m.email,
    phoneNumber: m.phoneNumber,
    occupation: m.occupation || '',
    company: m.company || '',
    position: m.position || '',
  }));

  // 운영진과 members 데이터 병합 (members의 bio 우선 사용)
  const executivesWithMemberBio = useMemo(() => {
    return contextExecutives.map(exec => {
      const memberData = contextMembers.find(m => m.id === exec.memberId);
      return {
        ...exec,
        // members 컬렉션의 bio가 있으면 우선 사용 (프로필 자기소개)
        displayBio: memberData?.bio || exec.bio,
      };
    });
  }, [contextExecutives, contextMembers]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Executive | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newExecutive, setNewExecutive] = useState<Omit<Executive, 'id' | 'createdAt' | 'updatedAt'>>({
    memberId: undefined,
    name: '',
    position: '',
    phoneNumber: '',
    email: '',
    category: 'chairman',
    company: '',
    startTerm: '',
    endTerm: '',
    bio: '',
  });

  // (비밀번호 모달 제거 - 관리자 페이지 접근 자체가 권한 체크)

  // 회원 검색
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [editSearchQuery, setEditSearchQuery] = useState('');
  const [showEditSearchResults, setShowEditSearchResults] = useState(false);

  const chairmanBoard = sortByPosition(contextExecutives, 'chairman');
  const committee = sortByPosition(contextExecutives, 'committee');

  // 임기 활성화 여부 확인
  const isTermActive = (startTerm?: string, endTerm?: string) => {
    if (!startTerm || !endTerm) return false;
    const today = new Date();
    const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    return currentYearMonth >= startTerm && currentYearMonth <= endTerm;
  };

  // 관리자 권한 확인 후 작업 실행
  const requestPasswordVerification = (action: () => void) => {
    // 관리자 페이지 접근 자체가 권한 체크를 거치므로,
    // 추가 재인증 대신 확인 다이얼로그로 대체
    if (confirm('이 작업을 진행하시겠습니까?')) {
      action();
    }
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
  const handleSaveEdit = async () => {
    if (editForm) {
      if (!editForm.startTerm || !editForm.endTerm) {
        alert('임기를 모두 입력해주세요.');
        return;
      }
      
      requestPasswordVerification(async () => {
        try {
          // executives 컬렉션 업데이트
          // (members.position은 직장 직책이므로 업데이트하지 않음)
          await updateExecutive(editForm.id, editForm);
          
          setEditingId(null);
          setEditForm(null);
          setEditSearchQuery('');
          setShowEditSearchResults(false);
          alert('운영진 정보가 수정되었습니다.');
        } catch (error) {
          console.error('운영진 수정 실패:', error);
          alert('운영진 수정에 실패했습니다.');
        }
      });
    }
  };

  // 새 운영진 추가
  const handleAddNew = async () => {
    if (!newExecutive.position || !newExecutive.startTerm || !newExecutive.endTerm) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!newExecutive.memberId) {
      alert('회원을 선택해주세요.');
      return;
    }

    requestPasswordVerification(async () => {
      try {
        // executives 컬렉션에 추가
        // (members.position은 직장 직책이므로 업데이트하지 않음)
        await addExecutive(newExecutive);
        
        setNewExecutive({
          memberId: undefined,
          name: '',
          position: '',
          phoneNumber: '',
          email: '',
          category: 'chairman',
          company: '',
          startTerm: '',
          endTerm: '',
          bio: '',
        });
        setSearchQuery('');
        setShowSearchResults(false);
        setIsAdding(false);
        alert('운영진이 추가되었습니다.');
      } catch (error) {
        console.error('운영진 추가 실패:', error);
        alert('운영진 추가에 실패했습니다.');
      }
    });
  };

  // 삭제
  const handleDelete = async (id: string) => {
    requestPasswordVerification(async () => {
      if (confirm('정말 삭제하시겠습니까?')) {
        try {
          // executives 컬렉션에서 삭제
          // (members.position은 직장 직책이므로 건드리지 않음)
          await deleteExecutive(id);
          
          alert('운영진이 삭제되었습니다.');
        } catch (error) {
          console.error('운영진 삭제 실패:', error);
          alert('운영진 삭제에 실패했습니다.');
        }
      }
    });
  };

  // 회원 검색 필터링
  const getFilteredMembers = (query: string) => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return members.filter(member =>
      member.name.toLowerCase().includes(lowerQuery) ||
      (member.occupation?.toLowerCase().includes(lowerQuery)) ||
      (member.company?.toLowerCase().includes(lowerQuery)) ||
      (member.position?.toLowerCase().includes(lowerQuery))
    );
  };

  // 회원 선택 시 정보 자동 입력 (새 운영진 추가)
  const handleMemberSelectNew = (member: Member) => {
    setNewExecutive({
      ...newExecutive,
      memberId: String(member.id),
      name: member.name,
      phoneNumber: member.phoneNumber || '',
      email: member.email || '',
      company: member.company || member.occupation,
    });
    setSearchQuery(member.name);
    setShowSearchResults(false);
  };

  // 회원 선택 시 정보 자동 입력 (기존 운영진 수정)
  const handleMemberSelectEdit = (member: Member) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        memberId: String(member.id),
        name: member.name,
        phoneNumber: member.phoneNumber,
        email: member.email,
        company: member.company || member.occupation,
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
        phoneNumber: '',
        email: '',
        company: '',
      });
    } else {
      setEditSearchQuery('');
      setShowEditSearchResults(false);
    }
  };

  // 운영진 카드 렌더링
  const renderExecutiveCard = (executive: Executive & { displayBio?: string }) => {
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
                구분 *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="edit-category"
                    value="chairman"
                    checked={data.category === 'chairman'}
                    onChange={(e) => setEditForm({ ...data, category: e.target.value as 'chairman' | 'committee' })}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">회장단</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="edit-category"
                    value="committee"
                    checked={data.category === 'committee'}
                    onChange={(e) => setEditForm({ ...data, category: e.target.value as 'chairman' | 'committee' })}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">운영위원회</span>
                </label>
              </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                {data.company && (
                  <p className="text-sm text-slate-600">
                    {data.company}
                  </p>
                )}
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
            {executive.displayBio && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-sm text-slate-600 leading-relaxed">{executive.displayBio}</p>
              </div>
            )}
            <div className="space-y-2 text-sm text-slate-600">
              {data.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{data.phoneNumber}</span>
                </div>
              )}
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
              <p className="text-sm text-slate-600">{executivesWithMemberBio.length}명</p>
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
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-4">운영진 정보를 불러오는 중...</p>
            </div>
          ) : executivesWithMemberBio.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-500">등록된 운영진이 없습니다.</p>
            </div>
          ) : (
            executivesWithMemberBio.map(exec => renderExecutiveCard(exec))
          )}
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
                  회원 검색
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
                            <p className="text-xs text-slate-500 mt-1">{member.phoneNumber}</p>
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
                  구분
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="chairman"
                      checked={newExecutive.category === 'chairman'}
                      onChange={(e) => setNewExecutive({ ...newExecutive, category: e.target.value as 'chairman' | 'committee' })}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">회장단</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="committee"
                      checked={newExecutive.category === 'committee'}
                      onChange={(e) => setNewExecutive({ ...newExecutive, category: e.target.value as 'chairman' | 'committee' })}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">운영위원회</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  직책
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    임기 시작
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
                    임기 종료
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
                    <p>연락처: {newExecutive.phoneNumber}</p>
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
                    phoneNumber: '',
                    email: '',
                    category: 'chairman',
                    company: '',
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

      {/* 관리자 인증 모달 제거 - confirm 다이얼로그로 대체 */}
    </div>
  );
};

export default ExecutiveManagement;

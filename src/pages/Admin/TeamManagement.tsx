import { useState } from 'react';
import { Plus, Edit, Trash2, Users, UserPlus, Save, X, CheckCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  occupation: string;
  company: string;
}

interface Team {
  id: string;
  name: string;
  leaderId: string;
  leaderName: string;
  leaderOccupation: string;
  members: TeamMember[];
}

const TeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: '1조',
      leaderId: '1',
      leaderName: '김산행',
      leaderOccupation: '○○그룹 회장',
      members: [
        { id: '6', name: '홍정상', occupation: '※※법률사무소', company: '대표변호사' },
        { id: '7', name: '강백운', occupation: '◎◎IT', company: '대표' },
        { id: '8', name: '윤설악', occupation: '▽▽건축', company: '사장' },
      ],
    },
    {
      id: '2',
      name: '2조',
      leaderId: '2',
      leaderName: '이등산',
      leaderOccupation: '△△건설 대표이사',
      members: [
        { id: '9', name: '임지리', occupation: '★★무역', company: '부사장' },
        { id: '10', name: '조한라', occupation: '◆◆투자', company: '이사' },
        { id: '11', name: '문북한', occupation: '◈◈컨설팅', company: '전무' },
      ],
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showMemberSelectModal, setShowMemberSelectModal] = useState(false);
  const [formData, setFormData] = useState<Team>({
    id: '',
    name: '',
    leaderId: '',
    leaderName: '',
    leaderOccupation: '',
    members: [],
  });

  // 참석 등록된 회원 목록 (실제로는 API에서 가져와야 함)
  const registeredMembers: TeamMember[] = [
    { id: '1', name: '김산행', occupation: '○○그룹', company: '회장' },
    { id: '2', name: '이등산', occupation: '△△건설', company: '대표이사' },
    { id: '3', name: '박트레킹', occupation: '□□금융', company: '부사장' },
    { id: '4', name: '최하이킹', occupation: '◇◇제약', company: '전무이사' },
    { id: '5', name: '정봉우리', occupation: '☆☆병원', company: '원장' },
    { id: '6', name: '홍정상', occupation: '※※법률사무소', company: '대표변호사' },
    { id: '7', name: '강백운', occupation: '◎◎IT', company: '대표' },
    { id: '8', name: '윤설악', occupation: '▽▽건축', company: '사장' },
    { id: '9', name: '임지리', occupation: '★★무역', company: '부사장' },
    { id: '10', name: '조한라', occupation: '◆◆투자', company: '이사' },
    { id: '11', name: '문북한', occupation: '◈◈컨설팅', company: '전무' },
    { id: '12', name: '신계룡', occupation: '▲▲물류', company: '대표' },
    { id: '13', name: '장태백', occupation: '▼▼제조', company: '사장' },
    { id: '14', name: '권덕유', occupation: '◐◐통신', company: '이사' },
    { id: '15', name: '서오대', occupation: '◑◑교육', company: '교수' },
    { id: '16', name: '오속리', occupation: '◒◒인프라', company: '대표' },
    { id: '17', name: '배치악', occupation: '◓◓미디어', company: '본부장' },
    { id: '18', name: '류월출', occupation: '◔◔바이오', company: '연구소장' },
    { id: '19', name: '전청계', occupation: '◕◕에너지', company: '전무' },
    { id: '20', name: '황무등', occupation: '◖◖자산운용', company: '대표' },
  ];

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData(team);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('이 조를 삭제하시겠습니까?')) {
      setTeams(teams.filter(t => t.id !== id));
    }
  };

  const handleSave = () => {
    if (editingTeam) {
      setTeams(teams.map(t => t.id === editingTeam.id ? formData : t));
    } else {
      setTeams([...teams, { ...formData, id: Date.now().toString() }]);
    }
    setIsEditing(false);
    setEditingTeam(null);
    resetForm();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingTeam(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      leaderId: '',
      leaderName: '',
      leaderOccupation: '',
      members: [],
    });
  };

  const addMember = () => {
    setShowMemberSelectModal(true);
  };

  const selectMember = (member: TeamMember) => {
    // 이미 선택된 회원인지 확인
    const isAlreadySelected = formData.members.some(m => m.id === member.id);
    const isLeader = formData.leaderId === member.id;
    
    if (isAlreadySelected || isLeader) {
      alert('이미 선택된 회원입니다.');
      return;
    }
    
    setFormData({
      ...formData,
      members: [...formData.members, member],
    });
    setShowMemberSelectModal(false);
  };

  const removeMember = (memberId: string) => {
    setFormData({
      ...formData,
      members: formData.members.filter(m => m.id !== memberId),
    });
  };

  // 이미 선택된 회원인지 확인하는 함수
  const isMemberSelected = (memberId: string) => {
    return formData.leaderId === memberId || formData.members.some(m => m.id === memberId);
  };

  const selectLeader = (member: TeamMember) => {
    setFormData({
      ...formData,
      leaderId: member.id,
      leaderName: member.name,
      leaderOccupation: `${member.occupation} ${member.company}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">조 편성 관리</h1>
          <p className="text-xl text-slate-600">
            산행 참석자를 조별로 편성하고 관리할 수 있습니다.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>새 조 등록</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="card">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {editingTeam ? '조 수정' : '새 조 등록'}
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                조 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="1조"
              />
            </div>

            {/* Leader Selection */}
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                조장 선택 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-4 bg-slate-50 rounded-lg">
                {registeredMembers.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => selectLeader(member)}
                    className={`p-3 text-left rounded-lg border-2 transition-all ${
                      formData.leaderId === member.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-slate-200 hover:border-primary-300'
                    }`}
                  >
                    <p className="font-bold text-slate-900">{member.name}</p>
                    <p className="text-sm text-slate-600">{member.occupation}</p>
                    <p className="text-sm text-slate-500">{member.company}</p>
                  </button>
                ))}
              </div>
              {formData.leaderName && (
                <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                  <p className="text-sm text-slate-600">선택된 조장:</p>
                  <p className="font-bold text-slate-900">{formData.leaderName}</p>
                  <p className="text-sm text-slate-600">{formData.leaderOccupation}</p>
                </div>
              )}
            </div>

            {/* Members */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-slate-700 font-medium">
                  조원 ({formData.members.length}명)
                </label>
                <button
                  type="button"
                  onClick={addMember}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>조원 추가</span>
                </button>
              </div>
              <div className="space-y-3">
                {formData.members.map((member) => (
                  <div key={member.id} className="p-4 bg-green-50 rounded-lg border-2 border-green-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-bold text-slate-900">{member.name}</p>
                        <p className="text-sm text-slate-600">{member.occupation}</p>
                        <p className="text-sm text-slate-500">{member.company}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                {formData.members.length === 0 && (
                  <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-slate-500">조원을 추가해주세요</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium text-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
              >
                <X className="h-5 w-5" />
                <span>취소</span>
              </button>
              <button
                onClick={handleSave}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>저장</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {teams.map((team) => (
            <div key={team.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {team.name}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{team.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
                        조장
                      </span>
                      <span className="font-bold text-slate-900">{team.leaderName}</span>
                      <span className="text-slate-600 text-sm">{team.leaderOccupation}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(team)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-slate-600 font-medium mb-3">
                  조원 ({team.members.length}명)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <p className="font-bold text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-600">{member.occupation}</p>
                      <p className="text-sm text-slate-500">{member.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {teams.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-slate-500">등록된 조가 없습니다.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Member Selection Modal */}
      {showMemberSelectModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowMemberSelectModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b bg-gradient-to-r from-primary-50 to-green-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserPlus className="h-8 w-8 text-primary-600" />
                  <h3 className="text-2xl font-bold text-slate-900">조원 선택</h3>
                </div>
                <button 
                  onClick={() => setShowMemberSelectModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-slate-600" />
                </button>
              </div>
              <p className="text-slate-600 mt-2">참석 등록된 회원 목록에서 조원을 선택해주세요</p>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {registeredMembers.map((member) => {
                  const isSelected = isMemberSelected(member.id);
                  const isLeader = formData.leaderId === member.id;
                  
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => !isSelected && selectMember(member)}
                      disabled={isSelected}
                      className={`p-4 text-left rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-slate-300 bg-slate-100 opacity-50 cursor-not-allowed'
                          : 'border-slate-200 hover:border-primary-400 hover:bg-primary-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-bold text-slate-900">{member.name}</p>
                        {isLeader && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                            조장
                          </span>
                        )}
                        {isSelected && !isLeader && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{member.occupation}</p>
                      <p className="text-sm text-slate-500">{member.company}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t bg-slate-50">
              <button 
                onClick={() => setShowMemberSelectModal(false)}
                className="w-full px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold text-lg hover:bg-gray-300 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;


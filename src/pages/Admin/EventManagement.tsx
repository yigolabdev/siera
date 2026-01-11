import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Save, X, CreditCard, Phone, UserPlus, CheckCircle, Shield, AlertCircle, Lock, Mountain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

interface PaymentInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  managerName: string;
  managerPhone: string;
  cost: string; // 참가비
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  mountain?: string;
  altitude?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  maxParticipants: number;
  cost: string;
  schedule: ScheduleItem[];
  courses?: Course[];
  paymentInfo?: PaymentInfo;
  isPublished: boolean; // 공개 여부
}

interface ScheduleItem {
  time: string;
  location: string;
  type: 'departure' | 'stop' | 'return' | 'arrival';
}

interface Course {
  id: string;
  name: string;
  description: string;
  distance: string;
  schedule: ScheduleItem[];
}

interface TeamMember {
  id: string;
  name: string;
  occupation: string;
  company: string;
  isGuest?: boolean;  // 게스트 여부
}

interface Team {
  id: string;
  name: string;
  eventId: string;  // 산행 ID
  eventTitle?: string;  // 산행 제목 (표시용)
  leaderId: string;
  leaderName: string;
  leaderOccupation: string;
  members: TeamMember[];
}

type TabType = 'events' | 'teams';

const EventManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('events');

  // Event Management State
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: '북한산 백운대 등반',
      date: '2026-01-15',
      location: '북한산 국립공원',
      difficulty: 'medium',
      description: '백운대 정상을 목표로 하는 정기 산행입니다.',
      maxParticipants: 25,
      cost: '60,000원',
      schedule: [
        { time: '07:15', location: '종합운동장역 2번출구', type: 'departure' },
        { time: '07:35', location: '합정역', type: 'stop' },
        { time: '18:00', location: '합정역', type: 'return' },
        { time: '18:30', location: '종합운동장역', type: 'arrival' },
      ],
      paymentInfo: {
        bankName: '국민은행',
        accountNumber: '123-456-789012',
        accountHolder: '시애라산악회',
        managerName: '김재무',
        managerPhone: '010-1234-5678',
        cost: '60,000원',
      },
      isPublished: true, // 입금 정보 완료 + 공개
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Event>({
    id: '',
    title: '',
    date: '',
    location: '',
    mountain: '',
    altitude: '',
    difficulty: 'medium',
    description: '',
    maxParticipants: 25,
    cost: '60,000원',
    schedule: [
      { time: '', location: '', type: 'departure' },
      { time: '', location: '', type: 'stop' },
      { time: '', location: '', type: 'return' },
      { time: '', location: '', type: 'arrival' },
    ],
    courses: [],
    paymentInfo: {
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      managerName: '',
      managerPhone: '',
      cost: '60,000원',
    },
    isPublished: false, // 초기값은 비공개
  });

  // Team Management State
  const [selectedEventIdForTeam, setSelectedEventIdForTeam] = useState<string>(''); // 조 편성할 산행 선택
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: '1조',
      eventId: '1',
      eventTitle: '북한산 백운대 등반',
      leaderId: '1',
      leaderName: '김산행',
      leaderOccupation: '○○그룹 회장',
      members: [
        { id: '6', name: '홍정상', occupation: '※※법률사무소', company: '대표변호사' },
        { id: '7', name: '강백운', occupation: '◎◎IT', company: '대표' },
        { id: '8', name: '윤설악', occupation: '▽▽건축', company: '사장' },
        { id: 'g1', name: '박게스트', occupation: '◇◇무역', company: '부장', isGuest: true },
      ],
    },
    {
      id: '2',
      name: '2조',
      eventId: '1',
      eventTitle: '북한산 백운대 등반',
      leaderId: '2',
      leaderName: '이등산',
      leaderOccupation: '△△건설 대표이사',
      members: [
        { id: '9', name: '임지리', occupation: '★★무역', company: '부사장' },
        { id: '10', name: '조한라', occupation: '◆◆투자', company: '이사' },
        { id: '11', name: '문북한', occupation: '◈◈컨설팅', company: '전무' },
        { id: 'g2', name: '최방문', occupation: '□□엔터', company: '이사', isGuest: true },
      ],
    },
  ]);

  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showMemberSelectModal, setShowMemberSelectModal] = useState(false);
  const [teamFormData, setTeamFormData] = useState<Team>({
    id: '',
    name: '',
    eventId: '',
    eventTitle: '',
    leaderId: '',
    leaderName: '',
    leaderOccupation: '',
    members: [],
  });

  // Mock registered members for team assignment
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

  // Event Management Handlers
  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData(event);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('이 산행을 삭제하시겠습니까?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const handleSave = () => {
    // 입금 정보 완료 여부 확인
    const hasPaymentInfo = formData.paymentInfo && 
                          formData.paymentInfo.cost &&
                          formData.paymentInfo.bankName && 
                          formData.paymentInfo.accountNumber && 
                          formData.paymentInfo.accountHolder &&
                          formData.paymentInfo.managerName &&
                          formData.paymentInfo.managerPhone;

    const eventToSave = {
      ...formData,
      isPublished: hasPaymentInfo ? true : false, // 입금 정보 완료 시 자동 공개
    };

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? eventToSave : e));
      
      if (hasPaymentInfo && !editingEvent.isPublished) {
        alert('입금 정보가 완료되어 산행이 공개되었습니다!');
      }
    } else {
      setEvents([...events, { ...eventToSave, id: Date.now().toString() }]);
      
      if (hasPaymentInfo) {
        alert('입금 정보가 완료되어 산행이 공개되었습니다!');
      } else {
        alert('산행이 저장되었습니다. 입금 정보를 입력하면 자동으로 공개됩니다.');
      }
    }
    
    setIsEditing(false);
    setEditingEvent(null);
    resetForm();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingEvent(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      date: '',
      location: '',
      mountain: '',
      altitude: '',
      difficulty: 'medium',
      description: '',
      maxParticipants: 25,
      cost: '60,000원',
      schedule: [
        { time: '', location: '', type: 'departure' },
        { time: '', location: '', type: 'stop' },
        { time: '', location: '', type: 'return' },
        { time: '', location: '', type: 'arrival' },
      ],
      courses: [],
      paymentInfo: {
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        managerName: '',
        managerPhone: '',
        cost: '60,000원',
      },
      isPublished: false,
    });
  };

  const handleScheduleChange = (index: number, field: 'time' | 'location', value: string) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData({ ...formData, schedule: newSchedule });
  };

  const addScheduleItem = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { time: '', location: '', type: 'stop' }],
    });
  };

  const removeScheduleItem = (index: number) => {
    if (formData.schedule.length > 1) {
      const newSchedule = formData.schedule.filter((_, i) => i !== index);
      setFormData({ ...formData, schedule: newSchedule });
    }
  };

  const updateScheduleType = (index: number, type: 'departure' | 'stop' | 'return' | 'arrival') => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], type };
    setFormData({ ...formData, schedule: newSchedule });
  };

  // Course Management
  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: '',
      description: '',
      distance: '',
      schedule: [{ time: '', location: '', type: 'departure' }],
    };
    setFormData({
      ...formData,
      courses: [...(formData.courses || []), newCourse],
    });
  };

  const removeCourse = (courseId: string) => {
    setFormData({
      ...formData,
      courses: formData.courses?.filter(c => c.id !== courseId) || [],
    });
  };

  const updateCourse = (courseId: string, field: keyof Course, value: string) => {
    setFormData({
      ...formData,
      courses: formData.courses?.map(c =>
        c.id === courseId ? { ...c, [field]: value } : c
      ) || [],
    });
  };

  const addCourseScheduleItem = (courseId: string) => {
    setFormData({
      ...formData,
      courses: formData.courses?.map(c =>
        c.id === courseId
          ? { ...c, schedule: [...c.schedule, { time: '', location: '', type: 'stop' }] }
          : c
      ) || [],
    });
  };

  const removeCourseScheduleItem = (courseId: string, scheduleIndex: number) => {
    setFormData({
      ...formData,
      courses: formData.courses?.map(c =>
        c.id === courseId
          ? { ...c, schedule: c.schedule.filter((_, i) => i !== scheduleIndex) }
          : c
      ) || [],
    });
  };

  const updateCourseSchedule = (
    courseId: string,
    scheduleIndex: number,
    field: keyof ScheduleItem,
    value: string
  ) => {
    setFormData({
      ...formData,
      courses: formData.courses?.map(c =>
        c.id === courseId
          ? {
              ...c,
              schedule: c.schedule.map((item, i) =>
                i === scheduleIndex ? { ...item, [field]: value } : item
              ),
            }
          : c
      ) || [],
    });
  };

  // Team Management Handlers
  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setTeamFormData(team);
    setIsEditingTeam(true);
  };

  const handleDeleteTeam = (id: string) => {
    if (confirm('이 조를 삭제하시겠습니까?')) {
      setTeams(teams.filter(t => t.id !== id));
    }
  };

  const handleSaveTeam = () => {
    const selectedEvent = events.find(e => e.id === teamFormData.eventId);
    const updatedTeamData = {
      ...teamFormData,
      eventTitle: selectedEvent?.title || '',
    };

    if (editingTeam) {
      setTeams(teams.map(t => t.id === editingTeam.id ? updatedTeamData : t));
    } else {
      setTeams([...teams, { ...updatedTeamData, id: Date.now().toString() }]);
    }
    setIsEditingTeam(false);
    setEditingTeam(null);
    resetTeamForm();
  };

  const handleCancelTeam = () => {
    setIsEditingTeam(false);
    setEditingTeam(null);
    resetTeamForm();
  };

  const resetTeamForm = () => {
    setTeamFormData({
      id: '',
      name: '',
      eventId: selectedEventIdForTeam,
      eventTitle: '',
      leaderId: '',
      leaderName: '',
      leaderOccupation: '',
      members: [],
    });
  };

  const handleStartTeamCreation = () => {
    if (!selectedEventIdForTeam) {
      alert('조 편성할 산행을 먼저 선택해주세요.');
      return;
    }
    const selectedEvent = events.find(e => e.id === selectedEventIdForTeam);
    setTeamFormData({
      id: '',
      name: '',
      eventId: selectedEventIdForTeam,
      eventTitle: selectedEvent?.title || '',
      leaderId: '',
      leaderName: '',
      leaderOccupation: '',
      members: [],
    });
    setIsEditingTeam(true);
  };

  const handleAddMember = (member: TeamMember) => {
    if (!teamFormData.members.find(m => m.id === member.id)) {
      setTeamFormData({ ...teamFormData, members: [...teamFormData.members, member] });
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamFormData({
      ...teamFormData,
      members: teamFormData.members.filter(m => m.id !== memberId),
    });
  };

  const handleSetLeader = (member: TeamMember) => {
    setTeamFormData({
      ...teamFormData,
      leaderId: member.id,
      leaderName: member.name,
      leaderOccupation: `${member.occupation} ${member.company}`,
    });
  };

  const totalMembers = teams.reduce((sum, team) => sum + team.members.length + 1, 0);
  
  // 선택된 산행의 조 편성만 필터링
  const filteredTeams = selectedEventIdForTeam 
    ? teams.filter(team => team.eventId === selectedEventIdForTeam)
    : [];

  // 산행 등록 가능 여부 체크 로직
  const checkCanAddEvent = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 현재 월의 미래 산행 개수 확인
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const futureEventsThisMonth = events.filter(event => {
      const eventDate = new Date(event.date);
      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth();
      
      // 같은 월이고 날짜가 오늘 이후인 산행
      return eventYear === currentYear && 
             eventMonth === currentMonth && 
             eventDate >= today;
    });
    
    // 다음 달의 미래 산행 개수 확인
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    
    const futureEventsNextMonth = events.filter(event => {
      const eventDate = new Date(event.date);
      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth();
      
      return eventYear === nextYear && eventMonth === nextMonth;
    });
    
    // 최대 2개까지만 등록 가능 (현재월 + 다음월 합쳐서)
    const totalFutureEvents = futureEventsThisMonth.length + futureEventsNextMonth.length;
    
    return {
      canAdd: totalFutureEvents < 2,
      currentMonthCount: futureEventsThisMonth.length,
      nextMonthCount: futureEventsNextMonth.length,
      totalCount: totalFutureEvents,
      reason: totalFutureEvents >= 2 
        ? '최대 2개의 예정된 산행만 등록할 수 있습니다.' 
        : futureEventsThisMonth.length >= 1 && futureEventsNextMonth.length >= 1
        ? '이번 달과 다음 달 산행이 이미 등록되어 있습니다.'
        : '',
    };
  };
  
  const eventRegistrationStatus = checkCanAddEvent();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">산행 관리</h1>
          <p className="text-xl text-slate-600">
            산행 일정 및 조 편성을 관리할 수 있습니다.
          </p>
        </div>
        {activeTab === 'events' && !isEditing && (
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => {
                if (eventRegistrationStatus.canAdd) {
                  setIsEditing(true);
                } else {
                  alert(eventRegistrationStatus.reason);
                }
              }}
              disabled={!eventRegistrationStatus.canAdd}
              className={`flex items-center space-x-2 ${
                eventRegistrationStatus.canAdd
                  ? 'btn-primary'
                  : 'px-6 py-3 bg-slate-300 text-slate-500 rounded-xl font-semibold cursor-not-allowed'
              }`}
            >
              {eventRegistrationStatus.canAdd ? (
                <>
                  <Plus className="h-5 w-5" />
                  <span>새 산행 등록</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>등록 불가</span>
                </>
              )}
            </button>
            {!eventRegistrationStatus.canAdd && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span>{eventRegistrationStatus.reason}</span>
              </div>
            )}
          </div>
        )}
        {activeTab === 'teams' && !isEditingTeam && (
          <button
            onClick={handleStartTeamCreation}
            disabled={!selectedEventIdForTeam}
            className={`flex items-center space-x-2 ${
              selectedEventIdForTeam
                ? 'btn-primary'
                : 'px-6 py-3 bg-slate-300 text-slate-500 rounded-xl font-semibold cursor-not-allowed'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span>{selectedEventIdForTeam ? '새 조 추가' : '산행을 먼저 선택하세요'}</span>
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'events'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          산행 관리
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'teams'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          조 편성 관리
        </button>
      </div>

      {/* Events Tab Content */}
      {activeTab === 'events' && (
        <>
          {/* 산행 등록 상태 정보 */}
          {!isEditing && (
            <Card className={`mb-8 ${
              eventRegistrationStatus.canAdd 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  eventRegistrationStatus.canAdd 
                    ? 'bg-blue-600' 
                    : 'bg-amber-600'
                }`}>
                  {eventRegistrationStatus.canAdd ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-2 ${
                    eventRegistrationStatus.canAdd 
                      ? 'text-blue-900' 
                      : 'text-amber-900'
                  }`}>
                    {eventRegistrationStatus.canAdd 
                      ? '새로운 산행을 등록할 수 있습니다' 
                      : '산행 등록이 제한되었습니다'}
                  </h3>
                  <div className={`space-y-1 text-sm ${
                    eventRegistrationStatus.canAdd 
                      ? 'text-blue-800' 
                      : 'text-amber-800'
                  }`}>
                    <p>
                      • 현재 예정된 산행: <strong>{eventRegistrationStatus.totalCount}개</strong> / 최대 2개
                    </p>
                    {eventRegistrationStatus.currentMonthCount > 0 && (
                      <p>• 이번 달 예정 산행: {eventRegistrationStatus.currentMonthCount}개</p>
                    )}
                    {eventRegistrationStatus.nextMonthCount > 0 && (
                      <p>• 다음 달 예정 산행: {eventRegistrationStatus.nextMonthCount}개</p>
                    )}
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="font-semibold text-blue-900 mb-2">
                        📋 산행 등록 정책
                      </p>
                      <p className="leading-relaxed">
                        • <strong>정기 산행</strong>: 매월 1회 필수 진행<br />
                        • <strong>특별 산행</strong>: 1박 산행 또는 해외 산행을 위한 추가 등록 가능<br />
                        • <strong>최대 등록</strong>: 동시에 최대 2개까지 등록 가능 (정기 + 특별)
                      </p>
                    </div>
                    {!eventRegistrationStatus.canAdd && (
                      <p className="font-semibold mt-3 pt-3 border-t border-amber-200">
                        💡 기존 산행이 종료되면 새로운 산행을 등록할 수 있습니다.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {isEditing ? (
            <div className="card">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingEvent ? '산행 수정' : '새 산행 등록'}
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      산행 제목 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field"
                      placeholder="북한산 백운대 등반"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      날짜 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      장소 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="input-field"
                      placeholder="북한산 국립공원"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      산 이름
                    </label>
                    <input
                      type="text"
                      value={formData.mountain || ''}
                      onChange={(e) => setFormData({ ...formData, mountain: e.target.value })}
                      className="input-field"
                      placeholder="백운대"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      고도
                    </label>
                    <input
                      type="text"
                      value={formData.altitude || ''}
                      onChange={(e) => setFormData({ ...formData, altitude: e.target.value })}
                      className="input-field"
                      placeholder="737.2m"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      난이도 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                      className="input-field"
                    >
                      <option value="easy">초급</option>
                      <option value="medium">중급</option>
                      <option value="hard">상급</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      최대 인원 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      비용 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      className="input-field"
                      placeholder="60,000원"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    설명 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="산행에 대한 설명을 입력하세요"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-slate-700 font-medium">
                      당일 동선 <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={addScheduleItem}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>항목 추가</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.schedule.map((item, index) => (
                      <div key={index} className="relative p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                          <div className="md:col-span-3">
                            <label className="block text-sm text-slate-600 mb-1">유형</label>
                            <select
                              value={item.type}
                              onChange={(e) => updateScheduleType(index, e.target.value as any)}
                              className="input-field"
                            >
                              <option value="departure">출발</option>
                              <option value="stop">정차</option>
                              <option value="return">복귀</option>
                              <option value="arrival">도착</option>
                            </select>
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-sm text-slate-600 mb-1">시간</label>
                            <input
                              type="time"
                              value={item.time}
                              onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                              className="input-field"
                            />
                          </div>
                          <div className="md:col-span-5">
                            <label className="block text-sm text-slate-600 mb-1">장소</label>
                            <input
                              type="text"
                              value={item.location}
                              onChange={(e) => handleScheduleChange(index, 'location', e.target.value)}
                              className="input-field"
                              placeholder="종합운동장역 2번출구"
                            />
                          </div>
                          <div className="md:col-span-1 flex items-end">
                            <button
                              type="button"
                              onClick={() => removeScheduleItem(index)}
                              className="w-full px-3 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              disabled={formData.schedule.length === 1}
                            >
                              <Trash2 className="h-5 w-5 mx-auto" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    * 최소 1개 이상의 동선 항목이 필요합니다
                  </p>
                </div>

                {/* Courses Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-slate-700 font-medium">
                      산행 코스 (선택사항)
                    </label>
                    <button
                      type="button"
                      onClick={addCourse}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>코스 추가</span>
                    </button>
                  </div>
                  
                  {formData.courses && formData.courses.length > 0 && (
                    <div className="space-y-6">
                      {formData.courses.map((course, courseIdx) => (
                        <div key={course.id} className="p-5 bg-green-50 rounded-xl border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-slate-900">
                              코스 {courseIdx + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeCourse(course.id)}
                              className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1 text-sm font-medium"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>코스 삭제</span>
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block text-sm text-slate-700 font-medium mb-1">
                                코스명
                              </label>
                              <input
                                type="text"
                                value={course.name}
                                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                                className="input-field"
                                placeholder="A조"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm text-slate-700 font-medium mb-1">
                                거리
                              </label>
                              <input
                                type="text"
                                value={course.distance}
                                onChange={(e) => updateCourse(course.id, 'distance', e.target.value)}
                                className="input-field"
                                placeholder="약 8.5킬로"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm text-slate-700 font-medium mb-1">
                              코스 설명
                            </label>
                            <textarea
                              value={course.description}
                              onChange={(e) => updateCourse(course.id, 'description', e.target.value)}
                              className="input-field"
                              rows={2}
                              placeholder="한국APT - 약수터 - 성당칼림길..."
                            />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="block text-sm text-slate-700 font-medium">
                                코스 일정
                              </label>
                              <button
                                type="button"
                                onClick={() => addCourseScheduleItem(course.id)}
                                className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center space-x-1"
                              >
                                <Plus className="h-3 w-3" />
                                <span>일정 추가</span>
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              {course.schedule.map((scheduleItem, scheduleIdx) => (
                                <div key={scheduleIdx} className="grid grid-cols-12 gap-2 items-end">
                                  <div className="col-span-3">
                                    <input
                                      type="text"
                                      value={scheduleItem.time}
                                      onChange={(e) =>
                                        updateCourseSchedule(course.id, scheduleIdx, 'time', e.target.value)
                                      }
                                      className="input-field text-sm"
                                      placeholder="08:30"
                                    />
                                  </div>
                                  <div className="col-span-8">
                                    <input
                                      type="text"
                                      value={scheduleItem.location}
                                      onChange={(e) =>
                                        updateCourseSchedule(course.id, scheduleIdx, 'location', e.target.value)
                                      }
                                      className="input-field text-sm"
                                      placeholder="한국APT 출발"
                                    />
                                  </div>
                                  <div className="col-span-1">
                                    <button
                                      type="button"
                                      onClick={() => removeCourseScheduleItem(course.id, scheduleIdx)}
                                      className="w-full px-2 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                      disabled={course.schedule.length === 1}
                                    >
                                      <Trash2 className="h-4 w-4 mx-auto" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(!formData.courses || formData.courses.length === 0) && (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                      <p className="text-slate-500">코스가 없습니다. 코스를 추가해주세요.</p>
                    </div>
                  )}
                </div>

                {/* 입금 정보 */}
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard className="h-6 w-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-slate-900">입금 정보</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        참가비 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.paymentInfo?.cost || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentInfo: { ...formData.paymentInfo!, cost: e.target.value },
                          })
                        }
                        className="input-field"
                        placeholder="60,000원"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        은행명 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.paymentInfo?.bankName || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentInfo: { ...formData.paymentInfo!, bankName: e.target.value },
                          })
                        }
                        className="input-field"
                        placeholder="국민은행"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        계좌번호 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.paymentInfo?.accountNumber || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentInfo: { ...formData.paymentInfo!, accountNumber: e.target.value },
                          })
                        }
                        className="input-field"
                        placeholder="123-456-789012"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        예금주 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.paymentInfo?.accountHolder || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentInfo: { ...formData.paymentInfo!, accountHolder: e.target.value },
                          })
                        }
                        className="input-field"
                        placeholder="시애라"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        담당자 이름 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.paymentInfo?.managerName || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentInfo: { ...formData.paymentInfo!, managerName: e.target.value },
                          })
                        }
                        className="input-field"
                        placeholder="김산행"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        담당자 연락처 <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.paymentInfo?.managerPhone || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentInfo: { ...formData.paymentInfo!, managerPhone: e.target.value },
                            })
                          }
                          className="input-field pl-10"
                          placeholder="010-1234-5678"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong>안내:</strong> 모든 입금 정보를 입력하면 산행이 자동으로 공개됩니다. 
                      참석자들은 공개된 산행만 확인하고 신청할 수 있습니다.
                    </p>
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
              {/* 산행 목록을 날짜순으로 정렬 (최신순) */}
              {events
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .reduce((acc, event) => {
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  const isPast = eventDate < today;
                  
                  if (!acc.past && isPast) {
                    acc.sections.push(
                      <div key="divider" className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-slate-300"></div>
                        <div className="px-4 py-2 bg-slate-100 rounded-full">
                          <span className="text-sm font-semibold text-slate-600">지난 산행</span>
                        </div>
                        <div className="flex-1 h-px bg-slate-300"></div>
                      </div>
                    );
                    acc.past = true;
                  }
                  
                  const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  acc.sections.push(
                    <div key={event.id} className={`card ${
                      !isPast ? 'border-l-4 border-primary-500' : 'opacity-75'
                    }`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-slate-900">{event.title}</h3>
                            {!isPast && daysUntil >= 0 && (
                              <Badge variant={daysUntil <= 7 ? 'danger' : 'primary'}>
                                D-{daysUntil}
                              </Badge>
                            )}
                            {isPast && <Badge variant="info">종료</Badge>}
                            {event.isPublished ? (
                              <Badge variant="success">공개됨</Badge>
                            ) : (
                              <Badge variant="warning">비공개</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-slate-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>최대 {event.maxParticipants}명</span>
                            </div>
                            <div className="flex items-center space-x-1 text-primary-600 font-bold">
                              <span className="text-base">₩</span>
                              <span>{event.cost}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="수정"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-4">{event.description}</p>
                      
                      {/* 입금 정보 미완료 경고 */}
                      {!event.isPublished && !isPast && (
                        <div className="mb-4 p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-amber-900 mb-1">⚠️ 입금 정보 미완료</p>
                              <p className="text-sm text-amber-800">
                                이 산행은 아직 공개되지 않았습니다. 입금 정보를 모두 입력하면 자동으로 공개됩니다.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-bold text-slate-900 mb-2">당일 동선</h4>
                        <div className="space-y-1 text-sm">
                          {event.schedule.map((item, index) => (
                            <div key={index}>
                              {item.time} {item.type === 'departure' && '출발'}{item.type === 'stop' && '정차'}{item.type === 'return' && '복귀'}{item.type === 'arrival' && '도착'} @ {item.location}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                  
                  return acc;
                }, { sections: [] as React.JSX.Element[], past: false }).sections}
              
              {events.length === 0 && (
                <Card className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-xl text-slate-500">등록된 산행이 없습니다.</p>
                  <p className="text-sm text-slate-400 mt-2">
                    새 산행을 등록하여 회원들과 함께 즐거운 산행을 계획하세요.
                  </p>
                </Card>
              )}
            </div>
          )}
        </>
      )}

      {/* Teams Tab Content */}
      {activeTab === 'teams' && (
        <>
          {/* 산행 선택 */}
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">조 편성할 산행 선택</h2>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-slate-600">등록된 산행: {events.length}개</span>
              </div>
            </div>
            
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEventIdForTeam(event.id)}
                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                      selectedEventIdForTeam === event.id
                        ? 'bg-primary-50 border-primary-600 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-slate-900">{event.title}</h3>
                      {selectedEventIdForTeam === event.id && (
                        <Badge variant="primary">선택됨</Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    {selectedEventIdForTeam === event.id && (
                      <div className="mt-3 pt-3 border-t border-primary-200">
                        <div className="text-sm text-primary-700 font-medium">
                          이 산행의 조 편성: {teams.filter(t => t.eventId === event.id).length}개
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500">등록된 산행이 없습니다.</p>
                <p className="text-sm text-slate-400 mt-1">
                  먼저 "산행 관리" 탭에서 산행을 등록해주세요.
                </p>
              </div>
            )}
          </Card>

          {selectedEventIdForTeam ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-slate-600 text-sm mb-1">이 산행의 조</p>
                  <p className="text-3xl font-bold text-slate-900">{filteredTeams.length}개</p>
                </Card>

                <Card className="text-center bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-blue-600 text-sm mb-1">배치된 인원</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {filteredTeams.reduce((sum, team) => sum + team.members.length + 1, 0)}명
                  </p>
                </Card>

                <Card className="text-center bg-green-50 border-green-200">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-green-600 text-sm mb-1">참석 가능 인원</p>
                  <p className="text-3xl font-bold text-green-600">{registeredMembers.length}명</p>
                </Card>
              </div>

          {isEditingTeam ? (
            <Card>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingTeam ? '조 편성 수정' : '새 조 추가'}
              </h2>
              
              {/* 선택된 산행 정보 표시 */}
              {teamFormData.eventId && (
                <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mountain className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-bold text-primary-900">조 편성 대상 산행</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 ml-7">{teamFormData.eventTitle}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      조 이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={teamFormData.name}
                      onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                      className="input-field"
                      placeholder="1조"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      조장 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={teamFormData.leaderName}
                        readOnly
                        className="input-field flex-1 bg-slate-50"
                        placeholder="조장을 선택하세요"
                      />
                      <button
                        onClick={() => setShowMemberSelectModal(true)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      >
                        선택
                      </button>
                    </div>
                    {teamFormData.leaderOccupation && (
                      <p className="text-sm text-slate-500 mt-1">{teamFormData.leaderOccupation}</p>
                    )}
                  </div>
                </div>

                {/* Members List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-slate-700 font-medium">
                      조원 목록
                    </label>
                    <button
                      onClick={() => setShowMemberSelectModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>조원 추가</span>
                    </button>
                  </div>

                  {teamFormData.members.length > 0 ? (
                    <div className="space-y-2">
                      {teamFormData.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-bold text-slate-900">
                                {member.name}
                                {member.isGuest && (
                                  <span className="ml-2 text-amber-600 font-bold">(G)</span>
                                )}
                              </p>
                              <p className="text-sm text-slate-600">
                                {member.occupation} {member.company}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleSetLeader(member)}
                              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                            >
                              조장 지정
                            </button>
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                      <p className="text-slate-500">조원이 없습니다. 조원을 추가해주세요.</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleCancelTeam}
                    className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium text-lg hover:bg-slate-300 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X className="h-5 w-5" />
                    <span>취소</span>
                  </button>
                  <button
                    onClick={handleSaveTeam}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>저장</span>
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                <Card key={team.id}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-2xl font-bold text-slate-900">{team.name}</h3>
                      <Badge variant="primary">{team.members.length + 1}명</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTeam(team)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Leader */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-bold text-blue-900">조장</span>
                    </div>
                    <div className="ml-7">
                      <p className="font-bold text-slate-900">{team.leaderName}</p>
                      <p className="text-sm text-slate-600">{team.leaderOccupation}</p>
                    </div>
                  </div>

                  {/* Members */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>조원 ({team.members.length}명)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {team.members.map((member) => (
                        <div key={member.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="font-bold text-slate-900">
                            {member.name}
                            {member.isGuest && (
                              <span className="ml-2 text-amber-600 font-bold">(G)</span>
                            )}
                          </p>
                          <p className="text-sm text-slate-600">
                            {member.occupation} {member.company}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-xl text-slate-500">이 산행에 대한 조 편성이 없습니다.</p>
                <p className="text-sm text-slate-400 mt-2">
                  "새 조 추가" 버튼을 눌러 조를 편성하세요.
                </p>
              </Card>
            )}
          </div>
        )}

          {/* Info Notice */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">조 편성 안내</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• 먼저 조 편성할 산행을 선택해주세요.</li>
                  <li>• 입금이 완료된 참석자만 조 편성에 포함할 수 있습니다.</li>
                  <li>• 각 조에는 반드시 조장이 지정되어야 합니다.</li>
                  <li>• 조원은 여러 조에 중복으로 배치될 수 없습니다.</li>
                  <li>• 조 편성 후 참석자들에게 자동으로 알림이 발송됩니다.</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card className="text-center py-12 bg-amber-50 border-amber-200">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-amber-500" />
          <p className="text-xl font-bold text-slate-900 mb-2">산행을 먼저 선택해주세요</p>
          <p className="text-slate-600">
            조 편성을 시작하려면 위에서 산행을 선택하세요.
          </p>
        </Card>
      )}
    </>
  )}
      
  {/* Member Select Modal */}
  {showMemberSelectModal && (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={() => setShowMemberSelectModal(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-2xl font-bold text-slate-900">회원 선택</h3>
          <button
            onClick={() => setShowMemberSelectModal(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-slate-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {registeredMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => {
                  handleAddMember(member);
                  setShowMemberSelectModal(false);
                }}
                className="p-4 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 hover:border-primary-600 transition-all"
              >
                <p className="font-bold text-slate-900">{member.name}</p>
                <p className="text-sm text-slate-600">
                  {member.occupation} {member.company}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
};

export default EventManagement;

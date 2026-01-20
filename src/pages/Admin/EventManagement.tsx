/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Save, X, CreditCard, Phone, UserPlus, CheckCircle, Shield, AlertCircle, Lock, Mountain, Printer, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../contexts/EventContext';
import { useMembers } from '../../contexts/MemberContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { HikingEvent, PaymentInfo, ScheduleItem, Course, Team, TeamMember } from '../../types';

type TabType = 'events' | 'teams';

const EventManagement = () => {
  const navigate = useNavigate();
  const { setTeamsForEvent, getParticipantsByEventId } = useEvents();
  const { members, getMembersByPosition } = useMembers();
  const [activeTab, setActiveTab] = useState<TabType>('events');

  // 10분 단위 시간 옵션 생성
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        options.push(`${h}:${m}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // 운영진 목록 가져오기
  const executives = [
    ...getMembersByPosition('chairman'),
    ...getMembersByPosition('committee')
  ];

  // Event Management State
  const [events, setEvents] = useState<HikingEvent[]>([
    {
      id: '1',
      title: '북한산 백운대 등반',
      date: '2026-01-15',
      location: '북한산 국립공원',
      difficulty: '중',
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
        accountHolder: '시애라클럽',
        managerName: '김재무',
        managerPhone: '010-1234-5678',
        cost: '60,000원',
      },
      isPublished: true,
      isSpecial: false,
      status: 'open', // 신청 접수중
      applicationDeadline: '2026-01-10',
      createdAt: '2026-01-01',
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<HikingEvent | null>(null);
  const [formData, setFormData] = useState<HikingEvent>({
    id: '',
    title: '',
    date: '',
    location: '',
    mountain: '',
    altitude: '',
    difficulty: '중',
    description: '',
    maxParticipants: 100,
    cost: '60,000원',
    schedule: [
      { time: '', location: '', type: 'departure' },
      { time: '', location: '', type: 'stop' },
      { time: '', location: '', type: 'return' },
      { time: '', location: '', type: 'arrival' },
    ],
    courses: [
      {
        id: 'default-course-a',
        name: 'A조',
        description: '',
        distance: '',
        schedule: [{ time: '', location: '', type: 'departure' }],
      }
    ],
    paymentInfo: {
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      managerName: '',
      managerPhone: '',
      cost: '60,000원',
    },
    isPublished: false,
    isSpecial: false,
    status: 'draft', // 초기 상태는 작성중
    applicationDeadline: '',
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
  const [isSelectingLeader, setIsSelectingLeader] = useState(false); // 조장 선택 모드인지 구분
  const [selectedMembersForAdd, setSelectedMembersForAdd] = useState<string[]>([]); // 복수 선택을 위한 state
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

  // 선택된 산행의 조 편성만 필터링 (먼저 정의)
  const filteredTeams = selectedEventIdForTeam 
    ? teams.filter(team => team.eventId === selectedEventIdForTeam)
    : [];

  // 선택된 산행에 신청하고 입금까지 완료된 회원만 필터링
  const getApplicantsForEvent = (eventId: string): TeamMember[] => {
    if (!eventId) return [];
    
    // 실제 참가자 데이터에서 입금 완료된 사람만 가져오기
    const eventParticipants = getParticipantsByEventId(eventId);
    const confirmedParticipants = eventParticipants.filter(p => p.status === 'confirmed');
    
    // TeamMember 형식으로 변환
    return confirmedParticipants.map(p => ({
      id: p.id,
      name: p.name,
      company: p.company,
      position: p.position,
      occupation: p.occupation || `${p.company} ${p.position}`,
      phone: p.phone,
    }));
  };

  // 이미 다른 조에 배정된 회원 제외
  const getAvailableMembers = (eventId: string): TeamMember[] => {
    const applicants = getApplicantsForEvent(eventId);
    
    // 선택된 산행의 모든 조에서 이미 배정된 회원 ID 수집
    const assignedMemberIds = new Set<string>();
    filteredTeams.forEach(team => {
      assignedMemberIds.add(team.leaderId);
      team.members.forEach(member => assignedMemberIds.add(member.id));
    });
    
    // 현재 편집 중인 조는 제외 (자기 조 회원은 볼 수 있어야 함)
    if (editingTeam) {
      assignedMemberIds.delete(editingTeam.leaderId);
      editingTeam.members.forEach(member => assignedMemberIds.delete(member.id));
    }
    
    return applicants.filter(member => !assignedMemberIds.has(member.id));
  };

  // 현재 조 편성에 사용할 회원 목록
  const availableMembers = getAvailableMembers(selectedEventIdForTeam);

  // ==================== 자동 아카이빙 (산행 다음날 자동 완료) ====================
  useEffect(() => {
    const checkAndArchiveEvents = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let updated = false;
      const updatedEvents = events.map(event => {
        // 산행이 진행중(ongoing)이고, 산행 날짜가 지났으면 자동 완료
        if (event.status === 'ongoing') {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          
          // 산행 다음날 (산행 당일 + 1일)
          const dayAfterEvent = new Date(eventDate);
          dayAfterEvent.setDate(dayAfterEvent.getDate() + 1);
          
          if (today >= dayAfterEvent) {
            updated = true;
            console.log(`[자동 아카이빙] ${event.title} 산행이 완료 처리되었습니다.`);
            return { ...event, status: 'completed' as const };
          }
        }
        return event;
      });
      
      if (updated) {
        setEvents(updatedEvents);
      }
    };
    
    // 컴포넌트 마운트 시 체크
    checkAndArchiveEvents();
    
    // 매일 자정에 체크 (개발 환경에서는 1분마다)
    const interval = setInterval(checkAndArchiveEvents, 60000); // 1분마다 체크
    
    return () => clearInterval(interval);
  }, [events]);

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
    // 코스 필수 검증
    if (!formData.courses || formData.courses.length === 0) {
      alert('산행 코스를 최소 1개 이상 등록해주세요.');
      return;
    }

    // 코스 정보 완성도 검증
    const incompleteCourse = formData.courses.find(course => 
      !course.name || !course.distance || !course.description || 
      !course.schedule || course.schedule.length === 0 ||
      course.schedule.some(s => !s.time || !s.location)
    );

    if (incompleteCourse) {
      alert('코스 정보를 모두 입력해주세요. (코스명, 거리, 코스 설명, 상세 일정)');
      return;
    }

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
      difficulty: '중',
      description: '',
      maxParticipants: 100,
      cost: '60,000원',
      schedule: [
        { time: '', location: '', type: 'departure' },
        { time: '', location: '', type: 'stop' },
        { time: '', location: '', type: 'return' },
        { time: '', location: '', type: 'arrival' },
      ],
      courses: [
        {
          id: 'default-course-a',
          name: 'A조',
          description: '',
          distance: '',
          schedule: [{ time: '', location: '', type: 'departure' }],
        }
      ],
      paymentInfo: {
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        managerName: '',
        managerPhone: '',
        cost: '60,000원',
      },
      isPublished: false,
      isSpecial: false,
      status: 'draft',
      applicationDeadline: '',
    });
  };

  // ==================== 상태 전환 함수들 ====================
  
  // 1단계 → 2단계: 산행 공개 (신청 접수 시작)
  const handleOpenApplication = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    if (!event.paymentInfo?.bankName || !event.paymentInfo?.accountNumber) {
      alert('입금 정보를 먼저 입력해주세요.');
      return;
    }
    
    if (!event.applicationDeadline) {
      alert('신청 마감일을 먼저 설정해주세요.');
      return;
    }
    
    if (confirm('산행을 공개하고 신청 접수를 시작하시겠습니까?')) {
      setEvents(events.map(e => 
        e.id === eventId 
          ? { ...e, status: 'open', isPublished: true }
          : e
      ));
      alert('산행이 공개되었습니다. 회원들이 신청할 수 있습니다.');
    }
  };

  // 4단계: 신청 마감
  const handleCloseApplication = (eventId: string) => {
    if (confirm('산행 신청을 마감하시겠습니까?\n마감 후에는 추가 신청을 받을 수 없습니다.')) {
      setEvents(events.map(e => 
        e.id === eventId 
          ? { ...e, status: 'closed' }
          : e
      ));
      alert('산행 신청이 마감되었습니다.\n이제 조 편성을 진행해주세요.');
    }
  };

  // 6단계: 산행 진행중으로 변경 (당일)
  const handleStartHiking = (eventId: string) => {
    if (confirm('산행을 시작하시겠습니까?')) {
      setEvents(events.map(e => 
        e.id === eventId 
          ? { ...e, status: 'ongoing' }
          : e
      ));
      alert('산행이 시작되었습니다. 안전한 산행 되세요!');
    }
  };

  // 7단계: 산행 완료 (다음날 자동 또는 수동)
  const handleCompleteHiking = (eventId: string) => {
    if (confirm('산행을 완료 처리하시겠습니까?\n완료된 산행은 이전 산행 목록으로 이동됩니다.')) {
      setEvents(events.map(e => 
        e.id === eventId 
          ? { ...e, status: 'completed' }
          : e
      ));
      alert('산행이 완료되었습니다. 수고하셨습니다!');
    }
  };

  // 상태별 액션 버튼 렌더링
  const getStatusActions = (event: Event) => {
    const today = new Date();
    const eventDate = new Date(event.date);
    const deadlineDate = event.applicationDeadline ? new Date(event.applicationDeadline) : null;
    
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    if (deadlineDate) deadlineDate.setHours(0, 0, 0, 0);
    
    const isEventDay = eventDate.getTime() === today.getTime();
    const isAfterEvent = today > eventDate;
    
    switch (event.status) {
      case 'draft':
        return (
          <button
            onClick={() => handleOpenApplication(event.id)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            신청 접수 시작
          </button>
        );
      
      case 'open':
        return (
          <button
            onClick={() => handleCloseApplication(event.id)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            신청 마감
          </button>
        );
      
      case 'closed':
        if (isEventDay) {
          return (
            <button
              onClick={() => handleStartHiking(event.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Mountain className="w-4 h-4" />
              산행 시작
            </button>
          );
        }
        return (
          <Badge variant="info">조 편성 완료</Badge>
        );
      
      case 'ongoing':
        return (
          <button
            onClick={() => handleCompleteHiking(event.id)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            산행 완료
          </button>
        );
      
      case 'completed':
        return <Badge variant="default">완료됨</Badge>;
      
      default:
        return null;
    }
  };

  // 상태별 뱃지 색상 및 텍스트
  const getStatusBadge = (status: Event['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="default">작성중</Badge>;
      case 'open':
        return <Badge variant="success">신청 접수중</Badge>;
      case 'closed':
        return <Badge variant="warning">신청 마감</Badge>;
      case 'ongoing':
        return <Badge variant="primary">산행중</Badge>;
      case 'completed':
        return <Badge variant="info">완료</Badge>;
      default:
        return null;
    }
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

  const updateScheduleType = (index: number, type: 'departure' | 'stop' | 'lunch' | 'networking' | 'return' | 'arrival') => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], type };
    setFormData({ ...formData, schedule: newSchedule });
  };

  // Course Management
  const addCourse = () => {
    const currentCourses = formData.courses || [];
    const nextCourseName = currentCourses.length === 1 && currentCourses[0].name === 'A조' ? 'B조' : '';
    
    // 이미 B조가 있으면 더 이상 추가하지 않음
    if (currentCourses.some(c => c.name === 'B조')) {
      alert('코스는 최대 2개(A조, B조)까지만 추가할 수 있습니다.');
      return;
    }
    
    const newCourse: Course = {
      id: Date.now().toString(),
      name: nextCourseName,
      description: '',
      distance: '',
      schedule: [{ time: '', location: '', type: 'departure' }],
    };
    setFormData({
      ...formData,
      courses: [...currentCourses, newCourse],
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
  // 산행 선택 시 조 자동 생성 (최대 10개 조 미리 생성)
  const handleSelectEventForTeam = (eventId: string) => {
    setSelectedEventIdForTeam(eventId);
    
    // 해당 산행에 이미 생성된 조가 있는지 확인
    const existingTeams = teams.filter(team => team.eventId === eventId);
    
    // 조가 없으면 미리 10개 조 생성 (빈 조)
    if (existingTeams.length === 0 && eventId) {
      const selectedEvent = events.find(e => e.id === eventId);
      const newTeams: Team[] = [];
      
      for (let i = 1; i <= 10; i++) {
        // @ts-ignore
        newTeams.push({
          id: `${eventId}-team-${i}`,
          name: `${i}조`,
          number: i,
          eventId: eventId,
          eventTitle: selectedEvent?.title || '',
          leaderId: '',
          leaderName: '',
          leaderOccupation: '',
          members: [],
        });
      }
      
      const updatedTeams = [...teams, ...newTeams];
      setTeams(updatedTeams);
      syncTeamsToContext(updatedTeams);
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setTeamFormData(team);
    setIsEditingTeam(true);
  };

  const handleDeleteTeam = (id: string) => {
    if (confirm('이 조를 삭제하시겠습니까?')) {
      const updatedTeams = teams.filter(t => t.id !== id);
      setTeams(updatedTeams);
      syncTeamsToContext(updatedTeams);
    }
  };

  const handleSaveTeam = () => {
    // 조장이 선택되지 않은 경우 저장하지 않음
    if (!teamFormData.leaderId) {
      alert('조장을 선택해주세요.');
      return;
    }

    const selectedEvent = events.find(e => e.id === teamFormData.eventId);
    const updatedTeamData = {
      ...teamFormData,
      eventTitle: selectedEvent?.title || '',
    };

    const updatedTeams = editingTeam
      ? teams.map(t => t.id === editingTeam.id ? updatedTeamData : t)
      : [...teams, { ...updatedTeamData, id: Date.now().toString() }];
    
    setTeams(updatedTeams);
    
    // Context에도 저장 (필드 매핑 수정)
    if (selectedEventIdForTeam) {
      const contextTeams = updatedTeams
        .filter(t => t.eventId === selectedEventIdForTeam)
        .map(t => ({
          id: t.id,
          eventId: t.eventId,
          number: t.number,
          name: t.name,
          leaderId: t.leaderId,
          leaderName: t.leaderName,
          leaderPhone: t.leaderPhone,
          leaderCompany: t.company || '', // company 필드 사용
          leaderPosition: t.position || t.leaderOccupation || '', // position 필드 우선 사용
          leaderOccupation: t.position || t.leaderOccupation || '', // 호환성
          members: t.members.map(m => ({
            id: m.id,
            name: m.name,
            phone: m.phone || '',
            company: m.company || '',
            position: m.position || m.occupation || '', // position 필드 우선
            occupation: m.position || m.occupation || '', // 호환성
            isGuest: m.isGuest || false,
          })),
        }));
      setTeamsForEvent(selectedEventIdForTeam, contextTeams);
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

  // Context 업데이트 헬퍼 함수 (필드 매핑 수정)
  const syncTeamsToContext = (updatedTeams: Team[]) => {
    if (selectedEventIdForTeam) {
      const contextTeams = updatedTeams
        .filter(t => t.eventId === selectedEventIdForTeam)
        .map(t => ({
          id: t.id,
          eventId: t.eventId,
          number: t.number,
          name: t.name,
          leaderId: t.leaderId,
          leaderName: t.leaderName,
          leaderPhone: t.leaderPhone,
          leaderCompany: t.company || '', // company 필드 사용
          leaderPosition: t.position || t.leaderOccupation || '', // position 필드 우선 사용
          leaderOccupation: t.position || t.leaderOccupation || '', // 호환성
          members: t.members.map(m => ({
            id: m.id,
            name: m.name,
            phone: m.phone || '',
            company: m.company || '',
            position: m.position || m.occupation || '', // position 필드 우선
            occupation: m.position || m.occupation || '', // 호환성
            isGuest: m.isGuest || false,
          })),
        }));
      setTeamsForEvent(selectedEventIdForTeam, contextTeams);
    }
  };

  // 새 조 추가 (자동 번호 매김)
  const handleAddNewTeam = () => {
    if (!selectedEventIdForTeam) {
      alert('조 편성할 산행을 먼저 선택해주세요.');
      return;
    }

    const selectedEvent = events.find(e => e.id === selectedEventIdForTeam);
    
    // 현재 산행의 조 개수 확인하여 다음 번호 계산
    const currentTeams = teams.filter(team => team.eventId === selectedEventIdForTeam);
    const nextTeamNumber = currentTeams.length + 1;
    
    const newTeam: Team = {
      id: `${selectedEventIdForTeam}-team-${Date.now()}`,
      name: `${nextTeamNumber}조`,
      eventId: selectedEventIdForTeam,
      eventTitle: selectedEvent?.title || '',
      leaderId: '',
      leaderName: '',
      leaderOccupation: '',
      members: [],
    };
    
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    syncTeamsToContext(updatedTeams);
    alert(`${nextTeamNumber}조가 추가되었습니다.`);
  };

  const handleAddMember = (member: TeamMember) => {
    // 이미 조장인지 확인
    if (member.id === teamFormData.leaderId) {
      alert('해당 회원은 이미 조장으로 지정되어 있습니다.');
      return;
    }
    
    // 이미 조원 목록에 있는지 확인
    if (teamFormData.members.find(m => m.id === member.id)) {
      alert('이미 조원 목록에 추가된 회원입니다.');
      return;
    }
    
    setTeamFormData({ ...teamFormData, members: [...teamFormData.members, member] });
    setShowMemberSelectModal(false);
  };

  // 복수 선택된 조원 추가
  const handleAddSelectedMembers = () => {
    if (selectedMembersForAdd.length === 0) {
      alert('추가할 조원을 선택해주세요.');
      return;
    }

    const membersToAdd = availableMembers.filter(member => 
      selectedMembersForAdd.includes(member.id)
    );

    setTeamFormData({ 
      ...teamFormData, 
      members: [...teamFormData.members, ...membersToAdd] 
    });
    
    setSelectedMembersForAdd([]);
    setShowMemberSelectModal(false);
    alert(`${membersToAdd.length}명의 조원이 추가되었습니다.`);
  };

  // 회원 선택 토글
  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembersForAdd(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamFormData({
      ...teamFormData,
      members: teamFormData.members.filter(m => m.id !== memberId),
    });
  };

  const handleSetLeader = (member: TeamMember) => {
    // 기존 조장이 있으면 조원으로 이동
    let updatedMembers = [...teamFormData.members];
    
    // 새로운 조장이 조원 목록에 있으면 제거
    updatedMembers = updatedMembers.filter(m => m.id !== member.id);
    
    // 기존 조장이 있고, 조원 목록에 없으면 조원으로 추가
    if (teamFormData.leaderId && teamFormData.leaderName) {
      const formerLeader: TeamMember = {
        id: teamFormData.leaderId,
        name: teamFormData.leaderName,
        occupation: teamFormData.leaderOccupation.split(' ')[0] || '',
        company: teamFormData.leaderOccupation.split(' ').slice(1).join(' ') || '',
      };
      
      // 기존 조장이 조원 목록에 없는 경우에만 추가
      if (!updatedMembers.find(m => m.id === formerLeader.id)) {
        updatedMembers.push(formerLeader);
      }
    }
    
    setTeamFormData({
      ...teamFormData,
      leaderId: member.id,
      leaderName: member.name,
      leaderOccupation: `${member.occupation} ${member.company}`,
      members: updatedMembers,
    });
    
    setShowMemberSelectModal(false);
  };

  const totalMembers = teams.reduce((sum, team) => sum + team.members.length + 1, 0);

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
      {/* Tab Navigation with Action Buttons */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
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

        {/* Action Buttons */}
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
        {activeTab === 'teams' && !isEditingTeam && selectedEventIdForTeam && (
          <button
            onClick={handleAddNewTeam}
            className="flex items-center space-x-2 btn-primary"
          >
            <Plus className="h-5 w-5" />
            <span>조 추가</span>
          </button>
        )}
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

          {/* 산행 관리 프로세스 안내 */}
          {!isEditing && (
            <Card className="mb-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Mountain className="w-6 h-6 text-blue-600" />
                산행 관리 프로세스
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {[
                  { step: 1, title: '산행 등록', desc: '새 산행 등록', icon: Plus, color: 'blue' },
                  { step: 2, title: '신청 접수', desc: '회원 신청 받기', icon: UserPlus, color: 'green' },
                  { step: 3, title: '입금 관리', desc: '입금 확인', icon: CreditCard, color: 'purple' },
                  { step: 4, title: '신청 마감', desc: '접수 종료', icon: Lock, color: 'amber' },
                  { step: 5, title: '조 편성', desc: '팀 구성', icon: Users, color: 'indigo' },
                  { step: 6, title: '산행 진행', desc: '당일 산행', icon: Mountain, color: 'emerald' },
                  { step: 7, title: '완료 처리', desc: '아카이빙', icon: CheckCircle, color: 'slate' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full bg-${item.color}-100 border-2 border-${item.color}-300 flex items-center justify-center mb-2`}>
                        <Icon className={`w-8 h-8 text-${item.color}-600`} />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-slate-500 mb-1">STEP {item.step}</div>
                        <div className="text-sm font-bold text-slate-900">{item.title}</div>
                        <div className="text-xs text-slate-600 mt-1">{item.desc}</div>
                      </div>
                      {index < 6 && (
                        <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-300" 
                             style={{ transform: 'translateX(50%)' }}></div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-slate-700">
                  <strong className="text-blue-700">📌 프로세스 가이드:</strong> 산행 등록 후 신청을 받고, 
                  입금을 확인한 뒤 신청을 마감합니다. 조 편성 완료 후 산행 당일에 진행하고, 
                  다음날 자동으로 완료 처리됩니다.
                </p>
              </div>
            </Card>
          )}

          {isEditing ? (
            <div className="card">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingEvent ? '산행 수정' : '새 산행 등록'}
              </h2>
              <div className="space-y-6">
                {/* 특별산행 선택 */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="checkbox"
                          id="isSpecial"
                          checked={formData.isSpecial || false}
                          onChange={(e) => setFormData({ ...formData, isSpecial: e.target.checked })}
                          className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="isSpecial" className="text-lg font-bold text-slate-900 cursor-pointer">
                          특별산행으로 등록
                        </label>
                        <Badge variant={formData.isSpecial ? 'primary' : 'default'}>
                          {formData.isSpecial ? '특별산행' : '정기산행'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 ml-8">
                        {formData.isSpecial ? (
                          <>
                            <strong className="text-purple-700">특별산행</strong>: 1박 산행, 해외 산행 등 특별한 산행입니다. 
                            1년에 최대 2번 진행할 수 있습니다.
                          </>
                        ) : (
                          <>
                            <strong className="text-blue-700">정기산행</strong>: 매월 진행되는 정기 당일 산행입니다.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

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
                      산행 날짜 <span className="text-red-500">*</span>
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
                      신청 마감일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.applicationDeadline || ''}
                      onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                      className="input-field"
                      max={formData.date} // 산행 날짜 이전만 선택 가능
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      * 신청 마감일은 산행 날짜 이전이어야 합니다
                    </p>
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
                      min="1"
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
                      <option value="하">하</option>
                      <option value="중하">중하</option>
                      <option value="중">중</option>
                      <option value="중상">중상</option>
                      <option value="상">상</option>
                    </select>
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

                {/* 당일 비상연락처 */}
                <div className="p-5 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-5 h-5 text-red-600" />
                    <label className="block text-slate-900 font-bold text-base">
                      당일 비상연락처
                    </label>
                  </div>
                  <select
                    value={formData.emergencyContactId || ''}
                    onChange={(e) => {
                      const selectedExecutive = executives.find(exec => String(exec.id) === e.target.value);
                      setFormData({
                        ...formData,
                        emergencyContactId: e.target.value,
                        emergencyContactName: selectedExecutive?.name || '',
                        emergencyContactPhone: selectedExecutive?.phone || '',
                      });
                    }}
                    className="input-field bg-white"
                  >
                    <option value="">운영진 중 선택하세요</option>
                    {executives.map((exec) => (
                      <option key={exec.id} value={exec.id}>
                        {exec.name} - {exec.occupation} ({exec.phone})
                      </option>
                    ))}
                  </select>
                  {formData.emergencyContactId && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-slate-700">선택된 비상연락처</span>
                      </div>
                      <p className="text-base font-bold text-slate-900">
                        {formData.emergencyContactName}
                      </p>
                      <p className="text-sm text-slate-600">
                        📞 {formData.emergencyContactPhone}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-slate-600 mt-2 flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>산행 당일 비상 상황 발생 시 연락할 운영진을 선택하세요. 프린트된 안내서에 표시됩니다.</span>
                  </p>
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
                              <option value="lunch">점심</option>
                              <option value="networking">네트워킹</option>
                              <option value="return">복귀</option>
                              <option value="arrival">도착</option>
                            </select>
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-sm text-slate-600 mb-1">시간</label>
                            <select
                              value={item.time}
                              onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                              className="input-field"
                            >
                              <option value="">시간 선택</option>
                              {timeOptions.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
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
                    <div className="flex-1">
                      <label className="block text-slate-900 font-bold text-lg mb-1">
                        산행 코스 <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-slate-600">
                        참가자가 신청 시 선택할 수 있는 코스를 등록하세요 (A조, B조)
                      </p>
                    </div>
                    {/* B조가 없을 때만 추가 버튼 표시 */}
                    {(!formData.courses || !formData.courses.some(c => c.name === 'B조')) && (
                      <button
                        type="button"
                        onClick={addCourse}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-lg border-2 border-primary-700"
                      >
                        <Plus className="h-5 w-5" />
                        <span>B조 추가</span>
                      </button>
                    )}
                  </div>

                  <div className="mb-4 p-4 bg-info-50 rounded-lg border border-info-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-info-900">
                        <strong>코스 등록 안내:</strong> A조(난이도 높음), B조(난이도 낮음) - 참가자는 산행 신청 시 원하는 코스를 선택하게 됩니다
                      </div>
                    </div>
                  </div>
                  
                  {formData.courses && formData.courses.length > 0 && (
                    <div className="space-y-6">
                      {formData.courses.map((course, courseIdx) => (
                        <div key={course.id} className={`p-5 rounded-xl border-2 ${
                          course.name === 'A조' ? 'bg-success-50 border-success-200' :
                          course.name === 'B조' ? 'bg-info-50 border-info-200' :
                          'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <h4 className="text-lg font-bold text-slate-900">
                                코스 {courseIdx + 1}
                              </h4>
                              {course.name && (
                                <Badge variant={
                                  course.name === 'A조' ? 'success' :
                                  course.name === 'B조' ? 'info' :
                                  'default'
                                }>
                                  {course.name}
                                </Badge>
                              )}
                            </div>
                            {/* A조는 삭제 불가 */}
                            {course.name !== 'A조' && (
                              <button
                                type="button"
                                onClick={() => removeCourse(course.id)}
                                className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1 text-sm font-medium"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>코스 삭제</span>
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <label className="block text-sm text-slate-700 font-medium mb-1">
                                코스명 <span className="text-red-500">*</span>
                              </label>
                              <div className="px-4 py-3 bg-slate-100 rounded-lg border border-slate-300">
                                <p className="font-bold text-lg text-slate-900">{course.name}</p>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm text-slate-700 font-medium mb-1">
                                거리 <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  value={course.distance.replace(/[^0-9.]/g, '')}
                                  onChange={(e) => {
                                    const numValue = e.target.value;
                                    updateCourse(course.id, 'distance', numValue ? `약 ${numValue}km` : '');
                                  }}
                                  className="input-field pr-12"
                                  placeholder="8.5"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                                  km
                                </span>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm text-slate-700 font-medium mb-1">
                                코스 설명 <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={course.description}
                                onChange={(e) => updateCourse(course.id, 'description', e.target.value)}
                                className="input-field"
                                placeholder="한국APT - 약수터 - 성당칼림길 - 능선길 - 정상(737.2m)..."
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="block text-sm text-slate-900 font-bold">
                                상세 일정 <span className="text-red-500">*</span>
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
                                <div key={scheduleIdx} className="grid grid-cols-12 gap-2 items-end bg-white p-3 rounded-lg border border-slate-200">
                                  <div className="col-span-2">
                                    <label className="block text-xs text-slate-600 mb-1">시간</label>
                                    <select
                                      value={scheduleItem.time}
                                      onChange={(e) =>
                                        updateCourseSchedule(course.id, scheduleIdx, 'time', e.target.value)
                                      }
                                      className="input-field text-sm font-bold text-primary-700"
                                    >
                                      <option value="">선택</option>
                                      {timeOptions.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-span-9">
                                    <label className="block text-xs text-slate-600 mb-1">장소</label>
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
                <div className="border-t-2 border-primary-200 pt-8">
                  <div className="bg-primary-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">입금 정보</h3>
                        <p className="text-sm text-slate-600 mt-1">참가자들이 참가비를 입금할 계좌 정보를 입력하세요</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-primary-200">
                      <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-700">
                        <strong className="text-primary-700">필수 정보:</strong> 모든 입금 정보를 정확히 입력해야 참가자들이 산행을 신청할 수 있습니다.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-700 font-bold mb-2">
                        참가비 <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₩</span>
                        <input
                          type="number"
                          value={formData.paymentInfo?.cost ? parseInt(formData.paymentInfo.cost.replace(/[^0-9]/g, '')) : ''}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^0-9]/g, '');
                            const formattedValue = numericValue ? `${parseInt(numericValue).toLocaleString()}원` : '';
                            setFormData({
                              ...formData,
                              paymentInfo: { ...formData.paymentInfo!, cost: formattedValue },
                            });
                          }}
                          className="input-field pl-10 text-lg font-bold"
                          placeholder="60000"
                          min="0"
                          step="1000"
                        />
                        {formData.paymentInfo?.cost && (
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">
                            {formData.paymentInfo.cost}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">숫자만 입력하세요</p>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-2">
                        은행명 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.paymentInfo?.bankName || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentInfo: { ...formData.paymentInfo!, bankName: e.target.value },
                          })
                        }
                        className="input-field"
                      >
                        <option value="">은행 선택</option>
                        <option value="국민은행">국민은행</option>
                        <option value="신한은행">신한은행</option>
                        <option value="우리은행">우리은행</option>
                        <option value="하나은행">하나은행</option>
                        <option value="NH농협은행">NH농협은행</option>
                        <option value="IBK기업은행">IBK기업은행</option>
                        <option value="카카오뱅크">카카오뱅크</option>
                        <option value="토스뱅크">토스뱅크</option>
                        <option value="케이뱅크">케이뱅크</option>
                        <option value="SC제일은행">SC제일은행</option>
                        <option value="새마을금고">새마을금고</option>
                        <option value="신협">신협</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-2">
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
                        className="input-field font-mono text-lg"
                        placeholder="123-456-789012"
                      />
                      <p className="text-sm text-slate-500 mt-1">하이픈(-) 포함하여 입력</p>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-2">
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
                        placeholder="시애라 클럽"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-2">
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
                      <p className="text-sm text-slate-500 mt-1">문의 시 연락받을 담당자</p>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-2">
                        담당자 연락처 <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
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
                      <p className="text-sm text-slate-500 mt-1">입금 문의 연락처</p>
                    </div>
                  </div>

                  <div className="mt-6 p-5 bg-gradient-to-r from-success-50 to-info-50 rounded-xl border-2 border-success-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-success-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-success-900 mb-2">입금 정보 등록 완료 시</h4>
                        <p className="text-sm text-slate-700">산행이 자동으로 공개되며, 회원들이 산행을 확인하고 참석 신청할 수 있습니다. 입금 정보가 참석 신청 화면에 자동 표시됩니다.</p>
                      </div>
                    </div>
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
                    } ${event.isSpecial ? 'bg-gradient-to-br from-purple-50 to-pink-50' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-slate-900">{event.title}</h3>
                            {event.isSpecial && (
                              <Badge variant="primary">
                                <Mountain className="w-3 h-3 inline mr-1" />
                                특별산행
                              </Badge>
                            )}
                            {!isPast && daysUntil >= 0 && (
                              <Badge variant={daysUntil <= 7 ? 'danger' : 'primary'}>
                                D-{daysUntil}
                              </Badge>
                            )}
                            {isPast && event.status !== 'completed' && <Badge variant="info">종료</Badge>}
                            {getStatusBadge(event.status)}
                          </div>
                          <div className="flex flex-wrap gap-3 text-slate-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{event.date}</span>
                            </div>
                            {event.applicationDeadline && (
                              <div className="flex items-center space-x-1 text-amber-600">
                                <Clock className="h-4 w-4" />
                                <span>마감: {event.applicationDeadline}</span>
                              </div>
                            )}
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
                        <div className="flex flex-col gap-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.open(`/admin/events/print/${event.id}`, '_blank')}
                              className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                              title="프린트"
                            >
                              <Printer className="h-5 w-5" />
                            </button>
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
                          {getStatusActions(event)}
                        </div>
                      </div>
                      <p className="text-slate-700 mb-4">{event.description}</p>
                      
                      {/* 비상연락처 표시 */}
                      {event.emergencyContactName && (
                        <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-bold text-slate-900">당일 비상연락처:</span>
                            <span className="text-sm text-slate-700">
                              {event.emergencyContactName} ({event.emergencyContactPhone})
                            </span>
                          </div>
                        </div>
                      )}
                      
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
                              {item.time} {item.type === 'departure' && '출발'}{item.type === 'stop' && '정차'}{item.type === 'lunch' && '점심'}{item.type === 'networking' && '네트워킹'}{item.type === 'return' && '복귀'}{item.type === 'arrival' && '도착'} @ {item.location}
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
                    onClick={() => handleSelectEventForTeam(event.id)}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-slate-600 text-sm mb-1">전체 신청자</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {getApplicantsForEvent(selectedEventIdForTeam).length}명
                  </p>
                </Card>

                <Card className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-slate-600 text-sm mb-1">생성된 조</p>
                  <p className="text-3xl font-bold text-slate-900">{filteredTeams.length}개</p>
                </Card>

                <Card className="text-center bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-blue-600 text-sm mb-1">배치 완료</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {filteredTeams.reduce((sum, team) => sum + team.members.length + 1, 0)}명
                  </p>
                </Card>

                <Card className="text-center bg-success-50 border-success-200">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-6 h-6 text-success-600" />
                  </div>
                  <p className="text-success-600 text-sm mb-1">미배정 인원</p>
                  <p className="text-3xl font-bold text-success-600">{availableMembers.length}명</p>
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
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      조 이름
                    </label>
                    <div className="px-4 py-3 bg-slate-100 rounded-lg border border-slate-300">
                      <p className="text-lg font-bold text-slate-900">{teamFormData.name}</p>
                    </div>
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
                        onClick={() => {
                          setIsSelectingLeader(true);
                          setShowMemberSelectModal(true);
                        }}
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
                      onClick={() => {
                        setIsSelectingLeader(false);
                        setShowMemberSelectModal(true);
                      }}
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
                      {team.leaderId ? (
                        <Badge variant="primary">{team.members.length + 1}명</Badge>
                      ) : (
                        <Badge variant="default">편성 대기</Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTeam(team)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {team.leaderId ? (
                    <>
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
                      {team.members.length > 0 && (
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
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                      <Users className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                      <p className="text-slate-600 font-medium">아직 편성되지 않은 조입니다</p>
                      <p className="text-sm text-slate-500 mt-1">조장과 조원을 배정해주세요</p>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-xl text-slate-500">산행을 먼저 선택해주세요</p>
                <p className="text-sm text-slate-400 mt-2">
                  산행을 선택하면 조가 자동으로 생성됩니다
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
      onClick={() => {
        setShowMemberSelectModal(false);
        setIsSelectingLeader(false);
        setSelectedMembersForAdd([]);
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {isSelectingLeader ? '조장 선택' : '조원 추가'}
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                {isSelectingLeader 
                  ? '조장으로 지정할 회원을 선택하세요. 기존 조장은 자동으로 조원으로 이동합니다.'
                  : '조원으로 추가할 회원을 선택하세요. 여러 명을 선택한 후 확인 버튼을 눌러주세요.'
                }
              </p>
              {!isSelectingLeader && selectedMembersForAdd.length > 0 && (
                <p className="text-sm text-primary-600 font-semibold mt-2">
                  {selectedMembersForAdd.length}명 선택됨
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setShowMemberSelectModal(false);
                setIsSelectingLeader(false);
                setSelectedMembersForAdd([]);
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {availableMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="text-xl text-slate-500 mb-2">입금 완료된 신청자가 없습니다</p>
              <p className="text-sm text-slate-400">
                선택한 산행에 입금이 완료된 회원이 없거나,<br />
                모든 입금 완료자가 이미 조에 배정되었습니다.
              </p>
              <p className="text-xs text-slate-400 mt-3">
                💡 입금 관리 페이지에서 입금 확인 후 조편성을 진행하세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableMembers.map((member) => {
                const isLeader = member.id === teamFormData.leaderId;
                const isMember = teamFormData.members.some(m => m.id === member.id);
                const isSelected = isLeader || isMember;
                const isChecked = selectedMembersForAdd.includes(member.id);
                
                return (
                  <button
                    key={member.id}
                    onClick={() => {
                      if (isSelectingLeader) {
                        // 조장 선택 모드
                        handleSetLeader(member);
                      } else {
                        // 조원 추가 모드 - 복수 선택
                        if (isSelected) {
                          alert(isLeader ? '해당 회원은 이미 조장으로 지정되어 있습니다.' : '이미 조원 목록에 추가된 회원입니다.');
                          return;
                        }
                        toggleMemberSelection(member.id);
                      }
                    }}
                    disabled={!isSelectingLeader && isSelected}
                    className={`p-4 text-left rounded-lg border-2 transition-all ${
                      !isSelectingLeader && isSelected
                        ? 'bg-slate-100 border-slate-300 cursor-not-allowed opacity-60'
                        : isChecked
                        ? 'bg-primary-50 border-primary-600 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold ${
                            !isSelectingLeader && isSelected 
                              ? 'text-slate-500' 
                              : isChecked 
                              ? 'text-primary-900'
                              : 'text-slate-900'
                          }`}>
                            {member.name}
                          </p>
                          <Badge variant="success" className="text-xs">입금완료</Badge>
                        </div>
                        <p className={`text-sm ${
                          !isSelectingLeader && isSelected 
                            ? 'text-slate-400' 
                            : isChecked
                            ? 'text-primary-700'
                            : 'text-slate-600'
                        }`}>
                          {member.company} · {member.position || member.occupation}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLeader && (
                          <Badge variant="primary">현재 조장</Badge>
                        )}
                        {isMember && (
                          <Badge variant="success">조원</Badge>
                        )}
                        {!isSelectingLeader && !isSelected && (
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            isChecked 
                              ? 'bg-primary-600 border-primary-600' 
                              : 'border-slate-300'
                          }`}>
                            {isChecked && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 조원 추가 모드일 때만 확인 버튼 표시 */}
        {!isSelectingLeader && availableMembers.length > 0 && (
          <div className="p-6 border-t bg-slate-50">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowMemberSelectModal(false);
                  setSelectedMembersForAdd([]);
                }}
                className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddSelectedMembers}
                disabled={selectedMembersForAdd.length === 0}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
                  selectedMembersForAdd.length === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                확인 ({selectedMembersForAdd.length}명 추가)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )}
    </div>
  );
};

export default EventManagement;

import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Save, X, CreditCard, Phone } from 'lucide-react';

interface PaymentInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  managerName: string;
  managerPhone: string;
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

const EventManagement = () => {
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
    },
  });

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
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? formData : e));
    } else {
      setEvents([...events, { ...formData, id: Date.now().toString() }]);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">산행 관리</h1>
          <p className="text-xl text-gray-600">
            산행 일정을 등록하고 관리할 수 있습니다.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>새 산행 등록</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingEvent ? '산행 수정' : '새 산행 등록'}
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
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
                <label className="block text-gray-700 font-medium mb-2">
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
                <label className="block text-gray-700 font-medium mb-2">
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
                <label className="block text-gray-700 font-medium mb-2">
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
                <label className="block text-gray-700 font-medium mb-2">
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
                <label className="block text-gray-700 font-medium mb-2">
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
                <label className="block text-gray-700 font-medium mb-2">
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
                <label className="block text-gray-700 font-medium mb-2">
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
              <label className="block text-gray-700 font-medium mb-2">
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
                <label className="block text-gray-700 font-medium">
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
                  <div key={index} className="relative p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-3">
                        <label className="block text-sm text-gray-600 mb-1">유형</label>
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
                        <label className="block text-sm text-gray-600 mb-1">시간</label>
                        <input
                          type="time"
                          value={item.time}
                          onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <label className="block text-sm text-gray-600 mb-1">장소</label>
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
              <p className="text-sm text-gray-500 mt-2">
                * 최소 1개 이상의 동선 항목이 필요합니다
              </p>
            </div>

            {/* Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-gray-700 font-medium">
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
                        <h4 className="text-lg font-bold text-gray-900">
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
                          <label className="block text-sm text-gray-700 font-medium mb-1">
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
                          <label className="block text-sm text-gray-700 font-medium mb-1">
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
                        <label className="block text-sm text-gray-700 font-medium mb-1">
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
                          <label className="block text-sm text-gray-700 font-medium">
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
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500">코스가 없습니다. 코스를 추가해주세요.</p>
                </div>
              )}
            </div>

            {/* 입금 정보 */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-6 w-6 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">입금 정보</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
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
                  <label className="block text-gray-700 font-medium mb-2">
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
                  <label className="block text-gray-700 font-medium mb-2">
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
                  <label className="block text-gray-700 font-medium mb-2">
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
                  <label className="block text-gray-700 font-medium mb-2">
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
                  <strong>안내:</strong> 참석자들은 산행 신청 후 이 입금 정보를 확인할 수 있습니다. 
                  정확한 정보를 입력해주세요.
                </p>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium text-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
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
          {events.map((event) => (
            <div key={event.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex flex-wrap gap-3 text-gray-600">
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
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{event.description}</p>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">당일 동선</h4>
                <div className="space-y-1 text-sm">
                  {event.schedule.map((item, index) => (
                    <div key={index}>
                      {item.time} {item.type === 'departure' && '출발'}{item.type === 'stop' && '정차'}{item.type === 'return' && '복귀'}{item.type === 'arrival' && '도착'} @ {item.location}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventManagement;


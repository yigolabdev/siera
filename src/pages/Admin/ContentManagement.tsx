import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Eye, Save, X, Calendar, FileText, ScrollText, History, Bell, Pin, Edit2 } from 'lucide-react';
import { usePoems, MonthlyPoem } from '../../contexts/PoemContext';
import { useRules } from '../../contexts/RulesContext';
import { useNotices, Notice } from '../../contexts/NoticeContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

type TabType = 'notice' | 'rules' | 'poem';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState<TabType>('notice');
  const { poems, currentPoem, addPoem, updatePoem, deletePoem } = usePoems();
  const { rulesData, updateRules, addAmendment } = useRules();
  const { notices, addNotice, updateNotice, deleteNotice, togglePin } = useNotices();
  
  // 시 관리 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingPoem, setEditingPoem] = useState<MonthlyPoem | null>(null);
  const [previewPoem, setPreviewPoem] = useState<MonthlyPoem | null>(null);
  
  const [poemFormData, setPoemFormData] = useState({
    title: '',
    author: '',
    content: '',
    month: '',
  });

  // 회칙 관리 상태
  const [localRulesContent, setLocalRulesContent] = useState(rulesData.content);
  const [isAmendmentModalOpen, setIsAmendmentModalOpen] = useState(false);
  const [amendmentForm, setAmendmentForm] = useState({
    version: '',
    date: '',
    description: ''
  });

  // 공지사항 관리 상태
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    isPinned: false,
  });

  // rulesData 변경 시 localRulesContent 동기화
  useEffect(() => {
    setLocalRulesContent(rulesData.content);
  }, [rulesData.content]);

  // 시 관리 함수들
  const handleOpenPoemModal = (poem?: MonthlyPoem) => {
    if (poem) {
      setEditingPoem(poem);
      setPoemFormData({
        title: poem.title,
        author: poem.author,
        content: poem.content,
        month: poem.month,
      });
    } else {
      setEditingPoem(null);
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      setPoemFormData({
        title: '',
        author: '',
        content: '',
        month: currentMonth,
      });
    }
    setIsModalOpen(true);
  };

  const handleClosePoemModal = () => {
    setIsModalOpen(false);
    setEditingPoem(null);
    setPoemFormData({
      title: '',
      author: '',
      content: '',
      month: '',
    });
  };

  const handleSavePoem = () => {
    if (!poemFormData.title || !poemFormData.author || !poemFormData.content || !poemFormData.month) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (editingPoem) {
      updatePoem(editingPoem.id, poemFormData);
      alert('시가 수정되었습니다.');
    } else {
      addPoem(poemFormData);
      alert('시가 등록되었습니다.');
    }
    handleClosePoemModal();
  };

  const handleDeletePoem = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deletePoem(id);
      alert('시가 삭제되었습니다.');
    }
  };

  const handlePreview = (poem: MonthlyPoem) => {
    setPreviewPoem(poem);
    setIsPreviewModalOpen(true);
  };

  const sortedPoems = [...poems].sort((a, b) => b.month.localeCompare(a.month));

  // 공지사항 관리 함수들
  const openNoticeModal = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setNoticeForm({
        title: notice.title,
        content: notice.content,
        isPinned: notice.isPinned,
      });
    } else {
      setEditingNotice(null);
      setNoticeForm({
        title: '',
        content: '',
        isPinned: false,
      });
    }
    setShowNoticeModal(true);
  };

  const handleSaveNotice = () => {
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    
    if (editingNotice) {
      updateNotice(editingNotice.id, noticeForm);
      alert('공지사항이 수정되었습니다.');
    } else {
      addNotice(noticeForm);
      alert('공지사항이 등록되었습니다.');
    }
    
    setShowNoticeModal(false);
    setEditingNotice(null);
    setNoticeForm({ title: '', content: '', isPinned: false });
  };

  const handleDeleteNotice = (noticeId: number) => {
    if (!confirm('이 공지사항을 삭제하시겠습니까?')) return;
    deleteNotice(noticeId);
    alert('공지사항이 삭제되었습니다.');
  };

  const pinnedNotices = notices.filter(n => n.isPinned);
  const regularNotices = notices.filter(n => !n.isPinned);

  // 회칙 저장 핸들러 (개정판 생성)
  const handleSaveRules = () => {
    setIsAmendmentModalOpen(true);
  };

  // 개정판 저장
  const handleSaveAmendment = () => {
    if (!amendmentForm.version || !amendmentForm.date || !amendmentForm.description) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 회칙 업데이트
    updateRules(localRulesContent, amendmentForm.version, amendmentForm.date);
    
    // 개정 이력 추가
    addAmendment({
      version: amendmentForm.version,
      date: amendmentForm.date,
      description: amendmentForm.description
    });

    alert('회칙이 저장되었습니다.');
    setIsAmendmentModalOpen(false);
    setAmendmentForm({ version: '', date: '', description: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('notice')}
          className={`px-6 py-3 font-bold text-lg transition-all relative ${
            activeTab === 'notice'
              ? 'text-primary-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Bell className="w-5 h-5 inline-block mr-2" />
          공지사항 관리
          {activeTab === 'notice' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-6 py-3 font-bold text-lg transition-all relative ${
            activeTab === 'rules'
              ? 'text-primary-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-5 h-5 inline-block mr-2" />
          회칙 관리
          {activeTab === 'rules' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('poem')}
          className={`px-6 py-3 font-bold text-lg transition-all relative ${
            activeTab === 'poem'
              ? 'text-primary-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ScrollText className="w-5 h-5 inline-block mr-2" />
          이달의 시 등록
          {activeTab === 'poem' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t"></div>
          )}
        </button>
      </div>

      {/* 공지사항 관리 탭 */}
      {activeTab === 'notice' && (
        <div className="space-y-6">
          {/* Header with Action Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">공지사항 관리</h2>
              <p className="text-slate-600 mt-1">회원들에게 공지할 내용을 관리합니다.</p>
            </div>
            <button
              onClick={() => openNoticeModal()}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              새 공지사항 작성
            </button>
          </div>

          {/* 고정된 공지 */}
          {pinnedNotices.length > 0 && (
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Pin className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-slate-900">중요 공지 (고정됨)</h3>
              </div>
              <div className="space-y-4">
                {pinnedNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-5 bg-red-50 border-2 border-red-200 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="danger">필독</Badge>
                          <h4 className="text-xl font-bold text-slate-900">{notice.title}</h4>
                        </div>
                        <p className="text-slate-700">{notice.content}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <span className="text-sm text-slate-500 mr-2">{notice.date}</span>
                        <button
                          onClick={() => togglePin(notice.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="고정 해제"
                        >
                          <Pin className="w-5 h-5 fill-current" />
                        </button>
                        <button
                          onClick={() => openNoticeModal(notice)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 일반 공지 */}
          <Card>
            <h3 className="text-xl font-bold text-slate-900 mb-6">일반 공지</h3>
            {regularNotices.length > 0 ? (
              <div className="space-y-4">
                {regularNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-5 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{notice.title}</h4>
                        <p className="text-slate-700 mb-3">{notice.content}</p>
                        <span className="text-sm text-slate-500">{notice.date}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <button
                          onClick={() => togglePin(notice.id)}
                          className="p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600 rounded-lg transition-colors"
                          title="고정"
                        >
                          <Pin className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openNoticeModal(notice)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>등록된 일반 공지가 없습니다.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* 회칙 관리 탭 */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* 현재 버전 정보 */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">클럽 회칙</h2>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="primary">버전 {rulesData.version}</Badge>
                  <span className="text-sm text-slate-600">시행일: {rulesData.effectiveDate}</span>
                </div>
              </div>
              <button
                onClick={handleSaveRules}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                개정판 저장
              </button>
            </div>

            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  회칙 내용
                </label>
                <textarea
                  value={localRulesContent}
                  onChange={(e) => setLocalRulesContent(e.target.value)}
                  rows={25}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-sans text-sm"
                  placeholder="클럽 회칙을 입력하세요..."
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>💡 안내:</strong> 작성한 회칙은 '시애라 안내' 페이지의 회칙 탭에 표시됩니다. 
                  개정 시에는 버전 정보와 개정 사유를 함께 입력해야 합니다.
                </p>
              </div>
            </div>
          </Card>

          {/* 개정 이력 */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <History className="w-6 h-6 text-slate-700" />
              <h3 className="text-xl font-bold text-slate-900">개정 이력</h3>
            </div>

            <div className="space-y-3">
              {[...rulesData.amendments].reverse().map((amendment, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="default">버전 {amendment.version}</Badge>
                        <span className="text-sm text-slate-600">{amendment.date}</span>
                      </div>
                      <p className="text-slate-700">{amendment.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 이달의 시 등록 탭 */}
      {activeTab === 'poem' && (
        <>
          {/* Header with Action Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">이달의 시 관리</h2>
              <p className="text-slate-600 mt-1">매달 산행 안내서에 실릴 시를 관리합니다.</p>
            </div>
            <button
              onClick={() => handleOpenPoemModal()}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              새 시 등록
            </button>
          </div>

          {/* 현재 시 */}
          {currentPoem && (
            <Card className="mb-8 bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-200">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-primary-600" />
                <h3 className="text-2xl font-bold text-slate-900">현재 이달의 시</h3>
                <Badge variant="primary">현재</Badge>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-primary-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">{currentPoem.title}</h4>
                    <p className="text-lg text-slate-600 italic">- {currentPoem.author}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500">{currentPoem.month}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(currentPoem)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="미리보기"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleOpenPoemModal(currentPoem)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="수정"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {currentPoem.content}
                  </pre>
                </div>
              </div>
            </Card>
          )}

          {/* 전체 시 목록 */}
          <Card>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">전체 시 목록</h3>
            
            {sortedPoems.length > 0 ? (
              <div className="space-y-4">
                {sortedPoems.map((poem) => {
                  const isCurrent = currentPoem?.id === poem.id;
                  
                  return (
                    <div
                      key={poem.id}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        isCurrent
                          ? 'bg-primary-50 border-primary-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-bold text-slate-900">{poem.title}</h4>
                            {isCurrent && <Badge variant="primary">현재</Badge>}
                            <Badge variant="default">{poem.month}</Badge>
                          </div>
                          <p className="text-slate-600 italic mb-2">- {poem.author}</p>
                          <p className="text-sm text-slate-500 line-clamp-2">{poem.content}</p>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handlePreview(poem)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="미리보기"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenPoemModal(poem)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="수정"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeletePoem(poem.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>등록된 시가 없습니다.</p>
              </div>
            )}
          </Card>
        </>
      )}

      {/* 등록/수정 모달 */}
      {isModalOpen && (
        <Modal onClose={handleClosePoemModal} maxWidth="max-w-3xl">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingPoem ? '시 수정' : '새 시 등록'}
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={poemFormData.title}
                    onChange={(e) => setPoemFormData({ ...poemFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="시 제목"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    작가 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={poemFormData.author}
                    onChange={(e) => setPoemFormData({ ...poemFormData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="작가명"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  월 <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={poemFormData.month}
                  onChange={(e) => setPoemFormData({ ...poemFormData, month: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  * 해당 월의 산행 안내서에 표시됩니다
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={poemFormData.content}
                  onChange={(e) => setPoemFormData({ ...poemFormData, content: e.target.value })}
                  rows={15}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-sans"
                  placeholder="시 내용을 입력하세요..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  * 엔터키로 줄바꿈이 가능합니다
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSavePoem}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {editingPoem ? '수정' : '등록'}
              </button>
              <button
                onClick={handleClosePoemModal}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                취소
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 미리보기 모달 */}
      {isPreviewModalOpen && previewPoem && (
        <Modal onClose={() => setIsPreviewModalOpen(false)} maxWidth="max-w-2xl">
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-primary-600 mb-2">
                {previewPoem.title}
              </h2>
              <p className="text-lg text-slate-600 italic">- {previewPoem.author}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">{previewPoem.month}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-8 border border-sky-200">
              <pre className="text-base text-slate-700 whitespace-pre-wrap font-sans leading-relaxed text-center">
                {previewPoem.content}
              </pre>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 개정판 저장 모달 */}
      {isAmendmentModalOpen && (
        <Modal onClose={() => setIsAmendmentModalOpen(false)} maxWidth="max-w-2xl">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">회칙 개정판 저장</h2>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    버전 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={amendmentForm.version}
                    onChange={(e) => setAmendmentForm({ ...amendmentForm, version: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="예: 2026.01.15"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    * YYYY.MM.DD 형식 권장
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    시행일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={amendmentForm.date}
                    onChange={(e) => setAmendmentForm({ ...amendmentForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="예: 2026년 1월 15일"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  개정 사유 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={amendmentForm.description}
                  onChange={(e) => setAmendmentForm({ ...amendmentForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="예: 회원 자격 요건 변경 (제4조 개정)"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  <strong>⚠️ 주의:</strong> 개정판 저장 후에는 이전 버전으로 되돌릴 수 없습니다. 
                  반드시 변경 내용을 확인한 후 저장하세요.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSaveAmendment}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                개정판 저장
              </button>
              <button
                onClick={() => setIsAmendmentModalOpen(false)}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                취소
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 공지사항 작성/수정 모달 */}
      {showNoticeModal && (
        <Modal
          onClose={() => {
            setShowNoticeModal(false);
            setEditingNotice(null);
            setNoticeForm({ title: '', content: '', isPinned: false });
          }}
          maxWidth="max-w-3xl"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingNotice ? '공지사항 수정' : '새 공지사항 작성'}
            </h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="공지사항 제목을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={noticeForm.isPinned}
                  onChange={(e) => setNoticeForm({ ...noticeForm, isPinned: e.target.checked })}
                  className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isPinned" className="flex items-center gap-2 cursor-pointer">
                  <Pin className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    중요 공지로 상단에 고정
                  </span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNoticeModal(false);
                  setEditingNotice(null);
                  setNoticeForm({ title: '', content: '', isPinned: false });
                }}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                취소
              </button>
              <button
                onClick={handleSaveNotice}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {editingNotice ? '수정' : '등록'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContentManagement;

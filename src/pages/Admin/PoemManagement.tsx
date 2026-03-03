import { useState, useMemo } from 'react';
import { BookOpen, Plus, Edit, Trash2, Eye, Save, X, Calendar, FileText } from 'lucide-react';
import { usePoems, Poem } from '../../contexts/PoemContext';
import { usePosts } from '../../contexts/PostContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const PoemManagement = () => {
  const { poems, currentPoem, addPoem, updatePoem, deletePoem } = usePoems();
  const { posts } = usePosts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSelectPostModalOpen, setIsSelectPostModalOpen] = useState(false);
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null);
  const [previewPoem, setPreviewPoem] = useState<Poem | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    month: '',
  });

  // 관악아(시) 게시글만 필터링
  const gwanakPosts = useMemo(() => {
    return posts
      .filter(post => post.category === 'poem')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts]);

  const handleOpenModal = (poem?: Poem) => {
    if (poem) {
      setEditingPoem(poem);
      setFormData({
        title: poem.title,
        author: poem.author,
        content: poem.content,
        month: poem.month,
      });
    } else {
      setEditingPoem(null);
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      setFormData({
        title: '',
        author: '',
        content: '',
        month: currentMonth,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPoem(null);
    setFormData({
      title: '',
      author: '',
      content: '',
      month: '',
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.author || !formData.content || !formData.month) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      if (editingPoem) {
        await updatePoem(editingPoem.id, formData);
        alert('시가 수정되었습니다.');
      } else {
        await addPoem(formData);
        alert('시가 등록되었습니다.');
      }
      handleCloseModal();
    } catch (error) {
      console.error('시 저장 실패:', error);
      alert('시 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleSelectPost = (post: any) => {
    setFormData({
      title: post.title,
      author: post.author,
      content: post.content,
      month: formData.month, // 월은 유지
    });
    setIsSelectPostModalOpen(false);
  };

  const handleOpenSelectPostModal = () => {
    setIsSelectPostModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await deletePoem(id);
        alert('시가 삭제되었습니다.');
      } catch (error) {
        console.error('시 삭제 실패:', error);
        alert('시 삭제에 실패했습니다.');
      }
    }
  };

  const handlePreview = (poem: Poem) => {
    setPreviewPoem(poem);
    setIsPreviewModalOpen(true);
  };

  const sortedPoems = [...poems].sort((a, b) => b.month.localeCompare(a.month));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          새 시 등록
        </button>
      </div>

      {/* 현재 시 */}
      {currentPoem && (
        <Card className="mb-8 bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-slate-900">현재 이달의 시</h2>
            <Badge variant="primary">현재</Badge>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-primary-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{currentPoem.title}</h3>
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
                  onClick={() => handleOpenModal(currentPoem)}
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
        <h2 className="text-2xl font-bold text-slate-900 mb-6">전체 시 목록</h2>
        
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
                        <h3 className="text-xl font-bold text-slate-900">{poem.title}</h3>
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
                        onClick={() => handleOpenModal(poem)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(poem.id)}
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

      {/* 등록/수정 모달 */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal} maxWidth="max-w-3xl">
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
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
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
                
                {/* 게시판에서 선택 버튼 */}
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={handleOpenSelectPostModal}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    게시판에서 선택하기
                  </button>
                  <p className="text-xs text-slate-500 mt-1">
                    * 관악아 게시판에 등록된 시를 선택할 수 있습니다
                  </p>
                </div>

                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {editingPoem ? '수정' : '등록'}
              </button>
              <button
                onClick={handleCloseModal}
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

      {/* 게시판 선택 모달 */}
      {isSelectPostModalOpen && (
        <Modal onClose={() => setIsSelectPostModalOpen(false)} maxWidth="max-w-4xl">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              관악아 게시글 선택
            </h2>
            
            {gwanakPosts.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {gwanakPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => handleSelectPost(post)}
                    className="w-full p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg transition-all text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{post.title}</h3>
                      <Badge variant="default">
                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">작성자: {post.author}</p>
                    <p className="text-sm text-slate-500 line-clamp-3">{post.content}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>관악아 게시판에 등록된 시가 없습니다.</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsSelectPostModalOpen(false)}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PoemManagement;

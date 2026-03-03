import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextEnhanced';
import { usePosts } from '../contexts/PostContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const BoardWrite = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addPost } = usePosts();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') as 'general' | 'poem' || 'general';
  const fromTab = searchParams.get('from') || 'general';

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // 목록으로 돌아가기
  const handleGoBack = () => {
    navigate(`/home/board?tab=${fromTab}`);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsSaving(true);
    try {
      await addPost({
        category: category,
        title: formData.title,
        author: user.name,
        authorId: user.id,
        date: new Date().toISOString().split('T')[0],
        content: formData.content,
      });

      alert('게시글이 등록되었습니다!');
      handleGoBack();
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryName = () => {
    switch (category) {
      case 'poem':
        return '시(詩)';
      case 'general':
      default:
        return '자유게시판';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          취소
        </button>

        {/* 작성 폼 */}
        <Card>
          <div className="mb-6 pb-6 border-b border-slate-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">새 글 작성</h1>
            <Badge variant={category === 'poem' ? 'primary' : 'info'}>
              {getCategoryName()}
            </Badge>
          </div>

          <div className="space-y-6">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={category === 'poem' ? '시 제목을 입력하세요' : '제목을 입력하세요'}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent text-lg"
                maxLength={100}
              />
              <p className="text-sm text-slate-500 mt-2">
                {formData.title.length}/100
              </p>
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={
                  category === 'poem'
                    ? '시를 작성해주세요...\n\n감동과 여운이 남는 작품을 기대합니다.'
                    : '내용을 입력하세요...\n\n회원들과 자유롭게 소통해보세요.'
                }
                rows={category === 'poem' ? 20 : 15}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none text-base leading-relaxed"
                maxLength={5000}
              />
              <p className="text-sm text-slate-500 mt-2">
                {formData.content.length}/5000
              </p>
            </div>

            {/* 안내 */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-900 font-medium mb-2">작성 가이드</p>
              <ul className="text-sm text-blue-800 space-y-1">
                {category === 'poem' ? (
                  <>
                    <li>• 자작시 또는 좋아하는 시를 공유해주세요</li>
                    <li>• 산행과 관련된 감상이나 자연에 대한 시를 환영합니다</li>
                    <li>• 타인의 저작물인 경우 출처를 명시해주세요</li>
                  </>
                ) : (
                  <>
                    <li>• 산행 후기, 등산 팁, 장비 리뷰 등 자유롭게 작성하세요</li>
                    <li>• 다른 회원들을 존중하는 언어를 사용해주세요</li>
                    <li>• 개인정보나 민감한 정보는 공유하지 마세요</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleGoBack}
              className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving || !formData.title.trim() || !formData.content.trim()}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  등록 중...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  등록
                </>
              )}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BoardWrite;

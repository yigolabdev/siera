import { Calendar, MapPin, Users, Award, Mountain, ChevronRight, Image as ImageIcon, MessageSquare, Plus, Edit2, Trash2, X, CalendarX } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextEnhanced';
import { useHikingHistory } from '../contexts/HikingHistoryContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const HikingHistory = () => {
  const { user, isAdmin } = useAuth();
  const { history, isLoading, getHistoryByYear, addComment, updateComment, deleteComment, getCommentsByHikeId } = useHikingHistory();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedHikeId, setSelectedHikeId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  
  // 연도 목록 생성
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(history.map(h => h.year)));
    return uniqueYears.sort((a, b) => parseInt(b) - parseInt(a));
  }, [history]);

  // 선택된 연도의 산행 이력
  const yearHistory = useMemo(() => getHistoryByYear(selectedYear), [selectedYear, history]);
  
  // 월별로 그룹화
  const groupedByMonth = useMemo(() => {
    const grouped: Record<string, typeof yearHistory> = {};
    yearHistory.forEach(hike => {
      const key = `${hike.year}-${hike.month}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(hike);
    });
    return grouped;
  }, [yearHistory]);

  const months = Object.keys(groupedByMonth).sort((a, b) => b.localeCompare(a));

  // 후기 추가
  const handleAddComment = async () => {
    if (!selectedHikeId || !newComment.trim() || !user) return;
    
    try {
      await addComment(selectedHikeId, newComment.trim(), user.id, user.name);
      setNewComment('');
      setShowCommentModal(false);
      setSelectedHikeId(null);
    } catch (error) {
      alert('후기 작성에 실패했습니다.');
    }
  };
  
  // 후기 수정
  const handleEditComment = async (commentId: string) => {
    if (!editCommentText.trim()) return;
    
    try {
      await updateComment(commentId, editCommentText.trim());
      setEditingCommentId(null);
      setEditCommentText('');
    } catch (error) {
      alert('후기 수정에 실패했습니다.');
    }
  };
  
  // 후기 삭제
  const handleDeleteComment = async (hikeId: string, commentId: string) => {
    if (!confirm('이 후기를 삭제하시겠습니까?')) return;
    
    try {
      await deleteComment(hikeId, commentId);
    } catch (error) {
      alert('후기 삭제에 실패했습니다.');
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case '하': return <Badge variant="success">하</Badge>;
      case '중하': return <Badge variant="info">중하</Badge>;
      case '중': return <Badge variant="warning">중</Badge>;
      case '중상': return <Badge variant="warning">중상</Badge>;
      case '상': return <Badge variant="danger">상</Badge>;
      default: return <Badge>{difficulty}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">산행 이력을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">산행 이력</h1>
        <p className="text-slate-600">시애라클럽의 산행 기록을 확인하세요.</p>
      </div>

      {/* 통계 */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Mountain className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-slate-600 text-sm">총 산행</p>
                <p className="text-2xl font-bold">{history.length}회</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="text-slate-600 text-sm">총 참가자</p>
                <p className="text-2xl font-bold">
                  {history.reduce((sum, h) => sum + h.participants, 0)}명
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-amber-600" />
              <div>
                <p className="text-slate-600 text-sm">총 사진</p>
                <p className="text-2xl font-bold">
                  {history.reduce((sum, h) => sum + h.photoCount, 0)}장
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-slate-600 text-sm">평균 참가</p>
                <p className="text-2xl font-bold">
                  {Math.round(history.reduce((sum, h) => sum + h.participants, 0) / history.length)}명
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 연도 선택 */}
      {years.length > 0 && (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedYear === year
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {year}년 ({getHistoryByYear(year).length}회)
            </button>
          ))}
        </div>
      )}

      {/* 산행 이력 */}
      {yearHistory.length === 0 ? (
        <Card className="p-12 text-center">
          <Mountain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {years.length === 0 ? '아직 등록된 산행 이력이 없습니다' : `${selectedYear}년 산행 이력이 없습니다`}
          </h3>
          <p className="text-slate-600">
            {years.length === 0 ? '첫 번째 산행을 등록해보세요.' : '다른 연도를 선택해보세요.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {months.map((monthKey) => {
            const [year, month] = monthKey.split('-');
            const monthHikes = groupedByMonth[monthKey];
            
            return (
              <div key={monthKey}>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  {parseInt(month)}월
                </h2>
                
                <div className="space-y-4">
                  {monthHikes.map((hike) => {
                    const comments = getCommentsByHikeId(hike.id);
                    
                    return (
                      <Card key={hike.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          {/* 이미지 */}
                          <div className="md:w-1/3 relative aspect-video md:aspect-square bg-slate-200">
                            {hike.imageUrl ? (
                              <img
                                src={hike.imageUrl}
                                alt={hike.mountain}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Mountain className="w-16 h-16" />
                              </div>
                            )}
                            {hike.isSpecial && (
                              <div className="absolute top-4 left-4">
                                <Badge variant="danger">특별산행</Badge>
                              </div>
                            )}
                          </div>
                          
                          {/* 내용 */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-2xl font-bold text-slate-900">{hike.mountain}</h3>
                                  {getDifficultyBadge(hike.difficulty)}
                                </div>
                                <p className="text-slate-600 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {hike.location}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-slate-600">날짜</p>
                                <p className="font-medium">{hike.date}</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-600">참가자</p>
                                <p className="font-medium">{hike.participants}명</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-600">거리</p>
                                <p className="font-medium">{hike.distance}</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-600">소요시간</p>
                                <p className="font-medium">{hike.duration}</p>
                              </div>
                            </div>
                            
                            {hike.summary && (
                              <p className="text-slate-700 mb-4">{hike.summary}</p>
                            )}
                            
                            {/* 후기 섹션 */}
                            <div className="border-t pt-4 mt-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                  <MessageSquare className="w-5 h-5" />
                                  후기 ({comments.length})
                                </h4>
                                {user?.isApproved && (
                                  <button
                                    onClick={() => {
                                      setSelectedHikeId(hike.id);
                                      setShowCommentModal(true);
                                    }}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    후기 작성
                                  </button>
                                )}
                              </div>
                              
                              {comments.length > 0 && (
                                <div className="space-y-3">
                                  {comments.map((comment) => (
                                    <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                                      {editingCommentId === comment.id ? (
                                        <div className="space-y-2">
                                          <textarea
                                            value={editCommentText}
                                            onChange={(e) => setEditCommentText(e.target.value)}
                                            className="w-full p-2 border rounded-lg resize-none"
                                            rows={3}
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => handleEditComment(comment.id)}
                                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                            >
                                              저장
                                            </button>
                                            <button
                                              onClick={() => {
                                                setEditingCommentId(null);
                                                setEditCommentText('');
                                              }}
                                              className="px-3 py-1 border rounded text-sm hover:bg-slate-50"
                                            >
                                              취소
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="flex items-start justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                              <p className="font-medium text-slate-900">{comment.authorName}</p>
                                              <p className="text-xs text-slate-500">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                              </p>
                                            </div>
                                            {(user?.id === comment.authorId || isAdmin) && (
                                              <div className="flex gap-1">
                                                <button
                                                  onClick={() => {
                                                    setEditingCommentId(comment.id);
                                                    setEditCommentText(comment.content);
                                                  }}
                                                  className="p-1 text-slate-400 hover:text-slate-600"
                                                >
                                                  <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                  onClick={() => handleDeleteComment(hike.id, comment.id)}
                                                  className="p-1 text-slate-400 hover:text-red-600"
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                          <p className="text-slate-700 text-sm">{comment.content}</p>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 후기 작성 모달 */}
      <Modal
        onClose={() => {
          setShowCommentModal(false);
          setSelectedHikeId(null);
          setNewComment('');
        }}
        title="산행 후기 작성"
      >
        <div className="p-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="산행 후기를 작성해주세요..."
            className="w-full p-4 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={6}
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setShowCommentModal(false);
                setSelectedHikeId(null);
                setNewComment('');
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              취소
            </button>
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              작성 완료
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HikingHistory;

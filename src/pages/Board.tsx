import { Bell, MessageSquare, ThumbsUp, Eye, Search, Plus, Pin, ChevronRight, Upload, Download, FileText, FileSpreadsheet, X, Trash2, FolderOpen } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextEnhanced';
import { useNotices } from '../contexts/NoticeContext';
import { usePosts } from '../contexts/PostContext';
import { getDocuments, setDocument, deleteDocument } from '../lib/firebase/firestore';
import { uploadFile, deleteFile } from '../lib/firebase/storage';
import { SharedFile } from '../types';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';

const ALLOWED_EXTENSIONS = ['.pdf', '.xlsx', '.xls', '.csv'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <FileText className="w-5 h-5 text-red-500" />;
  if (ext === 'xlsx' || ext === 'xls') return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
  return <FileSpreadsheet className="w-5 h-5 text-blue-500" />;
};

const Board = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAdmin } = useAuth();
  const { notices } = useNotices();
  const { posts, isLoading } = usePosts();

  const tabFromUrl = searchParams.get('tab') as 'notice' | 'general' | 'poem' | 'files' | null;
  const [activeTab, setActiveTab] = useState<'notice' | 'general' | 'poem' | 'files'>(tabFromUrl || 'notice');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // 자료실 상태
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile_selected, setUploadFileSelected] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (tabFromUrl && ['notice', 'general', 'poem', 'files'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl as typeof activeTab);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab: 'notice' | 'general' | 'poem' | 'files') => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setCurrentPage(1);
    setSearchTerm('');
  };

  // 자료실 파일 로드
  const loadSharedFiles = useCallback(async () => {
    setFilesLoading(true);
    try {
      const result = await getDocuments<SharedFile>('sharedFiles');
      if (result.success && result.data) {
        const sorted = result.data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSharedFiles(sorted);
      }
    } catch (error) {
      console.error('자료실 파일 로드 실패:', error);
    } finally {
      setFilesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'files') {
      loadSharedFiles();
    }
  }, [activeTab, loadSharedFiles]);

  // 파일 업로드 처리
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(`파일 크기가 10MB를 초과합니다: ${file.name} (${formatFileSize(file.size)})`);
      return;
    }
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      alert(`허용되지 않은 파일 형식입니다: ${file.name}\n(허용: PDF, Excel, CSV)`);
      return;
    }

    setUploadFileSelected(file);
    e.target.value = '';
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile_selected || !user) return;
    if (!uploadDescription.trim()) {
      alert('파일 설명을 입력해주세요.');
      return;
    }

    setIsUploading(true);
    try {
      const fileId = `file_${Date.now()}`;
      const storagePath = `posts/${fileId}/${uploadFile_selected.name}`;

      const uploadResult = await uploadFile(storagePath, uploadFile_selected, {
        contentType: uploadFile_selected.type,
      });

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error('파일 업로드 실패');
      }

      const newFile: SharedFile = {
        id: fileId,
        fileName: uploadFile_selected.name,
        storagePath,
        downloadURL: uploadResult.url,
        fileSize: uploadFile_selected.size,
        fileType: uploadFile_selected.type,
        description: uploadDescription.trim(),
        uploadedBy: user.name,
        uploadedById: user.id,
        createdAt: new Date().toISOString(),
      };

      const result = await setDocument('sharedFiles', fileId, newFile);
      if (result.success) {
        setSharedFiles(prev => [newFile, ...prev]);
        setShowUploadModal(false);
        setUploadFileSelected(null);
        setUploadDescription('');
        alert('파일이 업로드되었습니다.');
      } else {
        await deleteFile(storagePath).catch(() => {});
        throw new Error('Firestore 저장 실패');
      }
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (file: SharedFile) => {
    if (!window.confirm(`"${file.fileName}" 파일을 삭제하시겠습니까?`)) return;

    try {
      await deleteFile(file.storagePath).catch(() => {});
      const result = await deleteDocument('sharedFiles', file.id);
      if (result.success) {
        setSharedFiles(prev => prev.filter(f => f.id !== file.id));
      } else {
        throw new Error('삭제 실패');
      }
    } catch (error) {
      console.error('파일 삭제 실패:', error);
      alert('파일 삭제에 실패했습니다.');
    }
  };

  const pinnedNotices = notices.filter(n => n.isPinned);
  const regularNotices = notices.filter(n => !n.isPinned);

  // 자유게시판: 시(poem) 카테고리 제외, 시 탭: poem만
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'notice' || activeTab === 'files') return false;
    if (activeTab === 'general') {
      // 자유게시판에서는 시(poem) 제외
      if (post.category === 'poem') return false;
    }
    if (activeTab === 'poem') {
      if (post.category !== 'poem') return false;
    }
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // 공지사항 검색
  const filteredNotices = useMemo(() => {
    if (!searchTerm) return { pinned: pinnedNotices, regular: regularNotices };
    const term = searchTerm.toLowerCase();
    return {
      pinned: pinnedNotices.filter(n => n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term)),
      regular: regularNotices.filter(n => n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term)),
    };
  }, [pinnedNotices, regularNotices, searchTerm]);

  // 자료실 검색
  const filteredSharedFiles = useMemo(() => {
    if (!searchTerm) return sharedFiles;
    const term = searchTerm.toLowerCase();
    return sharedFiles.filter(f =>
      f.fileName.toLowerCase().includes(term) ||
      f.description.toLowerCase().includes(term)
    );
  }, [sharedFiles, searchTerm]);

  // 페이지네이션
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(start, start + itemsPerPage);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const handlePostClick = (postId: string) => {
    navigate(`/home/board/post/${postId}?from=${activeTab}`);
  };

  const handleNoticeClick = (noticeId: string) => {
    navigate(`/home/board/notice/${noticeId}?from=notice`);
  };

  const handleWriteClick = () => {
    navigate(`/home/board/write?category=${activeTab === 'poem' ? 'poem' : 'general'}&from=${activeTab}`);
  };

  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) {
      return '오늘';
    }
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[1]}.${parts[2]}`;
    }
    return dateStr;
  };

  const formatDateTime = (isoStr: string) => {
    const date = new Date(isoStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  // 탭별 카운트
  const generalCount = posts.filter(p => p.category !== 'poem').length;
  const poemCount = posts.filter(p => p.category === 'poem').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 탭 네비게이션 */}
      <Tabs
        tabs={[
          { key: 'notice', label: '공지사항', count: notices.length },
          { key: 'general', label: '자유게시판', count: generalCount },
          { key: 'poem', label: '시(詩)', count: poemCount },
          { key: 'files', label: '자료실', count: sharedFiles.length },
        ]}
        activeTab={activeTab}
        onChange={(key) => handleTabChange(key as typeof activeTab)}
        className="mb-6"
      />

      {/* 검색 + 글쓰기/업로드 */}
      <div className="mb-5 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder={activeTab === 'files' ? '파일명, 설명 검색...' : '제목, 내용 검색...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
        {user && activeTab !== 'notice' && activeTab !== 'files' && (
          <button
            onClick={handleWriteClick}
            className="px-5 py-3 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            글쓰기
          </button>
        )}
        {isAdmin && activeTab === 'files' && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-3 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Upload className="w-5 h-5" />
            파일 업로드
          </button>
        )}
      </div>

      {/* 로딩 상태 */}
      {(isLoading || (activeTab === 'files' && filesLoading)) ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-3"></div>
            <p className="text-base text-slate-500">
              {activeTab === 'files' ? '파일을 불러오는 중...' : '게시글을 불러오는 중...'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ======================== 공지사항 탭 ======================== */}
          {activeTab === 'notice' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* 테이블 헤더 */}
              <div className="hidden sm:grid sm:grid-cols-[1fr_120px_80px] gap-4 px-6 py-3.5 bg-slate-50 border-b border-slate-200 text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-wider">
                <span>제목</span>
                <span className="text-center">작성일</span>
                <span className="text-center">조회</span>
              </div>

              {/* 필독 공지 */}
              {filteredNotices.pinned.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => handleNoticeClick(notice.id)}
                  className="flex items-center gap-3 px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 bg-red-50/40 hover:bg-red-50 cursor-pointer transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="flex-shrink-0 inline-flex items-center px-2.5 py-1 bg-red-600 text-white text-sm font-bold rounded">필독</span>
                      <Pin className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-red-600 transition-colors">
                        {notice.title}
                      </h3>
                    </div>
                    <span className="sm:hidden text-lg text-slate-400 mt-1.5 block">{formatDate(notice.date)}</span>
                  </div>
                  <span className="hidden sm:block text-lg text-slate-400 w-[120px] text-center flex-shrink-0">
                    {formatDate(notice.date)}
                  </span>
                  <span className="hidden sm:block text-lg text-slate-400 w-[80px] text-center flex-shrink-0">
                    -
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-300 sm:hidden flex-shrink-0" />
                </div>
              ))}

              {/* 일반 공지 */}
              {filteredNotices.regular.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => handleNoticeClick(notice.id)}
                  className="flex items-center gap-3 px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group last:border-b-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="flex-shrink-0 inline-flex items-center px-2.5 py-1 bg-slate-200 text-slate-600 text-sm font-bold rounded">공지</span>
                      <h3 className="text-xl font-medium text-slate-800 truncate group-hover:text-primary-600 transition-colors">
                        {notice.title}
                      </h3>
                    </div>
                    <span className="sm:hidden text-lg text-slate-400 mt-1.5 block">{formatDate(notice.date)}</span>
                  </div>
                  <span className="hidden sm:block text-lg text-slate-400 w-[120px] text-center flex-shrink-0">
                    {formatDate(notice.date)}
                  </span>
                  <span className="hidden sm:block text-lg text-slate-400 w-[80px] text-center flex-shrink-0">
                    -
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-300 sm:hidden flex-shrink-0" />
                </div>
              ))}

              {notices.length === 0 && (
                <div className="py-16 text-center">
                  <Bell className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">등록된 공지사항이 없습니다.</p>
                </div>
              )}

              {filteredNotices.pinned.length === 0 && filteredNotices.regular.length === 0 && notices.length > 0 && (
                <div className="py-16 text-center">
                  <Search className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {/* ======================== 자료실 탭 ======================== */}
          {activeTab === 'files' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* 테이블 헤더 */}
              <div className="hidden sm:grid sm:grid-cols-[auto_1fr_100px_100px_80px] gap-4 px-6 py-3.5 bg-slate-50 border-b border-slate-200 text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-wider">
                <span className="w-10"></span>
                <span>파일명 / 설명</span>
                <span className="text-center">크기</span>
                <span className="text-center">업로드일</span>
                <span className="text-center">다운로드</span>
              </div>

              {filteredSharedFiles.length === 0 ? (
                <div className="py-16 text-center">
                  <FolderOpen className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg mb-1">
                    {searchTerm ? '검색 결과가 없습니다.' : '등록된 파일이 없습니다.'}
                  </p>
                  {!searchTerm && isAdmin && (
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="mt-3 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-base font-semibold hover:bg-primary-700 transition-all inline-flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      파일 업로드
                    </button>
                  )}
                </div>
              ) : (
                filteredSharedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
                  >
                    {/* 데스크톱 */}
                    <div className="hidden sm:grid sm:grid-cols-[auto_1fr_100px_100px_80px] gap-4 px-6 py-4 items-center">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        {getFileIcon(file.fileName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg font-medium text-slate-800 truncate">{file.fileName}</p>
                        <p className="text-sm text-slate-500 truncate">{file.description}</p>
                      </div>
                      <span className="text-base text-slate-400 text-center">{formatFileSize(file.fileSize)}</span>
                      <span className="text-base text-slate-400 text-center">{formatDateTime(file.createdAt)}</span>
                      <div className="flex items-center justify-center gap-1">
                        <a
                          href={file.downloadURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="다운로드"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteFile(file)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 모바일 */}
                    <div className="sm:hidden px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                          {getFileIcon(file.fileName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-medium text-slate-800 truncate">{file.fileName}</p>
                          <p className="text-sm text-slate-500 truncate mb-1.5">{file.description}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span>{formatFileSize(file.fileSize)}</span>
                            <span>·</span>
                            <span>{formatDateTime(file.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={file.downloadURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteFile(file)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {filteredSharedFiles.length > 0 && (
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                  <p className="text-sm text-slate-400 text-center">
                    총 {filteredSharedFiles.length}개의 파일
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ======================== 자유게시판 / 시 탭 ======================== */}
          {(activeTab === 'general' || activeTab === 'poem') && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* 테이블 헤더 */}
              <div className="hidden sm:grid sm:grid-cols-[1fr_110px_100px_70px_70px_70px] gap-3 px-6 py-3.5 bg-slate-50 border-b border-slate-200 text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-wider">
                <span>제목</span>
                <span className="text-center">작성자</span>
                <span className="text-center">작성일</span>
                <span className="text-center">조회</span>
                <span className="text-center">댓글</span>
                <span className="text-center">좋아요</span>
              </div>

              {paginatedPosts.length === 0 ? (
                <div className="py-16 text-center">
                  <MessageSquare className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg mb-1">
                    {searchTerm ? '검색 결과가 없습니다.' : '첫 번째 게시글을 작성해보세요!'}
                  </p>
                  {!searchTerm && user && (
                    <button
                      onClick={handleWriteClick}
                      className="mt-3 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-base font-semibold hover:bg-primary-700 transition-all inline-flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      글쓰기
                    </button>
                  )}
                </div>
              ) : (
                paginatedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post.id)}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group last:border-b-0"
                  >
                    {/* 데스크톱 */}
                    <div className="hidden sm:grid sm:grid-cols-[1fr_110px_100px_70px_70px_70px] gap-3 px-6 py-5 items-center">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-medium text-slate-800 truncate group-hover:text-primary-600 transition-colors">
                            {post.title}
                          </h3>
                          {post.comments > 0 && (
                            <span className="text-lg text-primary-600 font-bold flex-shrink-0">[{post.comments}]</span>
                          )}
                        </div>
                      </div>
                      <span className="text-lg text-slate-500 text-center truncate">{post.author}</span>
                      <span className="text-lg text-slate-400 text-center">{formatDate(post.date)}</span>
                      <span className="text-lg text-slate-400 text-center">{post.views}</span>
                      <span className="text-lg text-slate-400 text-center">{post.comments}</span>
                      <div className="flex items-center justify-center gap-1">
                        <ThumbsUp className={`w-5 h-5 ${user && post.likedBy.includes(user.id) ? 'text-primary-600 fill-primary-600' : 'text-slate-400'}`} />
                        <span className={`text-lg ${user && post.likedBy.includes(user.id) ? 'text-primary-600 font-bold' : 'text-slate-400'}`}>
                          {post.likes}
                        </span>
                      </div>
                    </div>

                    {/* 모바일 */}
                    <div className="sm:hidden px-4 py-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-medium text-slate-800 truncate group-hover:text-primary-600 transition-colors">
                              {post.title}
                            </h3>
                            {post.comments > 0 && (
                              <span className="text-lg text-primary-600 font-bold flex-shrink-0">[{post.comments}]</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2.5 text-base text-slate-400">
                            <span className="font-medium text-slate-500">{post.author}</span>
                            <span>·</span>
                            <span>{formatDate(post.date)}</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5">
                              <Eye className="w-4 h-4" /> {post.views}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <ThumbsUp className={`w-4 h-4 ${user && post.likedBy.includes(user.id) ? 'fill-primary-600 text-primary-600' : ''}`} /> {post.likes}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 mt-1 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 페이지네이션 */}
          {(activeTab === 'general' || activeTab === 'poem') && totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2.5 text-lg text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-lg font-medium transition-all ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2.5 text-lg text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}

          {(activeTab === 'general' || activeTab === 'poem') && filteredPosts.length > 0 && (
            <p className="text-center text-base text-slate-400 mt-4">
              총 {filteredPosts.length}개의 게시글
            </p>
          )}
        </>
      )}

      {/* ======================== 파일 업로드 모달 ======================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => !isUploading && setShowUploadModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">파일 업로드</h2>
              <button
                onClick={() => !isUploading && setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 파일 선택 */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  파일 선택 <span className="text-red-500">*</span>
                </label>
                {uploadFile_selected ? (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      {getFileIcon(uploadFile_selected.name)}
                      <span className="text-sm text-slate-700 truncate">{uploadFile_selected.name}</span>
                      <span className="text-xs text-slate-400 shrink-0">({formatFileSize(uploadFile_selected.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadFileSelected(null)}
                      className="text-slate-400 hover:text-red-500 shrink-0 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
                    <input
                      type="file"
                      id="shared-file-upload"
                      accept=".pdf,.xlsx,.xls,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="shared-file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 font-medium">클릭하여 파일 선택</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, Excel, CSV / 최대 10MB</p>
                    </label>
                  </div>
                )}
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  파일 설명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="파일에 대한 간단한 설명을 입력하세요"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  maxLength={100}
                />
                <p className="text-xs text-slate-400 mt-1">{uploadDescription.length}/100</p>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => !isUploading && setShowUploadModal(false)}
                disabled={isUploading}
                className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={isUploading || !uploadFile_selected || !uploadDescription.trim()}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    업로드 중...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    업로드
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;

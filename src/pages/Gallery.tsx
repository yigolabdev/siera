import { useState, useEffect } from 'react';
import { Upload, Heart, Download, X, Image as ImageIcon, Calendar, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play, Pause, Folder, Trash2, Mountain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContextEnhanced';
import { useGallery } from '../contexts/GalleryContext';
import { useEvents } from '../contexts/EventContext';
import { useNavigate } from 'react-router-dom';

interface UploadFile {
  id: string;
  file: File;
  preview: string;
}

const Gallery = () => {
  const { user } = useAuth();
  const { photos, isLoading, toggleLike, uploadPhotos, deletePhoto } = useGallery();
  const { events } = useEvents();
  const navigate = useNavigate();
  
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [zoom, setZoom] = useState(1);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [isSlideshow, setIsSlideshow] = useState(false);
  
  // 업로드 관련 상태
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [galleryTitle, setGalleryTitle] = useState(''); // 갤러리 제목
  const [isDragging, setIsDragging] = useState(false);
  const [selectedEventForUpload, setSelectedEventForUpload] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // 컴포넌트 마운트 확인
  useEffect(() => {
    console.log('✅ Gallery 컴포넌트 마운트됨');
    console.log('👤 현재 로그인 상태:', user ? '로그인됨 (' + user.email + ')' : '로그아웃 상태');
    console.log('📷 사진 개수:', photos.length);
    console.log('🏔️ 산행 개수:', events.length);
  }, []);
  
  // showUploadModal 변경 추적
  useEffect(() => {
    console.log('🔄 showUploadModal 상태 변경됨:', showUploadModal);
  }, [showUploadModal]);
  
  // 산행 목록 (모든 산행 - 최신순)
  const availableEvents = events
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20); // 최근 20개 산행
  
  // 월별 필터 생성
  const months = [
    { id: 'all', name: '전체' },
    ...Array.from(new Set(photos.map(p => `${p.eventYear}-${p.eventMonth}`)))
      .sort((a, b) => b.localeCompare(a))
      .slice(0, 12)
      .map(ym => {
        const [year, month] = ym.split('-');
        return {
          id: ym,
          name: `${year}년 ${parseInt(month)}월`
        };
      })
  ];
  
  // 필터링된 사진 목록
  const filteredPhotos = selectedEvent === 'all'
    ? photos
    : photos.filter(p => `${p.eventYear}-${p.eventMonth}` === selectedEvent);
  
  // 사진을 앨범으로 그룹화 (title + uploadedBy + eventId 기준)
  interface PhotoAlbum {
    id: string;
    title: string;
    eventTitle: string;
    eventId: string;
    coverPhoto: string;
    photoCount: number;
    uploadedBy: string;
    uploadedByName: string;
    uploadedAt: string;
    photos: typeof filteredPhotos;
  }

  const photoAlbums: PhotoAlbum[] = Object.values(
    filteredPhotos.reduce((acc, photo) => {
      const albumKey = `${photo.title || 'untitled'}_${photo.uploadedBy}_${photo.eventId}`;
      
      if (!acc[albumKey]) {
        acc[albumKey] = {
          id: albumKey,
          title: photo.title || '제목 없음',
          eventTitle: photo.eventTitle,
          eventId: photo.eventId,
          coverPhoto: photo.imageUrl,
          photoCount: 0,
          uploadedBy: photo.uploadedBy,
          uploadedByName: photo.uploadedByName,
          uploadedAt: photo.uploadedAt,
          photos: []
        };
      }
      
      acc[albumKey].photos.push(photo);
      acc[albumKey].photoCount = acc[albumKey].photos.length;
      
      return acc;
    }, {} as Record<string, PhotoAlbum>)
  ).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  
  // 각 월별 사진 개수 계산
  const photoCountByMonth: Record<string, number> = {};
  photos.forEach(photo => {
    const key = `${photo.eventYear}-${photo.eventMonth}`;
    photoCountByMonth[key] = (photoCountByMonth[key] || 0) + 1;
  });

  // 앨범 선택 상태
  const [selectedAlbum, setSelectedAlbum] = useState<PhotoAlbum | null>(null);
  const [albumSlideIndex, setAlbumSlideIndex] = useState(0);

  // 업로드 버튼 핸들러 (명확한 함수로 분리)
  const handleOpenUploadModal = () => {
    console.log('🚀 사진 업로드 버튼 클릭됨! [v2.0]');
    console.log('👤 현재 사용자:', user?.email || 'null');
    console.log('📂 현재 showUploadModal 상태:', showUploadModal);
    
    setShowUploadModal(true);
    
    console.log('✅ setShowUploadModal(true) 호출 완료');
  };

  // 슬라이드쇼
  useEffect(() => {
    if (!isSlideshow || selectedImage === null) return;
    
    const timer = setInterval(() => {
      setSelectedImage(prev => 
        prev === null ? 0 : (prev + 1) % filteredPhotos.length
      );
    }, 3000);
    
    return () => clearInterval(timer);
  }, [isSlideshow, selectedImage, filteredPhotos.length]);

  const handleLike = async (photoId: string) => {
    if (!user) return;
    
    await toggleLike(photoId, user.id);
    setLikedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 파일 선택 이벤트 발생');
    console.log('📁 선택된 파일:', e.target.files);
    const files = Array.from(e.target.files || []);
    console.log('📁 파일 배열:', files);
    if (files.length > 0) {
      console.log(`✅ ${files.length}개의 파일 선택됨`);
      processFiles(files);
    } else {
      console.warn('⚠️ 선택된 파일이 없습니다');
    }
    // input value 초기화 (같은 파일을 다시 선택할 수 있도록)
    e.target.value = '';
  };

  const processFiles = (files: File[]) => {
    console.log('🔄 processFiles 시작, 파일 개수:', files.length);
    const newFiles = files.map((file, index) => {
      console.log(`📄 파일 ${index + 1}:`, file.name, file.size, file.type);
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
      };
    });
    
    console.log('✅ processFiles 완료, 추가할 파일:', newFiles.length);
    setUploadFiles(prev => {
      const updated = [...prev, ...newFiles];
      console.log('📋 전체 업로드 파일 목록:', updated.length);
      return updated;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      alert('업로드할 사진을 선택해주세요.');
      return;
    }
    
    if (!selectedEventForUpload) {
      alert('산행을 선택해주세요.');
      return;
    }
    
    if (!galleryTitle.trim()) {
      alert('갤러리 제목을 입력해주세요.');
      return;
    }
    
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    const event = events.find(e => e.id === selectedEventForUpload);
    if (!event) {
      alert('선택한 산행을 찾을 수 없습니다.');
      return;
    }

    setIsUploading(true);
    
    try {
      console.log('📤 사진 업로드 시작:', {
        fileCount: uploadFiles.length,
        eventId: event.id,
        eventTitle: event.title,
        galleryTitle: galleryTitle,
        user: user.email
      });
      
      const files = uploadFiles.map(uf => uf.file);
      
      await uploadPhotos(files, event.id, event.title, galleryTitle);
      
      // 정리
      setUploadFiles([]);
      setGalleryTitle('');
      setShowUploadModal(false);
      setSelectedEventForUpload('');
      
      alert(`${files.length}장의 사진이 업로드되었습니다!`);
    } catch (error: any) {
      console.error('사진 업로드 실패:', error);
      
      // 더 자세한 에러 메시지
      let errorMessage = '사진 업로드에 실패했습니다.';
      if (error.message) {
        errorMessage += `\n\n오류: ${error.message}`;
      }
      if (error.code === 'storage/unauthorized') {
        errorMessage += '\n\n로그아웃 후 다시 로그인해주세요.';
      }
      
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadFile = (id: string) => {
    setUploadFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  // 빈 상태일 때
  if (photos.length === 0 && !isLoading) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">사진첩</h1>
            <p className="text-slate-600">시애라클럽의 추억을 함께 공유하세요.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ImageIcon className="w-24 h-24 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">아직 업로드된 사진이 없습니다</h3>
            <p className="text-slate-600 mb-6">
              첫 번째 산행 사진을 업로드해보세요!
            </p>
            {user && (
              <button
                onClick={handleOpenUploadModal}
                onMouseEnter={() => console.log('🖱️ 마우스가 업로드 버튼 위에 올라감')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                type="button"
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              >
                <Upload className="w-5 h-5" />
                사진 업로드하기
              </button>
            )}
            {!user && (
              <p className="text-sm text-slate-500 mt-4">⚠️ 사진 업로드는 로그인이 필요합니다.</p>
            )}
          </div>
        </div>

        {/* 업로드 모달 - 빈 상태용 */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">사진 업로드</h2>
                  <button 
                    onClick={() => {
                      console.log('🔴 모달 닫기 버튼 클릭 (빈 상태)');
                      setShowUploadModal(false);
                    }}
                    type="button"
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* 산행 선택 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    산행 선택 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedEventForUpload}
                    onChange={(e) => setSelectedEventForUpload(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">산행을 선택하세요</option>
                    {availableEvents.length === 0 ? (
                      <option disabled>등록된 산행이 없습니다</option>
                    ) : (
                      availableEvents.map(event => (
                        <option key={event.id} value={event.id}>
                          {event.title} ({event.date})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* 갤러리 제목 입력 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    갤러리 제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    placeholder="예: 겨울 산행 단체 사진, 정상 인증샷 등"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={100}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    업로드하는 모든 사진에 적용될 제목입니다
                  </p>
                </div>

                {/* 드래그 앤 드롭 영역 */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`border-2 border-dashed rounded-lg p-12 text-center ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
                  }`}
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <p className="text-slate-900 font-bold text-lg mb-3">
                    📸 여러 장의 사진을 한번에 선택하세요
                  </p>
                  <p className="text-slate-600 mb-4">
                    또는 이곳에 파일을 드래그하여 추가할 수 있습니다
                  </p>
                  <input
                    id="file-upload-input-empty"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload-input-empty"
                    className="mt-2 inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    <ImageIcon className="w-6 h-6" />
                    📁 사진 선택 (여러 장 가능)
                  </label>
                  <p className="text-sm text-slate-600 mt-4 font-medium">
                    JPG, PNG, GIF 형식 지원 (최대 10MB) • 한번에 최대 50장
                  </p>
                </div>

                {/* 업로드할 파일 목록 */}
                {uploadFiles.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">선택된 사진 ({uploadFiles.length}개)</h3>
                      <button
                        onClick={() => {
                          uploadFiles.forEach(f => URL.revokeObjectURL(f.preview));
                          setUploadFiles([]);
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        전체 삭제
                      </button>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-[400px] overflow-y-auto p-2 bg-slate-50 rounded-lg">
                      {uploadFiles.map(file => (
                        <div key={file.id} className="relative group">
                          <img
                            src={file.preview}
                            alt="미리보기"
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeUploadFile(file.id)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 text-center">
                      💡 개별 사진 위에 마우스를 올리면 삭제 버튼이 나타납니다
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors"
                  type="button"
                >
                  취소
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploadFiles.length === 0 || !selectedEventForUpload || isUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  type="button"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-900 mx-auto mb-4"></div>
            <p className="text-xl text-slate-600 font-medium">사진을 불러오는 중...</p>
          </div>
        </div>
      ) : (
        <>
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">사진첩</h1>
          <p className="text-slate-600">시애라클럽의 추억을 함께 공유하세요.</p>
        </div>
        
        {user && (
          <button
            onClick={handleOpenUploadModal}
            onMouseEnter={() => console.log('🖱️ 마우스가 업로드 버튼 위에 올라감 (상단)')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            type="button"
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          >
            <Upload className="w-5 h-5" />
            사진 업로드하기
          </button>
        )}
        {!user && (
          <p className="text-sm text-slate-500">⚠️ 로그인 후 사진을 업로드할 수 있습니다.</p>
        )}
      </div>

      {/* 월별 필터 */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {months.map((month) => (
          <button
            key={month.id}
            onClick={() => setSelectedEvent(month.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedEvent === month.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {month.name}
            {month.id !== 'all' && photoCountByMonth[month.id] && (
              <span className="ml-2 text-sm opacity-75">
                ({photoCountByMonth[month.id]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 앨범 그리드 */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">사진을 불러오는 중...</p>
        </div>
      ) : photoAlbums.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">선택한 기간에 사진이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photoAlbums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
              onClick={() => {
                setSelectedAlbum(album);
                setAlbumSlideIndex(0);
              }}
            >
              {/* 대표 사진 */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={album.coverPhoto}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                {/* 사진 개수 배지 */}
                <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  {album.photoCount}
                </div>
              </div>
              
              {/* 앨범 정보 */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">{album.title}</h3>
                <p className="text-sm text-slate-600 mb-3 flex items-center gap-1">
                  <Mountain className="w-4 h-4" />
                  {album.eventTitle}
                </p>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      {album.uploadedByName.charAt(0)}
                    </div>
                    <span>{album.uploadedByName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(album.uploadedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                {/* 삭제 버튼 (관리자 또는 업로더만) */}
                {user && (user.role === 'admin' || user.role === 'chairman' || album.uploadedBy === user.id) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`"${album.title}" 앨범의 모든 사진(${album.photoCount}장)을 삭제하시겠습니까?`)) {
                        album.photos.forEach(photo => deletePhoto(photo.id));
                      }
                    }}
                    className="mt-3 w-full px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    앨범 삭제
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 앨범 슬라이드쇼 모달 */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => {
              setSelectedAlbum(null);
              setAlbumSlideIndex(0);
            }}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* 이전 버튼 */}
          {albumSlideIndex > 0 && (
            <button
              onClick={() => setAlbumSlideIndex(prev => prev - 1)}
              className="absolute left-4 p-3 text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* 다음 버튼 */}
          {albumSlideIndex < selectedAlbum.photos.length - 1 && (
            <button
              onClick={() => setAlbumSlideIndex(prev => prev + 1)}
              className="absolute right-4 p-3 text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* 사진 표시 */}
          <div className="max-w-6xl max-h-[90vh] w-full px-16">
            <img
              src={selectedAlbum.photos[albumSlideIndex].imageUrl}
              alt={selectedAlbum.title}
              className="w-full h-full object-contain"
            />
            
            {/* 사진 정보 */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg backdrop-blur-sm">
              <p className="text-center font-medium">{selectedAlbum.title}</p>
              <p className="text-center text-sm text-white/80">
                {albumSlideIndex + 1} / {selectedAlbum.photos.length}
              </p>
            </div>
          </div>

          {/* 썸네일 네비게이션 */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto px-4">
            {selectedAlbum.photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setAlbumSlideIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                  index === albumSlideIndex
                    ? 'ring-2 ring-white scale-110'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={photo.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">사진 업로드</h2>
                <button 
                  onClick={() => {
                    console.log('🔴 모달 닫기 버튼 클릭');
                    setShowUploadModal(false);
                  }}
                  type="button"
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 산행 선택 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  산행 선택 <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedEventForUpload}
                  onChange={(e) => setSelectedEventForUpload(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">산행을 선택하세요</option>
                  {availableEvents.length === 0 ? (
                    <option disabled>등록된 산행이 없습니다</option>
                  ) : (
                    availableEvents.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.title} ({event.date})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* 갤러리 제목 입력 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  갤러리 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  placeholder="예: 겨울 산행 단체 사진, 정상 인증샷 등"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={100}
                />
                <p className="text-xs text-slate-500 mt-1">
                  업로드하는 모든 사진에 적용될 제목입니다
                </p>
              </div>

              {/* 드래그 앤 드롭 영역 */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-lg p-12 text-center ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
                }`}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <p className="text-slate-900 font-bold text-lg mb-3">
                  📸 여러 장의 사진을 한번에 선택하세요
                </p>
                <p className="text-slate-600 mb-4">
                  또는 이곳에 파일을 드래그하여 추가할 수 있습니다
                </p>
                <input
                  id="file-upload-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload-input"
                  className="mt-2 inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  <ImageIcon className="w-6 h-6" />
                  📁 사진 선택 (여러 장 가능)
                </label>
                <p className="text-sm text-slate-600 mt-4 font-medium">
                  JPG, PNG, GIF 형식 지원 (최대 10MB) • 한번에 최대 50장
                </p>
              </div>

              {/* 업로드할 파일 목록 */}
              {uploadFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">선택된 사진 ({uploadFiles.length}개)</h3>
                    <button
                      onClick={() => {
                        uploadFiles.forEach(f => URL.revokeObjectURL(f.preview));
                        setUploadFiles([]);
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      전체 삭제
                    </button>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-[400px] overflow-y-auto p-2 bg-slate-50 rounded-lg">
                    {uploadFiles.map(file => (
                      <div key={file.id} className="relative group">
                        <img
                          src={file.preview}
                          alt="미리보기"
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeUploadFile(file.id)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 text-center">
                    💡 개별 사진 위에 마우스를 올리면 삭제 버튼이 나타납니다
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors"
                type="button"
              >
                취소
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadFiles.length === 0 || !selectedEventForUpload || isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                type="button"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
        </>
      )}
    </div>
  );
};

export default Gallery;

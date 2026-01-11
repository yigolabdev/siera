import { useState, useEffect, useRef } from 'react';
import { Upload, Heart, Download, X, Image as ImageIcon, Calendar, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Grid3x3, Play, Pause, Folder, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  caption: string;
}

const Gallery = () => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [zoom, setZoom] = useState(1);
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());
  const [isSlideshow, setIsSlideshow] = useState(false);
  
  // 업로드 관련 상태
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadEventTitle, setUploadEventTitle] = useState('');
  const [uploadEventYear, setUploadEventYear] = useState('2026');
  const [uploadEventMonth, setUploadEventMonth] = useState('01');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const months = [
    { id: 'all', name: '전체' },
    { id: '2026-01', name: '2026년 1월' },
    { id: '2025-12', name: '2025년 12월' },
    { id: '2025-11', name: '2025년 11월' },
  ];
  
  // 각 월별/이벤트별 사진 개수 계산
  const getPhotoCountByMonth = (monthId: string) => {
    if (monthId === 'all') return photos.length;
    return photos.filter(photo => photo.month === monthId).length;
  };
  
  // 이벤트별 사진 개수 계산
  const eventPhotoCounts = photos.reduce((acc, photo) => {
    const key = `${photo.month}-${photo.eventTitle}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // 고유한 이벤트 목록 추출
  const uniqueEvents = Array.from(new Set(photos.map(p => `${p.month}|||${p.eventTitle}`)))
    .map(key => {
      const [month, eventTitle] = key.split('|||');
      const photoCount = eventPhotoCounts[`${month}-${eventTitle}`];
      return { month, eventTitle, photoCount };
    })
    .sort((a, b) => b.month.localeCompare(a.month));
  
  const photos = [
    { id: 1, month: '2026-01', eventTitle: '앙봉산 정상 등반', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', caption: '앙봉산 정상에서', author: '김산행', date: '2026-01-15', likes: 24 },
    { id: 2, month: '2026-01', eventTitle: '앙봉산 정상 등반', url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=600&fit=crop', caption: '함께한 순간들', author: '이등산', date: '2026-01-15', likes: 18 },
    { id: 3, month: '2026-01', eventTitle: '앙봉산 정상 등반', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop', caption: '구름 위의 산', author: '박트레킹', date: '2026-01-15', likes: 32 },
    { id: 4, month: '2026-01', eventTitle: '앙봉산 정상 등반', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1000&fit=crop', caption: '아침 햇살', author: '최하이킹', date: '2026-01-15', likes: 45 },
    { id: 5, month: '2026-01', eventTitle: '앙봉산 정상 등반', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', caption: '등산로 풍경', author: '정봉우리', date: '2026-01-15', likes: 15 },
    { id: 6, month: '2026-01', eventTitle: '앙봉산 정상 등반', url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop', caption: '정상 인증샷', author: '홍정상', date: '2026-01-15', likes: 28 },
    { id: 7, month: '2025-12', eventTitle: '설악산 대청봉 등반', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', caption: '설악산의 아름다운 풍경', author: '강백운', date: '2025-12-15', likes: 38 },
    { id: 8, month: '2025-12', eventTitle: '설악산 대청봉 등반', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1000&fit=crop', caption: '대청봉에서 본 일출', author: '윤설악', date: '2025-12-15', likes: 52 },
    { id: 9, month: '2025-12', eventTitle: '설악산 대청봉 등반', url: 'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=800&h=600&fit=crop', caption: '겨울 설악의 매력', author: '임지리', date: '2025-12-15', likes: 41 },
    { id: 10, month: '2025-12', eventTitle: '설악산 대청봉 등반', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', caption: '눈 덮인 능선', author: '조한라', date: '2025-12-15', likes: 36 },
    { id: 11, month: '2025-11', eventTitle: '지리산 노고단 산행', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', caption: '노고단 운해', author: '문북한', date: '2025-11-20', likes: 44 },
    { id: 12, month: '2025-11', eventTitle: '지리산 노고단 산행', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', caption: '가을 단풍', author: '신계룡', date: '2025-11-20', likes: 39 },
    { id: 13, month: '2025-11', eventTitle: '지리산 노고단 산행', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop', caption: '지리산 능선길', author: '장태백', date: '2025-11-20', likes: 47 },
    { id: 14, month: '2025-11', eventTitle: '지리산 노고단 산행', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', caption: '단체 기념 촬영', author: '권덕유', date: '2025-11-20', likes: 55 },
  ];
  
  const filteredPhotos = selectedEvent === 'all' 
    ? photos 
    : photos.filter(photo => photo.month === selectedEvent);
  
  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };
  
  // 파일 처리
  const handleFiles = (files: File[]) => {
    const newFiles: UploadFile[] = files
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        caption: '',
      }));
    
    setUploadFiles(prev => [...prev, ...newFiles]);
  };
  
  // 드래그 앤 드롭 핸들러
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };
  
  // 개별 파일 삭제
  const handleRemoveFile = (id: string) => {
    setUploadFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };
  
  // 캡션 업데이트
  const handleCaptionChange = (id: string, caption: string) => {
    setUploadFiles(prev =>
      prev.map(f => f.id === id ? { ...f, caption } : f)
    );
  };
  
  // 업로드 실행
  const handleUploadSubmit = () => {
    if (uploadFiles.length === 0) {
      alert('업로드할 사진을 선택해주세요.');
      return;
    }
    
    if (!uploadEventTitle.trim()) {
      alert('이벤트 제목을 입력해주세요.');
      return;
    }
    
    // TODO: 실제 백엔드 API 연동
    const uploadData = {
      eventTitle: uploadEventTitle,
      eventMonth: `${uploadEventYear}-${uploadEventMonth}`,
      files: uploadFiles,
    };
    console.log('업로드할 데이터:', uploadData);
    alert(`"${uploadEventTitle}" 이벤트에 ${uploadFiles.length}개의 사진이 업로드되었습니다!`);
    
    // 정리
    uploadFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setUploadFiles([]);
    setUploadEventTitle('');
    setUploadEventYear('2026');
    setUploadEventMonth('01');
    setShowUploadModal(false);
  };
  
  // 모달 닫기
  const handleCloseUploadModal = () => {
    uploadFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setUploadFiles([]);
    setUploadEventTitle('');
    setUploadEventYear('2026');
    setUploadEventMonth('01');
    setShowUploadModal(false);
  };
  
  const handleLike = (photoId: number, e: React.MouseEvent) => {
    e.stopPropagation();
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
  
  const handlePrevImage = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
      setZoom(1);
    }
  };
  
  const handleNextImage = () => {
    if (selectedImage !== null && selectedImage < filteredPhotos.length - 1) {
      setSelectedImage(selectedImage + 1);
      setZoom(1);
    }
  };
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };
  
  const handleDownload = (url: string, caption: string) => {
    // 실제 다운로드 구현
    const link = document.createElement('a');
    link.href = url;
    link.download = `${caption}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      switch (e.key) {
        case 'Escape':
          setSelectedImage(null);
          setIsSlideshow(false);
          break;
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredPhotos.length]);
  
  // 슬라이드쇼
  useEffect(() => {
    if (!isSlideshow || selectedImage === null) return;
    
    const interval = setInterval(() => {
      if (selectedImage < filteredPhotos.length - 1) {
        setSelectedImage(selectedImage + 1);
      } else {
        setSelectedImage(0);
      }
      setZoom(1);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isSlideshow, selectedImage, filteredPhotos.length]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">사진 갤러리</h1>
          <p className="text-xl text-slate-600">
            함께한 산행의 추억을 공유해주세요.
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)} 
          className="btn-primary"
        >
          사진 업로드
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <p className="text-slate-600 text-sm mb-2">전체 사진</p>
          <p className="text-3xl font-bold text-slate-900">{photos.length}장</p>
        </div>
        <div className="card text-center">
          <p className="text-slate-600 text-sm mb-2">정기 산행</p>
          <p className="text-3xl font-bold text-slate-900">매월 1회</p>
        </div>
        <div className="card text-center">
          <p className="text-slate-600 text-sm mb-2">총 좋아요</p>
          <p className="text-3xl font-bold text-slate-900">
            {photos.reduce((sum, photo) => sum + photo.likes, 0)}
          </p>
        </div>
      </div>
      
      {/* Filter & View Mode */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-auto">
            <h3 className="text-sm text-slate-600 mb-3">월별 보기</h3>
            <div className="flex flex-wrap gap-2">
              {months.map((month) => {
                const photoCount = getPhotoCountByMonth(month.id);
                return (
                  <button
                    key={month.id}
                    onClick={() => setSelectedEvent(month.id)}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      selectedEvent === month.id
                        ? 'bg-slate-900 text-white'
                        : 'border-2 border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{month.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        selectedEvent === month.id
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {photoCount}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">레이아웃</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
              title="그리드 뷰"
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'masonry'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
              title="메이슨리 뷰"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* 이벤트별 사진 개수 표시 */}
        {selectedEvent !== 'all' && (
          <div className="mt-6">
            <h3 className="text-sm text-slate-600 mb-3 flex items-center gap-2">
              <Folder className="h-4 w-4" />
              이벤트별 사진
            </h3>
            <div className="flex flex-wrap gap-2">
              {uniqueEvents
                .filter(event => event.month === selectedEvent)
                .map((event, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">{event.eventTitle}</span>
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                        {event.photoCount}장
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        
        {/* 전체 보기일 때 모든 이벤트 표시 */}
        {selectedEvent === 'all' && (
          <div className="mt-6">
            <h3 className="text-sm text-slate-600 mb-3 flex items-center gap-2">
              <Folder className="h-4 w-4" />
              전체 이벤트별 사진
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {uniqueEvents.map((event, index) => (
                <div
                  key={index}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <ImageIcon className="h-4 w-4 text-slate-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{event.eventTitle}</p>
                        <p className="text-xs text-slate-500">
                          {months.find(m => m.id === event.month)?.name || event.month}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-bold whitespace-nowrap ml-2">
                      {event.photoCount}장
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Photo Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {filteredPhotos.map((photo, index) => {
          const isLiked = likedPhotos.has(photo.id);
          const displayLikes = photo.likes + (isLiked ? 1 : 0);
          
          return (
            <div 
              key={photo.id} 
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300 transition-colors"
              onClick={() => setSelectedImage(index)}
              style={viewMode === 'masonry' ? { 
                gridRowEnd: `span ${Math.floor(Math.random() * 2) + 1}` 
              } : {}}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={photo.caption}
                  className={`w-full object-cover ${
                    viewMode === 'grid' ? 'h-64' : 'h-auto'
                  }`}
                />
              </div>
              <div className="p-4">
                <p className="text-primary-600 text-xs mb-1">{photo.eventTitle}</p>
                <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{photo.caption}</h3>
                <p className="text-slate-500 text-sm mb-3">{photo.author} · {photo.date}</p>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={(e) => handleLike(photo.id, e)}
                    className="flex items-center space-x-1 transition-colors"
                  >
                    <Heart 
                      className={`h-5 w-5 transition-all ${
                        isLiked 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-slate-400 hover:text-red-500'
                      }`}
                    />
                    <span className={`text-sm ${isLiked ? 'text-red-500 font-bold' : 'text-slate-600'}`}>
                      {displayLikes}
                    </span>
                  </button>
                  <span className="text-xs text-slate-400">{index + 1} / {filteredPhotos.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredPhotos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-slate-500">선택한 기간에 사진이 없습니다.</p>
        </div>
      )}
      
      {/* Advanced Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black z-50 flex flex-col"
          onClick={() => {
            setSelectedImage(null);
            setIsSlideshow(false);
            setZoom(1);
          }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">
                {selectedImage + 1} / {filteredPhotos.length}
              </span>
              <span className="text-gray-300 text-sm">
                {filteredPhotos[selectedImage].eventTitle}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                title="축소 (-)"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="text-white text-sm font-medium min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                title="확대 (+)"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              
              {/* Slideshow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSlideshow(!isSlideshow);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isSlideshow 
                    ? 'bg-primary-600 text-white' 
                    : 'text-white hover:bg-white/20'
                }`}
                title={isSlideshow ? '슬라이드쇼 중지' : '슬라이드쇼 시작'}
              >
                {isSlideshow ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              
              {/* Close */}
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setIsSlideshow(false);
                  setZoom(1);
                }}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                title="닫기 (ESC)"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* Main Image Area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Previous Button */}
            {selectedImage > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110"
                title="이전 (←)"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}
            
            {/* Image */}
            <div 
              className="flex items-center justify-center w-full h-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={filteredPhotos[selectedImage].url}
                alt={filteredPhotos[selectedImage].caption}
                className="max-w-full max-h-full object-contain transition-transform duration-300"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
            
            {/* Next Button */}
            {selectedImage < filteredPhotos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110"
                title="다음 (→)"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}
          </div>
          
          {/* Bottom Info Bar */}
          <div className="bg-black/50 backdrop-blur-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {filteredPhotos[selectedImage].caption}
                  </h3>
                  <p className="text-gray-300">
                    {filteredPhotos[selectedImage].author} · {filteredPhotos[selectedImage].date}
                  </p>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <button
                    onClick={(e) => handleLike(filteredPhotos[selectedImage].id, e)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Heart 
                      className={`h-6 w-6 ${
                        likedPhotos.has(filteredPhotos[selectedImage].id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-white'
                      }`}
                    />
                    <span className="text-white font-medium">
                      {filteredPhotos[selectedImage].likes + (likedPhotos.has(filteredPhotos[selectedImage].id) ? 1 : 0)}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(
                        filteredPhotos[selectedImage].url,
                        filteredPhotos[selectedImage].caption
                      );
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Download className="h-6 w-6 text-white" />
                    <span className="text-white font-medium">다운로드</span>
                  </button>
                </div>
              </div>
              
              {/* Thumbnail Navigation */}
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {filteredPhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                      setZoom(1);
                    }}
                    className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                      index === selectedImage
                        ? 'ring-4 ring-primary-500 scale-110'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 사진 업로드 모달 */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseUploadModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">사진 업로드</h3>
                <p className="text-sm text-slate-600 mt-1">
                  여러 장의 사진을 선택하거나 드래그하여 업로드하세요
                </p>
              </div>
              <button
                onClick={handleCloseUploadModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-slate-600" />
              </button>
            </div>

            {/* 본문 */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 이벤트 정보 입력 */}
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    이벤트 제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={uploadEventTitle}
                    onChange={(e) => setUploadEventTitle(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-900"
                    placeholder="예: 북한산 백운대 등반"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    산행 일자 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <select
                        value={uploadEventYear}
                        onChange={(e) => setUploadEventYear(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-900 font-medium"
                      >
                        {Array.from({ length: 5 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <option key={year} value={year}>
                              {year}년
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <select
                        value={uploadEventMonth}
                        onChange={(e) => setUploadEventMonth(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-900 font-medium"
                      >
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = String(i + 1).padStart(2, '0');
                          return (
                            <option key={month} value={month}>
                              {i + 1}월
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    선택한 날짜: {uploadEventYear}년 {uploadEventMonth}월
                  </p>
                </div>
              </div>
              
              {/* 구분선 */}
              <div className="border-t border-slate-200 mb-6"></div>
              
              {/* 드래그 앤 드롭 영역 */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  isDragging
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  사진을 여기에 드래그하세요
                </h4>
                <p className="text-slate-600 mb-4">
                  또는 클릭하여 파일을 선택하세요
                </p>
                <div className="flex flex-col items-center space-y-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary"
                  >
                    파일 선택
                  </button>
                  <span className="text-slate-500 text-sm">JPG, PNG, GIF (최대 10MB)</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* 업로드된 파일 미리보기 */}
              {uploadFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">
                    선택된 사진 ({uploadFiles.length}개)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadFiles.map((uploadFile) => (
                      <div
                        key={uploadFile.id}
                        className="relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* 미리보기 이미지 */}
                        <div className="relative aspect-video">
                          <img
                            src={uploadFile.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          {/* 삭제 버튼 */}
                          <button
                            onClick={() => handleRemoveFile(uploadFile.id)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* 파일 정보 */}
                        <div className="p-3">
                          <p className="text-xs text-gray-500 mb-2 truncate">
                            {uploadFile.file.name}
                          </p>
                          <input
                            type="text"
                            placeholder="사진 설명 (선택사항)"
                            value={uploadFile.caption}
                            onChange={(e) => handleCaptionChange(uploadFile.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="p-6 border-t flex justify-between items-center bg-slate-50">
              <div className="text-sm">
                {uploadFiles.length > 0 ? (
                  <div>
                    <p className="font-bold text-slate-900">
                      {uploadFiles.length}개의 사진이 업로드 대기 중
                    </p>
                    {uploadEventTitle && (
                      <p className="text-slate-600 text-xs mt-1">
                        이벤트: {uploadEventTitle} ({uploadEventYear}년 {uploadEventMonth}월)
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-600">사진을 선택해주세요</p>
                    <p className="text-slate-500 text-xs mt-1">
                      이벤트 정보를 입력하고 사진을 업로드하세요
                    </p>
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCloseUploadModal}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleUploadSubmit}
                  disabled={uploadFiles.length === 0}
                  className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                    uploadFiles.length === 0
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  업로드 ({uploadFiles.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;


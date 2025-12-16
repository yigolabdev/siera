import { useState, useEffect } from 'react';
import { Upload, Heart, Download, X, Image as ImageIcon, Calendar, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Grid3x3, Play, Pause } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [zoom, setZoom] = useState(1);
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());
  const [isSlideshow, setIsSlideshow] = useState(false);
  
  const months = [
    { id: 'all', name: '전체' },
    { id: '2026-01', name: '2026년 1월' },
    { id: '2025-12', name: '2025년 12월' },
    { id: '2025-11', name: '2025년 11월' },
  ];
  
  const photos = [
    { id: 1, month: '2026-01', eventTitle: '북한산 백운대 등반', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', caption: '백운대 정상에서', author: '김산행', date: '2026-01-15', likes: 24 },
    { id: 2, month: '2026-01', eventTitle: '북한산 백운대 등반', url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=600&fit=crop', caption: '함께한 순간들', author: '이등산', date: '2026-01-15', likes: 18 },
    { id: 3, month: '2026-01', eventTitle: '북한산 백운대 등반', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop', caption: '구름 위의 산', author: '박트레킹', date: '2026-01-15', likes: 32 },
    { id: 4, month: '2026-01', eventTitle: '북한산 백운대 등반', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1000&fit=crop', caption: '아침 햇살', author: '최하이킹', date: '2026-01-15', likes: 45 },
    { id: 5, month: '2026-01', eventTitle: '북한산 백운대 등반', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', caption: '등산로 풍경', author: '정봉우리', date: '2026-01-15', likes: 15 },
    { id: 6, month: '2026-01', eventTitle: '북한산 백운대 등반', url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop', caption: '정상 인증샷', author: '홍정상', date: '2026-01-15', likes: 28 },
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
  
  const handleUpload = () => {
    alert('사진 업로드 기능은 백엔드 연동 후 구현됩니다.');
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
          <h1 className="text-4xl font-bold text-gray-900 mb-3">사진 갤러리</h1>
          <p className="text-xl text-gray-600">
            함께한 산행의 추억을 공유해주세요.
          </p>
        </div>
        <button onClick={handleUpload} className="btn-primary flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>사진 업로드</span>
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center space-x-4">
            <ImageIcon className="h-10 w-10 text-blue-600" />
            <div>
              <p className="text-gray-500 font-medium">전체 사진</p>
              <p className="text-3xl font-bold text-gray-900">{photos.length}장</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-4">
            <Calendar className="h-10 w-10 text-green-600" />
            <div>
              <p className="text-gray-500 font-medium">정기 산행</p>
              <p className="text-3xl font-bold text-gray-900">매월 1회</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-4">
            <Heart className="h-10 w-10 text-red-600" />
            <div>
              <p className="text-gray-500 font-medium">총 좋아요</p>
              <p className="text-3xl font-bold text-gray-900">
                {photos.reduce((sum, photo) => sum + photo.likes, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter & View Mode */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">월별 보기</h3>
            <div className="flex flex-wrap gap-2">
              {months.map((month) => (
                <button
                  key={month.id}
                  onClick={() => setSelectedEvent(month.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                    selectedEvent === month.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {month.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 font-medium">레이아웃:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
              title="그리드 뷰"
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'masonry'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
              title="메이슨리 뷰"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>
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
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 bg-white cursor-pointer"
              onClick={() => setSelectedImage(index)}
              style={viewMode === 'masonry' ? { 
                gridRowEnd: `span ${Math.floor(Math.random() * 2) + 1}` 
              } : {}}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={photo.caption}
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                    viewMode === 'grid' ? 'h-64' : 'h-auto'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-lg mb-1">{photo.caption}</p>
                    <p className="text-gray-200 text-sm">{photo.author}</p>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(photo.url, photo.caption);
                      }}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      title="다운로드"
                    >
                      <Download className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-primary-600 text-xs font-bold mb-1">{photo.eventTitle}</p>
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{photo.caption}</h3>
                <p className="text-gray-500 text-sm mb-3">{photo.author} · {photo.date}</p>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={(e) => handleLike(photo.id, e)}
                    className="flex items-center space-x-1 transition-colors"
                  >
                    <Heart 
                      className={`h-5 w-5 transition-all ${
                        isLiked 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    />
                    <span className={`font-medium text-sm ${isLiked ? 'text-red-500' : 'text-gray-600'}`}>
                      {displayLikes}
                    </span>
                  </button>
                  <span className="text-xs text-gray-400">{index + 1} / {filteredPhotos.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredPhotos.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">선택한 기간에 사진이 없습니다.</p>
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
    </div>
  );
};

export default Gallery;


import { useState, useEffect, useRef } from 'react';
import { Upload, Heart, Download, X, Image as ImageIcon, Calendar, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play, Pause, Folder, Trash2, Mountain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContextEnhanced';
import { useGallery } from '../contexts/GalleryContext';
import { useEvents } from '../contexts/EventContext';
import { useNavigate } from 'react-router-dom';

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  caption: string;
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
  const [isDragging, setIsDragging] = useState(false);
  const [selectedEventForUpload, setSelectedEventForUpload] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 완료된 산행 목록 (과거 산행)
  const pastEvents = events
    .filter(event => new Date(event.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  
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
  
  // 각 월별 사진 개수 계산
  const photoCountByMonth: Record<string, number> = {};
  photos.forEach(photo => {
    const key = `${photo.eventYear}-${photo.eventMonth}`;
    photoCountByMonth[key] = (photoCountByMonth[key] || 0) + 1;
  });

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
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      caption: '',
    }));
    
    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0 || !selectedEventForUpload) return;
    
    const event = events.find(e => e.id === selectedEventForUpload);
    if (!event) return;

    try {
      const files = uploadFiles.map(uf => uf.file);
      const captions = uploadFiles.map(uf => uf.caption);
      
      await uploadPhotos(files, event.id, event.title, captions);
      
      // 정리
      setUploadFiles([]);
      setShowUploadModal(false);
      setSelectedEventForUpload('');
      
      alert('사진이 업로드되었습니다!');
    } catch (error) {
      console.error('사진 업로드 실패:', error);
      alert('사진 업로드에 실패했습니다.');
    }
  };

  const removeUploadFile = (id: string) => {
    setUploadFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const updateCaption = (id: string, caption: string) => {
    setUploadFiles(prev => prev.map(f => 
      f.id === id ? { ...f, caption } : f
    ));
  };

  // 빈 상태일 때
  if (photos.length === 0 && !isLoading) {
    return (
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
          {user?.isApproved && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="w-5 h-5" />
              사진 업로드
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">사진첩</h1>
          <p className="text-slate-600">시애라클럽의 추억을 함께 공유하세요.</p>
        </div>
        
        {user?.isApproved && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="w-5 h-5" />
            사진 업로드
          </button>
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

      {/* 사진 그리드 */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">사진을 불러오는 중...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">선택한 기간에 사진이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative group cursor-pointer rounded-lg overflow-hidden aspect-square bg-slate-100"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={photo.imageUrl}
                alt={photo.caption || photo.eventTitle}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-semibold text-sm truncate">{photo.eventTitle}</p>
                  {photo.caption && (
                    <p className="text-xs text-white/80 truncate">{photo.caption}</p>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(photo.id);
                }}
                className="absolute top-2 right-2 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart
                  className={`w-4 h-4 ${
                    likedPhotos.has(photo.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">사진 업로드</h2>
                <button onClick={() => setShowUploadModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 산행 선택 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  산행 선택
                </label>
                <select
                  value={selectedEventForUpload}
                  onChange={(e) => setSelectedEventForUpload(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2"
                >
                  <option value="">산행을 선택하세요</option>
                  {pastEvents.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title} ({event.date})
                    </option>
                  ))}
                </select>
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
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600 mb-2">
                  이곳에 파일을 드래그하거나 클릭하여 선택하세요
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  파일 선택
                </button>
              </div>

              {/* 업로드할 파일 목록 */}
              {uploadFiles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">업로드할 사진 ({uploadFiles.length}개)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadFiles.map(file => (
                      <div key={file.id} className="relative">
                        <img
                          src={file.preview}
                          alt="미리보기"
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeUploadFile(file.id)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          placeholder="사진 설명 (선택사항)"
                          value={file.caption}
                          onChange={(e) => updateCaption(file.id, e.target.value)}
                          className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-white"
              >
                취소
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadFiles.length === 0 || !selectedEventForUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                업로드
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

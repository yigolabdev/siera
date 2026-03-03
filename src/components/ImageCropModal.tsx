import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, Maximize2 } from 'lucide-react';

interface ImageCropModalProps {
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

const ImageCropModal = ({ imageSrc, onCropComplete, onCancel }: ImageCropModalProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.8); // 기본값을 0.8로 설정하여 축소된 상태로 시작
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (location: Point) => {
    setCrop(location);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropCompleteCallback = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    // 캔버스 크기를 크롭 영역에 맞게 설정
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // 이미지를 캔버스에 그리기
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // 5MB 이하로 압축
    return new Promise((resolve) => {
      const compressImage = (quality: number) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const sizeInMB = blob.size / (1024 * 1024);
            console.log(`🖼️ 이미지 압축 시도 (quality: ${quality}): ${sizeInMB.toFixed(2)}MB`);
            
            // 5MB 이하면 완료
            if (sizeInMB <= 5 || quality <= 0.3) {
              console.log(`✅ 최종 이미지 크기: ${sizeInMB.toFixed(2)}MB`);
              resolve(blob);
            } else {
              // 5MB 초과 시 품질을 낮춰서 재시도
              compressImage(quality - 0.1);
            }
          }
        }, 'image/jpeg', quality);
      };
      
      // 초기 품질 0.95부터 시작
      compressImage(0.95);
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) {
      console.error('❌ [ImageCrop] croppedAreaPixels가 없습니다');
      return;
    }

    try {
      console.log('🔄 [ImageCrop] 이미지 크롭 시작:', croppedAreaPixels);
      
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );
      
      console.log('✅ [ImageCrop] 크롭 완료:', {
        size: croppedImageBlob.size,
        type: croppedImageBlob.type,
      });
      
      onCropComplete(croppedImageBlob);
    } catch (error) {
      console.error('❌ [ImageCrop] 이미지 크롭 실패:', error);
      alert('이미지 편집에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl flex flex-col overflow-hidden" style={{ maxHeight: '90vh' }}>
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-bold text-slate-900">프로필 사진 편집</h3>
            <p className="text-xs text-slate-600 mt-1">
              드래그하여 위치 조정, 확대/축소 가능
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* 크롭 영역 */}
        <div className="relative bg-slate-900 flex-shrink-0" style={{ height: '400px' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* 컨트롤 */}
        <div className="px-8 py-5 bg-white flex-shrink-0">
          {/* 확대/축소 슬라이더 */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3 px-3">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-slate-600" />
                <label className="text-sm font-semibold text-slate-700">
                  확대 / 축소
                </label>
              </div>
              <span className="text-sm font-bold text-primary-600">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* 슬라이더 컨테이너 - 충분한 여백으로 thumb가 완전히 안에 들어오도록 */}
            <div className="px-3">
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="slider-thumb w-full"
                style={{
                  height: '6px',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((zoom - 0.5) / 2.5) * 100}%, #e2e8f0 ${((zoom - 0.5) / 2.5) * 100}%, #e2e8f0 100%)`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              />
              
              {/* 눈금 표시 */}
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>50%</span>
                <span>150%</span>
                <span>300%</span>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Check className="w-4 h-4" />
              완료
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .slider-thumb {
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
        
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(59, 130, 246, 0.3);
          border: 2px solid white;
          transition: all 0.2s;
        }
        
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.5);
        }
        
        .slider-thumb::-webkit-slider-thumb:active {
          transform: scale(1.05);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(59, 130, 246, 0.3);
          border: 2px solid white;
          transition: all 0.2s;
        }
        
        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.5);
        }
        
        .slider-thumb::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 4px;
        }
        
        .slider-thumb::-moz-range-track {
          height: 6px;
          border-radius: 4px;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default ImageCropModal;

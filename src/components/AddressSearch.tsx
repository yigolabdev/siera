import React, { useState } from 'react';
import { Search, MapPin, X, Edit } from 'lucide-react';

interface AddressSearchProps {
  onSelect: (result: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }) => void;
  initialValue?: string;
}

interface SearchResult {
  address_name: string;
  place_name: string;
  x: string; // 경도 (longitude)
  y: string; // 위도 (latitude)
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onSelect, initialValue }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(initialValue || '');
  const [isEditing, setIsEditing] = useState(!initialValue); // 초기값이 없으면 편집 모드

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      // Kakao REST API 사용 (클라이언트 사이드)
      const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
      
      if (!KAKAO_API_KEY) {
        console.error('❌ Kakao REST API 키가 설정되지 않았습니다.');
        alert('지도 API 키가 설정되지 않았습니다. 관리자에게 문의하세요.');
        return;
      }

      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(searchKeyword)}`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('주소 검색에 실패했습니다.');
      }

      const data = await response.json();
      
      if (data.documents && data.documents.length > 0) {
        setSearchResults(data.documents);
      } else {
        alert('검색 결과가 없습니다.');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('주소 검색 오류:', error);
      alert('주소 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectAddress = (result: SearchResult) => {
    const address = result.address_name;
    const placeName = result.place_name;
    
    setSelectedAddress(`${placeName} (${address})`);
    setShowResults(false);
    setSearchKeyword('');
    setIsEditing(false); // 선택 후 편집 모드 종료
    
    onSelect({
      address: `${placeName} - ${address}`,
      coordinates: {
        latitude: parseFloat(result.y),
        longitude: parseFloat(result.x),
      },
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSearchKeyword('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleClear = () => {
    setSelectedAddress('');
    setSearchKeyword('');
    setSearchResults([]);
    setShowResults(false);
    setIsEditing(true);
  };

  return (
    <div className="space-y-3">
      {/* 선택된 주소 표시 */}
      {selectedAddress && !isEditing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
            <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium text-green-900 flex-1">{selectedAddress}</span>
            <button
              type="button"
              onClick={handleEdit}
              className="px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-50 transition-colors flex items-center gap-1.5 text-sm font-medium"
            >
              <Edit className="w-4 h-4" />
              <span>수정</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 hover:bg-green-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-green-600" />
            </button>
          </div>
          <p className="text-xs text-slate-500">
            💡 주소를 변경하려면 <strong>수정</strong> 버튼을 클릭하세요.
          </p>
        </div>
      ) : (
        <>
          {/* 검색창 */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="산 이름이나 주소를 검색하세요 (예: 북한산, 설악산)"
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching || !searchKeyword.trim()}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? '검색 중...' : '검색'}
            </button>
          </div>

          {/* 검색 결과 */}
          {showResults && searchResults.length > 0 && (
            <div className="border border-slate-300 rounded-lg max-h-80 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectAddress(result)}
                  className="w-full p-4 text-left hover:bg-slate-50 border-b border-slate-200 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{result.place_name}</p>
                      <p className="text-sm text-slate-600 mt-1">{result.address_name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        좌표: {parseFloat(result.y).toFixed(6)}, {parseFloat(result.x).toFixed(6)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 안내 문구 */}
          <p className="text-xs text-slate-500">
            💡 주소를 검색하면 정확한 위치 기반 날씨 정보를 제공합니다.
          </p>
        </>
      )}
    </div>
  );
};

export default AddressSearch;

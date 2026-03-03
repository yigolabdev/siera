import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Mountain, X, Edit, Star, ChevronDown } from 'lucide-react';
import { searchMountains, MountainData } from '../data/mountains';
import { searchMountainFromAPI } from '../utils/mountainApi';

interface MountainSearchProps {
  onSelect: (result: { name: string; altitude: string; location: string }) => void;
  initialValue?: string;
  initialAltitude?: string;
}

const MountainSearch: React.FC<MountainSearchProps> = ({ onSelect, initialValue, initialAltitude }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [results, setResults] = useState<MountainData[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchingAPI, setIsSearchingAPI] = useState(false);
  const [selectedMountain, setSelectedMountain] = useState(initialValue || '');
  const [selectedAltitude, setSelectedAltitude] = useState(initialAltitude || '');
  const [isEditing, setIsEditing] = useState(!initialValue);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // initialValue 변경 시 상태 동기화
  useEffect(() => {
    if (initialValue) {
      setSelectedMountain(initialValue);
      setSelectedAltitude(initialAltitude || '');
      setIsEditing(false);
    }
  }, [initialValue, initialAltitude]);

  // 외부 클릭 시 드롭다운 닫기 + 입력된 텍스트 자동 저장 (검색 결과에서 일치하는 산 데이터 활용)
  const resultsRef = useRef<MountainData[]>([]);
  resultsRef.current = results;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        // 드롭다운에서 선택하지 않고 외부 클릭한 경우, 입력된 텍스트를 산 이름으로 자동 저장
        if (searchKeyword.trim() && !selectedMountain) {
          const keyword = searchKeyword.trim();
          // 검색 결과에서 정확히 일치하는 산 찾기 → 고도/위치 자동 매칭
          const exactMatch = resultsRef.current.find(
            m => m.name === keyword || m.name.toLowerCase() === keyword.toLowerCase()
          );
          // 정확 매칭 없으면 내장 데이터에서 한번 더 검색
          const match = exactMatch || searchMountains(keyword).find(
            m => m.name === keyword || m.name.toLowerCase() === keyword.toLowerCase()
          );

          if (match) {
            const altitudeStr = match.altitude > 0 ? `${match.altitude}m` : '';
            setSelectedMountain(match.name);
            setSelectedAltitude(altitudeStr);
            setIsEditing(false);
            onSelect({
              name: match.name,
              altitude: altitudeStr,
              location: match.location,
            });
          } else {
            setSelectedMountain(keyword);
            setIsEditing(false);
            onSelect({
              name: keyword,
              altitude: '',
              location: '',
            });
          }
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchKeyword, selectedMountain, onSelect]);

  // 디바운스 검색
  const handleSearch = useCallback((keyword: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!keyword.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      // 1차: 내장 데이터 검색 (즉시)
      const builtinResults = searchMountains(keyword);
      setResults(builtinResults);
      setShowDropdown(true);
      setHighlightIndex(-1);

      // 2차: 내장 데이터에 결과가 부족하면 API 검색
      if (builtinResults.length < 3) {
        setIsSearchingAPI(true);
        try {
          const apiResults = await searchMountainFromAPI(keyword);
          if (apiResults.length > 0) {
            // 중복 제거 (이름이 같은 것)
            const builtinNames = new Set(builtinResults.map(r => r.name));
            const uniqueApiResults = apiResults.filter(r => !builtinNames.has(r.name));
            if (uniqueApiResults.length > 0) {
              setResults(prev => [...prev, ...uniqueApiResults]);
            }
          }
        } finally {
          setIsSearchingAPI(false);
        }
      }
    }, 300);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);
    handleSearch(value);
  };

  const handleSelectMountain = (mountain: MountainData) => {
    const altitudeStr = mountain.altitude > 0 ? `${mountain.altitude}m` : '';
    setSelectedMountain(mountain.name);
    setSelectedAltitude(altitudeStr);
    setSearchKeyword('');
    setShowDropdown(false);
    setIsEditing(false);
    setHighlightIndex(-1);

    onSelect({
      name: mountain.name,
      altitude: altitudeStr,
      location: mountain.location,
    });
  };

  const handleManualInput = () => {
    // 검색어를 산 이름으로 직접 사용
    if (searchKeyword.trim()) {
      setSelectedMountain(searchKeyword.trim());
      setSelectedAltitude('');
      setShowDropdown(false);
      setIsEditing(false);

      onSelect({
        name: searchKeyword.trim(),
        altitude: '',
        location: '',
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSearchKeyword(selectedMountain);
    setSelectedMountain('');
    setSelectedAltitude('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleClear = () => {
    setSelectedMountain('');
    setSelectedAltitude('');
    setSearchKeyword('');
    setResults([]);
    setShowDropdown(false);
    setIsEditing(true);
    onSelect({ name: '', altitude: '', location: '' });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || results.length === 0) {
      if (e.key === 'Enter' && searchKeyword.trim()) {
        e.preventDefault();
        handleManualInput();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex(prev => 
          prev < results.length ? prev + 1 : 0  // +1 for "직접 입력" option
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex(prev => 
          prev > 0 ? prev - 1 : results.length
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < results.length) {
          handleSelectMountain(results[highlightIndex]);
        } else if (highlightIndex === results.length) {
          handleManualInput();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightIndex(-1);
        break;
    }
  };

  return (
    <div className="relative">
      {/* 선택된 산 표시 */}
      {selectedMountain && !isEditing ? (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border-2 border-emerald-300 rounded-lg">
          <Mountain className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-emerald-900">{selectedMountain}</span>
            {selectedAltitude && (
              <span className="ml-2 text-sm text-emerald-700">({selectedAltitude})</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleEdit}
            className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-700 rounded-md hover:bg-emerald-50 transition-colors flex items-center gap-1.5 text-sm font-medium flex-shrink-0"
          >
            <Edit className="w-3.5 h-3.5" />
            수정
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 hover:bg-emerald-100 rounded transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      ) : (
        <>
          {/* 검색 입력 */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchKeyword}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchKeyword.trim() && results.length > 0) {
                  setShowDropdown(true);
                }
              }}
              placeholder="산 이름을 입력하세요 (예: 북한산, 설악산)"
              className="w-full px-4 py-2.5 pl-10 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              autoComplete="off"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => {
                  setSearchKeyword('');
                  setResults([]);
                  setShowDropdown(false);
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* 드롭다운 결과 */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
            >
              {results.length > 0 ? (
                <>
                  {results.map((mountain, index) => (
                    <button
                      key={`${mountain.name}-${mountain.altitude}-${index}`}
                      type="button"
                      onClick={() => handleSelectMountain(mountain)}
                      className={`w-full px-4 py-3 text-left hover:bg-emerald-50 border-b border-slate-100 last:border-b-0 transition-colors ${
                        index === highlightIndex ? 'bg-emerald-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Mountain className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{mountain.name}</span>
                            {mountain.altitude > 0 && (
                              <span className="text-sm font-medium text-emerald-600">
                                {mountain.altitude}m
                              </span>
                            )}
                            {mountain.is100Famous && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                100대 명산
                              </span>
                            )}
                          </div>
                          {mountain.location && (
                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                              {mountain.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* 직접 입력 옵션 */}
                  {searchKeyword.trim() && (
                    <button
                      type="button"
                      onClick={handleManualInput}
                      className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-t border-slate-200 ${
                        highlightIndex === results.length ? 'bg-slate-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Edit className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600">
                          "<strong className="text-slate-900">{searchKeyword}</strong>" 직접 입력
                        </span>
                      </div>
                    </button>
                  )}
                </>
              ) : searchKeyword.trim() ? (
                <>
                  {isSearchingAPI ? (
                    <div className="px-4 py-6 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">산림청 데이터 검색 중...</p>
                    </div>
                  ) : (
                    <div className="px-4 py-4">
                      <p className="text-sm text-slate-500 mb-3">
                        검색 결과가 없습니다.
                      </p>
                      <button
                        type="button"
                        onClick={handleManualInput}
                        className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left flex items-center gap-3"
                      >
                        <Edit className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">
                          "<strong>{searchKeyword}</strong>" 직접 입력
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}

          {/* 안내 문구 */}
          <p className="text-xs text-slate-500 mt-1.5">
            산 이름을 입력하면 자동완성됩니다. 목록에 없으면 직접 입력할 수 있습니다.
          </p>
        </>
      )}
    </div>
  );
};

export default MountainSearch;

# 🖼️ Firebase Storage 통합 가이드

## Phase 6: Storage 통합 (이미지 업로드)

이미지 업로드 기능을 Firebase Storage와 통합하는 가이드입니다.

---

## 📋 개요

Firebase Storage를 사용하여 다음 기능을 구현합니다:

1. **프로필 이미지 업로드** - 회원 프로필 사진
2. **갤러리 이미지 업로드** - 산행 사진 갤러리
3. **이벤트 커버 이미지** - 산행 대표 이미지
4. **이미지 최적화** - 자동 크기 조정 및 압축

---

## 🔧 Storage Service 구조

### 디렉토리 구조

```
storage/
├── profiles/          # 프로필 이미지
│   └── {userId}/
│       └── {timestamp}_{filename}
├── gallery/           # 갤러리 이미지
│   └── {eventId}/
│       └── {timestamp}_{filename}
└── events/            # 이벤트 커버 이미지
    └── {eventId}/
        └── cover_{timestamp}_{filename}
```

### 주요 함수

| 함수 | 설명 | 파일 크기 제한 |
|------|------|----------------|
| `uploadProfileImage()` | 프로필 이미지 업로드 | 10MB |
| `uploadGalleryImage()` | 갤러리 이미지 업로드 | 10MB |
| `uploadMultipleImages()` | 여러 이미지 일괄 업로드 | 각 10MB |
| `uploadEventCoverImage()` | 이벤트 커버 업로드 | 10MB |
| `optimizeImage()` | 이미지 최적화 (리사이징) | - |
| `deleteFile()` | 파일 삭제 | - |
| `listFilesInFolder()` | 폴더 파일 목록 조회 | - |

---

## 💻 사용 예제

### 1. 프로필 이미지 업로드 (Profile.tsx)

```typescript
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContextEnhanced';
import storageService from '../services/storage.service';

function Profile() {
  const { user, updateProfileImage } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    
    const file = e.target.files[0];
    
    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하만 가능합니다.');
      return;
    }
    
    // 이미지 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    try {
      setUploading(true);
      
      // 이미지 최적화 (선택사항)
      const optimizedFile = await storageService.optimizeImage(file, 800, 800, 0.9);
      
      // Firebase Storage에 업로드
      const result = await storageService.uploadProfileImage(user.id, optimizedFile, {
        onProgress: (progress) => setUploadProgress(progress),
        metadata: {
          contentType: file.type,
          customMetadata: {
            uploadedBy: user.name,
            uploadedAt: new Date().toISOString(),
          }
        }
      });
      
      if (result.success && result.url) {
        // AuthContext의 프로필 이미지 업데이트
        await updateProfileImage(result.url);
        alert('프로필 이미지가 업데이트되었습니다.');
      } else {
        alert(`업로드 실패: ${result.error}`);
      }
    } catch (error: any) {
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div>
      <img 
        src={user?.profileImage || '/default-avatar.png'} 
        alt="프로필"
        className="w-32 h-32 rounded-full"
      />
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />
      
      {uploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            업로드 중... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}
    </div>
  );
}
```

### 2. 갤러리 이미지 업로드 (Gallery.tsx)

```typescript
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContextEnhanced';
import { useEvents } from '../contexts/EventContext';
import storageService from '../services/storage.service';
import { addDocument } from '../lib/firebase/firestore';

function Gallery() {
  const { user } = useAuth();
  const { currentEvent } = useEvents();
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user || !currentEvent) return;
    
    const files = Array.from(e.target.files);
    
    // 최대 10개 파일 제한
    if (files.length > 10) {
      alert('한 번에 최대 10개의 이미지만 업로드 가능합니다.');
      return;
    }
    
    try {
      setUploading(true);
      setTotalCount(files.length);
      setUploadedCount(0);
      
      const results = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 이미지 최적화
        const optimizedFile = await storageService.optimizeImage(file, 1920, 1080, 0.9);
        
        // Firebase Storage에 업로드
        const result = await storageService.uploadGalleryImage(currentEvent.id, optimizedFile);
        
        if (result.success && result.url) {
          // Firestore에 갤러리 메타데이터 저장
          await addDocument('gallery', `${currentEvent.id}_${Date.now()}_${i}`, {
            eventId: currentEvent.id,
            eventTitle: currentEvent.title,
            imageUrl: result.url,
            storagePath: result.path,
            uploadedBy: user.id,
            uploaderName: user.name,
            uploadedAt: new Date().toISOString(),
            likes: 0,
            views: 0,
          });
          
          results.push(result);
        }
        
        setUploadedCount(i + 1);
      }
      
      alert(`${results.length}개의 이미지가 업로드되었습니다.`);
      
      // 갤러리 새로고침
      window.location.reload();
      
    } catch (error: any) {
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
      setUploadedCount(0);
      setTotalCount(0);
    }
  };

  return (
    <div>
      <button onClick={() => document.getElementById('gallery-upload')?.click()}>
        사진 업로드
      </button>
      
      <input
        id="gallery-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleMultipleImageUpload}
        disabled={uploading}
        className="hidden"
      />
      
      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">사진 업로드 중...</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{uploadedCount} / {totalCount}</span>
                <span>{Math.round((uploadedCount / totalCount) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(uploadedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 3. 이미지 최적화 활용

```typescript
// 용량이 큰 이미지 자동 최적화
const optimizedFile = await storageService.optimizeImage(
  originalFile,
  1920,    // 최대 너비
  1080,    // 최대 높이
  0.9      // 품질 (0-1)
);

// 프로필 이미지는 작게
const profileOptimized = await storageService.optimizeImage(
  originalFile,
  800,     // 800x800
  800,
  0.85
);

// 썸네일은 더 작게
const thumbnail = await storageService.optimizeImage(
  originalFile,
  300,     // 300x300
  300,
  0.7
);
```

---

## ✅ 구현 체크리스트

### Profile.tsx 통합
- [ ] Storage Service import
- [ ] 이미지 업로드 핸들러 구현
- [ ] 진행률 표시 UI
- [ ] 이미지 미리보기
- [ ] 에러 처리
- [ ] 로딩 상태 관리

### Gallery.tsx 통합
- [ ] Storage Service import
- [ ] 다중 이미지 업로드 구현
- [ ] 진행률 표시 UI
- [ ] Firestore 메타데이터 저장
- [ ] 이미지 그리드 표시
- [ ] 이미지 삭제 기능 (관리자)

### 이미지 최적화
- [ ] 업로드 전 자동 최적화
- [ ] 적절한 크기로 리사이징
- [ ] 품질 조정
- [ ] 파일 크기 검증

### 보안
- [ ] Firebase Storage 규칙 확인
- [ ] 파일 크기 제한
- [ ] 파일 타입 검증
- [ ] 권한 확인

---

## 🔍 테스트 방법

### 1. 프로필 이미지 테스트

```bash
# 1. 개발 서버 실행
npm run dev

# 2. 로그인
# 3. 프로필 페이지 접속
# 4. 이미지 선택 및 업로드
# 5. Firebase Console → Storage 확인
#    - profiles/{userId}/ 경로에 이미지 확인
# 6. 프로필 페이지 새로고침
#    - 업로드한 이미지가 표시되는지 확인
```

### 2. 갤러리 이미지 테스트

```bash
# 1. 로그인 (승인된 회원)
# 2. 갤러리 페이지 접속
# 3. 여러 이미지 선택 및 업로드
# 4. Firebase Console 확인
#    - Storage → gallery/{eventId}/ 경로
#    - Firestore → gallery 컬렉션
# 5. 갤러리 페이지 새로고침
#    - 업로드한 이미지들이 표시되는지 확인
```

### 3. 권한 테스트

```bash
# 1. 승인되지 않은 회원으로 로그인
# 2. 이미지 업로드 시도
#    - 예상: 권한 오류 발생
# 3. Firebase Console → Storage → 규칙 확인
#    - isApproved === true 확인
```

---

## ⚠️ 주의사항

### 1. 파일 크기 제한
- 프로필 이미지: 10MB 이하
- 갤러리 이미지: 10MB 이하
- 공지사항 첨부파일: 20MB 이하

### 2. 지원 파일 형식
- 이미지: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- 자동으로 JPEG로 변환 (최적화 시)

### 3. 스토리지 용량
- Firebase Spark (무료): 5GB
- Firebase Blaze (유료): 종량제
- 정기적인 용량 모니터링 필요

### 4. 보안 규칙
- 본인만 프로필 이미지 업로드 가능
- 승인된 회원만 갤러리 업로드 가능
- 관리자만 이벤트 이미지 업로드 가능

---

## 🆘 문제 해결

### Q: 이미지 업로드가 실패합니다
A: 
1. Firebase Storage 규칙 확인
2. 파일 크기 확인 (10MB 이하)
3. 인증 상태 확인 (`isApproved === true`)
4. 브라우저 콘솔에서 에러 메시지 확인

### Q: 업로드 후 이미지가 표시되지 않습니다
A:
1. Firebase Console → Storage에서 이미지 확인
2. Download URL 생성되었는지 확인
3. Storage 규칙에서 읽기 권한 확인
4. CORS 설정 확인

### Q: 이미지 최적화가 너무 오래 걸립니다
A:
- 원본 파일 크기가 너무 큰 경우
- 최적화 파라미터 조정 (maxWidth, maxHeight 낮추기)
- 또는 최적화 없이 직접 업로드

### Q: 다중 업로드 중 일부만 성공합니다
A:
- 각 파일의 업로드 결과를 개별로 확인
- 실패한 파일은 재시도
- 파일 크기 및 타입 확인

---

## 📝 다음 단계

Phase 6 완료 후:
- **Phase 7로 이동**: 전체 기능 테스트 및 검증
- 모든 이미지 업로드 기능 테스트
- Storage 용량 모니터링 설정
- 이미지 CDN 최적화 (선택사항)

---

**작성일**: 2026-01-19  
**이전 문서**: Phase 5 - 데이터 마이그레이션  
**다음 문서**: Phase 7 - 테스트 및 검증

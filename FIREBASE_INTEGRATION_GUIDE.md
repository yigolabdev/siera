# 🚀 Firebase 백엔드 통합 가이드

## 📋 개요

시애라 프로젝트의 Firebase 백엔드 통합을 위한 완전한 가이드입니다.
전문가 수준의 코드 최적화와 프로덕션 준비가 완료되었습니다.

## ✅ 완료된 작업

### 1. 서비스 레이어 구축 ✅
- **API Service** (`src/services/api.service.ts`)
  - HTTP 요청 래퍼 (retry 로직 포함)
  - 자동 인증 토큰 추가
  - 타임아웃 처리
  - 에러 핸들링

- **Member Service** (`src/services/member.service.ts`)
  - 회원 CRUD 작업
  - 회원 승인/거부
  - 참석률 계산
  - 회원 통계

- **Event Service** (`src/services/event.service.ts`)
  - 산행 이벤트 CRUD
  - 참석자 관리
  - 참석 이력 조회
  - 산행 통계

- **Storage Service** (`src/services/storage.service.ts`)
  - 프로필 이미지 업로드
  - 갤러리 이미지 업로드
  - 이미지 최적화
  - 파일 삭제

### 2. 에러 처리 시스템 ✅
- **Error Handler** (`src/utils/errorHandler.ts`)
  - 구조화된 에러 로깅
  - Firebase 에러 메시지 한글화
  - 전역 에러 핸들러
  - 원격 로깅 지원 (프로덕션)

### 3. 유효성 검증 시스템 ✅
- **Validation Utils** (`src/utils/validation.ts`)
  - 이메일/전화번호/비밀번호 검증
  - 폼 검증 (회원가입/로그인/산행등록/게시글)
  - 파일 업로드 검증
  - 커스텀 검증 규칙

### 4. 성능 최적화 Hooks ✅
- **Performance Hooks** (`src/hooks/usePerformance.ts`)
  - useThrottle
  - useDebounceCallback
  - useIntersectionObserver
  - useVirtualList (가상 스크롤)
  - useImagePreload
  - useResponsive
  - useLazyLoad
  - useOptimisticUpdate

### 5. 향상된 Auth Context ✅
- **Enhanced Auth Context** (`src/contexts/AuthContextEnhanced.tsx`)
  - Firebase Auth 완전 통합
  - Firestore 사용자 정보 동기화
  - 자동 세션 복원
  - 최적화된 리렌더링 (useMemo, useCallback)

---

## 🔥 Firebase 설정 단계

### Step 1: Firebase Console 설정

1. **Firebase 프로젝트 생성**
   ```
   https://console.firebase.google.com
   → 프로젝트 추가
   → 프로젝트 이름: siera-hiking-club
   ```

2. **웹 앱 등록**
   ```
   프로젝트 개요 → "</>" (웹) 아이콘 클릭
   → 앱 닉네임: Siera Web App
   → Firebase Hosting 설정 (선택사항)
   → SDK 설정 코드 복사
   ```

3. **Authentication 활성화**
   ```
   Authentication → 시작하기
   → Sign-in method 탭
   → 이메일/비밀번호 활성화
   ```

4. **Firestore 데이터베이스 생성**
   ```
   Firestore Database → 데이터베이스 만들기
   → 프로덕션 모드로 시작
   → 위치: asia-northeast3 (서울)
   ```

5. **Storage 활성화**
   ```
   Storage → 시작하기
   → 프로덕션 모드로 시작
   → 위치: asia-northeast3 (서울)
   ```

### Step 2: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: OpenWeatherMap API
VITE_WEATHER_API_KEY=your_weather_api_key
```

### Step 3: Firestore 보안 규칙 설정

Firestore Database → 규칙 탭:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isApproved() {
      return request.auth.token.isApproved == true;
    }
    
    function isAdmin() {
      return request.auth.token.role in ['chairman', 'committee'];
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // 회원 정보
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow delete: if isAdmin();
    }
    
    // 산행 이벤트
    match /events/{eventId} {
      allow read: if isAuthenticated() && isApproved();
      allow write: if isAdmin();
    }
    
    // 참석자
    match /participants/{participantId} {
      allow read: if isAuthenticated() && isApproved();
      allow create: if isAuthenticated() && isOwner(request.resource.data.memberId);
      allow update, delete: if isAuthenticated() && (isOwner(resource.data.memberId) || isAdmin());
    }
    
    // 게시글
    match /posts/{postId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isApproved();
      allow update, delete: if isAuthenticated() && (isOwner(resource.data.userId) || isAdmin());
    }
    
    // 공지사항
    match /notices/{noticeId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 사진
    match /photos/{photoId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isApproved();
      allow update, delete: if isAuthenticated() && (isOwner(resource.data.userId) || isAdmin());
    }
  }
}
```

### Step 4: Storage 보안 규칙 설정

Storage → 규칙 탭:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // 프로필 사진
    match /profiles/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 갤러리 사진
    match /gallery/{eventId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.isApproved == true;
    }
    
    // 이벤트 커버 이미지
    match /events/{eventId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role in ['chairman', 'committee'];
    }
  }
}
```

---

## 🔄 마이그레이션 가이드

### Phase 1: AuthContext 교체

**기존 파일**:
- `src/contexts/AuthContext.tsx` (Mock 버전)

**새 파일**:
- `src/contexts/AuthContextEnhanced.tsx` (Firebase 버전)

**교체 방법**:

1. `src/App.tsx` 수정:
```typescript
// Before
import { AuthProvider } from './contexts/AuthContext';

// After
import { AuthProvider } from './contexts/AuthContextEnhanced';
```

2. 또는 `AuthContext.tsx` 파일을 삭제하고 `AuthContextEnhanced.tsx`를 `AuthContext.tsx`로 이름 변경

### Phase 2: 서비스 레이어 사용

**예시: 회원 관리 페이지**

```typescript
// Before (Mock 데이터)
import { mockMembers } from '../data/mockData';

const MemberManagement = () => {
  const [members, setMembers] = useState(mockMembers);
  
  const addMember = (member) => {
    setMembers([...members, member]);
  };
};

// After (Firebase)
import memberService from '../services/member.service';

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadMembers();
  }, []);
  
  const loadMembers = async () => {
    setLoading(true);
    const data = await memberService.getAllMembers();
    setMembers(data);
    setLoading(false);
  };
  
  const addMember = async (member: Omit<Member, 'id'>) => {
    const result = await memberService.addMember(member);
    if (result.success) {
      await loadMembers(); // Refresh
    }
  };
};
```

### Phase 3: 에러 처리 적용

```typescript
import { logError, ErrorCategory, ErrorLevel, handleApiError } from '../utils/errorHandler';

const SomePage = () => {
  const handleAction = async () => {
    try {
      await someApiCall();
    } catch (error: any) {
      logError(error, ErrorLevel.ERROR, ErrorCategory.NETWORK);
      
      const message = handleApiError(error);
      alert(message); // 또는 Toast 알림
    }
  };
};
```

### Phase 4: 유효성 검증 사용

```typescript
import { validateRegistrationForm } from '../utils/validation';

const Register = () => {
  const [formData, setFormData] = useState({...});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 검증
    const validation = validateRegistrationForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    // API 호출
    const result = await register(formData);
    // ...
  };
};
```

---

## 📊 데이터 구조

### Firestore Collections

```
/users/{userId}
  - id: string
  - name: string
  - email: string
  - phoneNumber: string
  - role: 'chairman' | 'committee' | 'member'
  - isApproved: boolean
  - joinDate: string
  - createdAt: timestamp
  - updatedAt: timestamp

/events/{eventId}
  - id: string
  - title: string
  - mountain: string
  - date: string
  - meetingTime: string
  - meetingPlace: string
  - difficulty: string
  - maxParticipants: number
  - currentParticipants: number
  - createdAt: timestamp
  - updatedAt: timestamp

/participants/{participantId}
  - id: string
  - eventId: string
  - memberId: string
  - status: 'attending' | 'absent' | 'pending'
  - createdAt: timestamp

/posts/{postId}
  - id: string
  - userId: string
  - title: string
  - content: string
  - category: string
  - views: number
  - likes: number
  - createdAt: timestamp
  - updatedAt: timestamp

/photos/{photoId}
  - id: string
  - eventId: string
  - userId: string
  - url: string
  - caption: string
  - createdAt: timestamp
```

### Storage Structure

```
/profiles/{userId}/
  - profile_image.jpg
  
/gallery/{eventId}/
  - photo1.jpg
  - photo2.jpg
  
/events/{eventId}/
  - cover_image.jpg
```

---

## 🧪 테스트

### 개발 서버 실행

```bash
npm run dev
```

### Firebase 연결 확인

브라우저 콘솔에서 확인:
```
✅ Firebase initialized successfully
```

### 기능 테스트 체크리스트

- [ ] 회원가입 (Firebase Auth)
- [ ] 로그인/로그아웃
- [ ] 프로필 이미지 업로드
- [ ] 산행 이벤트 등록
- [ ] 산행 신청
- [ ] 게시글 작성
- [ ] 사진 업로드
- [ ] 관리자 회원 승인

---

## 🚨 주의사항

### 1. 환경 변수 보안
- `.env.local` 파일을 **절대 커밋하지 마세요**
- `.gitignore`에 이미 추가되어 있습니다

### 2. Firebase 할당량
- 무료 플랜: Firestore 읽기 50,000/일, 쓰기 20,000/일
- Storage: 5GB
- 필요시 Blaze 플랜으로 업그레이드

### 3. 보안 규칙
- 프로덕션 배포 전 보안 규칙 재확인
- Custom Claims 설정 (role, isApproved)

### 4. 이미지 최적화
- `storage.service.ts`의 `optimizeImage` 함수 사용
- 업로드 전 이미지 크기 조정 (1920x1080, 90% 품질)

---

## 📈 성능 최적화 팁

### 1. 데이터 캐싱
```typescript
// Context에서 데이터 캐싱
const [cachedData, setCachedData] = useState<Data[]>([]);
const lastFetch = useRef<number>(0);

const fetchData = async () => {
  const now = Date.now();
  if (now - lastFetch.current < 60000) { // 1분 캐시
    return cachedData;
  }
  
  const data = await service.getData();
  setCachedData(data);
  lastFetch.current = now;
  return data;
};
```

### 2. 가상 스크롤
```typescript
import { useVirtualList } from '../hooks/usePerformance';

const LargeList = ({ items }) => {
  const { visibleItems, totalHeight, offsetY, handleScroll } = useVirtualList(
    items,
    50, // item height
    600, // container height
    3   // overscan
  );
  
  return (
    <div style={{ height: 600, overflow: 'auto' }} onScroll={handleScroll}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(item => <Item key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
};
```

### 3. Lazy Loading
```typescript
import { useLazyLoad } from '../hooks/usePerformance';

const GalleryImage = ({ imageUrl }) => {
  const { data, loading } = useLazyLoad(
    () => fetch(imageUrl).then(res => res.blob()),
    [imageUrl]
  );
  
  if (loading) return <Skeleton />;
  return <img src={URL.createObjectURL(data)} />;
};
```

---

## 📚 참고 문서

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firestore 데이터 모델링](https://firebase.google.com/docs/firestore/data-model)
- [Firebase 보안 규칙](https://firebase.google.com/docs/rules)
- [React Performance](https://react.dev/learn/render-and-commit)

---

## ✅ 체크리스트

### 초기 설정
- [ ] Firebase 프로젝트 생성
- [ ] 웹 앱 등록
- [ ] `.env.local` 파일 생성
- [ ] Authentication 활성화
- [ ] Firestore 데이터베이스 생성
- [ ] Storage 활성화
- [ ] 보안 규칙 설정

### 코드 마이그레이션
- [ ] AuthContext → AuthContextEnhanced
- [ ] Mock 데이터 → Firebase Service
- [ ] 에러 처리 추가
- [ ] 유효성 검증 추가
- [ ] 성능 최적화 적용

### 테스트
- [ ] 회원가입/로그인 테스트
- [ ] CRUD 작업 테스트
- [ ] 파일 업로드 테스트
- [ ] 권한 체크 테스트

### 배포 준비
- [ ] 환경 변수 GitHub Secrets 등록
- [ ] 프로덕션 빌드 테스트
- [ ] 성능 측정
- [ ] 에러 로깅 확인

---

## 🎉 완료!

모든 설정이 완료되면 프로페셔널한 Firebase 백엔드가 준비됩니다!

**다음 단계**: 
1. `.env.local` 파일 생성
2. Firebase Console에서 프로젝트 설정
3. `npm run dev`로 개발 서버 실행
4. 테스트 시작!

문제가 발생하면 브라우저 콘솔과 Firebase Console을 확인하세요.

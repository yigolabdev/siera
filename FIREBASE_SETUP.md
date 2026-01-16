# Firebase 설정 가이드

## 📋 단계별 설정

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: **siera-hiking-club** (또는 원하는 이름)
4. Google Analytics 활성화 (선택사항)
5. 프로젝트 생성 완료

---

### 2. Firebase 앱 등록

1. 프로젝트 개요 → "웹" 아이콘 (</>)클릭
2. 앱 닉네임: **Siera Web App**
3. Firebase Hosting 설정 체크 (선택사항)
4. "앱 등록" 클릭

---

### 3. Firebase 설정 정보 복사

등록 후 나타나는 설정 코드에서 `firebaseConfig` 객체의 값들을 복사합니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "siera-hiking-club.firebaseapp.com",
  projectId: "siera-hiking-club",
  storageBucket: "siera-hiking-club.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XXXXXXXXXX"
};
```

---

### 4. 환경 변수 설정

`.env.template` 파일을 `.env.local`로 복사하고 값을 채웁니다:

```bash
cp .env.template .env.local
```

`.env.local` 파일 내용:
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=siera-hiking-club.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=siera-hiking-club
VITE_FIREBASE_STORAGE_BUCKET=siera-hiking-club.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

### 5. Firebase Authentication 활성화

1. Firebase Console → **Authentication** 메뉴
2. "시작하기" 클릭
3. **Sign-in method** 탭
4. **이메일/비밀번호** 활성화
5. 저장

---

### 6. Cloud Firestore 생성

1. Firebase Console → **Firestore Database** 메뉴
2. "데이터베이스 만들기" 클릭
3. **프로덕션 모드**로 시작 (보안 규칙은 나중에 설정)
4. 위치: **asia-northeast3 (서울)** 선택
5. 사용 설정

---

### 7. Firebase Storage 활성화

1. Firebase Console → **Storage** 메뉴
2. "시작하기" 클릭
3. **프로덕션 모드**로 시작
4. 위치: **asia-northeast3 (서울)** 선택
5. 완료

---

### 8. Firestore 보안 규칙 설정

Firestore Database → **규칙** 탭에서 아래 규칙을 적용합니다:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 인증된 사용자만 접근 가능
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // 승인된 회원인지 확인
    function isApproved() {
      return request.auth.token.isApproved == true;
    }
    
    // 관리자 권한 확인
    function isAdmin() {
      return request.auth.token.role == 'admin';
    }
    
    // 회원 정보
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                    (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // 산행 이벤트
    match /events/{eventId} {
      allow read: if isAuthenticated() && isApproved();
      allow write: if isAdmin();
      
      // 참가자 서브컬렉션
      match /participants/{userId} {
        allow read: if isAuthenticated() && isApproved();
        allow create: if isAuthenticated() && request.auth.uid == userId;
        allow update, delete: if isAuthenticated() && 
                              (request.auth.uid == userId || isAdmin());
      }
    }
    
    // 게시글
    match /posts/{postId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isApproved();
      allow update, delete: if isAuthenticated() && 
                            (request.auth.uid == resource.data.userId || isAdmin());
    }
    
    // 공지사항
    match /notices/{noticeId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 사진 갤러리
    match /photos/{photoId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isApproved();
      allow update, delete: if isAuthenticated() && 
                            (request.auth.uid == resource.data.userId || isAdmin());
    }
  }
}
```

---

### 9. Storage 보안 규칙 설정

Storage → **규칙** 탭에서 아래 규칙을 적용합니다:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // 프로필 사진
    match /profiles/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 이벤트 이미지
    match /events/{eventId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                   request.auth.token.role in ['admin', 'chairman'];
    }
    
    // 갤러리 사진
    match /gallery/{eventId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                   request.auth.token.isApproved == true;
    }
  }
}
```

---

### 10. 개발 서버 재시작

환경 변수를 설정했으면 개발 서버를 재시작합니다:

```bash
npm run dev
```

---

## ✅ 확인 사항

설정이 완료되면 다음을 확인하세요:

1. ✅ Firebase 프로젝트 생성 완료
2. ✅ 웹 앱 등록 완료
3. ✅ `.env.local` 파일 생성 및 값 입력
4. ✅ Authentication 활성화 (이메일/비밀번호)
5. ✅ Firestore Database 생성 (서울 리전)
6. ✅ Storage 활성화 (서울 리전)
7. ✅ Firestore 보안 규칙 설정
8. ✅ Storage 보안 규칙 설정
9. ✅ 개발 서버 재시작

---

## 🔥 다음 단계

Firebase 설정이 완료되면:

1. **Phase 2**: AuthContext를 Firebase Auth로 마이그레이션
2. **Phase 3**: Mock 데이터를 Firestore로 마이그레이션
3. **Phase 4**: 이미지 업로드를 Firebase Storage로 마이그레이션

---

## 📚 참고 자료

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)
- [Firestore 데이터 모델링](https://firebase.google.com/docs/firestore/data-model)
- [Firebase 보안 규칙](https://firebase.google.com/docs/rules)

---

## ⚠️ 주의사항

1. **`.env.local` 파일은 절대 커밋하지 마세요!**
   - `.gitignore`에 이미 추가되어 있습니다
   
2. **보안 규칙을 반드시 설정하세요**
   - 프로덕션 모드로 시작했으므로 보안 규칙이 필수입니다
   
3. **Firebase 요금제 확인**
   - 현재는 Spark (무료) 플랜 사용
   - 필요시 Blaze (종량제) 플랜으로 업그레이드

4. **리전 선택**
   - 한국 서비스이므로 `asia-northeast3` (서울) 선택 권장

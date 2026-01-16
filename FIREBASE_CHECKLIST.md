# ✅ Firebase 설정 체크리스트

## 📋 진행 상황

- [ ] **1단계: Firebase 프로젝트 생성**
- [ ] **2단계: 웹 앱 등록**
- [ ] **3단계: 환경 변수 설정**
- [ ] **4단계: Authentication 활성화**
- [ ] **5단계: Firestore 데이터베이스 생성**
- [ ] **6단계: Storage 활성화**
- [ ] **7단계: Firestore 보안 규칙 설정**
- [ ] **8단계: Storage 보안 규칙 설정**
- [ ] **9단계: 테스트**

---

## 1️⃣ Firebase 프로젝트 생성

### 작업 위치
```
https://console.firebase.google.com
```

### 작업 내용
1. ✅ "프로젝트 추가" 클릭
2. ✅ 프로젝트 이름: `siera-hiking-club`
3. ✅ Google Analytics 활성화
4. ✅ 프로젝트 생성 완료

### 완료 확인
- [ ] 프로젝트 개요 페이지가 보인다

---

## 2️⃣ 웹 앱 등록

### 작업 위치
프로젝트 개요 → "</>" (웹) 아이콘

### 작업 내용
1. ✅ 앱 닉네임: `Siera Web App`
2. ✅ Firebase Hosting 설정 체크 (선택사항)
3. ✅ "앱 등록" 클릭
4. ✅ Firebase SDK 설정 코드 복사

### 복사할 정보
```javascript
apiKey: "AIza..."
authDomain: "siera-hiking-club.firebaseapp.com"
projectId: "siera-hiking-club"
storageBucket: "siera-hiking-club.appspot.com"
messagingSenderId: "123456789012"
appId: "1:123456789012:web:abc..."
measurementId: "G-XXXXXXXXXX"
```

### 완료 확인
- [ ] Firebase 설정 정보를 모두 복사했다

---

## 3️⃣ 환경 변수 설정

### 방법 1: 스크립트 사용 (추천)
```bash
cd /Users/hyojoonchoi/Documents/Project/Siera/hiking-club
./scripts/setup-firebase-env.sh
```

### 방법 2: 수동 생성
```bash
cp .env.template .env.local
# 에디터로 .env.local 열어서 값 입력
```

### .env.local 파일 내용 예시
```bash
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=siera-hiking-club.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=siera-hiking-club
VITE_FIREBASE_STORAGE_BUCKET=siera-hiking-club.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 완료 확인
- [ ] .env.local 파일이 생성되었다
- [ ] 모든 값이 올바르게 입력되었다

---

## 4️⃣ Authentication 활성화

### 작업 위치
Firebase Console → **Authentication**

### 작업 내용
1. ✅ "시작하기" 클릭
2. ✅ **Sign-in method** 탭 선택
3. ✅ **이메일/비밀번호** 클릭
4. ✅ **사용 설정** 토글 ON
5. ✅ "저장" 클릭

### 완료 확인
- [ ] 이메일/비밀번호가 "사용 설정됨"으로 표시된다

---

## 5️⃣ Firestore 데이터베이스 생성

### 작업 위치
Firebase Console → **Firestore Database**

### 작업 내용
1. ✅ "데이터베이스 만들기" 클릭
2. ✅ **프로덕션 모드**로 시작 선택
3. ✅ "다음" 클릭
4. ✅ 위치: **asia-northeast3 (서울)** 선택
5. ✅ "사용 설정" 클릭
6. ✅ 데이터베이스 생성 대기 (약 1분)

### 완료 확인
- [ ] Firestore 데이터베이스가 생성되었다
- [ ] "데이터" 탭이 보인다

---

## 6️⃣ Storage 활성화

### 작업 위치
Firebase Console → **Storage**

### 작업 내용
1. ✅ "시작하기" 클릭
2. ✅ **프로덕션 모드**로 시작 선택
3. ✅ "다음" 클릭
4. ✅ 위치: **asia-northeast3 (서울)** 선택
5. ✅ "완료" 클릭

### 완료 확인
- [ ] Storage가 활성화되었다
- [ ] "파일" 탭이 보인다

---

## 7️⃣ Firestore 보안 규칙 설정

### 작업 위치
Firestore Database → **규칙** 탭

### 작업 내용
1. ✅ 기존 규칙 전체 삭제
2. ✅ 아래 규칙 복사하여 붙여넣기
3. ✅ "게시" 클릭

### 규칙 코드
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 헬퍼 함수
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isApproved() {
      return request.auth.token.isApproved == true;
    }
    
    function isAdmin() {
      return request.auth.token.role == 'admin';
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
      
      match /participants/{participantId} {
        allow read: if isAuthenticated() && isApproved();
        allow create: if isAuthenticated() && isOwner(participantId);
        allow update, delete: if isAuthenticated() && (isOwner(participantId) || isAdmin());
      }
      
      match /teams/{teamId} {
        allow read: if isAuthenticated() && isApproved();
        allow write: if isAdmin();
      }
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
    
    // 운영진
    match /executives/{executiveId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 이달의 시
    match /poems/{poemId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 게스트 신청
    match /guestApplications/{applicationId} {
      allow read: if isAuthenticated() && (isOwner(resource.data.userId) || isAdmin());
      allow create: if true;  // 누구나 신청 가능
      allow update, delete: if isAdmin();
    }
  }
}
```

### 완료 확인
- [ ] 보안 규칙이 게시되었다
- [ ] 에러 없이 저장되었다

---

## 8️⃣ Storage 보안 규칙 설정

### 작업 위치
Storage → **규칙** 탭

### 작업 내용
1. ✅ 기존 규칙 전체 삭제
2. ✅ 아래 규칙 복사하여 붙여넣기
3. ✅ "게시" 클릭

### 규칙 코드
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
    
    // 문서 (회칙 등)
    match /documents/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                   request.auth.token.role in ['admin', 'chairman'];
    }
  }
}
```

### 완료 확인
- [ ] 보안 규칙이 게시되었다
- [ ] 에러 없이 저장되었다

---

## 9️⃣ 테스트

### 개발 서버 재시작
```bash
cd /Users/hyojoonchoi/Documents/Project/Siera/hiking-club
npm run dev
```

### 브라우저 콘솔 확인
1. ✅ 브라우저에서 http://localhost:5173 접속
2. ✅ F12로 개발자 도구 열기
3. ✅ Console 탭 확인

### 성공 메시지
```
✅ Firebase initialized successfully
```

### 완료 확인
- [ ] 개발 서버가 정상 실행된다
- [ ] Firebase 초기화 성공 메시지가 보인다
- [ ] 에러가 없다

---

## 🎉 완료!

모든 체크박스에 체크했다면 Firebase 설정이 완료되었습니다!

### 다음 단계
- **Phase 2**: AuthContext를 Firebase Auth와 연동
- **Phase 3**: Mock 데이터를 Firestore로 마이그레이션
- **Phase 4**: 이미지 업로드를 Storage로 마이그레이션

---

## ⚠️ 문제 해결

### Firebase 초기화 에러
```
Error: Firebase configuration is invalid
```
→ .env.local 파일의 값들을 다시 확인하세요

### 인증 에러
```
Error: auth/operation-not-allowed
```
→ Authentication에서 이메일/비밀번호를 활성화했는지 확인

### Firestore 접근 에러
```
Error: Missing or insufficient permissions
```
→ Firestore 보안 규칙이 올바르게 설정되었는지 확인

### Storage 업로드 에러
```
Error: storage/unauthorized
```
→ Storage 보안 규칙이 올바르게 설정되었는지 확인

---

## 📞 도움이 필요하신가요?

문제가 발생하면:
1. Firebase Console → **프로젝트 설정** → **일반** 탭에서 설정 확인
2. 브라우저 콘솔에서 에러 메시지 확인
3. .env.local 파일의 값 재확인

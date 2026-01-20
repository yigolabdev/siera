# 🔥 Firebase 설정 가이드

## Phase 1: Firebase 프로젝트 설정 (30분)

이 가이드를 따라 Firebase Console에서 프로젝트를 설정하세요.

### 1️⃣ Firebase 프로젝트 생성

1. **Firebase Console 접속**
   - https://console.firebase.google.com 접속
   - Google 계정으로 로그인

2. **새 프로젝트 추가**
   - "프로젝트 추가" 버튼 클릭
   - 프로젝트 이름: `siera-hiking-club`
   - Google Analytics 활성화 (선택사항, 권장)
   - 약관 동의 후 "프로젝트 만들기" 클릭

---

### 2️⃣ 웹 앱 등록

1. **앱 추가**
   - 프로젝트 개요 페이지에서 `</>` (웹) 아이콘 클릭
   - 앱 닉네임: `Siera Web App`
   - Firebase Hosting 설정은 건너뛰기 (AWS S3 사용)

2. **Firebase SDK 설정 정보 복사**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "siera-hiking-club.firebaseapp.com",
     projectId: "siera-hiking-club",
     storageBucket: "siera-hiking-club.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123",
     measurementId: "G-XXXXXXXXXX"
   };
   ```
   **⚠️ 이 정보를 복사해두세요! 다음 단계에서 사용합니다.**

---

### 3️⃣ Authentication 활성화

1. **Authentication 메뉴 이동**
   - 왼쪽 메뉴에서 "Authentication" 클릭
   - "시작하기" 버튼 클릭

2. **로그인 방법 설정**
   - "Sign-in method" 탭 선택
   - "이메일/비밀번호" 클릭
   - "사용 설정" 토글 활성화
   - "저장" 클릭

---

### 4️⃣ Firestore 데이터베이스 생성

1. **Firestore Database 메뉴 이동**
   - 왼쪽 메뉴에서 "Firestore Database" 클릭
   - "데이터베이스 만들기" 버튼 클릭

2. **보안 규칙 선택**
   - **"프로덕션 모드"** 선택 (권장)
   - "다음" 클릭

3. **위치 선택**
   - 위치: **`asia-northeast3 (Seoul)`** 선택
   - "사용 설정" 클릭
   - 데이터베이스 생성 완료 대기 (약 1분)

---

### 5️⃣ Storage 활성화

1. **Storage 메뉴 이동**
   - 왼쪽 메뉴에서 "Storage" 클릭
   - "시작하기" 버튼 클릭

2. **보안 규칙 선택**
   - **"프로덕션 모드"** 선택
   - "다음" 클릭

3. **위치 선택**
   - 위치: **`asia-northeast3 (Seoul)`** 선택 (Firestore와 동일)
   - "완료" 클릭

---

## ✅ 설정 완료 체크리스트

Phase 1 완료 후 다음 항목을 확인하세요:

- [ ] Firebase 프로젝트 생성됨
- [ ] 웹 앱 등록 완료
- [ ] Firebase SDK 설정 정보 복사됨
- [ ] Authentication 활성화됨 (이메일/비밀번호)
- [ ] Firestore Database 생성됨 (서울 리전)
- [ ] Storage 활성화됨 (서울 리전)

---

## 📝 다음 단계

Phase 1이 완료되었다면:

1. **복사한 Firebase SDK 설정 정보를 준비**
2. **Phase 2로 이동**: 환경 변수 설정
   - `hiking-club/.env.local` 파일에 Firebase 정보 입력
   - 개발 서버 실행 및 테스트

---

## 🆘 문제 해결

### Q: 프로젝트 이름이 이미 사용 중이라고 나옵니다
A: 다른 이름을 사용하세요 (예: `siera-hiking-club-2026`)

### Q: 서울 리전이 없습니다
A: `asia-northeast3`를 검색하거나, 가장 가까운 리전 선택 (예: `asia-northeast1` - 도쿄)

### Q: Firebase SDK 설정 정보를 어디서 다시 확인하나요?
A: 프로젝트 설정 → 일반 → "내 앱" 섹션에서 확인 가능

---

**작성일**: 2026-01-19  
**다음 문서**: Phase 2 - 환경 변수 설정

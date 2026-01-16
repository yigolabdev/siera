# 🔥 Firebase 설정 빠른 시작

Firebase 백엔드 구축을 위한 3가지 문서가 준비되어 있습니다.

## 📚 문서 목록

### 1. [FIREBASE_CHECKLIST.md](./FIREBASE_CHECKLIST.md) ⭐ **지금 시작하세요!**
Firebase Console에서 해야 할 모든 작업을 단계별 체크리스트로 제공합니다.

**포함 내용:**
- ✅ 9단계 체크리스트
- ✅ 각 단계별 상세 가이드
- ✅ 복사/붙여넣기 가능한 보안 규칙
- ✅ 문제 해결 가이드

**시작:**
```bash
# 문서 열기
open FIREBASE_CHECKLIST.md

# 또는 체크리스트를 따라 진행
# 1. Firebase Console 접속
# 2. 프로젝트 생성
# 3. 환경 변수 설정
# ...
```

---

### 2. [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
Firebase 설정에 대한 상세한 설명과 배경 지식을 제공합니다.

**포함 내용:**
- 📖 각 단계에 대한 자세한 설명
- 📖 보안 규칙 설명
- 📖 참고 자료 링크

---

### 3. 환경 변수 설정 스크립트
Firebase 설정 정보를 간편하게 입력할 수 있는 대화형 스크립트입니다.

**사용 방법:**
```bash
cd /Users/hyojoonchoi/Documents/Project/Siera/hiking-club
./scripts/setup-firebase-env.sh
```

스크립트가 질문하면 Firebase Console에서 복사한 값을 붙여넣으면 됩니다.

---

## 🚀 빠른 시작 (5분)

### Step 1: Firebase Console 작업
```
1. https://console.firebase.google.com 접속
2. 프로젝트 생성: "siera-hiking-club"
3. 웹 앱 등록: "</>" 클릭
4. 설정 정보 복사
```

### Step 2: 환경 변수 설정
```bash
# 스크립트 실행
./scripts/setup-firebase-env.sh

# 또는 수동으로
cp .env.template .env.local
# .env.local 파일 편집
```

### Step 3: Firebase 서비스 활성화
```
Firebase Console에서:
1. Authentication → 이메일/비밀번호 활성화
2. Firestore → 데이터베이스 생성 (서울 리전)
3. Storage → 활성화 (서울 리전)
4. 보안 규칙 설정 (FIREBASE_CHECKLIST.md 참고)
```

### Step 4: 테스트
```bash
npm run dev
```

브라우저 콘솔에서 확인:
```
✅ Firebase initialized successfully
```

---

## 📋 현재 진행 상황

```
✅ Phase 1: Firebase 기본 설정 (완료)
   ├── SDK 설치 ✅
   ├── 설정 파일 생성 ✅
   ├── Auth 함수 ✅
   ├── Firestore 함수 ✅
   ├── Storage 함수 ✅
   └── 문서 작성 ✅

🔄 Firebase Console 설정 (진행 중)
   ├── 프로젝트 생성 ⏸️
   ├── 웹 앱 등록 ⏸️
   ├── 환경 변수 설정 ⏸️
   ├── Authentication 활성화 ⏸️
   ├── Firestore 생성 ⏸️
   ├── Storage 활성화 ⏸️
   └── 보안 규칙 설정 ⏸️

⏸️  Phase 2: 인증 마이그레이션 (대기 중)
⏸️  Phase 3: 데이터 마이그레이션 (대기 중)
⏸️  Phase 4: Storage 연동 (대기 중)
```

---

## 🎯 다음 단계

Firebase Console 설정이 완료되면:

1. **Phase 2**: AuthContext를 Firebase Auth와 연동
2. **Phase 3**: Mock 데이터를 Firestore로 마이그레이션
3. **Phase 4**: 이미지 업로드를 Storage로 마이그레이션

---

## 💡 도움말

### 문제가 발생하면?
1. FIREBASE_CHECKLIST.md의 "문제 해결" 섹션 참고
2. 브라우저 콘솔에서 에러 확인
3. Firebase Console → 프로젝트 설정 확인

### 추가 문서
- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firestore 데이터 모델링](https://firebase.google.com/docs/firestore/data-model)
- [Firebase 보안 규칙](https://firebase.google.com/docs/rules)

---

## ⚠️ 중요 사항

1. **`.env.local` 파일은 절대 커밋하지 마세요!**
   - 이미 `.gitignore`에 추가되어 있습니다

2. **보안 규칙을 반드시 설정하세요**
   - 프로덕션 모드로 시작했으므로 필수입니다

3. **서울 리전을 선택하세요**
   - Firestore: asia-northeast3
   - Storage: asia-northeast3

---

## 📞 문의

Firebase 설정 중 문제가 있거나 질문이 있으시면 알려주세요!

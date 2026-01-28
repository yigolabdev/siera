# Firebase 완전 통합 가이드

## 🔥 Firebase 전체 인프라 구성

모든 기능이 Firebase에서 작동합니다:

### 구성 요소
- ✅ **Firebase Authentication**: 사용자 인증 및 권한 관리
- ✅ **Firebase Firestore**: NoSQL 데이터베이스
- ✅ **Firebase Storage**: 파일 저장소
- ✅ **Firebase Hosting**: 웹 애플리케이션 호스팅

---

## 배포 URL

**프로덕션**: https://sierra-be167.web.app
**개발 프리뷰**: https://sierra-be167.firebaseapp.com

---

## Firebase CLI 명령어

### 로컬 테스트
```bash
npm run build
firebase serve
```

### 수동 배포
```bash
npm run build
firebase deploy
```

### Firestore 규칙 배포
```bash
firebase deploy --only firestore:rules
```

### Storage 규칙 배포
```bash
firebase deploy --only storage:rules
```

---

## 자동 배포

GitHub에 푸시하면 자동으로 Firebase Hosting에 배포됩니다.

```bash
git add .
git commit -m "your message"
git push
```

---

## 프로젝트 구조

```
hiking-club/
├── firebase.json          # Firebase 설정
├── .firebaserc            # Firebase 프로젝트 ID
├── firestore.rules        # Firestore 보안 규칙
├── firestore.indexes.json # Firestore 인덱스
├── storage.rules          # Storage 보안 규칙
├── dist/                  # 빌드 결과물
└── .github/workflows/
    └── deploy.yml         # Firebase 배포 워크플로우
```

---

## Firebase Console 바로가기

- **프로젝트**: https://console.firebase.google.com/project/sierra-be167
- **Hosting**: https://console.firebase.google.com/project/sierra-be167/hosting
- **Authentication**: https://console.firebase.google.com/project/sierra-be167/authentication
- **Firestore**: https://console.firebase.google.com/project/sierra-be167/firestore
- **Storage**: https://console.firebase.google.com/project/sierra-be167/storage

---

작성일: 2026-01-28

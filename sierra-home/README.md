# Sierra Home

Vite + React + TypeScript 기반의 정적 웹사이트 프로젝트입니다.  
Firebase Hosting으로 배포합니다.

---

## Requirements
- Node.js (권장: LTS)

---

## Local Development
1) 의존성 설치
```bash
npm install
```

2) 로컬 실행
```bash
npm run dev
```

---

## Build
프로덕션 빌드 (결과물: `dist/`)
```bash
npm run build
```

로컬에서 빌드 결과 확인 (선택)
```bash
npm run preview
```

---

## Deploy (Firebase Hosting)
1) (최초 1회) Firebase CLI 설치 및 로그인
```bash
npm i -g firebase-tools
firebase login
```

2) (최초 1회) Hosting 초기화 (public directory는 `dist`)
```bash
firebase init hosting
```

3) 배포
```bash
npm run build
firebase deploy
```

---

## Notes
- `node_modules/`, `.firebase/` 폴더는 공유/압축에 포함하지 않습니다.
- `.env.local`은 현재 사용하지 않습니다. (필요 시 별도 안내)

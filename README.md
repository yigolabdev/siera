# 시애라 (Siera) - 등산 클럽 웹사이트

50-70대 CEO 및 임원들을 위한 프리미엄 등산 클럽 웹사이트입니다.

## 🚀 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Deployment**: AWS S3 + GitHub Actions

## 📋 주요 기능

### 회원 기능
- ✅ 로그인 / 회원가입 (관리자 승인 필요)
- ✅ 게스트 모드 산행 신청
- ✅ 프로필 관리 및 사진 업로드
- ✅ 로그인 정보 저장 (Remember Me)

### 산행 관리
- ✅ 월별 정기 산행 일정
- ✅ 산행 신청 및 참석자 관리
- ✅ 조 편성 시스템 (조장/조원)
- ✅ 다중 코스 관리 (A코스/B코스)
- ✅ 일정별 상세 동선 정보

### 커뮤니티
- ✅ 게시판 (공지사항/자유게시판/정보공유/질문)
- ✅ 글쓰기 및 댓글 기능
- ✅ 대댓글 (답글) 시스템
- ✅ 좋아요 기능
- ✅ 사진 갤러리 (그리드/메이슨리 뷰)
- ✅ 이미지 뷰어 (확대/축소/슬라이드쇼)
- ✅ 다중 사진 업로드 (드래그 앤 드롭)

### 등산 정보
- ✅ 실시간 날씨 정보 (OpenWeatherMap API)
- ✅ 7일 예보
- ✅ 산행 당일 날씨 상세 정보
- ✅ 추천 산 정보
- ✅ 안전 수칙 및 준비물

### 회원 관리
- ✅ 회원명부 (이름, 직업, 직책)
- ✅ 참여율 통계
- ✅ 입금 정보 관리

### 관리자 기능
- ✅ 산행 일정 등록/수정/삭제
- ✅ 회원 승인 및 관리
- ✅ 조 편성 관리
- ✅ 공지사항 관리

## 🛠️ 로컬 개발

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

### 프리뷰
```bash
npm run preview
```

## 🌐 배포

### 배포 URL

**운영 사이트**: http://sierakorea.s3-website.ap-northeast-2.amazonaws.com

### 자동 배포
`main` 브랜치에 푸시하면 GitHub Actions가 자동으로 S3에 배포합니다.

```bash
git add .
git commit -m "Update: 기능 추가"
git push origin main
```

### 수동 배포
GitHub Actions 탭에서 "Deploy to S3" workflow를 수동으로 실행할 수 있습니다.

## 🔐 환경 변수

### GitHub Secrets (배포용)
GitHub Secrets에 다음 변수를 설정해야 합니다:

- `AWS_ACCESS_KEY_ID`: AWS IAM 액세스 키
- `AWS_SECRET_ACCESS_KEY`: AWS IAM 비밀 키
- `AWS_S3_BUCKET`: S3 버킷 이름
- `AWS_REGION`: AWS 리전 (예: ap-northeast-2)

### 로컬 환경 변수 (선택사항)
프로젝트 루트에 `.env` 파일을 생성하여 날씨 API를 사용할 수 있습니다:

```bash
# .env 파일 생성
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

**OpenWeatherMap API 키 발급 방법:**
1. https://openweathermap.org 회원가입
2. API Keys 메뉴에서 무료 API 키 생성
3. `.env` 파일에 키 추가

> **참고**: API 키가 없어도 더미 데이터로 정상 작동합니다.

## 📱 임시 로그인 정보

### 관리자
- 이메일: admin@siera.com
- 비밀번호: admin123

### 일반 회원
- 임의의 이메일과 비밀번호로 로그인 가능
- 실제 운영 시에는 백엔드 연동 필요

## 📂 프로젝트 구조

```
hiking-club/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 배포 설정
├── src/
│   ├── components/           # 재사용 가능한 컴포넌트
│   │   ├── Layout/          # 레이아웃 컴포넌트
│   │   └── ui/              # UI 컴포넌트
│   ├── contexts/            # React Context
│   │   └── AuthContext.tsx  # 인증 컨텍스트
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── Home.tsx
│   │   ├── Events.tsx
│   │   ├── Gallery.tsx
│   │   ├── Board.tsx
│   │   └── Admin/           # 관리자 페이지
│   ├── types/               # TypeScript 타입 정의
│   ├── utils/               # 유틸리티 함수
│   ├── constants/           # 상수 정의
│   ├── App.tsx             # 메인 앱
│   └── main.tsx            # 진입점
├── dist/                    # 빌드 출력 (배포용)
├── public/                  # 정적 파일
└── package.json
```

## 🎨 디자인 시스템

### 색상
- **Primary**: Green (#10b981)
- **Text**: Gray-900
- **Background**: White, Gray-50

### 타이포그래피
- **Heading**: Bold, 대형
- **Body**: Regular, 가독성 우선

### 컴포넌트
- 카드 기반 디자인
- 부드러운 라운드 처리
- 호버 효과 및 트랜지션

## 📝 TODO

- [ ] 백엔드 API 연동
- [ ] 실제 인증 시스템 구현
- [ ] 이메일 알림 기능
- [ ] 결제 시스템 통합
- [ ] CloudFront CDN 연결
- [ ] 도메인 연결
- [ ] SSL 인증서 설정

## 📄 라이선스

Private - All Rights Reserved

## 👨‍💻 개발자

- 프로젝트명: 시애라 (Siera)
- 개발 연도: 2026
- 대상: 50-70대 CEO 및 임원

---

**함께 오르는 산, 함께 나누는 가치** 🏔️

# 🏗️ 프로덕션 빌드 및 최적화 가이드

## Phase 8: 프로덕션 빌드 준비

배포를 위한 프로덕션 빌드 최적화 가이드입니다.

---

## 📦 빌드 명령어

### 1. 개발 모드 실행

```bash
cd hiking-club
npm run dev
```

- 핫 리로드 활성화
- 소스맵 생성
- console.log 유지

### 2. 프로덕션 빌드

```bash
npm run build
```

- TypeScript 타입 체크
- Vite 빌드
- 코드 최소화 및 압축
- 청크 분할
- console.log 제거

### 3. 빌드 결과 미리보기

```bash
npm run preview
```

- 로컬에서 프로덕션 빌드 테스트
- http://localhost:4173 에서 확인

---

## ⚡ Vite 빌드 최적화

### vite.config.ts 설정

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // 청크 크기 경고 (1MB)
    chunkSizeWarningLimit: 1000,
    
    // 롤업 옵션
    rollupOptions: {
      output: {
        // 수동 청크 분할
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'ui': ['lucide-react'],
        },
      },
    },
    
    // 소스맵 (프로덕션에서는 false)
    sourcemap: false,
    
    // 최소화
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // console.log 제거
        drop_debugger: true, // debugger 제거
      },
    },
  },
})
```

### 청크 분할 전략

| 청크 이름 | 포함 라이브러리 | 예상 크기 |
|-----------|----------------|-----------|
| react-vendor | React, React DOM, React Router | ~150KB |
| firebase | Firebase SDK | ~300KB |
| ui | Lucide Icons | ~50KB |
| App | 앱 코드 | ~200KB |

---

## 📊 빌드 결과 분석

### 번들 크기 확인

```bash
npm run build

# 빌드 결과 확인
ls -lh dist/assets/

# 예상 결과:
# - index-[hash].js       (~200KB)
# - react-vendor-[hash].js (~150KB)
# - firebase-[hash].js     (~300KB)
# - ui-[hash].js           (~50KB)
# - index-[hash].css       (~50KB)
```

### 크기 최적화 목표

- **Initial Load**: < 500KB (gzip)
- **Total Size**: < 1.5MB
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s

---

## 🔧 최적화 체크리스트

### 코드 최적화
- [x] Lazy Loading 적용 (App.tsx)
- [x] Code Splitting (React.lazy, Suspense)
- [x] useMemo, useCallback 활용
- [x] Context 불필요한 리렌더 방지
- [x] 이미지 최적화 (optimizeImage)

### 빌드 최적화
- [x] Vite 청크 분할
- [x] Terser 최소화
- [x] console.log 제거
- [x] 소스맵 비활성화 (프로덕션)
- [x] Tree Shaking

### Assets 최적화
- [x] 이미지 압축 (storage.service.ts)
- [ ] SVG 아이콘 최적화
- [ ] Favicon 최적화
- [ ] Font 로딩 최적화

### 네트워크 최적화
- [ ] Gzip/Brotli 압축 (S3/CloudFront)
- [ ] Cache-Control 헤더 설정
- [ ] CDN 활용 (CloudFront)
- [ ] HTTP/2 Push (선택)

---

## 🌐 환경 변수 관리

### 개발 환경 (.env.local)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
# ...기타 Firebase 설정
```

### 프로덕션 환경

**방법 1: GitHub Secrets (CI/CD)**

```yaml
# .github/workflows/deploy.yml
env:
  VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
  VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
  # ...
```

**방법 2: 빌드 시 환경 변수 주입**

```bash
# 로컬 빌드
VITE_FIREBASE_API_KEY=xxx npm run build
```

---

## 🧪 프로덕션 빌드 테스트

### 1. 빌드 성공 확인

```bash
npm run build

# 예상 출력:
# ✓ 1234 modules transformed.
# dist/index.html                   2.34 kB
# dist/assets/index-abc123.css     52.45 kB
# dist/assets/react-vendor-def456.js  154.23 kB
# dist/assets/firebase-ghi789.js   305.67 kB
# dist/assets/index-jkl012.js      198.92 kB
```

### 2. 미리보기 서버 실행

```bash
npm run preview
```

### 3. 기능 테스트

#### 인증 기능
- [ ] 로그인
- [ ] 로그아웃
- [ ] 회원가입
- [ ] 프로필 수정

#### 산행 기능
- [ ] 산행 목록 조회
- [ ] 산행 신청
- [ ] 입금 정보 확인
- [ ] 조 편성 확인

#### 이미지 업로드
- [ ] 프로필 이미지 업로드
- [ ] 갤러리 이미지 업로드
- [ ] 이미지 최적화 확인

#### 관리자 기능 (Admin 계정)
- [ ] 산행 등록
- [ ] 산행 수정
- [ ] 조 편성
- [ ] 회원 관리

### 4. 성능 측정

**Chrome DevTools Lighthouse**

```bash
# 1. 미리보기 서버 실행
npm run preview

# 2. Chrome DevTools 열기 (F12)
# 3. Lighthouse 탭
# 4. "Generate report" 클릭
```

**목표 점수:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

---

## 📈 성능 모니터링

### Lighthouse 주요 지표

| 지표 | 목표 | 설명 |
|------|------|------|
| First Contentful Paint (FCP) | < 1.5s | 첫 콘텐츠 표시 시간 |
| Largest Contentful Paint (LCP) | < 2.5s | 최대 콘텐츠 표시 시간 |
| Time to Interactive (TTI) | < 3.5s | 상호작용 가능 시간 |
| Total Blocking Time (TBT) | < 300ms | 메인 스레드 차단 시간 |
| Cumulative Layout Shift (CLS) | < 0.1 | 레이아웃 이동 |

### 성능 개선 팁

1. **이미지 최적화**
   - WebP 포맷 사용
   - 적절한 크기로 리사이징
   - Lazy Loading

2. **코드 분할**
   - Route-based splitting
   - Component-based splitting
   - 라이브러리 분리

3. **캐싱**
   - Service Worker (선택)
   - HTTP Cache Headers
   - LocalStorage 활용

4. **네트워크**
   - HTTP/2
   - CDN 사용
   - Prefetch/Preconnect

---

## 🚀 배포 전 최종 체크리스트

### 코드 검증
- [ ] ESLint 오류 없음 (`npm run lint`)
- [ ] TypeScript 오류 없음 (`npm run build`)
- [ ] 테스트 통과 (있는 경우)

### 환경 설정
- [ ] Firebase 프로덕션 프로젝트 설정
- [ ] 환경 변수 모두 설정
- [ ] API 키 보안 확인
- [ ] CORS 설정 확인

### 빌드 확인
- [ ] 프로덕션 빌드 성공 (`npm run build`)
- [ ] 번들 크기 확인 (< 1.5MB)
- [ ] 미리보기 서버 정상 작동
- [ ] 모든 라우트 접근 가능

### 기능 검증
- [ ] 로그인/로그아웃
- [ ] 데이터 CRUD
- [ ] 이미지 업로드
- [ ] 관리자 기능
- [ ] 모바일 반응형

### 성능
- [ ] Lighthouse 점수 > 90
- [ ] 초기 로딩 < 3초
- [ ] 이미지 최적화 확인

### 보안
- [ ] Firebase 보안 규칙 적용
- [ ] HTTPS 강제
- [ ] API 키 노출 확인
- [ ] XSS 방지

---

## 📝 다음 단계

Phase 8 완료 후:
- **Phase 9로 이동**: GitHub Actions CI/CD 설정
- 자동 배포 파이프라인 구축
- S3에 자동 업로드

---

**작성일**: 2026-01-19  
**이전 문서**: Phase 6-7 - Storage 통합 및 테스트  
**다음 문서**: Phase 9 - CI/CD 설정

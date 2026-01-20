# 🚀 GitHub Actions CI/CD 설정 가이드

## Phase 9: CI/CD 파이프라인 구축

GitHub Actions를 사용한 자동 빌드 및 배포 파이프라인 설정 가이드입니다.

---

## 📋 개요

2개의 워크플로우를 구성합니다:

1. **CI (Continuous Integration)**: `ci.yml`
   - Pull Request 시 자동 빌드 및 테스트
   - develop 브랜치 푸시 시 검증

2. **CD (Continuous Deployment)**: `deploy.yml`
   - main 브랜치 푸시 시 자동 배포
   - 수동 배포 지원

---

## 🔧 GitHub Actions 워크플로우

### 1. CI 워크플로우 (ci.yml)

**트리거:**
- Pull Request (main, develop 브랜치)
- develop 브랜치 푸시

**작업:**
1. ✅ 코드 체크아웃
2. ✅ Node.js 설정
3. ✅ 의존성 설치
4. ✅ ESLint 검사
5. ✅ TypeScript 타입 체크 및 빌드
6. ✅ 빌드 결과 아티팩트 업로드
7. ✅ 빌드 통계 출력

### 2. CD 워크플로우 (deploy.yml)

**트리거:**
- main 브랜치 푸시
- 수동 실행 (workflow_dispatch)

**작업:**
1. ✅ 코드 체크아웃
2. ✅ Node.js 설정
3. ✅ 의존성 설치
4. ✅ 환경 변수 설정 (.env.production)
5. ✅ TypeScript 타입 체크 및 빌드
6. ✅ AWS 자격 증명 설정
7. ✅ S3에 배포
8. ✅ index.html 캐시 설정
9. ✅ CloudFront 캐시 무효화 (선택)
10. ✅ 배포 완료 알림

---

## 🔑 GitHub Secrets 설정

### 필수 Secrets

Repository → Settings → Secrets and variables → Actions → New repository secret

#### Firebase 설정 (7개)

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

**값 가져오기:**
```javascript
// Firebase Console → 프로젝트 설정 → 일반 → SDK 설정 및 구성
const firebaseConfig = {
  apiKey: "AIzaSy...",              // VITE_FIREBASE_API_KEY
  authDomain: "xxx.firebaseapp.com", // VITE_FIREBASE_AUTH_DOMAIN
  projectId: "siera-hiking-club",    // VITE_FIREBASE_PROJECT_ID
  storageBucket: "xxx.appspot.com",  // VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",    // VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:xxx:web:xxx",            // VITE_FIREBASE_APP_ID
  measurementId: "G-XXXXXXXXXX"      // VITE_FIREBASE_MEASUREMENT_ID
};
```

#### AWS 설정 (4개)

```
AWS_ACCESS_KEY_ID           # IAM 사용자 액세스 키
AWS_SECRET_ACCESS_KEY       # IAM 사용자 시크릿 키
AWS_S3_BUCKET               # S3 버킷 이름 (예: sierakorea)
AWS_REGION                  # AWS 리전 (예: ap-northeast-2)
```

**AWS IAM 사용자 생성:**

1. AWS Console → IAM → 사용자 → 사용자 추가
2. 사용자 이름: `github-actions-deployer`
3. 액세스 유형: 프로그래밍 방식 액세스
4. 권한: 기존 정책 직접 연결
   - `AmazonS3FullAccess` (또는 커스텀 정책)
5. 액세스 키 ID와 시크릿 키 복사

**커스텀 IAM 정책 (최소 권한):**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::sierakorea/*",
        "arn:aws:s3:::sierakorea"
      ]
    }
  ]
}
```

#### CloudFront (선택사항)

```
AWS_CLOUDFRONT_DISTRIBUTION_ID  # CloudFront 배포 ID (예: E1234567890ABC)
```

---

## 🌿 Git 브랜치 전략

### 브랜치 구조

```
main (프로덕션)
  └── develop (개발)
       └── feature/* (기능 개발)
```

### 워크플로우

1. **기능 개발**
   ```bash
   git checkout -b feature/new-feature develop
   # 개발 작업
   git add .
   git commit -m "feat: 새 기능 추가"
   git push origin feature/new-feature
   ```

2. **Pull Request 생성**
   - feature/* → develop
   - CI 워크플로우 자동 실행
   - 빌드 성공 확인

3. **develop 병합**
   ```bash
   git checkout develop
   git merge feature/new-feature
   git push origin develop
   ```

4. **프로덕션 배포**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```
   - CD 워크플로우 자동 실행
   - S3에 자동 배포

---

## 📊 워크플로우 실행 확인

### GitHub Actions 탭

1. **Repository → Actions**
2. 워크플로우 목록 확인
3. 최근 실행 결과 확인

### 실행 상태

- ✅ **성공**: 모든 단계 완료
- ❌ **실패**: 특정 단계 실패 (로그 확인)
- 🔄 **진행 중**: 실행 중
- ⏸️ **대기 중**: 승인 대기 (선택 시)

### 로그 확인

1. Actions → 워크플로우 선택
2. 실행 기록 클릭
3. 각 단계 로그 확인
4. 오류 메시지 확인 및 수정

---

## 🔄 수동 배포

### GitHub UI에서 실행

1. **Repository → Actions**
2. **Deploy to AWS S3** 워크플로우 선택
3. **Run workflow** 버튼 클릭
4. 브랜치 선택 (main)
5. **Run workflow** 클릭

### 배포 진행 상황 확인

- 실시간 로그 확인
- 각 단계 성공/실패 확인
- 배포 완료 후 URL 확인

---

## 🐛 트러블슈팅

### 문제 1: 빌드 실패 (TypeScript 오류)

**증상:**
```
error TS2345: Argument of type 'X' is not assignable to parameter of type 'Y'
```

**해결:**
```bash
# 로컬에서 빌드 테스트
npm run build

# 타입 오류 수정 후 커밋
git add .
git commit -m "fix: TypeScript 타입 오류 수정"
git push
```

### 문제 2: AWS 인증 실패

**증상:**
```
Error: Could not load credentials from any providers
```

**해결:**
1. GitHub Secrets 확인
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
2. IAM 사용자 권한 확인
3. 키 재생성 및 재설정

### 문제 3: S3 업로드 실패

**증상:**
```
Error: Access Denied
```

**해결:**
1. S3 버킷 정책 확인
2. IAM 정책 확인
3. 버킷 이름 확인 (`AWS_S3_BUCKET`)

### 문제 4: 환경 변수 누락

**증상:**
```
Firebase initialization error
```

**해결:**
1. GitHub Secrets에 모든 Firebase 변수 확인
2. 변수 이름 오타 확인
3. `.env.production` 생성 단계 확인

---

## 📈 배포 최적화

### 1. 캐시 활용

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # npm 캐시 활성화
```

**효과**: 의존성 설치 시간 단축 (3분 → 30초)

### 2. 조건부 CloudFront 무효화

```yaml
- name: Invalidate CloudFront cache
  if: ${{ secrets.AWS_CLOUDFRONT_DISTRIBUTION_ID != '' }}
  run: aws cloudfront create-invalidation ...
```

**효과**: CloudFront 미사용 시 오류 방지

### 3. 아티팩트 저장

```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v4
  with:
    name: dist
    retention-days: 7  # 7일 보관
```

**효과**: 빌드 결과 다운로드 및 디버깅 가능

---

## ✅ 설정 완료 체크리스트

### GitHub 설정
- [ ] `.github/workflows/ci.yml` 생성
- [ ] `.github/workflows/deploy.yml` 생성
- [ ] 파일 커밋 및 푸시

### GitHub Secrets
- [ ] Firebase 환경 변수 (7개) 등록
- [ ] AWS 자격 증명 (4개) 등록
- [ ] CloudFront ID (선택) 등록

### AWS 설정
- [ ] IAM 사용자 생성
- [ ] 액세스 키 생성
- [ ] S3 권한 부여
- [ ] CloudFront 설정 (선택)

### 테스트
- [ ] CI 워크플로우 실행 (PR 생성)
- [ ] CD 워크플로우 실행 (main 푸시)
- [ ] 수동 배포 테스트
- [ ] 배포된 사이트 접속 확인

---

## 📝 다음 단계

Phase 9 완료 후:
- **Phase 10으로 이동**: AWS S3 최종 배포 및 도메인 연결
- S3 버킷 설정 확인
- CloudFront 설정 (선택)
- 커스텀 도메인 연결 (선택)

---

**작성일**: 2026-01-19  
**이전 문서**: Phase 8 - 프로덕션 빌드  
**다음 문서**: Phase 10 - AWS S3 배포

# ☁️ AWS S3 배포 및 도메인 연결 가이드

## Phase 10: 최종 배포

AWS S3에 정적 웹사이트를 호스팅하고 커스텀 도메인을 연결하는 최종 배포 가이드입니다.

---

## 📋 개요

1. **S3 버킷 생성 및 설정**
2. **정적 웹사이트 호스팅 활성화**
3. **버킷 정책 설정**
4. **수동 배포 테스트**
5. **CloudFront 설정 (선택)**
6. **커스텀 도메인 연결 (선택)**

---

## 🪣 S3 버킷 설정

### 1. S3 버킷 생성

**AWS Console → S3 → 버킷 만들기**

```
버킷 이름: sierakorea
리전: 아시아 태평양(서울) ap-northeast-2
```

**주의:**
- 버킷 이름은 전역적으로 고유해야 함
- DNS 호환 이름 사용 (소문자, 숫자, 하이픈만)

### 2. 퍼블릭 액세스 차단 해제

**버킷 선택 → 권한 탭**

"퍼블릭 액세스 차단" 설정:
```
☐ 새 ACL(액세스 제어 목록)을 통해 부여된 버킷 및 객체에 대한 퍼블릭 액세스 차단
☐ 임의의 ACL(액세스 제어 목록)을 통해 부여된 버킷 및 객체에 대한 퍼블릭 액세스 차단
☐ 새 퍼블릭 버킷 또는 액세스 포인트 정책을 통해 부여된 버킷 및 객체에 대한 퍼블릭 액세스 차단
☐ 임의의 퍼블릭 버킷 또는 액세스 포인트 정책을 통해 부여된 버킷 및 객체에 대한 퍼블릭 및 교차 계정 액세스 차단
```

**⚠️ 경고: 정적 웹사이트 호스팅을 위해서는 퍼블릭 액세스가 필요합니다.**

### 3. 정적 웹사이트 호스팅 활성화

**버킷 → 속성 탭 → 정적 웹사이트 호스팅**

```
정적 웹사이트 호스팅: 활성화
호스팅 유형: 정적 웹사이트 호스팅
인덱스 문서: index.html
오류 문서: index.html (SPA 라우팅용)
```

**저장 후 웹사이트 엔드포인트 복사:**
```
http://sierakorea.s3-website.ap-northeast-2.amazonaws.com
```

### 4. 버킷 정책 설정

**버킷 → 권한 탭 → 버킷 정책**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sierakorea/*"
    }
  ]
}
```

**설명:**
- 모든 사용자(`*`)에게 `GetObject` 권한 부여
- 웹사이트 파일 읽기 가능

---

## 🚀 수동 배포 (첫 배포)

### 1. AWS CLI 설치 확인

```bash
aws --version

# 미설치 시
# macOS: brew install awscli
# Windows: https://aws.amazon.com/cli/
```

### 2. AWS 자격 증명 설정

```bash
aws configure
```

입력 정보:
```
AWS Access Key ID: <IAM 액세스 키>
AWS Secret Access Key: <IAM 시크릿 키>
Default region name: ap-northeast-2
Default output format: json
```

### 3. 프로젝트 빌드

```bash
cd hiking-club
npm install
npm run build
```

### 4. S3에 업로드

```bash
# dist/ 폴더를 S3 버킷에 동기화
aws s3 sync dist/ s3://sierakorea --delete

# 업로드된 파일 확인
aws s3 ls s3://sierakorea --recursive
```

**플래그 설명:**
- `--delete`: S3에 있지만 로컬에 없는 파일 삭제
- `--recursive`: 하위 디렉토리 포함

### 5. 배포 확인

웹 브라우저에서 접속:
```
http://sierakorea.s3-website.ap-northeast-2.amazonaws.com
```

---

## 🔄 캐시 설정 최적화

### 1. 정적 자산 캐시 (1년)

```bash
# CSS, JS, 이미지 파일 - 긴 캐시
aws s3 sync dist/assets/ s3://sierakorea/assets/ \
  --cache-control "max-age=31536000,public" \
  --delete
```

### 2. index.html 캐시 (즉시 갱신)

```bash
# index.html - 캐시 없음
aws s3 cp dist/index.html s3://sierakorea/index.html \
  --cache-control "max-age=0,no-cache,no-store,must-revalidate" \
  --content-type "text/html"
```

**이유:**
- 정적 자산: 파일명에 해시 포함 → 긴 캐시 가능
- index.html: 라우팅의 진입점 → 항상 최신 버전

---

## 🌐 CloudFront 설정 (선택사항)

### 왜 CloudFront?

- ✅ **HTTPS 자동 적용**
- ✅ **CDN으로 전 세계 빠른 속도**
- ✅ **커스텀 도메인 연결**
- ✅ **DDoS 보호**

### 1. CloudFront 배포 생성

**AWS Console → CloudFront → 배포 생성**

#### Origin 설정
```
Origin domain: sierakorea.s3-website.ap-northeast-2.amazonaws.com
Origin path: (비워둠)
Name: S3-sierakorea
```

**⚠️ 주의: S3 REST API 엔드포인트가 아닌 웹사이트 엔드포인트 사용**

#### Default Cache Behavior
```
Path pattern: Default (*)
Viewer protocol policy: Redirect HTTP to HTTPS
Allowed HTTP methods: GET, HEAD, OPTIONS
Cache policy: CachingOptimized
```

#### Distribution Settings
```
Price class: Use only North America and Europe (최적 비용)
Alternate domain names (CNAMEs): www.sierakorea.com, sierakorea.com
Custom SSL certificate: 선택 (ACM 인증서)
Default root object: index.html
```

### 2. 오류 페이지 설정 (SPA 라우팅)

**CloudFront 배포 → Error pages 탭 → Create custom error response**

```
HTTP error code: 404
Response page path: /index.html
HTTP response code: 200
```

**이유:** React Router SPA에서 새로고침 시 404 방지

### 3. 배포 ID 확인

```bash
# CloudFront 배포 ID
E1234567890ABC

# GitHub Secrets에 등록
# AWS_CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC
```

### 4. CloudFront 캐시 무효화

```bash
# 수동 캐시 무효화
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

---

## 🔗 커스텀 도메인 연결 (선택사항)

### 1. SSL 인증서 발급 (ACM)

**AWS Certificate Manager → 인증서 요청**

**⚠️ 중요: us-east-1 (버지니아) 리전에서 발급해야 CloudFront 사용 가능**

```
도메인 이름:
  - sierakorea.com
  - *.sierakorea.com (와일드카드)

검증 방법: DNS 검증
```

#### DNS 검증

1. ACM에서 CNAME 레코드 정보 확인
2. 도메인 DNS 관리 페이지에서 CNAME 레코드 추가
3. 검증 완료 대기 (수분~수시간)

### 2. Route 53 설정 (AWS DNS 사용 시)

**Route 53 → 호스팅 영역 → 레코드 생성**

#### A 레코드 (Apex 도메인)
```
레코드 이름: (비워둠) - sierakorea.com
레코드 유형: A
별칭: 예
  - CloudFront 배포
  - Distribution ID 선택
```

#### A 레코드 (www)
```
레코드 이름: www
레코드 유형: A
별칭: 예
  - CloudFront 배포
  - Distribution ID 선택
```

### 3. 외부 DNS 제공업체 (Gabia, Hosting.kr 등)

#### A 레코드 (CloudFront IP 사용 불가)
CloudFront는 IP가 변경되므로 **CNAME 사용 필수**

#### CNAME 레코드
```
호스트: www
값/대상: d1234567890abc.cloudfront.net
TTL: 300
```

#### Apex 도메인 (sierakorea.com)
일부 DNS 제공업체는 Apex 도메인에 CNAME 불가
- 해결책 1: ALIAS 레코드 지원 확인
- 해결책 2: Route 53으로 네임서버 변경
- 해결책 3: www만 사용 (sierakorea.com → www.sierakorea.com 리다이렉트)

### 4. 도메인 연결 확인

```bash
# DNS 전파 확인 (최대 48시간)
nslookup sierakorea.com
nslookup www.sierakorea.com

# 브라우저에서 접속
https://sierakorea.com
https://www.sierakorea.com
```

---

## 📊 배포 후 모니터링

### AWS CloudWatch

**CloudWatch → 대시보드**

#### S3 지표
- **Requests**: 요청 수
- **Bytes Downloaded**: 다운로드 트래픽
- **4xx/5xx Errors**: 오류 발생률

#### CloudFront 지표
- **Requests**: 전체 요청 수
- **Bytes Downloaded**: 전송 데이터량
- **Error Rate**: 오류율
- **Cache Hit Rate**: 캐시 적중률

### 비용 모니터링

**AWS Billing → Cost Explorer**

- S3 저장소 비용: ~$0.025/GB/월
- S3 요청 비용: ~$0.0004/1000 요청
- CloudFront 전송 비용: ~$0.085/GB
- Route 53 호스팅: $0.5/호스팅 영역/월

---

## ✅ 배포 완료 체크리스트

### S3 설정
- [ ] S3 버킷 생성
- [ ] 퍼블릭 액세스 허용
- [ ] 정적 웹사이트 호스팅 활성화
- [ ] 버킷 정책 설정
- [ ] 웹사이트 엔드포인트 접속 확인

### 수동 배포
- [ ] AWS CLI 설치 및 설정
- [ ] 프로젝트 빌드
- [ ] S3에 업로드
- [ ] 배포 확인

### GitHub Actions
- [ ] GitHub Secrets 설정 완료
- [ ] CI 워크플로우 테스트
- [ ] CD 워크플로우 테스트
- [ ] main 브랜치 푸시 시 자동 배포 확인

### CloudFront (선택)
- [ ] CloudFront 배포 생성
- [ ] 오류 페이지 설정 (SPA)
- [ ] HTTPS 접속 확인
- [ ] 캐시 무효화 테스트

### 커스텀 도메인 (선택)
- [ ] SSL 인증서 발급 (ACM)
- [ ] DNS 레코드 설정
- [ ] 도메인 접속 확인
- [ ] HTTPS 리다이렉트 확인

---

## 🆘 문제 해결

### Q: S3 웹사이트 엔드포인트 접속 시 403 Forbidden
A: 
1. 버킷 정책 확인
2. 퍼블릭 액세스 차단 해제 확인
3. 정적 웹사이트 호스팅 활성화 확인

### Q: React Router 경로에서 새로고침 시 404
A:
- S3: 오류 문서를 `index.html`로 설정
- CloudFront: 404 오류를 `/index.html`로 리다이렉트 (200 응답)

### Q: CloudFront에서 변경 사항이 반영되지 않음
A:
```bash
# CloudFront 캐시 무효화
aws cloudfront create-invalidation --distribution-id E123 --paths "/*"
```

### Q: 커스텀 도메인 접속 시 SSL 인증서 오류
A:
1. ACM 인증서가 us-east-1 리전에서 발급되었는지 확인
2. CloudFront 배포에 인증서 연결 확인
3. DNS 전파 완료 대기 (최대 48시간)

### Q: GitHub Actions 배포 실패
A:
1. IAM 사용자 권한 확인
2. S3 버킷 이름 확인
3. GitHub Secrets 확인
4. 워크플로우 로그 확인

---

## 🎉 배포 완료!

축하합니다! 시애라 등산 클럽 웹사이트가 성공적으로 배포되었습니다.

### 최종 URL

- **S3 웹사이트**: http://sierakorea.s3-website.ap-northeast-2.amazonaws.com
- **CloudFront**: https://d1234567890abc.cloudfront.net (있는 경우)
- **커스텀 도메인**: https://sierakorea.com (있는 경우)

### 다음 작업

- [ ] Firebase 데이터 시딩 (초기 산행, 회원 데이터)
- [ ] 관리자 계정 Custom Claims 설정
- [ ] 실제 회원 초대 및 온보딩
- [ ] 모니터링 및 로그 확인
- [ ] 정기적인 백업 설정
- [ ] 사용자 피드백 수집

---

## 📚 관련 문서

- [Firebase 설정 가이드](FIREBASE_SETUP_GUIDE.md)
- [보안 규칙 가이드](FIREBASE_SECURITY_RULES_GUIDE.md)
- [Storage 통합 가이드](FIREBASE_STORAGE_GUIDE.md)
- [프로덕션 빌드 가이드](PRODUCTION_BUILD_GUIDE.md)
- [GitHub Actions 가이드](GITHUB_ACTIONS_GUIDE.md)
- [시스템 플로우 다이어그램](SYSTEM_FLOW_DIAGRAM.md)

---

**작성일**: 2026-01-19  
**버전**: 1.0  
**최종 검토**: 배포 완료 ✅

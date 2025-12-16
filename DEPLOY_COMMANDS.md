# 🚀 배포 명령어 가이드

## 1. GitHub 저장소 생성 후 실행할 명령어

GitHub에서 저장소 생성 후, 터미널에서 실행:

```bash
cd /Users/hyojoonchoi/Documents/Project/Siera/hiking-club

# 원격 저장소 재설정 (이미 추가되어 있으면 스킵)
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/siera.git

# 코드 푸시
git push -u origin main
```

## 2. AWS S3 버킷 정책 (S3 콘솔에서 설정)

버킷 이름: **sierakorea**

S3 콘솔 → sierakorea 버킷 → 권한 → 버킷 정책 → 편집:

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

## 3. GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions → New repository secret

| Secret Name | Value 예시 | 설명 |
|------------|-----------|------|
| `AWS_ACCESS_KEY_ID` | `AKIA...` | IAM 액세스 키 ID |
| `AWS_SECRET_ACCESS_KEY` | `wJalr...` | IAM 비밀 액세스 키 |
| `AWS_S3_BUCKET` | `sierakorea` | S3 버킷 이름 |
| `AWS_REGION` | `ap-northeast-2` | AWS 리전 (서울) |

## 4. 배포 확인

### 자동 배포 확인
- GitHub 저장소 → **Actions** 탭
- "Deploy to S3" workflow 실행 확인
- 약 2-3분 후 배포 완료

### 배포된 사이트 접속
```
http://sierakorea.s3-website.ap-northeast-2.amazonaws.com
```

## 5. 이후 배포 방법

코드 수정 후:

```bash
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin main
```

→ 자동으로 S3에 배포됩니다!

## 6. 수동 배포 (선택사항)

GitHub Actions 없이 직접 배포하려면:

```bash
# 빌드
npm run build

# AWS CLI로 S3 업로드 (AWS CLI 설치 필요)
aws s3 sync dist/ s3://sierakorea --delete
```

## 7. 문제 해결

### 403 Forbidden 에러
- S3 버킷 정책 확인
- "모든 퍼블릭 액세스 차단" 해제 확인

### GitHub Actions 실패
- GitHub Secrets가 모두 설정되어 있는지 확인
- IAM 사용자 권한 확인 (S3FullAccess)

### 페이지가 비어있음
- 브라우저 개발자 도구 콘솔 확인
- S3 정적 웹사이트 호스팅 활성화 확인
- 오류 문서가 `index.html`로 설정되어 있는지 확인

---

## 📞 연락처

문제가 해결되지 않으면 GitHub Issues에 등록하세요.


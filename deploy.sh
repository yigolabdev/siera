#!/bin/bash

# Sierra Club - Firebase 배포 스크립트
# 사용법: ./deploy.sh

set -e

echo "🚀 Sierra Club Firebase 배포 시작..."
echo ""

# 1. 빌드
echo "📦 프로젝트 빌드 중..."
npm run build

echo ""
echo "✅ 빌드 완료!"
echo ""
echo "📤 Firebase 배포 방법:"
echo ""
echo "방법 1) 브라우저에서 수동 배포:"
echo "  1. https://github.com/yigolabdev/siera/actions 접속"
echo "  2. 'Deploy to Firebase Hosting' 클릭"
echo "  3. 'Run workflow' 버튼 클릭"
echo "  4. 브랜치 선택 (main) 후 실행"
echo ""
echo "방법 2) Firebase CLI로 직접 배포 (인증 필요):"
echo "  firebase login         # 로그인 (최초 1회)"
echo "  firebase deploy --only hosting"
echo ""
echo "✨ 배포 URL: https://sierra-be167.web.app"
echo ""

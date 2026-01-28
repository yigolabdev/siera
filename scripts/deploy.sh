#!/bin/bash

# Sierra Club - Firebase 배포 스크립트
# 사용법: npm run deploy

set -e

echo "🚀 Sierra Club Firebase 배포 시작..."
echo ""

# 1. 빌드
echo "📦 프로젝트 빌드 중..."
npm run build

echo ""
echo "✅ 빌드 완료!"
echo ""
echo "📤 다음 중 하나의 방법으로 배포하세요:"
echo ""
echo "방법 1) GitHub Actions (권장):"
echo "  https://github.com/yigolabdev/siera/actions/workflows/deploy.yml"
echo "  → 'Run workflow' 버튼 클릭"
echo ""
echo "방법 2) Firebase CLI (로컬):"
echo "  firebase deploy --only hosting"
echo ""
echo "✨ 배포 URL: https://sierra-be167.web.app"

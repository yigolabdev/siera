#!/bin/bash

# Context 파일들에서 waitForFirebase 제거하는 스크립트

contexts=(
  "AttendanceContext"
  "ParticipationContext"
  "PaymentContext"
  "PendingUserContext"
  "GalleryContext"
  "RulesContext"
  "GuestApplicationContext"
  "HikingHistoryContext"
  "PostContext"
  "ExecutiveContext"
  "NoticeContext"
  "MemberContext"
  "PoemContext"
)

for context in "${contexts[@]}"; do
  file="src/contexts/${context}.tsx"
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # waitForFirebase import 제거
    sed -i '' '/import.*waitForFirebase/d' "$file"
    
    # initializeData 패턴을 직접 호출로 변경
    # useEffect(() => {
    #   const initializeData = async () => {
    #     await waitForFirebase();
    #     await loadXXX();
    #   };
    #   initializeData();
    # }, []);
    # 
    # →
    #
    # useEffect(() => {
    #   loadXXX();
    # }, []);
    
    perl -i -0pe 's/useEffect\(\(\) => \{\s*const initializeData = async \(\) => \{\s*await waitForFirebase\(\);\s*await (load\w+)\(\);(?:\s*await (load\w+)\(\);)?\s*\};\s*initializeData\(\);/useEffect(() => {\n    $1();\n    if ($2) { $2(); }/g' "$file"
    
  fi
done

echo "✅ 모든 Context 업데이트 완료"

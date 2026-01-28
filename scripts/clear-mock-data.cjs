#!/usr/bin/env node

/**
 * Firebase Mock 데이터 삭제 스크립트
 * 
 * 개발용 Mock 데이터를 Firebase에서 삭제합니다.
 */

const admin = require('firebase-admin');
const path = require('path');

// Service Account Key 경로
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Firebase Admin 초기화
const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ========================================
// 삭제 함수들
// ========================================

async function clearCollection(collectionName, keepIds = []) {
  console.log(`📝 ${collectionName} 컬렉션 정리 중...`);
  
  try {
    const snapshot = await db.collection(collectionName).get();
    
    if (snapshot.empty) {
      console.log(`  ℹ️  ${collectionName} 컬렉션이 비어있습니다.`);
      return 0;
    }
    
    let deletedCount = 0;
    const batch = db.batch();
    
    snapshot.docs.forEach((doc) => {
      // keepIds에 포함되지 않은 문서만 삭제
      if (!keepIds.includes(doc.id)) {
        batch.delete(doc.ref);
        deletedCount++;
      }
    });
    
    if (deletedCount > 0) {
      await batch.commit();
      console.log(`  ✅ ${deletedCount}개 문서 삭제 완료`);
    } else {
      console.log(`  ℹ️  삭제할 문서가 없습니다.`);
    }
    
    return deletedCount;
  } catch (error) {
    console.error(`  ❌ ${collectionName} 정리 실패:`, error);
    throw error;
  }
}

async function main() {
  console.log('🔥 Firebase Mock 데이터 삭제 시작\n');
  console.log('='.repeat(80));
  console.log('\n');
  
  try {
    // 산행 이벤트 전체 삭제
    const eventsDeleted = await clearCollection('events');
    
    // 게시글 전체 삭제
    const postsDeleted = await clearCollection('posts');
    
    // 공지사항 전체 삭제
    const noticesDeleted = await clearCollection('notices');
    
    // 참가자 데이터 전체 삭제
    const participantsDeleted = await clearCollection('participants');
    
    // 사진첩 데이터 전체 삭제
    const photosDeleted = await clearCollection('photos');
    
    // 운영진은 유지 (실제 운영진 정보이므로)
    // 회원 정보도 유지 (실제 가입한 회원 정보이므로)
    
    console.log('\n' + '='.repeat(80));
    console.log('\n🎉 Mock 데이터 삭제 완료!\n');
    console.log('📊 삭제된 데이터:');
    console.log(`   - 산행 이벤트: ${eventsDeleted}개`);
    console.log(`   - 게시글: ${postsDeleted}개`);
    console.log(`   - 공지사항: ${noticesDeleted}개`);
    console.log(`   - 참가자: ${participantsDeleted}개`);
    console.log(`   - 사진: ${photosDeleted}개`);
    console.log('\n✅ 회원 정보와 운영진 정보는 보존되었습니다.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 삭제 중 오류 발생:', error);
    process.exit(1);
  }
}

// 실행
main();

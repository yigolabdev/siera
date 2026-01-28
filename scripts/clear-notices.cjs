/**
 * 공지사항 목업 데이터 삭제 스크립트
 * Firebase Firestore의 notices 컬렉션에서 모든 데이터 삭제
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
  });
}

const db = admin.firestore();

async function clearNotices() {
  console.log('🧹 공지사항 데이터 삭제 시작...\n');
  
  try {
    const noticesSnapshot = await db.collection('notices').get();
    
    console.log(`📋 발견된 공지사항: ${noticesSnapshot.size}개\n`);
    
    if (noticesSnapshot.size === 0) {
      console.log('✅ 이미 공지사항이 비어있습니다.');
      return;
    }
    
    // 배치 삭제
    const batch = db.batch();
    
    noticesSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`❌ 삭제: ${data.title} (${data.date})`);
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`\n✅ 총 ${noticesSnapshot.size}개의 공지사항이 삭제되었습니다.`);
    
    // 최종 확인
    const finalSnapshot = await db.collection('notices').get();
    console.log(`\n📊 최종 상태: ${finalSnapshot.size}개의 공지사항`);
    
  } catch (error) {
    console.error('❌ 공지사항 삭제 실패:', error);
    throw error;
  }
}

clearNotices()
  .then(() => {
    console.log('\n🎉 완료! 이제 공지사항 페이지가 비어있습니다.');
    console.log('관리자 페이지(/admin/content)에서 새 공지사항을 작성할 수 있습니다.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 오류 발생:', error);
    process.exit(1);
  });

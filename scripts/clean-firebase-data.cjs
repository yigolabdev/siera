/**
 * Firebase 데이터 정리 스크립트
 * 잘못된 운영진 데이터를 제거합니다.
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

async function cleanData() {
  console.log('🧹 Firebase 데이터 정리 중...\n');
  
  try {
    // category가 undefined인 운영진 제거
    const executivesSnapshot = await db.collection('executives').get();
    
    for (const doc of executivesSnapshot.docs) {
      const data = doc.data();
      
      // category가 undefined이거나 없는 경우 삭제
      if (!data.category) {
        console.log(`❌ 삭제: ${data.name} (${data.position}) - category: ${data.category}`);
        await doc.ref.delete();
      } else {
        console.log(`✅ 유지: ${data.name} (${data.position}) - category: ${data.category}`);
      }
    }
    
    console.log('\n📊 정리 후 운영진 목록:');
    const cleanSnapshot = await db.collection('executives').get();
    console.log(`⭐ 운영진 (executives): ${cleanSnapshot.size}명`);
    cleanSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.name} (${data.position}) - ${data.category}`);
    });
    
  } catch (error) {
    console.error('❌ 데이터 정리 실패:', error);
    throw error;
  }
}

cleanData()
  .then(() => {
    console.log('\n✅ 정리 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 오류 발생:', error);
    process.exit(1);
  });

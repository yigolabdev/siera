/**
 * Firebase 데이터 확인 스크립트
 * 현재 등록된 회원과 운영진 데이터를 확인합니다.
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

async function checkData() {
  console.log('🔍 Firebase 데이터 확인 중...\n');
  
  try {
    // 회원 확인
    const membersSnapshot = await db.collection('members').get();
    console.log(`👥 회원 (members): ${membersSnapshot.size}명`);
    membersSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.name} (${data.position || '일반'})`);
    });
    
    console.log('');
    
    // 운영진 확인
    const executivesSnapshot = await db.collection('executives').get();
    console.log(`⭐ 운영진 (executives): ${executivesSnapshot.size}명`);
    executivesSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.name} (${data.position}) - ${data.category}`);
    });
    
  } catch (error) {
    console.error('❌ 데이터 확인 실패:', error);
    throw error;
  }
}

checkData()
  .then(() => {
    console.log('\n✅ 확인 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 오류 발생:', error);
    process.exit(1);
  });

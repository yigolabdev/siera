/**
 * Firebase 데이터 정리 스크립트
 * choi@yigolab.com 계정만 남기고 나머지 회원/운영진 데이터 삭제
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

async function cleanupData() {
  console.log('🧹 Firebase 데이터 정리 시작...\n');
  
  try {
    const keepEmail = 'choi@yigolab.com';
    const keepName = '최효준';
    let keepMemberId = null;
    
    // 1. Members 컬렉션 정리
    console.log('📋 회원 데이터 정리 중...');
    const membersSnapshot = await db.collection('members').get();
    
    for (const doc of membersSnapshot.docs) {
      const data = doc.data();
      
      if (data.email === keepEmail) {
        keepMemberId = doc.id;
        console.log(`✅ 유지: ${data.name} (${data.email}) - ID: ${doc.id}`);
        
        // 회장 position으로 업데이트
        await doc.ref.update({
          position: 'chairman',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        console.log(`❌ 삭제: ${data.name} (${data.email || '이메일 없음'})`);
        await doc.ref.delete();
      }
    }
    
    // 2. Executives 컬렉션 정리
    console.log('\n⭐ 운영진 데이터 정리 중...');
    const executivesSnapshot = await db.collection('executives').get();
    
    for (const doc of executivesSnapshot.docs) {
      const data = doc.data();
      
      if (data.name === keepName && (data.email === keepEmail || data.memberId === keepMemberId)) {
        console.log(`✅ 유지: ${data.name} (${data.position})`);
        
        // 회장 직책으로 업데이트 (한 명만 남김)
        await doc.ref.update({
          position: '회장',
          category: 'chairman',
          memberId: keepMemberId,
          email: keepEmail,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        console.log(`❌ 삭제: ${data.name} (${data.position})`);
        await doc.ref.delete();
      }
    }
    
    // 최종 확인
    console.log('\n📊 정리 완료 후 상태:');
    
    const finalMembers = await db.collection('members').get();
    console.log(`👥 회원: ${finalMembers.size}명`);
    finalMembers.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.name} (${data.position}) - ${data.email}`);
    });
    
    const finalExecs = await db.collection('executives').get();
    console.log(`\n⭐ 운영진: ${finalExecs.size}명`);
    finalExecs.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.name} (${data.position}) - ${data.category}`);
    });
    
  } catch (error) {
    console.error('❌ 데이터 정리 실패:', error);
    throw error;
  }
}

cleanupData()
  .then(() => {
    console.log('\n✅ 정리 완료! choi@yigolab.com 계정만 남았습니다.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 오류 발생:', error);
    process.exit(1);
  });

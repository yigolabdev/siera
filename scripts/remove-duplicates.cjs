/**
 * 중복 회원 제거 스크립트
 * choi@yigolab.com의 중복 계정 중 하나만 남김
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

async function removeDuplicates() {
  console.log('🧹 중복 회원 제거 시작...\n');
  
  try {
    const keepEmail = 'choi@yigolab.com';
    const membersSnapshot = await db.collection('members').get();
    
    const choiAccounts = [];
    
    // choi@yigolab.com 계정들 찾기
    membersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.email === keepEmail) {
        choiAccounts.push({ id: doc.id, data });
      }
    });
    
    console.log(`📋 발견된 최효준 계정: ${choiAccounts.length}개\n`);
    
    if (choiAccounts.length > 1) {
      // Firebase Auth UID와 일치하는 계정 찾기 (lSup으로 시작)
      const authAccount = choiAccounts.find(acc => acc.id.startsWith('lSup'));
      
      if (authAccount) {
        console.log(`✅ 유지: ${authAccount.id} (Firebase Auth 계정)`);
        
        // 나머지 삭제
        for (const acc of choiAccounts) {
          if (acc.id !== authAccount.id) {
            console.log(`❌ 삭제: ${acc.id} (중복 계정)`);
            await db.collection('members').doc(acc.id).delete();
          }
        }
      } else {
        // Auth 계정이 없으면 첫 번째 계정만 유지
        console.log(`✅ 유지: ${choiAccounts[0].id}`);
        for (let i = 1; i < choiAccounts.length; i++) {
          console.log(`❌ 삭제: ${choiAccounts[i].id} (중복 계정)`);
          await db.collection('members').doc(choiAccounts[i].id).delete();
        }
      }
    }
    
    // 최종 확인
    console.log('\n📊 최종 상태:');
    const finalMembers = await db.collection('members').get();
    console.log(`👥 회원: ${finalMembers.size}명`);
    finalMembers.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.name} (${data.position || '직책 없음'}) - ${data.email} [ID: ${doc.id}]`);
    });
    
  } catch (error) {
    console.error('❌ 중복 제거 실패:', error);
    throw error;
  }
}

removeDuplicates()
  .then(() => {
    console.log('\n✅ 중복 제거 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 오류 발생:', error);
    process.exit(1);
  });

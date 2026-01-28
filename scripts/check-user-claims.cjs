const admin = require('firebase-admin');
const serviceAccount = require('../sierra-be167-firebase-adminsdk-fbsvc-b338ec3d6c.json');

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function checkUserClaims(email) {
  try {
    // 이메일로 사용자 찾기
    const user = await admin.auth().getUserByEmail(email);
    
    console.log('\n=== 사용자 정보 ===');
    console.log('UID:', user.uid);
    console.log('Email:', user.email);
    console.log('Display Name:', user.displayName);
    console.log('\n=== Custom Claims ===');
    console.log(JSON.stringify(user.customClaims, null, 2));
    
    // Firestore에서 사용자 정보 확인
    const db = admin.firestore();
    const memberDoc = await db.collection('members').doc(user.uid).get();
    
    if (memberDoc.exists) {
      console.log('\n=== Firestore 회원 정보 ===');
      console.log(JSON.stringify(memberDoc.data(), null, 2));
    } else {
      console.log('\n⚠️ Firestore에 회원 정보가 없습니다.');
    }
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

// 사용자 이메일 입력 (기본값: choi@yigolab.com)
const userEmail = process.argv[2] || 'choi@yigolab.com';
console.log(`\n🔍 사용자 Custom Claims 확인: ${userEmail}\n`);

checkUserClaims(userEmail).then(() => {
  console.log('\n✅ 완료');
  process.exit(0);
}).catch(error => {
  console.error('❌ 실행 실패:', error);
  process.exit(1);
});

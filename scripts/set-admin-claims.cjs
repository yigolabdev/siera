/**
 * 관리자 Custom Claims 설정 스크립트
 * choi@yigolab.com 계정에 필요한 Custom Claims 부여
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
  });
}

async function setAdminClaims() {
  console.log('🔧 관리자 Custom Claims 설정 시작...\n');
  
  try {
    // UID는 Firebase Console의 Authentication에서 확인
    const uid = 'lSup2mOp4KN7BeRck2fjG04tDB53';
    
    // Custom Claims 설정
    await admin.auth().setCustomUserClaims(uid, {
      role: 'chairman',        // 회장 권한
      isApproved: true,        // 승인된 회원
      isAdmin: true,           // 관리자
    });
    
    console.log('✅ Custom Claims 설정 완료!');
    console.log('   - UID:', uid);
    console.log('   - role: chairman');
    console.log('   - isApproved: true');
    console.log('   - isAdmin: true');
    
    // 확인
    const user = await admin.auth().getUser(uid);
    console.log('\n📋 현재 Custom Claims:');
    console.log(JSON.stringify(user.customClaims, null, 2));
    
    console.log('\n⚠️  변경사항을 적용하려면:');
    console.log('   1. 로그아웃 후 다시 로그인하거나');
    console.log('   2. 토큰을 강제로 새로고침해야 합니다.');
    
  } catch (error) {
    console.error('❌ Custom Claims 설정 실패:', error);
    throw error;
  }
}

setAdminClaims()
  .then(() => {
    console.log('\n✅ 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 오류 발생:', error);
    process.exit(1);
  });

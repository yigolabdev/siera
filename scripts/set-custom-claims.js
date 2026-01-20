#!/usr/bin/env node

/**
 * Firebase Custom Claims 설정 스크립트
 * 
 * 사용법:
 * 1. Firebase Admin SDK Service Account Key 다운로드
 *    Firebase Console → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성
 * 
 * 2. serviceAccountKey.json 파일을 scripts/ 폴더에 저장
 * 
 * 3. 스크립트 실행
 *    node scripts/set-custom-claims.js <email> <role> <isApproved>
 * 
 * 예제:
 *    node scripts/set-custom-claims.js admin@siera.com chairman true
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Service Account Key 경로
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Service Account Key 확인
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ serviceAccountKey.json 파일을 찾을 수 없습니다.');
  console.log('\n다음 단계를 따라 파일을 생성하세요:');
  console.log('1. Firebase Console → 프로젝트 설정 → 서비스 계정');
  console.log('2. "새 비공개 키 생성" 클릭');
  console.log('3. 다운로드한 JSON 파일을 scripts/serviceAccountKey.json으로 저장');
  process.exit(1);
}

// Firebase Admin 초기화
try {
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin SDK 초기화 완료');
} catch (error) {
  console.error('❌ Firebase Admin SDK 초기화 실패:', error.message);
  process.exit(1);
}

/**
 * Custom Claims 설정
 */
async function setCustomClaims(email, role, isApproved) {
  try {
    // 이메일로 사용자 찾기
    const user = await admin.auth().getUserByEmail(email);
    console.log(`✓ 사용자 찾음: ${user.email} (UID: ${user.uid})`);
    
    // Custom Claims 설정
    await admin.auth().setCustomUserClaims(user.uid, {
      role: role,
      isApproved: isApproved === 'true' || isApproved === true
    });
    
    console.log('✅ Custom Claims 설정 완료:');
    console.log(`   - Email: ${email}`);
    console.log(`   - Role: ${role}`);
    console.log(`   - Approved: ${isApproved}`);
    console.log('\n⚠️  사용자는 재로그인이 필요합니다.');
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error('❌ 사용자를 찾을 수 없습니다:', email);
    } else {
      console.error('❌ 오류:', error.message);
    }
    throw error;
  }
}

/**
 * 사용자 목록 조회
 */
async function listUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers(1000);
    
    console.log('\n📋 등록된 사용자 목록:');
    console.log('─'.repeat(80));
    
    listUsersResult.users.forEach((userRecord) => {
      const customClaims = userRecord.customClaims || {};
      console.log(`Email: ${userRecord.email}`);
      console.log(`UID: ${userRecord.uid}`);
      console.log(`Role: ${customClaims.role || '(없음)'}`);
      console.log(`Approved: ${customClaims.isApproved ? '✅' : '❌'}`);
      console.log('─'.repeat(80));
    });
    
  } catch (error) {
    console.error('❌ 사용자 목록 조회 실패:', error.message);
    throw error;
  }
}

/**
 * 메인 함수
 */
async function main() {
  const args = process.argv.slice(2);
  
  // 사용법 표시
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log('\n🔥 Firebase Custom Claims 설정 스크립트');
    console.log('\n사용법:');
    console.log('  node scripts/set-custom-claims.js <email> <role> <isApproved>');
    console.log('  node scripts/set-custom-claims.js --list');
    console.log('\n역할 (role):');
    console.log('  - chairman       : 회장');
    console.log('  - vice_chairman  : 부회장');
    console.log('  - secretary      : 총무');
    console.log('  - committee      : 운영위원');
    console.log('  - member         : 일반 회원');
    console.log('\n예제:');
    console.log('  node scripts/set-custom-claims.js admin@siera.com chairman true');
    console.log('  node scripts/set-custom-claims.js user@siera.com member true');
    console.log('  node scripts/set-custom-claims.js --list');
    process.exit(0);
  }
  
  // 사용자 목록 조회
  if (args[0] === '--list' || args[0] === '-l') {
    await listUsers();
    process.exit(0);
  }
  
  // Custom Claims 설정
  if (args.length < 3) {
    console.error('❌ 인자가 부족합니다.');
    console.log('사용법: node scripts/set-custom-claims.js <email> <role> <isApproved>');
    process.exit(1);
  }
  
  const [email, role, isApproved] = args;
  
  // 역할 검증
  const validRoles = ['chairman', 'vice_chairman', 'secretary', 'committee', 'member'];
  if (!validRoles.includes(role)) {
    console.error(`❌ 유효하지 않은 역할: ${role}`);
    console.log(`유효한 역할: ${validRoles.join(', ')}`);
    process.exit(1);
  }
  
  await setCustomClaims(email, role, isApproved);
  process.exit(0);
}

// 실행
main().catch((error) => {
  console.error('❌ 실행 중 오류 발생:', error);
  process.exit(1);
});

/**
 * 샘플 운영진 데이터 추가 스크립트
 * Firebase Firestore에 샘플 운영진 데이터를 업로드합니다.
 * 
 * 실행 방법:
 *   node scripts/add-sample-executives.cjs
 */

const admin = require('firebase-admin');
const path = require('path');

// Firebase Admin SDK 초기화
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
  });
}

const db = admin.firestore();

// 샘플 운영진 데이터
const sampleExecutives = [
  // 회장단
  {
    id: 'exec_1',
    memberId: '1',
    name: '최효준',
    position: '회장',
    phone: '010-1234-5678',
    email: 'choi@yigolab.com',
    category: 'chairman',
    startTerm: '2024-01',
    endTerm: '2026-12',
    bio: '와이고랩 CEO로 재직 중이며, 시애라 클럽 회장입니다.',
  },
  {
    id: 'exec_2',
    memberId: '2',
    name: '김산행',
    position: '부회장',
    phone: '010-2345-6789',
    email: 'kim.hiking@example.com',
    category: 'chairman',
    startTerm: '2024-01',
    endTerm: '2026-12',
    bio: '법무법인 정상 대표 변호사로 안전한 산행을 최우선으로 합니다.',
  },
  {
    id: 'exec_3',
    memberId: '3',
    name: '박등반',
    position: '총무',
    phone: '010-3456-7890',
    email: 'park.climb@example.com',
    category: 'chairman',
    startTerm: '2024-01',
    endTerm: '2026-12',
    bio: '서울대학교병원 의사로 산행 중 응급처치를 담당합니다.',
  },
  {
    id: 'exec_4',
    memberId: '4',
    name: '이정상',
    position: '재무감사',
    phone: '010-4567-8901',
    email: 'lee.summit@example.com',
    category: 'chairman',
    startTerm: '2024-01',
    endTerm: '2026-12',
    bio: '삼일회계법인 회계사로 회계 업무를 담당합니다.',
  },
  
  // 운영위원
  {
    id: 'exec_5',
    memberId: '5',
    name: '정트레킹',
    position: '교육위원',
    phone: '010-5678-9012',
    email: 'jung.trek@example.com',
    category: 'committee',
    startTerm: '2024-01',
    endTerm: '2026-12',
    bio: '고려대학교 교수로 산행 교육을 담당합니다.',
  },
  {
    id: 'exec_6',
    memberId: '6',
    name: '강백운',
    position: '홍보위원',
    phone: '010-6789-0123',
    email: 'kang.cloud@example.com',
    category: 'committee',
    startTerm: '2024-01',
    endTerm: '2026-12',
    bio: '작가로 활동하며 산행 기록과 홍보를 담당합니다.',
  },
  {
    id: 'exec_7',
    memberId: '11',
    name: '송계곡',
    position: '사진위원',
    phone: '010-1357-2468',
    email: 'song.valley@example.com',
    category: 'committee',
    startTerm: '2024-01',
    endTerm: '2026-12',
    bio: '사진작가로 산행 사진 촬영과 갤러리 관리를 담당합니다.',
  },
  {
    id: 'exec_8',
    memberId: '13',
    name: '임암벽',
    position: '안전위원',
    phone: '010-3579-2468',
    email: 'lim.cliff@example.com',
    category: 'committee',
    startTerm: '2024-01',
    endTerm: '2026-12',
    bio: '체육교사로 산행 안전과 응급처치를 담당합니다.',
  },
];

async function addExecutives() {
  console.log('🚀 운영진 데이터 추가 시작...\n');
  
  try {
    const batch = db.batch();
    
    for (const executive of sampleExecutives) {
      const execRef = db.collection('executives').doc(executive.id);
      batch.set(execRef, {
        ...executive,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ ${executive.name} (${executive.position}) 추가 준비`);
    }
    
    await batch.commit();
    
    console.log(`\n✅ 총 ${sampleExecutives.length}명의 운영진 데이터가 추가되었습니다!`);
    console.log('\n📊 요약:');
    console.log(`  - 회장단: ${sampleExecutives.filter(e => e.category === 'chairman').length}명`);
    console.log(`  - 운영위원: ${sampleExecutives.filter(e => e.category === 'committee').length}명`);
    
  } catch (error) {
    console.error('❌ 운영진 데이터 추가 실패:', error);
    throw error;
  }
}

// 실행
addExecutives()
  .then(() => {
    console.log('\n🎉 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 오류 발생:', error);
    process.exit(1);
  });

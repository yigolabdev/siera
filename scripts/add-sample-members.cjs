/**
 * 샘플 회원 데이터 추가 스크립트
 * Firebase Firestore에 샘플 회원 데이터를 업로드합니다.
 * 
 * 실행 방법:
 *   node scripts/add-sample-members.cjs
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

// 샘플 회원 데이터
const sampleMembers = [
  // 회장단
  {
    id: '1',
    name: '최효준',
    position: 'chairman',
    occupation: 'CEO',
    company: '와이고랩',
    joinDate: '2020-01-15',
    email: 'choi@yigolab.com',
    phone: '010-1234-5678',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    attendanceRate: 95,
    bio: '시애라클럽 회장입니다. 함께 건강한 산행을 즐겨요!',
  },
  {
    id: '2',
    name: '김산행',
    position: 'chairman',
    occupation: '변호사',
    company: '법무법인 정상',
    joinDate: '2020-03-20',
    email: 'kim.hiking@example.com',
    phone: '010-2345-6789',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    attendanceRate: 92,
    bio: '부회장입니다. 안전한 산행을 최우선으로 합니다.',
  },
  {
    id: '3',
    name: '박등반',
    position: 'chairman',
    occupation: '의사',
    company: '서울대학교병원',
    joinDate: '2020-05-10',
    email: 'park.climb@example.com',
    phone: '010-3456-7890',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    attendanceRate: 88,
    bio: '총무입니다. 산행 중 응급처치도 담당합니다.',
  },
  
  // 운영위원
  {
    id: '4',
    name: '이정상',
    position: 'committee',
    occupation: '회계사',
    company: '삼일회계법인',
    joinDate: '2021-02-15',
    email: 'lee.summit@example.com',
    phone: '010-4567-8901',
    profileImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400',
    attendanceRate: 85,
    bio: '운영위원입니다. 회계 업무를 담당합니다.',
  },
  {
    id: '5',
    name: '정트레킹',
    position: 'committee',
    occupation: '교수',
    company: '고려대학교',
    joinDate: '2021-04-20',
    email: 'jung.trek@example.com',
    phone: '010-5678-9012',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    attendanceRate: 90,
    bio: '운영위원입니다. 산행 교육을 담당합니다.',
  },
  {
    id: '6',
    name: '강백운',
    position: 'committee',
    occupation: '작가',
    company: '프리랜서',
    joinDate: '2021-06-01',
    email: 'kang.cloud@example.com',
    phone: '010-6789-0123',
    profileImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
    attendanceRate: 87,
    bio: '운영위원입니다. 산행 기록을 담당합니다.',
  },
  
  // 일반 회원
  {
    id: '7',
    name: '윤설악',
    position: 'member',
    occupation: '디자이너',
    company: '네이버',
    joinDate: '2022-01-10',
    email: 'yoon.seorak@example.com',
    phone: '010-7890-1234',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    attendanceRate: 82,
    bio: '산을 사랑하는 디자이너입니다.',
  },
  {
    id: '8',
    name: '최하이킹',
    position: 'member',
    occupation: '개발자',
    company: '카카오',
    joinDate: '2022-03-15',
    email: 'choi.hiking@example.com',
    phone: '010-8901-2345',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    attendanceRate: 78,
    bio: '주말마다 산을 오르는 개발자입니다.',
  },
  {
    id: '9',
    name: '한봉우리',
    position: 'member',
    occupation: '컨설턴트',
    company: '맥킨지',
    joinDate: '2022-05-20',
    email: 'han.peak@example.com',
    phone: '010-9012-3456',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    attendanceRate: 75,
    bio: '산악회 신입회원입니다. 잘 부탁드립니다!',
  },
  {
    id: '10',
    name: '오등산',
    position: 'member',
    occupation: '기자',
    company: '조선일보',
    joinDate: '2022-07-01',
    email: 'oh.mountain@example.com',
    phone: '010-0123-4567',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    attendanceRate: 80,
    bio: '산행 소식을 전하는 기자입니다.',
  },
  {
    id: '11',
    name: '송계곡',
    position: 'member',
    occupation: '사진작가',
    company: '프리랜서',
    joinDate: '2023-01-15',
    email: 'song.valley@example.com',
    phone: '010-1357-2468',
    profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    attendanceRate: 85,
    bio: '산의 아름다움을 담는 사진작가입니다.',
  },
  {
    id: '12',
    name: '배능선',
    position: 'member',
    occupation: '건축가',
    company: '삼성물산',
    joinDate: '2023-03-20',
    email: 'bae.ridge@example.com',
    phone: '010-2468-1357',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    attendanceRate: 77,
    bio: '건축가이자 산악인입니다.',
  },
  {
    id: '13',
    name: '임암벽',
    position: 'member',
    occupation: '체육교사',
    company: '서울고등학교',
    joinDate: '2023-05-10',
    email: 'lim.cliff@example.com',
    phone: '010-3579-2468',
    profileImage: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca44?w=400',
    attendanceRate: 92,
    bio: '암벽등반을 좋아하는 체육교사입니다.',
  },
  {
    id: '14',
    name: '서계단',
    position: 'member',
    occupation: '약사',
    company: '온누리약국',
    joinDate: '2023-07-01',
    email: 'seo.stairs@example.com',
    phone: '010-4680-3579',
    profileImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
    attendanceRate: 70,
    bio: '건강한 산행을 위해 노력합니다.',
  },
  {
    id: '15',
    name: '남정맥',
    position: 'member',
    occupation: '요리사',
    company: '미슐랭레스토랑',
    joinDate: '2024-01-15',
    email: 'nam.path@example.com',
    phone: '010-5791-4680',
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    attendanceRate: 68,
    bio: '산행 후 맛있는 음식을 즐깁니다.',
  },
  {
    id: '16',
    name: '곽정상',
    position: 'member',
    occupation: '운동선수',
    company: '국가대표',
    joinDate: '2024-03-20',
    email: 'kwak.top@example.com',
    phone: '010-6802-5791',
    profileImage: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400',
    attendanceRate: 95,
    bio: '체력 자신 있습니다!',
  },
  {
    id: '17',
    name: '홍능선',
    position: 'member',
    occupation: '간호사',
    company: '아산병원',
    joinDate: '2024-05-10',
    email: 'hong.ridge@example.com',
    phone: '010-7913-6802',
    profileImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
    attendanceRate: 73,
    bio: '응급처치에 능합니다.',
  },
  {
    id: '18',
    name: '문계곡',
    position: 'member',
    occupation: '변리사',
    company: '특허법인',
    joinDate: '2024-07-01',
    email: 'moon.valley@example.com',
    phone: '010-8024-7913',
    profileImage: 'https://images.unsplash.com/photo-1474176857210-7287d38d27c6?w=400',
    attendanceRate: 65,
    bio: '주말 산행을 즐깁니다.',
  },
  {
    id: '19',
    name: '황봉우리',
    position: 'member',
    occupation: '교사',
    company: '중앙초등학교',
    joinDate: '2025-01-15',
    email: 'hwang.peak@example.com',
    phone: '010-9135-8024',
    profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
    attendanceRate: 80,
    bio: '학생들과 함께 산을 오릅니다.',
  },
  {
    id: '20',
    name: '유암벽',
    position: 'member',
    occupation: '금융인',
    company: 'JP모건',
    joinDate: '2025-03-20',
    email: 'yoo.cliff@example.com',
    phone: '010-0246-9135',
    profileImage: 'https://images.unsplash.com/photo-1464863979621-258859e62245?w=400',
    attendanceRate: 72,
    bio: '암벽등반을 배우고 있습니다.',
  },
];

async function addMembers() {
  console.log('🚀 회원 데이터 추가 시작...\n');
  
  try {
    const batch = db.batch();
    
    for (const member of sampleMembers) {
      const memberRef = db.collection('members').doc(member.id);
      batch.set(memberRef, {
        ...member,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ ${member.name} (${member.position}) 추가 준비`);
    }
    
    await batch.commit();
    
    console.log(`\n✅ 총 ${sampleMembers.length}명의 회원 데이터가 추가되었습니다!`);
    console.log('\n📊 요약:');
    console.log(`  - 회장단: ${sampleMembers.filter(m => m.position === 'chairman').length}명`);
    console.log(`  - 운영위원: ${sampleMembers.filter(m => m.position === 'committee').length}명`);
    console.log(`  - 일반회원: ${sampleMembers.filter(m => m.position === 'member').length}명`);
    
  } catch (error) {
    console.error('❌ 회원 데이터 추가 실패:', error);
    throw error;
  }
}

// 실행
addMembers()
  .then(() => {
    console.log('\n🎉 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 오류 발생:', error);
    process.exit(1);
  });

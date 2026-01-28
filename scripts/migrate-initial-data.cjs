#!/usr/bin/env node

/**
 * Firebase 초기 데이터 마이그레이션 스크립트
 * 
 * Mock 데이터를 Firebase Firestore에 업로드합니다.
 * 
 * 사용법:
 *   node scripts/migrate-initial-data.cjs
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Service Account Key 경로
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Service Account Key 확인
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ serviceAccountKey.json 파일을 찾을 수 없습니다.');
  process.exit(1);
}

// Firebase Admin 초기화
try {
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin SDK 초기화 완료\n');
} catch (error) {
  console.error('❌ Firebase Admin SDK 초기화 실패:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// ========================================
// 초기 데이터
// ========================================

const initialMembers = [
  {
    id: 'lSup2mOp4KN7BeRck2fjG04tDB53',
    name: '최효준',
    email: 'choi@yigolab.com',
    role: 'chairman',
    isApproved: true,
    joinDate: '2026-01-01',
    phoneNumber: '010-1234-5678',
    gender: 'male',
    birthYear: '1985',
    company: 'Yigo Lab',
    position: '대표',
  },
  {
    id: 'IGWrbVuF8nY6UnCk86bjjdc8hC53',
    name: '관리자',
    email: 'admin@siera.com',
    role: 'vice_chairman',
    isApproved: true,
    joinDate: '2026-01-01',
  },
];

const initialEvents = [
  {
    id: '1',
    title: '북한산 백운대 등반',
    date: '2026-02-15',
    location: '북한산 국립공원',
    mountain: '북한산',
    altitude: '836.5m',
    difficulty: '중',
    description: '백운대 정상을 목표로 하는 2월 정기 산행입니다.',
    maxParticipants: 25,
    cost: '60,000원',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    status: 'open',
    applicationDeadline: '2026-02-10',
    isPublished: true,
    paymentInfo: {
      bankName: '국민은행',
      accountNumber: '123-456-789012',
      accountHolder: '시애라',
      managerName: '최효준',
      managerPhone: '010-1234-5678',
      cost: 60000,
    },
    schedule: [
      { time: '07:15', location: '종합운동장역 6번 출구 앞 집결 및 출발', type: 'departure' },
      { time: '08:30-13:30', location: '산행코스 (A조)', type: 'hiking' },
      { time: '13:30-14:30', location: '점심 식사', type: 'lunch' },
      { time: '17:00', location: '종합운동장역 복귀', type: 'arrival' },
    ],
    courses: [
      {
        id: 'course-a',
        name: 'A조',
        difficulty: '중',
        distance: '8.5km',
        duration: '5시간 30분',
        description: '백운대 정상까지 정규 코스',
      },
      {
        id: 'course-b',
        name: 'B조',
        difficulty: '중하',
        distance: '6.2km',
        duration: '4시간',
        description: '완만한 능선 코스',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: '설악산 대청봉 종주',
    date: '2026-03-20',
    location: '설악산 국립공원',
    mountain: '설악산',
    altitude: '1,708m',
    difficulty: '상',
    description: '설악산 대청봉 종주 산행입니다.',
    maxParticipants: 20,
    cost: '80,000원',
    imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=400&fit=crop',
    status: 'draft',
    isPublished: false,
    paymentInfo: {
      bankName: '국민은행',
      accountNumber: '123-456-789012',
      accountHolder: '시애라',
      managerName: '최효준',
      managerPhone: '010-1234-5678',
      cost: 80000,
    },
    schedule: [
      { time: '06:00', location: '버스 출발', type: 'departure' },
      { time: '09:00-15:00', location: '설악산 대청봉 등반', type: 'hiking' },
      { time: '15:00-16:00', location: '점심 및 휴식', type: 'lunch' },
      { time: '19:00', location: '귀가', type: 'arrival' },
    ],
    courses: [
      {
        id: 'course-a',
        name: 'A조',
        difficulty: '상',
        distance: '12km',
        duration: '7시간',
        description: '대청봉 종주 코스',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const initialPosts = [
  {
    id: '1',
    userId: 'lSup2mOp4KN7BeRck2fjG04tDB53',
    authorId: 'lSup2mOp4KN7BeRck2fjG04tDB53',
    author: '최효준',
    category: 'general',
    title: '시애라클럽에 오신 것을 환영합니다!',
    content: '안녕하세요, 시애라클럽 회원 여러분! 건전한 등산 문화를 함께 만들어가요.',
    createdAt: new Date('2026-01-16'),
    updatedAt: new Date('2026-01-16'),
    views: 156,
    comments: 12,
    likes: 24,
  },
  {
    id: '2',
    userId: 'IGWrbVuF8nY6UnCk86bjjdc8hC53',
    authorId: 'IGWrbVuF8nY6UnCk86bjjdc8hC53',
    author: '관리자',
    category: 'info',
    title: '겨울 산행 시 주의사항',
    content: '겨울철 산행 시 꼭 필요한 준비물과 주의사항입니다. 아이젠, 스패츠, 보온병 등을 준비해주세요.',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
    views: 234,
    comments: 8,
    likes: 45,
  },
];

const initialNotices = [
  {
    id: '1',
    title: '2026년 2월 정기산행 안내',
    content: '2월 15일(토) 북한산 백운대 등반을 진행합니다. 오전 7시 15분 종합운동장역 6번 출구 집결 예정이오니 참석하실 회원님들은 미리 신청 부탁드립니다.',
    isPinned: true,
    authorId: 'lSup2mOp4KN7BeRck2fjG04tDB53',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: '2',
    title: '회원 가입 승인 절차 안내',
    content: '시애라클럽은 소수 정예로 운영되는 산악회입니다. 가입 신청 후 운영위원회 심의를 거쳐 승인됩니다.',
    isPinned: false,
    authorId: 'lSup2mOp4KN7BeRck2fjG04tDB53',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10'),
  },
];

const initialExecutives = [
  {
    id: '1',
    name: '최효준',
    role: 'chairman',
    roleLabel: '회장',
    company: 'Yigo Lab',
    position: '대표',
    phoneNumber: '010-1234-5678',
    email: 'choi@yigolab.com',
    imageUrl: '',
    description: '시애라클럽을 이끌어가고 있습니다.',
    isActive: true,
  },
];

// ========================================
// 마이그레이션 함수들
// ========================================

async function migrateMembers() {
  console.log('📝 회원 데이터 마이그레이션 시작...');
  
  try {
    for (const member of initialMembers) {
      await db.collection('members').doc(member.id).set({
        ...member,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`  ✅ ${member.name} (${member.email})`);
    }
    console.log(`✅ 회원 ${initialMembers.length}명 업로드 완료\n`);
  } catch (error) {
    console.error('❌ 회원 데이터 마이그레이션 실패:', error);
    throw error;
  }
}

async function migrateEvents() {
  console.log('📝 산행 이벤트 데이터 마이그레이션 시작...');
  
  try {
    for (const event of initialEvents) {
      await db.collection('events').doc(event.id).set({
        ...event,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`  ✅ ${event.title} (${event.date})`);
    }
    console.log(`✅ 산행 이벤트 ${initialEvents.length}개 업로드 완료\n`);
  } catch (error) {
    console.error('❌ 산행 이벤트 데이터 마이그레이션 실패:', error);
    throw error;
  }
}

async function migratePosts() {
  console.log('📝 게시글 데이터 마이그레이션 시작...');
  
  try {
    for (const post of initialPosts) {
      await db.collection('posts').doc(post.id).set({
        ...post,
        createdAt: admin.firestore.Timestamp.fromDate(post.createdAt),
        updatedAt: admin.firestore.Timestamp.fromDate(post.updatedAt),
      });
      console.log(`  ✅ ${post.title}`);
    }
    console.log(`✅ 게시글 ${initialPosts.length}개 업로드 완료\n`);
  } catch (error) {
    console.error('❌ 게시글 데이터 마이그레이션 실패:', error);
    throw error;
  }
}

async function migrateNotices() {
  console.log('📝 공지사항 데이터 마이그레이션 시작...');
  
  try {
    for (const notice of initialNotices) {
      await db.collection('notices').doc(notice.id).set({
        ...notice,
        createdAt: admin.firestore.Timestamp.fromDate(notice.createdAt),
        updatedAt: admin.firestore.Timestamp.fromDate(notice.updatedAt),
      });
      console.log(`  ✅ ${notice.title}`);
    }
    console.log(`✅ 공지사항 ${initialNotices.length}개 업로드 완료\n`);
  } catch (error) {
    console.error('❌ 공지사항 데이터 마이그레이션 실패:', error);
    throw error;
  }
}

async function migrateExecutives() {
  console.log('📝 운영진 데이터 마이그레이션 시작...');
  
  try {
    for (const executive of initialExecutives) {
      await db.collection('executives').doc(executive.id).set({
        ...executive,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`  ✅ ${executive.name} (${executive.roleLabel})`);
    }
    console.log(`✅ 운영진 ${initialExecutives.length}명 업로드 완료\n`);
  } catch (error) {
    console.error('❌ 운영진 데이터 마이그레이션 실패:', error);
    throw error;
  }
}

// ========================================
// 메인 함수
// ========================================

async function main() {
  console.log('🔥 Firebase 초기 데이터 마이그레이션 시작\n');
  console.log('=' .repeat(80));
  console.log('\n');
  
  try {
    await migrateMembers();
    await migrateEvents();
    await migratePosts();
    await migrateNotices();
    await migrateExecutives();
    
    console.log('=' .repeat(80));
    console.log('\n🎉 모든 데이터 마이그레이션 완료!\n');
    console.log('📊 업로드된 데이터:');
    console.log(`   - 회원: ${initialMembers.length}명`);
    console.log(`   - 산행 이벤트: ${initialEvents.length}개`);
    console.log(`   - 게시글: ${initialPosts.length}개`);
    console.log(`   - 공지사항: ${initialNotices.length}개`);
    console.log(`   - 운영진: ${initialExecutives.length}명`);
    console.log('\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 마이그레이션 중 오류 발생:', error);
    process.exit(1);
  }
}

// 실행
main();

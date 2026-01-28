/**
 * Firebase Firestore 컬렉션 구조 초기화 스크립트
 * 
 * 이 스크립트는 DBML 스키마에 정의된 컬렉션 구조를 Firebase에 생성합니다.
 * 
 * 사용법:
 * 1. Firebase 콘솔에 로그인
 * 2. Firestore Database 메뉴 선택
 * 3. 각 컬렉션의 예시 문서를 수동으로 생성
 * 
 * 또는 이 파일을 참고하여 Context 파일에서 초기 데이터 생성
 */

import { db } from './lib/firebase/config';
import { collection, doc, setDoc } from 'firebase/firestore';

/**
 * 컬렉션 구조 정의
 */
export const COLLECTION_STRUCTURE = {
  // 1. 회원 관리
  members: {
    description: '회원 및 사용자 정보 (Firebase Auth 연동)',
    example: {
      id: 'user_uid',
      name: '홍길동',
      email: 'test@example.com',
      phoneNumber: '010-1234-5678',
      gender: '남',
      birthYear: '1990',
      company: '회사명',
      position: '직책',
      role: 'member',
      joinDate: '2026-01-01',
      isApproved: true,
      isActive: true,
      profileImage: '',
      bio: '',
      attendanceRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      referredBy: '',
      hikingLevel: '중',
    },
  },

  pendingUsers: {
    description: '가입 승인 대기 회원',
    example: {
      id: 'pending_uid',
      name: '대기자',
      email: 'pending@example.com',
      phoneNumber: '010-1234-5678',
      gender: '남',
      birthYear: '1990',
      company: '회사명',
      position: '직책',
      referredBy: '',
      hikingLevel: '중',
      applicationMessage: '가입 신청합니다',
      appliedAt: new Date().toISOString(),
      status: 'pending',
    },
  },

  executives: {
    description: '운영진 정보 (회장단, 운영위원회)',
    example: {
      id: 'exec_1',
      memberId: 'user_uid',
      name: '회장',
      position: '회장',
      phoneNumber: '010-1234-5678',
      email: 'exec@example.com',
      category: 'chairman',
      company: '회사명',
      startTerm: '2026-01',
      endTerm: '2027-12',
      bio: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  // 2. 산행 관리
  events: {
    description: '산행 이벤트 정보',
    example: {
      id: 'event_1',
      title: '시애라 정기산행',
      date: '2026-02-15',
      location: '경기도',
      mountain: '북한산',
      altitude: '836m',
      difficulty: '중',
      description: '북한산 정기산행입니다',
      maxParticipants: 100,
      cost: '30000',
      imageUrl: '',
      emergencyContactId: 'exec_1',
      emergencyContactName: '회장',
      emergencyContactPhone: '010-1234-5678',
      isSpecial: false,
      isPublished: true,
      isDraft: false,
      status: 'open',
      applicationDeadline: '2026-02-10',
      courses: [
        {
          id: 'course_1',
          name: 'A코스',
          description: '초보자 코스',
          distance: '5km',
          duration: '3시간',
          difficulty: '하',
        },
      ],
      createdAt: new Date().toISOString(),
    },
  },

  teams: {
    description: '조편성 정보',
    example: {
      id: 'team_1',
      eventId: 'event_1',
      eventTitle: '시애라 정기산행',
      number: 1,
      name: '1조',
      leaderId: 'user_uid',
      leaderName: '조장',
      leaderCompany: '회사명',
      leaderPosition: '직책',
      leaderPhone: '010-1234-5678',
      members: [
        {
          id: 'member_1',
          userId: 'user_uid',
          name: '회원',
          company: '회사명',
          position: '직책',
          phoneNumber: '010-1234-5678',
          isGuest: false,
        },
      ],
    },
  },

  // 3. 참가 관리
  participations: {
    description: '산행 참가 신청 기록',
    example: {
      id: 'participation_1',
      eventId: 'event_1',
      userId: 'user_uid',
      userName: '홍길동',
      userEmail: 'test@example.com',
      isGuest: false,
      status: 'confirmed',
      registeredAt: new Date().toISOString(),
      teamId: 'team_1',
      teamName: '1조',
      paymentStatus: 'pending',
      specialRequirements: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  guestApplications: {
    description: '게스트 신청 정보',
    example: {
      id: 'guest_1',
      name: '게스트',
      email: 'guest@example.com',
      phoneNumber: '010-1234-5678',
      company: '회사명',
      position: '직책',
      eventId: 'event_1',
      eventTitle: '시애라 정기산행',
      eventDate: '2026-02-15',
      appliedAt: new Date().toISOString(),
      status: 'pending',
      referredBy: '추천인',
    },
  },

  // 4. 결제 & 출석
  payments: {
    description: '결제 정보',
    example: {
      id: 'payment_1',
      eventId: 'event_1',
      userId: 'user_uid',
      userName: '홍길동',
      isGuest: false,
      company: '회사명',
      position: '직책',
      phoneNumber: '010-1234-5678',
      email: 'test@example.com',
      applicationDate: '2026-02-01',
      paymentStatus: 'pending',
      amount: 30000,
      paymentMethod: '계좌이체',
      memo: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  attendances: {
    description: '출석 기록',
    example: {
      id: 'attendance_1',
      eventId: 'event_1',
      userId: 'user_uid',
      userName: '홍길동',
      attendanceStatus: 'present',
      checkInTime: new Date().toISOString(),
      notes: '',
      recordedBy: 'admin_uid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  // 5. 콘텐츠
  photos: {
    description: '사진 갤러리',
    example: {
      id: 'photo_1',
      eventId: 'event_1',
      eventTitle: '시애라 정기산행',
      eventYear: '2026',
      eventMonth: '02',
      uploadedBy: 'user_uid',
      uploadedByName: '홍길동',
      uploadedAt: new Date().toISOString(),
      imageUrl: 'https://storage.googleapis.com/...',
      caption: '북한산 정상',
      likes: 0,
      likedBy: [],
    },
  },

  posts: {
    description: '게시판 글',
    example: {
      id: 'post_1',
      category: 'general',
      title: '게시글 제목',
      author: '홍길동',
      authorId: 'user_uid',
      content: '게시글 내용',
      date: '2026-01-29',
      views: 0,
      comments: 0,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  comments: {
    description: '게시글 댓글',
    example: {
      id: 'comment_1',
      postId: 'post_1',
      author: '홍길동',
      authorId: 'user_uid',
      content: '댓글 내용',
      date: '2026-01-29',
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  notices: {
    description: '공지사항',
    example: {
      id: 'notice_1',
      title: '공지사항 제목',
      content: '공지사항 내용',
      date: '2026-01-29',
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  // 6. 산행 기록
  hikingHistory: {
    description: '산행 기록 (과거 산행 아카이브)',
    example: {
      id: 'hike_1',
      year: '2026',
      month: '01',
      date: '2026-01-15',
      mountain: '북한산',
      location: '경기도',
      participants: 50,
      distance: '10km',
      duration: '4시간',
      difficulty: '중',
      weather: '맑음',
      temperature: '5°C',
      imageUrl: '',
      isSpecial: false,
      summary: '즐거운 산행이었습니다',
      photoCount: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  hikingComments: {
    description: '산행 기록 댓글',
    example: {
      id: 'hike_comment_1',
      hikeId: 'hike_1',
      authorId: 'user_uid',
      authorName: '홍길동',
      content: '좋은 산행이었습니다',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  // 7. 기타
  poems: {
    description: '월별 시',
    example: {
      id: 'poem_1',
      title: '시 제목',
      author: '작가',
      authorId: 'user_uid',
      content: '시 내용',
      month: '2026-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  rules: {
    description: '클럽 규칙 및 회칙',
    example: {
      id: 'rule_1',
      content: '규칙 내용',
      version: '1.0',
      effectiveDate: '2026-01-01',
      amendments: [
        {
          version: '1.0',
          date: '2026-01-01',
          description: '최초 제정',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

/**
 * Firebase 콘솔에서 수동으로 컬렉션 생성 가이드
 */
export const SETUP_GUIDE = `
Firebase Firestore 컬렉션 설정 가이드
======================================

1. Firebase 콘솔 접속
   https://console.firebase.google.com/

2. 프로젝트 선택: sierra-be167

3. Firestore Database 메뉴 선택

4. 다음 컬렉션들이 존재하는지 확인:
   ✅ members (users)
   ✅ pendingUsers
   ✅ executives
   ✅ events
   ✅ teams
   ✅ participations
   ✅ guestApplications
   ✅ payments
   ✅ attendances
   ✅ photos
   ✅ posts
   ✅ comments
   ✅ notices
   ✅ hikingHistory
   ✅ hikingComments
   ✅ poems
   ✅ rules

5. 누락된 컬렉션은 다음과 같이 생성:
   a. "컬렉션 시작" 클릭
   b. 컬렉션 ID 입력 (예: notices)
   c. 문서 ID: 자동 생성 또는 수동 입력
   d. 필드 추가 (FIRESTORE_STRUCTURE.md 참고)
   e. "저장" 클릭

6. 인덱스 설정 (필요시):
   - Firestore → 색인 메뉴
   - 복합 색인 생성
   - 컬렉션별 인덱스 추가

7. 보안 규칙 확인:
   - Firestore → 규칙 메뉴
   - firestore.rules 파일 내용과 일치 확인

완료!
`;

/**
 * 예시 데이터 생성 함수 (개발용)
 */
export const initializeCollections = async () => {
  console.log('🔧 Firebase 컬렉션 초기화 시작...');
  
  try {
    // 각 컬렉션에 예시 문서 생성
    for (const [collectionName, config] of Object.entries(COLLECTION_STRUCTURE)) {
      const collectionRef = collection(db, collectionName);
      const docRef = doc(collectionRef, `example_${Date.now()}`);
      
      await setDoc(docRef, {
        ...config.example,
        _isExample: true,
        _createdBy: 'init_script',
        _createdAt: new Date().toISOString(),
      });
      
      console.log(`✅ ${collectionName} 컬렉션 생성 완료`);
    }
    
    console.log('🎉 모든 컬렉션 초기화 완료!');
  } catch (error) {
    console.error('❌ 컬렉션 초기화 실패:', error);
  }
};

/**
 * 컬렉션 구조 확인 함수
 */
export const checkCollections = () => {
  console.log('📋 Firebase Firestore 컬렉션 구조');
  console.log('=====================================\n');
  
  let index = 1;
  for (const [collectionName, config] of Object.entries(COLLECTION_STRUCTURE)) {
    console.log(`${index}. ${collectionName}`);
    console.log(`   설명: ${config.description}`);
    console.log(`   예시 필드: ${Object.keys(config.example).join(', ')}`);
    console.log('');
    index++;
  }
  
  console.log(`총 ${Object.keys(COLLECTION_STRUCTURE).length}개 컬렉션`);
  console.log('\n상세 구조는 FIRESTORE_STRUCTURE.md 참고');
};

// 자동 실행 방지
if (require.main === module) {
  console.log(SETUP_GUIDE);
  checkCollections();
}

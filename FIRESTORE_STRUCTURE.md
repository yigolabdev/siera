# Firebase Firestore 컬렉션 구조

이 문서는 database-schema.dbml을 기반으로 한 Firebase Firestore 컬렉션 구조입니다.

## 📋 컬렉션 목록 (19개)

### ✅ 구현된 컬렉션 (보안 규칙 포함)

| 번호 | 컬렉션명 | DBML 테이블 | 용도 | 상태 |
|------|----------|-------------|------|------|
| 1 | `members` (users) | users | 회원 정보 | ✅ 완료 |
| 2 | `pendingUsers` | pendingUsers | 가입 승인 대기 | ✅ 완료 |
| 3 | `executives` | executives | 운영진 정보 | ✅ 완료 |
| 4 | `events` | events | 산행 이벤트 | ✅ 완료 |
| 5 | `teams` | teams | 조편성 | ✅ 완료 |
| 6 | `participations` | participations | 참가 신청 | ✅ 완료 |
| 7 | `guestApplications` | guestApplications | 게스트 신청 | ✅ 완료 |
| 8 | `payments` | payments | 결제 정보 | ✅ 완료 |
| 9 | `attendances` | attendances | 출석 기록 | ✅ 완료 |
| 10 | `photos` | photos | 사진 갤러리 | ✅ 완료 |
| 11 | `posts` | posts | 게시판 글 | ✅ 완료 |
| 12 | `comments` | comments | 게시글 댓글 | ✅ 완료 |
| 13 | `notices` | notices | 공지사항 | ✅ 완료 |
| 14 | `hikingHistory` | hikingHistory | 산행 기록 | ✅ 완료 |
| 15 | `hikingComments` | hikingComments | 산행 댓글 | ✅ 완료 |
| 16 | `poems` | poems | 월별 시 | ✅ 완료 |
| 17 | `rules` | rules | 클럽 규칙 | ✅ 완료 |

### ⚠️ 누락된 컬렉션 (DBML에는 있으나 미사용)

| 번호 | 컬렉션명 | DBML 테이블 | 용도 | 상태 |
|------|----------|-------------|------|------|
| 18 | `courses` | courses | 코스 정보 | ⚠️ 서브컬렉션 또는 events 내부 필드로 구현 |
| 19 | `scheduleItems` | scheduleItems | 상세 일정 | ⚠️ courses 내부 필드로 구현 |
| 20 | `teamMembers` | teamMembers | 조원 정보 | ⚠️ teams 내부 배열로 구현 |

---

## 📚 컬렉션 상세 구조

### 1. users (members)
```typescript
{
  id: string;                    // Firebase Auth UID
  name: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  birthYear?: string;
  company?: string;
  position?: string;             // 직장 직책
  role: 'admin' | 'chairman' | 'committee' | 'member' | 'guest';
  joinDate?: string;
  isApproved: boolean;
  isActive?: boolean;            // 활성화 상태
  profileImage?: string;         // Firebase Storage URL
  bio?: string;
  attendanceRate?: number;
  createdAt: string;
  updatedAt: string;
  referredBy?: string;
  hikingLevel?: string;
}
```

**인덱스:**
- `email` (unique)
- `role`
- `isApproved`
- `isActive`

---

### 2. pendingUsers
```typescript
{
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  birthYear: string;
  company: string;
  position: string;
  referredBy?: string;
  hikingLevel: string;
  applicationMessage?: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  rejectedAt?: string;
}
```

**인덱스:**
- `email`
- `status`
- `appliedAt`

---

### 3. executives
```typescript
{
  id: string;
  memberId?: string;             // members 컬렉션 참조
  name: string;
  position: string;              // 시애라 직책 (회장, 총무 등)
  phoneNumber: string;
  email?: string;
  category: 'chairman' | 'committee';
  company?: string;
  startTerm?: string;            // YYYY-MM
  endTerm?: string;              // YYYY-MM
  bio?: string;
  createdAt: string;
  updatedAt: string;
}
```

**인덱스:**
- `memberId`
- `category`

---

### 4. events
```typescript
{
  id: string;
  title: string;
  date: string;                  // YYYY-MM-DD
  location: string;
  mountain?: string;
  altitude?: string;
  difficulty: '하' | '중하' | '중' | '중상' | '상';
  description: string;
  maxParticipants: number;
  cost: string;
  imageUrl?: string;             // Firebase Storage URL
  
  // 비상연락처
  emergencyContactId?: string;   // executives 참조
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  // 상태 관리
  isSpecial?: boolean;
  isPublished?: boolean;
  isDraft?: boolean;
  status: 'draft' | 'open' | 'closed' | 'ongoing' | 'completed';
  applicationDeadline?: string;  // YYYY-MM-DD
  
  // 코스 정보 (배열로 저장)
  courses?: Array<{
    id: string;
    name: string;
    description: string;
    distance: string;
    duration?: string;
    difficulty?: string;
  }>;
  
  createdAt: string;
}
```

**인덱스:**
- `date`
- `status`
- `isPublished`
- `isDraft`

---

### 5. teams
```typescript
{
  id: string;
  eventId: string;               // events 참조
  eventTitle?: string;
  number?: number;
  name: string;
  leaderId: string;              // users 참조
  leaderName: string;
  leaderCompany?: string;
  leaderPosition?: string;
  leaderPhone?: string;
  
  // 조원 정보 (배열로 저장)
  members: Array<{
    id: string;
    userId?: string;             // users 참조
    name: string;
    company?: string;
    position?: string;
    phoneNumber?: string;
    isGuest?: boolean;
  }>;
}
```

**인덱스:**
- `eventId`
- `leaderId`

---

### 6. participations
```typescript
{
  id: string;
  eventId: string;               // events 참조
  userId: string;                // users 참조
  userName: string;
  userEmail: string;
  isGuest: boolean;
  status: 'attending' | 'not-attending' | 'pending' | 'confirmed' | 'cancelled';
  registeredAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
  teamId?: string;               // teams 참조
  teamName?: string;
  paymentStatus: 'pending' | 'completed' | 'confirmed' | 'cancelled';
  specialRequirements?: string;
  createdAt: string;
  updatedAt: string;
}
```

**인덱스:**
- `eventId`
- `userId`
- `status`
- `(eventId, userId)` unique

---

### 7. guestApplications
```typescript
{
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  company?: string;
  position?: string;
  eventId: string;               // events 참조
  eventTitle: string;
  eventDate: string;             // YYYY-MM-DD
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  referredBy?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}
```

**인덱스:**
- `eventId`
- `status`
- `appliedAt`

---

### 8. payments
```typescript
{
  id: string;
  eventId: string;               // events 참조
  userId: string;                // users 참조
  userName: string;
  isGuest: boolean;
  company?: string;
  position?: string;
  phoneNumber: string;
  email: string;
  applicationDate?: string;
  paymentStatus: 'pending' | 'completed' | 'confirmed' | 'failed' | 'cancelled';
  paymentDate?: string;
  amount: number;
  paymentMethod?: string;
  transactionId?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}
```

**인덱스:**
- `eventId`
- `userId`
- `paymentStatus`

---

### 9. attendances
```typescript
{
  id: string;
  eventId: string;               // events 참조
  userId: string;                // users 참조
  userName: string;
  attendanceStatus: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  recordedBy: string;            // users 참조 (관리자)
  createdAt: string;
  updatedAt: string;
}
```

**인덱스:**
- `eventId`
- `userId`
- `attendanceStatus`
- `(eventId, userId)` unique

---

### 10. photos
```typescript
{
  id: string;
  eventId: string;               // events 참조
  eventTitle: string;
  eventYear: string;
  eventMonth: string;
  uploadedBy: string;            // users 참조
  uploadedByName: string;
  uploadedAt: string;
  imageUrl: string;              // Firebase Storage URL
  caption?: string;
  likes: number;
  likedBy: string[];             // users ID 배열
}
```

**인덱스:**
- `eventId`
- `eventYear`
- `eventMonth`
- `uploadedBy`

---

### 11. posts
```typescript
{
  id: string;
  category: 'general' | 'info' | 'question' | 'poem';
  title: string;
  author: string;
  authorId: string;              // users 참조
  content: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
  likedBy: string[];             // users ID 배열
  createdAt: string;
  updatedAt: string;
}
```

**인덱스:**
- `category`
- `authorId`
- `createdAt`

---

### 12. comments
```typescript
{
  id: string;
  postId: string;                // posts 참조
  author: string;
  authorId: string;              // users 참조
  content: string;
  date: string;
  likes: number;
  likedBy: string[];             // users ID 배열
  parentId?: string;             // comments 참조 (대댓글)
  createdAt: string;
  updatedAt: string;
}
```

**인덱스:**
- `postId`
- `authorId`
- `parentId`

---

### 13. notices
```typescript
{
  id: string;
  title: string;
  content: string;
  date: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**인덱스:**
- `isPinned`
- `createdAt`

---

### 14. hikingHistory
```typescript
{
  id: string;
  year: string;
  month: string;
  date: string;                  // YYYY-MM-DD
  mountain: string;
  location: string;
  participants: number;
  distance?: string;
  duration?: string;
  difficulty?: '하' | '중하' | '중' | '중상' | '상';
  weather?: string;
  temperature?: string;
  imageUrl?: string;             // Firebase Storage URL
  isSpecial?: boolean;
  summary?: string;
  photoCount?: number;
  createdAt: string;
  updatedAt: string;
}
```

**인덱스:**
- `year`
- `month`
- `date`

---

### 15. hikingComments
```typescript
{
  id: string;
  hikeId: string;                // hikingHistory 참조
  authorId: string;              // users 참조
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

**인덱스:**
- `hikeId`
- `authorId`

---

### 16. poems
```typescript
{
  id: string;
  title: string;
  author: string;
  authorId?: string;             // users 참조
  content: string;
  month: string;                 // YYYY-MM
  createdAt: string;
  updatedAt?: string;
}
```

**인덱스:**
- `month`
- `authorId`

---

### 17. rules
```typescript
{
  id: string;
  content: string;
  version: string;
  effectiveDate: string;         // YYYY-MM-DD
  amendments: Array<{
    version: string;
    date: string;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔗 관계 (References)

Firebase Firestore는 NoSQL이므로 외래 키가 없지만, 논리적 관계는 다음과 같습니다:

### 주요 관계

1. **users → executives** (1:N)
   - `executives.memberId` → `users.id`

2. **users → participations** (1:N)
   - `participations.userId` → `users.id`

3. **events → participations** (1:N)
   - `participations.eventId` → `events.id`

4. **events → teams** (1:N)
   - `teams.eventId` → `events.id`

5. **users → teams** (1:N, leader)
   - `teams.leaderId` → `users.id`

6. **teams → teamMembers** (1:N, embedded)
   - `teams.members[]` (배열로 저장)

7. **events → photos** (1:N)
   - `photos.eventId` → `events.id`

8. **users → photos** (1:N, uploader)
   - `photos.uploadedBy` → `users.id`

9. **events → payments** (1:N)
   - `payments.eventId` → `events.id`

10. **users → payments** (1:N)
    - `payments.userId` → `users.id`

11. **events → attendances** (1:N)
    - `attendances.eventId` → `events.id`

12. **users → attendances** (1:N)
    - `attendances.userId` → `users.id`

13. **posts → comments** (1:N)
    - `comments.postId` → `posts.id`

14. **users → posts** (1:N, author)
    - `posts.authorId` → `users.id`

15. **users → comments** (1:N, author)
    - `comments.authorId` → `users.id`

16. **hikingHistory → hikingComments** (1:N)
    - `hikingComments.hikeId` → `hikingHistory.id`

17. **users → poems** (1:N, author)
    - `poems.authorId` → `users.id`

18. **executives → events** (1:N, emergency contact)
    - `events.emergencyContactId` → `executives.id`

---

## 📝 구현 노트

### 서브컬렉션 vs 내장 필드

DBML에서는 별도 테이블이지만, Firebase에서는 다음과 같이 구현:

1. **courses** (코스 정보)
   - ✅ `events` 문서 내 `courses` 배열 필드로 구현
   - 이유: 코스는 이벤트에 종속되며, 별도 쿼리가 거의 없음

2. **scheduleItems** (상세 일정)
   - ✅ `courses` 배열 내 `schedule` 필드로 구현
   - 이유: 일정은 코스에 종속되며, 계층이 깊어도 쿼리 빈도가 낮음

3. **teamMembers** (조원)
   - ✅ `teams` 문서 내 `members` 배열로 구현
   - 이유: 조원은 팀에 종속되며, 함께 조회됨

### 미사용 컬렉션

현재 코드베이스에서 다음 컬렉션은 별도로 생성하지 않습니다:
- `courses`: `events.courses[]`로 저장
- `scheduleItems`: `events.courses[].schedule[]`로 저장
- `teamMembers`: `teams.members[]`로 저장

필요시 향후 확장 가능합니다.

---

## 🔒 보안 규칙 요약

| 컬렉션 | 읽기 | 생성 | 수정 | 삭제 |
|--------|------|------|------|------|
| members | 승인회원 | 본인/관리자 | 본인/관리자 | 관리자 |
| pendingUsers | 관리자 | 본인 | 관리자 | 관리자 |
| executives | 승인회원 | 관리자 | 관리자 | 관리자 |
| events | 승인회원 | 관리자 | 관리자 | 관리자 |
| teams | 승인회원 | 관리자 | 관리자 | 관리자 |
| participations | 승인회원 | 본인 | 본인/관리자 | 본인/관리자 |
| guestApplications | 관리자 | 인증유저 | 관리자 | 관리자 |
| payments | 본인/관리자 | 본인 | 본인/관리자 | 관리자 |
| attendances | 승인회원 | 관리자 | 관리자 | 관리자 |
| photos | 승인회원 | 본인 | 본인/관리자 | 본인/관리자 |
| posts | 인증유저 | 본인 | 본인/관리자 | 본인/관리자 |
| comments | 인증유저 | 본인 | 본인/관리자 | 본인/관리자 |
| notices | 인증유저 | 관리자 | 관리자 | 관리자 |
| hikingHistory | 승인회원 | 관리자 | 관리자 | 관리자 |
| hikingComments | 승인회원 | 본인 | 본인/관리자 | 본인/관리자 |
| poems | 승인회원 | 본인 | 본인/관리자 | 본인/관리자 |
| rules | 승인회원 | 관리자 | 관리자 | 관리자 |

---

## 📊 통계

- **총 컬렉션 수**: 17개 (실제 구현)
- **DBML 테이블 수**: 20개 (정의)
- **내장 필드로 구현**: 3개 (courses, scheduleItems, teamMembers)
- **보안 규칙 커버리지**: 100%

---

**마지막 업데이트**: 2026-01-29  
**버전**: 1.0  
**기준**: database-schema.dbml

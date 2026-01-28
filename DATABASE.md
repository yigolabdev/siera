# 시애라 클럽 데이터베이스 아키텍처

Firebase Firestore 기반 산악회 관리 시스템의 데이터베이스 스키마입니다.

## 📊 시각화 방법

### 1. dbdiagram.io에서 보기

1. [dbdiagram.io](https://dbdiagram.io/d) 접속
2. 왼쪽 에디터에서 기존 코드 모두 삭제
3. `database-schema.dbml` 파일의 내용을 복사하여 붙여넣기
4. 자동으로 다이어그램이 생성됩니다

### 2. 주요 기능

- **자동 레이아웃**: 테이블과 관계가 자동으로 배치됩니다
- **관계 시각화**: 외래키 관계가 선으로 표시됩니다
- **확대/축소**: 마우스 휠로 확대/축소 가능
- **드래그**: 테이블을 드래그하여 재배치 가능
- **내보내기**: PDF, PNG, SQL 등으로 내보내기 가능

### 3. 유용한 단축키

- `Ctrl/Cmd + K`: 검색
- `Ctrl/Cmd + Enter`: 다이어그램 갱신
- `Ctrl/Cmd + S`: 저장
- `Ctrl/Cmd + D`: 다이어그램 복제

## 📁 데이터베이스 구조

### 회원 관리 (User Management)
- **users**: 회원 정보 (Firebase Auth 연동)
- **pendingUsers**: 가입 승인 대기 회원
- **executives**: 운영진 정보 (회장단, 운영위원회)

### 산행 관리 (Event Management)
- **events**: 산행 이벤트 정보
- **courses**: 산행 코스 정보
- **scheduleItems**: 코스 상세 일정
- **teams**: 조편성 정보
- **teamMembers**: 조 구성원 정보

### 참가 관리 (Participation)
- **participations**: 산행 참가 신청 기록
- **guestApplications**: 게스트 신청 정보

### 결제 & 출석 (Payment & Attendance)
- **payments**: 결제 정보
- **attendances**: 출석 기록

### 콘텐츠 (Content)
- **photos**: 사진 갤러리
- **posts**: 게시판 글
- **comments**: 게시글 댓글
- **notices**: 공지사항

### 산행 기록 (Hiking History)
- **hikingHistory**: 과거 산행 아카이브
- **hikingComments**: 산행 기록 댓글

### 기타 (Misc)
- **poems**: 월별 시
- **rules**: 클럽 규칙 및 회칙

## 🔗 주요 관계

```
users (회원)
  ├── executives (운영진)
  ├── participations (참가 신청)
  ├── payments (결제)
  ├── attendances (출석)
  ├── photos (사진 업로드)
  ├── posts (게시글)
  └── comments (댓글)

events (산행 이벤트)
  ├── courses (코스)
  ├── teams (조편성)
  ├── participations (참가자)
  ├── payments (결제)
  ├── attendances (출석)
  ├── photos (사진)
  └── guestApplications (게스트 신청)

teams (조)
  └── teamMembers (조원)

posts (게시글)
  └── comments (댓글)

hikingHistory (산행 기록)
  └── hikingComments (댓글)
```

## 📋 컬렉션별 주요 필드

### users (회원)
- **id**: Firebase Auth UID
- **role**: admin | chairman | committee | member | guest
- **isApproved**: 가입 승인 여부
- **isActive**: 활성화 상태
- **attendanceRate**: 참여율 (%)

### events (산행 이벤트)
- **status**: draft | open | closed | ongoing | completed
- **isDraft**: 임시 저장 여부
- **isPublished**: 공개 여부
- **difficulty**: 하 | 중하 | 중 | 중상 | 상

### participations (참가 신청)
- **status**: attending | not-attending | pending | confirmed | cancelled
- **paymentStatus**: pending | completed | confirmed | cancelled

### payments (결제)
- **paymentStatus**: pending | completed | confirmed | failed | cancelled

### attendances (출석)
- **attendanceStatus**: present | absent | late | excused

## 🔍 인덱스 전략

주요 쿼리 패턴에 맞춰 인덱스가 설정되어 있습니다:

- **users**: email (unique), role, isApproved, isActive
- **events**: date, status, isPublished, isDraft
- **participations**: eventId, userId, status, (eventId + userId) unique
- **payments**: eventId, userId, paymentStatus
- **attendances**: eventId, userId, attendanceStatus, (eventId + userId) unique
- **photos**: eventId, eventYear, eventMonth, uploadedBy
- **posts**: category, authorId, createdAt

## 🚀 Firebase 특징

### NoSQL 구조
- 컬렉션 → 문서 → 필드 구조
- 서브 컬렉션 지원 (예: courses는 events 내부)
- JSON 타입 필드로 배열/객체 저장

### 실시간 동기화
- 모든 변경사항이 실시간으로 클라이언트에 전파
- Snapshot 리스너로 자동 업데이트

### 보안 규칙
- `firestore.rules` 파일로 접근 제어
- 컬렉션별 읽기/쓰기 권한 설정

### 저장소 통합
- Firebase Storage와 연동 (이미지 URL)
- Firebase Auth와 연동 (사용자 인증)

## 📝 개선 사항 (TODO)

1. **Firestore 보안 규칙 추가**: photos, hikingHistory, participations 등
2. **컬렉션 이름 통일**: gallery → photos, snake_case → camelCase
3. **TypeScript 타입 통합**: types/index.ts를 단일 소스로
4. **필드명 표준화**: phone → phoneNumber, occupation → company
5. **Executive/Member 데이터 동기화**: 현재는 별도 관리

## 🔄 마이그레이션 히스토리

### v1.0 (초기 버전)
- 기본 회원, 산행, 참가 관리

### v1.5 (현재)
- 운영진 분리 관리
- 조편성 기능 추가
- 결제/출석 관리 추가
- 게스트 신청 기능 추가
- 산행 기록 아카이브 추가

### v2.0 (계획)
- 통합 알림 시스템
- 통계 대시보드
- 모바일 앱 지원
- 채팅 기능

## 📖 참고 자료

- [Firebase Firestore 문서](https://firebase.google.com/docs/firestore)
- [dbdiagram.io 문서](https://dbdiagram.io/docs)
- [DBML 언어 스펙](https://dbml.dbdiagram.io/docs/)

## 🤝 기여

데이터베이스 스키마 변경 시:
1. `types/index.ts`에서 TypeScript 타입 먼저 수정
2. `database-schema.dbml` 파일 업데이트
3. `firestore.rules` 보안 규칙 업데이트
4. Context 파일 수정
5. 마이그레이션 스크립트 작성 (필요 시)

---

**Last Updated**: 2026-01-29  
**Version**: 1.5  
**Total Collections**: 19  
**Total Relationships**: 25+

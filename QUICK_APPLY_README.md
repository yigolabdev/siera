# 간편 산행 신청 페이지

## 개요

로그인 없이 이름만 입력하면 빠르게 산행을 신청할 수 있는 별도 페이지입니다.

## 접속 URL

```
http://localhost:5173/quick-apply
```

배포 후:
```
https://your-domain.com/quick-apply
```

## 주요 기능

### 1. **로그인 불필요**
- 별도의 로그인 없이 간편하게 산행 신청 가능
- 등록된 회원 이름만으로 본인 인증

### 2. **현재 월 산행 표시**
- 이번 달과 다음 달의 예정된 산행 자동 표시
- 각 산행의 상세 정보 확인 가능:
  - 날짜, 장소, 난이도
  - 현재 신청 인원 / 최대 정원
  - 참가비, 일정 등

### 3. **자동 회원 확인**
- 입력한 이름으로 DB에서 회원 정보 자동 검색
- 등록되지 않은 이름은 신청 불가
- 승인된 회원(member, admin)만 신청 가능

### 4. **실시간 피드백**
- 신청 성공/실패 즉시 표시
- 정원 마감 여부 확인
- 상세한 안내 메시지 제공

## 사용 방법

1. **산행 선택**
   - 신청 가능한 산행 목록에서 원하는 산행 클릭
   - 초록색 테두리로 선택된 산행 표시

2. **이름 입력**
   - 동호회에 등록된 정확한 이름 입력
   - 예: "홍길동"

3. **신청하기**
   - "산행 신청하기" 버튼 클릭
   - 1초 후 결과 확인

## 기술 구현

### 파일 구조

```
src/
├── pages/
│   └── QuickEventApply.tsx    # 간편 신청 페이지 컴포넌트
├── App.tsx                     # 라우팅 설정 추가
└── data/
    ├── mockEvents.ts           # 산행 데이터
    └── mockUsers.ts            # 회원 데이터
```

### 핵심 로직

```typescript
// 1. 회원 이름으로 DB 검색
const user = mockUsers.find(
  (u) => u.name.trim() === name.trim() && 
         u.isApproved && 
         u.role !== 'guest'
);

// 2. 정원 확인
if (event.currentParticipants >= event.maxParticipants) {
  // 마감 처리
}

// 3. 신청 처리 (실제로는 백엔드 API 호출)
console.log('산행 신청:', { 
  userId: user.id, 
  userName: user.name, 
  eventId: event.id 
});
```

### 상태 관리

```typescript
const [name, setName] = useState('');              // 입력한 이름
const [selectedEventId, setSelectedEventId] = useState('');  // 선택한 산행
const [result, setResult] = useState<ApplicationResult | null>(null);  // 신청 결과
const [isLoading, setIsLoading] = useState(false); // 로딩 상태
```

## 백엔드 연동 (TODO)

현재는 Mock 데이터를 사용하고 있습니다. 실제 백엔드 연동 시 다음 API를 구현해야 합니다:

### 1. 회원 조회 API
```typescript
GET /api/members/search?name={name}
Response: {
  id: string;
  name: string;
  isApproved: boolean;
  role: string;
}
```

### 2. 산행 신청 API
```typescript
POST /api/events/:eventId/apply
Body: {
  userId: string;
  userName: string;
}
Response: {
  success: boolean;
  message: string;
}
```

### 3. 산행 목록 API
```typescript
GET /api/events/upcoming
Response: HikingEvent[]
```

## 코드 수정 위치

백엔드 연동 시 `QuickEventApply.tsx` 파일의 `handleSubmit` 함수를 수정하세요:

```typescript
// 현재 (Mock)
const user = mockUsers.find(...);

// 변경 후 (실제 API)
const response = await fetch(`/api/members/search?name=${name}`);
const user = await response.json();
```

## 보안 고려사항

1. **이름만으로 인증하는 간편성과 보안의 트레이드오프**
   - 현재: 이름만으로 신청 가능 (편의성 우선)
   - 개선안: 전화번호 뒷자리 추가 입력 등

2. **Rate Limiting**
   - 같은 IP에서 반복 신청 방지
   - 서버 사이드에서 구현 필요

3. **중복 신청 방지**
   - 같은 사람이 같은 산행에 여러 번 신청 방지
   - DB에서 unique constraint 설정

## 디자인 특징

- **그라디언트 배경**: 자연스러운 green-blue-purple 그라디언트
- **Mountain 아이콘**: 산행 테마에 맞는 아이콘 사용
- **반응형 디자인**: 모바일/데스크톱 모두 최적화
- **접근성**: ARIA 레이블, 키보드 네비게이션 지원
- **사용자 피드백**: 성공/실패 시 명확한 시각적 피드백

## 테스트 데이터

### 등록된 회원
- 홍길동 (member)
- 관리자 (admin)
- 그 외 mockUsers.ts 참조

### 테스트 시나리오

1. **성공 케이스**: "홍길동" 입력 → 신청 성공
2. **실패 케이스**: "없는사람" 입력 → "등록된 회원을 찾을 수 없습니다"
3. **정원 마감**: currentParticipants >= maxParticipants 인 경우

## 향후 개선 사항

1. [ ] 실제 백엔드 API 연동
2. [ ] SMS/이메일 알림 기능
3. [ ] 신청 취소 기능
4. [ ] QR 코드 생성 (신청 확인용)
5. [ ] 캘린더 연동 (Google Calendar, Apple Calendar)
6. [ ] 카카오톡 공유하기 버튼
7. [ ] 참가비 온라인 결제 연동


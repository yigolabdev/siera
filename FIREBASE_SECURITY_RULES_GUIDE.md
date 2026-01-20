# 🛡️ Firebase 보안 규칙 설정 가이드

## Phase 3: 보안 규칙 설정 (20분)

Firebase Console에서 Firestore와 Storage의 보안 규칙을 설정하는 가이드입니다.

---

## 📋 Firestore 보안 규칙

### 설정 방법

1. **Firebase Console 접속**
   - https://console.firebase.google.com
   - 프로젝트 선택

2. **Firestore Database → 규칙 탭**
   - 왼쪽 메뉴에서 "Firestore Database" 클릭
   - 상단 탭에서 "규칙" 선택

3. **규칙 코드 입력**
   - 프로젝트의 `firestore.rules` 파일 내용을 복사
   - Firebase Console의 규칙 에디터에 붙여넣기
   - "게시" 버튼 클릭

### 주요 보안 규칙

```javascript
// 인증된 사용자만 읽기
function isAuthenticated() {
  return request.auth != null;
}

// 승인된 회원만 접근
function isApproved() {
  return isAuthenticated() && 
         request.auth.token.isApproved == true;
}

// 관리자 권한
function isAdmin() {
  return isAuthenticated() && 
         (request.auth.token.role == 'chairman' || 
          request.auth.token.role == 'vice_chairman' ||
          request.auth.token.role == 'secretary');
}
```

### 컬렉션별 권한

| 컬렉션 | 읽기 | 생성 | 수정 | 삭제 |
|--------|------|------|------|------|
| members | 승인된 회원 | 본인 (가입 시) | 본인/관리자 | 관리자 |
| events | 승인된 회원 | 관리자 | 관리자 | 관리자 |
| participants | 승인된 회원 | 본인 | 본인/관리자 | 본인/관리자 |
| teams | 승인된 회원 | 관리자 | 관리자 | 관리자 |
| notices | 승인된 회원 | 관리자 | 관리자 | 관리자 |
| posts | 승인된 회원 | 본인 | 본인/관리자 | 본인/관리자 |
| gallery | 승인된 회원 | 본인 | 본인/관리자 | 본인/관리자 |

---

## 🗂️ Storage 보안 규칙

### 설정 방법

1. **Storage 메뉴 이동**
   - 왼쪽 메뉴에서 "Storage" 클릭
   - 상단 탭에서 "규칙" 선택

2. **규칙 코드 입력**
   - 프로젝트의 `storage.rules` 파일 내용을 복사
   - Firebase Console의 규칙 에디터에 붙여넣기
   - "게시" 버튼 클릭

### 디렉토리별 권한

| 경로 | 읽기 | 업로드 | 삭제 | 크기 제한 |
|------|------|--------|------|-----------|
| profiles/{userId}/ | 승인된 회원 | 본인 | 본인 | 10MB |
| gallery/{eventId}/ | 승인된 회원 | 승인된 회원 | 관리자 | 10MB |
| events/{eventId}/ | 승인된 회원 | 관리자 | 관리자 | 10MB |
| notices/{noticeId}/ | 승인된 회원 | 관리자 | 관리자 | 20MB |
| posts/{postId}/ | 승인된 회원 | 승인된 회원 | 관리자 | 5MB |

---

## 🔑 Custom Claims 설정

관리자 권한 부여를 위해 Firebase Admin SDK 또는 Cloud Functions 필요

### 방법 1: Firebase Admin SDK (로컬)

**설치**
```bash
npm install firebase-admin
```

**스크립트 생성** (`scripts/set-admin.js`)
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminClaim(email, role) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, {
      role: role, // 'chairman', 'vice_chairman', 'secretary'
      isApproved: true
    });
    console.log(`✅ ${email}에게 ${role} 권한 부여 완료`);
  } catch (error) {
    console.error('❌ 오류:', error);
  }
}

// 사용 예
setAdminClaim('admin@sierakorea.com', 'chairman');
```

**실행**
```bash
node scripts/set-admin.js
```

### 방법 2: Cloud Functions (추천)

**함수 생성** (`functions/src/index.ts`)
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const setUserRole = functions.https.onCall(async (data, context) => {
  // 호출자가 관리자인지 확인
  if (!context.auth?.token?.role || context.auth.token.role !== 'chairman') {
    throw new functions.https.HttpsError(
      'permission-denied',
      '권한이 없습니다.'
    );
  }

  const { uid, role, isApproved } = data;

  try {
    await admin.auth().setCustomUserClaims(uid, { role, isApproved });
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', '오류가 발생했습니다.');
  }
});
```

---

## ✅ 설정 완료 체크리스트

Phase 3 완료 후 다음 항목을 확인하세요:

### Firestore 규칙
- [ ] Firestore 규칙 게시 완료
- [ ] 규칙에 빨간 오류 표시 없음
- [ ] 시뮬레이터로 테스트 완료 (선택)

### Storage 규칙
- [ ] Storage 규칙 게시 완료
- [ ] 규칙에 빨간 오류 표시 없음
- [ ] 시뮬레이터로 테스트 완료 (선택)

### Custom Claims (선택)
- [ ] Admin SDK 설정 또는 Cloud Functions 배포
- [ ] 최소 1명의 관리자 계정 설정

---

## 🧪 규칙 테스트 (선택사항)

Firebase Console의 "Firestore Database → 규칙" 또는 "Storage → 규칙"에서 시뮬레이터 사용 가능

### Firestore 테스트 예제

**테스트 1: 인증되지 않은 사용자**
```javascript
// 위치: /members/user123
// 인증: None
// 작업: get
// 예상 결과: Denied ✅
```

**테스트 2: 승인된 회원**
```javascript
// 위치: /events/event456
// 인증: Authenticated
// Custom claims: { isApproved: true }
// 작업: get
// 예상 결과: Allowed ✅
```

**테스트 3: 관리자 권한**
```javascript
// 위치: /events/event456
// 인증: Authenticated
// Custom claims: { isApproved: true, role: 'chairman' }
// 작업: create
// 예상 결과: Allowed ✅
```

---

## ⚠️ 주의사항

1. **규칙 게시 전 백업**
   - 기존 규칙을 복사해두세요 (문제 발생 시 롤백)

2. **프로덕션 모드 유지**
   - 절대 "테스트 모드"로 변경하지 마세요
   - 테스트 모드는 모든 사용자에게 읽기/쓰기 허용

3. **Custom Claims 필수**
   - 관리자 기능을 사용하려면 Custom Claims 설정 필요
   - 최소 1명의 관리자(chairman) 계정 생성

4. **규칙 변경 시간**
   - 규칙 게시 후 반영까지 최대 1분 소요

---

## 🆘 문제 해결

### Q: 규칙에 오류가 표시됩니다
A: 구문 오류가 있는지 확인하세요. Firebase Console에서 구체적인 오류 라인을 표시합니다.

### Q: 승인된 회원인데도 접근이 거부됩니다
A: Custom Claims가 제대로 설정되었는지 확인:
```javascript
// 브라우저 콘솔에서 확인
firebase.auth().currentUser.getIdTokenResult()
  .then(result => console.log(result.claims));
```

### Q: Custom Claims를 설정했는데 반영이 안 됩니다
A: 사용자 재로그인 필요 (토큰 갱신)

### Q: Storage 업로드가 실패합니다
A: 
- 파일 크기 제한 확인
- 이미지 파일인지 확인
- 경로가 규칙과 일치하는지 확인

---

## 📝 다음 단계

Phase 3 완료 후:
- **Phase 4로 이동**: AuthContext Firebase 마이그레이션
- 실제 Firebase 인증 연동
- 로그인/회원가입 기능 테스트

---

**작성일**: 2026-01-19  
**이전 문서**: Phase 1-2 - Firebase 프로젝트 설정  
**다음 문서**: Phase 4 - AuthContext 마이그레이션

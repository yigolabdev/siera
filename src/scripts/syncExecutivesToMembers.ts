/**
 * 운영진(executives)을 회원(members)으로 동기화하는 스크립트
 * 
 * 운영진은 회원이면서 동시에 운영진 역할을 하는 것이므로,
 * executives 컬렉션에 있는 모든 사람은 members 컬렉션에도 존재해야 합니다.
 */

import { getDocuments, setDocument } from '../lib/firebase/firestore';
import { Executive, Member } from '../types';

async function syncExecutivesToMembers() {
  console.log('🔄 운영진 → 회원 동기화 시작...\n');

  try {
    // 1. 모든 운영진 가져오기
    const executivesResult = await getDocuments<Executive>('executives');
    if (!executivesResult.success || !executivesResult.data) {
      console.log('❌ 운영진 데이터 로드 실패');
      return;
    }

    const executives = executivesResult.data;
    console.log(`✅ 운영진 ${executives.length}명 로드 완료\n`);

    // 2. 모든 회원 가져오기
    const membersResult = await getDocuments<Member>('members');
    const existingMembers = membersResult.success && membersResult.data ? membersResult.data : [];
    const existingMemberEmails = new Set(existingMembers.map(m => m.email));

    console.log(`✅ 기존 회원 ${existingMembers.length}명 로드 완료\n`);

    // 3. 운영진을 회원으로 추가
    let addedCount = 0;
    let skippedCount = 0;

    for (const exec of executives) {
      if (existingMemberEmails.has(exec.email)) {
        console.log(`⏭️  이미 존재: ${exec.name} (${exec.email})`);
        skippedCount++;
        continue;
      }

      // memberId가 있으면 그것을 사용하고, 없으면 새로 생성
      const memberId = exec.memberId || `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const memberData: Member = {
        id: memberId,
        name: exec.name,
        email: exec.email,
        phoneNumber: exec.phoneNumber,
        occupation: '',
        company: exec.company || '',
        position: exec.position, // 시애라 직책 (운영위원장 등)
        role: exec.category === 'chairman' ? 'chairman' : 'committee',
        joinDate: new Date().toISOString().split('T')[0],
        isApproved: true,
        isActive: true,
        bio: exec.bio,
        createdAt: exec.createdAt || new Date().toISOString(),
      };

      const result = await setDocument('members', memberId, memberData);
      
      if (result.success) {
        console.log(`✅ 추가 완료: ${exec.name} (${exec.email}) - ${exec.position}`);
        addedCount++;
      } else {
        console.log(`❌ 추가 실패: ${exec.name} (${exec.email})`);
      }
    }

    console.log('\n📊 동기화 결과:');
    console.log(`  - 총 운영진: ${executives.length}명`);
    console.log(`  - 추가됨: ${addedCount}명`);
    console.log(`  - 이미 존재: ${skippedCount}명`);
    console.log('\n✅ 동기화 완료!');

  } catch (error) {
    console.error('❌ 동기화 중 오류 발생:', error);
  }
}

// 스크립트 실행
syncExecutivesToMembers();

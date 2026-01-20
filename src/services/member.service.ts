/**
 * Member Service
 * 회원 관련 API 서비스
 */

import { Member } from '../types';
import { createDocument, getDocuments, updateDocument, deleteDocument, setDocument } from '../lib/firebase/firestore';
import { where, orderBy } from 'firebase/firestore';

const COLLECTION_NAME = 'members';

/**
 * 모든 회원 조회
 */
export async function getAllMembers(): Promise<Member[]> {
  const result = await getDocuments<Member>(COLLECTION_NAME, [
    orderBy('name', 'asc'),
  ]);

  if (result.success && result.data) {
    return result.data;
  }

  return [];
}

/**
 * 승인된 회원만 조회
 */
export async function getApprovedMembers(): Promise<Member[]> {
  const result = await getDocuments<Member>(COLLECTION_NAME, [
    where('isApproved', '==', true),
    orderBy('name', 'asc'),
  ]);

  if (result.success && result.data) {
    return result.data;
  }

  return [];
}

/**
 * 회원 ID로 조회
 */
export async function getMemberById(memberId: string): Promise<Member | null> {
  const result = await getDocuments<Member>(COLLECTION_NAME, [
    where('__name__', '==', memberId),
  ]);

  if (result.success && result.data && result.data.length > 0) {
    return result.data[0];
  }

  return null;
}

/**
 * 직급별 회원 조회
 */
export async function getMembersByPosition(position: string): Promise<Member[]> {
  const result = await getDocuments<Member>(COLLECTION_NAME, [
    where('position', '==', position),
    orderBy('name', 'asc'),
  ]);

  if (result.success && result.data) {
    return result.data;
  }

  return [];
}

/**
 * 회원 추가
 */
export async function addMember(member: Omit<Member, 'id'>): Promise<{ success: boolean; id?: string; error?: string }> {
  return await createDocument(COLLECTION_NAME, member);
}

/**
 * 회원 정보 업데이트
 */
export async function updateMember(
  memberId: string,
  updates: Partial<Member>
): Promise<{ success: boolean; error?: string }> {
  return await updateDocument(COLLECTION_NAME, memberId, updates);
}

/**
 * 회원 삭제
 */
export async function deleteMember(memberId: string): Promise<{ success: boolean; error?: string }> {
  return await deleteDocument(COLLECTION_NAME, memberId);
}

/**
 * 회원 승인
 */
export async function approveMember(memberId: string): Promise<{ success: boolean; error?: string }> {
  return await updateDocument(COLLECTION_NAME, memberId, {
    isApproved: true,
    approvedAt: new Date().toISOString(),
  });
}

/**
 * 회원 승인 취소
 */
export async function revokeMemberApproval(memberId: string): Promise<{ success: boolean; error?: string }> {
  return await updateDocument(COLLECTION_NAME, memberId, {
    isApproved: false,
    approvedAt: null,
  });
}

/**
 * 참석률 업데이트
 */
export async function updateAttendanceRate(
  memberId: string,
  attendanceRate: number
): Promise<{ success: boolean; error?: string }> {
  return await updateDocument(COLLECTION_NAME, memberId, {
    attendanceRate,
  });
}

/**
 * 회원 통계 계산
 */
export async function getMemberStats(): Promise<{
  total: number;
  approved: number;
  pending: number;
  averageAttendance: number;
}> {
  const allMembers = await getAllMembers();
  
  const approved = allMembers.filter((m) => m.isApproved).length;
  const pending = allMembers.filter((m) => !m.isApproved).length;
  
  const totalAttendance = allMembers.reduce((sum, m) => sum + (m.attendanceRate || 0), 0);
  const averageAttendance = allMembers.length > 0 
    ? Math.round(totalAttendance / allMembers.length) 
    : 0;

  return {
    total: allMembers.length,
    approved,
    pending,
    averageAttendance,
  };
}

export default {
  getAllMembers,
  getApprovedMembers,
  getMemberById,
  getMembersByPosition,
  addMember,
  updateMember,
  deleteMember,
  approveMember,
  revokeMemberApproval,
  updateAttendanceRate,
  getMemberStats,
};

import { User, TeamMember } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: '관리자',
    email: 'admin@siera.com',
    role: 'admin',
    isApproved: true,
    joinDate: '2026-01-01',
  },
  {
    id: '2',
    name: '홍길동',
    email: 'member@siera.com',
    role: 'member',
    isApproved: true,
    joinDate: '2026-01-15',
    phoneNumber: '010-1234-5678',
    occupation: '○○그룹',
    position: '회장',
    company: '○○그룹',
  },
];

export const mockTeamMembers: TeamMember[] = [
  { id: '1', name: '김산행', occupation: '○○그룹', company: '회장' },
  { id: '2', name: '이등산', occupation: '△△건설', company: '대표이사' },
  { id: '3', name: '박트레킹', occupation: '□□금융', company: '부사장' },
  { id: '4', name: '최하이킹', occupation: '◇◇제약', company: '전무이사' },
  { id: '5', name: '정봉우리', occupation: '☆☆병원', company: '원장' },
  { id: '6', name: '홍정상', occupation: '※※법률사무소', company: '대표변호사' },
  { id: '7', name: '강백운', occupation: '◎◎IT', company: '대표' },
  { id: '8', name: '윤설악', occupation: '▽▽건축', company: '사장' },
  { id: '9', name: '임지리', occupation: '★★무역', company: '부사장' },
  { id: '10', name: '조한라', occupation: '◆◆투자', company: '이사' },
  { id: '11', name: '문북한', occupation: '◈◈컨설팅', company: '전무' },
  { id: '12', name: '신계룡', occupation: '▲▲물류', company: '대표' },
  { id: '13', name: '장태백', occupation: '▼▼제조', company: '사장' },
  { id: '14', name: '권덕유', occupation: '◐◐통신', company: '이사' },
  { id: '15', name: '서오대', occupation: '◑◑교육', company: '교수' },
  { id: '16', name: '오속리', occupation: '◒◒인프라', company: '대표' },
  { id: '17', name: '배치악', occupation: '◓◓미디어', company: '본부장' },
  { id: '18', name: '류월출', occupation: '◔◔바이오', company: '연구소장' },
  { id: '19', name: '전청계', occupation: '◕◕에너지', company: '전무' },
  { id: '20', name: '황무등', occupation: '◖◖자산운용', company: '대표' },
];


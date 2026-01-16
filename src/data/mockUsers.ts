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
    gender: 'male',
    birthYear: '1980',
    company: '○○그룹',
    position: '회장',
  },
];

export const mockTeamMembers: TeamMember[] = [
  { id: '1', name: '김산행', company: '○○그룹', position: '회장' },
  { id: '2', name: '이등산', company: '△△건설', position: '대표이사' },
  { id: '3', name: '박트레킹', company: '□□금융', position: '부사장' },
  { id: '4', name: '최하이킹', company: '◇◇제약', position: '전무이사' },
  { id: '5', name: '정봉우리', company: '☆☆병원', position: '원장' },
  { id: '6', name: '홍정상', company: '※※법률사무소', position: '대표변호사' },
  { id: '7', name: '강백운', company: '◎◎IT', position: '대표' },
  { id: '8', name: '윤설악', company: '▽▽건축', position: '사장' },
  { id: '9', name: '임지리', company: '★★무역', position: '부사장' },
  { id: '10', name: '조한라', company: '◆◆투자', position: '이사' },
  { id: '11', name: '문북한', company: '◈◈컨설팅', position: '전무' },
  { id: '12', name: '신계룡', company: '▲▲물류', position: '대표' },
  { id: '13', name: '장태백', company: '▼▼제조', position: '사장' },
  { id: '14', name: '권덕유', company: '◐◐통신', position: '이사' },
  { id: '15', name: '서오대', company: '◑◑교육', position: '교수' },
  { id: '16', name: '오속리', company: '◒◒인프라', position: '대표' },
  { id: '17', name: '배치악', company: '◓◓미디어', position: '본부장' },
  { id: '18', name: '류월출', company: '◔◔바이오', position: '연구소장' },
  { id: '19', name: '전청계', company: '◕◕에너지', position: '전무' },
  { id: '20', name: '황무등', company: '◖◖자산운용', position: '대표' },
];


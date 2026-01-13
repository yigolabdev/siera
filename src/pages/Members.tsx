import { Users, Search, Mail, Briefcase, Award, X, Shield, TrendingUp, UserCheck, Calendar, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [showExecutiveModal, setShowExecutiveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const positions = [
    { id: 'all', name: '전체' },
    { id: 'president', name: '회장' },
    { id: 'vice-president', name: '부회장' },
    { id: 'executive', name: '임원' },
    { id: 'member', name: '회원' },
  ];
  
  // 운영진 데이터
  const executiveTeam = [
    // 회장단
    {
      id: 'exec-1',
      name: '정호철',
      title: '회장',
      occupation: '○○그룹',
      company: '회장',
      profileImage: 'https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?w=400&h=400&fit=crop',
      joinDate: '2020-01-15',
      term: '2024-01 ~ 2026-12',
      category: 'chairman',
      phone: '010-5399-4363',
    },
    {
      id: 'exec-2',
      name: '이응정',
      title: '운영위원장',
      occupation: '△△건설',
      company: '대표이사',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      joinDate: '2020-03-20',
      term: '2024-01 ~ 2026-12',
      category: 'chairman',
      phone: '010-8876-0605',
    },
    {
      id: 'exec-3',
      name: '신영인',
      title: '운영감사',
      occupation: '□□금융',
      company: '부사장',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      joinDate: '2020-06-10',
      term: '2024-01 ~ 2026-12',
      category: 'chairman',
      phone: '010-6305-3027',
    },
    {
      id: 'exec-4',
      name: '최원호',
      title: '등산대장',
      occupation: '◇◇제약',
      company: '전무이사',
      profileImage: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=400&fit=crop',
      joinDate: '2021-01-05',
      term: '2024-01 ~ 2026-12',
      category: 'chairman',
      phone: '010-6546-3387',
    },
    {
      id: 'exec-5',
      name: '유희찬',
      title: '재무감사',
      occupation: '☆☆병원',
      company: '원장',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      joinDate: '2021-03-15',
      term: '2024-01 ~ 2026-12',
      category: 'chairman',
      phone: '010-9064-7797',
    },
    // 운영위원
    {
      id: 'exec-6',
      name: '김용훈',
      title: '부위원장',
      occupation: '※※법률',
      company: '대표변호사',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      joinDate: '2021-06-10',
      term: '2024-01 ~ 2026-12',
      category: 'committee',
      phone: '010-7510-8500',
    },
    {
      id: 'exec-7',
      name: '이현희',
      title: '재무',
      occupation: '◎◎IT',
      company: '대표',
      profileImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
      joinDate: '2021-09-01',
      term: '2024-01 ~ 2026-12',
      category: 'committee',
      phone: '010-8277-7602',
    },
    {
      id: 'exec-8',
      name: '심경택',
      title: '기획',
      occupation: '▽▽건축',
      company: '사장',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      joinDate: '2022-01-20',
      term: '2024-01 ~ 2026-12',
      category: 'committee',
      phone: '010-5505-9815',
    },
    {
      id: 'exec-9',
      name: '권택준',
      title: '홍보/청년',
      occupation: '♧♧통신',
      company: '부장',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      joinDate: '2022-03-15',
      term: '2024-01 ~ 2026-12',
      category: 'committee',
      phone: '010-7411-7859',
    },
    {
      id: 'exec-10',
      name: '한재우',
      title: '홍보/청년',
      occupation: '♤♤무역',
      company: '이사',
      profileImage: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=400&fit=crop',
      joinDate: '2022-06-01',
      term: '2024-01 ~ 2026-12',
      category: 'committee',
      phone: '010-6769-0275',
    },
  ];
  
  const chairmanBoard = executiveTeam.filter(e => e.category === 'chairman');
  const committee = executiveTeam.filter(e => e.category === 'committee');
  
  const members = [
    // 임원진
    {
      id: 1,
      name: '김대한',
      position: 'president',
      occupation: '회장',
      company: '○○그룹',
      joinDate: '2020-01-15',
      email: 'kim.daehan@example.com',
      phone: '010-1234-5678',
      profileImage: 'https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?w=400&h=400&fit=crop',
      attendanceRate: 95,
      bio: '○○그룹 회장으로 재직 중이며, 시애라 창립 멤버입니다.',
    },
    {
      id: 2,
      name: '이민국',
      position: 'vice-president',
      occupation: '대표이사',
      company: '△△건설',
      joinDate: '2020-03-20',
      email: 'lee.minguk@example.com',
      phone: '010-2345-6789',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      attendanceRate: 88,
      bio: '△△건설 대표이사로 건설 업계 30년 경력의 베테랑입니다.',
    },
    {
      id: 3,
      name: '박세계',
      position: 'executive',
      occupation: '부사장',
      company: '□□금융',
      joinDate: '2020-06-10',
      email: 'park.segye@example.com',
      phone: '010-3456-7890',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      attendanceRate: 82,
      bio: '□□금융 부사장으로 금융 전문가입니다.',
    },
    {
      id: 4,
      name: '최우주',
      position: 'executive',
      occupation: '전무이사',
      company: '◇◇제약',
      joinDate: '2021-01-05',
      email: 'choi.woojoo@example.com',
      phone: '010-4567-8901',
      profileImage: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=400&fit=crop',
      attendanceRate: 90,
      bio: '◇◇제약 전무이사로 바이오 산업을 선도하고 있습니다.',
    },
    // 일반 회원들
    {
      id: 5,
      name: '정지구',
      position: 'member',
      occupation: '원장',
      company: '☆☆병원',
      joinDate: '2021-03-15',
      email: 'jung.jigu@example.com',
      phone: '010-5678-9012',
      profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop',
      attendanceRate: 85,
      bio: '☆☆병원 원장으로 의료계에서 활동하고 있습니다.',
    },
    {
      id: 6,
      name: '홍천지',
      position: 'member',
      occupation: '대표변호사',
      company: '※※법률사무소',
      joinDate: '2021-06-20',
      email: 'hong.cheonji@example.com',
      phone: '010-6789-0123',
      profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
      attendanceRate: 78,
      bio: '※※법률사무소 대표변호사로 기업법무 전문가입니다.',
    },
    {
      id: 7,
      name: '강산행',
      position: 'member',
      occupation: '대표',
      company: '◎◎IT',
      joinDate: '2021-09-10',
      email: 'kang.sanhaeng@example.com',
      phone: '010-7890-1234',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
      attendanceRate: 92,
      bio: '◎◎IT 대표로 IT 산업을 이끌고 있습니다.',
    },
    {
      id: 8,
      name: '윤봉우',
      position: 'member',
      occupation: '사장',
      company: '▽▽건축',
      joinDate: '2021-11-15',
      email: 'yoon.bongwoo@example.com',
      phone: '010-8901-2345',
      profileImage: 'https://images.unsplash.com/photo-1552642986-ccb41e7059e7?w=400&h=400&fit=crop',
      attendanceRate: 87,
      bio: '▽▽건축 사장으로 건축 디자인 전문가입니다.',
    },
    {
      id: 9,
      name: '임정상',
      position: 'member',
      occupation: '부사장',
      company: '★★무역',
      joinDate: '2022-01-20',
      email: 'lim.jeongsang@example.com',
      phone: '010-9012-3456',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      attendanceRate: 79,
      bio: '★★무역 부사장으로 글로벌 무역업을 주도하고 있습니다.',
    },
    {
      id: 10,
      name: '조등산',
      position: 'member',
      occupation: '이사',
      company: '◆◆투자',
      joinDate: '2022-03-10',
      email: 'jo.deungsan@example.com',
      phone: '010-0123-4567',
      profileImage: 'https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop',
      attendanceRate: 84,
      bio: '◆◆투자 이사로 벤처 투자 전문가입니다.',
    },
    {
      id: 11,
      name: '문백운',
      position: 'member',
      occupation: '전무',
      company: '◈◈컨설팅',
      joinDate: '2022-05-15',
      email: 'moon.baekwoon@example.com',
      phone: '010-1234-5679',
      profileImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
      attendanceRate: 91,
      bio: '◈◈컨설팅 전무로 경영 컨설팅 전문가입니다.',
    },
    {
      id: 12,
      name: '신지리',
      position: 'member',
      occupation: '대표',
      company: '▲▲물류',
      joinDate: '2022-07-20',
      email: 'shin.jiri@example.com',
      phone: '010-2345-6780',
      profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop',
      attendanceRate: 88,
      bio: '▲▲물류 대표로 물류 시스템 전문가입니다.',
    },
    {
      id: 13,
      name: '장한라',
      position: 'member',
      occupation: '사장',
      company: '▼▼제조',
      joinDate: '2022-09-10',
      email: 'jang.halla@example.com',
      phone: '010-3456-7891',
      profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
      attendanceRate: 76,
      bio: '▼▼제조 사장으로 제조업을 이끌고 있습니다.',
    },
    {
      id: 14,
      name: '권설악',
      position: 'member',
      occupation: '이사',
      company: '◐◐통신',
      joinDate: '2022-11-15',
      email: 'kwon.seorak@example.com',
      phone: '010-4567-8902',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
      attendanceRate: 83,
      bio: '◐◐통신 이사로 통신 인프라 전문가입니다.',
    },
    {
      id: 15,
      name: '서북한',
      position: 'member',
      occupation: '교수',
      company: '◑◑대학교',
      joinDate: '2023-01-10',
      email: 'seo.bukhan@example.com',
      phone: '010-5678-9013',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      attendanceRate: 89,
      bio: '◑◑대학교 교수로 경영학을 가르치고 있습니다.',
    },
    {
      id: 16,
      name: '오계룡',
      position: 'member',
      occupation: '대표',
      company: '◒◒인프라',
      joinDate: '2023-03-15',
      email: 'oh.gyeryong@example.com',
      phone: '010-6789-0124',
      profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop',
      attendanceRate: 81,
      bio: '◒◒인프라 대표로 도시 인프라 사업을 주도하고 있습니다.',
    },
    {
      id: 17,
      name: '배태백',
      position: 'member',
      occupation: '본부장',
      company: '◓◓미디어',
      joinDate: '2023-05-20',
      email: 'bae.taebaek@example.com',
      phone: '010-7890-1235',
      profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
      attendanceRate: 86,
      bio: '◓◓미디어 본부장으로 미디어 콘텐츠를 제작하고 있습니다.',
    },
    {
      id: 18,
      name: '류덕유',
      position: 'member',
      occupation: '연구소장',
      company: '◔◔바이오',
      joinDate: '2023-07-10',
      email: 'ryu.deokyoo@example.com',
      phone: '010-8901-2346',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
      attendanceRate: 93,
      bio: '◔◔바이오 연구소장으로 바이오 기술 연구를 이끌고 있습니다.',
    },
    {
      id: 19,
      name: '전오대',
      position: 'member',
      occupation: '전무',
      company: '◕◕에너지',
      joinDate: '2023-09-15',
      email: 'jeon.odae@example.com',
      phone: '010-9012-3457',
      profileImage: 'https://images.unsplash.com/photo-1552642986-ccb41e7059e7?w=400&h=400&fit=crop',
      attendanceRate: 77,
      bio: '◕◕에너지 전무로 신재생 에너지 사업을 추진하고 있습니다.',
    },
    {
      id: 20,
      name: '황속리',
      position: 'member',
      occupation: '대표',
      company: '◖◖자산운용',
      joinDate: '2023-11-20',
      email: 'hwang.sogri@example.com',
      phone: '010-0123-4568',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      attendanceRate: 90,
      bio: '◖◖자산운용 대표로 자산관리 전문가입니다.',
    },
    {
      id: 21,
      name: '송치악',
      position: 'member',
      occupation: '사장',
      company: '◗◗유통',
      joinDate: '2024-01-15',
      email: 'song.chiak@example.com',
      phone: '010-1234-5680',
      profileImage: 'https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop',
      attendanceRate: 85,
      bio: '◗◗유통 사장으로 유통 네트워크를 운영하고 있습니다.',
    },
    {
      id: 22,
      name: '나월출',
      position: 'member',
      occupation: '부사장',
      company: '◘◘식품',
      joinDate: '2024-03-10',
      email: 'na.wolchul@example.com',
      phone: '010-2345-6781',
      profileImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
      attendanceRate: 82,
      bio: '◘◘식품 부사장으로 식품 산업을 이끌고 있습니다.',
    },
    {
      id: 23,
      name: '민청계',
      position: 'member',
      occupation: '이사',
      company: '◙◙전자',
      joinDate: '2024-05-15',
      email: 'min.cheonggye@example.com',
      phone: '010-3456-7892',
      profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop',
      attendanceRate: 88,
      bio: '◙◙전자 이사로 전자 제품 개발을 담당하고 있습니다.',
    },
    {
      id: 24,
      name: '고무등',
      position: 'member',
      occupation: '전무',
      company: '◚◚화학',
      joinDate: '2024-07-20',
      email: 'go.mudeung@example.com',
      phone: '010-4567-8903',
      profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
      attendanceRate: 79,
      bio: '◚◚화학 전무로 화학 소재 사업을 추진하고 있습니다.',
    },
    {
      id: 25,
      name: '차두타',
      position: 'member',
      occupation: '대표',
      company: '◛◛항공',
      joinDate: '2024-09-10',
      email: 'cha.doota@example.com',
      phone: '010-5678-9014',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
      attendanceRate: 91,
      bio: '◛◛항공 대표로 항공 운송 사업을 운영하고 있습니다.',
    },
    {
      id: 26,
      name: '표금정',
      position: 'member',
      occupation: '사장',
      company: '◜◜해운',
      joinDate: '2024-11-15',
      email: 'pyo.geumjeong@example.com',
      phone: '010-6789-0125',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      attendanceRate: 84,
      bio: '◜◜해운 사장으로 해상 운송을 담당하고 있습니다.',
    },
    {
      id: 27,
      name: '노용문',
      position: 'member',
      occupation: '본부장',
      company: '◝◝철강',
      joinDate: '2025-01-20',
      email: 'no.yongmoon@example.com',
      phone: '010-7890-1236',
      profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop',
      attendanceRate: 86,
      bio: '◝◝철강 본부장으로 철강 생산을 관리하고 있습니다.',
    },
    {
      id: 28,
      name: '하덕항',
      position: 'member',
      occupation: '연구소장',
      company: '◞◞반도체',
      joinDate: '2025-03-15',
      email: 'ha.deokhang@example.com',
      phone: '010-8901-2347',
      profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
      attendanceRate: 92,
      bio: '◞◞반도체 연구소장으로 반도체 기술 개발을 이끌고 있습니다.',
    },
    {
      id: 29,
      name: '구천왕',
      position: 'member',
      occupation: '이사',
      company: '◟◟자동차',
      joinDate: '2025-05-10',
      email: 'gu.cheonwang@example.com',
      phone: '010-9012-3458',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
      attendanceRate: 80,
      bio: '◟◟자동차 이사로 자동차 디자인을 담당하고 있습니다.',
    },
    {
      id: 30,
      name: '안주왕',
      position: 'member',
      occupation: '전무',
      company: '◠◠패션',
      joinDate: '2025-07-15',
      email: 'an.joowang@example.com',
      phone: '010-0123-4569',
      profileImage: 'https://images.unsplash.com/photo-1552642986-ccb41e7059e7?w=400&h=400&fit=crop',
      attendanceRate: 87,
      bio: '◠◠패션 전무로 패션 브랜드를 운영하고 있습니다.',
    },
  ];
  
  const filteredMembers = members.filter(member => {
    const matchesPosition = selectedPosition === 'all' || member.position === selectedPosition;
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPosition && matchesSearch;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  
  // Adjust current page if it exceeds total pages
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);
  
  // Reset to page 1 when filter changes
  const handlePositionChange = (positionId: string) => {
    setSelectedPosition(positionId);
    setCurrentPage(1);
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Don't reset page - let safePage handle it naturally
  };
  
  const getPositionBadge = (position: string) => {
    switch (position) {
      case 'president':
        return <Badge variant="primary">회장</Badge>;
      case 'vice-president':
        return <Badge variant="primary">부회장</Badge>;
      case 'executive':
        return <Badge variant="primary">임원</Badge>;
      case 'member':
        return <Badge variant="primary">회원</Badge>;
      default:
        return <Badge variant="primary">회원</Badge>;
    }
  };
  
  const handleMemberClick = (member: any) => {
    setSelectedMember(member);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section with Background Image */}
      <div className="relative h-[300px] rounded-2xl overflow-hidden mb-12 shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&h=300&fit=crop"
          alt="Members Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">회원명부</h1>
          <p className="text-xl text-white/90 mb-6">
            시애라 회원님들의 정보를 확인하세요.
          </p>
          <button
            onClick={() => setShowExecutiveModal(true)}
            className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/30 transition-colors border border-white/30 flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            운영진 보기
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-slate-600 text-sm mb-2">전체 회원</p>
          <p className="text-3xl font-bold text-slate-900">{members.length}명</p>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-slate-600 text-sm mb-2">임원진</p>
          <p className="text-3xl font-bold text-slate-900">
            {members.filter(m => m.position !== 'member').length}명
          </p>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <UserCheck className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-slate-600 text-sm mb-2">일반 회원</p>
          <p className="text-3xl font-bold text-slate-900">
            {members.filter(m => m.position === 'member').length}명
          </p>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-slate-600 text-sm mb-2">평균 참여율</p>
          <p className="text-3xl font-bold text-slate-900">
            {Math.round(members.reduce((sum, m) => sum + m.attendanceRate, 0) / members.length)}%
          </p>
        </Card>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="이름, 직급/직책, 회사명으로 검색..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {positions.map((position) => (
            <button
              key={position.id}
              onClick={() => handlePositionChange(position.id)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedPosition === position.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {position.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentMembers.map((member) => (
          <Card 
            key={member.id} 
            className="hover:shadow-xl hover:border-primary-600 transition-all cursor-pointer"
            onClick={() => handleMemberClick(member)}
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className="relative">
                <img 
                  src={member.profileImage}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-slate-100"
                />
                {member.attendanceRate >= 90 && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                  {getPositionBadge(member.position)}
                </div>
                <div className="text-sm">
                  <p className="text-slate-600">{member.company}</p>
                  <p className="text-slate-900 font-medium">{member.occupation}</p>
                </div>
              </div>
            </div>
            
            {/* 자기소개 */}
            {member.bio && (
              <div className="mb-3">
                <p className="text-sm text-slate-600 line-clamp-2">{member.bio}</p>
              </div>
            )}
            
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>{member.joinDate}</span>
                </div>
                <Badge variant="primary">
                  참여율 {member.attendanceRate}%
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredMembers.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-xl text-slate-500">검색 결과가 없습니다.</p>
        </Card>
      )}
      
      {/* Pagination */}
      {filteredMembers.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={safePage === 1}
            className={`p-2 rounded-lg transition-all ${
              safePage === 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= safePage - 1 && page <= safePage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      safePage === page
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === safePage - 2 ||
                page === safePage + 2
              ) {
                return (
                  <span key={page} className="px-2 py-2 text-slate-400">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={safePage === totalPages}
            className={`p-2 rounded-lg transition-all ${
              safePage === totalPages
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* 회원 상세 정보 모달 (사진 중심) */}
      {selectedMember && (
        <Modal
          onClose={() => setSelectedMember(null)}
          maxWidth="max-w-4xl"
        >
          <div className="p-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <img
                  src={selectedMember.profileImage}
                  alt={selectedMember.name}
                  className="w-64 h-64 rounded-2xl object-cover border-4 border-slate-100 shadow-lg"
                />
                {selectedMember.attendanceRate >= 90 && (
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-slate-900">{selectedMember.name}</h2>
                  {getPositionBadge(selectedMember.position)}
                </div>
                <p className="text-lg text-slate-600 mb-1">{selectedMember.company}</p>
                <p className="text-xl font-semibold text-slate-900">{selectedMember.occupation}</p>
              </div>
            </div>
            
            {/* Bio Section */}
            {selectedMember.bio && (
              <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                <p className="text-slate-700 text-center">{selectedMember.bio}</p>
              </div>
            )}
            
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="bg-slate-50 border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">이메일</p>
                    <p className="font-semibold text-slate-900">{selectedMember.email}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-slate-50 border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">연락처</p>
                    <p className="font-semibold text-slate-900">{selectedMember.phone}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-slate-50 border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">가입일</p>
                    <p className="font-semibold text-slate-900">{selectedMember.joinDate}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-slate-50 border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">참여율</p>
                    <p className="font-semibold text-slate-900">{selectedMember.attendanceRate}%</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <button
              onClick={() => setSelectedMember(null)}
              className="w-full btn-primary"
            >
              닫기
            </button>
          </div>
        </Modal>
      )}
      
      {/* 운영진 모달 */}
      {showExecutiveModal && (
        <Modal
          onClose={() => setShowExecutiveModal(false)}
          title="시애라 운영진"
          maxWidth="max-w-6xl"
        >
        <div className="p-6">
          <div className="mb-8">
            <p className="text-slate-600 text-lg">
              2026년 시애라 운영진을 소개합니다.
            </p>
          </div>
          
          {/* 회장단 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">회장단</h3>
                <p className="text-sm text-slate-600">{chairmanBoard.length}명</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {chairmanBoard.map((executive) => (
                <Card
                  key={executive.id}
                  className="hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={executive.profileImage}
                      alt={executive.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="text-lg font-bold text-slate-900">{executive.name}</h4>
                        <Badge variant="primary">{executive.title}</Badge>
                      </div>
                      <div className="space-y-1 mb-3">
                        <p className="text-sm font-semibold text-slate-900">{executive.company}</p>
                        <p className="text-sm text-slate-600">{executive.occupation}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600">{executive.phone}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>임기: {executive.term}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 운영위원 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">운영위원</h3>
                <p className="text-sm text-slate-600">{committee.length}명</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {committee.map((executive) => (
                <Card
                  key={executive.id}
                  className="hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={executive.profileImage}
                      alt={executive.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="text-lg font-bold text-slate-900">{executive.name}</h4>
                        <Badge variant="info">{executive.title}</Badge>
                      </div>
                      <div className="space-y-1 mb-3">
                        <p className="text-sm font-semibold text-slate-900">{executive.company}</p>
                        <p className="text-sm text-slate-600">{executive.occupation}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600">{executive.phone}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>임기: {executive.term}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={() => setShowExecutiveModal(false)}
              className="w-full btn-primary"
            >
              닫기
            </button>
          </div>
        </div>
        </Modal>
      )}
    </div>
  );
};

export default Members;

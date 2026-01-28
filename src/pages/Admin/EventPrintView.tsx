import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../../contexts/EventContext';
import { useMembers } from '../../contexts/MemberContext';
import { usePoems } from '../../contexts/PoemContext';
import { Team, TeamMember } from '../../types';
import { X } from 'lucide-react';

const EventPrintView = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEventById, getTeamsByEventId } = useEvents();
  const { getMembersByPosition } = useMembers();
  const { getPoemByMonth, getCurrentMonthPoem } = usePoems();
  
  const event = getEventById(eventId || '');
  const teams = getTeamsByEventId(eventId || '');
  
  // 🔥 산행 날짜의 월에 해당하는 시를 가져옴
  let monthlyPoem;
  if (event) {
    const eventDate = new Date(event.date);
    const eventMonth = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
    monthlyPoem = getPoemByMonth(eventMonth) || getCurrentMonthPoem();
  } else {
    monthlyPoem = getCurrentMonthPoem();
  }
  
  // 비상연락처 (실제 데이터 사용)
  const emergencyContact = event?.emergencyContactName && event?.emergencyContactPhone 
    ? {
        name: event.emergencyContactName,
        phoneNumber: event.emergencyContactPhone
      }
    : {
        name: '비상연락처 미지정',
        phoneNumber: '-'
      };
  
  // 운영진 정보 가져오기
  const chairmanMembers = getMembersByPosition('chairman');
  const committeeMembers = getMembersByPosition('committee');
  
  const executives = {
    chairman: chairmanMembers.map(m => ({
      name: m.name,
      position: m.occupation.split(' ')[0] || '회장단',
      phoneNumber: m.phoneNumber,
    })),
    committee: committeeMembers.map(m => ({
      name: m.name,
      position: m.occupation.split(' ')[0] || '운영위원',
      phoneNumber: m.phoneNumber,
    })),
  };
  
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-slate-600">산행 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 조편성이 없는 경우 메시지 표시
  if (!teams || teams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">조편성 정보가 없습니다.</p>
          <p className="text-sm text-slate-500">산행 관리에서 조편성을 먼저 진행해주세요.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 프린트 버튼 */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          닫기
        </button>
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-bold"
        >
          프린트
        </button>
      </div>

      {/* A4 용지 */}
      <div className="print-container mx-auto bg-white">
        {/* 1페이지 - 산행 정보 */}
        <div className="page page-1">
          {/* 헤더 - 좌우 배치 */}
          <div className="header">
            <div className="header-left">
              <h1 className="main-title">시애라 (詩愛羅) 클럽</h1>
              <div className="subtitle">Sierra Hiking Club</div>
            </div>
            <div className="header-right">
              <div className="event-number">제 {event.id}회 산행</div>
              <div className="event-date">
                {new Date(event.date).toLocaleDateString('ko-KR', { 
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })}
              </div>
              <div className="mountain-info">
                <span className="mountain-name">{event.mountain}</span>
                <span className="divider">·</span>
                <span className="altitude">{event.altitude}</span>
                <span className="divider">·</span>
                <span className="difficulty">{event.difficulty}</span>
              </div>
              <div className="location">{event.location}</div>
            </div>
          </div>

          {/* 일정 및 코스 */}
          <div className="section">
            <div className="section-header-with-contact">
              <h2 className="section-title">일정 및 코스</h2>
              <div className="emergency-contact-inline">
                <span className="emergency-label">당일 비상연락처</span>
                <span className="emergency-name-inline">{emergencyContact.name}</span>
                <span className="emergency-phone-inline">{emergencyContact.phoneNumber}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="subsection-title">산행 일정</h3>
                <table className="info-table">
                  <tbody>
                    {event.schedule.map((item, idx) => (
                      <tr key={idx}>
                        <td className="time-cell">{item.time}</td>
                        <td className="location-cell">{item.location}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2} className="meeting-cell">
                        집결지: 종합운동장역 2번 출구 앞
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="subsection-title">산행 코스</h3>
                {event.courses.map((course) => (
                  <div key={course.name} className="course-info">
                    <div className="course-header">
                      <span className="course-name">{course.name}</span>
                      <span className="course-distance">{course.distance}</span>
                    </div>
                    <div className="course-desc">{course.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 조편성 */}
          <div className="section">
            <h2 className="section-title">조편성</h2>
            <div className="teams-grid">
              {teams.map((team) => (
                <div key={team.id} className="team-box">
                  <div className="team-header">
                    <span className="team-num">{team.number}조</span>
                    <span className="team-label">조장</span>
                  </div>
                  <div className="team-leader">
                    <div className="leader-name">
                      {team.leaderName}
                      <span className="leader-detail">
                        {' '}({team.leaderCompany || ''}{team.leaderCompany && team.leaderPosition ? ' · ' : ''}{team.leaderPosition || ''})
                      </span>
                    </div>
                  </div>
                  <div className="team-members">
                    {team.members.map((member, idx) => (
                      <div key={idx} className="member-item">
                        <span className="member-name">{member.name}</span>
                        <span className="member-company">{member.company || ''}</span>
                        <span className="member-position">{member.position || member.occupation || ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2페이지 - 이달의 시 */}
        {monthlyPoem && (
          <div className="page page-2">
            <div className="poem-page">
              <div className="poem-top">
                {/* 장식 상단 */}
                <div className="poem-decoration-top">
                  <div className="decoration-line"></div>
                  <div className="decoration-circle"></div>
                  <div className="decoration-line"></div>
                </div>

                {/* 시 제목 */}
                <div className="poem-title-section">
                  <div className="poem-label">
                    {new Date(event.date).toLocaleDateString('ko-KR', { month: 'long' })}의 詩
                  </div>
                  <div className="poem-title-row">
                    <h1 className="poem-title">{monthlyPoem.title}</h1>
                    <div className="poem-author">— {monthlyPoem.author}</div>
                  </div>
                </div>

                {/* 시 내용 */}
                <div className="poem-content">
                  <div className={`poem-text ${
                    monthlyPoem.content.length <= 200 ? 'poem-size-xlarge' :
                    monthlyPoem.content.length <= 400 ? 'poem-size-large' :
                    monthlyPoem.content.length <= 600 ? 'poem-size-medium' :
                    monthlyPoem.content.length <= 900 ? 'poem-size-small' :
                    monthlyPoem.content.length <= 1200 ? 'poem-size-tiny' :
                    'poem-size-mini'
                  }`}>
                    {monthlyPoem.content}
                  </div>
                </div>
              </div>

              {/* 푸터 */}
              <div className="poem-footer">
                <div className="footer-content">
                  <span className="footer-logo">시애라 (詩愛羅) 클럽</span>
                  <span className="footer-divider">·</span>
                  <span className="footer-date">
                    {new Date(event.date).toLocaleDateString('ko-KR', { 
                      year: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* 프린트 설정 */
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          .print-container {
            width: 210mm;
            margin: 0 auto;
          }
          
          .page {
            width: 210mm;
            height: 297mm;
            page-break-after: always;
            page-break-inside: avoid;
            background: white;
            box-sizing: border-box;
            overflow: hidden;
          }

          .page:last-child {
            page-break-after: auto;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
        
        @media screen {
          .print-container {
            max-width: 210mm;
            margin: 40px auto;
          }
          
          .page {
            width: 210mm;
            height: 297mm;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            box-sizing: border-box;
            overflow: hidden;
          }
        }

        /* 페이지 기본 */
        .page {
          font-family: 'Malgun Gothic', sans-serif;
          color: #1a1a1a;
          line-height: 1.6;
          position: relative;
        }

        .page-1 {
          padding: 10mm 12mm;
        }

        .page-2 {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 헤더 - 좌우 배치 */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid #1a1a1a;
          padding-bottom: 10px;
          margin-bottom: 8px;
        }

        .header-left {
          flex: 0 0 auto;
        }

        .main-title {
          font-size: 38px;
          font-weight: 900;
          margin: 0 0 4px 0;
          letter-spacing: 2px;
          color: #1a1a1a;
          line-height: 1;
        }

        .subtitle {
          font-size: 11px;
          color: #666;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .header-right {
          flex: 0 0 auto;
          text-align: right;
        }

        .event-number {
          font-size: 18px;
          font-weight: 900;
          margin-bottom: 4px;
          color: #1a1a1a;
        }

        .event-date {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #333;
        }

        .mountain-info {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 2px;
          color: #1a1a1a;
        }

        .mountain-name {
          font-size: 18px;
        }

        .divider {
          margin: 0 6px;
          color: #999;
        }

        .location {
          font-size: 13px;
          color: #666;
          font-weight: 600;
        }

        /* 섹션 */
        .section {
          margin-bottom: 8px;
        }

        .section-header-with-contact {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 900;
          margin: 0;
          padding: 6px 0;
          border-bottom: 2px solid #1a1a1a;
          color: #1a1a1a;
          flex: 1;
        }

        /* 인라인 비상연락처 */
        .emergency-contact-inline {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          background: #f5f5f5;
          border: 1px solid #1a1a1a;
          border-radius: 6px;
          margin-left: 16px;
        }

        .emergency-label {
          font-size: 12px;
          font-weight: 700;
          color: #666;
        }

        .emergency-name-inline {
          font-size: 14px;
          font-weight: 900;
          color: #1a1a1a;
        }

        .emergency-phone-inline {
          font-size: 14px;
          font-weight: 800;
          color: #d32f2f;
          letter-spacing: 0.3px;
        }

        .subsection-title {
          font-size: 14px;
          font-weight: 800;
          margin: 0 0 6px 0;
          padding-bottom: 4px;
          border-bottom: 1px solid #666;
          color: #1a1a1a;
        }

        /* 테이블 */
        .info-table {
          width: 100%;
          border-collapse: collapse;
        }

        .info-table td {
          padding: 3px 6px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 13px;
        }

        .time-cell {
          font-weight: 800;
          color: #1a1a1a;
          width: 30%;
          font-size: 14px;
        }

        .location-cell {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .meeting-cell {
          font-weight: 700;
          color: #1a1a1a;
          background: #f5f5f5;
          text-align: center;
          padding: 6px 8px !important;
          font-size: 14px;
        }

        /* 코스 */
        .course-info {
          margin-bottom: 6px;
          padding: 6px;
          border: 1px solid #d0d0d0;
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3px;
        }

        .course-name {
          font-weight: 800;
          font-size: 14px;
          color: #1a1a1a;
        }

        .course-distance {
          font-weight: 700;
          font-size: 13px;
          color: #333;
        }

        .course-desc {
          font-size: 13px;
          color: #333;
          line-height: 1.5;
          font-weight: 500;
        }

        /* 조편성 */
        .teams-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
        }

        .team-box {
          border: 2px solid #1a1a1a;
          padding: 6px;
        }

        .team-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
          padding-bottom: 3px;
          border-bottom: 1px solid #666;
        }

        .team-num {
          font-weight: 900;
          font-size: 16px;
          color: #1a1a1a;
        }

        .team-label {
          font-weight: 700;
          font-size: 12px;
          color: #333;
        }

        .team-leader {
          margin-bottom: 5px;
          padding-bottom: 5px;
          border-bottom: 1px solid #d0d0d0;
        }

        .leader-name {
          font-weight: 800;
          font-size: 14px;
          color: #1a1a1a;
          line-height: 1.4;
        }

        .leader-detail {
          font-weight: 800;
          font-size: 11px;
          color: #1a1a1a;
          margin-left: 4px;
        }

        .team-members {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .member-item {
          display: flex;
          gap: 3px;
          font-size: 11px;
          line-height: 1.5;
        }

        .member-name {
          font-weight: 700;
          color: #1a1a1a;
          flex-shrink: 0;
          min-width: 45px;
          font-size: 13px;
        }

        .member-company {
          font-size: 10px;
          color: #1a1a1a;
          font-weight: 800;
          flex: 1;
        }

        .member-position {
          font-size: 10px;
          color: #1a1a1a;
          font-weight: 800;
          flex-shrink: 0;
        }

        /* 2페이지 - 시 */
        .poem-page {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding: 10mm 30mm;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          box-sizing: border-box;
        }

        /* 상단 영역 - 고정 */
        .poem-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 550px;
          flex-shrink: 0;
        }

        /* 장식 요소 */
        .poem-decoration-top,
        .poem-decoration-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 8px 0;
        }

        .decoration-line {
          width: 100px;
          height: 2px;
          background: #1a1a1a;
        }

        .decoration-circle {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #1a1a1a;
        }

        /* 시 제목 섹션 - 고정 */
        .poem-title-section {
          text-align: center;
          margin-bottom: 10px;
          width: 100%;
        }

        .poem-label {
          font-size: 15px;
          font-weight: 700;
          color: #666;
          letter-spacing: 6px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .poem-title-row {
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: 16px;
        }

        .poem-title {
          font-size: 48px;
          font-weight: 900;
          color: #1a1a1a;
          margin: 0;
          letter-spacing: -1px;
          line-height: 1.1;
        }

        .poem-author {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          font-style: italic;
          margin: 0;
          flex-shrink: 0;
        }

        /* 시 내용 - 가변 */
        .poem-content {
          width: 100%;
          max-width: 550px;
          background: white;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          border: 2px solid #e0e0e0;
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          height: 850px;
          margin-bottom: 15px;
        }

        .poem-text {
          white-space: pre-line;
          color: #1a1a1a;
          font-weight: 500;
          text-align: center;
          width: 100%;
          max-height: 100%;
          overflow: hidden;
        }

        /* 시 길이에 따른 크기 조정 */
        .poem-size-xlarge {
          font-size: 16px;
          line-height: 2.4;
        }

        .poem-size-large {
          font-size: 14px;
          line-height: 2.2;
        }

        .poem-size-medium {
          font-size: 13px;
          line-height: 2.0;
        }

        .poem-size-small {
          font-size: 12px;
          line-height: 1.8;
        }

        .poem-size-tiny {
          font-size: 11px;
          line-height: 1.7;
        }

        .poem-size-mini {
          font-size: 10px;
          line-height: 1.6;
        }

        /* 푸터 - 하단 고정, 한 줄 */
        .poem-footer {
          text-align: center;
          position: absolute;
          bottom: 3mm;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          padding: 8px 0;
        }

        .footer-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .footer-logo {
          font-size: 18px;
          font-weight: 900;
          color: #1a1a1a;
          letter-spacing: 1px;
        }

        .footer-divider {
          font-size: 18px;
          color: #666;
          font-weight: 400;
        }

        .footer-date {
          font-size: 16px;
          color: #666;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default EventPrintView;

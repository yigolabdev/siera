/**
 * 관리자 회원 데이터 검색/삭제 유틸리티
 *
 * 이름, 이메일, 전화번호로 검색하여 모든 컬렉션에서 관련 데이터를 찾고,
 * 계정 삭제 시 userId/authorId/memberId 등으로 연관된 데이터도 함께 삭제합니다.
 */
import { useState } from 'react';
import {
  Search, Trash2, AlertTriangle, CheckCircle, Loader2, Database,
  User, Mail, Phone, Link2, ChevronDown, ChevronUp, Shield,
} from 'lucide-react';
import { getDocuments, deleteDocument } from '../../lib/firebase/firestore';
import Card from '../../components/ui/Card';

// ===== 검색 대상 컬렉션 (1차: 직접 검색) =====
const PRIMARY_COLLECTIONS = [
  { name: 'members', label: '회원', color: 'bg-blue-100 text-blue-700' },
  { name: 'executives', label: '운영진', color: 'bg-purple-100 text-purple-700' },
  { name: 'pendingUsers', label: '가입대기', color: 'bg-amber-100 text-amber-700' },
  { name: 'preRegisteredMembers', label: '사전등록', color: 'bg-slate-100 text-slate-600' },
];

// ===== 연관 데이터 컬렉션 (2차: userId/authorId 등으로 연결) =====
const RELATED_COLLECTIONS: {
  name: string;
  label: string;
  color: string;
  /** 사용자 ID가 매칭될 수 있는 필드들 */
  userIdFields: string[];
}[] = [
  { name: 'participations', label: '산행참가', color: 'bg-emerald-100 text-emerald-700', userIdFields: ['userId'] },
  { name: 'payments', label: '납부', color: 'bg-green-100 text-green-700', userIdFields: ['userId'] },
  { name: 'attendances', label: '출석', color: 'bg-cyan-100 text-cyan-700', userIdFields: ['userId'] },
  { name: 'guestApplications', label: '게스트신청', color: 'bg-orange-100 text-orange-700', userIdFields: [] },
  { name: 'loginHistory', label: '로그인기록', color: 'bg-gray-100 text-gray-600', userIdFields: ['userId'] },
  { name: 'photos', label: '사진', color: 'bg-pink-100 text-pink-700', userIdFields: ['uploadedBy'] },
  { name: 'posts', label: '게시글', color: 'bg-indigo-100 text-indigo-700', userIdFields: ['authorId'] },
  { name: 'comments', label: '댓글', color: 'bg-violet-100 text-violet-700', userIdFields: ['authorId'] },
  { name: 'hikingHistory', label: '산행기록', color: 'bg-teal-100 text-teal-700', userIdFields: ['authorId'] },
  { name: 'hikingComments', label: '산행댓글', color: 'bg-lime-100 text-lime-700', userIdFields: ['authorId'] },
  { name: 'poems', label: '시/수필', color: 'bg-rose-100 text-rose-700', userIdFields: ['authorId'] },
];

// 모든 컬렉션 (1차 검색용: 이름/이메일/전화번호 매칭)
const ALL_SEARCHABLE = [...PRIMARY_COLLECTIONS, ...RELATED_COLLECTIONS];

interface FoundDoc {
  id: string;
  collection: string;
  collectionLabel: string;
  collectionColor: string;
  data: Record<string, any>;
  selected: boolean;
  /** 'primary'=직접 매칭, 'related'=userId 연관 매칭 */
  matchType: 'primary' | 'related';
  /** 어떤 필드로 매칭되었는지 */
  matchedVia?: string;
}

const CleanupAccounts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [results, setResults] = useState<FoundDoc[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [deleteLog, setDeleteLog] = useState<string[]>([]);
  const [showRelated, setShowRelated] = useState(true);

  // ===== 검색 =====
  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setResults([]);
    setHasSearched(false);
    setDeleteLog([]);

    const found: FoundDoc[] = [];
    const cleanPhone = query.replace(/[-\s]/g, '');

    // 직접 매칭된 userId 수집 (2차 연관 검색용)
    const matchedUserIds = new Set<string>();
    const matchedPhones = new Set<string>();
    const matchedEmails = new Set<string>();

    // ===== 1차 검색: 이름/이메일/전화번호/ID로 직접 매칭 =====
    for (const col of ALL_SEARCHABLE) {
      try {
        const allDocs = await getDocuments<any>(col.name);
        if (!allDocs.success || !allDocs.data) continue;

        for (const doc of allDocs.data) {
          const matchesName = doc.name?.includes(query) || doc.userName?.includes(query);
          const matchesEmail =
            doc.email?.toLowerCase().includes(query.toLowerCase()) ||
            doc.userEmail?.toLowerCase().includes(query.toLowerCase());
          const matchesPhone =
            doc.phoneNumber?.replace(/[-\s]/g, '').includes(cleanPhone) ||
            doc.phone?.replace(/[-\s]/g, '').includes(cleanPhone) ||
            doc.userPhone?.replace(/[-\s]/g, '').includes(cleanPhone);
          const matchesId = doc.id === query;

          if (matchesName || matchesEmail || matchesPhone || matchesId) {
            if (!found.some(f => f.collection === col.name && f.id === doc.id)) {
              found.push({
                id: doc.id,
                collection: col.name,
                collectionLabel: col.label,
                collectionColor: col.color,
                data: doc,
                selected: true,
                matchType: 'primary',
              });

              // userId 수집 (2차 검색용)
              if (doc.id) matchedUserIds.add(doc.id);
              if (doc.userId) matchedUserIds.add(doc.userId);
              if (doc.phoneNumber) matchedPhones.add(doc.phoneNumber.replace(/[-\s]/g, ''));
              if (doc.phone) matchedPhones.add(doc.phone.replace(/[-\s]/g, ''));
              if (doc.userPhone) matchedPhones.add(doc.userPhone.replace(/[-\s]/g, ''));
              if (doc.email) matchedEmails.add(doc.email.toLowerCase());
              if (doc.userEmail) matchedEmails.add(doc.userEmail.toLowerCase());
            }
          }
        }
      } catch {
        // 컬렉션 접근 실패 시 스킵
      }
    }

    // ===== 2차 검색: 수집된 userId로 연관 데이터 검색 =====
    if (matchedUserIds.size > 0) {
      for (const col of RELATED_COLLECTIONS) {
        if (col.userIdFields.length === 0) continue;

        try {
          const allDocs = await getDocuments<any>(col.name);
          if (!allDocs.success || !allDocs.data) continue;

          for (const doc of allDocs.data) {
            // 이미 1차에서 찾은 문서는 스킵
            if (found.some(f => f.collection === col.name && f.id === doc.id)) continue;

            for (const field of col.userIdFields) {
              if (doc[field] && matchedUserIds.has(doc[field])) {
                found.push({
                  id: doc.id,
                  collection: col.name,
                  collectionLabel: col.label,
                  collectionColor: col.color,
                  data: doc,
                  selected: true,
                  matchType: 'related',
                  matchedVia: `${field}: ${doc[field]}`,
                });
                break;
              }
            }

            // 전화번호 기반 연관 매칭 (게스트 신청 등)
            if (!found.some(f => f.collection === col.name && f.id === doc.id)) {
              const docPhone = (doc.phoneNumber || doc.phone || doc.userPhone || '').replace(/[-\s]/g, '');
              const docEmail = (doc.email || doc.userEmail || '').toLowerCase();
              if ((docPhone && matchedPhones.has(docPhone)) || (docEmail && matchedEmails.has(docEmail))) {
                found.push({
                  id: doc.id,
                  collection: col.name,
                  collectionLabel: col.label,
                  collectionColor: col.color,
                  data: doc,
                  selected: true,
                  matchType: 'related',
                  matchedVia: docPhone ? `전화번호: ${docPhone}` : `이메일: ${docEmail}`,
                });
              }
            }
          }
        } catch {
          // 스킵
        }
      }
    }

    // 정렬: primary 먼저, 그 안에서 컬렉션순
    found.sort((a, b) => {
      if (a.matchType !== b.matchType) return a.matchType === 'primary' ? -1 : 1;
      return a.collectionLabel.localeCompare(b.collectionLabel);
    });

    setResults(found);
    setHasSearched(true);
    setIsSearching(false);
  };

  const toggleSelect = (index: number) => {
    setResults(prev => prev.map((r, i) => i === index ? { ...r, selected: !r.selected } : r));
  };

  const toggleSelectAll = () => {
    const allSelected = results.every(r => r.selected);
    setResults(prev => prev.map(r => ({ ...r, selected: !allSelected })));
  };

  const toggleSelectByType = (type: 'primary' | 'related') => {
    const typeItems = results.filter(r => r.matchType === type);
    const allTypeSelected = typeItems.every(r => r.selected);
    setResults(prev => prev.map(r =>
      r.matchType === type ? { ...r, selected: !allTypeSelected } : r
    ));
  };

  // ===== 삭제 =====
  const handleDelete = async () => {
    const toDelete = results.filter(r => r.selected);
    if (toDelete.length === 0) return;

    const primaryCount = toDelete.filter(r => r.matchType === 'primary').length;
    const relatedCount = toDelete.filter(r => r.matchType === 'related').length;

    const confirmMsg = [
      `선택된 ${toDelete.length}건의 데이터를 삭제하시겠습니까?`,
      '',
      `  • 직접 매칭: ${primaryCount}건`,
      `  • 연관 데이터: ${relatedCount}건`,
      '',
      '⚠️ 이 작업은 되돌릴 수 없습니다.',
    ].join('\n');

    if (!confirm(confirmMsg)) return;

    setIsDeleting(true);
    setDeleteLog([]);
    const logs: string[] = [];
    let successCount = 0;

    for (const item of toDelete) {
      const displayName = item.data.name || item.data.userName || item.data.email || item.data.userEmail || item.id.slice(0, 16);
      const result = await deleteDocument(item.collection, item.id);
      if (result.success) {
        logs.push(`✅ [${item.collectionLabel}] ${displayName} (${item.id.slice(0, 12)}...) 삭제 완료`);
        successCount++;
      } else {
        logs.push(`❌ [${item.collectionLabel}] ${displayName} 삭제 실패: ${result.error}`);
      }
      setDeleteLog([...logs]);
    }

    logs.push(`\n━━━ 총 ${successCount}/${toDelete.length}건 삭제 완료 ━━━`);
    setDeleteLog([...logs]);
    setResults(prev => prev.filter(r => !r.selected));
    setIsDeleting(false);
  };

  // ===== 표시 유틸 =====
  const getDisplayInfo = (doc: FoundDoc) => {
    const d = doc.data;

    const statusLabel: Record<string, string> = {
      pending: '입금대기', confirmed: '확정', cancelled: '취소됨',
      refunded: '환불됨', active: '활성', inactive: '비활성',
    };
    const paymentLabel: Record<string, string> = {
      pending: '미납', confirmed: '입금완료', refunded: '환불됨',
    };

    const details: string[] = [];
    if (d.status) details.push(`상태: ${statusLabel[d.status] ?? d.status}`);
    if (d.paymentStatus) details.push(`납부: ${paymentLabel[d.paymentStatus] ?? d.paymentStatus}`);
    if (d.eventId) details.push(`이벤트: ${d.eventId.slice(0, 10)}…`);
    if (d.createdAt) details.push(`등록: ${new Date(d.createdAt).toLocaleDateString('ko-KR')}`);
    if (d.role) details.push(`역할: ${d.role}`);

    return {
      name: d.name || d.userName || d.authorName || d.author || '-',
      email: d.email || d.userEmail || '-',
      phone: d.phoneNumber || d.phone || d.userPhone || '-',
      extra: d.title || d.eventTitle || d.position || '-',
      details: details.join('  ·  '),
    };
  };

  const primaryResults = results.filter(r => r.matchType === 'primary');
  const relatedResults = results.filter(r => r.matchType === 'related');
  const selectedCount = results.filter(r => r.selected).length;

  // ===== 결과 항목 렌더링 =====
  const renderResultItem = (doc: FoundDoc, index: number) => {
    const info = getDisplayInfo(doc);
    const globalIndex = results.indexOf(doc);

    return (
      <div
        key={`${doc.collection}-${doc.id}`}
        className={`flex items-start sm:items-center gap-3 p-3 sm:p-4 rounded-xl border transition-colors cursor-pointer ${
          doc.selected
            ? 'bg-red-50 border-red-200'
            : 'bg-white border-slate-200 hover:bg-slate-50'
        }`}
        onClick={() => toggleSelect(globalIndex)}
      >
        {/* 체크박스 */}
        <input
          type="checkbox"
          checked={doc.selected}
          onChange={() => toggleSelect(globalIndex)}
          className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-red-600 focus:ring-red-500 flex-shrink-0 mt-1 sm:mt-0"
        />

        {/* 컬렉션 뱃지 */}
        <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0 ${doc.collectionColor}`}>
          {doc.collectionLabel}
        </span>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4">
            <div className="flex items-center gap-1.5 min-w-0">
              <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-900 truncate">{info.name}</span>
            </div>
            {info.email !== '-' && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-600 truncate">{info.email}</span>
              </div>
            )}
            {info.phone !== '-' && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-600 truncate">{info.phone}</span>
              </div>
            )}
          </div>
          {/* 연관 매칭 경로 표시 */}
          {info.details && (
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1">
              {info.details.split('  ·  ').map((part, i) => {
                const isPaymentConfirmed = part === '납부: 입금완료';
                const isCancelled = part.includes('취소') || part.includes('환불');
                return (
                  <span key={i} className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded ${
                    isPaymentConfirmed ? 'bg-emerald-100 text-emerald-700' :
                    isCancelled ? 'bg-red-100 text-red-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {part}
                  </span>
                );
              })}
            </div>
          )}
          {doc.matchedVia && (
            <div className="flex items-center gap-1 mt-1">
              <Link2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs text-slate-400">{doc.matchedVia}</span>
            </div>
          )}
        </div>

        {/* ID (데스크톱만) */}
        <span className="hidden sm:block text-[10px] text-slate-400 font-mono flex-shrink-0">
          {doc.id.length > 16 ? doc.id.slice(0, 16) + '...' : doc.id}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* 헤더 카드 */}
      <Card className="!p-4 sm:!p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
          <h1 className="text-lg sm:text-2xl font-bold text-slate-900">회원 데이터 관리</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">
          이름, 이메일, 전화번호로 검색하면 모든 컬렉션에서 관련 데이터를 찾아 한 번에 삭제합니다.
        </p>

        {/* 검색 */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="이름, 이메일, 전화번호 입력..."
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98] transition-all"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                검색 중...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                검색
              </>
            )}
          </button>
        </div>

        {/* 검색 대상 컬렉션 안내 */}
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
          {[...PRIMARY_COLLECTIONS, ...RELATED_COLLECTIONS].map(col => (
            <span key={col.name} className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-medium ${col.color}`}>
              {col.label}
            </span>
          ))}
        </div>
      </Card>

      {/* 검색 결과 */}
      {hasSearched && (
        <Card className="!p-4 sm:!p-6 mb-4 sm:mb-6">
          {/* 결과 헤더 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              검색 결과
              <span className="ml-2 text-xs sm:text-sm font-normal text-slate-500">
                총 {results.length}건 (직접 {primaryResults.length} + 연관 {relatedResults.length})
              </span>
            </h2>
            {results.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={toggleSelectAll}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {results.every(r => r.selected) ? '전체 해제' : '전체 선택'}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || selectedCount === 0}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-xl font-semibold text-xs sm:text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2 active:scale-[0.98] transition-all"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                      삭제 중...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      선택 삭제 ({selectedCount})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* 직접 매칭 결과 */}
              {primaryResults.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs sm:text-sm font-bold text-slate-700">직접 매칭 ({primaryResults.length}건)</h3>
                    </div>
                    <button
                      onClick={() => toggleSelectByType('primary')}
                      className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {primaryResults.every(r => r.selected) ? '해제' : '모두 선택'}
                    </button>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    {primaryResults.map((doc, i) => renderResultItem(doc, i))}
                  </div>
                </div>
              )}

              {/* 연관 데이터 결과 */}
              {relatedResults.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowRelated(!showRelated)}
                    className="flex items-center justify-between w-full mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-amber-600" />
                      <h3 className="text-xs sm:text-sm font-bold text-slate-700">연관 데이터 ({relatedResults.length}건)</h3>
                      <span className="text-[10px] sm:text-xs text-slate-400">userId/전화번호/이메일 기반</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSelectByType('related'); }}
                        className="text-[10px] sm:text-xs text-amber-600 hover:text-amber-700 font-medium"
                      >
                        {relatedResults.every(r => r.selected) ? '해제' : '모두 선택'}
                      </button>
                      {showRelated ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>
                  {showRelated && (
                    <div className="space-y-1.5 sm:space-y-2">
                      {relatedResults.map((doc, i) => renderResultItem(doc, i))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* 삭제 로그 */}
      {deleteLog.length > 0 && (
        <Card className="!p-4 sm:!p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">삭제 결과</h2>
          </div>
          <div className="bg-slate-900 rounded-xl p-3 sm:p-4 max-h-[300px] overflow-y-auto font-mono text-xs sm:text-sm">
            {deleteLog.map((log, i) => (
              <p key={i} className={`whitespace-pre-wrap leading-relaxed ${
                log.startsWith('✅') ? 'text-emerald-400' :
                log.startsWith('❌') ? 'text-red-400' :
                log.startsWith('━') ? 'text-amber-300 font-bold' :
                'text-slate-300'
              }`}>
                {log}
              </p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CleanupAccounts;

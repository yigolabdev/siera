import { X, RefreshCw, TrendingUp } from 'lucide-react';
import { useDevMode, ApplicationStatus } from '../contexts/DevModeContext';
import { Link } from 'react-router-dom';

interface DevModePanelProps {
  onClose: () => void;
}

const DevModePanel = ({ onClose }: DevModePanelProps) => {
  const { 
    applicationStatus, 
    setApplicationStatus, 
    specialApplicationStatus,
    setSpecialApplicationStatus,
    resetToDefault, 
    toggleDevMode, 
    isDevMode 
  } = useDevMode();

  const applicationStatuses: { value: ApplicationStatus; label: string; description: string }[] = [
    { value: 'open', label: '신청 가능', description: '정상적으로 신청 가능한 상태' },
    { value: 'closed', label: '신청 마감', description: '신청 기간 종료 (버튼 비활성화)' },
    { value: 'full', label: '정원 마감', description: '정원 초과 (버튼 비활성화)' },
    { value: 'no-event', label: '산행 미정', description: '다음 산행 일정이 결정되지 않음' },
  ];

  const handleStatusChange = (status: ApplicationStatus) => {
    // 상태를 변경할 때 자동으로 개발자 모드 활성화
    if (!isDevMode) {
      toggleDevMode();
    }
    setApplicationStatus(status);
  };

  const handleSpecialStatusChange = (status: ApplicationStatus) => {
    // 상태를 변경할 때 자동으로 개발자 모드 활성화
    if (!isDevMode) {
      toggleDevMode();
    }
    setSpecialApplicationStatus(status);
  };

  const handleComplete = () => {
    // 현재 페이지를 유지하고 모달만 닫기
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">개발자 모드 설정</h2>
              <p className="text-sm text-slate-600 mt-1">신청 상태를 선택하고 완료 버튼을 눌러주세요</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* Developer Menu Links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-slate-900">개발자 메뉴</h3>
            </div>
            <div className="space-y-2">
              <Link
                to="/home/attendance"
                onClick={onClose}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-3"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">참여율 통계</p>
                  <p className="text-sm text-slate-600 mt-1">
                    회원별 산행 참여율 및 통계 (향후 일반 회원 오픈 예정)
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Regular Application Status */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-slate-900">정기 산행 신청 상태</h3>
            </div>
            <div className="space-y-2">
              {applicationStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    applicationStatus === status.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{status.label}</p>
                      <p className="text-sm text-slate-600 mt-1">{status.description}</p>
                    </div>
                    {applicationStatus === status.value && (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Special Application Status */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-slate-900">✨ 특별 산행 신청 상태</h3>
            </div>
            <div className="space-y-2">
              {applicationStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleSpecialStatusChange(status.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    specialApplicationStatus === status.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{status.label}</p>
                      <p className="text-sm text-slate-600 mt-1">{status.description}</p>
                    </div>
                    {specialApplicationStatus === status.value && (
                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 rounded-b-2xl">
          {/* 현재 선택된 상태 표시 */}
          <div className="mb-4 space-y-2">
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-900">
                <span className="font-bold">정기 산행:</span>{' '}
                {applicationStatuses.find(s => s.value === applicationStatus)?.label}
              </p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <p className="text-sm text-purple-900">
                <span className="font-bold">✨ 특별 산행:</span>{' '}
                {applicationStatuses.find(s => s.value === specialApplicationStatus)?.label}
              </p>
            </div>
            <p className="text-xs text-slate-600 text-center">
              완료 버튼을 누르면 이 상태가 페이지에 즉시 반영됩니다
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={resetToDefault}
              className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              기본값으로 초기화
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevModePanel;

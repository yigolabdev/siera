import toast from 'react-hot-toast';

/**
 * 성공 메시지 표시
 */
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#fff',
      fontWeight: '600',
    },
  });
};

/**
 * 에러 메시지 표시
 */
export const showError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#fff',
      fontWeight: '600',
    },
  });
};

/**
 * 정보 메시지 표시
 */
export const showInfo = (message: string) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontWeight: '600',
    },
  });
};

/**
 * 로딩 메시지 표시
 * 반환된 ID를 사용하여 나중에 dismiss 가능
 */
export const showLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

/**
 * 특정 toast 닫기
 */
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

/**
 * 모든 toast 닫기
 */
export const dismissAll = () => {
  toast.dismiss();
};

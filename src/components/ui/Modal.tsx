import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

const Modal = ({
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
  showCloseButton = true,
}: ModalProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b">
            {title && <h3 className="text-2xl font-bold text-gray-900">{title}</h3>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;


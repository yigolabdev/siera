import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const PageHeader = ({ title, description, action, className = '' }: PageHeaderProps) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8 ${className}`}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{title}</h1>
        {description && (
          <p className="text-sm sm:text-base text-slate-600">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

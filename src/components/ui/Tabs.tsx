import { ReactNode } from 'react';

export interface TabItem {
  key: string;
  label: string;
  count?: number;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

const Tabs = ({ tabs, activeTab, onChange, size = 'md', className = '' }: TabsProps) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 sm:px-6 py-3 text-sm sm:text-base',
  };

  return (
    <div className={`border-b border-slate-200 ${className}`}>
      <div className="flex gap-0 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`${sizeClasses[size]} font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === tab.key
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.icon && <span className="w-4 h-4 flex-shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1 text-xs font-medium rounded-full px-1.5 py-0.5 ${
                activeTab === tab.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;

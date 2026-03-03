export interface FilterOption {
  key: string;
  label: string;
  count?: number;
}

interface FilterGroupProps {
  options: FilterOption[];
  selected: string;
  onChange: (key: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

const FilterGroup = ({ options, selected, onChange, size = 'md', className = '' }: FilterGroupProps) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm',
    md: 'px-4 sm:px-5 py-2 text-sm',
  };

  return (
    <div className={`flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onChange(option.key)}
          className={`${sizeClasses[size]} rounded-lg whitespace-nowrap font-medium transition-all flex-shrink-0 ${
            selected === option.key
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {option.label}
          {option.count !== undefined && (
            <span className="ml-1 opacity-75">({option.count})</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterGroup;

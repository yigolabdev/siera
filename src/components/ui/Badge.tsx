import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge = ({ children, variant = 'primary', size = 'md', className = '' }: BadgeProps) => {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800 border border-primary-300',
    success: 'bg-success-100 text-success-800 border border-success-300',
    warning: 'bg-warning-100 text-warning-800 border border-warning-300',
    danger: 'bg-danger-100 text-danger-800 border border-danger-300',
    info: 'bg-info-100 text-info-800 border border-info-300',
    default: 'bg-slate-100 text-slate-800 border border-slate-300',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

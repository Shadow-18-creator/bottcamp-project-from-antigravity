import React from 'react';

export function Badge({
  children,
  variant = 'default', // 'default' | 'Technical' | 'Cultural' | 'Sports' | 'Workshop' | 'Seminar' | 'Social' | 'success' | 'warning' | 'danger'
  size = 'md',
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    Technical: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    Cultural: 'bg-pink-50 text-pink-700 border border-pink-200/80',
    Sports: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    Workshop: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    Seminar: 'bg-purple-50 text-purple-700 border border-purple-200/80',
    Social: 'bg-cyan-50 text-cyan-800 border border-cyan-200/80',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
  };

  const selectedStyle = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full tracking-wide transition-colors ${sizeStyles[size]} ${selectedStyle} ${className}`}
    >
      {children}
    </span>
  );
}

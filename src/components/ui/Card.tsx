// ============================================
// DermaScan — Card Component
// ============================================

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const variantStyles: Record<'default' | 'elevated' | 'outlined' | 'filled', CSSProperties> = {
  default: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(13, 107, 94, 0.05)',
  },
  elevated: {
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(13, 107, 94, 0.05)',
  },
  outlined: {
    backgroundColor: '#ffffff',
    border: '1px solid rgba(13, 107, 94, 0.12)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  filled: {
    backgroundColor: '#f5eedf',
    border: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
  },
};

const paddingStyles: Record<'none' | 'sm' | 'md' | 'lg', CSSProperties> = {
  none: {},
  sm: { padding: '16px' },
  md: { padding: '20px' },
  lg: { padding: '24px' },
};

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  style,
  ...props
}: CardProps) {
  const mergedStyle: CSSProperties = {
    ...variantStyles[variant],
    ...paddingStyles[padding],
    ...style,
  };

  return (
    <div
      className={`
        rounded-2xl transition-all duration-200
        ${hover ? 'cursor-pointer hover:scale-[1.01] hover:shadow-md' : ''}
        ${className}
      `}
      style={mergedStyle}
      {...props}
    >
      {children}
    </div>
  );
}


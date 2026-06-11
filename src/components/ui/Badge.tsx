// ============================================
// DermaScan — Badge Component
// ============================================

import type { CSSProperties, ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'budget' | 'standard' | 'premium' | 'recommended';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md';
  style?: CSSProperties;
}

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  success: { backgroundColor: '#ECFDF5', color: '#047857', borderColor: '#A7F3D0' },
  warning: { backgroundColor: '#FFFBEB', color: '#B45309', borderColor: '#FDE68A' },
  danger: { backgroundColor: '#FEF2F2', color: '#B91C1C', borderColor: '#FCA5A5' },
  info: { backgroundColor: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' },
  budget: { backgroundColor: '#ECFDF5', color: '#047857', borderColor: '#A7F3D0' },
  standard: { backgroundColor: 'rgba(13, 107, 94, 0.1)', color: '#0d6b5e', borderColor: 'rgba(13, 107, 94, 0.2)' },
  premium: { backgroundColor: '#FFFBEB', color: '#B45309', borderColor: '#FDE68A' },
  recommended: { backgroundColor: '#0d6b5e', color: '#ffffff', borderColor: '#0d6b5e' },
};

const sizeStyles: Record<'sm' | 'md', CSSProperties> = {
  sm: { padding: '2px 8px', fontSize: '0.75rem' },
  md: { padding: '4px 12px', fontSize: '0.75rem' },
};

export default function Badge({
  variant = 'info',
  children,
  className = '',
  size = 'md',
  style,
}: BadgeProps) {
  const mergedStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: 600,
    borderRadius: '9999px',
    border: '1px solid',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <span
      className={className}
      style={mergedStyle}
    >
      {children}
    </span>
  );
}


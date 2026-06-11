// ============================================
// DermaScan — Progress Bar Component
// ============================================

import type { CSSProperties } from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const variantColors: Record<'primary' | 'success' | 'warning' | 'danger', string> = {
  primary: '#0d6b5e',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

const sizeStyles: Record<'sm' | 'md' | 'lg', CSSProperties> = {
  sm: { height: '6px' },
  md: { height: '10px' },
  lg: { height: '16px' },
};

export default function ProgressBar({
  value,
  label,
  showPercentage = true,
  variant = 'primary',
  size = 'md',
  className = '',
  animated = true,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span style={{ color: '#0d6b5e', fontSize: '0.875rem', fontWeight: 700 }}>
              {clampedValue}% Match
            </span>
          )}
        </div>
      )}
      <div
        className="w-full bg-gray-100 rounded-full overflow-hidden"
        style={sizeStyles[size]}
      >
        <div
          className="rounded-full"
          style={{
            ...sizeStyles[size],
            width: `${clampedValue}%`,
            backgroundColor: variantColors[variant],
            transition: animated ? 'width 1s ease-out' : 'none',
          }}
        />
      </div>
    </div>
  );
}


// ============================================
// DermaScan — Button Component
// ============================================

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'social';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

/* ---- Inline style maps guarantee rendering in Tailwind v4 ---- */
const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #0d6b5e 0%, #169382 100%)',
    color: '#fff',
    boxShadow: '0 4px 14px rgba(13,107,94,0.3)',
  },
  secondary: {
    background: '#fff',
    color: '#0d6b5e',
    border: '2px solid #0d6b5e',
  },
  outline: {
    background: 'transparent',
    color: '#374151',
    border: '1px solid #d1d5db',
  },
  ghost: {
    background: 'transparent',
    color: '#6b7280',
  },
  danger: {
    background: '#e05252',
    color: '#fff',
    boxShadow: '0 4px 14px rgba(224,82,82,0.3)',
  },
  social: {
    background: '#fff',
    color: '#374151',
    border: '1px solid #169382',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { padding: '8px 16px', fontSize: '0.875rem', borderRadius: '12px', gap: '8px' },
  md: { padding: '14px 24px', fontSize: '1rem', borderRadius: '16px', gap: '10px' },
  lg: { padding: '18px 32px', fontSize: '1.125rem', borderRadius: '16px', gap: '12px' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  style,
  ...props
}: ButtonProps) {
  const merged: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.5 : 1,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : undefined,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      className={className}
      disabled={disabled || isLoading}
      style={merged}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 6px 20px rgba(13,107,94,0.4)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 4px 14px rgba(13,107,94,0.3)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        }
      }}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            width: 20,
            height: 20,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : (
        <>
          {icon && <span style={{ flexShrink: 0 }}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

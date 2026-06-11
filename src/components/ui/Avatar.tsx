// ============================================
// DermaScan — Avatar Component
// ============================================

import type { CSSProperties } from 'react';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles: Record<'sm' | 'md' | 'lg' | 'xl', CSSProperties> = {
  sm: { width: 32, height: 32, fontSize: '0.75rem' },
  md: { width: 40, height: 40, fontSize: '0.875rem' },
  lg: { width: 56, height: 56, fontSize: '1.125rem' },
  xl: { width: 80, height: 80, fontSize: '1.5rem' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ name, imageUrl, size = 'md', className = '' }: AvatarProps) {
  const mergedStyle: CSSProperties = {
    position: 'relative',
    borderRadius: '9999px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0d6b5e 0%, #1F5252 100%)',
    color: '#ffffff',
    fontWeight: 'bold',
    border: '2px solid #ffffff',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    ...sizeStyles[size],
  };

  return (
    <div
      className={className}
      style={mergedStyle}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}


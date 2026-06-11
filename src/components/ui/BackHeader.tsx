// ============================================
// DermaScan — BackHeader Component
// ============================================

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

interface BackHeaderProps {
  title?: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  showMenu?: boolean;
  transparent?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function BackHeader({
  title,
  onBack,
  rightAction,
  showMenu = false,
  transparent = false,
  className = '',
  style,
}: BackHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const headerStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px',
    paddingLeft: '16px',
    paddingRight: '16px',
    backgroundColor: transparent ? 'transparent' : 'rgba(255, 249, 245, 0.95)',
    backdropFilter: transparent ? 'none' : 'blur(8px)',
    WebkitBackdropFilter: transparent ? 'none' : 'blur(8px)',
    borderBottom: transparent ? 'none' : '1px solid rgba(13, 107, 94, 0.08)',
    ...style,
  };

  return (
    <header
      className={className}
      style={headerStyle}
    >
      <button
        onClick={handleBack}
        className="p-2 -ml-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        id="btn-back"
      >
        <ArrowLeft size={22} />
      </button>

      {title && (
        <h1
          className="text-base font-semibold text-gray-900"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            margin: 0,
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {title}
        </h1>
      )}

      <div className="flex items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {rightAction}
        {showMenu && (
          <button
            className="p-2 -mr-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            id="btn-menu"
          >
            <MoreVertical size={20} />
          </button>
        )}
      </div>
    </header>
  );
}


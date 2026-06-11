import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Clock, Stethoscope, BookOpen, User } from 'lucide-react';

const navItems = [
  { path: '/scan', label: 'Home', icon: Home },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/consult', label: 'Experts', icon: Stethoscope },
  { path: '/library', label: 'Library', icon: BookOpen },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab - home maps to scan
  const getIsActive = (path: string) => {
    if (path === '/scan') {
      return location.pathname === '/home' || (location.pathname.startsWith('/scan') && !location.pathname.startsWith('/scan/product'));
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'around', height: '100%', paddingLeft: '16px', paddingRight: '16px' }}>
        {navItems.map((item) => {
          const isActive = getIsActive(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path === '/scan' ? '/home' : item.path)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                background: 'none',
                border: 'none',
                height: '100%',
                padding: '4px 0',
                cursor: 'pointer',
                minWidth: '44px',
                minHeight: '44px',
              }}
              id={`nav-${item.label.toLowerCase()}`}
            >
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  backgroundColor: isActive ? '#0d6b5e' : 'transparent',
                  color: isActive ? '#ffffff' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <Icon
                  style={{
                    width: 'clamp(20px, 5.5vw, 26px)',
                    height: 'clamp(20px, 5.5vw, 26px)',
                  }}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span
                style={{
                  fontSize: 'clamp(9px, 2.5vw, 11px)',
                  fontWeight: 500,
                  color: isActive ? '#0d6b5e' : '#9ca3af',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}


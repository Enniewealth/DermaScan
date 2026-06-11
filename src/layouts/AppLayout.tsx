import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Camera, Home, Clock, Stethoscope, BookOpen, User } from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

const topNavItems = [
  { path: '/scan', label: 'Home', icon: Home },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/consult', label: 'Experts', icon: Stethoscope },
  { path: '/library', label: 'Library', icon: BookOpen },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getIsActive = (path: string) => {
    if (path === '/scan') {
      return location.pathname === '/home' || (location.pathname.startsWith('/scan') && !location.pathname.startsWith('/scan/product'));
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-root-layout">
      {/* LEFT COLUMN */}
      <div className="left-column">
        {/* Top Desktop Navigation */}
        <header className="desktop-top-nav" style={{ width: '100%' }}>
          <div style={{
            maxWidth: '900px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 'clamp(24px, 6vw, 80px)',
            paddingRight: 'clamp(24px, 6vw, 80px)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/home')}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(13, 107, 94, 0.12)', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#0d6b5e' }}>Derma<span style={{ color: '#169382' }}>Scan</span></span>
            </div>
            <div className="desktop-nav-links">
              {topNavItems.map((item) => {
                const isActive = getIsActive(item.path);
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path === '/scan' ? '/home' : item.path)}
                    className={`desktop-nav-link ${isActive ? 'active' : ''}`}
                    id={`desktop-nav-${item.label.toLowerCase()}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Scrollable Mobile Content inside Left Column */}
        <div className="left-column-content-scroll">
          <main className="left-column-main">
            <div className="layout-main-content">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Floating Action Button (FAB) for scanning */}
        <button
          onClick={() => navigate('/scan/new')}
          className="fab-scan-button"
          id="fab-scan"
        >
          <Camera style={{ width: 'clamp(24px, 6vw, 30px)', height: 'clamp(24px, 6vw, 30px)' }} />
        </button>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>

      {/* RIGHT COLUMN */}
      <div className="right-column">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          {/* Logo & Branding */}
          <div className="flex flex-col items-center" style={{ marginBottom: '32px' }}>
            <div
              className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg bg-white flex items-center justify-center border border-cream-dark/20 animate-fade-in"
              style={{ marginBottom: '16px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img
                src="/logo.png"
                alt="DermaScan Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <h1 className="text-3xl font-extrabold text-white" style={{ margin: 0 }}>
              Derma<span style={{ color: '#A3D9D9' }}>Scan</span>
            </h1>
            <p className="text-white/90 text-sm font-medium" style={{ marginTop: '8px' }}>
              Advanced skin analysis for African skin tones.
            </p>
          </div>

          {/* Stat Cards Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {[
              { num: '10,000+', label: 'Skin conditions analysed' },
              { num: '94%', label: 'Average accuracy rate' },
              { num: '15+', label: 'Detectable conditions' },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  color: '#ffffff',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1 }}>{stat.num}</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




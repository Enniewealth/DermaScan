// ============================================
// DermaScan — Auth Layout (No Bottom Nav)
// ============================================

import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { api } from '../services/api';

export default function AuthLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Warm up Render backend on auth pages (handles free tier cold start)
  useEffect(() => {
    if (!isLandingPage) {
      api.get('/health').catch(() => {});
    }
  }, []);

  // Standalone full-width layout for the main landing page
  if (isLandingPage) {
    return <Outlet />;
  }

  return (
    <div className="app-root-layout">
      {/* LEFT COLUMN */}
      <div className="left-column" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Teal radial gradient glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(22, 147, 130, 0.15) 0%, rgba(253, 248, 241, 0) 70%)',
          }}
        />

        {/* Scrollable Mobile Content inside Left Column */}
        <div className="left-column-content-scroll" style={{ display: 'flex', flexDirection: 'column' }}>
          <main
            className="left-column-main"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '100%',
              paddingTop: '40px',
              paddingBottom: '40px',
            }}
          >
            <div className="auth-page-wrapper w-full" style={{ width: '100%' }}>
              <Outlet />
            </div>
          </main>
        </div>
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

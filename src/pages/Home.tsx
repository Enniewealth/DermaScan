import { useNavigate } from 'react-router-dom';
import { Camera, Upload, User, CloudOff, MessageCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { ScanResult } from '../types';
import { useOffline } from '../contexts/OfflineContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOffline } = useOffline();
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScans = async () => {
    setLoading(true);
    setScans([]);
    try {
      const historyData = await api.get<ScanResult[]>('/scans/history');
      setScans(historyData);
    } catch (err) {
      console.error('Failed to load scan history:', err);
      setScans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, [user?.id]);



  const scansThisMonth = scans.filter(s => {
    const scanDate = new Date(s.date);
    const now = new Date();
    return scanDate.getMonth() === now.getMonth() && scanDate.getFullYear() === now.getFullYear();
  }).length;

  const activeConditionsCount = scans.filter(s => {
    const sev = s.severity.toLowerCase();
    return sev === 'moderate' || sev === 'severe' || sev === 'critical';
  }).length;

  // Recent scans carousel cards
  const recentScans = scans.slice(0, 5);

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px', paddingBottom: '32px', boxSizing: 'border-box' }}>
      
      {/* Inline style block for the primary CTA button pulse effect */}
      <style>{`
        @keyframes buttonPulse {
          0%, 100% {
            box-shadow: 0 4px 14px rgba(13, 107, 94, 0.3);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 4px 22px rgba(13, 107, 94, 0.55);
            transform: scale(1.005);
          }
        }
        .pulse-cta-button {
          animation: buttonPulse 2.5s infinite ease-in-out;
        }
      `}</style>



      {/* EMPTY OFFLINE STATE */}
      {!loading && isOffline && scans.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '48px 24px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          marginTop: '24px',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(107, 114, 128, 0.08)',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <CloudOff size={36} />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 10px 0' }}>
            You're offline
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0', lineHeight: 1.5 }}>
            You can still take scans — they'll process when you reconnect
          </p>

          <Button
            fullWidth
            onClick={() => navigate('/scan')}
            style={{ minHeight: '48px' }}
          >
            Go to Camera
          </Button>
        </div>
      ) : (
        <>
          {/* GREETING SECTION */}
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0 }}>
              {(() => {
                const h = new Date().getHours();
                if (h >= 5 && h < 12) return 'Good morning';
                if (h >= 12 && h < 17) return 'Good afternoon';
                if (h >= 17 && h < 22) return 'Good evening';
                return 'Hi';
              })()}, {user?.fullName?.split(' ')[0] || (user?.email?.split('@')[0]) || 'there'}
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', margin: 0 }}>
              Your skin deserves answers, not guesswork
            </p>
          </div>



      {/* PRIMARY CTA */}
      <button
        onClick={() => navigate('/scan')}
        className="pulse-cta-button"
        style={{
          width: '100%',
          background: '#0d6b5e',
          color: '#ffffff',
          border: 'none',
          borderRadius: '16px',
          padding: '16px',
          fontSize: '15px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: '0 4px 14px rgba(13, 107, 94, 0.3)',
          outline: 'none',
          transition: 'all 0.2s'
        }}
      >
        <Camera size={18} />
        <span>Start Skin Scan</span>
      </button>

      {/* ACTION CARDS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', width: '100%' }}>
        {[
          { icon: <Upload size={20} style={{ color: '#0d6b5e' }} />, label: 'Upload Photo', action: () => navigate('/scan') },
          { icon: <Camera size={20} style={{ color: '#0d6b5e' }} />, label: 'Take Photo', action: () => navigate('/scan') },
          { icon: <MessageCircle size={20} style={{ color: '#0d6b5e' }} />, label: 'Chat Derm', action: () => navigate('/chat') },
          { icon: <User size={20} style={{ color: '#0d6b5e' }} />, label: 'Ask Expert', action: () => navigate('/consult') }
        ].map((item, idx) => (
          <Card
            key={idx}
            variant="default"
            padding="sm"
            hover
            onClick={item.action}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#ffffff',
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'rgba(13, 107, 94, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px'
            }}>
              {item.icon}
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#374151', lineHeight: 1.2 }}>{item.label}</span>
          </Card>
        ))}
      </div>

      {/* RECENT SCANS CAROUSEL */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>Recent Scans</h2>
          <button
            onClick={() => navigate('/history')}
            style={{ fontSize: '13px', fontWeight: 700, color: '#0d6b5e', display: 'flex', alignItems: 'center', minWidth: '44px', minHeight: '44px' }}
          >
            See All
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#6b7280' }}>
            <p style={{ fontSize: '13px' }}>Loading recent scans...</p>
          </div>
        ) : recentScans.length === 0 ? (
          <Card variant="default" padding="lg" style={{ textAlign: 'center', border: '1px dashed rgba(13, 107, 94, 0.15)', borderRadius: '16px' }}>
            <Camera size={32} style={{ margin: '0 auto 12px auto', color: '#6b7280', opacity: 0.5 }} />
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px 0' }}>No scans completed yet</p>
            <Button size="sm" onClick={() => navigate('/scan')}>Start First Scan</Button>
          </Card>
        ) : (
          <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px' }} className="scrollbar-hide">
            {recentScans.map((scan) => {
              // Severity badge colors
              const sev = scan.severity.toLowerCase();
              let sevColor = '#4caf87';
              let sevBg = '#e6f6ee';
              if (sev === 'moderate' || sev === 'warning') {
                sevColor = '#e8a838';
                sevBg = '#fef6e7';
              } else if (sev === 'severe' || sev === 'danger' || sev === 'critical') {
                sevColor = '#e05252';
                sevBg = '#fbebeb';
              }

              return (
                <Card
                  key={scan.id}
                  variant="default"
                  padding="md"
                  hover
                  onClick={() => navigate(`/scan/results/${scan.id}`)}
                  style={{
                    width: '180px',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(13, 107, 94, 0.05)',
                    background: '#ffffff'
                  }}
                >
                  <div style={{ height: '110px', borderRadius: '12px', overflow: 'hidden', background: '#E5E7EB', position: 'relative' }}>
                    <img
                      src={scan.imageUrl.startsWith('http') ? scan.imageUrl : `http://${window.location.hostname}:8000${scan.imageUrl}`}
                      alt={scan.condition.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '0 4px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {scan.condition.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginTop: '6px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#0d6b5e' }}>{scan.confidence}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#0d6b5e' }}>% match</span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#6b7280', display: 'block', marginTop: '4px' }}>
                      {new Date(scan.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  {/* Severity badge pill */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    backgroundColor: sevBg,
                    color: sevColor,
                    fontSize: '10px',
                    fontWeight: 700,
                    alignSelf: 'flex-start',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {scan.severity}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* STATS ROW */}
      <Card
        variant="default"
        padding="md"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          textAlign: 'center',
          alignItems: 'center',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: 'none'
        }}
      >
        {[
          { value: scansThisMonth, label: 'Scans This Month' },
          { value: activeConditionsCount, label: 'Active Conditions' },
          { value: 0, label: 'Expert Consults' }
        ].map((stat, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#0d6b5e', lineHeight: 1 }}>{stat.value}</span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280', marginTop: '6px', lineHeight: 1.2 }}>{stat.label}</span>
          </div>
        ))}
      </Card>
        </>
      )}
    </div>
  );
}

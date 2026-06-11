import { WifiOff, X, Wifi } from 'lucide-react';
import { useOffline } from '../../contexts/OfflineContext';

export default function OfflineBanner() {
  const {
    isOffline,
    isBannerDismissed,
    dismissBanner,
    showSuccessBanner,
    processingProgress
  } = useOffline();

  if (!isOffline && !showSuccessBanner) return null;
  if (isOffline && isBannerDismissed) return null;

  if (showSuccessBanner) {
    return (
      <div style={{
        backgroundColor: '#0d6b5e',
        color: '#ffffff',
        padding: '12px 16px',
        fontSize: '13px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        animation: 'slideDown 0.3s ease-out'
      }}>
        <Wifi size={16} />
        <span>{processingProgress || 'Back online — processing your queued scan...'}</span>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#e8a838',
      color: '#ffffff',
      padding: '12px 16px',
      fontSize: '13px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 99999,
      boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
      boxSizing: 'border-box',
      animation: 'slideDown 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <WifiOff size={16} style={{ flexShrink: 0 }} />
        <span>You're offline — scans will queue automatically</span>
      </div>
      <button
        onClick={dismissBanner}
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '24px',
          minHeight: '24px',
          opacity: 0.85
        }}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

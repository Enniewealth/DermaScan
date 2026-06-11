import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';

export interface QueuedScan {
  id: string;
  capturedImage: string;
  symptoms: string;
  timestamp: string;
}

interface OfflineContextType {
  isOffline: boolean;
  setIsOfflineOverride: (val: boolean | null) => void;
  queuedScans: QueuedScan[];
  queueScan: (capturedImage: string, symptoms: string) => string;
  removeQueuedScan: (id: string) => void;
  isProcessingQueue: boolean;
  processingProgress: string;
  showSuccessBanner: boolean;
  dismissBanner: () => void;
  isBannerDismissed: boolean;
  triggerMockOfflineToggle: () => void;
  syncQueue: (navigate: (path: string) => void) => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | null>(null);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineOverride, setOfflineOverride] = useState<boolean | null>(null);
  
  const [queuedScans, setQueuedScans] = useState<QueuedScan[]>(() => {
    const saved = localStorage.getItem('dermascan_queued_scans');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [processingProgress, setProcessingProgress] = useState('');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  useEffect(() => {
    localStorage.setItem('dermascan_queued_scans', JSON.stringify(queuedScans));
  }, [queuedScans]);

  useEffect(() => {
    const handleOnline = () => {
      if (offlineOverride === null) {
        setIsOffline(false);
        setIsBannerDismissed(false);
      }
    };
    const handleOffline = () => {
      if (offlineOverride === null) {
        setIsOffline(true);
        setIsBannerDismissed(false);
        setShowSuccessBanner(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineOverride]);

  const activeOffline = offlineOverride !== null ? offlineOverride : isOffline;

  const queueScan = (capturedImage: string, symptoms: string) => {
    const newScan: QueuedScan = {
      id: 'q_' + Math.random().toString(36).substring(2, 9),
      capturedImage,
      symptoms,
      timestamp: new Date().toISOString()
    };
    setQueuedScans((prev) => [...prev, newScan]);
    return newScan.id;
  };

  const removeQueuedScan = (id: string) => {
    setQueuedScans((prev) => prev.filter((s) => s.id !== id));
  };

  const dismissBanner = () => {
    setIsBannerDismissed(true);
  };

  const triggerMockOfflineToggle = () => {
    setOfflineOverride((prev) => {
      const next = prev === null ? !isOffline : !prev;
      setIsOffline(next);
      setIsBannerDismissed(false);
      if (next) {
        setShowSuccessBanner(false);
      }
      return next;
    });
  };

  const syncQueue = async (navigate: (path: string) => void) => {
    if (queuedScans.length === 0 || isProcessingQueue) return;
    
    setIsProcessingQueue(true);
    setProcessingProgress('Back online — processing your queued scan...');
    setShowSuccessBanner(true);
    setIsBannerDismissed(false);

    let lastResultId = '';

    const dataURLtoBlob = (dataurl: string): Blob => {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    };

    // Process scans
    for (const scan of queuedScans) {
      try {
        const blob = dataURLtoBlob(scan.capturedImage);
        const file = new File([blob], 'scan_image.jpg', { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('symptoms', scan.symptoms || 'Queued offline scan');

        const result = await api.postMultipart<any>('/scans/analyze', formData);
        lastResultId = result.id;
        
        // Remove from state list
        setQueuedScans((prev) => prev.filter((s) => s.id !== scan.id));
      } catch (err) {
        console.error('Failed to sync queued scan:', err);
      }
    }

    setIsProcessingQueue(false);
    
    if (lastResultId) {
      if (Notification.permission === 'granted') {
        new Notification("DermaScan", {
          body: "📱 Your queued scan is ready — tap to view results",
          icon: "/logo.png"
        });
      }

      setTimeout(() => {
        setShowSuccessBanner(false);
        navigate(`/scan/results/${lastResultId}`);
      }, 2000);
    } else {
      setShowSuccessBanner(false);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOffline: activeOffline,
        setIsOfflineOverride: setOfflineOverride,
        queuedScans,
        queueScan,
        removeQueuedScan,
        isProcessingQueue,
        processingProgress,
        showSuccessBanner,
        dismissBanner,
        isBannerDismissed,
        triggerMockOfflineToggle,
        syncQueue
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within OfflineProvider');
  return context;
}

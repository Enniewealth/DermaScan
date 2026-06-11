import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffline } from '../../contexts/OfflineContext';

export default function OfflineSyncManager() {
  const { isOffline, queuedScans, syncQueue } = useOffline();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOffline && queuedScans.length > 0) {
      syncQueue(navigate);
    }
  }, [isOffline, queuedScans.length, navigate]);

  return null;
}

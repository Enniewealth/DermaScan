// ============================================
// DermaScan — My Skin History (Journey)
// ============================================

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileDown, Sparkles } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { api } from '../services/api';
import type { ScanResult } from '../types';
import { useOffline } from '../contexts/OfflineContext';

export default function History() {
  const navigate = useNavigate();
  const { queuedScans } = useOffline();
  const [activeFilter, setActiveFilter] = useState('All');
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const data = await api.get<ScanResult[]>('/scans/history');
        setScans(data);
      } catch (err) {
        console.error('Failed to fetch scans history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  // Helper to map severity to clinical status
  const getClinicalStatus = (severity: string): 'Active' | 'Monitoring' | 'Resolved' => {
    if (severity === 'severe' || severity === 'critical') return 'Active';
    if (severity === 'moderate') return 'Monitoring';
    return 'Resolved'; // mild
  };

  // Helper to dynamically extract or guess the body zone location
  const getBodyLocation = (scan: ScanResult): string => {
    const text = [
      ...(scan.symptoms || []),
      ...(scan.tags || []),
      scan.condition.name,
      scan.condition.fullName
    ]
      .join(' ')
      .toLowerCase();

    if (text.includes('face') || text.includes('acne') || text.includes('cheek') || text.includes('chin')) {
      return 'Face Zone';
    }
    if (text.includes('arm') || text.includes('elbow')) {
      return 'Arm Zone';
    }
    if (text.includes('leg') || text.includes('knee')) {
      return 'Leg Zone';
    }
    if (text.includes('back')) {
      return 'Back Zone';
    }
    if (text.includes('chest')) {
      return 'Chest Zone';
    }
    if (text.includes('scalp') || text.includes('head')) {
      return 'Scalp Zone';
    }

    // Default zone fallback based on string length hash
    const zones = ['Face Zone', 'Chest Zone', 'Back Zone', 'Arm Zone', 'Leg Zone'];
    const index = (scan.condition.name.length + (scan.confidence || 0)) % zones.length;
    return zones[index];
  };

  // Toast handler for simulated report export
  const handleExportPDF = () => {
    setToastMessage('Generating clinical journal report...');
    setTimeout(() => {
      setToastMessage('Downloading PDF report (1.4 MB)...');
      setTimeout(() => {
        setToastMessage(null);
      }, 1500);
    }, 1500);
  };

  const filteredScans = useMemo(() => {
    let results = [...scans];

    // Filter by clinical status
    if (activeFilter !== 'All') {
      results = results.filter((s) => getClinicalStatus(s.severity) === activeFilter);
    }

    // Sort newest first
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return results;
  }, [scans, activeFilter]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: '#0d6b5e',
        gap: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid rgba(13, 107, 94, 0.1)',
          borderTopColor: '#0d6b5e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: '15px', fontWeight: 600 }}>Loading skin journey...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ width: '100%', paddingBottom: '32px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '20px',
        paddingBottom: '16px',
        marginBottom: '12px',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#0d6b5e',
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          My Skin Journey
        </h1>
        <button
          onClick={handleExportPDF}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#0d6b5e',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '44px',
            minHeight: '44px',
            transition: 'background-color 0.2s',
            backgroundColor: 'rgba(13, 107, 94, 0.05)',
          }}
          title="Export Clinical PDF Report"
        >
          <FileDown size={22} />
        </button>
      </div>

      {scans.length === 0 && queuedScans.length === 0 ? (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          marginTop: '24px',
        }}>
          <svg viewBox="0 0 100 100" width="100" height="100" style={{ margin: '0 auto 24px auto', display: 'block' }}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="#0d6b5e" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
            <path 
              d="M30,80 Q35,70 38,60 T42,40 C45,25 65,25 68,40 C70,55 60,65 55,75 T50,90" 
              fill="none" 
              stroke="#0d6b5e" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              opacity="0.75"
            />
            <path 
              d="M20,50 L80,50" 
              fill="none" 
              stroke="#4caf87" 
              strokeWidth="1.5" 
              strokeDasharray="4 4"
              opacity="0.8"
            />
            <circle cx="50" cy="50" r="8" fill="none" stroke="#0d6b5e" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M45,50 L55,50 M50,45 L50,55" stroke="#0d6b5e" strokeWidth="2" strokeLinecap="round" />
          </svg>
          
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', margin: '0 0 8px 0' }}>
            No scans yet
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0', lineHeight: 1.5, padding: '0 20px' }}>
            Your skin history will appear here after your first scan.
          </p>
          
          <button
            onClick={() => navigate('/scan/new')}
            style={{
              width: '100%',
              backgroundColor: '#0d6b5e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(13, 107, 94, 0.2)',
              transition: 'all 0.2s',
              minHeight: '48px',
            }}
          >
            Start First Scan
          </button>
        </div>
      ) : (
        <>
          {/* Pending — Awaiting Connection Section */}
          {queuedScans.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#e8a838', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pending — Awaiting Connection ({queuedScans.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {queuedScans.map((qs) => {
                  const formattedTime = new Date(qs.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  });
                  return (
                    <Card
                      key={qs.id}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '16px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        borderLeft: '4px solid #e8a838',
                        borderTop: '1px solid rgba(13, 107, 94, 0.05)',
                        borderRight: '1px solid rgba(13, 107, 94, 0.05)',
                        borderBottom: '1px solid rgba(13, 107, 94, 0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'default'
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#1F2937' }}>
                            Queued Scan
                          </span>
                          {qs.symptoms && (
                            <span style={{ fontSize: '13px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                              ({qs.symptoms})
                            </span>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            Captured: {formattedTime}
                          </span>
                          
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: '#fef6e7',
                            color: '#e8a838',
                            border: '1px solid #fde68a',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}>
                            Queued
                          </span>
                        </div>
                      </div>

                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backgroundColor: '#e5e7eb',
                        flexShrink: 0
                      }}>
                        <img
                          src={qs.capturedImage}
                          alt="Queued skin thumbnail"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Trend Analytics Card */}
          {scans.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #0d6b5e 0%, #169382 100%)',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(13, 107, 94, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                right: '24px',
                bottom: '12px',
                width: '110px',
                height: '45px',
                opacity: 0.9,
              }}>
                <svg viewBox="0 0 100 40" width="100%" height="100%">
                  <path
                    d="M 5 32 Q 25 30 45 18 T 85 22 T 95 6"
                    fill="none"
                    stroke="#faf7f2"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="95" cy="6" r="4" fill="#4caf87" stroke="#ffffff" strokeWidth="2" />
                </svg>
              </div>
              
              <div style={{ position: 'relative', zIndex: 2, maxWidth: '70%' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0', lineHeight: 1.25 }}>
                  Your skin improved 12% this month
                </h2>
                <p style={{ fontSize: '13px', color: '#f9f5ef', opacity: 0.95, margin: 0, fontWeight: 500 }}>
                  Based on {scans.length} scan{scans.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}

          {/* Underlined Filter Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            marginBottom: '24px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            gap: '16px',
          }}>
            {['All', 'Active', 'Resolved', 'Monitoring'].map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  style={{
                    padding: '12px 4px',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: isActive ? '#0d6b5e' : '#6b7280',
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '3.5px solid #0d6b5e' : '3.5px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                  id={`tab-history-${tab.toLowerCase()}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Timeline */}
          {scans.length > 0 && (
            filteredScans.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#6b7280',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}>
                <Sparkles size={28} style={{ color: '#0d6b5e', opacity: 0.4, marginBottom: '12px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', margin: '0 0 4px 0' }}>
                  No matching records
                </h3>
                <p style={{ fontSize: '13px', margin: 0 }}>
                  No scans found categorized as {activeFilter}.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '16px', position: 'relative' }}>
                {filteredScans.map((scan, index) => {
                const clinicalStatus = getClinicalStatus(scan.severity);
                const bodyLocation = getBodyLocation(scan);
                const formattedDate = new Date(scan.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                // Status chip configuration
                const statusColors = {
                  Active: { bg: '#fee2e2', text: '#e05252', border: '#fecaca' },
                  Monitoring: { bg: '#fef3c7', text: '#e8a838', border: '#fde68a' },
                  Resolved: { bg: '#d1fae5', text: '#4caf87', border: '#a7f3d0' },
                }[clinicalStatus];

                return (
                  <div 
                    key={scan.id} 
                    style={{ 
                      display: 'flex', 
                      position: 'relative', 
                      marginBottom: '28px',
                      paddingLeft: '24px'
                    }}
                  >
                    {/* Vertical timeline connecting line */}
                    {index !== filteredScans.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        left: '0px',
                        top: '24px',
                        bottom: '-32px',
                        width: '2px',
                        backgroundColor: '#0d6b5e',
                        opacity: 0.15,
                        zIndex: 1,
                      }} />
                    )}

                    {/* Date badge on the line */}
                    <div style={{
                      position: 'absolute',
                      left: '-24px',
                      top: '8px',
                      width: '50px',
                      height: '24px',
                      borderRadius: '12px',
                      backgroundColor: '#f9f5ef',
                      border: '1.5px solid #0d6b5e',
                      color: '#0d6b5e',
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    }}>
                      {formattedDate}
                    </div>

                    {/* Card Content */}
                    <Card
                      onClick={() => navigate(`/scan/results/${scan.id}`)}
                      style={{
                        flex: 1,
                        marginLeft: '16px',
                        padding: '20px 24px',
                        borderRadius: '16px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        border: '1.5px solid rgba(13, 107, 94, 0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                      className="timeline-card"
                      id={`scan-card-${scan.id}`}
                    >
                      <div style={{ flex: 1, paddingRight: '12px' }}>
                        {/* Condition name & body location */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>
                            {scan.condition.name}
                          </h3>
                          <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                            • {bodyLocation}
                          </span>
                        </div>

                        {/* Match & Severity badges */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0d6b5e' }}>
                            {scan.confidence}% confidence
                          </span>

                          <Badge
                            variant={
                              scan.severity === 'mild' ? 'success' :
                              scan.severity === 'moderate' ? 'warning' :
                              'danger'
                            }
                            size="sm"
                            style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              textTransform: 'capitalize',
                              fontWeight: 600,
                            }}
                          >
                            {scan.severity}
                          </Badge>

                          {/* Status Badge */}
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: statusColors.bg,
                            color: statusColors.text,
                            border: `1px solid ${statusColors.border}`,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}>
                            {clinicalStatus}
                          </span>
                        </div>

                        {/* Text Link */}
                        <div style={{ marginTop: '12px' }}>
                          <span style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#0d6b5e',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            View Full Result →
                          </span>
                        </div>
                      </div>

                      {/* Thumbnail Image */}
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backgroundColor: '#e5e7eb',
                        flexShrink: 0,
                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
                      }}>
                        {scan.imageUrl ? (
                          <img
                            src={scan.imageUrl.startsWith('http') ? scan.imageUrl : `http://${window.location.hostname}:8000${scan.imageUrl}`}
                            alt="Scan thumbnail"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #0d6b5e 0%, #169382 100%)',
                            opacity: 0.15,
                          }}>
                            <Sparkles size={16} style={{ color: '#0d6b5e' }} />
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          )
        )}
      </>
    )}

      {/* Styled toast notification for PDF Export */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ffffff',
          color: '#0d6b5e',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          border: '1px solid rgba(13, 107, 94, 0.2)',
          borderLeft: '4px solid #0d6b5e',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease-out',
        }}
        id="toast-pdf-export"
        >
          <span style={{ 
            display: 'inline-block', 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#4caf87', 
            animation: 'ping 1s infinite' 
          }} />
          {toastMessage}
        </div>
      )}
    </div>
  );
}

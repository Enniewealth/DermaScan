// ============================================
// DermaScan — Analyzing Scan Screen
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { tipOfTheDay, mockScanResults } from '../../data/mockScans';
import { api } from '../../services/api';

const scanStages = [
  'Uploading image...',
  'Preprocessing image...',
  'Analyzing skin layers...',
  'Detecting patterns...',
  'Matching conditions...',
  'Generating report...',
  'Finalizing results...',
];

export default function AnalyzingScan() {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  const state = location.state as { capturedImage: string; symptoms: string } | null;

  const errorRef = useRef<string | null>(null);
  const apiCompletedRef = useRef(false);
  const finalScanIdRef = useRef('');

  useEffect(() => {
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

    const runAnalysis = async () => {
      if (!state?.capturedImage) {
        apiCompletedRef.current = true;
        finalScanIdRef.current = mockScanResults[0].id;
        return;
      }

      try {
        const blob = dataURLtoBlob(state.capturedImage);
        const file = new File([blob], 'scan_image.jpg', { type: 'image/jpeg' });

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('symptoms', state.symptoms || 'No symptoms specified');

        const result = await api.postMultipart<any>('/scans/analyze', formData);
        finalScanIdRef.current = result.id;
        apiCompletedRef.current = true;
      } catch (err: any) {
        console.error('Scan analysis failed:', err);
        const errMsg = err.message || 'Analysis processing failed';
        errorRef.current = errMsg;
      }
    };

    runAnalysis();

    const totalDuration = 4000; // 4 seconds total
    const interval = 50;
    const increment = 100 / (totalDuration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;

        if (next >= 98) {
          if (errorRef.current) {
            clearInterval(timer);
            alert(`Analysis Failed: ${errorRef.current}`);
            navigate('/scan/new', { replace: true });
            return prev;
          }

          if (apiCompletedRef.current) {
            clearInterval(timer);
            setProgress(100);
            setTimeout(() => {
              navigate(`/scan/results/${finalScanIdRef.current}`, { replace: true });
            }, 300);
            return 100;
          }

          return 98; // Hold at 98% until backend responds
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [navigate, state]);

  // Update stage text based on progress
  useEffect(() => {
    const stageProgress = Math.floor((progress / 100) * scanStages.length);
    setStageIndex(Math.min(stageProgress, scanStages.length - 1));
  }, [progress]);

  const displayProgress = Math.round(progress);

  // SVG circle dimensions
  const size = 200;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="min-h-dvh bg-gray-950 flex flex-col items-center justify-center page-enter relative overflow-hidden"
      style={{
        width: '100%',
        maxWidth: '480px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 'clamp(16px, 5vw, 24px)',
        paddingRight: 'clamp(16px, 5vw, 24px)',
        boxSizing: 'border-box',
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-96 h-96 rounded-full bg-primary/30 blur-[100px] -top-48 -left-48 animate-pulse-gentle" />
        <div
          className="absolute w-96 h-96 rounded-full bg-primary-light/20 blur-[100px] -bottom-48 -right-48 animate-pulse-gentle"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/home')}
        className="absolute top-6 left-4 text-gray-400 text-sm hover:text-white transition-colors z-10"
        style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        ← Back
      </button>

      {/* Title */}
      <h1 className="text-section-heading text-white mb-4 z-10" style={{ fontWeight: 700 }}>Analyzing Scan</h1>

      {/* Circular Progress */}
      <div className="relative mb-8 z-10">
        <svg width={size} height={size} className="circular-progress">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d6b5e" />
              <stop offset="100%" stopColor="#169382" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary-dark/20 flex items-center justify-center mb-1">
            <span className="text-3xl font-bold text-white">{displayProgress}</span>
            <span className="text-lg text-white/70 ml-0.5">%</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-10 z-10">
        <p className="text-section-label text-primary-light uppercase tracking-widest mb-2" style={{ margin: '0 0 4px 0' }}>
          AI Processing
        </p>
        <p className="text-body-subtext text-gray-400 animate-pulse-gentle" style={{ margin: 0 }}>
          {scanStages[stageIndex]}
        </p>
      </div>

      {/* Tip of the Day */}
      <div className="w-full z-10">
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-start gap-3" style={{ display: 'flex', gap: '12px' }}>
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ flexShrink: 0 }}>
              <Lightbulb size={18} className="text-primary-light" />
            </div>
            <div>
              <p className="text-section-label font-semibold text-primary-light uppercase tracking-wider mb-1" style={{ margin: '0 0 4px 0' }}>
                Tip of the Day
              </p>
              <p className="text-body-subtext text-gray-400 leading-relaxed" style={{ margin: 0 }}>{tipOfTheDay}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

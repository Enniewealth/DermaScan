// ============================================
// DermaScan — Scanner Component
// Full-screen camera capture with upload & API integration
// ============================================

import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Zap, ZapOff } from 'lucide-react';
import { useOffline } from '../../contexts/OfflineContext';

export default function Scanner() {
  const navigate = useNavigate();
  const { isOffline, queueScan } = useOffline();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState('');
  const [apiError, setApiError] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [torchAvailable, setTorchAvailable] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = useCallback(async () => {
    try {
      setCameraError('');

      // Check for secure context (HTTPS/localhost) — required for getUserMedia
      if (!window.isSecureContext) {
        setCameraError('Camera requires a secure connection (HTTPS). Please access this app via HTTPS or localhost.');
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera API not supported in this browser. Please upload a photo instead.');
        return;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
      } catch {
        // Fallback to basic video constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {
          // play() may auto-resolve with autoPlay attribute
        }
        setCameraActive(true);
      } else {
        // Video element not ready — stop tracks to avoid leaking
        stream.getTracks().forEach((t) => t.stop());
        setCameraError('Camera could not initialize. Please try again.');
        return;
      }

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        try {
          const capabilities = videoTrack.getCapabilities();
          if ((capabilities as any)?.torch) {
            setTorchAvailable(true);
            setTorchOn(false);
          }
        } catch {
          // Torch detection not supported
        }
      }
    } catch (err: any) {
      console.error('Camera access failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission denied. Please allow camera access in your browser settings and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is in use by another application. Please close other apps using the camera and try again.');
      } else {
        setCameraError('Camera unavailable. Please use the upload option instead.');
      }
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const toggleTorch = useCallback(async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      try {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !torchOn } as any],
        });
        setTorchOn((prev) => !prev);
      } catch {
        // Torch toggle failed silently
      }
    }
  }, [torchOn]);

  const flipCamera = useCallback(() => {
    stopCamera();
    setTorchOn(false);
    setTorchAvailable(false);
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, [stopCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.8));
    stopCamera();
  }, [stopCamera]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    },
    [stopCamera],
  );

  const handleAnalyse = useCallback(() => {
    if (!capturedImage) return;

    if (isOffline) {
      queueScan(capturedImage, '');
      navigate('/home', { replace: true });
      return;
    }

    // Navigate to the beautiful Analyzing screen which handles the API call properly
    navigate('/scan/analyzing', {
      state: { capturedImage, symptoms: '' },
      replace: true,
    });
  }, [capturedImage, isOffline, queueScan, navigate]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setApiError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    if (!capturedImage && !cameraActive && !cameraError) {
      startCamera();
    }
  }, [capturedImage, cameraActive, cameraError, startCamera]);

  return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.88)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <style>{`
          @keyframes scannerPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.12); opacity: 0.55; }
          }
        `}</style>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '4px solid #0d6b5e',
            animation: 'scannerPulse 1.4s ease-in-out infinite',
          }}
        />
        <p
          style={{
            marginTop: 28,
            fontSize: 17,
            fontWeight: 600,
            color: '#f9f5ef',
            letterSpacing: '0.02em',
          }}
        >
          Analysing your skin...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        height: '100dvh',
        backgroundColor: '#0d0d0d',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Camera feed — always rendered so videoRef is available for startCamera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: cameraActive && !capturedImage ? 'block' : 'none',
        }}
      />

      {/* Captured / Uploaded image preview */}
      {capturedImage && (
        <img
          src={capturedImage}
          alt="Captured skin"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* No-camera fallback */}
      {cameraError && !capturedImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0d0d0d',
            padding: '32px 24px',
            color: '#f9f5ef',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: 'rgba(13,107,94,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Upload size={32} style={{ color: '#0d6b5e' }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px 0', color: '#f9f5ef' }}>
            Camera Unavailable
          </h2>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 28px 0', lineHeight: 1.5 }}>
            {cameraError}
          </p>
          <button
            onClick={startCamera}
            style={{
              backgroundColor: '#0d6b5e',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: 180,
              minHeight: 48,
              marginBottom: 14,
            }}
          >
            Retry Camera
          </button>
          <label
            style={{
              backgroundColor: 'transparent',
              color: '#0d6b5e',
              border: '2px solid #0d6b5e',
              borderRadius: 12,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: 180,
              minHeight: 48,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            Upload Photo Instead
            <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
          </label>
        </div>
      )}

      {/* Scanning guide overlay */}
      {cameraActive && !capturedImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 'clamp(220px, 65vw, 300px)',
              height: 'clamp(220px, 65vw, 300px)',
            }}
          >
            {/* Frame border */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                border: '2px solid rgba(255,255,255,0.35)',
                borderRadius: 32,
              }}
            />
            {/* Corner accents */}
            <div
              style={{
                position: 'absolute',
                top: -2,
                left: -2,
                width: 22,
                height: 22,
                borderTop: '3px solid #fff',
                borderLeft: '3px solid #fff',
                borderTopLeftRadius: 8,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 22,
                height: 22,
                borderTop: '3px solid #fff',
                borderRight: '3px solid #fff',
                borderTopRightRadius: 8,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -2,
                left: -2,
                width: 22,
                height: 22,
                borderBottom: '3px solid #fff',
                borderLeft: '3px solid #fff',
                borderBottomLeftRadius: 8,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 22,
                height: 22,
                borderBottom: '3px solid #fff',
                borderRight: '3px solid #fff',
                borderBottomRightRadius: 8,
              }}
            />

            {/* Label below frame */}
            <p
              style={{
                position: 'absolute',
                top: 'calc(100% + 18px)',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                textAlign: 'center',
                margin: 0,
                whiteSpace: 'nowrap',
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
              }}
            >
              Position skin within frame
            </p>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          zIndex: 50,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <h1
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            margin: 0,
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        >
          Scan Skin
        </h1>

        <div style={{ display: 'flex', gap: 8 }}>
          {cameraActive && !capturedImage && (
            <>
              {torchAvailable && (
                <button
                  onClick={toggleTorch}
                  aria-label={torchOn ? 'Turn flash off' : 'Turn flash on'}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: torchOn ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(8px)',
                    border: 'none',
                    color: torchOn ? '#fbbf24' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {torchOn ? <Zap size={18} /> : <ZapOff size={18} />}
                </button>
              )}

              <button
                onClick={flipCamera}
                aria-label="Flip camera"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: 'rgba(0,0,0,0.35)',
                  backdropFilter: 'blur(8px)',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                ↻
              </button>
            </>
          )}

          <label
            aria-label="Upload photo"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Upload size={18} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Bottom controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '32px 20px',
          paddingBottom: 'clamp(32px, 10vh, 48px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          zIndex: 50,
        }}
      >
        {capturedImage ? (
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <button
              onClick={handleRetake}
              style={{
                flex: 1,
                minHeight: 50,
                backgroundColor: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 16,
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Retake
            </button>
            <button
              onClick={handleAnalyse}
              style={{
                flex: 1,
                minHeight: 50,
                background: 'linear-gradient(135deg, #0d6b5e, #169382)',
                border: 'none',
                borderRadius: 16,
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(13,107,94,0.4)',
              }}
            >
              Analyse Skin
            </button>
          </div>
        ) : (
          <button
            onClick={cameraActive ? capturePhoto : startCamera}
            disabled={!cameraActive && !!cameraError}
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              border: '4px solid rgba(255,255,255,0.7)',
              backgroundColor: 'transparent',
              cursor: cameraActive ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s',
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                backgroundColor: cameraActive ? '#fff' : 'rgba(255,255,255,0.3)',
                transition: 'transform 0.15s',
              }}
            />
          </button>
        )}

        {/* API error with retry */}
        {apiError && (
          <div
            style={{
              backgroundColor: 'rgba(220,38,38,0.92)',
              borderRadius: 12,
              padding: '12px 16px',
              color: '#fff',
              fontSize: 13,
              width: '100%',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            <p style={{ margin: '0 0 8px 0', lineHeight: 1.4 }}>{apiError}</p>
            <button
              onClick={handleAnalyse}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 8,
                padding: '6px 16px',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Retry Analysis
            </button>
          </div>
        )}

        {!capturedImage && (
          <p
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: 12,
              fontWeight: 500,
              margin: 0,
              textAlign: 'center',
            }}
          >
            {cameraActive ? 'Tap to capture' : 'Tap to start camera'}
          </p>
        )}
      </div>
    </div>
  );
}

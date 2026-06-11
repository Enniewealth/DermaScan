// ============================================
// DermaScan — New Scan Screen
// ============================================

import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image, FlipHorizontal, X, Info, WifiOff } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import BackHeader from '../../components/ui/BackHeader';
import Button from '../../components/ui/Button';
import { useOffline } from '../../contexts/OfflineContext';

export default function NewScan() {
  const navigate = useNavigate();
  const { isOffline, queueScan, queuedScans } = useOffline();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState('');
  const [showOfflineQueuedCard, setShowOfflineQueuedCard] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setCameraError('');

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
      } catch (err) {
        console.warn('Strict camera constraints failed, falling back to basic video...', err);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode }
        });
      }
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {
          // play() may auto-resolve with autoPlay attribute
        }
        setCameraActive(true);
      } else {
        stream.getTracks().forEach((t) => t.stop());
        setCameraError('Camera could not initialize. Please try again.');
      }
    } catch (err: any) {
      console.error('Camera access failed entirely:', err);
      setCameraError('Camera access denied or unavailable. Please use the upload option instead.');
    }
  }, [facingMode]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.9));
    stopCamera();
  };

  // Flip camera
  const flipCamera = () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }
    return () => stopCamera();
  }, [startCamera, capturedImage, stopCamera]);

  // Dropzone for file upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  }, [stopCamera]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    noClick: cameraActive,
  });

  // Submit scan
  const handleSubmit = () => {
    if (!capturedImage) return;
    if (isOffline) {
      queueScan(capturedImage, symptoms);
      setShowOfflineQueuedCard(true);
    } else {
      navigate('/scan/analyzing', { state: { capturedImage, symptoms } });
    }
  };

  // Retake
  const handleRetake = () => {
    setCapturedImage(null);
    setCameraError('');
  };

  if (showOfflineQueuedCard) {
    return (
      <div
        className="min-h-dvh bg-[#f9f5ef] flex flex-col items-center justify-center page-enter animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(232, 168, 56, 0.08)',
          color: '#e8a838',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          border: '1.5px solid rgba(232, 168, 56, 0.2)'
        }}>
          <WifiOff size={36} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 10px 0' }}>
          Scan Queued
        </h2>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 24px 0', lineHeight: 1.5 }}>
          We'll analyse this when you reconnect.
        </p>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          borderLeft: '4px solid #e8a838',
          width: '100%',
          textAlign: 'left',
          marginBottom: '24px',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 700, color: '#374151' }}>
            <span>Queue position</span>
            <span style={{ color: '#e8a838' }}>{queuedScans.length} of {queuedScans.length}</span>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>
            Estimated time: <strong style={{ color: '#111827' }}>Results ready in ~30 seconds after reconnecting</strong>
          </p>
        </div>

        <button
          onClick={() => navigate('/history')}
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#0d6b5e',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            marginBottom: '32px',
            minHeight: '44px'
          }}
        >
          View queued scans
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <Button
            fullWidth
            onClick={() => {
              setCapturedImage(null);
              setShowOfflineQueuedCard(false);
            }}
            style={{ minHeight: '48px' }}
          >
            Take Another Scan
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/home')}
            style={{ minHeight: '48px' }}
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-dvh bg-gray-950 flex flex-col page-enter"
      style={{
        width: '100%',
        maxWidth: '480px',
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
      }}
    >
      <BackHeader
        title="New Scan"
        transparent
        className="!text-white [&_button]:text-white [&_h1]:text-white"
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Viewfinder / Upload area */}
        <div className="relative flex-1 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
          {/* Hidden video element — always in DOM for ref availability */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ display: cameraActive && !capturedImage ? 'block' : 'none', position: 'absolute', inset: 0 }}
          />

          {capturedImage ? (
            // Preview captured image
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured skin"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleRetake}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ) : cameraActive ? (
            // Camera viewfinder overlay (frame guides)
            <div className="relative w-full h-full">
              {/* Scan frame overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 md:w-72 md:h-72 border-2 border-white/50 rounded-3xl">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-white rounded-tl-3xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-white rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-white rounded-bl-3xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-white rounded-br-3xl" />
                </div>
              </div>
            </div>
          ) : (
            // Upload / Start camera area
            <div
              {...getRootProps()}
              className={`w-full h-full flex flex-col items-center justify-center p-8 cursor-pointer transition-colors
                ${isDragActive ? 'bg-primary/10' : 'bg-gray-900'}
              `}
            >
              <input {...getInputProps()} capture="environment" />
              <div className="w-56 h-56 md:w-72 md:h-72 border-2 border-dashed border-gray-600 rounded-3xl flex flex-col items-center justify-center gap-4 mb-6">
                <Image size={48} className="text-gray-500" />
                <p className="text-sm text-gray-400 text-center px-4">
                  {isDragActive
                    ? 'Drop your image here...'
                    : 'Drag & drop a photo here, or tap to browse'}
                </p>
              </div>
              {cameraError && (
                <p className="text-xs text-amber-400 text-center mb-4 max-w-xs">{cameraError}</p>
              )}
            </div>
          )}
        </div>

        {/* Camera tips */}
        {!capturedImage && (
          <div className="flex justify-center gap-6 py-3 bg-gray-900/80">
            {[
              { icon: <Camera size={14} />, text: 'Hold camera 10cm away' },
              { icon: <Info size={14} />, text: 'Keep area in sharp focus' },
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                {tip.icon}
                {tip.text}
              </div>
            ))}
          </div>
        )}

        {/* Bottom controls */}
        <div className="bg-gray-950 space-y-4" style={{ paddingLeft: 'clamp(16px, 5vw, 24px)', paddingRight: 'clamp(16px, 5vw, 24px)', paddingTop: '16px', paddingBottom: '16px', boxSizing: 'border-box' }}>
          {/* Symptoms input */}
          <div>
            <label className="text-section-label text-gray-400 block" style={{ marginBottom: '6px' }}>Describe symptoms (optional)</label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder='e.g., "itchy", "painful for 2 days", "growing mole"'
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-body-subtext text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              style={{ minHeight: '44px' }}
              id="input-symptoms"
            />
          </div>

          {/* Action buttons */}
          {capturedImage ? (
            <div className="flex gap-3" style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="outline"
                fullWidth
                onClick={handleRetake}
                className="!text-white !border-gray-600 hover:!bg-gray-800"
                style={{ minHeight: '44px' }}
              >
                Retake
              </Button>
              <Button
                fullWidth
                onClick={handleSubmit}
                id="btn-submit-scan"
                style={{ minHeight: '44px' }}
              >
                Analyze Scan
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
              {/* Gallery button */}
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <button
                  className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gray-700 transition-colors"
                  style={{ minWidth: '44px', minHeight: '44px', cursor: 'pointer' }}
                >
                  <Image size={22} />
                </button>
              </div>

              {/* Capture / Start Camera button */}
              <button
                onClick={() => {
                  if (cameraActive) {
                    capturePhoto();
                  } else if (cameraError) {
                    open();
                  } else {
                    startCamera();
                  }
                }}
                className="w-18 h-18 rounded-full border-4 border-primary bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors group"
                style={{ minWidth: '44px', minHeight: '44px', cursor: 'pointer' }}
                id="btn-tap-scan"
              >
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center group-hover:scale-95 transition-transform">
                  <Camera size={28} className="text-white" />
                </div>
              </button>

              {/* Flip camera */}
              <button
                onClick={flipCamera}
                className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gray-700 transition-colors"
                style={{ minWidth: '44px', minHeight: '44px', cursor: 'pointer' }}
                disabled={!cameraActive}
              >
                <FlipHorizontal size={22} />
              </button>
            </div>
          )}

          {/* Scan label */}
          {!capturedImage && (
            <p className="text-center text-section-label text-gray-500" style={{ margin: 0, textAlign: 'center' }}>
              {cameraActive ? 'Tap to capture' : 'Tap to Scan'}
            </p>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

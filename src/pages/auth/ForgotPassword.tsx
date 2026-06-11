// ============================================
// DermaScan — Forgot Password Screen
// ============================================

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const cardStyle = {
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: 24,
    boxShadow: '0 8px 32px rgba(42,112,112,0.08), 0 2px 8px rgba(0,0,0,0.04)',
    padding: 'clamp(40px, 10vw, 56px) clamp(16px, 5vw, 28px) clamp(16px, 5vw, 28px)',
    border: '1px solid rgba(255,255,255,0.7)',
  } as const;

  const logoBlock = (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-36px', position: 'relative', zIndex: 10 }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(42,112,112,0.15)',
          border: '1px solid rgba(13, 107, 94, 0.1)',
          overflow: 'hidden',
          padding: '8px',
        }}
      >
        <img
          src="/logo.png"
          alt="DermaScan Logo"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="animate-scale-in">
        {logoBlock}
        <div style={{ ...cardStyle, textAlign: 'center' as const }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={32} style={{ color: '#22C55E' }} />
            </div>
          </div>
          <h1 className="text-page-heading" style={{ color: '#111827', marginBottom: 8, fontWeight: 800 }}>Check Your Email</h1>
          <p className="text-body-subtext" style={{ color: '#6b7280', marginBottom: 24 }}>
            We've sent a password reset link to <strong style={{ color: '#374151' }}>{email}</strong>.
            Please check your inbox and follow the instructions.
          </p>
          <Button fullWidth onClick={() => navigate('/signin')} id="btn-back-signin">
            Back to Sign In
          </Button>
          <button
            onClick={() => { setIsSubmitted(false); setEmail(''); }}
            style={{ fontSize: 'clamp(11px, 3vw, 13px)', color: '#0d6b5e', fontWeight: 600, marginTop: 16, background: 'none', border: 'none', cursor: 'pointer', minHeight: '44px', minWidth: '44px' }}
          >
            Didn't receive it? Resend
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {logoBlock}
      <div style={cardStyle}>
        <button
          onClick={() => navigate('/signin')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: '#6b7280', marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer', minHeight: '44px', minWidth: '44px' }}
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </button>

        <div style={{ textAlign: 'center', marginBottom: 'clamp(20px, 6vw, 32px)' }}>
          <h1 className="text-page-heading" style={{ color: '#111827', marginBottom: 8, fontWeight: 800 }}>Forgot Password?</h1>
          <p className="text-body-subtext" style={{ color: '#6b7280' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Email Address"
            icon={<Mail size={18} />}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            id="input-email"
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
            id="btn-send-reset"
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
}

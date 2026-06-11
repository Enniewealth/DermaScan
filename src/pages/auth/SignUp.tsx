// ============================================
// DermaScan — Sign Up Screen
// ============================================

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { signup, isProcessing } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [comingSoonMsg, setComingSoonMsg] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);
    try {
      await signup(fullName, email, password);
      navigate('/onboarding');
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please try again.';
      setSubmitError(
        msg === 'Failed to fetch'
          ? 'Unable to connect to server. Please ensure the backend is running on port 8000.'
          : msg
      );
    }
  };

  const handleComingSoon = (method: string) => {
    setComingSoonMsg(`${method} sign-up is coming soon! Please use email for now.`);
    setTimeout(() => setComingSoonMsg(null), 3000);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Logo peeking above the card */}
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

      {/* Card */}
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(42,112,112,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          padding: 'clamp(40px, 10vw, 56px) clamp(16px, 5vw, 28px) clamp(16px, 5vw, 28px)',
          border: '1px solid rgba(255,255,255,0.7)',
          position: 'relative' as const,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(20px, 6vw, 32px)' }}>
          <h1 className="text-page-heading" style={{ color: '#111827', marginBottom: 8, fontWeight: 800 }}>
            Create Account
          </h1>
          <p className="text-body-subtext" style={{ color: '#6b7280' }}>
            Create an account for instant skin disease detection and clinical recommendations.
          </p>
        </div>

        {/* Coming Soon Toast */}
        {comingSoonMsg && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0d6b5e',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(13, 107, 94, 0.3)',
              zIndex: 50,
              whiteSpace: 'nowrap',
              animation: 'fadeIn 0.2s ease',
              maxWidth: '90%',
              textAlign: 'center',
            }}
          >
            {comingSoonMsg}
          </div>
        )}

        {submitError && (
          <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', marginBottom: '20px', textAlign: 'center', fontWeight: 500 }}>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Full Name"
            icon={<User size={18} />}
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            id="input-fullname"
          />

          <Input
            label="Email Address"
            icon={<Mail size={18} />}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            id="input-email"
          />

          <Input
            label="Password"
            icon={<Lock size={18} />}
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            hint="Must be at least 8 characters."
            id="input-password"
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isProcessing}
            id="btn-create-account"
            style={{ marginTop: 8 }}
          >
            Create Account →
          </Button>
        </form>

        {/* Divider */}
        <div style={{ position: 'relative', margin: '28px 0' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', borderTop: '1px solid #e5e7eb' }} />
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <span style={{ background: '#fff', padding: '0 12px', fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Or sign up with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            onClick={() => handleComingSoon('Phone')}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '12px 20px',
              borderRadius: 12,
              background: '#fff',
              color: '#374151',
              fontWeight: 600,
              fontSize: 'clamp(11px, 3vw, 13px)',
              border: '1px solid #169382',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minHeight: '44px',
              position: 'relative' as const,
            }}
            id="btn-phone-signup"
          >
            <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Phone
            <span style={{
              position: 'absolute', top: '-8px', right: '-4px',
              fontSize: '8px', fontWeight: 700, color: '#ffffff',
              backgroundColor: '#e8a838', padding: '2px 6px',
              borderRadius: '8px', textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>Soon</span>
          </button>
          <button
            type="button"
            onClick={() => handleComingSoon('Google')}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '12px 20px',
              borderRadius: 12,
              background: '#fff',
              color: '#374151',
              fontWeight: 600,
              fontSize: 'clamp(11px, 3vw, 13px)',
              border: '1px solid #169382',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minHeight: '44px',
              position: 'relative' as const,
            }}
            id="btn-google-signup"
          >
            <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
            <span style={{
              position: 'absolute', top: '-8px', right: '-4px',
              fontSize: '8px', fontWeight: 700, color: '#ffffff',
              backgroundColor: '#e8a838', padding: '2px 6px',
              borderRadius: '8px', textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>Soon</span>
          </button>
        </div>

        {/* Sign In link */}
        <p className="text-body-subtext" style={{ textAlign: 'center', color: '#6b7280', marginTop: 24 }}>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/signin')}
            style={{ color: '#0d6b5e', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', minHeight: '44px', minWidth: '44px' }}
            id="link-signin"
          >
            Sign in
          </button>
        </p>
      </div>

      {/* Inline animation for toast */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

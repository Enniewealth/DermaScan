import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Check, Sun, Eye, Palette, Droplets } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FITZPATRICK QUIZ DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface QuizOption {
  label: string;
  points: number;
}

interface QuizQuestion {
  question: string;
  icon: typeof Sun;
  options: QuizOption[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'What happens to your skin after 30 minutes of unprotected sun exposure?',
    icon: Sun,
    options: [
      { label: 'Always burns, never tans', points: 1 },
      { label: 'Usually burns, rarely tans', points: 2 },
      { label: 'Sometimes burns, gradually tans', points: 3 },
      { label: 'Rarely burns, tans easily', points: 4 },
      { label: 'Very rarely burns, tans very easily', points: 5 },
      { label: 'Never burns, deeply pigmented', points: 6 },
    ]
  },
  {
    question: 'What is the natural color of your unexposed skin?',
    icon: Palette,
    options: [
      { label: 'Very fair, ivory or pale white', points: 1 },
      { label: 'Fair, white to light beige', points: 2 },
      { label: 'Medium, beige to light brown', points: 3 },
      { label: 'Olive to moderate brown', points: 4 },
      { label: 'Brown to deep brown', points: 5 },
      { label: 'Very dark brown to black', points: 6 },
    ]
  },
  {
    question: 'What color are your eyes naturally?',
    icon: Eye,
    options: [
      { label: 'Light blue, grey, or green', points: 1 },
      { label: 'Blue, grey, or green', points: 2 },
      { label: 'Hazel or light brown', points: 3 },
      { label: 'Dark brown', points: 5 },
      { label: 'Very dark brown or black', points: 6 },
    ]
  },
  {
    question: 'How does your skin react to strong sun over multiple days?',
    icon: Droplets,
    options: [
      { label: 'Peels and stays pale, never darkens', points: 1 },
      { label: 'Peels then lightly tans', points: 2 },
      { label: 'Gradually develops a moderate tan', points: 3 },
      { label: 'Tans easily to a warm brown', points: 4 },
      { label: 'Gets darker with minimal effort', points: 5 },
      { label: 'Naturally dark, minimal visible change', points: 6 },
    ]
  },
];

const FITZPATRICK_RESULTS: Record<string, { label: string; description: string; skinColor: string }> = {
  'I':   { label: 'Type I — Very Fair', description: 'Very fair, ivory/pale white skin. Always burns, never tans. Highest UV sensitivity.', skinColor: '#FDEBD0' },
  'II':  { label: 'Type II — Fair', description: 'Fair, white to beige skin. Usually burns, rarely tans. High UV sensitivity.', skinColor: '#F5CBA7' },
  'III': { label: 'Type III — Medium', description: 'Medium, beige to light brown. Sometimes burns, gradually tans.', skinColor: '#D4A574' },
  'IV':  { label: 'Type IV — Olive/Moderate Brown', description: 'Olive to moderate brown. Rarely burns, tans easily. Common in Mediterranean, Middle Eastern, South Asian descent.', skinColor: '#B47B4F' },
  'V':   { label: 'Type V — Brown', description: 'Brown to deep brown skin. Very rarely burns, tans very easily. Common in many African, South Asian, and Caribbean communities.', skinColor: '#7B5B3A' },
  'VI':  { label: 'Type VI — Deep Brown/Black', description: 'Very dark brown to black skin. Never burns, deeply pigmented. Common across West, Central, and Southern Africa.', skinColor: '#4A3525' },
};

function calculateFitzpatrick(answers: number[]): string {
  const total = answers.reduce((sum, a) => sum + a, 0);
  const avg = total / answers.length;
  if (avg <= 1.5) return 'I';
  if (avg <= 2.5) return 'II';
  if (avg <= 3.5) return 'III';
  if (avg <= 4.5) return 'IV';
  if (avg <= 5.5) return 'V';
  return 'VI';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ONBOARDING COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [cameraError, setCameraError] = useState('');

  // Fitzpatrick quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [fitzResult, setFitzResult] = useState<string | null>(null);
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);

  const TOTAL_STEPS = 5;

  useEffect(() => {
    if (user?.settings?.language) {
      setSelectedLang(user.settings.language);
    }
  }, [user]);

  const handleLanguageSelect = async (lang: string) => {
    setSelectedLang(lang);
    try {
      if (user) {
        await updateUser({
          settings: {
            ...user.settings,
            language: lang,
            scanReminders: user.settings?.scanReminders ?? true,
            privacyMode: user.settings?.privacyMode ?? false
          }
        });
      }
    } catch (err) {
      console.error('Failed to update user language settings:', err);
    }
  };

  const requestCameraPermission = async () => {
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setStep(5);
    } catch (err: any) {
      console.error('Camera permission request failed:', err);
      setCameraError('Camera access was denied. You can still use the app by uploading photos from your gallery.');
      setTimeout(() => {
        setStep(5);
      }, 3000);
    }
  };

  // Quiz handlers
  const handleQuizAnswer = (points: number) => {
    const newAnswers = [...quizAnswers, points];
    setQuizAnswers(newAnswers);

    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      // Calculate result
      const type = calculateFitzpatrick(newAnswers);
      setFitzResult(type);
    }
  };

  const handleSaveFitzpatrick = async () => {
    if (!fitzResult) return;
    setIsSavingQuiz(true);
    try {
      await updateUser({ fitzpatrickType: fitzResult });
    } catch (err) {
      console.error('Failed to save Fitzpatrick type:', err);
    }
    setIsSavingQuiz(false);
    setStep(4); // Proceed to camera permission
  };

  const handleRetakeQuiz = () => {
    setQuizIndex(0);
    setQuizAnswers([]);
    setFitzResult(null);
  };

  const userName = user?.fullName ? user.fullName.split(' ')[0] : 'Friend';

  return (
    <div style={{
      backgroundColor: '#f9f5ef',
      minHeight: '100dvh',
      width: '100%',
      fontFamily: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px 40px 16px',
      boxSizing: 'border-box'
    }}>
      
      {/* Top spacing / Skip helper */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', height: '32px' }}>
        {step < TOTAL_STEPS && (
          <button
            onClick={() => navigate('/home')}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              minHeight: '44px',
              padding: '0 8px'
            }}
          >
            Skip Onboarding
          </button>
        )}
      </div>

      {/* Main interactive cards container */}
      <div style={{
        maxWidth: '440px',
        width: '100%',
        margin: '0 auto',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBottom: '32px'
      }}>
        
        {/* ============================================ */}
        {/* STEP 1: WELCOME                              */}
        {/* ============================================ */}
        {step === 1 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            {/* Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid rgba(13, 107, 94, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                boxShadow: '0 4px 12px rgba(13, 107, 94, 0.08)'
              }}>
                <img src="/logo.png" alt="DermaScan Logo" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
              </div>
            </div>

            {/* Simplified skin/scan motif illustration */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                backgroundColor: 'rgba(13, 107, 94, 0.05)',
                border: '2px dashed rgba(13, 107, 94, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {/* Central lens */}
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d6b5e, #169382)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(13, 107, 94, 0.3)'
                }}>
                  <Camera size={40} style={{ color: '#ffffff' }} />
                </div>
                {/* Scanning pulses */}
                <div style={{
                  position: 'absolute',
                  width: '120px',
                  height: '2px',
                  backgroundColor: '#4caf87',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  boxShadow: '0 0 8px #4caf87',
                  animation: 'scanBar 2s infinite ease-in-out'
                }} />
              </div>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#111827', margin: '0 0 10px 0', lineHeight: 1.25 }}>
              Your skin finally has a voice
            </h1>
            <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 32px 0', lineHeight: 1.5 }}>
              AI-powered skin analysis built for Nigerian skin tones.
            </p>

            <Button
              fullWidth
              onClick={() => setStep(2)}
              style={{ minHeight: '48px', marginBottom: '16px' }}
            >
              Get Started
            </Button>
            
            <button
              onClick={() => navigate('/signin')}
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#0d6b5e',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                minHeight: '44px'
              }}
            >
              I already have an account
            </button>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 2: LANGUAGE                             */}
        {/* ============================================ */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#111827', marginBottom: '8px', lineHeight: 1.2 }}>
              DermaScan speaks your language
            </h1>
            <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px', lineHeight: 1.5 }}>
              Choose how you want to receive your results
            </p>

            {/* Language selection list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { code: 'EN', label: 'English', native: 'English', flag: '🇳🇬' },
                { code: 'YO', label: 'Yoruba', native: 'Èdè Yorùbá', flag: '🇳🇬' },
                { code: 'HA', label: 'Hausa', native: 'Harshen Hausa', flag: '🇳🇬' },
                { code: 'IG', label: 'Igbo', native: 'Asụsụ Igbo', flag: '🇳🇬' }
              ].map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <div
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px 24px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(13, 107, 94, 0.06)' : '#ffffff',
                      border: `2px solid ${isSelected ? '#0d6b5e' : 'rgba(0,0,0,0.04)'}`,
                      boxShadow: isSelected
                        ? '0 4px 16px rgba(13, 107, 94, 0.12)'
                        : '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease',
                      minHeight: '64px',
                    }}
                    id={`lang-option-${lang.code.toLowerCase()}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        fontSize: '28px',
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: isSelected ? 'rgba(13, 107, 94, 0.08)' : '#f9f5ef',
                      }}>{lang.flag}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>{lang.native}</span>
                        <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{lang.label}</span>
                      </div>
                    </div>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#0d6b5e' : 'transparent',
                      border: `2px solid ${isSelected ? '#0d6b5e' : '#d1d5db'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center', marginBottom: '24px', fontWeight: 500 }}>
              You can change this anytime in Settings
            </p>

            <Button
              fullWidth
              onClick={() => setStep(3)}
              style={{ minHeight: '52px', fontSize: '16px', fontWeight: 700 }}
              id="btn-lang-continue"
            >
              Continue
            </Button>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 3: FITZPATRICK SKIN TYPE QUIZ            */}
        {/* ============================================ */}
        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {!fitzResult ? (
              <>
                {/* Quiz Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
                  {QUIZ_QUESTIONS.map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        height: '4px',
                        borderRadius: '2px',
                        backgroundColor: idx <= quizIndex ? '#0d6b5e' : 'rgba(13, 107, 94, 0.12)',
                        transition: 'background-color 0.3s ease'
                      }}
                    />
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0d6b5e',
                    backgroundColor: 'rgba(13, 107, 94, 0.08)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                </div>

                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  color: '#111827',
                  margin: '0 0 8px 0',
                  lineHeight: 1.25
                }}>
                  Skin Type Quiz
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 24px 0',
                  lineHeight: 1.5
                }}>
                  {QUIZ_QUESTIONS[quizIndex].question}
                </p>

                {/* Answer Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {QUIZ_QUESTIONS[quizIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(opt.points)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '16px 20px',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid rgba(13, 107, 94, 0.1)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = '#0d6b5e';
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(13, 107, 94, 0.03)';
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(13, 107, 94, 0.1)';
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                      }}
                    >
                      {/* Skin tone swatch dot */}
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        flexShrink: 0,
                        border: '2px solid rgba(0,0,0,0.06)',
                        background: (() => {
                          const colors = ['#FDEBD0', '#F5CBA7', '#D4A574', '#B47B4F', '#7B5B3A', '#4A3525'];
                          return colors[Math.min(opt.points - 1, colors.length - 1)];
                        })()
                      }} />
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#374151',
                        lineHeight: 1.3
                      }}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              /* ============================================ */
              /* QUIZ RESULT SCREEN                           */
              /* ============================================ */
              <div style={{ textAlign: 'center', animation: 'fadeIn 0.35s ease' }}>
                <div style={{ marginBottom: '32px' }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: FITZPATRICK_RESULTS[fitzResult].skinColor,
                    margin: '0 auto 24px auto',
                    border: '4px solid #ffffff',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={40} style={{ color: '#ffffff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
                  </div>

                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    color: '#111827',
                    margin: '0 0 6px 0',
                    lineHeight: 1.2
                  }}>
                    Your Skin Type
                  </h1>
                  <p style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#0d6b5e',
                    margin: '0 0 16px 0'
                  }}>
                    {FITZPATRICK_RESULTS[fitzResult].label}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: 1.6,
                    margin: '0 0 8px 0',
                    maxWidth: '360px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}>
                    {FITZPATRICK_RESULTS[fitzResult].description}
                  </p>
                </div>

                {/* Assurance row */}
                <div style={{
                  backgroundColor: 'rgba(13, 107, 94, 0.05)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  textAlign: 'left'
                }}>
                  <Check size={16} style={{ color: '#0d6b5e', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>
                    Derm will now tailor all advice, treatment language, and condition presentation to your skin type.
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Button
                    fullWidth
                    onClick={handleSaveFitzpatrick}
                    disabled={isSavingQuiz}
                    style={{ minHeight: '48px' }}
                  >
                    {isSavingQuiz ? 'Saving...' : 'Continue'}
                  </Button>
                  <button
                    onClick={handleRetakeQuiz}
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#6b7280',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      minHeight: '44px'
                    }}
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 4: PERMISSIONS (CAMERA)                  */}
        {/* ============================================ */}
        {step === 4 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              DermaScan needs camera access
            </h1>
            <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 40px 0', lineHeight: 1.6 }}>
              To scan your skin, we need permission to use your camera. Your images are secure, end-to-end encrypted, and private.
            </p>

            {/* Premium Camera Viewfinder Mock */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '28px',
                backgroundColor: '#ffffff',
                color: '#0d6b5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid rgba(13, 107, 94, 0.12)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <Camera size={44} />
              </div>
            </div>

            {/* Camera error displays */}
            {cameraError && (
              <p style={{ fontSize: '13px', color: '#e05252', marginBottom: '20px', lineHeight: 1.5, fontWeight: 500 }}>
                {cameraError}
              </p>
            )}

            {/* Privacy Assurance Chips */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'center',
              marginBottom: '40px'
            }}>
              {[
                '✓ End-to-end encrypted',
                '✓ Stored securely',
                '✓ Never shared without consent'
              ].map((assur, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0d6b5e'
                  }}
                >
                  {assur}
                </span>
              ))}
            </div>

            <Button
              fullWidth
              onClick={requestCameraPermission}
              style={{ minHeight: '48px', marginBottom: '16px' }}
            >
              Allow Camera Access
            </Button>
            
            <button
              onClick={() => setStep(5)}
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#6b7280',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                minHeight: '44px'
              }}
            >
              Not now (limited features)
            </button>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 5: READY                                */}
        {/* ============================================ */}
        {step === 5 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              You're ready, {userName}
            </h1>
            <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 48px 0', lineHeight: 1.6 }}>
              Start your first clinical scan or explore the Nigeria-specific skin conditions library.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button
                fullWidth
                onClick={() => navigate('/scan')}
                style={{ minHeight: '48px' }}
              >
                Start First Scan
              </Button>
              
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/library')}
                style={{ minHeight: '48px' }}
              >
                Explore Library
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* Progress Dots Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        alignItems: 'center',
        height: '24px'
      }}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((dotIndex) => {
          const isActive = step === dotIndex;
          return (
            <div
              key={dotIndex}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#0d6b5e' : 'transparent',
                border: `2px solid ${isActive ? '#0d6b5e' : '#cbd5e1'}`,
                transition: 'all 0.2s ease-in-out'
              }}
            />
          );
        })}
      </div>

      {/* Embedded CSS keyframes for scan pulsing effect */}
      <style>{`
        @keyframes scanBar {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
      `}</style>

    </div>
  );
}

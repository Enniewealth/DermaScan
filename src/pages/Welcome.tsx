// ============================================
// DermaScan — Responsive Landing Page
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Sparkles,
  Globe,
  Camera,
  CheckCircle,
  Stethoscope,
  ChevronDown,
  Info,
  DollarSign
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// FAQs data
const faqs = [
  {
    question: "How accurate is the AI?",
    answer: "DermaScan is trained on diverse datasets representing darker skin tones and common tropical conditions, achieving a 94%+ detection accuracy for common conditions. It serves as a screening helper, not a clinical replacement."
  },
  {
    question: "Is my medical data safe?",
    answer: "Absolutely. All scan photos and user information are fully encrypted, HIPAA-compliant, and processed securely. We never sell or share your medical history with third parties."
  },
  {
    question: "Can it detect all skin conditions?",
    answer: "It can detect over 15 common skin conditions, including eczema, ringworm, acne, psoriasis, hives, contact dermatitis, and various fungal/bacterial infections."
  },
  {
    question: "What should I do after receiving results?",
    answer: "Our app provides a detailed report including possible causes, risk levels, and a localized pharmacy guide. We advise discussing this report with a pharmacist or general practitioner."
  }
];

// Medications data by tab
const medicationsData = {
  antibiotics: [
    {
      name: 'Mupirocin (Bactroban)',
      type: 'Antibiotic Ointment',
      price: '₦1,500 – ₦3,500',
      description: 'Active against bacterial infections like impetigo or folliculitis.',
      recommended: true
    },
    {
      name: 'Neomycin / Bacitracin',
      type: 'Antibiotic Ointment',
      price: '₦1,200 – ₦2,500',
      description: 'Dual-action ointment for cuts, scrapes, and minor bacterial infections.',
      recommended: false
    }
  ],
  antifungals: [
    {
      name: 'Ketoconazole (Nizoral)',
      type: 'Antifungal Cream',
      price: '₦1,800 – ₦4,000',
      description: 'High-efficacy antifungal for ringworm, athlete\'s foot, and tinea.',
      recommended: true
    },
    {
      name: 'Clotrimazole (Canesten)',
      type: 'Antifungal Cream',
      price: '₦1,000 – ₦2,500',
      description: 'Popular treatment for fungal infections and skin irritation.',
      recommended: false
    }
  ],
  steroids: [
    {
      name: 'Hydrocortisone (1%)',
      type: 'Mild Steroid Cream',
      price: '₦800 – ₦2,000',
      description: 'Reduces inflammation, redness, and itching from eczema and allergic reactions.',
      recommended: true
    },
    {
      name: 'Clobetasol Propionate',
      type: 'Potent Steroid Cream',
      price: '₦1,500 – ₦3,500',
      description: 'Strong corticosteroid for severe eczema or psoriasis under clinical guidance.',
      recommended: false
    }
  ]
};

export default function Welcome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'antibiotics' | 'antifungals' | 'steroids'>('antibiotics');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  return (
    <div style={{ backgroundColor: '#f9f5ef', minHeight: '100vh', width: '100%', fontFamily: 'sans-serif' }}>
      
      {/* 1. Navigation Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(253, 248, 241, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(13, 107, 94, 0.08)',
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(13, 107, 94, 0.15)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0d6b5e' }}>Derma<span style={{ color: '#169382' }}>Scan</span></span>
          </div>

          {/* Links — hidden on small screen */}
          <nav style={{ display: 'none' }} className="md:flex gap-8">
            <a href="#how-it-works" style={{ fontSize: '14px', fontWeight: 600, color: '#1F5252', textDecoration: 'none' }}>How It Works</a>
            <a href="#what-you-get" style={{ fontSize: '14px', fontWeight: 600, color: '#1F5252', textDecoration: 'none' }}>What You Get</a>
            <a href="#medication" style={{ fontSize: '14px', fontWeight: 600, color: '#1F5252', textDecoration: 'none' }}>Medication Recommendations</a>
            <a href="#why-us" style={{ fontSize: '14px', fontWeight: 600, color: '#1F5252', textDecoration: 'none' }}>Why DermaScan?</a>
            <a href="#faqs" style={{ fontSize: '14px', fontWeight: 600, color: '#1F5252', textDecoration: 'none' }}>FAQs</a>
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/signin')}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#0d6b5e',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                minWidth: '44px',
                minHeight: '44px',
                padding: '0 8px'
              }}
            >
              Sign In
            </button>
            <Button
              size="sm"
              onClick={() => navigate('/signup')}
              style={{ boxShadow: '0 4px 10px rgba(42,112,112,0.2)' }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section style={{ padding: '64px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }} className="lg:flex-row items-center">
          
          {/* Left Text content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              alignSelf: 'flex-start',
              padding: '6px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(13, 107, 94, 0.1)',
              color: '#0d6b5e',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Know your skin in seconds
            </div>
            
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 54px)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#111827',
              margin: 0
            }}>
              Detect Skin Diseases in <span className="text-gradient">seconds</span>
            </h1>
            
            <p style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#4B5563',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '540px'
            }}>
              Professional skin analysis powered by artificial intelligence. Scan, detect, and manage skin conditions with clinical precision, tailored for Nigerian skin types and climate.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                icon={<ArrowRight size={20} />}
                style={{ minHeight: '48px' }}
              >
                Get Started
              </Button>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  style={{ minHeight: '48px', backgroundColor: '#fff', color: '#0d6b5e', borderColor: '#0d6b5e' }}
                >
                  Learn More
                </Button>
              </a>
            </div>

            {/* Quick Metrics under buttons */}
            <div style={{ display: 'flex', gap: '24px', marginTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '20px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '24px', fontWeight: 800, color: '#0d6b5e' }}>94%+</span>
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>AI Match Accuracy</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '24px', fontWeight: 800, color: '#0d6b5e' }}>15+</span>
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Skin Conditions</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '24px', fontWeight: 800, color: '#0d6b5e' }}>Instant</span>
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Clinical Insights</span>
              </div>
            </div>
          </div>

          {/* Right graphics area — overlap mockups */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative', height: '420px', width: '100%', overflow: 'visible' }}>
            {/* Main Phone Mockup */}
            <div style={{
              position: 'relative',
              width: '210px',
              height: '400px',
              borderRadius: '32px',
              backgroundColor: '#111827',
              border: '6px solid #1F2937',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              zIndex: 3,
              overflow: 'hidden'
            }}>
              {/* Screen Content Simulator */}
              <div style={{ background: '#faf7f2', width: '100%', height: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#0d6b5e' }}>DermaScan</span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #0d6b5e, #169382)', borderRadius: '12px', padding: '12px', color: '#fff' }}>
                  <p style={{ fontSize: '11px', margin: '0 0 8px 0', opacity: 0.9 }}>AI Diagnostic Scan</p>
                  <h4 style={{ fontSize: '13px', margin: 0, fontWeight: 700 }}>Skin Analysis complete</h4>
                  <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '8px', color: '#0d6b5e', marginTop: '12px', textAlign: 'center', fontWeight: 800, fontSize: '13px' }}>
                    94% Eczema Match
                  </div>
                </div>
                {/* Simulated Results body */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#374151' }}>RECOMMENDED GUIDE</div>
                  <div style={{ background: '#fff', border: '1px solid #e8dcc4', borderRadius: '10px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#111827' }}>Hydrocortisone</span>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#0d6b5e' }}>₦1.5k – ₦3k</span>
                    </div>
                    <span style={{ fontSize: '8px', color: '#6B7280' }}>OTC Anti-inflammatory Cream</span>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #e8dcc4', borderRadius: '10px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#111827' }}>Epiderm Cream</span>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#0d6b5e' }}>₦1.5k – ₦3k</span>
                    </div>
                    <span style={{ fontSize: '8px', color: '#6B7280' }}>Triple Action Topical Cream</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Floating Phone Mockup Left */}
            <div style={{
              position: 'absolute',
              width: '180px',
              height: '350px',
              borderRadius: '28px',
              backgroundColor: '#111827',
              border: '5px solid #1F2937',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
              left: '40px',
              top: '40px',
              zIndex: 1,
              opacity: 0.85,
              overflow: 'hidden'
            }} className="hidden sm:block">
              {/* Welcome Screen simulator */}
              <div style={{ background: 'linear-gradient(180deg, #f9f5ef 0%, #e8dcc4 100%)', width: '100%', height: '100%', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '40px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0d6b5e', margin: 0, textAlign: 'center' }}>DermaScan</h3>
                <div style={{ width: '100%', height: '2px', backgroundColor: '#0d6b5e', opacity: 0.1 }}></div>
                <p style={{ fontSize: '10px', color: '#1F5252', textAlign: 'center', margin: 0, fontWeight: 600 }}>Professional skin analysis in seconds</p>
              </div>
            </div>

            {/* Back Floating Phone Mockup Right */}
            <div style={{
              position: 'absolute',
              width: '180px',
              height: '350px',
              borderRadius: '28px',
              backgroundColor: '#111827',
              border: '5px solid #1F2937',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
              right: '40px',
              top: '20px',
              zIndex: 2,
              opacity: 0.9,
              overflow: 'hidden'
            }} className="hidden sm:block">
              {/* Scan Screen Simulator */}
              <div style={{ background: '#111827', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px' }}>
                <div style={{ color: '#fff', fontSize: '11px', textAlign: 'center', fontWeight: 700 }}>Scan Area</div>
                {/* Target Frame */}
                <div style={{ width: '120px', height: '120px', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '16px', alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '100px', height: '100px', border: '1px dashed rgba(255,255,255,0.3)', borderRadius: '12px' }}></div>
                </div>
                {/* Control Indicator */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #0d6b5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0d6b5e' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section id="how-it-works" style={{ padding: '64px 24px', backgroundColor: '#faf7f2' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0d6b5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simple steps</span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginTop: '8px', marginBottom: '12px' }}>How It Works</h2>
          <p style={{ fontSize: '15px', color: '#4B5563', maxWidth: '600px', margin: '0 auto 48px auto' }}>
            Any where, any time. Analyze skin conditions and access recommended guidance in three simple steps.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              {
                step: '01',
                title: 'Take or Upload Photo',
                desc: 'Upload a clear, well-lit photo of the skin lesion or area of concern directly from your camera roll or live device capture.'
              },
              {
                step: '02',
                title: 'AI Instantly Analyzes',
                desc: 'Our neural networks scan the images to evaluate cellular patterns, comparing them against verified dermatological databases.'
              },
              {
                step: '03',
                title: 'Get Clinical Insights',
                desc: 'Review match confidence scores, descriptions, and a structured pharmacy guide containing standard local treatment options.'
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                border: '1px solid #e8dcc4',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'left',
                position: 'relative',
                boxShadow: '0 4px 6px -1px rgba(13, 107, 94, 0.02)'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  fontSize: '44px',
                  fontWeight: 900,
                  color: 'rgba(13, 107, 94, 0.08)'
                }}>{item.step}</span>
                
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(13, 107, 94, 0.1)',
                  color: '#0d6b5e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  {idx === 0 && <Camera size={20} />}
                  {idx === 1 && <Sparkles size={20} />}
                  {idx === 2 && <Stethoscope size={20} />}
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 10px 0' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. What You Get Section */}
      <section id="what-you-get" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0d6b5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comprehensive features</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginTop: '8px', marginBottom: '12px' }}>What You Get</h2>
            <p style={{ fontSize: '15px', color: '#4B5563', maxWidth: '600px', margin: '0 auto' }}>
              We provide clinical screening insights and detailed medication guides tailored to tropical conditions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              {
                icon: <Sparkles size={20} />,
                title: 'AI-Powered Detection',
                desc: 'Advanced screening trained on clinical imaging to recognize various inflammatory and fungal disorders.'
              },
              {
                icon: <Globe size={20} />,
                title: 'Climate-Specific Insights',
                desc: 'Tailored specifically for hot, humid climates like Nigeria where sweating and sun trigger eczema and tinea.'
              },
              {
                icon: <Shield size={20} />,
                title: 'Dark Skin Optimization',
                desc: 'Specifically optimized to ensure high-accuracy screening on hyperpigmentation and diverse skin tones.'
              },
              {
                icon: <DollarSign size={20} />,
                title: 'Pharmacy Price Guides',
                desc: 'Get immediate references of recommended topical options with real local currency price ranges.'
              }
            ].map((item, idx) => (
              <Card key={idx} variant="outlined" hover style={{ borderRadius: '16px', padding: '24px', backgroundColor: '#fff', border: '1px solid #e8dcc4' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(13, 107, 94, 0.08)',
                  color: '#0d6b5e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Medication Recommendations Section */}
      <section id="medication" style={{ padding: '64px 24px', backgroundColor: '#faf7f2' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0d6b5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expert medication guides</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginTop: '8px', marginBottom: '12px' }}>Medication Recommendations</h2>
            <p style={{ fontSize: '15px', color: '#4B5563', maxWidth: '600px', margin: '0 auto' }}>
              Understand common treatment tiers, from budget items to advanced creams.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { id: 'antibiotics', label: 'Antibiotic Creams' },
              { id: 'antifungals', label: 'Antifungal Creams' },
              { id: 'steroids', label: 'Steroid Creams' }
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '9999px',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: active ? '#0d6b5e' : '#e8dcc4',
                    backgroundColor: active ? '#0d6b5e' : '#ffffff',
                    color: active ? '#ffffff' : '#1F5252',
                    cursor: 'pointer',
                    minHeight: '44px',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {medicationsData[activeTab].map((med, i) => (
              <div key={i} style={{
                background: '#ffffff',
                border: med.recommended ? '2px solid #0d6b5e' : '1px solid #e8dcc4',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
              }}>
                {med.recommended && (
                  <span style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    backgroundColor: '#0d6b5e',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Sparkles size={8} fill="#fff" /> RECOMMENDED
                  </span>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>{med.name}</h3>
                    <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>{med.type}</span>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0d6b5e', whiteSpace: 'nowrap' }}>{med.price}</span>
                </div>

                <div style={{ background: '#f9f5ef', borderRadius: '10px', padding: '12px', marginTop: '12px', borderLeft: '3px solid #0d6b5e' }}>
                  <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                    "{med.description}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why DermaScan? Section */}
      <section id="why-us" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }} className="lg:flex-row items-center">
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0d6b5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bespoke technology</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: 0 }}>Why DermaScan?</h2>
            <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
              Standard medical visual resources often lack representation of darker skin phototypes (Fitzpatrick IV–VI). DermaScan is deliberately built and tested to overcome this gap, providing high diagnostic helper precision.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              {[
                { title: 'Trained on Darker Skin Tones', desc: 'Minimizes racial bias in clinical AI, improving recognition on melanin-rich skin.' },
                { title: 'Optimized for Nigerian Climates', desc: 'Accounts for regional factors like sweat-induced rashes, hot weather flares, and local humidity.' },
                { title: 'Privacy-First Policy', desc: 'Secure encryption standards ensure your clinical photo scans remain private.' }
              ].map((point, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} className="text-primary" style={{ flexShrink: 0, marginTop: '2px', color: '#0d6b5e' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>{point.title}</h4>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', background: 'linear-gradient(135deg, #0d6b5e 0%, #1F5252 100%)', padding: '40px', borderRadius: '24px', color: '#ffffff', boxShadow: '0 20px 40px rgba(42,112,112,0.15)' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>Proven Clinic Metrics</h3>
            <p style={{ fontSize: '14px', opacity: 0.85, lineHeight: 1.5, margin: 0 }}>
              Helping Nigerian users identify inflammatory, infectious, and fungal lesions in real time.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '20px' }}>
              <div>
                <span style={{ fontSize: '32px', fontWeight: 900, display: 'block', lineHeight: 1 }}>94.2%</span>
                <span style={{ fontSize: '12px', opacity: 0.8, fontWeight: 500 }}>Detection sensitivity index</span>
              </div>
              <div>
                <span style={{ fontSize: '32px', fontWeight: 900, display: 'block', lineHeight: 1 }}>15,000+</span>
                <span style={{ fontSize: '12px', opacity: 0.8, fontWeight: 500 }}>Scans processed since launching</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FAQs Section */}
      <section id="faqs" style={{ padding: '64px 24px', backgroundColor: '#faf7f2' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0d6b5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Got questions?</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginTop: '8px', marginBottom: '12px' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8dcc4',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 24px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '15px',
                      color: '#1F5252',
                      cursor: 'pointer',
                      minHeight: '44px'
                    }}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={18} style={{
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                      color: '#0d6b5e'
                    }} />
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 24px 18px 24px',
                      fontSize: '14px',
                      color: '#4B5563',
                      lineHeight: 1.6,
                      borderTop: '1px solid rgba(13, 107, 94, 0.05)'
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #0d6b5e 0%, #1F5252 100%)',
          borderRadius: '24px',
          padding: '48px 32px',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(42,112,112,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, margin: 0 }}>Ready to save your skin?</h2>
          <p style={{ fontSize: '15px', opacity: 0.9, maxWidth: '600px', margin: 0, lineHeight: 1.5 }}>
            Get started today and enjoy advanced AI-powered skin analysis with localized price recommendations.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
            <Button
              onClick={() => navigate('/signup')}
              style={{ backgroundColor: '#ffffff', color: '#0d6b5e', minHeight: '48px', boxShadow: 'none' }}
              icon={<ArrowRight size={18} />}
            >
              Get Started Now
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/signin')}
              style={{ minHeight: '48px', borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff', backgroundColor: 'transparent' }}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer style={{
        backgroundColor: '#133535',
        color: '#D4ECEC',
        padding: '48px 24px 32px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="md:flex-row justify-between items-start">
            
            {/* Logo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/logo.png" alt="Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                </div>
                 <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>DermaScan</span>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.7, margin: 0, maxWidth: '280px' }}>
                Bridging the diagnostic helper gap for skin of color in seconds.
              </p>
            </div>

            {/* Quick Links */}
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Technology</span>
                <a href="#how-it-works" style={{ fontSize: '12px', color: '#A3D9D9', textDecoration: 'none' }}>How It Works</a>
                <a href="#what-you-get" style={{ fontSize: '12px', color: '#A3D9D9', textDecoration: 'none' }}>What You Get</a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Resources</span>
                <a href="#medication" style={{ fontSize: '12px', color: '#A3D9D9', textDecoration: 'none' }}>Medications</a>
                <a href="#why-us" style={{ fontSize: '12px', color: '#A3D9D9', textDecoration: 'none' }}>Clinic Metrics</a>
                <a href="#faqs" style={{ fontSize: '12px', color: '#A3D9D9', textDecoration: 'none' }}>FAQs</a>
              </div>
            </div>

          </div>

          {/* Medical disclaimer as pointed out as compliance standard */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 0',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <Info size={16} style={{ color: '#A3D9D9', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '11px', opacity: 0.6, margin: 0, lineHeight: 1.6 }}>
              <strong>Disclaimer:</strong> DermaScan is a screening helper designed for education and preliminary guidance. It does not provide medical diagnosis or substitute professional consultation. Always seek advice from a doctor or qualified pharmacist before starting any medical treatments.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '11px', opacity: 0.5 }}>
            <span>&copy; {new Date().getFullYear()} DermaScan. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

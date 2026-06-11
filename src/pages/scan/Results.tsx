import { useParams, useNavigate } from 'react-router-dom';
import { Share2, AlertTriangle, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { api } from '../../services/api';
import type { ScanResult } from '../../types';

// Yoruba (YO), Hausa (HA), Igbo (IG) translation mock dictionary for clinical descriptions
const TRANSLATIONS: Record<string, Record<'EN' | 'YO' | 'HA' | 'IG', string>> = {
  eczema: {
    EN: "An inflammatory skin condition characterized by dry, red, and intensely itchy patches. It often flares up in response to dry harmattan winds or extreme humidity shifts in Nigeria.",
    YO: "Eyi jẹ aisan awọ ara ti o nfa igbona, gbigbẹ, ati yun lile lori awọ. O maa n pọ si lakoko igba ẹlẹri tabi nigbati afẹfẹ ba gbẹ ni orilẹ-ede Naijiria.",
    HA: "Wannan wata cutar fata ce da ke kawo kumburi, bushewa, da ƙaiƙayi mai tsanani. Yana yawan tashi lokacin rani ko lokacin sanyi a Najeriya.",
    IG: "Nke a bụ ọrịa akpụkpọ ahụ na-ebute ọkụ ọkụ, nkụ, na mgbu siri ike. Ọ na-emekarị mgbe ọkọchị na-ada ma ọ bụ mgbe ikuku kpọrọ nkụ na Nigeria."
  },
  acne: {
    EN: "A skin condition occurring when hair follicles become clogged with oil and dead skin cells, leading to blackheads, whiteheads, or inflamed pimples.",
    YO: "Aisan awọ ara ti o nwaye nigbati awọn ihò awọ ba dina pẹlu epo ati awọn sẹẹli awọ ara ti o ku, eyi ti o nfa pimples tabi spots.",
    HA: "Ciwon fata da ke faruwa lokacin da ramukan gashi suka toshe da mai da matattun kwayoyin halitta, wanda ke haifar da kuraje.",
    IG: "Ọrịa akpụkpọ ahụ na-eme mgbe pores akpụkpọ ahụ na-emechi site na mmanụ na sel akpụkpọ nwụrụ anwụ, na-ebute otuto."
  },
  general: {
    EN: "A localized skin patch showing mild irritation or reaction. Maintain clean skin hygiene and keep the area hydrated.",
    YO: "Agbegbe awọ ara kan ti o fihan ibinu kekere. Jẹ ki awọ rẹ mọ ki o si lo ipara ti o yẹ.",
    HA: "Wani yanki na fata da ke nuna ɗan damuwa ko rashin lafiya. Tabbatar da tsafta kuma kiyaye fatar da ruwa.",
    IG: "Ebe akpụkpọ ahụ nwere obere mgbakasị ahụ. Debe akpụkpọ ahụ gị ọcha ma jiri mmiri hydrate ya."
  }
};

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Interactive page states
  const [selectedLang, setSelectedLang] = useState<'EN' | 'YO' | 'HA' | 'IG'>('EN');
  const [isTriggersOpen, setIsTriggersOpen] = useState(true);

  useEffect(() => {
    const fetchScanDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.get<ScanResult>(`/scans/${id}`);
        setScan(data);
      } catch (err: any) {
        console.error('Failed to fetch scan results:', err);
        setError(err.message || 'Failed to load scan results.');
      } finally {
        setLoading(false);
      }
    };
    fetchScanDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-[#f9f5ef] p-6">
        <div style={{ color: '#0d6b5e', fontSize: '16px', fontWeight: 600 }}>Loading analysis results...</div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-[#f9f5ef] p-6">
        <p style={{ color: '#e05252', marginBottom: '16px', fontWeight: 500 }}>{error || 'Scan not found'}</p>
        <Button onClick={() => navigate('/home')} style={{ minHeight: '44px' }}>
          Back to Home
        </Button>
      </div>
    );
  }

  // Get description based on translation
  const conditionKey = scan.condition.name.toLowerCase().includes('acne') ? 'acne' :
                       scan.condition.name.toLowerCase().includes('eczema') ? 'eczema' : 'general';
  const plainDescription = TRANSLATIONS[conditionKey][selectedLang];

  // Map triggers based on condition
  const triggersList = conditionKey === 'acne' ? 
    ['Excess Sebum', 'Bacterial Overgrowth', 'High Humidity', 'Comedogenic Oils'] :
    ['Harmattan Dryness', 'Sweat Friction', 'Harsh Antiseptic Soaps', 'Synthetic Fabrics'];

  // Map Nigerian Generic treatments (no brands)
  const selfCareSteps = conditionKey === 'acne' ? [
    'Cleanse skin gently twice daily with a mild 2% Salicylic Acid solution.',
    'Apply Benzoyl Peroxide gel sparingly to active lesions at night.',
    'Avoid touching or squeezing spots to prevent Post-Inflammatory Hyperpigmentation.'
  ] : [
    'Apply thick emollient immediately after bathing while skin is damp.',
    'Apply Hydrocortisone cream sparingly to red itchy zones for up to 7 days.',
    'Bypass harsh soaps and use hydrating cleansers.'
  ];

  const genericMeds = conditionKey === 'acne' ? 
    ['Salicylic Acid Cleanser (2%)', 'Benzoyl Peroxide Gel (5%)', 'Adapalene Gel (0.1%)'] :
    ['Hydrocortisone Cream (1%)', 'Shea Butter Emollient Base', 'Zinc Oxide Barrier Paste'];

  const severity = scan.severity || 'moderate';
  const formattedDate = new Date(scan.date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div
      className="min-h-dvh bg-[#f9f5ef] page-enter"
      style={{
        width: '100%',
        maxWidth: '480px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '16px',
        paddingRight: '16px',
        boxSizing: 'border-box',
        paddingBottom: '96px',
      }}
    >
      {/* Inline styles for pulse animations on dot and CTA */}
      <style>{`
        @keyframes annotPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(13, 107, 94, 0.4);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(13, 107, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(13, 107, 94, 0);
          }
        }
        .annotation-dot {
          animation: annotPulse 2s infinite;
        }
      `}</style>

      {/* HEADER */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        borderBottom: '1px solid rgba(13, 107, 94, 0.08)',
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(249, 245, 239, 0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 40
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '44px', minHeight: '44px', color: '#6b7280' }}
        >
          <ArrowLeft size={22} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Scan Complete</h1>
          <span style={{ fontSize: '11px', color: '#6b7280' }}>Today, {formattedDate}</span>
        </div>

        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '44px', minHeight: '44px', color: '#6b7280' }}>
          <Share2 size={20} />
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>

        {/* SKIN PREVIEW CARD */}
        <Card variant="default" padding="sm" style={{ border: 'none', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', background: '#e5e7eb' }}>
            <img
              src={scan.imageUrl.startsWith('http') ? scan.imageUrl : `http://${window.location.hostname}:8000${scan.imageUrl}`}
              alt="Scan capture"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Pulsing annotation dot in center */}
            <div
              className="annotation-dot"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#0d6b5e',
                border: '3px solid #faf7f2',
                boxShadow: '0 0 0 6px rgba(13, 107, 94, 0.25)',
                cursor: 'pointer'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0d6b5e' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Affected area detected</span>
          </div>
        </Card>

        {/* CONDITION RESULT CARD (Hero Card Redesign) */}
        <Card
          variant="default"
          padding="lg"
          style={{
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid rgba(13, 107, 94, 0.05)',
            background: '#ffffff',
            padding: '32px 24px'
          }}
        >
          {/* Hero Match Score */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px' }}>
              <span style={{ fontSize: '64px', fontWeight: 800, color: '#0d6b5e', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {scan.confidence}
              </span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#0d6b5e' }}>% match</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px', display: 'block' }}>
              AI Match Confidence
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: 0 }}>
              {scan.condition.name}
            </h2>
            
            {/* Severity badge pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: severity.toLowerCase() === 'mild' ? '#e6f6ee' : '#fef6e7',
              color: severity.toLowerCase() === 'mild' ? '#4caf87' : '#e8a838',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {severity} Severity
            </div>
          </div>

          {/* Localized Plain Language Description */}
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0', lineHeight: 1.6 }}>
            {plainDescription}
          </p>

          {/* Language Toggle Inside Card */}
          <div style={{
            display: 'flex',
            gap: '8px',
            borderTop: '1px solid rgba(13, 107, 94, 0.08)',
            paddingTop: '16px'
          }}>
            {(['EN', 'YO', 'HA', 'IG'] as const).map((lang) => {
              const isSelected = selectedLang === lang;
              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: '1px solid ' + (isSelected ? '#0d6b5e' : 'rgba(13, 107, 94, 0.15)'),
                    backgroundColor: isSelected ? 'rgba(13, 107, 94, 0.08)' : 'transparent',
                    color: isSelected ? '#0d6b5e' : '#6b7280',
                    cursor: 'pointer',
                    minWidth: '44px',
                    minHeight: '28px'
                  }}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </Card>

        {/* CLINICAL BIOMARKERS HERO METRICS */}
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '8px 0 12px 4px' }}>
            Clinical Biomarkers
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { name: 'Hydration', value: scan.hydrationLevel ?? 70, unit: '%', desc: 'Moisture retention capacity' },
              { name: 'Sebum Level', value: scan.sebumLevel ?? 50, unit: '%', desc: 'Lipid & oil balance' },
              { name: 'Barrier Integrity', value: scan.barrierIntegrity ?? 80, unit: '%', desc: 'Epidermal protection strength' },
              { name: 'Hyperpigmentation', value: scan.hyperpigmentationIndex ?? 25, unit: '%', desc: 'Melanin distribution index' }
            ].map((metric, idx) => (
              <Card
                key={idx}
                variant="default"
                padding="md"
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: '1px solid rgba(13, 107, 94, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>{metric.name}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: '#0d6b5e', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {metric.value}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0d6b5e' }}>{metric.unit}</span>
                </div>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0, lineHeight: 1.2 }}>{metric.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* WHAT THIS MEANS SECTION */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>What This Means</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { title: 'See a Doctor?', val: 'MONITOR', color: '#e8a838', bg: '#fef6e7' },
              { title: 'Contagious?', val: 'No', color: '#4caf87', bg: '#e6f6ee' },
              { title: 'Improves In', val: '2–4 weeks', color: '#0d6b5e', bg: 'rgba(13, 107, 94, 0.08)' }
            ].map((ind, idx) => (
              <Card
                key={idx}
                variant="default"
                padding="sm"
                style={{
                  textAlign: 'center',
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                }}
              >
                <span style={{ fontSize: '10px', color: '#6b7280', display: 'block', marginBottom: '8px' }}>{ind.title}</span>
                <div style={{
                  padding: '6px 4px',
                  borderRadius: '10px',
                  backgroundColor: ind.bg,
                  color: ind.color,
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {ind.val}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* COMMON TRIGGERS CARD */}
        <Card
          variant="default"
          padding="md"
          style={{
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            cursor: 'pointer'
          }}
          onClick={() => setIsTriggersOpen(!isTriggersOpen)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Common Triggers</h3>
            {isTriggersOpen ? <ChevronUp size={18} style={{ color: '#0d6b5e' }} /> : <ChevronDown size={18} style={{ color: '#0d6b5e' }} />}
          </div>
          
          {isTriggersOpen && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', animation: 'fadeIn 0.2s ease' }}>
              {triggersList.map((trig, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    backgroundColor: '#faf7f2',
                    border: '1px solid rgba(13, 107, 94, 0.12)',
                    color: '#0d6b5e'
                  }}
                >
                  {trig}
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* TREATMENT PATH CARD */}
        <Card variant="default" padding="lg" style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 14px 0' }}>What To Do</h3>
          
          {/* Numbered self care list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {selfCareSteps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0d6b5e' }}>{idx + 1}.</span>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>{step}</p>
              </div>
            ))}
          </div>

          {/* Sub-section: Available at Nigerian pharmacies */}
          <div style={{
            background: '#faf7f2',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #e8dcc4',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#0d6b5e', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Available at Nigerian pharmacies
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {genericMeds.map((med, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#0d6b5e' }} />
                  <span>{med}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Red Flag Warning signs */}
          <div style={{
            background: '#fbebeb',
            padding: '16px',
            borderRadius: '12px',
            color: '#e05252'
          }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} />
              See a specialist if...
            </h4>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', lineHeight: 1.5 }}>
              <li>The patches begin leaking, oozing, or weeping yellowish fluid.</li>
              <li>You experience a spreading infection accompanied by a fever.</li>
              <li>The rash does not improve after 10 days of self-care.</li>
            </ul>
          </div>
        </Card>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
          <Button fullWidth onClick={() => {
            const params = new URLSearchParams({
              condition: scan.condition.name,
              confidence: String(scan.confidence),
              severity: severity,
              scan_id: scan.id,
            });
            navigate(`/chat?${params.toString()}`);
          }} style={{ minHeight: '44px' }}>
            💬 Chat with Derm About This
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/consult')} style={{ minHeight: '44px' }}>
            Ask an Expert About This
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/history')} style={{ minHeight: '44px' }}>
            Save to History
          </Button>
          <button
            onClick={() => navigate('/scan/new')}
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#0d6b5e',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'center',
              padding: '6px 0',
              textDecoration: 'underline'
            }}
          >
            Scan Another Area
          </button>
        </div>

        {/* DISCLAIMER */}
        <p style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center', lineHeight: 1.4, margin: '12px 0 0 0' }}>
          DermaScan does not replace a dermatologist. Seek professional care for serious conditions.
        </p>
      </div>
    </div>
  );
}

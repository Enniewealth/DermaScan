import { useState } from 'react';
import { ShieldCheck, AlertTriangle, XCircle, Search, RefreshCw, Info } from 'lucide-react';
import { api } from '../../services/api';
import type { ProductScanResponse } from '../../types';
import BackHeader from '../../components/ui/BackHeader';

export default function ProductScanner() {
  const [ingredientsText, setIngredientsText] = useState('');
  const [result, setResult] = useState<ProductScanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (textToAnalyze = ingredientsText) => {
    if (!textToAnalyze.trim()) {
      setError('Please enter some cosmetic ingredients to analyze.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<ProductScanResponse>('/products/analyze', {
        ingredientsText: textToAnalyze
      });
      setResult(response);
    } catch (err: any) {
      console.error(err);
      setError('Failed to process ingredient analysis. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = (sampleType: 'acne' | 'eczema' | 'safe') => {
    let sampleText = '';
    if (sampleType === 'acne') {
      sampleText = 'Water, Coconut Oil, Isopropyl Myristate, Sodium Lauryl Sulfate, Glycerin, Phenoxyethanol';
    } else if (sampleType === 'eczema') {
      sampleText = 'Aqua, Alcohol Denat, Salicylic Acid, Fragrance, Parfum, Glycerin, Shea Butter';
    } else {
      sampleText = 'Water, Glycerin, Ceramide NP, Shea Butter, Niacinamide, Hyaluronic Acid, Phenoxyethanol';
    }
    setIngredientsText(sampleText);
    setError(null);
    setResult(null);
    // Auto-analyze for quicker testing
    handleAnalyze(sampleText);
  };

  const getCompatibilityDetails = (comp: string) => {
    const norm = comp.toLowerCase();
    if (norm === 'safe') {
      return {
        color: '#10B981',
        bg: '#E6F4F4',
        icon: ShieldCheck,
        label: 'Highly Compatible'
      };
    }
    if (norm.includes('caution')) {
      return {
        color: '#F59E0B',
        bg: '#FEF3C7',
        icon: AlertTriangle,
        label: 'Use with Caution'
      };
    }
    return {
      color: '#EF4444',
      bg: '#FEE2E2',
      icon: XCircle,
      label: 'Avoid Product'
    };
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 16px 80px 16px', boxSizing: 'border-box' }}>
      <BackHeader title="Product Ingredient Scanner" />
      
      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 16px 0', lineHeight: 1.5 }}>
          Paste an ingredient list from a skincare product below to check compatibility with your diagnosed skin condition.
        </p>

        {/* Preset Sample Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
            Quick Load Test Presets:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleLoadSample('acne')}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#FEF3C7',
                color: '#D97706',
                border: '1px solid rgba(217, 119, 6, 0.2)',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Comedogenic (Acne Trigger)
            </button>
            <button
              onClick={() => handleLoadSample('eczema')}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#FEE2E2',
                color: '#DC2626',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Irritant (Eczema Trigger)
            </button>
            <button
              onClick={() => handleLoadSample('safe')}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#E6F4F4',
                color: '#0d6b5e',
                border: '1px solid rgba(13, 107, 94, 0.2)',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Safe Formulation
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid rgba(13, 107, 94, 0.08)',
          boxShadow: '0 4px 12px rgba(13, 107, 94, 0.02)',
          marginBottom: '20px'
        }}>
          <textarea
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="Paste ingredients here... (e.g. Water, Glycerin, Salicylic Acid, Parfum)"
            style={{
              width: '100%',
              height: '120px',
              border: '1px solid rgba(13, 107, 94, 0.15)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '14px',
              lineHeight: 1.5,
              resize: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            focus-style={{ borderColor: '#0d6b5e' }}
          />

          {error && (
            <div style={{ fontSize: '13px', color: '#EF4444', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={() => handleAnalyze()}
            disabled={isLoading}
            style={{
              width: '100%',
              background: '#0d6b5e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Analyzing ingredients...
              </>
            ) : (
              <>
                <Search size={16} />
                Analyze Compatibility
              </>
            )}
          </button>
        </div>

        {/* Result Area */}
        {result && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(13, 107, 94, 0.08)',
            boxShadow: '0 10px 25px rgba(13, 107, 94, 0.04)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: '0 0 16px 0' }}>Analysis Report</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {/* Circular Score representation */}
              <div style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `conic-gradient(#0d6b5e ${result.fitScore * 3.6}deg, #E5E7EB 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>{result.fitScore}</span>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Fit Score</span>
                </div>
              </div>

              {/* Compatibility Status badge */}
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  backgroundColor: getCompatibilityDetails(result.compatibility).bg,
                  color: getCompatibilityDetails(result.compatibility).color,
                  fontWeight: 700,
                  fontSize: '14px',
                  marginBottom: '6px'
                }}>
                  {(() => {
                    const CompIcon = getCompatibilityDetails(result.compatibility).icon;
                    return <CompIcon size={16} />;
                  })()}
                  <span>{getCompatibilityDetails(result.compatibility).label}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#4B5563', margin: 0, lineHeight: 1.4 }}>
                  Match score indicates suitability based on your active profile.
                </p>
              </div>
            </div>

            {/* Explanation box */}
            <div style={{
              background: '#F9FAFB',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              color: '#374151',
              lineHeight: 1.5,
              marginBottom: '20px',
              borderLeft: '4px solid #0d6b5e'
            }}>
              {result.reason}
            </div>

            {/* Flagged Ingredients */}
            {result.harmfulIngredients.length > 0 && (
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#991B1B', display: 'block', marginBottom: '10px' }}>
                  Avoid ingredients detected:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.harmfulIngredients.map((ing, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '8px',
                        background: '#FEF2F2',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid rgba(239, 68, 68, 0.1)',
                        fontSize: '13px',
                        color: '#991B1B'
                      }}
                    >
                      <Info size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span><strong>{ing}</strong>: Flagged as highly reactive / drying for your skin type.</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

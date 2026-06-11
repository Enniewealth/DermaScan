// ============================================
// DermaScan — Derm Chat Page
// AI Skin Health Assistant
// ============================================

import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Mic,
  X,
  Stethoscope,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '../../services/api';

// ── Types ────────────────────────────────

interface ScanContext {
  condition?: string;
  confidence?: number;
  severity?: string;
  body_location?: string;
  scan_id?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'derm';
  content: string;
  timestamp: Date;
  suggestedReplies?: string[];
  escalation?: {
    message: string;
    cta_text: string;
    price_from: string;
  } | null;
  imageUrl?: string;
  isLoading?: boolean;
}

type Language = 'EN' | 'YO' | 'HA' | 'IG';

// ── Helpers ──────────────────────────────

const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const formatTime = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

/** Render bold markers **text** as <strong> in HTML */
function renderBold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// ── Starter Prompts ──────────────────────

const STARTER_PROMPTS = [
  { emoji: '🤚', text: 'I have a rash on my arm' },
  { emoji: '🔵', text: 'What causes dark spots?' },
  { emoji: '🔬', text: 'Is my condition contagious?' },
  { emoji: '🗣️', text: 'Talk to me in Yoruba' },
];

// ── Component ────────────────────────────

export default function DermChat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<Language>('EN');
  const [scanContext, setScanContext] = useState<ScanContext | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Parse scan context from URL params
  useEffect(() => {
    const condition = searchParams.get('condition');
    const confidence = searchParams.get('confidence');
    const severity = searchParams.get('severity');
    const body_location = searchParams.get('body_location');
    const scan_id = searchParams.get('scan_id');

    if (condition) {
      const ctx: ScanContext = {
        condition,
        confidence: confidence ? parseInt(confidence) : undefined,
        severity: severity || undefined,
        body_location: body_location || undefined,
        scan_id: scan_id || undefined,
      };
      setScanContext(ctx);
    }
  }, [searchParams]);

  // Auto-open with scan context or greeting
  useEffect(() => {
    if (hasInitialized) return;

    if (scanContext) {
      // Open with scan-aware greeting
      const scanGreeting: ChatMessage = {
        id: generateId(),
        role: 'derm',
        content: `I can see your scan picked up **${scanContext.condition}** on your ${scanContext.body_location || 'skin'} with a **${scanContext.confidence || 94}% confidence** score and **${scanContext.severity || 'moderate'}** severity. What would you like to know about it?`,
        timestamp: new Date(),
        suggestedReplies: ['What does this mean?', 'How do I treat it?', 'Will it leave dark marks?'],
        escalation: null,
      };
      setMessages([scanGreeting]);
      setHasInitialized(true);
    } else if (messages.length === 0) {
      // Show empty state (welcome state) — no messages yet
      setHasInitialized(true);
    }
  }, [scanContext, hasInitialized, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Send Message ────────────────────────

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() && !attachedImage) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
      imageUrl: attachedImage || undefined,
    };

    const loadingMessage: ChatMessage = {
      id: generateId(),
      role: 'derm',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInputValue('');
    setAttachedImage(null);
    setIsTyping(true);

    // Build history for API
    const history = messages
      .filter((m) => !m.isLoading)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const response = await api.post<{
        reply: string;
        suggested_replies: string[];
        escalation: { message: string; cta_text: string; price_from: string } | null;
      }>('/chat/message', {
        message: text.trim(),
        language,
        scan_context: scanContext,
        history,
        mode: 'text',
      }, 30000);

      const dermReply: ChatMessage = {
        id: generateId(),
        role: 'derm',
        content: response.reply,
        timestamp: new Date(),
        suggestedReplies: response.suggested_replies,
        escalation: response.escalation,
      };

      setMessages((prev) =>
        prev.map((m) => (m.isLoading ? dermReply : m))
      );
    } catch {
      const errorReply: ChatMessage = {
        id: generateId(),
        role: 'derm',
        content: "I'm having trouble connecting right now. Please check your internet connection and try again.",
        timestamp: new Date(),
        suggestedReplies: ['Try again', 'Scan my skin'],
      };
      setMessages((prev) =>
        prev.map((m) => (m.isLoading ? errorReply : m))
      );
    } finally {
      setIsTyping(false);
    }
  }, [messages, language, scanContext, attachedImage]);

  // ── Handle Submit ───────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const handleStarterPrompt = (text: string) => {
    sendMessage(text);
  };

  // ── Image Attachment ────────────────────

  const handleImageSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setAttachedImage(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // ── Has real messages (non-empty state) ──
  const hasMessages = messages.length > 0;

  // ═════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      maxWidth: '480px',
      margin: '0 auto',
      backgroundColor: '#f9f5ef',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── HEADER ──────────────────────── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: 'rgba(255, 249, 245, 0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(13, 107, 94, 0.08)',
        zIndex: 30,
        flexShrink: 0,
      }}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '12px',
            color: '#374151',
          }}
          id="chat-btn-back"
        >
          <ArrowLeft size={22} />
        </button>

        {/* Title area */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span style={{ fontSize: '17px', fontWeight: 800, color: '#111827' }}>Derm</span>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: '#4caf87',
              boxShadow: '0 0 0 2px rgba(76, 175, 135, 0.2)',
            }} />
          </div>
          <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>AI Skin Assistant</span>
        </div>

        {/* Language toggle */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            style={{
              fontSize: '11px', fontWeight: 700, color: '#0d6b5e',
              padding: '6px 10px', borderRadius: '8px',
              backgroundColor: 'rgba(13, 107, 94, 0.08)',
              minWidth: '40px', minHeight: '36px',
            }}
            id="chat-btn-language"
          >
            {language}
          </button>

          {/* Language dropdown */}
          {showLangPicker && (
            <div style={{
              position: 'absolute', top: '44px', right: 0,
              backgroundColor: '#ffffff', borderRadius: '12px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              padding: '4px', zIndex: 100, minWidth: '80px',
              animation: 'fadeIn 0.15s ease',
            }}>
              {(['EN', 'YO', 'HA', 'IG'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
                  style={{
                    display: 'block', width: '100%', padding: '8px 14px',
                    fontSize: '13px', fontWeight: language === lang ? 700 : 500,
                    color: language === lang ? '#0d6b5e' : '#374151',
                    backgroundColor: language === lang ? 'rgba(13, 107, 94, 0.06)' : 'transparent',
                    borderRadius: '8px', textAlign: 'left',
                  }}
                >
                  {lang === 'EN' ? 'English' : lang === 'YO' ? 'Yoruba' : lang === 'HA' ? 'Hausa' : 'Igbo'}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── SCAN CONTEXT BANNER ─────────── */}
      {scanContext && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 16px',
          backgroundColor: 'rgba(13, 107, 94, 0.08)',
          borderBottom: '1px solid rgba(13, 107, 94, 0.1)',
          flexShrink: 0,
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            backgroundColor: '#0d6b5e', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <ImageIcon size={16} color="#ffffff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0d6b5e', display: 'block' }}>
              Chatting about your {scanContext.condition} scan — {scanContext.confidence || 94}% confidence
            </span>
            <button
              onClick={() => navigate(`/scan/results/${scanContext.scan_id || ''}`)}
              style={{ fontSize: '11px', color: '#0d6b5e', textDecoration: 'underline', fontWeight: 500 }}
            >
              View scan
            </button>
          </div>
          <button
            onClick={() => setScanContext(null)}
            style={{ display: 'flex', padding: '4px', color: '#6b7280' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── CHAT MESSAGES ───────────────── */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
        className="scrollbar-hide"
      >

        {/* ── WELCOME STATE (empty) ────── */}
        {!hasMessages && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            flex: 1, padding: '24px 0',
            animation: 'fadeIn 0.4s ease',
          }}>
            {/* Derm Avatar */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d6b5e 0%, #169382 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 4px 20px rgba(13, 107, 94, 0.25)',
            }}>
              <span style={{ color: '#ffffff', fontSize: '28px', fontWeight: 800 }}>D</span>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: '0 0 4px 0' }}>
              Hi! I'm Derm
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', margin: '0 0 8px 0', lineHeight: 1.5, maxWidth: '280px' }}>
              Your AI skin assistant. Ask me about any skin concern — in English, Yoruba, Hausa, or Igbo.
            </p>
            <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', margin: '0 0 28px 0', lineHeight: 1.4, maxWidth: '260px' }}>
              I'm an AI assistant, not a doctor. For anything serious, please see a qualified dermatologist.
            </p>

            {/* Starter prompt cards — 2x2 grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '10px', width: '100%', maxWidth: '340px',
            }}>
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStarterPrompt(prompt.text)}
                  id={`starter-prompt-${idx}`}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-start', gap: '8px',
                    padding: '14px', borderRadius: '14px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(13, 107, 94, 0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(13, 107, 94, 0.2)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(13, 107, 94, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(13, 107, 94, 0.06)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)';
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{prompt.emoji}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', lineHeight: 1.3 }}>
                    {prompt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── MESSAGE BUBBLES ──────────── */}
        {messages.map((msg, idx) => (
          <div key={msg.id}>
            {/* Timestamp separator (show for first message and when gap > 5min) */}
            {(idx === 0 || (msg.timestamp.getTime() - messages[idx - 1].timestamp.getTime()) > 300000) && (
              <div style={{
                textAlign: 'center', padding: '12px 0 8px',
                fontSize: '11px', color: '#9ca3af', fontWeight: 500,
              }}>
                {formatTime(msg.timestamp)}
              </div>
            )}

            {/* Message row */}
            <div style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: '8px',
              marginBottom: '4px',
              animation: 'fadeInUp 0.25s ease',
            }}>
              {/* Derm avatar */}
              {msg.role === 'derm' && (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d6b5e 0%, #169382 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 800 }}>D</span>
                </div>
              )}

              {/* Bubble */}
              <div style={{
                maxWidth: '78%',
                padding: msg.isLoading ? '14px 20px' : '12px 16px',
                borderRadius: '18px',
                ...(msg.role === 'user' ? {
                  backgroundColor: '#0d6b5e',
                  color: '#ffffff',
                  borderBottomRightRadius: '6px',
                } : {
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  borderBottomLeftRadius: '6px',
                  borderLeft: '3px solid #0d6b5e',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }),
              }}>
                {/* Loading state */}
                {msg.isLoading ? (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        backgroundColor: '#0d6b5e', opacity: 0.5,
                        animation: `typingDot 1.2s ease-in-out ${i * 0.15}s infinite`,
                      }} />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Attached image */}
                    {msg.imageUrl && (
                      <div style={{ marginBottom: '8px', borderRadius: '12px', overflow: 'hidden' }}>
                        <img
                          src={msg.imageUrl}
                          alt="Attached"
                          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px' }}
                        />
                      </div>
                    )}
                    {/* Message text */}
                    <div
                      style={{
                        fontSize: '14px', lineHeight: 1.55,
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                      }}
                      dangerouslySetInnerHTML={{ __html: renderBold(msg.content) }}
                    />
                  </>
                )}
              </div>
            </div>

            {/* ── ESCALATION CARD ──────── */}
            {msg.escalation && (
              <div style={{
                margin: '8px 0 8px 36px',
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(224, 82, 82, 0.15)',
                boxShadow: '0 2px 8px rgba(224, 82, 82, 0.06)',
                animation: 'fadeInUp 0.3s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Stethoscope size={18} color="#e05252" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#e05252' }}>
                    {msg.escalation.message}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 12px 0' }}>
                  Connect to a Dermatologist — from {msg.escalation.price_from}
                </p>
                <button
                  onClick={() => navigate('/consult')}
                  style={{
                    width: '100%', padding: '10px 16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0d6b5e 0%, #169382 100%)',
                    color: '#ffffff', fontSize: '13px', fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  id="chat-btn-escalation"
                >
                  {msg.escalation.cta_text}
                </button>
              </div>
            )}

            {/* ── SMART REPLY CHIPS ────── */}
            {msg.role === 'derm' && !msg.isLoading && msg.suggestedReplies && msg.suggestedReplies.length > 0 && idx === messages.length - 1 && (
              <div style={{
                display: 'flex', gap: '8px', flexWrap: 'wrap',
                padding: '8px 0 4px 36px',
                animation: 'fadeInUp 0.3s ease 0.1s both',
              }}>
                {msg.suggestedReplies.map((reply, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => handleQuickReply(reply)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      border: '1px solid rgba(13, 107, 94, 0.2)',
                      backgroundColor: 'rgba(13, 107, 94, 0.04)',
                      color: '#0d6b5e',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                    id={`quick-reply-${rIdx}`}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(13, 107, 94, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(13, 107, 94, 0.04)';
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* ── ATTACHED IMAGE PREVIEW ──────── */}
      {attachedImage && (
        <div style={{
          padding: '8px 16px',
          backgroundColor: 'rgba(249, 245, 239, 0.97)',
          borderTop: '1px solid rgba(13, 107, 94, 0.08)',
          display: 'flex', alignItems: 'center', gap: '10px',
          flexShrink: 0,
        }}>
          <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden' }}>
            <img src={attachedImage} alt="Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              onClick={() => setAttachedImage(null)}
              style={{
                position: 'absolute', top: '-2px', right: '-2px',
                width: '18px', height: '18px', borderRadius: '50%',
                backgroundColor: '#e05252', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px',
              }}
            >
              <X size={10} />
            </button>
          </div>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Photo attached — send with your message</span>
        </div>
      )}

      {/* ── INPUT BAR (sticky bottom) ───── */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(13, 107, 94, 0.08)',
          flexShrink: 0,
        }}
      >
        {/* Mic button */}
        <button
          type="button"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '50%',
            color: '#9ca3af', flexShrink: 0,
          }}
          id="chat-btn-mic"
        >
          <Mic size={19} />
        </button>

        {/* Attachment button */}
        <button
          type="button"
          onClick={handleImageSelect}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '50%',
            color: '#9ca3af', flexShrink: 0,
          }}
          id="chat-btn-attach"
        >
          <Paperclip size={19} />
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask Derm anything..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '24px',
            border: '1px solid rgba(13, 107, 94, 0.12)',
            backgroundColor: '#f9f5ef',
            fontSize: '14px',
            color: '#1f2937',
            outline: 'none',
            transition: 'border-color 0.2s',
            minHeight: '42px',
          }}
          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(13, 107, 94, 0.3)'; }}
          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(13, 107, 94, 0.12)'; }}
          id="chat-input"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!inputValue.trim() && !attachedImage}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: (inputValue.trim() || attachedImage)
              ? 'linear-gradient(135deg, #0d6b5e 0%, #169382 100%)'
              : '#e5e7eb',
            color: (inputValue.trim() || attachedImage) ? '#ffffff' : '#9ca3af',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: (inputValue.trim() || attachedImage) ? 'pointer' : 'default',
            flexShrink: 0,
            transition: 'all 0.2s',
            boxShadow: (inputValue.trim() || attachedImage) ? '0 2px 8px rgba(13, 107, 94, 0.25)' : 'none',
          }}
          id="chat-btn-send"
        >
          <Send size={17} style={{ marginLeft: '1px' }} />
        </button>
      </form>

      {/* ── INLINE STYLES FOR ANIMATIONS ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

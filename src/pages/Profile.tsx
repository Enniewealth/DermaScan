// ============================================
// DermaScan — Profile Screen
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Globe,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  ChevronDown,
  Edit3,
} from 'lucide-react';
import BackHeader from '../components/ui/BackHeader';
import Avatar from '../components/ui/Avatar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { skinConcernOptions, languageOptions } from '../data/mockUser';
import { useOffline } from '../contexts/OfflineContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { isOffline, triggerMockOfflineToggle } = useOffline();

  const [showConcernDropdown, setShowConcernDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user?.fullName || '');

  if (!user) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleConcernSelect = (concern: string) => {
    updateUser({ primarySkinConcern: concern });
    setShowConcernDropdown(false);
  };

  const handleLanguageSelect = (lang: string) => {
    updateUser({ settings: { ...user.settings, language: lang } });
    setShowLanguageDropdown(false);
  };

  const toggleReminders = () => {
    updateUser({
      settings: { ...user.settings, scanReminders: !user.settings.scanReminders },
    });
  };

  return (
    <div className="page-enter" style={{ width: '100%', paddingBottom: '96px' }}>
      <BackHeader title="Profile" onBack={() => navigate('/home')} />

      <div className="space-y-5" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
        {/* User Info Card */}
        <Card variant="elevated" padding="lg" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flexShrink: 0 }}>
            <Avatar name={user.fullName} size="xl" />
          </div>
          <div style={{ flex: 1 }}>
            {isEditingName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <input
                  autoFocus
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="text-section-heading text-gray-900 border-b border-primary bg-transparent focus:outline-none"
                  style={{ width: '100%', padding: '2px 0' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateUser({ fullName: tempName });
                      setIsEditingName(false);
                    }
                  }}
                  onBlur={() => {
                    updateUser({ fullName: tempName });
                    setIsEditingName(false);
                  }}
                />
              </div>
            ) : (
              <h2 className="text-section-heading text-gray-900" style={{ margin: '0 0 2px 0' }}>{user.fullName}</h2>
            )}
            <p className="text-body-subtext text-gray-500" style={{ margin: '0 0 8px 0' }}>{user.email}</p>
            <button
              onClick={() => setIsEditingName(true)}
              className="text-section-label text-primary font-semibold hover:underline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', minHeight: '44px', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
            >
              <Edit3 size={12} />
              Edit Profile
            </button>
          </div>
        </Card>

        {/* Skin Type Display */}
        <Card variant="default" padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="text-section-label text-gray-400 uppercase tracking-wider block">
              Skin Type Profile
            </label>
            <button
              onClick={() => navigate('/onboarding')}
              className="text-xs font-bold text-primary hover:underline"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              Retake Quiz
            </button>
          </div>
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: user.fitzpatrickType ? '#faf7f2' : 'rgba(13, 107, 94, 0.05)',
            border: '1px solid',
            borderColor: user.fitzpatrickType ? '#e8dcc4' : 'rgba(13, 107, 94, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {user.fitzpatrickType ? (
              <>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '2px solid #ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  flexShrink: 0,
                  backgroundColor: (() => {
                    const dict: Record<string, string> = {
                      'I': '#FDEBD0', 'II': '#F5CBA7', 'III': '#D4A574',
                      'IV': '#B47B4F', 'V': '#7B5B3A', 'VI': '#4A3525'
                    };
                    return dict[user.fitzpatrickType] || '#D4A574';
                  })()
                }} />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 2px 0' }}>
                    Type {user.fitzpatrickType}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.3 }}>
                    {(() => {
                      const dict: Record<string, string> = {
                        'I': 'Very fair, always burns', 'II': 'Fair, usually burns', 'III': 'Medium, sometimes burns',
                        'IV': 'Olive to moderate brown', 'V': 'Brown, rarely burns', 'VI': 'Deep brown to black'
                      };
                      return dict[user.fitzpatrickType] || 'Fitzpatrick Scale';
                    })()}
                  </p>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0d6b5e'
                }}>
                  <HelpCircle size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: '0 0 2px 0' }}>
                    Unknown Skin Type
                  </h4>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    Take the quiz to get personalized analysis.
                  </p>
                </div>
                <Button variant="secondary" onClick={() => navigate('/onboarding')} style={{ padding: '6px 12px', minHeight: '32px', fontSize: '12px' }}>
                  Start
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Primary Skin Concern */}
        <Card variant="default" padding="md">
          <label className="text-section-label text-gray-400 uppercase tracking-wider block" style={{ marginBottom: '8px' }}>
            Primary Skin Concern
          </label>
          <div className="relative">
            <button
              onClick={() => setShowConcernDropdown(!showConcernDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-cream/50 text-body-subtext font-semibold text-gray-800 hover:border-gray-300 transition-colors"
              style={{ minHeight: '44px', cursor: 'pointer' }}
              id="dropdown-skin-concern"
            >
              {user.primarySkinConcern}
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${showConcernDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showConcernDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden animate-slide-up">
                {skinConcernOptions.map((concern) => (
                  <button
                    key={concern}
                    onClick={() => handleConcernSelect(concern)}
                    className={`w-full text-left transition-colors
                      ${concern === user.primarySkinConcern ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                    style={{ minHeight: '44px', padding: '12px 16px', textAlign: 'left', cursor: 'pointer' }}
                  >
                    {concern}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* App Settings */}
        <div>
          <h3 className="text-section-label text-gray-400 uppercase tracking-wider block" style={{ marginBottom: '8px', paddingLeft: '4px' }}>
            App Settings
          </h3>
          <Card variant="default" padding="none">
            <div style={{ display: 'flex', flexDirection: 'column' }}>

              {/* Scan Reminders */}
              <div className="flex items-center justify-between px-4 py-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '52px', borderBottom: '1px solid rgba(13, 107, 94, 0.05)', boxSizing: 'border-box' }}>
                <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-primary" style={{ flexShrink: 0 }}>
                    <Bell size={18} />
                  </div>
                  <span className="text-body-subtext font-semibold text-gray-800">Scan Reminders</span>
                </div>
                <button
                  onClick={toggleReminders}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    user.settings.scanReminders ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  style={{ minHeight: '44px', cursor: 'pointer' }}
                  id="toggle-reminders"
                >
                  <span
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      user.settings.scanReminders ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Language */}
              <div className="relative" style={{ borderBottom: '1px solid rgba(13, 107, 94, 0.05)' }}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '52px', cursor: 'pointer' }}
                  id="dropdown-language"
                >
                  <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-primary" style={{ flexShrink: 0 }}>
                      <Globe size={18} />
                    </div>
                    <span className="text-body-subtext font-semibold text-gray-800">Language</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="text-body-subtext text-gray-500">{user.settings.language}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </button>
                {showLanguageDropdown && (
                  <div className="mx-4 mb-3 bg-cream/80 rounded-xl overflow-hidden border border-cream-dark/30 animate-slide-up">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageSelect(lang)}
                        className={`w-full text-left px-4 py-2.5 text-body-subtext transition-colors
                          ${lang === user.settings.language ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700 hover:bg-cream-dark/30'}
                        `}
                        style={{ minHeight: '44px', cursor: 'pointer' }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Simulate Offline (Testing Tool) */}
              <div className="flex items-center justify-between px-4 py-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '52px', borderBottom: '1px solid rgba(13, 107, 94, 0.05)', boxSizing: 'border-box' }}>
                <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-primary" style={{ flexShrink: 0 }}>
                    <Shield size={18} style={{ color: '#e8a838' }} />
                  </div>
                  <span className="text-body-subtext font-semibold text-gray-800">Simulate Offline Mode</span>
                </div>
                <button
                  onClick={triggerMockOfflineToggle}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    isOffline ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                  style={{ minHeight: '44px', cursor: 'pointer', backgroundColor: isOffline ? '#e8a838' : undefined }}
                  id="toggle-simulate-offline"
                >
                  <span
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      isOffline ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Privacy Settings */}
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '52px', cursor: 'pointer' }}
              >
                <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-primary" style={{ flexShrink: 0 }}>
                    <Shield size={18} />
                  </div>
                  <span className="text-body-subtext font-semibold text-gray-800">Privacy Settings</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>
          </Card>
        </div>

        {/* Support & Legal */}
        <div>
          <h3 className="text-section-label text-gray-400 uppercase tracking-wider block" style={{ marginBottom: '8px', paddingLeft: '4px' }}>
            Support & Legal
          </h3>
          <Card variant="default" padding="none">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '52px', borderBottom: '1px solid rgba(13, 107, 94, 0.05)', cursor: 'pointer' }}
              >
                <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-primary" style={{ flexShrink: 0 }}>
                    <HelpCircle size={18} />
                  </div>
                  <span className="text-body-subtext font-semibold text-gray-800">Help Center</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>

              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '52px', cursor: 'pointer' }}
              >
                <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-primary" style={{ flexShrink: 0 }}>
                    <FileText size={18} />
                  </div>
                  <span className="text-body-subtext font-semibold text-gray-800">Terms of Service</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>
          </Card>
        </div>

        {/* Logout */}
        <Button
          variant="danger"
          fullWidth
          onClick={handleLogout}
          icon={<LogOut size={18} />}
          id="btn-logout"
          style={{ minHeight: '48px' }}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}

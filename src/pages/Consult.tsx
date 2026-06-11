// ============================================
// DermaScan — Expert Connect Screen
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShieldAlert, 
  Check, 
  ArrowLeft, 
  Heart, 
  CreditCard, 
  Lock, 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  Sparkles,
  Users
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { api } from '../services/api';
import type { ScanResult } from '../types';

interface Specialist {
  id: string;
  name: string;
  role: string;
  hospital: string;
  rating: number;
  reviewsCount: number;
  avatar: string;
  fee: number;
  specialty: string[];
  location: string;
  responseTime: string;
  availableNow: boolean;
}

const SPECIALISTS: Specialist[] = [
  {
    id: 'spec_1',
    name: 'Dr. Chioma Okeke',
    role: 'Consultant Dermatologist',
    hospital: 'LUTH (Lagos University Teaching Hospital)',
    rating: 4.9,
    reviewsCount: 124,
    avatar: '👩‍⚕️',
    fee: 15000,
    specialty: ['Acne', 'Eczema', 'Darker Skin'],
    location: 'Both',
    responseTime: 'Replies in ~2hrs',
    availableNow: true
  },
  {
    id: 'spec_2',
    name: 'Dr. Ibrahim Musa',
    role: 'Clinical Dermatologist',
    hospital: 'National Hospital Abuja',
    rating: 4.8,
    reviewsCount: 96,
    avatar: '👨‍⚕️',
    fee: 12500,
    specialty: ['Acne', 'Rashes', 'Darker Skin'],
    location: 'Both',
    responseTime: 'Replies in ~3hrs',
    availableNow: true
  },
  {
    id: 'spec_3',
    name: 'Dr. Amina Yusuf',
    role: 'Consultant Dermatologist',
    hospital: 'UCH Ibadan / Remote Advisor',
    rating: 4.7,
    reviewsCount: 42,
    avatar: '👩‍⚕️',
    fee: 4500,
    specialty: ['Hyperpigmentation', 'Darker Skin', 'Eczema'],
    location: 'Remote',
    responseTime: 'Replies in ~1hr',
    availableNow: true
  },
  {
    id: 'spec_4',
    name: 'Dr. Femi Balogun',
    role: 'Clinical Dermatologist',
    hospital: 'UNTH Enugu',
    rating: 4.8,
    reviewsCount: 38,
    avatar: '👨‍⚕️',
    fee: 3500,
    specialty: ['Fungal', 'Uneven Tone', 'Darker Skin'],
    location: 'Both',
    responseTime: 'Replies in ~4hrs',
    availableNow: false
  },
  {
    id: 'spec_5',
    name: 'Dr. Marcus Vance',
    role: 'Consultant Dermatologist',
    hospital: 'Lagos Skin Institute',
    rating: 4.6,
    reviewsCount: 18,
    avatar: '👨‍⚕️',
    fee: 25000,
    specialty: ['Psoriasis', 'Rosacea', 'General'],
    location: 'Lagos',
    responseTime: 'Replies in ~24hrs',
    availableNow: true
  }
];

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM'
];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'available', label: 'Available Now' },
  { id: 'budget', label: 'Under ₦5,000' },
  { id: 'remote', label: 'Remote Only' },
  { id: 'darkskin', label: 'Darker Skin Specialist' }
];

export default function Consult() {
  const navigate = useNavigate();
  
  // Scans history for sharing
  const [latestScan, setLatestScan] = useState<ScanResult | null>(null);
  
  // Navigation / View states
  const [bookingStep, setBookingStep] = useState<number>(0); // 0: Listings, 1: Confirm Scan, 2: Choose Time, 3: Confirm + Pay, 4: Success
  const [isQueueFlow, setIsQueueFlow] = useState<boolean>(false); // Volunteer queue flow toggle
  
  // Filter state
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Selection states for Booking
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [shareLatestScan, setShareLatestScan] = useState<boolean>(true);
  
  // Simulated Card Payment States
  const [cardNumber, setCardNumber] = useState<string>('4000 1234 5678 9010');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('123');
  const [isPaying, setIsPaying] = useState<boolean>(false);
  
  // Volunteer queue success state
  const [queueSuccess, setQueueSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const historyData = await api.get<ScanResult[]>('/scans/history');
        if (historyData && historyData.length > 0) {
          setLatestScan(historyData[0]);
        }
      } catch (err) {
        console.error('Failed to load scan history for consult:', err);
      }
    };
    fetchScans();
  }, []);

  // Filter specialists based on selection
  const filteredSpecialists = SPECIALISTS.filter(spec => {
    if (activeFilter === 'available' && !spec.availableNow) return false;
    if (activeFilter === 'budget' && spec.fee >= 5000) return false;
    if (activeFilter === 'remote' && spec.location !== 'Remote') return false;
    if (activeFilter === 'darkskin' && !spec.specialty.includes('Darker Skin')) return false;
    return true;
  });

  // Helper to get formatted next 7 days for the picker
  const getNext7Days = () => {
    const days = [];
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: weekdayNames[d.getDay()],
        dayNum: d.getDate(),
        month: monthNames[d.getMonth()]
      });
    }
    return days;
  };
  
  const calendarDays = getNext7Days();

  const handleStartBooking = (spec: Specialist) => {
    setSelectedSpecialist(spec);
    // Initialize date to today's format
    setSelectedDate(calendarDays[0].fullDate);
    setSelectedTime('');
    setIsQueueFlow(false);
    
    if (latestScan) {
      setBookingStep(1); // Go to share scan selection
    } else {
      setBookingStep(2); // Skip straight to time choice
    }
  };

  const handleStartQueue = () => {
    setIsQueueFlow(true);
    setBookingStep(1);
  };

  const handlePayAndConfirm = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setBookingStep(4); // Advance to Success Screen
    }, 1800);
  };

  const handleSubmitQueue = () => {
    setQueueSuccess(true);
    setBookingStep(4);
  };

  const resetFlow = () => {
    setBookingStep(0);
    setSelectedSpecialist(null);
    setSelectedDate('');
    setSelectedTime('');
    setIsQueueFlow(false);
    setQueueSuccess(false);
  };

  return (
    <div className="page-enter" style={{ maxWidth: '480px', margin: '0 auto', padding: '16px 16px 96px 16px', minHeight: '100dvh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      
      {/* ----------------- STEP 0: SPECIALISTS LISTING ----------------- */}
      {bookingStep === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          {/* Header */}
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0 }}>Find a Dermatologist</h1>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', margin: 0 }}>Real doctors. Your scan shared automatically.</p>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', width: '100%' }} className="scrollbar-hide">
            {FILTERS.map(f => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    flexShrink: 0,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: `1.5px solid ${isSelected ? '#0d6b5e' : 'rgba(13, 107, 94, 0.15)'}`,
                    backgroundColor: isSelected ? '#0d6b5e' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#0d6b5e',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Expert Cards vertical listing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredSpecialists.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: '#6b7280' }}>
                <Search size={32} style={{ margin: '0 auto 12px auto', opacity: 0.4, color: '#0d6b5e' }} />
                <p style={{ fontSize: '14px', fontWeight: 600 }}>No specialists match selected criteria.</p>
              </div>
            ) : (
              filteredSpecialists.map((spec) => (
                <Card
                  key={spec.id}
                  variant="default"
                  padding="md"
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1.5px solid rgba(13, 107, 94, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {/* Photo & Identity Row */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    {/* Circle doctor photo container */}
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: '#f9f5ef',
                      border: '1.5px solid rgba(13, 107, 94, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      flexShrink: 0
                    }}>
                      {spec.avatar}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {spec.name}
                        </h3>
                        {spec.availableNow ? (
                          <span style={{ fontSize: '9px', fontWeight: 700, color: '#4caf87', backgroundColor: '#e6f6ee', padding: '2px 6px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Online
                          </span>
                        ) : (
                          <span style={{ fontSize: '9px', fontWeight: 700, color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Offline
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0', fontWeight: 600 }}>{spec.role}</p>
                    </div>
                  </div>

                  {/* Specialty Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {spec.specialty.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '20px',
                          backgroundColor: '#faf7f2',
                          border: '1px solid rgba(13, 107, 94, 0.12)',
                          color: '#0d6b5e'
                        }}
                      >
                        {s}
                      </span>
                    ))}
                    {/* Location Badge */}
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '20px',
                        backgroundColor: '#e6f6ee',
                        color: '#0d6b5e',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <MapPin size={10} />
                      {spec.location}
                    </span>
                  </div>

                  {/* Rating + Fee Footer Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(13, 107, 94, 0.05)', paddingTop: '10px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span style={{ fontWeight: 800, color: '#111827' }}>{spec.rating}</span>
                        <span style={{ color: '#6b7280' }}>({spec.reviewsCount} reviews)</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>{spec.responseTime}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#0d6b5e' }}>
                        ₦{spec.fee.toLocaleString()}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleStartBooking(spec)}
                        style={{ minWidth: '94px' }}
                      >
                        Book Consult
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Volunteer Queue Card (pinned/docked at bottom of listing) */}
          <div style={{ marginTop: '12px' }}>
            <Card
              variant="default"
              padding="lg"
              style={{
                background: '#faf7f2',
                border: '2px dashed #0d6b5e',
                borderRadius: '16px',
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(13, 107, 94, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#0d6b5e'
                }}>
                  <Heart size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 2px 0' }}>
                    Can't afford a consult?
                  </h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>
                    Submit your scan to our volunteer dermatologist queue — free, 48hr response.
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                fullWidth
                onClick={handleStartQueue}
                style={{ minHeight: '44px' }}
              >
                Join Queue
              </Button>
            </Card>
          </div>

          {/* Clinical Notice disclaimer */}
          <div style={{
            display: 'flex',
            alignItems: 'start',
            gap: '10px',
            backgroundColor: 'rgba(232, 168, 56, 0.05)',
            border: '1px solid rgba(232, 168, 56, 0.15)',
            borderRadius: '12px',
            padding: '12px 14px',
            color: '#b45309',
            fontSize: '12px',
            lineHeight: 1.5,
            marginTop: '8px'
          }}>
            <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Clinical Notice:</strong> Consultations are intended to complement local clinical care. In case of emergency (peeling skin, high fever), go directly to the nearest medical center.
            </span>
          </div>
        </div>
      )}

      {/* ----------------- STEP 1: CONFIRM SCAN TO SHARE ----------------- */}
      {bookingStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={resetFlow} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#6b7280' }}>
              <ArrowLeft size={20} />
            </button>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0d6b5e' }}>
              {isQueueFlow ? 'Submit to Queue' : `Booking with ${selectedSpecialist?.name}`}
            </span>
          </div>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>Share Your Scan</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              Allowing the specialist to review your scan details yields higher clinical accuracy.
            </p>
          </div>

          {/* Scan Thumbnail Card */}
          {latestScan ? (
            <Card
              variant="default"
              padding="md"
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1.5px solid rgba(13, 107, 94, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '10px'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '12px', overflow: 'hidden', background: '#E5E7EB', flexShrink: 0 }}>
                  <img
                    src={latestScan.imageUrl.startsWith('http') ? latestScan.imageUrl : `http://${window.location.hostname}:8000${latestScan.imageUrl}`}
                    alt={latestScan.condition.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: '0 0 2px 0' }}>
                    {latestScan.condition.name}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#0d6b5e', fontWeight: 700, display: 'block' }}>
                    {latestScan.confidence}% Match confidence
                  </span>
                  <span style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginTop: '2px' }}>
                    Scanned on {new Date(latestScan.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                backgroundColor: 'rgba(13, 107, 94, 0.05)',
                borderRadius: '10px',
                color: '#0d6b5e',
                fontSize: '12px',
                fontWeight: 600
              }}>
                <Check size={14} style={{ flexShrink: 0 }} />
                <span>Biomarkers, symptoms description, and AI match tags will be shared.</span>
              </div>
            </Card>
          ) : (
            <Card
              variant="default"
              padding="lg"
              style={{
                textAlign: 'center',
                border: '1.5px dashed rgba(13, 107, 94, 0.15)',
                borderRadius: '16px'
              }}
            >
              <Users size={32} style={{ margin: '0 auto 12px auto', color: '#6b7280', opacity: 0.5 }} />
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>No skin scans found on this profile.</p>
            </Card>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', paddingBottom: '20px' }}>
            <Button
              fullWidth
              onClick={() => {
                setShareLatestScan(true);
                if (isQueueFlow) {
                  handleSubmitQueue();
                } else {
                  setBookingStep(2); // Go to date selection
                }
              }}
              style={{ minHeight: '48px' }}
            >
              {isQueueFlow ? 'Submit Scan to Queue' : `Share Scan with ${selectedSpecialist?.name.split(' ')[1]}`}
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShareLatestScan(false);
                if (isQueueFlow) {
                  resetFlow();
                } else {
                  // No, start fresh scan
                  navigate('/scan/new');
                }
              }}
              style={{ minHeight: '48px' }}
            >
              {isQueueFlow ? 'Cancel' : 'No, Start Fresh Scan'}
            </Button>
          </div>
        </div>
      )}

      {/* ----------------- STEP 2: CHOOSE TIME ----------------- */}
      {bookingStep === 2 && selectedSpecialist && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setBookingStep(latestScan ? 1 : 0)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#6b7280' }}>
              <ArrowLeft size={20} />
            </button>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0d6b5e' }}>Choose Schedule</span>
          </div>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>Select Date & Time</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Choose your preferred teledermatology slot.</p>
          </div>

          {/* Minimal Calendar Picker Grid */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              Available Dates
            </span>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }} className="scrollbar-hide">
              {calendarDays.map((day) => {
                const isSelected = selectedDate === day.fullDate;
                return (
                  <button
                    key={day.fullDate}
                    type="button"
                    onClick={() => setSelectedDate(day.fullDate)}
                    style={{
                      flexShrink: 0,
                      width: '56px',
                      padding: '12px 6px',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? '#0d6b5e' : 'transparent'}`,
                      backgroundColor: isSelected ? '#0d6b5e' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#374151',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: 600, opacity: isSelected ? 0.9 : 0.6 }}>{day.dayName}</span>
                    <span style={{ fontSize: '15px', fontWeight: 800 }}>{day.dayNum}</span>
                    <span style={{ fontSize: '9px', fontWeight: 600, opacity: isSelected ? 0.9 : 0.6 }}>{day.month}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Grid */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
              Available Time Slots
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    style={{
                      padding: '12px 0',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? '#0d6b5e' : 'transparent'}`,
                      backgroundColor: isSelected ? 'rgba(13, 107, 94, 0.08)' : '#ffffff',
                      color: '#0d6b5e',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      textAlign: 'center',
                      transition: 'all 0.15s'
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next CTA */}
          <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
            <Button
              fullWidth
              disabled={!selectedDate || !selectedTime}
              onClick={() => setBookingStep(3)}
              style={{ minHeight: '48px' }}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      )}

      {/* ----------------- STEP 3: CONFIRM + PAY ----------------- */}
      {bookingStep === 3 && selectedSpecialist && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setBookingStep(2)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#6b7280' }}>
              <ArrowLeft size={20} />
            </button>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0d6b5e' }}>Confirm & Pay</span>
          </div>

          {/* Booking Summary Card */}
          <Card
            variant="default"
            padding="md"
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1.5px solid rgba(13, 107, 94, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Booking Details</span>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f9f5ef', border: '1px solid rgba(13, 107, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                {selectedSpecialist.avatar}
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: 0 }}>{selectedSpecialist.name}</h4>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{selectedSpecialist.role}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(13, 107, 94, 0.05)', paddingTop: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                <Calendar size={14} style={{ color: '#0d6b5e' }} />
                <span>
                  {new Date(selectedDate).toLocaleDateString('en-NG', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                <Clock size={14} style={{ color: '#0d6b5e' }} />
                <span>{selectedTime}</span>
              </div>
              {shareLatestScan && latestScan && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                  <Sparkles size={14} style={{ color: '#0d6b5e' }} />
                  <span>Sharing latest diagnostic scan: {latestScan.condition.name}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(13, 107, 94, 0.05)', paddingTop: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151' }}>Consultation Fee</span>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#0d6b5e' }}>₦{selectedSpecialist.fee.toLocaleString()}</span>
            </div>
          </Card>

          {/* Paystack / Flutterwave simulated panel */}
          <Card
            variant="default"
            padding="md"
            style={{
              background: '#f9f5ef',
              border: '1px solid rgba(13, 107, 94, 0.1)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0d6b5e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Lock size={12} />
                SECURED BY PAYSTACK
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {/* Simulated payment badges */}
                <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', background: '#ffffff', borderRadius: '4px', border: '1px solid #e5e7eb', color: '#6b7280' }}>Visa</span>
                <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', background: '#ffffff', borderRadius: '4px', border: '1px solid #e5e7eb', color: '#6b7280' }}>Mastercard</span>
                <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', background: '#ffffff', borderRadius: '4px', border: '1px solid #e5e7eb', color: '#6b7280' }}>Verve</span>
              </div>
            </div>

            {/* Input Card Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280' }}>Card Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: '10px', border: '1px solid rgba(13, 107, 94, 0.15)', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                  />
                  <CreditCard size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: '#0d6b5e' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280' }}>Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(13, 107, 94, 0.15)', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280' }}>CVV</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    maxLength={3}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(13, 107, 94, 0.15)', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Confirm Button */}
          <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
            <Button
              fullWidth
              isLoading={isPaying}
              onClick={handlePayAndConfirm}
              style={{ minHeight: '48px' }}
            >
              Confirm Booking (₦{selectedSpecialist.fee.toLocaleString()})
            </Button>
          </div>
        </div>
      )}

      {/* ----------------- STEP 4: SUCCESS CONFIRMATION ----------------- */}
      {bookingStep === 4 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 0', animation: 'fadeIn 0.4s ease-out' }}>
          
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#e6f6ee',
            color: '#4caf87',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <Check size={36} strokeWidth={3} />
          </div>

          {queueSuccess ? (
            /* Queue submission success template */
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0' }}>
                Added to Volunteer Queue
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 32px 0', lineHeight: 1.6 }}>
                Your scan has been successfully submitted to our volunteer dermatologist queue. You will receive an email and in-app notification once a dermatologist posts their clinical notes (typically within 48 hours).
              </p>
            </>
          ) : (
            /* Regular consultation success template */
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0' }}>
                Consultation Booked!
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0', lineHeight: 1.6 }}>
                Your appointment with <strong>{selectedSpecialist?.name}</strong> is confirmed. A confirmation event has been added to your skin journal.
              </p>

              {/* Secure Link Details Card */}
              <Card
                variant="default"
                padding="md"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(13, 107, 94, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: '100%',
                  marginBottom: '32px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280', fontWeight: 700 }}>
                  <Calendar size={14} style={{ color: '#0d6b5e' }} />
                  <span>
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) : ''} at {selectedTime}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid rgba(13, 107, 94, 0.05)', paddingTop: '8px' }}>
                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700 }}>TELEDERMATOLOGY MEETING LINK</label>
                  <a
                    href="https://meet.google.com/abc-defg-hij"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '13px', color: '#0d6b5e', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    meet.google.com/abc-defg-hij
                  </a>
                </div>
              </Card>
            </>
          )}

          <Button
            fullWidth
            onClick={resetFlow}
            style={{ minHeight: '48px', marginTop: 'auto' }}
          >
            Done
          </Button>
        </div>
      )}

    </div>
  );
}

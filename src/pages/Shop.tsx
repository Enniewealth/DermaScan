import { useState } from 'react';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, MapPin, CreditCard } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  category: 'treatment' | 'moisturizer' | 'sunscreen';
  description: string;
  imageUrl: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Generic Hydrocortisone 1% Cream',
    price: 1200,
    priceFormatted: '₦1,200',
    category: 'treatment',
    description: 'Mild topical steroid to reduce inflammation, redness, and itching from eczema flares.',
    imageUrl: '/products/hydrocortisone.png'
  },
  {
    id: 'prod_2',
    name: 'Benzoyl Peroxide 5% Gel',
    price: 1800,
    priceFormatted: '₦1,800',
    category: 'treatment',
    description: 'Antimicrobial acne gel that targets P. acnes bacteria and clears pores.',
    imageUrl: '/products/benzoyl.png'
  },
  {
    id: 'prod_3',
    name: 'Ceramide Skin Barrier Repair Cream',
    price: 6500,
    priceFormatted: '₦6,500',
    category: 'moisturizer',
    description: 'Advanced lipid-restoration moisturizer. Fragrance-free and hypoallergenic.',
    imageUrl: '/products/ceramide.png'
  },
  {
    id: 'prod_4',
    name: 'Differin Gel (Adapalene 0.1%)',
    price: 5200,
    priceFormatted: '₦5,200',
    category: 'treatment',
    description: 'Clinical strength topical retinoid to regulate cell turnover and prevent breakouts.',
    imageUrl: '/products/differin.png'
  },
  {
    id: 'prod_5',
    name: 'Physical Mineral Sunscreen SPF 50',
    price: 4000,
    priceFormatted: '₦4,000',
    category: 'sunscreen',
    description: 'Broad-spectrum physical block, ideal for eczema-prone or hyperpigmentation-sensitive skin.',
    imageUrl: '/products/sunscreen.png'
  },
  {
    id: 'prod_6',
    name: 'Betnovate-N Cream',
    price: 3500,
    priceFormatted: '₦3,500',
    category: 'treatment',
    description: 'Medium strength steroid with neomycin antibiotic to combat infected eczema patch areas.',
    imageUrl: '/products/betnovate.png'
  }
];

export default function Shop() {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  
  // Checkout Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('Lagos');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [formError, setFormError] = useState('');

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotalFormatted = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(cartTotal);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setFormError('Please fill in all shipping details.');
      return;
    }
    setFormError('');
    setCheckoutSuccess(true);
    setCart([]);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px 80px 16px', boxSizing: 'border-box', fontFamily: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: 0 }}>Medication & Care Shop</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px', margin: 0 }}>Clinical skincare and recommended prescriptions with local delivery</p>
      </div>

      {checkoutSuccess ? (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '40px 24px',
          textAlign: 'center',
          border: '1px solid rgba(13, 107, 94, 0.05)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          animation: 'fadeIn 0.4s ease-out'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#E6F4F4',
            color: '#0d6b5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}>
            <ShieldCheck size={36} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' }}>Order Placed Successfully!</h2>
          <p style={{ fontSize: '15px', color: '#4B5563', margin: '0 0 24px 0', lineHeight: 1.6 }}>
            Thank you for shopping on DermaScan. Your prescription has been sent to our verified partner pharmacy. Deliveries to <strong>{address}, {state}</strong> will arrive in 1-3 business days.
          </p>
          <button
            onClick={() => {
              setCheckoutSuccess(false);
              setIsCheckout(false);
              setFullName('');
              setPhone('');
              setAddress('');
            }}
            style={{
              background: '#0d6b5e',
              color: '#ffffff',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Browse More Products
          </button>
        </div>
      ) : isCheckout ? (
        /* CHECKOUT FORM VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(13, 107, 94, 0.05)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: '0 0 20px 0' }}>Shipping & Checkout</h3>
            
            <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(13, 107, 94, 0.15)',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 08012345678"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(13, 107, 94, 0.15)',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(13, 107, 94, 0.15)',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja (FCT)</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Enugu">Enugu</option>
                    <option value="Kaduna">Kaduna</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Delivery Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, estate, apartment number"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(13, 107, 94, 0.15)',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Payment Method
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: `2px solid ${paymentMethod === 'cod' ? '#0d6b5e' : 'rgba(0,0,0,0.06)'}`,
                      background: paymentMethod === 'cod' ? 'rgba(13, 107, 94, 0.05)' : '#ffffff',
                      color: paymentMethod === 'cod' ? '#0d6b5e' : '#4B5563',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <MapPin size={16} />
                    Cash on Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: `2px solid ${paymentMethod === 'card' ? '#0d6b5e' : 'rgba(0,0,0,0.06)'}`,
                      background: paymentMethod === 'card' ? 'rgba(13, 107, 94, 0.05)' : '#ffffff',
                      color: paymentMethod === 'card' ? '#0d6b5e' : '#4B5563',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <CreditCard size={16} />
                    Pay Instantly (Simulation)
                  </button>
                </div>
              </div>

              {formError && (
                <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 500 }}>
                  {formError}
                </span>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsCheckout(false)}
                  style={{
                    flex: 1,
                    background: '#F3F4F6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '14px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    background: '#0d6b5e',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '14px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  Confirm Order ({cartTotalFormatted})
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* PRODUCTS & CART GRID */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          
          {/* Main Products Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
            {PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid rgba(13, 107, 94, 0.05)',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  position: 'relative'
                }}
                className="hover-card"
              >
                {/* Image Placeholder Symbol */}
                <div style={{
                  height: '110px',
                  borderRadius: '14px',
                  background: '#f9f5ef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: '8px',
                  boxSizing: 'border-box'
                }}>
                  <img 
                    src={prod.imageUrl} 
                    alt={prod.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>

                <div>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#0d6b5e',
                    background: 'rgba(13, 107, 94, 0.08)',
                    padding: '2px 6px',
                    borderRadius: '5px',
                    display: 'inline-block',
                    marginBottom: '6px'
                  }}>
                    {prod.category}
                  </span>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0, height: '40px', overflow: 'hidden', lineClamp: 2 }}>
                    {prod.name}
                  </h3>
                  <p style={{ fontSize: '11px', color: '#6B7280', margin: '4px 0 0 0', height: '32px', overflow: 'hidden', lineClamp: 2 }}>
                    {prod.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0d6b5e' }}>{prod.priceFormatted}</span>
                  <button
                    onClick={() => handleAddToCart(prod)}
                    style={{
                      background: 'rgba(13, 107, 94, 0.08)',
                      color: '#0d6b5e',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Section (Sticky Bottom/Side Drawer) */}
          {cart.length > 0 && (
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(13, 107, 94, 0.08)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              position: 'sticky',
              bottom: '72px',
              zIndex: 30,
              animation: 'slideUp 0.3s ease-out'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart size={18} style={{ color: '#0d6b5e' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Shopping Cart ({cart.length})</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0d6b5e' }}>Total: {cartTotalFormatted}</span>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto', marginBottom: '14px', paddingRight: '4px' }}>
                {cart.map((item) => (
                  <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(13, 107, 94, 0.03)', border: '1px solid rgba(13, 107, 94, 0.05)', padding: '8px 12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '13px', color: '#374151' }}>
                      <strong>{item.product.name}</strong> <span style={{ color: '#6B7280', fontSize: '11px' }}>x{item.quantity}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>
                        {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsCheckout(true)}
                style={{
                  width: '100%',
                  background: '#0d6b5e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Proceed to Checkout ({cartTotalFormatted})
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

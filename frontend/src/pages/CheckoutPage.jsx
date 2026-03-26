import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Icon from '../components/ui/Icon'
import { useCartStore } from '../store/cartStore'
import { validateCoupon, placeOrder, getEggClubStatus } from '../api/orderApi'
import { useWindowSize } from '../hooks/useWindowSize'

// ─── Design tokens (match existing app) ───────────────────────────────────────
const C = {
  blue: 'var(--french-blue)',
  blueDark: 'var(--imperial-blue)',
  bg: '#f7f9fc',
  card: '#ffffff',
  border: 'rgba(0,41,107,0.12)',
  text: '#111827',
  muted: '#6b7280',
  yellow: 'rgba(253,197,0,0.18)',
  yellowBorder: 'rgba(253,197,0,0.6)',
  green: '#059669',
  greenBg: 'rgba(5,150,105,0.08)',
  red: '#dc2626',
  redBg: 'rgba(220,38,38,0.08)',
}

const card = {
  backgroundColor: C.card,
  borderRadius: '16px',
  padding: '28px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.09)',
  border: `1px solid ${C.border}`,
  marginBottom: '24px',
}

const sectionTitle = {
  margin: '0 0 20px 0',
  fontSize: '18px',
  fontWeight: 700,
  color: C.text,
  paddingBottom: '14px',
  borderBottom: `2px solid #f3f4f6`,
}

const fieldLabel = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: C.muted,
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

const input = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: `1px solid #e5e7eb`,
  fontSize: '15px',
  color: C.text,
  backgroundColor: '#fafafa',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const radioCard = (selected) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px',
  borderRadius: '12px',
  border: `2px solid ${selected ? C.blue : '#e5e7eb'}`,
  backgroundColor: selected ? 'rgba(0,80,157,0.06)' : C.card,
  cursor: 'pointer',
  transition: 'all 0.18s',
  flex: 1,
})

const primaryBtn = (disabled) => ({
  width: '100%',
  padding: '16px',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: disabled ? '#9ca3af' : C.blue,
  color: '#fff',
  fontSize: '16px',
  fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.2s',
  boxShadow: disabled ? 'none' : '0 2px 6px rgba(0,41,107,0.22)',
})

// ─── Component ────────────────────────────────────────────────────────────────

function CheckoutPage() {
  const navigate = useNavigate()
  const { width } = useWindowSize()
  const isMobile = width < 1024

  // Cart state from store (already loaded by CartPage)
  const { cartItems, totalPrice, clearCart } = useCartStore()

  // Delivery details
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [deliveryType, setDeliveryType] = useState('standard')
  const [scheduledTime, setScheduledTime] = useState('')

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('cod')

  // Coupon
  const [couponCode, setCouponCode] = useState('')
  const [couponResult, setCouponResult] = useState(null) // { valid, discount_amount, message }
  const [couponLoading, setCouponLoading] = useState(false)

  // EggClub
  const [eggclub, setEggclub] = useState({ is_member: false, free_deliveries_left: 0 })
  const [useFreeDelivery, setUseFreeDelivery] = useState(false)

  // Placing
  const [placing, setPlacing] = useState(false)

  // ── Fetch EggClub status on mount ──
  useEffect(() => {
    getEggClubStatus()
      .then((res) => setEggclub(res.data))
      .catch(() => {}) // silently ignore – not critical
  }, [])

  // Redirect away if cart is somehow empty
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cartItems, navigate])

  // ── Derived totals ──
  const subtotal = Number(totalPrice) || 0
  const discountAmount = couponResult?.valid ? couponResult.discount_amount : 0
  const isAutoFreeDelivery = subtotal >= 500
  const hasFreeDelivery = isAutoFreeDelivery || (useFreeDelivery && eggclub.free_deliveries_left > 0)
  const deliveryCharge = hasFreeDelivery ? 0 : 50
  const grandTotal = subtotal - discountAmount + deliveryCharge

  // ── Coupon validation ──
  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponResult(null)
    try {
      const res = await validateCoupon(couponCode.trim(), subtotal)
      setCouponResult(res.data)
      if (res.data.valid) {
        toast.success(res.data.message)
      } else {
        toast.error(res.data.message)
      }
    } catch {
      toast.error('Failed to validate coupon.')
    } finally {
      setCouponLoading(false)
    }
  }

  // ── Place order ──
  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error('Please enter a delivery address.')
      return
    }
    setPlacing(true)
    try {
      const payload = {
        delivery_address: address.trim(),
        delivery_city: city.trim() || undefined,
        delivery_time: deliveryType === 'scheduled' && scheduledTime ? scheduledTime : undefined,
        delivery_type: deliveryType,
        payment_method: paymentMethod,
        coupon_code: couponResult?.valid ? couponCode.trim() : undefined,
        use_free_delivery: useFreeDelivery && !isAutoFreeDelivery,
      }
      const res = await placeOrder(payload)
      clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate('/order-success', { state: { order: res.data } })
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to place order. Please try again.'
      toast.error(msg)
    } finally {
      setPlacing(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', backgroundColor: C.bg }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', color: C.muted }}>
          <span style={{ color: C.blue, cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
          <Icon name="chevron_right" size={16} />
          <span style={{ color: C.blue, cursor: 'pointer' }} onClick={() => navigate('/cart')}>Cart</span>
          <Icon name="chevron_right" size={16} />
          <span>Checkout</span>
        </div>

        <h1 style={{ margin: '0 0 32px 0', fontSize: '30px', fontWeight: 800, color: C.text }}>Checkout</h1>

        <div style={{ display: 'flex', gap: '32px', flexDirection: isMobile ? 'column' : 'row', alignItems: 'start' }}>

          {/* ── LEFT: forms ── */}
          <div style={{ flex: 2, minWidth: 0 }}>

            {/* Delivery Details */}
            <div style={card}>
              <h2 style={sectionTitle}>📦 Delivery Details</h2>

              <div style={{ marginBottom: '18px' }}>
                <label style={fieldLabel}>Delivery Address *</label>
                <textarea
                  style={{ ...input, minHeight: '80px', resize: 'vertical' }}
                  placeholder="House/flat no., road, area…"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = C.blue }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={fieldLabel}>City</label>
                <input
                  style={input}
                  placeholder="Dhaka"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = C.blue }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
                />
              </div>

              {/* Delivery type */}
              <label style={fieldLabel}>Delivery Type</label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: deliveryType === 'scheduled' ? '16px' : 0 }}>
                {[['standard', '⚡ Standard'], ['scheduled', '🗓️ Scheduled']].map(([val, label]) => (
                  <div key={val} style={radioCard(deliveryType === val)} onClick={() => setDeliveryType(val)}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      border: `2px solid ${deliveryType === val ? C.blue : '#d1d5db'}`,
                      backgroundColor: deliveryType === val ? C.blue : 'transparent',
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>{label}</span>
                  </div>
                ))}
              </div>

              {deliveryType === 'scheduled' && (
                <div style={{ marginTop: '16px' }}>
                  <label style={fieldLabel}>Preferred Delivery Time</label>
                  <input
                    type="datetime-local"
                    style={input}
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    onFocus={(e) => { e.target.style.borderColor = C.blue }}
                    onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
                  />
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div style={card}>
              <h2 style={sectionTitle}>💳 Payment Method</h2>
              <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
                {[
                  ['cod', '🏠 Cash on Delivery', 'Pay when your order arrives'],
                  ['online', '💳 Online Payment', 'Pay now via card / mobile banking'],
                ].map(([val, label, sub]) => (
                  <div key={val} style={{ ...radioCard(paymentMethod === val), flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}
                    onClick={() => setPaymentMethod(val)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        border: `2px solid ${paymentMethod === val ? C.blue : '#d1d5db'}`,
                        backgroundColor: paymentMethod === val ? C.blue : 'transparent',
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: '15px', fontWeight: 700, color: C.text }}>{label}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: C.muted, paddingLeft: '28px' }}>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div style={card}>
              <h2 style={sectionTitle}>🏷️ Coupon Code</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  style={{ ...input, flex: 1 }}
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value); setCouponResult(null) }}
                  onFocus={(e) => { e.target.style.borderColor = C.blue }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
                  onKeyDown={(e) => e.key === 'Enter' && handleValidateCoupon()}
                />
                <button
                  type="button"
                  onClick={handleValidateCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  style={{
                    padding: '12px 20px', borderRadius: '10px', border: 'none',
                    backgroundColor: couponLoading || !couponCode.trim() ? '#e5e7eb' : C.blue,
                    color: couponLoading || !couponCode.trim() ? C.muted : '#fff',
                    fontWeight: 700, fontSize: '14px', cursor: couponLoading || !couponCode.trim() ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {couponLoading ? 'Checking…' : 'Apply'}
                </button>
              </div>

              {couponResult && (
                <div style={{
                  marginTop: '12px', padding: '12px 14px', borderRadius: '10px',
                  backgroundColor: couponResult.valid ? C.greenBg : C.redBg,
                  border: `1px solid ${couponResult.valid ? C.green : C.red}30`,
                  fontSize: '14px', color: couponResult.valid ? C.green : C.red, fontWeight: 600,
                }}>
                  {couponResult.valid
                    ? `✅ ${couponResult.message} — You save ৳${couponResult.discount_amount}`
                    : `❌ ${couponResult.message}`}
                </div>
              )}
            </div>

            {/* EggClub */}
            {eggclub.is_member && eggclub.free_deliveries_left > 0 && !isAutoFreeDelivery && (
              <div style={{ ...card, backgroundColor: C.yellow, border: `1px solid ${C.yellowBorder}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon name="featured_seasonal_and_gifts" size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: C.text, fontSize: '15px' }}>🥚 EggClub Membership</div>
                    <div style={{ fontSize: '13px', color: C.muted, marginTop: '2px' }}>
                      You have <strong>{eggclub.free_deliveries_left}</strong> free {eggclub.free_deliveries_left === 1 ? 'delivery' : 'deliveries'} left
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                      padding: '8px 14px', borderRadius: '8px',
                      backgroundColor: useFreeDelivery ? C.blue : 'rgba(0,0,0,0.06)',
                      color: useFreeDelivery ? '#fff' : C.text,
                      fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
                    }}
                    onClick={() => setUseFreeDelivery((v) => !v)}
                  >
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '4px',
                      border: `2px solid ${useFreeDelivery ? '#fff' : '#9ca3af'}`,
                      backgroundColor: useFreeDelivery ? '#fff' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {useFreeDelivery && <span style={{ color: C.blue, fontSize: '11px', fontWeight: 900 }}>✓</span>}
                    </div>
                    Use free delivery
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: order summary ── */}
          <div style={{
            flex: 1, maxWidth: isMobile ? '100%' : '380px', width: isMobile ? '100%' : 'auto',
            position: isMobile ? 'static' : 'sticky', top: '96px',
          }}>
            <div style={{ ...card, marginBottom: 0 }}>
              <h2 style={sectionTitle}>🧾 Order Summary</h2>

              {/* Items */}
              <div style={{ marginBottom: '16px' }}>
                {cartItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: C.text, marginBottom: '8px' }}>
                    <span style={{ color: C.muted }}>
                      {item.product_name} × {item.quantity}
                    </span>
                    <span style={{ fontWeight: 600 }}>৳{(item.unit_price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                {[
                  ['Subtotal', `৳${subtotal.toFixed(2)}`],
                  discountAmount > 0 && ['Coupon Discount', `−৳${discountAmount.toFixed(2)}`, C.green],
                  ['Delivery', hasFreeDelivery ? 'FREE 🎉' : `৳${deliveryCharge}`, hasFreeDelivery ? C.green : undefined],
                ].filter(Boolean).map(([label, value, color], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: C.text, marginBottom: '10px' }}>
                    <span style={{ color: C.muted }}>{label}</span>
                    <span style={{ fontWeight: 600, color: color || C.text }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between',
                borderTop: '2px solid #f3f4f6', paddingTop: '16px', marginTop: '4px',
                fontSize: '22px', fontWeight: 800, color: C.text,
              }}>
                <span>Total</span>
                <span>৳{grandTotal.toFixed(2)}</span>
              </div>

              {/* Free delivery badge */}
              {isAutoFreeDelivery && (
                <div style={{ marginTop: '12px', padding: '10px 14px', backgroundColor: C.yellow, borderRadius: '8px', fontSize: '13px', color: '#92400e', fontWeight: 600 }}>
                  🎁 Free delivery applied — order over ৳500!
                </div>
              )}

              <button
                type="button"
                style={{ ...primaryBtn(placing || !address.trim()), marginTop: '20px' }}
                disabled={placing || !address.trim()}
                onClick={handlePlaceOrder}
                onMouseEnter={(e) => {
                  if (!placing && address.trim()) {
                    e.currentTarget.style.backgroundColor = C.blueDark
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!placing && address.trim()) {
                    e.currentTarget.style.backgroundColor = C.blue
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                {placing ? 'Placing Order…' : paymentMethod === 'cod' ? '✅ Place Order (COD)' : '💳 Place Order & Pay'}
              </button>

              <button
                type="button"
                style={{
                  width: '100%', marginTop: '12px', padding: '12px', borderRadius: '12px',
                  border: `1px solid ${C.border}`, backgroundColor: 'transparent',
                  color: C.muted, fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                }}
                onClick={() => navigate('/cart')}
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

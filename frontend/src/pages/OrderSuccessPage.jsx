import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'

function OrderSuccessPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const order = state?.order

  const btn = {
    padding: '14px 28px', borderRadius: '12px', border: 'none',
    backgroundColor: 'var(--french-blue)', color: '#fff',
    fontSize: '15px', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,41,107,0.22)', transition: 'all 0.2s',
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', backgroundColor: '#f7f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '480px', width: '100%', backgroundColor: '#fff', borderRadius: '20px', padding: '48px 36px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.09)', border: '1px solid rgba(0,41,107,0.1)' }}>

        <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 800, color: '#111827' }}>Order Placed!</h1>
        <p style={{ color: '#6b7280', fontSize: '15px', margin: '0 0 28px 0' }}>
          Thanks for shopping with us. Your order is confirmed and being processed.
        </p>

        {order && (
          <div style={{ backgroundColor: '#f7f9fc', borderRadius: '12px', padding: '20px', textAlign: 'left', marginBottom: '28px', border: '1px solid rgba(0,41,107,0.1)' }}>
            {[
              ['Order ID', `#${order.id}`],
              ['Total', `৳${Number(order.total_amount).toFixed(2)}`],
              ['Payment', order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'],
              ['Status', order.status.charAt(0).toUpperCase() + order.status.slice(1)],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#374151', marginBottom: '10px' }}>
                <span style={{ color: '#6b7280' }}>{label}</span>
                <span style={{ fontWeight: 700 }}>{val}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button type="button" style={btn} onClick={() => navigate('/')}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--imperial-blue)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--french-blue)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage

import { useWindowSize } from '../hooks/useWindowSize'
import { useCartStore } from '../store/cartStore'

const styles = {
  modal: {
    width: '420px',
    height: 'calc(100vh - 72px)',
    position: 'sticky',
    top: '72px',
    backgroundColor: '#ffffff',
    borderLeft: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.05)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#fafafa',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
  },
  closeButton: {
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsSection: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  emptyText: {
    margin: 0,
    color: '#9ca3af',
    fontSize: '15px',
  },
  itemCard: {
    backgroundColor: '#fafafa',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    transition: 'all 0.2s ease',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px',
  },
  itemInfo: {
    flex: 1,
  },
  productName: {
    margin: '0 0 8px 0',
    fontSize: '15px',
    fontWeight: 600,
    color: '#111827',
    lineHeight: 1.4,
  },
  itemMeta: {
    margin: '4px 0',
    fontSize: '13px',
    color: '#6b7280',
  },
  itemMetaHighlight: {
    fontWeight: 600,
    color: '#10b981',
  },
  removeButton: {
    width: '28px',
    height: '28px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: '20px 24px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#fafafa',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#6b7280',
  },
  totalAmount: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#111827',
  },
  checkoutButton: {
    width: '100%',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
  },
}

function CartModal({ isOpen, onClose, cartItems, totalPrice, onRemoveItem, onCheckout }) {
  const { width } = useWindowSize()
  const isMobile = width < 1024

  if (!isOpen) return null

  if (isMobile) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'flex-end',
        }}
        onClick={onClose}
      >
        <div
          style={{
            width: '100%',
            maxHeight: '80vh',
            backgroundColor: '#ffffff',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideUp 0.3s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <style>
            {`
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
            `}
          </style>
          <div style={styles.header}>
            <h2 style={styles.title}>Your Cart ({cartItems.length})</h2>
            <button
              type="button"
              style={styles.closeButton}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }}
            >
              ×
            </button>
          </div>

          <div style={styles.itemsSection}>
            {!cartItems || cartItems.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🛒</div>
                <p style={styles.emptyText}>Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  style={styles.itemCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6'
                    e.currentTarget.style.borderColor = '#d1d5db'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fafafa'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                  }}
                >
                  <div style={styles.itemRow}>
                    <div style={styles.itemInfo}>
                      <h3 style={styles.productName}>{item.product_name}</h3>
                      <p style={styles.itemMeta}>
                        Quantity: <span style={styles.itemMetaHighlight}>{item.quantity}</span>
                      </p>
                      <p style={styles.itemMeta}>৳{item.unit_price} × {item.quantity}</p>
                    </div>
                    <button
                      type="button"
                      style={styles.removeButton}
                      onClick={() => onRemoveItem(item.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fecaca'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <p style={{ ...styles.itemMeta, ...styles.itemMetaHighlight, fontSize: '15px', marginTop: '8px' }}>
                    Subtotal: ৳{item.subtotal}
                  </p>
                </div>
              ))
            )}
          </div>

          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalAmount}>৳{totalPrice}</span>
            </div>
            <button
              type="button"
              style={styles.checkoutButton}
              onClick={onCheckout}
              disabled={!cartItems || cartItems.length === 0}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)'
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <aside style={styles.modal}>
      <div style={styles.header}>
        <h2 style={styles.title}>Your Cart ({cartItems.length})</h2>
        <button
          type="button"
          style={styles.closeButton}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
          }}
        >
          ×
        </button>
      </div>

      <div style={styles.itemsSection}>
        {!cartItems || cartItems.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🛒</div>
            <p style={styles.emptyText}>Your cart is empty</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              style={styles.itemCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
                e.currentTarget.style.borderColor = '#d1d5db'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <div style={styles.itemRow}>
                <div style={styles.itemInfo}>
                  <h3 style={styles.productName}>{item.product_name}</h3>
                  <p style={styles.itemMeta}>
                    Quantity: <span style={styles.itemMetaHighlight}>{item.quantity}</span>
                  </p>
                  <p style={styles.itemMeta}>৳{item.unit_price} × {item.quantity}</p>
                </div>
                <button
                  type="button"
                  style={styles.removeButton}
                  onClick={() => onRemoveItem(item.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fecaca'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2'
                  }}
                >
                  ×
                </button>
              </div>
              <p style={{ ...styles.itemMeta, ...styles.itemMetaHighlight, fontSize: '15px', marginTop: '8px' }}>
                Subtotal: ৳{item.subtotal}
              </p>
            </div>
          ))
        )}
      </div>

      <div style={styles.footer}>
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total</span>
          <span style={styles.totalAmount}>৳{totalPrice}</span>
        </div>
        <button
          type="button"
          style={styles.checkoutButton}
          onClick={onCheckout}
          disabled={!cartItems || cartItems.length === 0}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)'
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </aside>
  )
}

export default CartModal
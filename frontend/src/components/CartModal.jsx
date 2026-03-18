import { useWindowSize } from '../hooks/useWindowSize'
import Icon from './ui/Icon'

const styles = {
  modal: {
    width: '248px',
    height: 'calc(100vh - 68px)',
    position: 'sticky',
    top: '68px',
    backgroundColor: '#ffffff',
    borderLeft: '1px solid rgba(0, 41, 107, 0.16)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.05)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 20px',
    borderBottom: '1px solid rgba(0, 41, 107, 0.12)',
    backgroundColor: 'rgba(0, 80, 157, 0.08)',
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
    backgroundColor: '#ffffff',
    color: 'var(--imperial-blue)',
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
    padding: '14px',
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
    backgroundColor: '#ffffff',
    border: '1px solid rgba(0, 41, 107, 0.12)',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '10px',
    transition: 'all 0.2s ease',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '8px',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    margin: '0 0 6px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: '#111827',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemMeta: {
    margin: '4px 0',
    fontSize: '12px',
    color: '#6b7280',
  },
  itemMetaHighlight: {
    fontWeight: 600,
    color: 'var(--steel-azure)',
  },
  removeButton: {
    width: '24px',
    height: '24px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'rgba(0, 80, 157, 0.12)',
    color: 'var(--imperial-blue)',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '6px',
  },
  quantityButton: {
    width: '24px',
    height: '24px',
    border: '1px solid rgba(0, 41, 107, 0.2)',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: 'var(--imperial-blue)',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  quantityText: {
    fontSize: '12px',
    color: '#6b7280',
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid rgba(0, 41, 107, 0.12)',
    backgroundColor: '#ffffff',
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
    backgroundColor: 'var(--french-blue)',
    color: '#ffffff',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(0, 41, 107, 0.22)',
  },
}

function CartModal({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  onRemoveItem,
  onIncreaseItem,
  onDecreaseItem,
  updatingItemId,
  onCheckout,
}) {
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
                e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
              }}
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          <div style={styles.itemsSection}>
            {!cartItems || cartItems.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}><Icon name="shopping_cart" size={44} /></div>
                <p style={styles.emptyText}>Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  style={styles.itemCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.08)'
                    e.currentTarget.style.borderColor = 'rgba(0, 41, 107, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff'
                    e.currentTarget.style.borderColor = 'rgba(0, 41, 107, 0.12)'
                  }}
                >
                  <div style={styles.itemRow}>
                    <div style={styles.itemInfo}>
                      <h3 style={styles.productName}>{item.product_name}</h3>
                      <div style={styles.quantityControls}>
                        <button
                          type="button"
                          style={styles.quantityButton}
                          disabled={updatingItemId === item.id}
                          onClick={() => onDecreaseItem(item.id)}
                          onMouseEnter={(e) => {
                            if (updatingItemId === item.id) return
                            e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff'
                          }}
                        >
                          −
                        </button>
                        <span style={styles.quantityText}>
                          Quantity: <span style={styles.itemMetaHighlight}>{item.quantity}</span>
                        </span>
                        <button
                          type="button"
                          style={styles.quantityButton}
                          disabled={updatingItemId === item.id}
                          onClick={() => onIncreaseItem(item.id)}
                          onMouseEnter={(e) => {
                            if (updatingItemId === item.id) return
                            e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff'
                          }}
                        >
                          +
                        </button>
                      </div>
                      <p style={styles.itemMeta}>৳{item.unit_price} × {item.quantity}</p>
                    </div>
                    <button
                      type="button"
                      style={styles.removeButton}
                      onClick={() => onRemoveItem(item.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.24)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.12)'
                      }}
                    >
                      <Icon name="close" size={14} />
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
                e.currentTarget.style.backgroundColor = 'var(--imperial-blue)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 41, 107, 0.28)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--french-blue)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 41, 107, 0.22)'
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
            e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff'
          }}
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div style={styles.itemsSection}>
        {!cartItems || cartItems.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}><Icon name="shopping_cart" size={44} /></div>
            <p style={styles.emptyText}>Your cart is empty</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              style={styles.itemCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(0, 41, 107, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
                e.currentTarget.style.borderColor = 'rgba(0, 41, 107, 0.12)'
              }}
            >
              <div style={styles.itemRow}>
                <div style={styles.itemInfo}>
                  <h3 style={styles.productName}>{item.product_name}</h3>
                  <div style={styles.quantityControls}>
                    <button
                      type="button"
                      style={styles.quantityButton}
                      disabled={updatingItemId === item.id}
                      onClick={() => onDecreaseItem(item.id)}
                      onMouseEnter={(e) => {
                        if (updatingItemId === item.id) return
                        e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff'
                      }}
                    >
                      −
                    </button>
                    <span style={styles.quantityText}>
                      Quantity: <span style={styles.itemMetaHighlight}>{item.quantity}</span>
                    </span>
                    <button
                      type="button"
                      style={styles.quantityButton}
                      disabled={updatingItemId === item.id}
                      onClick={() => onIncreaseItem(item.id)}
                      onMouseEnter={(e) => {
                        if (updatingItemId === item.id) return
                        e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff'
                      }}
                    >
                      +
                    </button>
                  </div>
                  <p style={styles.itemMeta}>৳{item.unit_price} × {item.quantity}</p>
                </div>
                <button
                  type="button"
                  style={styles.removeButton}
                  onClick={() => onRemoveItem(item.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.24)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.12)'
                  }}
                >
                  <Icon name="close" size={14} />
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
            e.currentTarget.style.backgroundColor = 'var(--imperial-blue)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 41, 107, 0.28)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--french-blue)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 41, 107, 0.22)'
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </aside>
  )
}

export default CartModal
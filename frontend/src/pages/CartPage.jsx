import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Icon from '../components/ui/Icon'

import CartItemSkeleton from '../components/CartItemSkeleton'
import { getCart, removeFromCart, updateCartItemQuantity } from '../api/cartApi'
import { useWindowSize } from '../hooks/useWindowSize'
import { useCartStore } from '../store/cartStore'

const styles = {
  page: {
    minHeight: 'calc(100vh - 72px)',
    backgroundColor: '#f7f9fc',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  pageTitle: {
    margin: '0 0 32px 0',
    fontSize: '32px',
    fontWeight: 800,
    color: '#111827',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
    fontSize: '14px',
    color: '#6b7280',
  },
  breadcrumbLink: {
    color: 'var(--french-blue)',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  layout: {
    display: 'flex',
    gap: '32px',
    alignItems: 'start',
  },
  leftColumn: {
    flex: 2,
    minWidth: 0,
  },
  rightColumn: {
    flex: 1,
    maxWidth: '400px',
    position: 'sticky',
    top: '96px',
  },
  cartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 41, 107, 0.12)',
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  itemImage: {
    width: '100px',
    height: '100px',
    borderRadius: '12px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#9ca3af',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    margin: '0 0 8px 0',
    fontSize: '17px',
    fontWeight: 700,
    color: '#111827',
  },
  unitPrice: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '12px',
  },
  quantityButton: {
    width: '36px',
    height: '36px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '18px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityDisplay: {
    minWidth: '40px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 700,
    color: '#111827',
  },
  subtotal: {
    fontSize: '18px',
    fontWeight: 800,
    color: 'var(--imperial-blue)',
    minWidth: '100px',
    textAlign: 'right',
  },
  removeButton: {
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 80, 157, 0.12)',
    color: 'var(--imperial-blue)',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 41, 107, 0.12)',
  },
  summaryTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
    paddingBottom: '16px',
    borderBottom: '2px solid #f3f4f6',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '14px',
    fontSize: '15px',
    color: '#374151',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '2px solid #f3f4f6',
    fontSize: '24px',
    fontWeight: 800,
    color: '#111827',
  },
  checkoutButton: {
    width: '100%',
    marginTop: '20px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: 'var(--french-blue)',
    color: '#ffffff',
    padding: '16px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(0, 41, 107, 0.22)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  emptyTitle: {
    margin: '0 0 12px 0',
    fontSize: '24px',
    fontWeight: 700,
    color: '#111827',
  },
  emptyText: {
    margin: '0 0 24px 0',
    color: '#6b7280',
    fontSize: '16px',
  },
  continueButton: {
    border: 'none',
    borderRadius: '12px',
    backgroundColor: 'var(--french-blue)',
    color: '#ffffff',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(0, 41, 107, 0.22)',
  },
}

function CartPage() {
  const navigate = useNavigate()
  const { width } = useWindowSize()
  const isMobile = width < 1024

  const [cart, setCartState] = useState({ items: [], total_price: 0 })
  const [loading, setLoading] = useState(true)
  const [removingItemId, setRemovingItemId] = useState(null)
  const [updatingItemId, setUpdatingItemId] = useState(null)

  const setCartStore = useCartStore((state) => state.setCart)

  const applyCartResponse = (data) => {
    setCartState(data)
    setCartStore(data)
  }

  const fetchCart = async () => {
    try {
      const response = await getCart()
      applyCartResponse(response.data)
    } catch (error) {
      toast.error('Failed to fetch cart')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    setUpdatingItemId(itemId)
    try {
      if (newQuantity <= 0) {
        const response = await removeFromCart(itemId)
        applyCartResponse(response.data)
        toast.success('Item removed')
      } else {
        const response = await updateCartItemQuantity(itemId, newQuantity)
        applyCartResponse(response.data)
        toast.success('Quantity updated')
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to update quantity')
    } finally {
      setUpdatingItemId(null)
    }
  }

  const handleRemoveItem = async (itemId) => {
    setRemovingItemId(itemId)
    try {
      const response = await removeFromCart(itemId)
      applyCartResponse(response.data)
      toast.success('Item removed')
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to remove item')
    } finally {
      setRemovingItemId(null)
    }
  }

  const handleProceedToOrder = () => {
    navigate('/checkout')
  }

  useEffect(() => {
    fetchCart()
  }, [])

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.pageTitle}>Shopping Cart</h1>
          <div style={{ ...styles.layout, flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={styles.leftColumn}>
              <div style={styles.cartCard}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <CartItemSkeleton key={index} />
                ))}
              </div>
            </div>
            <div style={styles.rightColumn}>
              <div style={styles.summaryCard}>
                <div style={{ height: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '12px' }} />
                <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '12px' }} />
                <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '20px' }} />
                <div style={{ height: '50px', backgroundColor: '#f3f4f6', borderRadius: '12px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}><Icon name="shopping_cart" size={70} /></div>
            <h2 style={styles.emptyTitle}>Your cart is empty</h2>
            <p style={styles.emptyText}>Looks like you haven't added anything to your cart yet.</p>
            <button
              type="button"
              style={styles.continueButton}
              onClick={() => navigate('/')}
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
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  const deliveryFee = 50
  const grandTotal = Number(cart.total_price || 0) + deliveryFee

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <span
            style={styles.breadcrumbLink}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--imperial-blue)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--french-blue)' }}
          >
            Home
          </span>
          <span><Icon name="chevron_right" size={16} /></span>
          <span>Shopping Cart</span>
        </div>

        <h1 style={styles.pageTitle}>Shopping Cart ({cart.items.length} items)</h1>

        <div style={{ ...styles.layout, flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ ...styles.leftColumn, width: isMobile ? '100%' : 'auto' }}>
            <div style={styles.cartCard}>
              <h2 style={styles.sectionTitle}>Cart Items</h2>
              {cart.items.map((item) => (
                <div key={item.id} style={styles.itemRow}>
                  <div style={styles.itemImage}><Icon name="inventory_2" size={24} /></div>

                  <div style={styles.itemInfo}>
                    <h3 style={styles.productName}>{item.product_name}</h3>
                    <p style={styles.unitPrice}>৳{item.unit_price} per unit</p>

                    <div style={styles.quantityControls}>
                      <button
                        type="button"
                        style={styles.quantityButton}
                        disabled={updatingItemId === item.id || item.quantity <= 1}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        onMouseEnter={(e) => {
                          if (updatingItemId === item.id || item.quantity <= 1) return
                          e.currentTarget.style.backgroundColor = '#f3f4f6'
                          e.currentTarget.style.borderColor = '#d1d5db'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff'
                          e.currentTarget.style.borderColor = '#e5e7eb'
                        }}
                      >
                        −
                      </button>

                      <span style={styles.quantityDisplay}>{item.quantity}</span>

                      <button
                        type="button"
                        style={styles.quantityButton}
                        disabled={updatingItemId === item.id}
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        onMouseEnter={(e) => {
                          if (updatingItemId === item.id) return
                          e.currentTarget.style.backgroundColor = '#f3f4f6'
                          e.currentTarget.style.borderColor = '#d1d5db'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff'
                          e.currentTarget.style.borderColor = '#e5e7eb'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p style={styles.subtotal}>৳{item.subtotal}</p>

                  <button
                    type="button"
                    style={styles.removeButton}
                    disabled={removingItemId === item.id}
                    onClick={() => handleRemoveItem(item.id)}
                    onMouseEnter={(e) => {
                      if (removingItemId === item.id) return
                      e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.24)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.12)'
                    }}
                  >
                    <Icon name="close" size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...styles.rightColumn, width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '100%' : '400px', position: isMobile ? 'static' : 'sticky' }}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>

              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600 }}>৳{cart.total_price}</span>
              </div>

              <div style={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span style={{ fontWeight: 600 }}>৳{deliveryFee}</span>
              </div>

              <div style={styles.summaryTotal}>
                <span>Total</span>
                <span>৳{grandTotal}</span>
              </div>

              <button
                type="button"
                style={styles.checkoutButton}
                onClick={handleProceedToOrder}
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

              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'rgba(253, 197, 0, 0.2)', borderRadius: '8px', fontSize: '13px', color: '#111827' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="featured_seasonal_and_gifts" size={16} />
                  Free delivery on orders over ৳500
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
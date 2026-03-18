import { useNavigate } from 'react-router-dom'

import { useGeolocation } from '../hooks/useGeolocation'
import { useWindowSize } from '../hooks/useWindowSize'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb',
  },
  container: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '72px',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  logo: {
    fontSize: '28px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    cursor: 'pointer',
    letterSpacing: '-0.5px',
  },
  locationWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  locationIcon: {
    fontSize: '18px',
  },
  locationText: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: 500,
  },
  locationLabel: {
    fontSize: '11px',
    color: '#9ca3af',
    marginRight: '4px',
  },
  refreshIcon: {
    fontSize: '14px',
    cursor: 'pointer',
    color: '#6b7280',
    transition: 'transform 0.3s ease',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  cartBadge: {
    position: 'relative',
    padding: '8px 16px',
    backgroundColor: '#fef3c7',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid #fde68a',
  },
  cartIcon: {
    fontSize: '20px',
  },
  cartCount: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#92400e',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#111827',
  },
  button: {
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
  },
  skeleton: {
    width: '120px',
    height: '16px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    animation: 'skeleton-pulse 1.5s ease-in-out infinite',
  },
}

function Navbar() {
  const navigate = useNavigate()
  const { width } = useWindowSize()
  const isMobile = width < 768
  
  const { address, loading: locationLoading, requestLocation } = useGeolocation()
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const logout = useAuthStore((state) => state.logout)
  const cartItems = useCartStore((state) => state.cartItems)
  const toggleCart = useCartStore((state) => state.toggleCart)
  const clearCart = useCartStore((state) => state.clearCart)

  const isLoggedIn = Boolean(token)
  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item?.quantity || 0),
    0,
  )

  const handleLogin = () => {
    navigate('/login')
  }

  const handleLogout = () => {
    clearCart()
    logout()
    navigate('/login')
  }

  const handleRefreshLocation = (e) => {
    e.stopPropagation()
    requestLocation()
  }

  const getDisplayName = () => {
    return user?.full_name || user?.name || 'User'
  }

  const getUserInitial = () => {
    return getDisplayName().charAt(0).toUpperCase() || 'U'
  }

  if (isMobile) {
    return (
      <nav style={styles.navbar}>
        <style>
          {`
            @keyframes skeleton-pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>
        <div style={{ ...styles.container, flexDirection: 'column', height: 'auto', padding: '12px 16px', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div style={{ ...styles.logo, fontSize: '24px' }} onClick={() => navigate('/')}>
              Chaldal
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div
                style={{ ...styles.cartBadge, padding: '6px 12px' }}
                onClick={toggleCart}
                title="View cart"
              >
                <span style={{ ...styles.cartIcon, fontSize: '18px' }}>🛒</span>
                <span style={{ ...styles.cartCount, fontSize: '13px' }}>{cartCount}</span>
              </div>
              {isLoggedIn ? (
                <div style={{ ...styles.avatar, width: '32px', height: '32px', fontSize: '12px' }}>
                  {getUserInitial()}
                </div>
              ) : null}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div
              style={{ ...styles.locationWrapper, flex: 1, marginRight: '8px' }}
              onClick={requestLocation}
              title="Update location"
            >
              <span style={styles.locationIcon}>📍</span>
              {locationLoading ? (
                <div style={{ ...styles.skeleton, width: '100px' }} />
              ) : (
                <div>
                  <span style={styles.locationText}>{address}</span>
                </div>
              )}
            </div>
            
            {isLoggedIn ? (
              <button
                type="button"
                style={{ ...styles.button, ...styles.logoutButton, padding: '8px 14px', fontSize: '13px' }}
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button
                type="button"
                style={{ ...styles.button, padding: '8px 14px', fontSize: '13px' }}
                onClick={handleLogin}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav style={styles.navbar}>
      <style>
        {`
          @keyframes skeleton-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <div style={styles.logo} onClick={() => navigate('/')}>
            Chaldal
          </div>
          
          <div
            style={styles.locationWrapper}
            onClick={requestLocation}
            title="Click to update location"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <span style={styles.locationIcon}>📍</span>
            {locationLoading ? (
              <div style={styles.skeleton} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={styles.locationLabel}>Deliver to</span>
                <span style={styles.locationText}>{address}</span>
              </div>
            )}
            <span
              style={styles.refreshIcon}
              onClick={handleRefreshLocation}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(180deg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(0deg)'
              }}
            >
              ↻
            </span>
          </div>
        </div>

        <div style={styles.rightSection}>
          <div
            style={styles.cartBadge}
            onClick={toggleCart}
            title="View cart"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fde68a'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fef3c7'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <span style={styles.cartIcon}>🛒</span>
            <span style={styles.cartCount}>{cartCount}</span>
          </div>

          {isLoggedIn ? (
            <>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>{getUserInitial()}</div>
                <span style={styles.userName}>Hi, {getDisplayName()}</span>
              </div>
              <button
                type="button"
                style={{ ...styles.button, ...styles.logoutButton }}
                onClick={handleLogout}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              style={styles.button}
              onClick={handleLogin}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
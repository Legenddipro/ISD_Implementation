import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from './ui/Icon'

import { getProducts } from '../api/productApi'
import { useGeolocation } from '../hooks/useGeolocation'
import { useWindowSize } from '../hooks/useWindowSize'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: 'var(--french-blue)',
    boxShadow: '0 1px 4px rgba(0, 41, 107, 0.08)',
    borderBottom: '1px solid rgba(0, 41, 107, 0.16)',
  },
  container: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    height: '68px',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    flexShrink: 0,
  },
  centerSection: {
    flex: 1,
    minWidth: 0,
    maxWidth: '560px',
    position: 'relative',
  },
  searchWrapper: {
    position: 'relative',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '54%',
    transform: 'translateY(-50%)',
    color: '#4b5563',
    pointerEvents: 'none',
  },
  searchInput: {
    width: 'calc(100% - 2px)',
    height: '42px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#ffffff',
    color: '#111827',
    fontSize: '14px',
    padding: '0 16px 0 42px',
    boxSizing: 'border-box',
    outline: 'none',
    margin: '0 auto',
    display: 'block',
  },
  suggestionsDropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    border: '1px solid rgba(0, 41, 107, 0.14)',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
    zIndex: 1200,
  },
  suggestionItem: {
    padding: '10px 14px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    fontSize: '14px',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  suggestionIcon: {
    color: '#4b5563',
  },
  logo: {
    fontSize: '27px',
    fontWeight: 800,
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0, 41, 107, 0.4)',
    cursor: 'pointer',
    letterSpacing: '-0.5px',
  },
  locationWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '40px',
    padding: '0 16px',
    backgroundColor: 'rgba(0, 41, 107, 0.22)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  locationIcon: {
    fontSize: '18px',
    color: '#ffffff',
  },
  locationText: {
    fontSize: '14px',
    color: '#ffffff',
    fontWeight: 500,
  },
  locationLabel: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.85)',
    marginRight: '4px',
  },
  refreshIcon: {
    fontSize: '14px',
    cursor: 'pointer',
    color: '#ffffff',
    transition: 'transform 0.3s ease',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginLeft: 'auto',
  },
  cartBadge: {
    position: 'relative',
    height: '40px',
    padding: '0 16px',
    backgroundColor: 'rgba(0, 41, 107, 0.92)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid var(--french-blue)',
  },
  cartIcon: {
    fontSize: '20px',
    color: '#ffffff',
  },
  cartCount: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#ffffff',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '40px',
    padding: '0 12px',
    backgroundColor: 'rgba(0, 41, 107, 0.18)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.24)',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--imperial-blue)',
    color: 'var(--gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '12px',
  },
  userName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#ffffff',
  },
  button: {
    border: 'none',
    backgroundColor: 'rgba(0, 41, 107, 0.95)',
    color: '#ffffff',
    height: '40px',
    padding: '0 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    color: 'var(--imperial-blue)',
    border: 'none',
    padding: '0 12px',
    fontSize: '13px',
  },
  skeleton: {
    width: '120px',
    height: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '4px',
    animation: 'skeleton-pulse 1.5s ease-in-out infinite',
  },
}

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { width } = useWindowSize()
  const isMobile = width < 768

  const [searchInput, setSearchInput] = useState('')
  const [allProducts, setAllProducts] = useState([])
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)
  
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

  const generateSearchSuggestions = (query) => {
    if (!query || query.length < 2) {
      setSearchSuggestions([])
      return
    }

    const suggestions = allProducts
      .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
      .map((product) => product.name)

    setSearchSuggestions(suggestions)
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchInput(query)
    setShowSuggestions(true)
    generateSearchSuggestions(query)
  }

  const handleSearchSubmit = (query = searchInput) => {
    const nextQuery = query.trim()
    setShowSuggestions(false)
    navigate(nextQuery ? `/?q=${encodeURIComponent(nextQuery)}` : '/')
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion)
    handleSearchSubmit(suggestion)
  }

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q') || ''
    setSearchInput(query)
  }, [location.pathname, location.search])

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await getProducts()
        setAllProducts(response.data)
      } catch (error) {
        setAllProducts([])
      }
    }

    fetchAllProducts()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
          <div style={{ width: '100%' }} ref={searchRef}>
            <div style={styles.searchWrapper}>
              <span style={styles.searchIcon}>
                <Icon name="search" size={20} style={{ fontVariationSettings: '"wght" 700' }} />
              </span>
              <input
                type="text"
                style={{ ...styles.searchInput, height: '40px' }}
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchInput && setShowSuggestions(true)}
              />
              {showSuggestions && searchSuggestions.length > 0 && (
                <div style={styles.suggestionsDropdown}>
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      style={styles.suggestionItem}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <span style={styles.suggestionIcon}><Icon name="search" size={14} /></span>
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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
                <Icon name="shopping_cart" size={18} style={styles.cartIcon} />
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
              <Icon name="location_on" size={18} style={styles.locationIcon} />
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
              e.currentTarget.style.backgroundColor = 'rgba(0, 41, 107, 0.3)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.75)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 41, 107, 0.22)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)'
            }}
          >
            <Icon name="location_on" size={18} style={styles.locationIcon} />
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
              <Icon name="refresh" size={14} style={{ color: '#ffffff' }} />
            </span>
          </div>
        </div>

        <div style={styles.centerSection} ref={searchRef}>
          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>
              <Icon name="search" size={20} style={{ fontVariationSettings: '"wght" 700' }} />
            </span>
            <input
              type="text"
              style={styles.searchInput}
              placeholder="Search for products..."
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => searchInput && setShowSuggestions(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 80, 157, 0.18)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            {showSuggestions && searchSuggestions.length > 0 && (
              <div style={styles.suggestionsDropdown}>
                {searchSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <span style={styles.suggestionIcon}><Icon name="search" size={14} /></span>
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={styles.rightSection}>
          <div
            style={styles.cartBadge}
            onClick={toggleCart}
            title="View cart"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--french-blue)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--imperial-blue)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <Icon name="shopping_cart" size={20} style={styles.cartIcon} />
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
                  e.currentTarget.style.backgroundColor = '#eef4ff'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff'
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
                e.currentTarget.style.backgroundColor = 'var(--french-blue)'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--imperial-blue)'
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
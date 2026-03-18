import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Icon from '../components/ui/Icon'

import CartModal from '../components/CartModal'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import { addToCart, getCart, removeFromCart } from '../api/cartApi'
import { getCategories, getProducts } from '../api/productApi'
import { useWindowSize } from '../hooks/useWindowSize'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

const styles = {
  page: {
    display: 'flex',
    minHeight: 'calc(100vh - 68px)',
    backgroundColor: '#f7f9fc',
  },
  sidebar: {
    width: '240px',
    height: 'calc(100vh - 68px)',
    position: 'sticky',
    top: '68px',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    borderRight: '1px solid rgba(0, 41, 107, 0.1)',
    padding: '24px 0',
    flexShrink: 0,
    scrollBehavior: 'smooth',
  },
  sidebarInner: {
    padding: '0 20px',
  },
  sidebarTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
    paddingBottom: '12px',
    borderBottom: '2px solid rgba(0, 80, 157, 0.14)',
  },
  categoryButton: {
    width: '100%',
    textAlign: 'left',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    color: '#111827',
    fontSize: '15px',
    fontWeight: 500,
    padding: '12px 16px',
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  categoryButtonActive: {
    backgroundColor: 'var(--french-blue)',
    color: '#ffffff',
    fontWeight: 600,
    boxShadow: '0 2px 6px rgba(0, 41, 107, 0.24)',
  },
  categoryIcon: {
    fontSize: '18px',
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
    overflowX: 'hidden',
  },
  contentInner: {
    padding: '32px',
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
  banner: {
    height: '280px',
    borderRadius: '16px',
    backgroundColor: 'var(--imperial-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px',
    padding: '0 60px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    boxSizing: 'border-box',
  },
  bannerContent: {
    zIndex: 2,
  },
  bannerTitle: {
    margin: '0 0 12px 0',
    color: '#ffffff',
    fontSize: '48px',
    fontWeight: 800,
    lineHeight: 1.2,
  },
  bannerSubtitle: {
    margin: 0,
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '18px',
    fontWeight: 400,
  },
  bannerDecoration: {
    position: 'absolute',
    right: '-50px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '200px',
    color: '#ffffff',
    opacity: 0.1,
  },
  sectionTitle: {
    margin: '0 0 24px 0',
    fontSize: '24px',
    fontWeight: 700,
    color: '#111827',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
    gap: '18px',
    width: '100%',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyText: {
    margin: '0 0 8px 0',
    color: '#111827',
    fontSize: '18px',
    fontWeight: 600,
  },
  emptySubtext: {
    margin: 0,
    color: '#4b5563',
    fontSize: '14px',
  },
}

const categoryIcons = {
  Dairy: 'egg_alt',
  Grains: 'grain',
  Bakery: 'bakery_dining',
  Meat: 'lunch_dining',
  Vegetables: 'nutrition',
  Fruits: 'nutrition',
  Beverages: 'local_cafe',
  Snacks: 'cookie',
}

function BrowseProductPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addingProductId, setAddingProductId] = useState(null)
  const [updatingProductId, setUpdatingProductId] = useState(null)
  const [updatingItemId, setUpdatingItemId] = useState(null)

  const { width } = useWindowSize()
  const isMobile = width < 1024

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const cartItems = useCartStore((state) => state.cartItems)
  const totalPrice = useCartStore((state) => state.totalPrice)
  const isCartOpen = useCartStore((state) => state.isCartOpen)
  const setCart = useCartStore((state) => state.setCart)
  const openCart = useCartStore((state) => state.openCart)
  const closeCart = useCartStore((state) => state.closeCart)

  const refreshCart = async () => {
    const response = await getCart()
    setCart(response.data)
    return response.data
  }

  const getCartItemByProductId = (productId) =>
    cartItems.find((item) => Number(item?.product_id) === Number(productId))

  const fetchProducts = async (currentSearch = '', currentCategory = selectedCategory) => {
    setLoading(true)
    try {
      const response = await getProducts(currentSearch, currentCategory)
      setProducts(response.data)
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await getCategories()
      setCategories(response.data)
    } catch (error) {
      toast.error('Failed to fetch categories')
    }
  }

  const handleCategoryClick = (categoryId) => {
    const nextCategory = categoryId === selectedCategory ? null : categoryId
    setSelectedCategory(nextCategory)
    if (searchQuery) {
      setSearchParams({})
    }
  }

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }

    setAddingProductId(productId)
    try {
      await addToCart(productId, 1)
      await refreshCart()
      openCart()
      toast.success('Item added to cart')
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to add item to cart')
    } finally {
      setAddingProductId(null)
    }
  }

  const handleIncreaseProductQuantity = async (productId) => {
    if (!isLoggedIn) {
      toast.error('Please login to update cart')
      navigate('/login')
      return
    }

    setUpdatingProductId(productId)
    try {
      await addToCart(productId, 1)
      await refreshCart()
    } catch (error) {
      toast.error('Failed to update quantity')
    } finally {
      setUpdatingProductId(null)
    }
  }

  const handleDecreaseProductQuantity = async (productId) => {
    const cartItem = getCartItemByProductId(productId)
    if (!cartItem) return

    setUpdatingProductId(productId)
    try {
      const nextQuantity = Number(cartItem.quantity || 0) - 1
      await removeFromCart(cartItem.id)
      if (nextQuantity > 0) {
        await addToCart(productId, nextQuantity)
      }
      await refreshCart()
    } catch (error) {
      toast.error('Failed to update quantity')
    } finally {
      setUpdatingProductId(null)
    }
  }

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId)
      const response = await getCart()
      setCart(response.data)
      toast.success('Item removed')
    } catch (error) {
      toast.error('Failed to remove item from cart')
    }
  }

  const handleIncreaseCartItem = async (itemId) => {
    const cartItem = cartItems.find((item) => item.id === itemId)
    if (!cartItem) return

    setUpdatingItemId(itemId)
    try {
      const nextQuantity = Number(cartItem.quantity || 0) + 1
      await removeFromCart(itemId)
      await addToCart(cartItem.product_id, nextQuantity)
      await refreshCart()
    } catch (error) {
      toast.error('Failed to update quantity')
    } finally {
      setUpdatingItemId(null)
    }
  }

  const handleDecreaseCartItem = async (itemId) => {
    const cartItem = cartItems.find((item) => item.id === itemId)
    if (!cartItem) return

    setUpdatingItemId(itemId)
    try {
      const nextQuantity = Number(cartItem.quantity || 0) - 1
      await removeFromCart(itemId)
      if (nextQuantity > 0) {
        await addToCart(cartItem.product_id, nextQuantity)
      }
      await refreshCart()
    } catch (error) {
      toast.error('Failed to update quantity')
    } finally {
      setUpdatingItemId(null)
    }
  }

  const handleCheckout = () => {
    closeCart()
    navigate('/cart')
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts(searchQuery, selectedCategory)
  }, [searchQuery, selectedCategory])

  if (isMobile) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 72px)' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={styles.sidebarTitle}>Categories</h2>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            <button
              type="button"
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === null ? styles.categoryButtonActive : {}),
                minWidth: '140px',
                marginBottom: 0,
              }}
              onClick={() => handleCategoryClick(null)}
            >
              <span style={styles.categoryIcon}><Icon name="storefront" size={18} /></span>
              All Products
            </button>
            {categories.map((category) => (
              (() => {
                const categoryIconName = categoryIcons[category.name] || 'inventory_2'
                return (
              <button
                key={category.id}
                type="button"
                style={{
                  ...styles.categoryButton,
                  ...(selectedCategory === category.id ? styles.categoryButtonActive : {}),
                  minWidth: '140px',
                  marginBottom: 0,
                }}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span style={styles.categoryIcon}><Icon name={categoryIconName} size={18} /></span>
                {category.name}
              </button>
                )
              })()
            ))}
          </div>
        </div>

        <div style={{ ...styles.banner, padding: '0 30px', height: '200px' }}>
          <div style={styles.bannerContent}>
            <h1 style={{ ...styles.bannerTitle, fontSize: '32px' }}>Fresh Groceries Delivered</h1>
            <p style={{ ...styles.bannerSubtitle, fontSize: '16px' }}>Get everything you need, delivered to your door</p>
          </div>
          <span style={{ ...styles.bannerDecoration, fontSize: '120px', right: '-30px' }}>🛒</span>
        </div>

        {loading ? (
          <div style={{ ...styles.productsGrid, gridTemplateColumns: '1fr' }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}><Icon name="search_off" size={58} /></div>
            <p style={styles.emptyText}>No products found</p>
            <p style={styles.emptySubtext}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{ ...styles.productsGrid, gridTemplateColumns: '1fr' }}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  isAdding: addingProductId === product.id,
                  quantityInCart: Number(getCartItemByProductId(product.id)?.quantity || 0),
                  isUpdatingQuantity: updatingProductId === product.id,
                }}
                onAddToCart={handleAddToCart}
                onIncreaseQuantity={handleIncreaseProductQuantity}
                onDecreaseQuantity={handleDecreaseProductQuantity}
              />
            ))}
          </div>
        )}

        {isCartOpen && (
          <CartModal
            isOpen={isCartOpen}
            onClose={closeCart}
            cartItems={cartItems}
            totalPrice={totalPrice}
            onRemoveItem={handleRemoveFromCart}
            onIncreaseItem={handleIncreaseCartItem}
            onDecreaseItem={handleDecreaseCartItem}
            updatingItemId={updatingItemId}
            onCheckout={handleCheckout}
          />
        )}
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarInner}>
          <h2 style={styles.sidebarTitle}>Categories</h2>
          <button
            type="button"
            style={{
              ...styles.categoryButton,
              ...(selectedCategory === null ? styles.categoryButtonActive : {}),
            }}
            onClick={() => handleCategoryClick(null)}
            onMouseEnter={(e) => {
              if (selectedCategory === null) return
              e.currentTarget.style.backgroundColor = '#f3f4f6'
            }}
            onMouseLeave={(e) => {
              if (selectedCategory === null) return
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <span style={styles.categoryIcon}><Icon name="storefront" size={18} /></span>
            All Products
          </button>

          {categories.map((category) => (
            (() => {
              const categoryIconName = categoryIcons[category.name] || 'inventory_2'
              return (
            <button
              key={category.id}
              type="button"
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === category.id ? styles.categoryButtonActive : {}),
              }}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={(e) => {
                if (selectedCategory === category.id) return
                e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.08)'
              }}
              onMouseLeave={(e) => {
                if (selectedCategory === category.id) return
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <span style={styles.categoryIcon}><Icon name={categoryIconName} size={18} /></span>
              {category.name}
            </button>
              )
            })()
          ))}
        </div>
      </aside>

      <main style={styles.mainContent}>
        <div style={styles.contentInner}>
          <div style={styles.banner}>
            <div style={styles.bannerContent}>
              <h1 style={styles.bannerTitle}>Fresh Groceries<br />Delivered Fast</h1>
              <p style={styles.bannerSubtitle}>Get everything you need, delivered to your door</p>
            </div>
            <span style={styles.bannerDecoration}>🛒</span>
          </div>

          <h2 style={styles.sectionTitle}>
            {selectedCategory 
              ? categories.find(c => c.id === selectedCategory)?.name || 'Products'
              : searchQuery 
                ? `Search results for "${searchQuery}"`
                : 'All Products'
            }
          </h2>

          {loading ? (
            <div style={styles.productsGrid}>
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}><Icon name="search_off" size={58} /></div>
              <p style={styles.emptyText}>No products found</p>
              <p style={styles.emptySubtext}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div style={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    isAdding: addingProductId === product.id,
                    quantityInCart: Number(getCartItemByProductId(product.id)?.quantity || 0),
                    isUpdatingQuantity: updatingProductId === product.id,
                  }}
                  onAddToCart={handleAddToCart}
                  onIncreaseQuantity={handleIncreaseProductQuantity}
                  onDecreaseQuantity={handleDecreaseProductQuantity}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {isCartOpen && (
        <CartModal
          isOpen={isCartOpen}
          onClose={closeCart}
          cartItems={cartItems}
          totalPrice={totalPrice}
          onRemoveItem={handleRemoveFromCart}
          onIncreaseItem={handleIncreaseCartItem}
          onDecreaseItem={handleDecreaseCartItem}
          updatingItemId={updatingItemId}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  )
}

export default BrowseProductPage
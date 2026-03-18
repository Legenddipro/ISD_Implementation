import Icon from './ui/Icon'

const styles = {
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid rgba(0, 41, 107, 0.12)',
    borderRadius: '14px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: '4 / 3',
    overflow: 'hidden',
    backgroundColor: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'var(--school-bus-yellow)',
    border: '1px solid var(--gold)',
    color: '#ffffff',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  placeholderText: {
    color: '#d1d5db',
    fontSize: '14px',
    fontWeight: 500,
  },
  content: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  category: {
    margin: '0 0 6px 0',
    fontSize: '11px',
    color: 'var(--steel-azure)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 600,
  },
  name: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1.4,
    minHeight: '40px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #f3f4f6',
  },
  price: {
    margin: 0,
    fontSize: '21px',
    fontWeight: 800,
    color: 'var(--imperial-blue)',
  },
  currency: {
    fontSize: '14px',
    fontWeight: 600,
  },
  spacer: {
    flex: 1,
  },
  buttonWrapper: {
    marginTop: '10px',
  },
  quantityControls: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  quantityButton: {
    width: '34px',
    height: '34px',
    border: '1px solid rgba(0, 41, 107, 0.2)',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: 'var(--imperial-blue)',
    fontSize: '18px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 700,
    color: '#111827',
  },
  button: {
    width: '100%',
    border: 'none',
    borderRadius: '9px',
    backgroundColor: 'var(--french-blue)',
    color: '#ffffff',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 2px 6px rgba(0, 41, 107, 0.2)',
  },
  spinner: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#ffffff',
    animation: 'spin 0.8s linear infinite',
  },
}

function ProductCard({
  product,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) {
  const isAdding = Boolean(product?.isAdding)
  const isUpdatingQuantity = Boolean(product?.isUpdatingQuantity)
  const quantityInCart = Number(product?.quantityInCart || 0)
  const isInStock = product?.stock_quantity > 0

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)'
        e.currentTarget.style.transform = 'translateY(-8px)'
        const img = e.currentTarget.querySelector('img')
        if (img) img.style.transform = 'scale(1.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
        const img = e.currentTarget.querySelector('img')
        if (img) img.style.transform = 'scale(1)'
      }}
    >
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div style={styles.imageWrapper}>
        {product?.image_url ? (
          <img src={product.image_url} alt={product.name} style={styles.image} />
        ) : (
          <span style={styles.placeholderText}><Icon name="inventory_2" size={18} /></span>
        )}
        {isInStock && (
          <div style={styles.badge}>Fresh</div>
        )}
      </div>

      <div style={styles.content}>
        <p style={styles.category}>{product?.category_name || 'Product'}</p>
        <h3 style={styles.name}>{product?.name}</h3>

        <div style={styles.spacer} />

        <div style={styles.priceRow}>
          <p style={styles.price}>
            <span style={styles.currency}>৳</span>{product?.price}
          </p>
          {product?.stock_quantity < 10 && product?.stock_quantity > 0 && (
            <span style={{ fontSize: '12px', color: 'var(--steel-azure)', fontWeight: 600 }}>
              Only {product.stock_quantity} left
            </span>
          )}
        </div>

        {quantityInCart > 0 ? (
          <div style={styles.quantityControls}>
            <button
              type="button"
              style={styles.quantityButton}
              disabled={isUpdatingQuantity}
              onClick={() => onDecreaseQuantity(product.id)}
              onMouseEnter={(e) => {
                if (isUpdatingQuantity) return
                e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
              }}
            >
              −
            </button>
            <span style={styles.quantityValue}>{quantityInCart}</span>
            <button
              type="button"
              style={styles.quantityButton}
              disabled={isUpdatingQuantity}
              onClick={() => onIncreaseQuantity(product.id)}
              onMouseEnter={(e) => {
                if (isUpdatingQuantity) return
                e.currentTarget.style.backgroundColor = 'rgba(0, 80, 157, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
              }}
            >
              +
            </button>
          </div>
        ) : (
          <div style={styles.buttonWrapper}>
            <button
              type="button"
              style={{
                ...styles.button,
                opacity: isAdding || !isInStock ? 0.7 : 1,
                cursor: isAdding || !isInStock ? 'not-allowed' : 'pointer',
                backgroundColor: !isInStock ? '#9ca3af' : 'var(--french-blue)',
              }}
              disabled={isAdding || !isInStock}
              onClick={() => onAddToCart(product.id)}
              onMouseEnter={(e) => {
                if (isAdding || !isInStock) return
                e.currentTarget.style.backgroundColor = 'var(--imperial-blue)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 41, 107, 0.28)'
              }}
              onMouseLeave={(e) => {
                if (isAdding || !isInStock) return
                e.currentTarget.style.backgroundColor = 'var(--french-blue)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 41, 107, 0.2)'
              }}
            >
              {isAdding ? (
                <>
                  <span style={styles.spinner} />
                  Adding...
                </>
              ) : !isInStock ? (
                'Out of Stock'
              ) : (
                <>
                  <Icon name="shopping_cart" size={16} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
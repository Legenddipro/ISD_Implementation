const styles = {
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: '1 / 1',
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
    backgroundColor: '#10b981',
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
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  category: {
    margin: '0 0 6px 0',
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 600,
  },
  name: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1.4,
    minHeight: '44px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #f3f4f6',
  },
  price: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 800,
    color: '#10b981',
  },
  currency: {
    fontSize: '16px',
    fontWeight: 600,
  },
  spacer: {
    flex: 1,
  },
  buttonWrapper: {
    marginTop: '12px',
  },
  button: {
    width: '100%',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
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

function ProductCard({ product, onAddToCart }) {
  const isAdding = Boolean(product?.isAdding)
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
          <span style={styles.placeholderText}>📦</span>
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
            <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>
              Only {product.stock_quantity} left
            </span>
          )}
        </div>

        <div style={styles.buttonWrapper}>
          <button
            type="button"
            style={{
              ...styles.button,
              opacity: isAdding || !isInStock ? 0.7 : 1,
              cursor: isAdding || !isInStock ? 'not-allowed' : 'pointer',
              backgroundColor: !isInStock ? '#9ca3af' : '#3b82f6',
            }}
            disabled={isAdding || !isInStock}
            onClick={() => onAddToCart(product.id)}
            onMouseEnter={(e) => {
              if (isAdding || !isInStock) return
              e.currentTarget.style.backgroundColor = '#2563eb'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)'
            }}
            onMouseLeave={(e) => {
              if (isAdding || !isInStock) return
              e.currentTarget.style.backgroundColor = '#3b82f6'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)'
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
                <span>🛒</span>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
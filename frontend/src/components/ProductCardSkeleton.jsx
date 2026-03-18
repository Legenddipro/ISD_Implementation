const styles = {
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '360px',
  },
  shimmer: {
    background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton-shimmer 1.2s infinite linear',
  },
  image: {
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '10px',
    marginBottom: '12px',
  },
  lineLg: {
    height: '18px',
    borderRadius: '6px',
    width: '78%',
    marginBottom: '10px',
  },
  lineSm: {
    height: '12px',
    borderRadius: '6px',
    width: '50%',
    marginBottom: '12px',
  },
  price: {
    height: '24px',
    borderRadius: '6px',
    width: '36%',
    marginBottom: 'auto',
  },
  button: {
    marginTop: '14px',
    width: '100%',
    height: '40px',
    borderRadius: '8px',
  },
}

function ProductCardSkeleton() {
  return (
    <div style={styles.card} aria-hidden="true">
      <style>
        {`@keyframes skeleton-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}
      </style>
      <div style={{ ...styles.image, ...styles.shimmer }} />
      <div style={{ ...styles.lineLg, ...styles.shimmer }} />
      <div style={{ ...styles.lineSm, ...styles.shimmer }} />
      <div style={{ ...styles.price, ...styles.shimmer }} />
      <div style={{ ...styles.button, ...styles.shimmer }} />
    </div>
  )
}

export default ProductCardSkeleton

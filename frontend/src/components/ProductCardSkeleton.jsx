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
    backgroundColor: '#e7edf5',
    animation: 'skeleton-pulse 1.2s infinite ease-in-out',
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
        {`@keyframes skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }`}
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

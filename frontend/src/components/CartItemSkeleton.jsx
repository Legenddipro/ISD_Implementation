const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '15px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  shimmer: {
    background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
    backgroundSize: '200% 100%',
    animation: 'cart-item-skeleton-shimmer 1.2s infinite linear',
  },
  image: {
    width: '80px',
    height: '80px',
    borderRadius: '10px',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  lineLg: {
    height: '16px',
    width: '60%',
    borderRadius: '6px',
    marginBottom: '10px',
  },
  lineSm: {
    height: '12px',
    width: '42%',
    borderRadius: '6px',
    marginBottom: '10px',
  },
  qty: {
    height: '30px',
    width: '120px',
    borderRadius: '8px',
  },
  subtotal: {
    width: '100px',
    height: '18px',
    borderRadius: '6px',
  },
  remove: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    marginLeft: '8px',
  },
}

function CartItemSkeleton() {
  return (
    <div style={styles.row} aria-hidden="true">
      <style>
        {`@keyframes cart-item-skeleton-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}
      </style>
      <div style={{ ...styles.image, ...styles.shimmer }} />
      <div style={styles.info}>
        <div style={{ ...styles.lineLg, ...styles.shimmer }} />
        <div style={{ ...styles.lineSm, ...styles.shimmer }} />
        <div style={{ ...styles.qty, ...styles.shimmer }} />
      </div>
      <div style={{ ...styles.subtotal, ...styles.shimmer }} />
      <div style={{ ...styles.remove, ...styles.shimmer }} />
    </div>
  )
}

export default CartItemSkeleton

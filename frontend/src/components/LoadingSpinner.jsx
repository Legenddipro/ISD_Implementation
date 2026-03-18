const styles = {
  container: {
    width: '100%',
    height: '100%',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  spinner: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '4px solid rgba(0, 80, 157, 0.18)',
    borderTopColor: 'var(--french-blue)',
    animation: 'loading-spinner-rotate 0.9s linear infinite',
  },
  text: {
    color: 'var(--french-blue)',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.2px',
  },
}

function LoadingSpinner() {
  return (
    <div style={styles.container}>
      <style>
        {`@keyframes loading-spinner-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
      <div style={styles.spinner} aria-hidden="true" />
      <p style={styles.text}>Loading...</p>
    </div>
  )
}

export default LoadingSpinner

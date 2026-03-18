import { useState } from 'react'

const baseStyles = {
  width: '100%',
  border: '1px solid var(--french-blue)',
  borderRadius: '10px',
  backgroundColor: 'var(--french-blue)',
  color: '#ffffff',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.2,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 1px 2px rgba(0, 41, 107, 0.12)',
}

function PrimaryButton({
  children,
  type = 'button',
  disabled = false,
  onClick,
  style = {},
}) {
  const [hovered, setHovered] = useState(false)

  const active = hovered && !disabled

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...baseStyles,
        ...(active
          ? {
              backgroundColor: 'var(--imperial-blue)',
              borderColor: 'var(--imperial-blue)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 10px rgba(0, 41, 107, 0.2)',
            }
          : null),
        ...(disabled
          ? {
              opacity: 0.6,
              cursor: 'not-allowed',
              transform: 'none',
              boxShadow: 'none',
            }
          : null),
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export default PrimaryButton

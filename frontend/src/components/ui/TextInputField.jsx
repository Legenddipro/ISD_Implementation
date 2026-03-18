import { useState } from 'react'

const styles = {
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#1f2937',
    fontSize: '14px',
    fontWeight: 600,
  },
  input: {
    border: '1px solid #d5deea',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  errorText: {
    margin: 0,
    color: '#b45309',
    fontSize: '12px',
    fontWeight: 500,
  },
}

function TextInputField({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={styles.field}>
      <label htmlFor={id} style={styles.label}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...styles.input,
          ...(focused
            ? {
                borderColor: 'var(--steel-azure)',
                boxShadow: '0 0 0 3px rgba(0, 80, 157, 0.12)',
              }
            : null),
          ...(error
            ? {
                borderColor: 'var(--school-bus-yellow)',
                boxShadow: 'none',
              }
            : null),
        }}
      />
      {error ? <p style={styles.errorText}>{error}</p> : null}
    </div>
  )
}

export default TextInputField

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import axiosInstance from '../api/axiosInstance'

const styles = {
  page: {
    minHeight: 'calc(100vh - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: '#f9fafb',
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    border: '1px solid #e5e7eb',
  },
  logo: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoText: {
    fontSize: '36px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  logoSubtext: {
    fontSize: '14px',
    color: '#6b7280',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#111827',
    fontSize: '28px',
    fontWeight: 800,
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 32px 0',
    color: '#6b7280',
    fontSize: '15px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#374151',
    fontSize: '14px',
    fontWeight: 600,
  },
  input: {
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    margin: 0,
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: 500,
  },
  submitButton: {
    marginTop: '8px',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
  },
  bottomText: {
    marginTop: '24px',
    color: '#6b7280',
    fontSize: '15px',
    textAlign: 'center',
  },
  link: {
    color: '#3b82f6',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    marginLeft: '4px',
    transition: 'color 0.2s ease',
  },
}

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validate = (data) => {
    const errors = { name: '', email: '', password: '' }

    if (!data.name.trim()) {
      errors.name = 'Name is required'
    } else if (data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!data.email) {
      errors.email = 'Email is required'
    } else if (!isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!data.password) {
      errors.password = 'Password is required'
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validate(formData)
    setFormErrors(errors)

    if (errors.name || errors.email || errors.password) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsSubmitting(true)
    try {
      await axiosInstance.post('/auth/register', {
        full_name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      toast.success('Account created successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = 
    formData.name && 
    formData.email && 
    formData.password && 
    !formErrors.name && 
    !formErrors.email && 
    !formErrors.password

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoText}>Chaldal</div>
          <div style={styles.logoSubtext}>Fresh Groceries Delivered</div>
        </div>

        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join us and start shopping today</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="name">
              Full Name
            </label>
            <input
              style={{
                ...styles.input,
                ...(formErrors.name ? styles.inputError : {}),
              }}
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10b981'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'
              }}
              onBlur={(e) => {
                if (!formErrors.name) {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            />
            {formErrors.name && <p style={styles.errorText}>{formErrors.name}</p>}
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              style={{
                ...styles.input,
                ...(formErrors.email ? styles.inputError : {}),
              }}
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10b981'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'
              }}
              onBlur={(e) => {
                if (!formErrors.email) {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            />
            {formErrors.email && <p style={styles.errorText}>{formErrors.email}</p>}
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              style={{
                ...styles.input,
                ...(formErrors.password ? styles.inputError : {}),
              }}
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10b981'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'
              }}
              onBlur={(e) => {
                if (!formErrors.password) {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            />
            {formErrors.password && <p style={styles.errorText}>{formErrors.password}</p>}
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              opacity: isSubmitting || !isFormValid ? 0.6 : 1,
              cursor: isSubmitting || !isFormValid ? 'not-allowed' : 'pointer',
            }}
            disabled={isSubmitting || !isFormValid}
            onMouseEnter={(e) => {
              if (isSubmitting || !isFormValid) return
              e.currentTarget.style.backgroundColor = '#059669'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)'
            }}
            onMouseLeave={(e) => {
              if (isSubmitting || !isFormValid) return
              e.currentTarget.style.backgroundColor = '#10b981'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)'
            }}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.bottomText}>
          Already have an account?
          <span
            style={styles.link}
            onClick={() => navigate('/login')}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#2563eb' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#3b82f6' }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
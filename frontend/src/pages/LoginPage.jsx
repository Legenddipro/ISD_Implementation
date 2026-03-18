import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import axiosInstance from '../api/axiosInstance'
import { useAuthStore } from '../store/authStore'

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
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
  },
  divider: {
    margin: '24px 0',
    textAlign: 'center',
    position: 'relative',
  },
  dividerLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '1px',
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    position: 'relative',
    display: 'inline-block',
    padding: '0 16px',
    backgroundColor: '#ffffff',
    color: '#6b7280',
    fontSize: '14px',
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

function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validate = (data) => {
    const errors = { email: '', password: '' }

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

    if (errors.email || errors.password) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      })

      const { access_token: token, user: userData } = response.data

      login(userData || null, token)
      toast.success('Welcome back!')
      navigate('/')
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.email && formData.password && !formErrors.email && !formErrors.password

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoText}>Chaldal</div>
          <div style={styles.logoSubtext}>Fresh Groceries Delivered</div>
        </div>

        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Login to your account to continue</p>

        <form style={styles.form} onSubmit={handleSubmit}>
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
                e.currentTarget.style.borderColor = '#3b82f6'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
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
                e.currentTarget.style.borderColor = '#3b82f6'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
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
              e.currentTarget.style.backgroundColor = '#2563eb'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)'
            }}
            onMouseLeave={(e) => {
              if (isSubmitting || !isFormValid) return
              e.currentTarget.style.backgroundColor = '#3b82f6'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)'
            }}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.bottomText}>
          Don't have an account?
          <span
            style={styles.link}
            onClick={() => navigate('/register')}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#2563eb' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#3b82f6' }}
          >
            Create one now
          </span>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
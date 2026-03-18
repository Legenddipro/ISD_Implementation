import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import axiosInstance from '../api/axiosInstance'
import PrimaryButton from '../components/ui/PrimaryButton'
import TextInputField from '../components/ui/TextInputField'
import { useAuthStore } from '../store/authStore'

const styles = {
  page: {
    minHeight: 'calc(100vh - 68px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
    backgroundColor: '#f4f7fb',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
    padding: '32px',
    border: '1px solid #dce4ef',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#111827',
    fontSize: '28px',
    fontWeight: 800,
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 28px 0',
    color: 'var(--text-muted)',
    fontSize: '15px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
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
    color: 'var(--text-muted)',
    fontSize: '14px',
  },
  bottomText: {
    marginTop: '24px',
    color: '#6b7280',
    fontSize: '15px',
    textAlign: 'center',
  },
  link: {
    color: 'var(--french-blue)',
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
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Login to your account to continue</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <TextInputField
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={formErrors.email}
          />

          <TextInputField
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={formErrors.password}
          />

          <PrimaryButton
            type="submit"
            disabled={isSubmitting || !isFormValid}
            style={{ marginTop: '6px', fontSize: '15px', padding: '13px 14px' }}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </PrimaryButton>
        </form>

        <p style={styles.bottomText}>
          Don't have an account?
          <span
            style={styles.link}
            onClick={() => navigate('/register')}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--imperial-blue)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--french-blue)' }}
          >
            Create one now
          </span>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
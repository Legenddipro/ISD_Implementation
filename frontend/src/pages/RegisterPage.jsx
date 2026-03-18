import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import axiosInstance from '../api/axiosInstance'
import PrimaryButton from '../components/ui/PrimaryButton'
import TextInputField from '../components/ui/TextInputField'

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
  logo: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoText: {
    fontSize: '32px',
    fontWeight: 800,
    color: 'var(--imperial-blue)',
    marginBottom: '8px',
  },
  logoSubtext: {
    fontSize: '14px',
    color: 'var(--text-muted)',
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
  bottomText: {
    marginTop: '24px',
    color: 'var(--text-muted)',
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
          <TextInputField
            label="Full Name"
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            error={formErrors.name}
          />

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
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </PrimaryButton>
        </form>

        <p style={styles.bottomText}>
          Already have an account?
          <span
            style={styles.link}
            onClick={() => navigate('/login')}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--imperial-blue)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--french-blue)' }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
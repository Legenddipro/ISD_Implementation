/*
Development Guide
- Backend: cd backend && uvicorn main:app --reload
- Frontend: cd frontend && npm run dev
- Default ports: backend 8000, frontend 5173
*/

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Page components (placeholder implementations for now)
import BrowseProductPage from './pages/BrowseProductPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'

const COLORS = {
  primary: '#007bff',
  success: '#28a745',
  danger: '#dc3545',
  light: '#f8f9fa',
  dark: '#343a40',
}

const styles = {
  app: {
    '--color-primary': COLORS.primary,
    '--color-success': COLORS.success,
    '--color-danger': COLORS.danger,
    '--color-light': COLORS.light,
    '--color-dark': COLORS.dark,
    fontFamily: '"Roboto", sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-light)',
    color: 'var(--color-dark)',
  },
  content: {
    flex: 1,
  },
}

function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            fontSize: '14px',
          },
        }}
      />
    </>
  )
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div style={styles.app}>
          <Navbar />
          <main style={styles.content}>
            <Routes>
              <Route path="/" element={<BrowseProductPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App

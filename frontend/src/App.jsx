/*
Development Guide
- Backend: cd backend && uvicorn main:app --reload
- Frontend: cd frontend && npm run dev
- Default ports: backend 8000, frontend 5173
*/

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Page components (placeholder implementations for now)
import BrowseProductPage from './pages/BrowseProductPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import { useAuthStore } from './store/authStore'


import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

const COLORS = {
  imperialBlue: '#00296b',
  frenchBlue: '#003f88',
  steelAzure: '#00509d',
  schoolBusYellow: '#fdc500',
  gold: '#ffd500',
  white: '#ffffff',
  black: '#111827',
  surface: '#f4f7fb',
  mutedText: '#4b5563',
}

const styles = {
  app: {
    '--imperial-blue': COLORS.imperialBlue,
    '--french-blue': COLORS.frenchBlue,
    '--steel-azure': COLORS.steelAzure,
    '--school-bus-yellow': COLORS.schoolBusYellow,
    '--gold': COLORS.gold,
    '--text-black': COLORS.black,
    '--text-white': COLORS.white,
    '--text-muted': COLORS.mutedText,
    fontFamily: '"Roboto", sans-serif',
    lineHeight: 1.5,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.surface,
    color: COLORS.black,
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
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const hydrateCurrentUser = useAuthStore((state) => state.hydrateCurrentUser)

  useEffect(() => {
    initializeAuth()
    hydrateCurrentUser()
  }, [initializeAuth, hydrateCurrentUser])

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
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App


// import CheckoutPage from './pages/CheckoutPage'
// import OrderSuccessPage from './pages/OrderSuccessPage'

// // Inside your <Routes>:
{/* <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
<Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} /> */}
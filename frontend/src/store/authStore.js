import { create } from 'zustand'

const initialToken = localStorage.getItem('authToken')

export const useAuthStore = create((set) => ({
  user: null,
  token: initialToken,
  isLoggedIn: Boolean(initialToken),

  login: (userData, token) => {
    console.log('[authStore] login called', { userData, token })
    localStorage.setItem('authToken', token)
    set({
      user: userData,
      token,
      isLoggedIn: Boolean(token),
    })
  },

  logout: () => {
    console.log('[authStore] logout called')
    localStorage.removeItem('authToken')
    set({
      user: null,
      token: null,
      isLoggedIn: false,
    })
  },

  initializeAuth: () => {
    const storedToken = localStorage.getItem('authToken')
    set({
      token: storedToken,
      isLoggedIn: Boolean(storedToken),
    })
  },
}))

export default useAuthStore

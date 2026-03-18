import { create } from 'zustand'
import axiosInstance from '../api/axiosInstance'

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
      user: null,
      token: storedToken,
      isLoggedIn: Boolean(storedToken),
    })
  },

  hydrateCurrentUser: async () => {
    const storedToken = localStorage.getItem('authToken')

    if (!storedToken) {
      set({
        user: null,
        token: null,
        isLoggedIn: false,
      })
      return
    }

    try {
      const response = await axiosInstance.get('/auth/me')
      set({
        user: response.data,
        token: storedToken,
        isLoggedIn: true,
      })
    } catch (error) {
      localStorage.removeItem('authToken')
      set({
        user: null,
        token: null,
        isLoggedIn: false,
      })
    }
  },
}))

export default useAuthStore

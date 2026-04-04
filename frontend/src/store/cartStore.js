import { create } from 'zustand'

export const useCartStore = create((set) => ({
  cartItems: [],
  totalPrice: 0,
  isCartOpen: false,

  setCart: (cart) => {
    console.log('[cartStore] setCart called', cart)
    set({
      cartItems: cart?.items || [],
      totalPrice: cart?.total_price || 0,
    })
  },

  toggleCart: () => {
    set((state) => ({
      isCartOpen: !state.isCartOpen,
    }))
  },

  openCart: () => {
    set({ isCartOpen: true })
  },

  closeCart: () => {
    set({ isCartOpen: false })
  },

  clearCart: () => {
    set({
      cartItems: [],
      totalPrice: 0,
    })
  },
}))

export default useCartStore
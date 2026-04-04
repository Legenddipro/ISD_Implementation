import axiosInstance from './axiosInstance'

export const getCart = () => {
  console.log('[cartApi] getCart')
  return axiosInstance.get('/cart')
}

export const addToCart = (productId, quantity = 1) => {
  console.log('[cartApi] addToCart', { productId, quantity })
  return axiosInstance.post('/cart/add', {
    product_id: productId,
    quantity,
  })
}

export const removeFromCart = (itemId) => {
  console.log('[cartApi] removeFromCart', { itemId })
  return axiosInstance.delete(`/cart/remove/${itemId}`)
}

export const updateCartItemQuantity = (itemId, quantity) => {
  console.log('[cartApi] updateCartItemQuantity', { itemId, quantity })
  return axiosInstance.patch(`/cart/items/${itemId}`, { quantity })
}

export const getCartTotal = () => {
  console.log('[cartApi] getCartTotal')
  return axiosInstance.get('/cart/total')
}

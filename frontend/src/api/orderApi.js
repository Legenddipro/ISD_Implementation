import axiosInstance from './axiosInstance'

/**
 * Validate a coupon code against the current subtotal.
 * @param {string} code
 * @param {number} subtotal
 */
export const validateCoupon = (code, subtotal) => {
  console.log('[orderApi] validateCoupon', { code, subtotal })
  return axiosInstance.post('/order/validate-coupon', { code, subtotal })
}

/**
 * Place an order with the given payload.
 * @param {{
 *   delivery_address: string,
 *   delivery_city?: string,
 *   delivery_time?: string,   // ISO string
 *   delivery_type: string,
 *   payment_method: string,
 *   coupon_code?: string,
 *   use_free_delivery: boolean
 * }} payload
 */
export const placeOrder = (payload) => {
  console.log('[orderApi] placeOrder', payload)
  return axiosInstance.post('/order/place', payload)
}

/**
 * Get the current customer's EggClub membership status.
 */
export const getEggClubStatus = () => {
  console.log('[orderApi] getEggClubStatus')
  return axiosInstance.get('/order/eggclub-status')
}

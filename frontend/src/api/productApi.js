import axiosInstance from './axiosInstance'

export const getProducts = (search, categoryId) => {
  const params = {}

  if (search) {
    params.search = search
  }

  if (categoryId) {
    params.category_id = categoryId
  }

  console.log('[productApi] getProducts', { search, categoryId, params })

  return axiosInstance.get('/products', { params })
}

export const getCategories = () => {
  console.log('[productApi] getCategories')
  return axiosInstance.get('/categories')
}

export const getProduct = (id) => {
  console.log('[productApi] getProduct', { id })
  return axiosInstance.get(`/products/${id}`)
}

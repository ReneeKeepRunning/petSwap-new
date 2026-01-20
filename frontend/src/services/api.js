import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productService = {
  getAllProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProduct: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Reviews API
export const reviewService = {
  createReview: (productId, reviewData) => api.post(`/products/${productId}/reviews`, reviewData),
  deleteReview: (productId, reviewId) => api.delete(`/products/${productId}/reviews/${reviewId}`),
};

// Auth API
export const authService = {
  register: (userData) => api.post('/clients/register', userData),
  login: (credentials) => api.post('/clients/login', credentials),
  logout: () => api.post('/clients/logout'),
  getCurrentUser: () => api.get('/clients/current'),
};

// Contact API
export const contactService = {
  sendMessage: (messageData) => api.post('/contactUs', messageData),
};

export default api;

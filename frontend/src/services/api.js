import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false,
  timeout: 10000 // 10 second timeout
});

// Update request interceptor with better debugging
api.interceptors.request.use(
  config => {
    // Log each request for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  response => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Response from ${response.config.url}: Status ${response.status}`);
    }
    return response;
  },
  error => {
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('Network error - no response received:', error.request);
      // Add more detailed error for network issues
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout - server took too long to respond');
      } else {
        console.error('Network error - check if the backend server is running');
      }
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
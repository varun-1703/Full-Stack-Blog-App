// frontend/blog_ui/src/services/api.js
import axios from 'axios';

// Get the base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// You can also add an interceptor for responses to handle global errors, e.g., 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      // localStorage.removeItem('authToken');
      // localStorage.removeItem('authUser');
      // window.location.href = '/login'; // Or use React Router navigation
      console.error("Unauthorized access - 401");
      // Potentially clear local storage and redirect
    }
    return Promise.reject(error);
  }
);


// Authentication service functions
export const registerUser = (userData) => apiClient.post('/auth/register/', userData);
export const loginUser = (credentials) => apiClient.post('/auth/login/', credentials);
export const logoutUser = () => apiClient.post('/auth/logout/'); // Assuming backend invalidates token
export const getCurrentUser = () => apiClient.get('/auth/user/');

// Blog post service functions
export const getAllBlogs = (page = 1) => apiClient.get(`/blogs/?page=${page}`);
export const getBlogById = (id) => apiClient.get(`/blogs/${id}/`);
export const createBlogPost = (blogData) => apiClient.post('/blogs/', blogData);
export const updateBlogPost = (id, blogData) => apiClient.put(`/blogs/${id}/`, blogData);
export const deleteBlogPost = (id) => apiClient.delete(`/blogs/${id}/`);


export default apiClient; // Export the configured instance if needed elsewhere directly
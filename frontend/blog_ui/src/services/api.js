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
    // Centralized Error Handling
    let errorMessage = 'An unexpected error occurred.';
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;

      if (status === 400) {
        // Handle Bad Request / Validation Errors
        if (typeof data === 'object') {
          errorMessage = 'Validation Error: ';
          for (const key in data) {
            if (Array.isArray(data[key])) {
              errorMessage += `${key}: ${data[key].join(', ')} | `;
            } else {
              errorMessage += `${key}: ${data[key]} | `;
            }
          }
          errorMessage = errorMessage.slice(0, -3); // Remove trailing ' | '
        } else if (data) {
             errorMessage = `Bad Request: ${data}`;
        } else {
             errorMessage = 'Bad Request.';
        }
      } else if (status === 401) {
        // Handle Unauthorized
        errorMessage = data.detail || 'Unauthorized. Please log in again.';
        // Redirect to login page (assuming react-router-dom) - you might need access to history/navigate here
        // For now, just log and consider a global state/context for auth
        console.error("Unauthorized access - 401");
         // Example: Clear local storage and redirect (if still using localStorage)
        // localStorage.removeItem('authToken');
        // localStorage.removeItem('authUser');
        // window.location.href = '/login'; // Redirect

      } else if (status === 403) {
        // Handle Forbidden
        errorMessage = data.detail || 'You do not have permission to perform this action.';
      } else if (status === 404) {
        // Handle Not Found
         errorMessage = data.detail || 'Resource not found.';
      } else if (status >= 500) {
        // Handle Server Errors
        errorMessage = data.detail || 'Internal Server Error. Please try again later.';
      }
       // Propagate the error response data if needed by components
       // error.response.data = data;
       // error.response.status = status;

    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'Network Error: Could not connect to the server. Please check your internet connection or try again later.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }

     // You can attach the processed error message to the error object
     error.customMessage = errorMessage;

    // You can also trigger a global error notification here if you have a context/state management
    // console.error("API Error:", errorMessage);

    return Promise.reject(error); // Propagate the error
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
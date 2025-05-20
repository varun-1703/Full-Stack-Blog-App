// frontend/blog_ui/src/services/api.js
import axios from 'axios';

// Get the base URL from environment variables.
// Vite exposes env variables prefixed with VITE_ to your frontend code.
// Fallback to local development URL if the environment variable is not set
// (though for deployed versions, VITE_API_BASE_URL MUST be set correctly on Render).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL, // This is crucial!
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Axios Request Interceptor ---
// This function will be called before every request is sent.
apiClient.interceptors.request.use(
  (config) => {
    // Get the auth token from localStorage (or your state management solution)
    const token = localStorage.getItem('authToken');
    if (token) {
      // If a token exists, add it to the Authorization header
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// --- Axios Response Interceptor (Optional but Recommended) ---
// This function can be used to handle global API response errors.
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error Response:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);

      if (error.response.status === 401) {
        // Handle unauthorized access, e.g., token expired or invalid
        console.warn("Unauthorized access (401). Token might be invalid or expired.");
        // Optionally, clear local storage and redirect to login:
        // localStorage.removeItem('authToken');
        // localStorage.removeItem('authUser');
        // if (window.location.pathname !== '/login') { // Avoid redirect loop
        //   window.location.href = '/login';
        // }
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      console.error("API No Response:", error.request);
      // This could be a network error, CORS issue if not caught by browser first, or server down.
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Setup Error:', error.message);
    }
    return Promise.reject(error); // Important to propagate the error
  }
);


// === Authentication Service Functions ===
export const registerUser = (userData) => {
  return apiClient.post('/auth/register/', userData);
};

export const loginUser = (credentials) => {
  return apiClient.post('/auth/login/', credentials);
};

export const logoutUser = () => {
  // Backend needs to handle token invalidation if this endpoint is stateful.
  // For simple DRF TokenAuthentication, deleting the token on client-side might be enough
  // if backend just checks for token existence and validity.
  // However, calling the logout endpoint is good practice if the backend does server-side invalidation.
  return apiClient.post('/auth/logout/');
};

export const getCurrentUser = () => {
  return apiClient.get('/auth/user/');
};


// === Blog Post Service Functions ===
export const getAllBlogs = (page = 1) => {
  // The path here is relative to the `baseURL` configured in `apiClient`
  return apiClient.get(`/blogs/?page=${page}`);
};

export const getBlogById = (id) => {
  return apiClient.get(`/blogs/${id}/`);
};

export const createBlogPost = (blogData) => {
  // `apiClient` automatically adds the auth token due to the request interceptor
  return apiClient.post('/blogs/', blogData);
};

export const updateBlogPost = (id, blogData) => {
  return apiClient.put(`/blogs/${id}/`, blogData);
};

export const deleteBlogPost = (id) => {
  return apiClient.delete(`/blogs/${id}/`);
};

// Export the configured instance if you ever need to use it directly
// (though using the service functions is generally preferred)
export default apiClient;
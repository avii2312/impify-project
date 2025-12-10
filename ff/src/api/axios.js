import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  timeout: 30000  // Increased to 30s for slow shared hosting
});

axiosInstance.interceptors.request.use((config) => {
  // Check for admin token first, then regular token (localStorage or sessionStorage)
  const adminToken = localStorage.getItem("admin_token");
  const userToken = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Use admin token if available, otherwise use regular token
  const token = adminToken || userToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Token added to request:', token.substring(0, 20) + '...');
  }
  return config;
});

// Add response interceptor for debugging and auth handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.response?.status, error.message);

    // Handle 401 Unauthorized errors (token expired/invalid)
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');

      // Clear authorization header
      delete axiosInstance.defaults.headers.common['Authorization'];

      // Redirect to auth page if not already there
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
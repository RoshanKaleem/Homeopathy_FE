import axios from 'axios';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: `http://${process.env.REACT_APP_URL}/`,
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

// src/api.js
import axios from 'axios';
import { BASE_URL } from '../components/Constants';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem("token");
      localStorage.removeItem('user-storage'); 
      window.location.href = '/auth';  
    }
    return Promise.reject(error);
  }
);

export default api;

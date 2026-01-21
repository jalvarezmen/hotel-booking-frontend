import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores para errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // El manejo de errores se hará en los componentes con react-query
    return Promise.reject(error);
  }
);

export default api;

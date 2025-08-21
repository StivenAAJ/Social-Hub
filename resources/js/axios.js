import axios from 'axios';

// Mismo origen: 127.0.0.1:8000
axios.defaults.baseURL = "http://localhost:8000"; 
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Añadir el token CSRF de la meta tag a TODAS las peticiones
axios.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token;
  }
  return config;
});

export default axios;

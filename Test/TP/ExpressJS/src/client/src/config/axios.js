import axios from 'axios';

const usuarioAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3500/api',
  timeout: 10000,
});

// Verificar si el token está en localStorage y agregarlo a los headers de Axios
const token = localStorage.getItem('token');
if (token) {
  usuarioAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default usuarioAxios;
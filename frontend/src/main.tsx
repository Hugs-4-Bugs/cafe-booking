import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = '/';  // API requests will be proxied by Vite in development
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Check for token in localStorage and set in header
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

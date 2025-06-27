import axios from 'axios';

const API = axios.create({
  baseURL: "https://teamorax-backend.onrender.com",
});

// Attach token in every req auto ~
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

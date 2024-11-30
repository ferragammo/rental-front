import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_DEV_API_URL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

export default api;

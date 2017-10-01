const axios = require('axios');

const instance = axios.create({
  baseURL: 'https://robert-bucket-lists-api.herokuapp.com/',
  // baseURL: 'http://127.0.0.1:5000',
  headers: {
    token: localStorage.getItem('token'),
    'Content-Type': 'application/json',
  },
});

export default instance;

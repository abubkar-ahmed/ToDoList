import axios from 'axios';
const BASE_URL = 'https://todolist-api-c9su.onrender.com';

export default axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});


import axios from 'axios';
const BASE_URL = 'https://todolistapi-production.up.railway.app';

export default axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});


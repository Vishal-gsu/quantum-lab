import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    timeout: 60_000,
    headers: { 'Content-Type': 'application/json' },
});

export { api, API_URL };

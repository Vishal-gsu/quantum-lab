import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://quantum-lab-production.up.railway.app';
console.info('[QuantumLab] API_URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    timeout: 60_000,
    headers: { 'Content-Type': 'application/json' },
});

export { api, API_URL };

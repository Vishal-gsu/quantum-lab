import axios from 'axios';

/** Base URL with no trailing slash — safe for axios and EventSource concatenation */
const raw = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = String(raw).replace(/\/+$/, '');

const api = axios.create({
    baseURL: API_URL,
    timeout: 60_000,
    headers: { 'Content-Type': 'application/json' },
});

export { api, API_URL };

import { useState, useEffect } from 'react';
import { api } from '../lib/api.ts';
import type { BackendStatus } from '../types/index.ts';

/**
 * Polls the backend health endpoint every 10 s.
 * Returns the current status so any component can react to it.
 */
export function useBackendHealth(): BackendStatus {
    const [status, setStatus] = useState<BackendStatus>('checking');

    useEffect(() => {
        const check = async () => {
            try {
                await api.get('/');
                setStatus('online');
            } catch {
                setStatus('offline');
            }
        };

        check();
        const id = setInterval(check, 10_000);
        return () => clearInterval(id);
    }, []);

    return status;
}

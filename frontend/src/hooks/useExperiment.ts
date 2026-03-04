import { useState, useCallback } from 'react';
import { api } from '../lib/api.ts';
import type { ExperimentResult } from '../types/index.ts';

interface UseExperimentReturn {
    result: ExperimentResult | null;
    loading: boolean;
    errorMsg: string | null;
    run: (id: string, shots: number) => Promise<void>;
    reset: () => void;
}

/**
 * Hook that encapsulates running a quantum experiment and managing its state.
 */
export function useExperiment(): UseExperimentReturn {
    const [result, setResult] = useState<ExperimentResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const reset = useCallback(() => {
        setResult(null);
        setErrorMsg(null);
    }, []);

    const run = useCallback(async (id: string, shots: number) => {
        setLoading(true);
        setResult(null);
        setErrorMsg(null);

        try {
            let endpoint: string;
            if (id === 'vqe-h2') {
                endpoint = `experiment/vqe-h2?steps=${Math.floor(Math.min(shots / 20, 100)) || 15}`;
            } else if (id === 'vqc') {
                endpoint = `experiment/vqc?steps=${Math.floor(Math.min(shots / 70, 50)) || 15}`;
            } else {
                endpoint = `experiment/${id}?shots=${shots}`;
            }

            const res = await api.get(endpoint);
            setResult(res.data);
        } catch (err: any) {
            if (err.code === 'ECONNABORTED') {
                setErrorMsg('Simulation timed out. Try fewer shots/steps.');
            } else if (err.response?.status === 429) {
                setErrorMsg('Rate limit exceeded. Please wait a moment and try again.');
            } else if (err.response?.data?.detail) {
                setErrorMsg(`Server error: ${err.response.data.detail}`);
            } else {
                setErrorMsg('Connection error. Check if the backend is alive.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return { result, loading, errorMsg, run, reset };
}

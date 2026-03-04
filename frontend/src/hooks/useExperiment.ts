import { useState, useCallback, useRef } from 'react';
import { api } from '../lib/api.ts';
import type { ExperimentResult, ChartDataPoint } from '../types/index.ts';

// Qiskit-based experiments that support the noise toggle
const NOISE_SUPPORTED = new Set(['qrng-1bit', 'coin-flip', 'qrng-8bit', 'grover', 'teleportation']);

// Experiments that support SSE streaming
const SSE_SUPPORTED = new Set(['vqe-h2']);

interface UseExperimentReturn {
    result: ExperimentResult | null;
    loading: boolean;
    errorMsg: string | null;
    progress: number | null;            // 0–1 progress fraction
    liveChart: ChartDataPoint[];        // incrementally built chart data
    run: (id: string, shots: number, noiseEnabled: boolean) => Promise<void>;
    reset: () => void;
}

/**
 * Hook that encapsulates running a quantum experiment and managing its state.
 * Supports both regular GET requests and SSE streaming for heavy experiments.
 */
export function useExperiment(): UseExperimentReturn {
    const [result, setResult] = useState<ExperimentResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [progress, setProgress] = useState<number | null>(null);
    const [liveChart, setLiveChart] = useState<ChartDataPoint[]>([]);
    const eventSourceRef = useRef<EventSource | null>(null);

    const reset = useCallback(() => {
        setResult(null);
        setErrorMsg(null);
        setProgress(null);
        setLiveChart([]);
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    }, []);

    const runSSE = useCallback((url: string) => {
        return new Promise<void>((resolve) => {
            setLiveChart([]);
            setProgress(0);
            const es = new EventSource(url);
            eventSourceRef.current = es;

            es.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.done) {
                        setResult(data.result);
                        setProgress(null);
                        es.close();
                        eventSourceRef.current = null;
                        resolve();
                    } else {
                        setProgress(data.progress);
                        setLiveChart(prev => [...prev, { name: `S${data.epoch}`, value: data.loss }]);
                    }
                } catch {
                    // ignore parse errors
                }
            };

            es.onerror = () => {
                setErrorMsg('SSE connection lost. Try again.');
                setProgress(null);
                es.close();
                eventSourceRef.current = null;
                resolve();
            };
        });
    }, []);

    const run = useCallback(async (id: string, shots: number, noiseEnabled: boolean) => {
        setLoading(true);
        setResult(null);
        setErrorMsg(null);
        setProgress(null);
        setLiveChart([]);

        try {
            // SSE streaming for supported experiments
            if (SSE_SUPPORTED.has(id)) {
                const steps = Math.floor(Math.min(shots / 20, 100)) || 15;
                const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000');
                await runSSE(`${baseUrl}/experiment/${id}/stream?steps=${steps}`);
            } else {
                // Regular GET requests
                let endpoint: string;
                if (id === 'vqe-h2') {
                    endpoint = `experiment/vqe-h2?steps=${Math.floor(Math.min(shots / 20, 100)) || 15}`;
                } else if (id === 'vqc') {
                    endpoint = `experiment/vqc?steps=${Math.floor(Math.min(shots / 70, 50)) || 15}`;
                } else if (id === 'vqe-sweep') {
                    endpoint = `experiment/vqe-sweep?steps=${Math.floor(Math.min(shots / 100, 30)) || 8}`;
                } else if (id === 'barren-plateaus') {
                    endpoint = `experiment/barren-plateaus`;
                } else {
                    endpoint = `experiment/${id}?shots=${shots}`;
                }

                if (noiseEnabled && NOISE_SUPPORTED.has(id)) {
                    endpoint += `&noise=true`;
                }

                const res = await api.get(endpoint);
                setResult(res.data);
            }
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
    }, [runSSE]);

    return { result, loading, errorMsg, progress, liveChart, run, reset };
}

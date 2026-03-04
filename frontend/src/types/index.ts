import { type LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Experiment types
// ---------------------------------------------------------------------------
export interface ExperimentConfig {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    status: 'Ready' | 'WIP';
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ChartDataPoint {
    name: string;
    value: number;
}

export interface ExperimentResult {
    counts?: Record<string, number>;
    chartData: ChartDataPoint[];
    circuit: string;
    theory: string;
    shots?: number;
    finalEnergy?: number;
    molecule?: string;
    finalAccuracy?: number;
    dataset?: string;
    teleportedState?: string;
    targetState?: string;
    iterations?: number;
    noise?: boolean;
    equilibriumDistance?: number;
    equilibriumEnergy?: number;
}

// ---------------------------------------------------------------------------
// Study / Docs types
// ---------------------------------------------------------------------------
export interface DocFile {
    id: string;
    title: string;
    time: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
}

// ---------------------------------------------------------------------------
// Backend status
// ---------------------------------------------------------------------------
export type BackendStatus = 'checking' | 'online' | 'offline';

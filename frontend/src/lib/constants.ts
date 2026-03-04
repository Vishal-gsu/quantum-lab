import { Zap, Binary, Cpu as Chip, Atom, Rocket, Send, Brain } from 'lucide-react';
import type { ExperimentConfig, DocFile } from '../types/index.ts';

export const experiments: ExperimentConfig[] = [
    { id: 'qrng-1bit', name: '1-Bit QRNG', icon: Zap, color: '#facc15', status: 'Ready' },
    { id: 'coin-flip', name: 'Quantum Coin Flip', icon: Binary, color: '#3b82f6', status: 'Ready' },
    { id: 'qrng-8bit', name: '8-Bit QRNG', icon: Chip, color: '#a855f7', status: 'Ready' },
    { id: 'vqe-h2', name: 'VQE Solver', icon: Atom, color: '#22c55e', status: 'Ready' },
    { id: 'grover', name: "Grover's Search", icon: Rocket, color: '#f43f5e', status: 'Ready' },
    { id: 'teleportation', name: 'Teleportation', icon: Send, color: '#06b6d4', status: 'Ready' },
    { id: 'vqc', name: 'VQC Classifier', icon: Brain, color: '#f97316', status: 'Ready' },
];

export const docFiles: DocFile[] = [
    { id: '00_Quick_Reference_Guide.md', title: 'Quick Reference', time: '5 min', level: 'Beginner' },
    { id: '01_Quantum_Computing_Basics.md', title: 'Quantum Basics', time: '15 min', level: 'Beginner' },
    { id: '02_Quantum_Mechanics_Fundamentals.md', title: 'Mechanics 101', time: '25 min', level: 'Intermediate' },
    { id: '03_Quantum_Gates_and_Circuits.md', title: 'Gates & Logic', time: '30 min', level: 'Intermediate' },
    { id: '04_Classical_Machine_Learning_Review.md', title: 'Classical ML', time: '20 min', level: 'Intermediate' },
    { id: '05_Quantum_Machine_Learning_Intro.md', title: 'Intro to QML', time: '40 min', level: 'Advanced' },
];

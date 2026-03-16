import { Zap, Binary, Cpu as Chip, Atom, Rocket, Send, Brain, TrendingDown, Layers } from 'lucide-react';
import type { ExperimentConfig, DocFile } from '../types/index.ts';

export const experiments: ExperimentConfig[] = [
    {
        id: 'qrng-1bit', name: '1-Bit QRNG', icon: Zap, color: '#facc15', status: 'Ready',
        description: 'Generate truly random bits using quantum superposition.',
        difficulty: 'Easy',
    },
    {
        id: 'coin-flip', name: 'Quantum Coin Flip', icon: Binary, color: '#3b82f6', status: 'Ready',
        description: 'Fair coin toss powered by Hadamard-gate superposition.',
        difficulty: 'Easy',
    },
    {
        id: 'qrng-8bit', name: '8-Bit QRNG', icon: Chip, color: '#a855f7', status: 'Ready',
        description: 'Generate random bytes (0–255) from 8 entangled qubits.',
        difficulty: 'Easy',
    },
    {
        id: 'vqe-h2', name: 'VQE Solver', icon: Atom, color: '#22c55e', status: 'Ready',
        description: 'Find the ground-state energy of H₂ using variational optimization.',
        difficulty: 'Hard',
    },
    {
        id: 'grover', name: "Grover's Search", icon: Rocket, color: '#f43f5e', status: 'Ready',
        description: 'Quadratic speedup for searching an unsorted database.',
        difficulty: 'Medium',
    },
    {
        id: 'teleportation', name: 'Teleportation', icon: Send, color: '#06b6d4', status: 'Ready',
        description: 'Transfer a quantum state using entanglement and classical bits.',
        difficulty: 'Medium',
    },
    {
        id: 'vqc', name: 'VQC Classifier', icon: Brain, color: '#f97316', status: 'Ready',
        description: 'Quantum neural network trained on the make_moons dataset.',
        difficulty: 'Hard',
    },
    {
        id: 'vqe-sweep', name: 'VQE Energy Surface', icon: TrendingDown, color: '#10b981', status: 'Ready',
        description: 'Map the H₂ potential energy surface across bond distances.',
        difficulty: 'Hard',
    },
    {
        id: 'barren-plateaus', name: 'Barren Plateaus', icon: Layers, color: '#ec4899', status: 'Ready',
        description: 'Demonstrate vanishing gradients in deep quantum circuits.',
        difficulty: 'Hard',
    },
];

export const docFiles: DocFile[] = [
    { id: '00_Quick_Reference_Guide.md', title: 'Quick Reference', time: '5 min', level: 'Beginner' },
    { id: '01_Quantum_Computing_Basics.md', title: 'Quantum Basics', time: '15 min', level: 'Beginner' },
    { id: '02_Quantum_Mechanics_Fundamentals.md', title: 'Mechanics 101', time: '25 min', level: 'Intermediate' },
    { id: '03_Quantum_Gates_and_Circuits.md', title: 'Gates & Logic', time: '30 min', level: 'Intermediate' },
    { id: '04_Classical_Machine_Learning_Review.md', title: 'Classical ML', time: '20 min', level: 'Intermediate' },
    { id: '05_Quantum_Machine_Learning_Intro.md', title: 'Intro to QML', time: '40 min', level: 'Advanced' },
    { id: '11_Quantum_Computing_Essentials.md', title: 'QC Essentials', time: '60 min', level: 'Advanced' },
    { id: '12_Classical_Genetic_Algorithms.md', title: 'Genetic Algorithms', time: '50 min', level: 'Advanced' },
];

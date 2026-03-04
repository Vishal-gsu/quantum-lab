import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Sparkles, Atom, ChevronRight, Rocket, AlertCircle,
} from 'lucide-react';
import { experiments } from '../lib/constants.ts';
import type { BackendStatus, ExperimentConfig } from '../types/index.ts';

interface DashboardProps {
    backendStatus: BackendStatus;
}

export default function Dashboard({ backendStatus }: DashboardProps) {
    const navigate = useNavigate();

    return (
        <motion.div key="dashboard" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
            {/* Offline Warning */}
            {backendStatus === 'offline' && (
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4 text-red-400">
                    <AlertCircle size={24} />
                    <div>
                        <p className="font-black uppercase text-xs tracking-widest">Backend Connection Failure</p>
                        <p className="text-sm opacity-70">The cloud simulator is not responding. Please verify the VITE_API_URL variable.</p>
                    </div>
                </div>
            )}

            {/* Hero */}
            <div className="bg-[#0f172a]/40 p-16 rounded-[3rem] border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center space-x-3 text-blue-400 font-black text-xs uppercase tracking-[0.4em]">
                        <Sparkles size={16} /> <span>Simulation Intelligence v3.0</span>
                    </div>
                    <h2 className="text-6xl font-black mb-6 tracking-tighter leading-none text-white">The Future <br />Of <span className="text-blue-500">Quantum ML</span></h2>
                    <p className="text-slate-400 max-w-xl text-xl font-medium leading-relaxed">Launch an experiment or explore our professional curriculum. Everything is live and simulated on local Aer-Backends.</p>
                </div>
                <Atom className="absolute right-[-40px] top-[-40px] text-white/5 rotate-12" size={450} />
            </div>

            {/* Experiment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {experiments.map((exp: ExperimentConfig) => (
                    <button key={exp.id} onClick={() => navigate(`/experiment/${exp.id}`)} className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 hover:border-blue-500/40 transition-all text-left group relative overflow-hidden shadow-2xl">
                        {exp.status === 'WIP'
                            ? <span className="absolute top-6 right-6 px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black rounded-full border border-red-500/20 uppercase tracking-widest">In Progress</span>
                            : <span className={`absolute top-6 right-6 px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-widest ${exp.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : exp.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>{exp.difficulty}</span>
                        }
                        <div className="p-4 rounded-2xl mb-6 w-fit bg-[#020617] border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                            <exp.icon style={{ color: exp.color }} size={32} />
                        </div>
                        <h3 className="font-black text-2xl mb-2 text-white">{exp.name}</h3>
                        <p className="text-sm text-slate-500 mb-4 leading-relaxed">{exp.description}</p>
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2 group-hover:text-blue-400 transition-colors">Enter Laboratory <ChevronRight size={14} /></p>
                    </button>
                ))}
            </div>

            {/* Credits */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Rocket className="text-white" size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.3em] mb-1">System Architect</p>
                        <h4 className="text-xl font-black text-white tracking-tight">Vishal Gsu</h4>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <a href="https://github.com/Vishal-gsu" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-[#020617] border border-white/10 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all">GitHub</a>
                    <a href="https://www.linkedin.com/in/vishal-gsu/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all">LinkedIn</a>
                </div>
            </motion.div>
        </motion.div >
    );
}

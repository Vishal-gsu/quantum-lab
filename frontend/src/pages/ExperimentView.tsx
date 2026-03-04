import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Zap, Activity, ChevronLeft, Sparkles, BarChart3,
    Terminal, Image as ImageIcon, AlertCircle, Rocket, Flame,
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, Cell,
} from 'recharts';
import { experiments } from '../lib/constants.ts';
import { useExperiment } from '../hooks/useExperiment.ts';
import SkeletonChart from '../components/SkeletonChart.tsx';
import type { BackendStatus, ExperimentConfig } from '../types/index.ts';

// Experiments that render as AreaChart (training curves / continuous data)
const AREA_CHART_IDS = new Set(['vqe-h2', 'vqc', 'vqe-sweep', 'barren-plateaus']);

// Gradient colors per experiment
const AREA_COLORS: Record<string, string> = {
    'vqe-h2': '#22c55e',
    'vqc': '#f97316',
    'vqe-sweep': '#10b981',
    'barren-plateaus': '#ec4899',
};

interface ExperimentViewProps {
    backendStatus: BackendStatus;
    shots: number;
    noiseEnabled: boolean;
}

export default function ExperimentView({ backendStatus, shots, noiseEnabled }: ExperimentViewProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { result, loading, errorMsg, progress, liveChart, run, reset } = useExperiment();
    const exp = experiments.find((e: ExperimentConfig) => e.id === id);

    // Reset result when switching experiments via URL
    useEffect(() => { reset(); }, [id, reset]);

    if (!exp) {
        navigate('/');
        return null;
    }

    // Loading text varies by experiment type
    const loadingText = id === 'vqe-sweep' ? 'Computing Energy Surface...'
        : id === 'barren-plateaus' ? 'Sampling Gradients...'
            : id === 'vqe-h2' ? 'Training...'
                : id === 'vqc' ? 'Training Classifier...'
                    : 'Simulating...';

    const areaColor = AREA_COLORS[id || ''] || '#3b82f6';

    return (
        <motion.div key="experiment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
            {/* Header Row */}
            <div className="flex justify-between items-center">
                <div className="space-y-4">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white mb-4"><ChevronLeft size={14} /> Back to Dashboard</button>
                    <div className="flex items-center gap-4">
                        <h2 className="text-5xl font-black tracking-tighter text-white">{exp.name}</h2>
                        {result?.noise && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-[10px] font-black uppercase tracking-widest">
                                <Flame size={12} className="animate-pulse" /> Noisy
                            </span>
                        )}
                    </div>
                </div>
                {exp.status !== 'WIP' && (
                    <button onClick={() => run(exp.id, shots, noiseEnabled)} disabled={loading || backendStatus === 'offline'} className={`px-12 py-5 rounded-2xl font-black transition-all shadow-2xl flex items-center space-x-4 uppercase tracking-widest text-sm ${backendStatus === 'offline' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:bg-blue-600 hover:text-white'}`}>
                        {loading ? <Activity className="animate-spin" size={20} /> : <Zap size={20} />}
                        <span>{loading ? loadingText : (backendStatus === 'offline' ? 'Offline' : 'Run Protocol')}</span>
                    </button>
                )}
            </div>

            {/* Error */}
            {errorMsg && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2.5rem] flex items-start gap-6 text-red-400">
                    <AlertCircle size={32} className="shrink-0" />
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-sm mb-2 text-red-500">Execution Error</h4>
                        <p className="text-lg font-medium">{errorMsg}</p>
                        <p className="text-xs mt-4 opacity-60">Check the backend logs for trace details.</p>
                    </div>
                </motion.div>
            )}

            {exp.status === 'WIP' ? (
                <div className="bg-slate-900 border border-white/5 rounded-[4rem] p-32 text-center space-y-8 relative overflow-hidden">
                    <Rocket size={100} className="mx-auto text-orange-500 animate-pulse" />
                    <h3 className="text-4xl font-black">Coming Soon</h3>
                    <p className="text-slate-500 max-w-lg mx-auto text-xl">This experiment is under active development. Check back in the next release!</p>
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent pointer-events-none" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-3 space-y-12">
                        {/* Theory */}
                        {result?.theory && (
                            <div className={`border rounded-[3rem] p-12 flex gap-10 items-start ${result.noise ? 'bg-amber-600/10 border-amber-500/20' : 'bg-blue-600/10 border-blue-500/20'}`}>
                                <Sparkles className={`shrink-0 ${result.noise ? 'text-amber-500' : 'text-blue-500'}`} size={40} />
                                <div>
                                    <h4 className={`text-xs font-black uppercase tracking-[0.4em] mb-4 ${result.noise ? 'text-amber-400' : 'text-blue-400'}`}>Quantum Knowledge Base</h4>
                                    <p className="text-slate-300 text-xl font-medium leading-relaxed italic">"{result.theory}"</p>
                                </div>
                            </div>
                        )}

                        {/* Chart */}
                        <div className="bg-slate-900/50 border border-white/5 rounded-[3rem] p-14 backdrop-blur-md shadow-inner relative">
                            {loading && (
                                <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-sm rounded-[3rem] flex flex-col items-center justify-center space-y-6">
                                    {progress != null ? (
                                        <>
                                            <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress * 100}%` }} />
                                            </div>
                                            <p className="font-black text-xs uppercase tracking-[0.5em] text-blue-400">
                                                Epoch {Math.round(progress * (Math.floor(Math.min(shots / 20, 100)) || 15))}/{Math.floor(Math.min(shots / 20, 100)) || 15}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            <p className="font-black text-xs uppercase tracking-[0.5em] animate-pulse">{loadingText}</p>
                                        </>
                                    )}
                                </div>
                            )}
                            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 mb-12 flex items-center gap-4">
                                <BarChart3 size={20} className="text-blue-500" />
                                {id === 'vqe-sweep' ? 'Potential Energy Surface' : id === 'barren-plateaus' ? 'Gradient Variance vs Depth' : 'Statistical Amplitude Distribution'}
                            </h3>
                            <div className="w-full h-[400px]">
                                {(result?.chartData || liveChart.length > 0) ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        {AREA_CHART_IDS.has(id || '') ? (
                                            <AreaChart data={result?.chartData || liveChart}>
                                                <defs><linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={areaColor} stopOpacity={0.2} /><stop offset="95%" stopColor={areaColor} stopOpacity={0} /></linearGradient></defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                                <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '15px' }} />
                                                <Area type="monotone" dataKey="value" stroke={areaColor} strokeWidth={5} fill="url(#colorVal)" dot={{ r: 6, fill: areaColor, strokeWidth: 2, stroke: '#020617' }} />
                                            </AreaChart>
                                        ) : (
                                            <BarChart data={result?.chartData || []}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                                <XAxis dataKey="name" stroke="#475569" fontSize={10} hide={id === 'qrng-8bit'} axisLine={false} tickLine={false} />
                                                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '15px' }} />
                                                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={id === 'qrng-8bit' ? 2 : 120}>
                                                    {(result?.chartData || []).map((_: unknown, i: number) => <Cell key={`c-${i}`} fill={i % 2 === 0 ? '#3b82f6' : '#6366f1'} />)}
                                                </Bar>
                                            </BarChart>
                                        )}
                                    </ResponsiveContainer>
                                ) : (
                                    <SkeletonChart variant={AREA_CHART_IDS.has(id || '') ? 'area' : 'bar'} barCount={id === 'qrng-8bit' ? 16 : 6} />
                                )}
                            </div>
                        </div>

                        {/* Circuit section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#020617] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group min-h-[350px]">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-3"><ImageIcon size={18} className="text-blue-500" /> Circuit Blueprint</h3>
                                <div className="w-full h-48 bg-slate-900/50 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center p-6">
                                    <Sparkles size={32} className="text-slate-700 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">circuit-{id}.png placeholder</p>
                                </div>
                            </div>
                            <div className="bg-[#020617] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-3"><Terminal size={18} className="text-purple-500" /> Compiled ASCII Logic</h3>
                                <div className="bg-black/60 rounded-2xl p-6 border border-white/5 overflow-x-auto h-48 scrollbar-hide">
                                    <pre className="text-indigo-400 font-mono text-xs leading-none whitespace-pre italic select-all">
                                        {result?.circuit || '// No Logic Compiled'}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Sidebar */}
                    <div className="space-y-10">
                        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-sm">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-10">System Status</h3>
                            <div className="space-y-8">
                                {[{ l: 'Simulator', v: 'Aer 0.17' }, { l: 'Architecture', v: 'Statevector' }, { l: 'Compiler', v: 'Level 3' }].map(i => (
                                    <div key={i.l} className="flex flex-col gap-2 border-b border-white/5 pb-6 last:border-0"><span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">{i.l}</span><span className="text-xs font-black text-white">{i.v}</span></div>
                                ))}
                                {result?.finalEnergy && <div className="pt-6"><p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-3">Ground State Potential</p><p className="text-5xl font-black text-white tracking-tighter">{result.finalEnergy.toFixed(5)} <span className="text-xs text-slate-500 font-bold">Ha</span></p></div>}
                                {result?.finalAccuracy != null && <div className="pt-6"><p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-3">Classification Accuracy</p><p className="text-5xl font-black text-white tracking-tighter">{(result.finalAccuracy * 100).toFixed(1)}<span className="text-xs text-slate-500 font-bold">%</span></p></div>}
                                {result?.equilibriumDistance != null && (
                                    <div className="pt-6 space-y-4">
                                        <div><p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3">Equilibrium Distance</p><p className="text-4xl font-black text-white tracking-tighter">{result.equilibriumDistance.toFixed(1)} <span className="text-xs text-slate-500 font-bold">Å</span></p></div>
                                        <div><p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3">Min Energy</p><p className="text-3xl font-black text-white tracking-tighter">{result.equilibriumEnergy?.toFixed(5)} <span className="text-xs text-slate-500 font-bold">Ha</span></p></div>
                                    </div>
                                )}
                                {result?.noise && (
                                    <div className="pt-6">
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                                            <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2">Noise Model</p>
                                            <p className="text-xs text-amber-300/70 leading-relaxed">Depolarizing: 1% (1q) / 2% (2q)</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

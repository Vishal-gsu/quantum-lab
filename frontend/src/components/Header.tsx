import { ChevronRight, Settings, Zap, Flame } from 'lucide-react';
import type { BackendStatus } from '../types';

interface HeaderProps {
    backendStatus: BackendStatus;
    activeLabel: string;
    shots: number;
    onShotsChange: (v: number) => void;
    noiseEnabled: boolean;
    onNoiseToggle: (v: boolean) => void;
}

export default function Header({ backendStatus, activeLabel, shots, onShotsChange, noiseEnabled, onNoiseToggle }: HeaderProps) {
    return (
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 sticky top-0 backdrop-blur-xl z-40 bg-[#020617]/60">
            <div className="flex items-center space-x-4">
                <div className={`h-2 w-2 rounded-full animate-ping ${backendStatus === 'online' ? 'bg-blue-500' : 'bg-red-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">API Status: {backendStatus.toUpperCase()}</span>
                <ChevronRight size={14} className="text-slate-700" />
                <span className="text-white font-black text-sm uppercase tracking-widest">{activeLabel}</span>
            </div>
            <div className="flex items-center gap-4">
                {/* Noise Toggle */}
                <button
                    onClick={() => onNoiseToggle(!noiseEnabled)}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all ${noiseEnabled
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]'
                            : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
                        }`}
                >
                    {noiseEnabled ? <Flame size={14} className="animate-pulse" /> : <Zap size={14} />}
                    <span>{noiseEnabled ? 'Noisy' : 'Ideal'}</span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${noiseEnabled ? 'bg-amber-500' : 'bg-slate-700'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${noiseEnabled ? 'left-4' : 'left-0.5'}`} />
                    </div>
                </button>

                {/* Settings */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5">
                    <Settings size={16} className="text-blue-500 mr-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-4">Opt-Level 3</span>
                    <input
                        type="number"
                        value={shots}
                        onChange={e => onShotsChange(Number(e.target.value))}
                        className="bg-transparent text-white w-20 focus:outline-none text-sm font-black border-l border-white/10 pl-4 ml-2"
                    />
                </div>
            </div>
        </header>
    );
}

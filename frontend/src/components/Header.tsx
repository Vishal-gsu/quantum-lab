import { ChevronRight, Settings } from 'lucide-react';
import type { BackendStatus } from '../types';

interface HeaderProps {
    backendStatus: BackendStatus;
    activeLabel: string;
    shots: number;
    onShotsChange: (v: number) => void;
}

export default function Header({ backendStatus, activeLabel, shots, onShotsChange }: HeaderProps) {
    return (
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 sticky top-0 backdrop-blur-xl z-40 bg-[#020617]/60">
            <div className="flex items-center space-x-4">
                <div className={`h-2 w-2 rounded-full animate-ping ${backendStatus === 'online' ? 'bg-blue-500' : 'bg-red-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">API Status: {backendStatus.toUpperCase()}</span>
                <ChevronRight size={14} className="text-slate-700" />
                <span className="text-white font-black text-sm uppercase tracking-widest">{activeLabel}</span>
            </div>
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
        </header>
    );
}

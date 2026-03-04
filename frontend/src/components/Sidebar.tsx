import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Atom, BookOpen, LayoutDashboard, Lock,
    Wifi, WifiOff,
} from 'lucide-react';
import { experiments } from '../lib/constants.ts';
import type { BackendStatus, ExperimentConfig } from '../types/index.ts';

// ---------------------------------------------------------------------------
// SidebarItem
// ---------------------------------------------------------------------------
interface SidebarItemProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    active: boolean;
    collapsed: boolean;
    onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: SidebarItemProps) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all relative group mb-1 ${active
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        <div className="flex items-center justify-center min-w-[24px]">
            <Icon size={20} className={active ? 'animate-pulse' : ''} />
        </div>
        <motion.span
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', marginLeft: collapsed ? 0 : 12 }}
            className="font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden"
        >
            {label}
        </motion.span>
    </button>
);

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
interface SidebarProps {
    collapsed: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    backendStatus: BackendStatus;
}

export default function Sidebar({ collapsed, onMouseEnter, onMouseLeave, backendStatus }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const isDashboard = location.pathname === '/';
    const isStudy = location.pathname.startsWith('/study');
    const activeExpId = location.pathname.startsWith('/experiment/')
        ? location.pathname.split('/experiment/')[1]
        : null;

    return (
        <motion.aside
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            animate={{ width: collapsed ? 90 : 280 }}
            className="bg-[#0f172a]/80 border-r border-white/5 flex flex-col z-50 backdrop-blur-3xl shadow-2xl"
        >
            {/* Logo */}
            <div className="p-8 h-24 flex items-center overflow-hidden">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl flex-shrink-0 shadow-lg shadow-blue-500/20">
                    <Atom className="text-white animate-spin-slow" size={24} />
                </div>
                {!collapsed && (
                    <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-4 text-xl font-black tracking-tighter text-white uppercase">
                        Quantum<span className="text-blue-500">Lab</span>
                    </motion.h1>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-10 custom-scrollbar">
                <div className="space-y-1">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active={isDashboard} collapsed={collapsed} onClick={() => navigate('/')} />
                </div>

                <div className="space-y-1">
                    {!collapsed && <p className="px-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 text-center">Laboratory</p>}
                    {experiments.map((exp: ExperimentConfig) => (
                        <SidebarItem
                            key={exp.id}
                            icon={exp.status === 'WIP' ? Lock : exp.icon}
                            label={exp.name}
                            active={activeExpId === exp.id}
                            collapsed={collapsed}
                            onClick={() => navigate(`/experiment/${exp.id}`)}
                        />
                    ))}
                </div>

                <div className="space-y-1">
                    <SidebarItem icon={BookOpen} label="Curriculum" active={isStudy} collapsed={collapsed} onClick={() => navigate('/study')} />
                </div>
            </div>

            {/* Connection Indicator */}
            <div className="p-6 border-t border-white/5 bg-black/20">
                <div className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors ${backendStatus === 'online' ? 'bg-green-500/5 border-green-500/20 text-green-500' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                    {backendStatus === 'online' ? <Wifi size={16} /> : <WifiOff size={16} />}
                    {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest">{backendStatus === 'online' ? 'Backend Live' : 'Backend Offline'}</span>}
                </div>
            </div>
        </motion.aside>
    );
}

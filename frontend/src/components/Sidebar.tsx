import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Atom,
  BookOpen,
  LayoutDashboard,
  Lock,
  Wifi,
  WifiOff,
  FlaskConical,
  Sparkles,
} from 'lucide-react';
import { experiments } from '../lib/constants.ts';
import type { BackendStatus, ExperimentConfig } from '../types/index.ts';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
  accent?: 'teal' | 'violet' | 'neutral';
}

const accentRing = {
  teal: 'shadow-[0_0_0_1px_rgba(45,212,191,0.35)] bg-teal-500/15 text-teal-100',
  violet: 'shadow-[0_0_0_1px_rgba(167,139,250,0.35)] bg-violet-500/15 text-violet-100',
  neutral: 'bg-white/[0.06] text-slate-200',
};

function SidebarItem({ icon: Icon, label, active, onClick, collapsed, accent = 'neutral' }: SidebarItemProps) {
  const activeCls =
    accent === 'teal'
      ? 'bg-gradient-to-r from-teal-600/90 to-emerald-700/80 text-white shadow-lg shadow-teal-900/40'
      : accent === 'violet'
        ? 'bg-gradient-to-r from-violet-600/90 to-indigo-700/80 text-white shadow-lg shadow-violet-900/40'
        : `${accentRing.neutral} ring-1 ring-white/10`;

  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`mb-1 flex w-full items-center rounded-xl px-3 py-2.5 text-left transition-all ${
        active ? activeCls : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-100'
      }`}
    >
      <span className="flex min-w-[22px] justify-center">
        <Icon size={18} />
      </span>
      <motion.span
        initial={false}
        animate={{
          opacity: collapsed ? 0 : 1,
          width: collapsed ? 0 : 'auto',
          marginLeft: collapsed ? 0 : 10,
        }}
        className="overflow-hidden whitespace-nowrap text-[13px] font-semibold tracking-tight"
      >
        {label}
      </motion.span>
    </button>
  );
}

function SectionLabel({ collapsed, children }: { collapsed: boolean; children: React.ReactNode }) {
  if (collapsed) return <div className="mx-2 my-3 h-px bg-white/10" />;
  return (
    <p className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 first:mt-0">
      {children}
    </p>
  );
}

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
  const isLabAnchor = location.pathname === '/' && location.hash === '#lab';
  const activeExpId = location.pathname.startsWith('/experiment/')
    ? location.pathname.split('/experiment/')[1]
    : null;

  return (
    <motion.aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      animate={{ width: collapsed ? 88 : 272 }}
      className="relative z-50 flex shrink-0 flex-col border-r border-[var(--learn-border)] bg-[#080d18]/95 shadow-[8px_0_40px_-20px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
    >
      <div className="flex h-[72px] items-center gap-3 overflow-hidden px-4 pt-2">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg shadow-teal-900/50">
          <Atom className="text-white" size={22} />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal-400/90">Learning space</p>
            <h1 className="truncate text-base font-bold tracking-tight text-white">
              Quantum<span className="text-teal-400">Lab</span>
            </h1>
          </motion.div>
        )}
      </div>

      <nav className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-2 pb-4 pt-2">
        <SectionLabel collapsed={collapsed}>Start</SectionLabel>
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          active={isDashboard}
          collapsed={collapsed}
          accent="teal"
          onClick={() => navigate('/')}
        />

        <SectionLabel collapsed={collapsed}>Learn</SectionLabel>
        <SidebarItem
          icon={FlaskConical}
          label="Experiment hub"
          active={isLabAnchor}
          collapsed={collapsed}
          onClick={() => navigate({ pathname: '/', hash: 'lab' })}
        />
        <SidebarItem
          icon={BookOpen}
          label="Curriculum"
          active={isStudy}
          collapsed={collapsed}
          accent="violet"
          onClick={() => navigate('/study')}
        />

        <SectionLabel collapsed={collapsed}>Protocols</SectionLabel>
        {!collapsed && (
          <p className="mb-2 px-3 text-[11px] leading-snug text-slate-600">
            Pick a simulation — same controls as the header (shots & noise).
          </p>
        )}
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
      </nav>

      <div className="border-t border-[var(--learn-border)] bg-black/25 p-3">
        <div
          className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 ${
            backendStatus === 'online'
              ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-300'
              : 'border-rose-500/25 bg-rose-500/5 text-rose-300'
          }`}
        >
          {backendStatus === 'online' ? <Wifi size={15} /> : <WifiOff size={15} />}
          {!collapsed && (
            <span className="text-[11px] font-semibold">
              {backendStatus === 'online' ? 'API connected' : 'API unreachable'}
            </span>
          )}
        </div>
        {!collapsed && (
          <p className="mt-2 flex items-center gap-1.5 px-1 text-[10px] text-slate-600">
            <Sparkles size={11} className="text-violet-400" />
            Qiskit · PennyLane · Aer
          </p>
        )}
      </div>
    </motion.aside>
  );
}

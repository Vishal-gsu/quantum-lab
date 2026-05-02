import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight, Settings, Zap, Flame, GraduationCap, FlaskConical } from 'lucide-react';
import { experiments, docFiles } from '../lib/constants.ts';
import type { BackendStatus } from '../types';

interface HeaderProps {
  backendStatus: BackendStatus;
  shots: number;
  onShotsChange: (v: number) => void;
  noiseEnabled: boolean;
  onNoiseToggle: (v: boolean) => void;
}

function useHeaderCrumb(): { kicker: string; title: string; icon: LucideIcon } {
  const { pathname } = useLocation();
  return useMemo(() => {
    if (pathname === '/') {
      return { kicker: 'Learning hub', title: 'Dashboard', icon: GraduationCap };
    }
    if (pathname.startsWith('/study/')) {
      const id = pathname.replace('/study/', '');
      const doc = docFiles.find(d => d.id === id);
      return {
        kicker: 'Curriculum',
        title: doc?.title ?? 'Lesson',
        icon: GraduationCap,
      };
    }
    if (pathname === '/study') {
      return { kicker: 'Curriculum', title: 'All modules', icon: GraduationCap };
    }
    if (pathname.startsWith('/experiment/')) {
      const id = pathname.replace('/experiment/', '');
      const exp = experiments.find(e => e.id === id);
      return {
        kicker: 'Experiment lab',
        title: exp?.name ?? 'Experiment',
        icon: FlaskConical,
      };
    }
    return { kicker: 'Quantum Lab', title: 'Explore', icon: GraduationCap };
  }, [pathname]);
}

export default function Header({
  backendStatus,
  shots,
  onShotsChange,
  noiseEnabled,
  onNoiseToggle,
}: HeaderProps) {
  const crumb = useHeaderCrumb();
  const Icon = crumb.icon;

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-[var(--learn-border)] bg-[#070b14]/85 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              backendStatus === 'online'
                ? 'border-teal-500/30 bg-teal-500/10 text-teal-300'
                : 'border-rose-500/25 bg-rose-500/10 text-rose-300'
            }`}
          >
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span className="text-teal-400/90">{crumb.kicker}</span>
              <ChevronRight size={12} className="text-slate-600" />
              <span
                className={
                  backendStatus === 'online' ? 'text-emerald-400/90' : 'text-rose-400/90'
                }
              >
                {backendStatus === 'online' ? 'Simulator online' : 'Simulator offline'}
              </span>
            </div>
            <h1 className="truncate text-lg font-bold tracking-tight text-white sm:text-xl">{crumb.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => onNoiseToggle(!noiseEnabled)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
              noiseEnabled
                ? 'border-amber-400/35 bg-amber-500/10 text-amber-200 shadow-[0_0_20px_-8px_rgba(251,191,36,0.5)]'
                : 'border-[var(--learn-border)] bg-[var(--learn-surface)] text-slate-400 hover:border-slate-500/40 hover:text-slate-200'
            }`}
          >
            {noiseEnabled ? <Flame size={14} className="text-amber-400" /> : <Zap size={14} />}
            <span>{noiseEnabled ? 'Noise on' : 'Ideal'}</span>
            <span
              className={`relative ml-1 h-5 w-9 rounded-full transition-colors ${
                noiseEnabled ? 'bg-amber-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  noiseEnabled ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </span>
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-[var(--learn-border)] bg-[var(--learn-surface)] px-3 py-2">
            <Settings size={15} className="text-violet-400" />
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:inline">
              Shots
            </span>
            <input
              type="number"
              min={1}
              value={shots}
              onChange={e => onShotsChange(Number(e.target.value))}
              className="w-20 border-l border-white/10 bg-transparent pl-2 text-sm font-semibold text-white focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

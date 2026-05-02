import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Atom,
  ChevronRight,
  Rocket,
  AlertCircle,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Layers,
  Cpu,
} from 'lucide-react';
import { experiments, docFiles } from '../lib/constants.ts';
import type { BackendStatus, ExperimentConfig } from '../types/index.ts';

interface DashboardProps {
  backendStatus: BackendStatus;
}

const diffStyles: Record<string, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/25',
  Medium: 'bg-amber-500/15 text-amber-200 ring-amber-500/25',
  Hard: 'bg-rose-500/15 text-rose-200 ring-rose-500/25',
};

export default function Dashboard({ backendStatus }: DashboardProps) {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname === '/' && hash === '#lab') {
      document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [pathname, hash]);

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="dashboard-quantum-shell space-y-10 pb-16 sm:space-y-14"
    >
      {backendStatus === 'offline' && (
        <div className="flex items-start gap-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-5 text-rose-100">
          <AlertCircle className="mt-0.5 shrink-0" size={22} />
          <div>
            <p className="text-sm font-bold text-rose-200">Simulator not reachable</p>
            <p className="mt-1 text-sm text-rose-200/80">
              Set <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">VITE_API_URL</code> to your
              API and check CORS. Experiments stay available to browse.
            </p>
          </div>
        </div>
      )}

      {/* Hero — animated gradient frame (dashboard only) */}
      <div className="dashboard-hero-frame">
        <section className="dashboard-hero-inner relative overflow-hidden p-8 shadow-2xl sm:p-10 lg:p-12">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl"
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.75, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 left-1/4 h-52 w-52 rounded-full bg-violet-500/15 blur-3xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <div className="relative max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-200">
            <Sparkles size={14} />
            Interactive curriculum &amp; simulations
          </div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Learn quantum computing
            <span className="bg-gradient-to-r from-teal-300 to-violet-300 bg-clip-text text-transparent"> like a course</span>
            — then run it in the lab.
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Structured modules build intuition and math; the experiment bench connects every idea to a real
            circuit on the Aer simulator. Use the sidebar to jump in anywhere.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/study')}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-500"
            >
              <GraduationCap size={18} />
              Start curriculum
            </button>
            <button
              type="button"
              onClick={() => navigate({ pathname: '/', hash: 'lab' })}
              className="inline-flex items-center gap-2 rounded-xl border border-teal-500/35 bg-teal-500/10 px-5 py-3 text-sm font-semibold text-teal-100 transition hover:bg-teal-500/20"
            >
              <FlaskConical size={18} />
              Jump to experiments
            </button>
          </div>
        </div>
        </section>
      </div>

      {/* Learning paths — two pillars */}
      <section className="grid gap-5 lg:grid-cols-2">
        <motion.button
          type="button"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          onClick={() => navigate('/study')}
          className="group relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/80 to-[#0f1628] p-8 text-left shadow-xl transition-shadow duration-300 hover:border-violet-400/50 hover:shadow-[0_0_40px_-12px_rgba(167,139,250,0.25)]"
        >
          <div className="absolute right-6 top-6 rounded-2xl bg-violet-500/15 p-4 text-violet-300 ring-1 ring-violet-400/30 transition group-hover:scale-105">
            <BookOpen size={28} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-300/90">Curriculum</p>
          <h3 className="mt-3 max-w-[14rem] text-2xl font-bold text-white">{docFiles.length} guided modules</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
            From qubits and Dirac notation to Qiskit, algorithms, and QML projects — with readable math and code
            samples.
          </p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-violet-200">
            Open learning path <ChevronRight size={16} className="transition group-hover:translate-x-1" />
          </span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          onClick={() => navigate({ pathname: '/', hash: 'lab' })}
          className="group relative overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-950/50 to-[#0f1628] p-8 text-left shadow-xl transition-shadow duration-300 hover:border-teal-400/50 hover:shadow-[0_0_40px_-12px_rgba(45,212,191,0.22)]"
        >
          <div className="absolute right-6 top-6 rounded-2xl bg-teal-500/15 p-4 text-teal-300 ring-1 ring-teal-400/30 transition group-hover:scale-105">
            <FlaskConical size={28} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-teal-300/90">Experiment lab</p>
          <h3 className="mt-3 max-w-[14rem] text-2xl font-bold text-white">{experiments.length} live simulations</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
            QRNG, Grover, teleportation, VQE, VQC, barren plateaus, and more — charts and circuit diagrams after each
            run.
          </p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-200">
            Browse protocols <ChevronRight size={16} className="transition group-hover:translate-x-1" />
          </span>
        </motion.button>
      </section>

      {/* Stats strip — soft quantum glow (static, no flicker) */}
      <section className="grid grid-cols-2 gap-3 rounded-2xl border border-teal-500/15 bg-[#050a14]/55 p-3 shadow-[0_0_48px_-18px_rgba(45,212,191,0.14),0_0_40px_-20px_rgba(167,139,250,0.1)] sm:grid-cols-4">
        {[
          { label: 'Modules', value: String(docFiles.length), icon: Layers },
          { label: 'Experiments', value: String(experiments.length), icon: Cpu },
          {
            label: 'API',
            value: backendStatus === 'online' ? 'Ready' : 'Down',
            icon: backendStatus === 'online' ? Atom : AlertCircle,
            warn: backendStatus !== 'online',
          },
          { label: 'Stack', value: 'Qiskit + PL', icon: Sparkles },
        ].map(row => (
          <div
            key={row.label}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-4 ${
              'warn' in row && row.warn
                ? 'border-rose-500/20 bg-rose-500/5'
                : 'border-[var(--learn-border)] bg-[var(--learn-surface)]'
            }`}
          >
            <row.icon
              size={22}
              className={
                'warn' in row && row.warn ? 'text-rose-300' : 'text-teal-400/90'
              }
            />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{row.label}</p>
              <p className="text-lg font-bold text-white">{row.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Experiment grid */}
      <section id="lab" className="scroll-mt-28 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-teal-400/90">Experiment lab</p>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">Choose a protocol</h3>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              Each card opens a dedicated lab view with theory, results, and circuit layout.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {experiments.map((exp: ExperimentConfig, i: number) => (
            <motion.button
              key={exp.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate(`/experiment/${exp.id}`)}
              className="group relative overflow-hidden rounded-2xl border border-[var(--learn-border)] bg-[var(--learn-surface)] p-6 text-left shadow-lg transition-[box-shadow,border-color] duration-300 hover:border-teal-400/40 hover:bg-[var(--learn-surface-hover)] hover:shadow-[0_0_32px_-10px_rgba(45,212,191,0.2)]"
            >
              {exp.status === 'WIP' ? (
                <span className="absolute right-4 top-4 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-300">
                  Soon
                </span>
              ) : (
                <span
                  className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${diffStyles[exp.difficulty] ?? diffStyles.Medium}`}
                >
                  {exp.difficulty}
                </span>
              )}
              <div
                className="mb-5 inline-flex rounded-xl border border-white/10 bg-[#070b14] p-3 shadow-inner transition group-hover:scale-105"
                style={{ boxShadow: `0 0 24px -8px ${exp.color}55` }}
              >
                <exp.icon style={{ color: exp.color }} size={26} strokeWidth={2} />
              </div>
              <h4 className="text-lg font-bold text-white">{exp.name}</h4>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{exp.description}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-400/90">
                Open lab <ChevronRight size={14} className="transition group-hover:translate-x-0.5" />
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Credits */}
      <footer className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-[var(--learn-border)] bg-[var(--learn-surface)] p-8 sm:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-violet-600 shadow-lg">
            <Rocket className="text-white" size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Project</p>
            <p className="text-lg font-bold text-white">Vishal Gsu</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <a
            href="https://github.com/Vishal-gsu"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-[#070b14] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:border-white/20 hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/vishal-gsu/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-teal-900/30 transition hover:bg-teal-500"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </motion.div>
  );
}

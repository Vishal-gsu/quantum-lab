import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Activity,
  ChevronLeft,
  Sparkles,
  BarChart3,
  Terminal,
  AlertCircle,
  Rocket,
  Flame,
  Cpu,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import { experiments } from '../lib/constants.ts';
import { useExperiment } from '../hooks/useExperiment.ts';
import SkeletonChart from '../components/SkeletonChart.tsx';
import type { BackendStatus, ExperimentConfig } from '../types/index.ts';

const AREA_CHART_IDS = new Set(['vqe-h2', 'vqc', 'vqe-sweep', 'barren-plateaus']);

const AREA_COLORS: Record<string, string> = {
  'vqe-h2': '#34d399',
  vqc: '#fb923c',
  'vqe-sweep': '#2dd4bf',
  'barren-plateaus': '#f472b6',
};

const chartTooltipStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid rgba(99,116,154,0.35)',
  borderRadius: '12px',
  fontSize: '12px',
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

  useEffect(() => {
    reset();
  }, [id, reset]);

  if (!exp) {
    navigate('/');
    return null;
  }

  const loadingText =
    id === 'vqe-sweep'
      ? 'Mapping energy surface…'
      : id === 'barren-plateaus'
        ? 'Sampling gradients…'
        : id === 'vqe-h2'
          ? 'Optimizing VQE…'
          : id === 'vqc'
            ? 'Training classifier…'
            : 'Simulating…';

  const areaColor = AREA_COLORS[id || ''] || '#2dd4bf';

  return (
    <motion.div
      key="experiment"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8 pb-12 sm:space-y-10"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:text-teal-300"
          >
            <ChevronLeft size={14} />
            Back to hub
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{exp.name}</h2>
            {result?.noise && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/35 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-200">
                <Flame size={12} className="animate-pulse" />
                Noise model
              </span>
            )}
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">{exp.description}</p>
        </div>
        {exp.status !== 'WIP' && (
          <button
            type="button"
            onClick={() => run(exp.id, shots, noiseEnabled)}
            disabled={loading || backendStatus === 'offline'}
            className={`inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl px-8 py-4 text-sm font-bold uppercase tracking-wide shadow-xl transition sm:min-w-[220px] ${
              backendStatus === 'offline'
                ? 'cursor-not-allowed bg-slate-800 text-slate-500'
                : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-400 hover:to-emerald-500'
            }`}
          >
            {loading ? <Activity className="animate-spin" size={22} /> : <Zap size={22} />}
            {loading ? loadingText : backendStatus === 'offline' ? 'Offline' : 'Run simulation'}
          </button>
        )}
      </div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-6 text-rose-100"
        >
          <AlertCircle size={26} className="mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-200">Run failed</h4>
            <p className="mt-2 text-sm font-medium">{errorMsg}</p>
          </div>
        </motion.div>
      )}

      {exp.status === 'WIP' ? (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--learn-surface)] px-8 py-20 text-center">
          <Rocket size={72} className="mx-auto text-amber-400" />
          <h3 className="mt-6 text-2xl font-bold text-white">Coming soon</h3>
          <p className="mx-auto mt-3 max-w-md text-slate-400">This protocol is still being wired up.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="space-y-8 xl:col-span-8">
            {result?.theory && (
              <div
                className={`rounded-2xl border p-6 sm:p-8 ${
                  result.noise
                    ? 'border-amber-500/25 bg-amber-500/[0.07]'
                    : 'border-teal-500/20 bg-teal-500/[0.06]'
                }`}
              >
                <div className="flex gap-4 sm:gap-6">
                  <Sparkles
                    className={`mt-1 shrink-0 ${result.noise ? 'text-amber-400' : 'text-teal-400'}`}
                    size={28}
                  />
                  <div>
                    <h4
                      className={`text-[11px] font-bold uppercase tracking-[0.25em] ${
                        result.noise ? 'text-amber-300' : 'text-teal-300'
                      }`}
                    >
                      What this run demonstrates
                    </h4>
                    <p className="mt-3 text-base font-medium leading-relaxed text-slate-200 sm:text-lg">
                      {result.theory}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="relative overflow-hidden rounded-2xl border border-[var(--learn-border)] bg-[var(--learn-surface)] p-6 sm:p-8">
              {loading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 rounded-2xl bg-[#070b14]/75 backdrop-blur-sm">
                  {progress != null ? (
                    <>
                      <div className="h-2 w-56 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-violet-500 transition-all duration-300"
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-teal-300">
                        Step{' '}
                        {Math.round(progress * (Math.floor(Math.min(shots / 20, 100)) || 15))} /{' '}
                        {Math.floor(Math.min(shots / 20, 100)) || 15}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="h-12 w-12 animate-spin rounded-full border-2 border-teal-400 border-t-transparent" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">{loadingText}</p>
                    </>
                  )}
                </div>
              )}
              <h3 className="mb-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">
                <BarChart3 size={18} className="text-teal-400" />
                {id === 'vqe-sweep'
                  ? 'Potential energy surface'
                  : id === 'barren-plateaus'
                    ? 'Gradient variance vs depth'
                    : 'Measurement statistics'}
              </h3>
              <div className="h-[340px] w-full sm:h-[400px]">
                {result?.chartData || liveChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {AREA_CHART_IDS.has(id || '') ? (
                      <AreaChart data={result?.chartData || liveChart}>
                        <defs>
                          <linearGradient id="expAreaFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={areaColor} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={chartTooltipStyle} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={areaColor}
                          strokeWidth={3}
                          fill="url(#expAreaFill)"
                          dot={{ r: 4, fill: areaColor, strokeWidth: 0 }}
                        />
                      </AreaChart>
                    ) : (
                      <BarChart data={result?.chartData || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                        <XAxis
                          dataKey="name"
                          stroke="#64748b"
                          fontSize={10}
                          hide={id === 'qrng-8bit'}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={chartTooltipStyle} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={id === 'qrng-8bit' ? 2 : 100}>
                          {(result?.chartData || []).map((_: unknown, i: number) => (
                            <Cell key={`c-${i}`} fill={i % 2 === 0 ? '#2dd4bf' : '#818cf8'} />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <SkeletonChart variant={AREA_CHART_IDS.has(id || '') ? 'area' : 'bar'} barCount={id === 'qrng-8bit' ? 16 : 6} />
                )}
              </div>
            </div>

            {/* Circuit — learning-style “lab notebook” */}
            <div className="overflow-hidden rounded-2xl border border-[var(--learn-border-strong)] bg-[#050810] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-500/20 bg-gradient-to-r from-teal-950/40 to-slate-950/80 px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-teal-200/90">
                  <Terminal size={16} />
                  Transpiled circuit (ASCII)
                </div>
                <span className="font-mono-circuit text-[10px] text-slate-500">{exp.id}</span>
              </div>
              <div className="p-4 sm:p-6">
                <div className="max-h-[min(420px,55vh)] overflow-auto rounded-xl border border-teal-500/15 bg-[#020508] p-4 sm:p-5">
                  <pre className="font-mono-circuit text-[11px] leading-relaxed text-teal-100/95 sm:text-xs">
                    {result?.circuit?.trim()
                      ? result.circuit
                      : '// Run a simulation to compile the circuit and show Qiskit’s text diagram here.'}
                  </pre>
                </div>
                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
                  <Cpu size={14} className="mt-0.5 shrink-0 text-violet-400" />
                  Circuits are executed on the <strong className="text-slate-400">Aer QASM simulator</strong> with
                  optional depolarizing noise (toggle in the header).
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-6 xl:col-span-4">
            <div className="rounded-2xl border border-[var(--learn-border)] bg-[var(--learn-surface)] p-6 sm:p-7">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-300">Lab readout</h3>
              <dl className="mt-6 space-y-5">
                {[
                  { l: 'Simulator', v: 'Qiskit Aer' },
                  { l: 'Backend', v: 'qasm_simulator' },
                  { l: 'Compile', v: 'optimization_level=3' },
                ].map(row => (
                  <div key={row.l} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{row.l}</dt>
                    <dd className="mt-1 text-sm font-semibold text-white">{row.v}</dd>
                  </div>
                ))}
                {result?.finalEnergy != null && (
                  <div className="pt-2">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                      Ground-state energy
                    </dt>
                    <dd className="mt-1 font-mono-circuit text-3xl font-bold text-white">
                      {result.finalEnergy.toFixed(5)} <span className="text-sm font-semibold text-slate-500">Ha</span>
                    </dd>
                  </div>
                )}
                {result?.finalAccuracy != null && (
                  <div className="pt-2">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Accuracy</dt>
                    <dd className="mt-1 text-3xl font-bold text-white">
                      {(result.finalAccuracy * 100).toFixed(1)}
                      <span className="text-sm font-semibold text-slate-500">%</span>
                    </dd>
                  </div>
                )}
                {result?.equilibriumDistance != null && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-teal-400">
                        Equilibrium distance
                      </dt>
                      <dd className="mt-1 text-2xl font-bold text-white">
                        {result.equilibriumDistance.toFixed(1)}{' '}
                        <span className="text-sm text-slate-500">Å</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-teal-400">Min energy</dt>
                      <dd className="mt-1 font-mono-circuit text-xl font-bold text-white">
                        {result.equilibriumEnergy?.toFixed(5)} Ha
                      </dd>
                    </div>
                  </div>
                )}
                {result?.noise && (
                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-200">Noise</p>
                    <p className="mt-2 text-xs text-amber-100/80">Depolarizing 1% (1q) / 2% (2q)</p>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      )}
    </motion.div>
  );
}

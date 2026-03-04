import { motion } from 'framer-motion';

interface SkeletonChartProps {
    variant: 'bar' | 'area';
    barCount?: number;
}

/**
 * Animated skeleton chart placeholder — shows before experiment runs.
 * Replaces the empty "Protocol Not Started" state with a visually rich preview.
 */
export default function SkeletonChart({ variant, barCount = 6 }: SkeletonChartProps) {
    const bars = Array.from({ length: barCount }, (_, i) => ({
        height: 20 + Math.sin(i * 0.8) * 30 + Math.random() * 20,
        delay: i * 0.08,
    }));

    if (variant === 'area') {
        // Animated wave for training curves
        return (
            <div className="h-full flex flex-col items-center justify-center relative">
                <svg viewBox="0 0 400 200" className="w-full h-48 opacity-10">
                    <motion.path
                        d="M0,150 C50,140 100,100 150,110 C200,120 250,60 300,80 C350,100 380,90 400,95"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-blue-500"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                    />
                    <motion.path
                        d="M0,150 C50,140 100,100 150,110 C200,120 250,60 300,80 C350,100 380,90 400,95 L400,200 L0,200 Z"
                        fill="currentColor"
                        className="text-blue-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.05 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                    />
                </svg>
                <motion.p
                    className="font-black text-[10px] uppercase tracking-[0.5em] text-slate-700 mt-4"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Ready to Train
                </motion.p>
            </div>
        );
    }

    // Bar variant — pulsing histogram bars
    return (
        <div className="h-full flex items-end justify-center gap-3 px-8 pb-8 pt-16 relative">
            {bars.map((bar, i) => (
                <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-blue-500/10 to-blue-500/5 rounded-t-xl border border-white/5 relative"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: `${bar.height}%`,
                        opacity: [0.15, 0.3, 0.15],
                    }}
                    transition={{
                        height: { duration: 0.6, delay: bar.delay, ease: 'easeOut' },
                        opacity: { duration: 2, repeat: Infinity, delay: bar.delay },
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent rounded-t-xl" />
                </motion.div>
            ))}
            <motion.p
                className="absolute bottom-2 left-1/2 -translate-x-1/2 font-black text-[10px] uppercase tracking-[0.5em] text-slate-700"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Awaiting Measurement
            </motion.p>
        </div>
    );
}

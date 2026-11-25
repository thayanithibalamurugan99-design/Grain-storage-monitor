import type { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  decimals?: number;
  threshold?: { max: number; warning: number };
  accent: 'emerald' | 'amber' | 'sky' | 'orange';
}

const ACCENT_COLOR = {
  emerald: 'text-emerald-500 dark:text-emerald-400',
  amber: 'text-amber-500 dark:text-amber-400',
  sky: 'text-sky-500 dark:text-sky-400',
  orange: 'text-orange-500 dark:text-orange-400',
};

const ACCENT_BG = {
  emerald: 'bg-emerald-500/10',
  amber: 'bg-amber-500/10',
  sky: 'bg-sky-500/10',
  orange: 'bg-orange-500/10',
};

export default function SensorCard({
  icon: Icon,
  label,
  value,
  unit,
  decimals = 1,
  threshold,
  accent,
}: SensorCardProps) {
  const isDanger = threshold ? value > threshold.max : false;
  const isWarning = threshold
    ? value > threshold.warning && value <= threshold.max
    : false;

  const valueColor = isDanger
    ? 'text-red-600 dark:text-red-300'
    : isWarning
    ? 'text-amber-600 dark:text-amber-300'
    : 'text-slate-900 dark:text-slate-50';

  return (
    <div className="rounded-xl border border-slate-200 bg-white/60 p-4 backdrop-blur-sm transition-colors hover:bg-white/80 dark:border-slate-700/50 dark:bg-slate-800/40 dark:hover:bg-slate-800/60">
      <div className="flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${ACCENT_BG[accent]} ${ACCENT_COLOR[accent]}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        {isDanger && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        )}
        {isWarning && !isDanger && (
          <span className="h-2 w-2 rounded-full bg-amber-500" />
        )}
        {!isDanger && !isWarning && threshold && (
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        )}
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`text-2xl font-bold tabular-nums ${valueColor}`}>
          {value.toFixed(decimals)}
        </span>
        <span className="text-sm text-slate-400 dark:text-slate-500">{unit}</span>
      </div>
      {threshold && (
        <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-600">
          Safe: ≤ {threshold.max}{unit}
        </p>
      )}
    </div>
  );
}

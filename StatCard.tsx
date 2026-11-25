import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: 'emerald' | 'amber' | 'red' | 'sky' | 'slate';
}

const ACCENT_MAP = {
  emerald: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10',
  amber: 'text-amber-500 dark:text-amber-400 bg-amber-500/10',
  red: 'text-red-500 dark:text-red-400 bg-red-500/10',
  sky: 'text-sky-500 dark:text-sky-400 bg-sky-500/10',
  slate: 'text-slate-500 dark:text-slate-300 bg-slate-600/10',
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  accent = 'slate',
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/60 px-4 py-3.5 backdrop-blur-sm transition-colors hover:bg-white/80 dark:border-slate-700/50 dark:bg-slate-800/40 dark:hover:bg-slate-800/60">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${ACCENT_MAP[accent]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        {value}
      </p>
      {sublabel && (
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{sublabel}</p>
      )}
    </div>
  );
}

import type { RiskLevel } from '@/types';
import { riskBgColor, riskBorderColor } from '@/lib/risk';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export default function RiskGauge({ score, level, size = 130 }: RiskGaugeProps) {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  const colorClass = riskBgColor(level);
  const borderClass = riskBorderColor(level);

  const levelTextColor =
    level === 'LOW'
      ? 'text-emerald-600 dark:text-emerald-400'
      : level === 'MODERATE'
      ? 'text-amber-600 dark:text-amber-400'
      : level === 'HIGH'
      ? 'text-orange-600 dark:text-orange-400'
      : 'text-red-600 dark:text-red-400';

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-2xl border ${borderClass} bg-white/60 p-4 dark:bg-slate-800/40`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(148,163,184,0.25)"
            strokeWidth={8}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={8}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-700 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            stroke="currentColor"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold tabular-nums ${levelTextColor}`}>
            {score}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">/ 100</span>
        </div>
      </div>
      <span className={`mt-2 text-sm font-bold tracking-wide ${levelTextColor}`}>
        {level}
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-500">Spoilage Risk</span>
    </div>
  );
}

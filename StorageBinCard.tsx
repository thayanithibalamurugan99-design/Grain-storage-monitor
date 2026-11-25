import type { Silo, SiloStatus, TempUnit } from '@/types';
import { computeStatus } from '@/hooks/useGrainSimulation';
import { computeRisk, riskBgColor } from '@/lib/risk';
import {
  Thermometer,
  Droplets,
  Wind,
  Biohazard,
  Wheat,
  CircleDot,
  Sprout,
  Fan,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

const STATUS_BADGE: Record<SiloStatus, { label: string; classes: string; Icon: typeof CheckCircle2 }> = {
  optimal: { label: 'Optimal', classes: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30', Icon: CheckCircle2 },
  warning: { label: 'Warning', classes: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30', Icon: AlertTriangle },
  critical: { label: 'Critical', classes: 'bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/30', Icon: ShieldAlert },
};

function StatusBadgeInline({ status }: { status: SiloStatus }) {
  const { label, classes, Icon } = STATUS_BADGE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${classes}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

const GRAIN_ICONS: Record<string, typeof Wheat> = {
  wheat: Wheat,
  rice: CircleDot,
  corn: Sprout,
  barley: Sprout,
};

interface StorageBinCardProps {
  silo: Silo;
  selected: boolean;
  onSelect: (id: number) => void;
  tempUnit: TempUnit;
}

function cToF(c: number): number {
  return (c * 9) / 5 + 32;
}

export default function StorageBinCard({ silo, selected, onSelect, tempUnit }: StorageBinCardProps) {
  const status = computeStatus(silo);
  const risk = computeRisk(silo);
  const GrainIcon = GRAIN_ICONS[silo.grainType] ?? CircleDot;
  const fillPercent = Math.round((silo.currentKg / silo.capacityKg) * 100);

  const cardBorder = selected
    ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
    : status === 'critical'
    ? 'border-red-500/20'
    : status === 'warning'
    ? 'border-amber-500/20'
    : 'border-slate-200 dark:border-slate-700/50';

  const tempDisplay = tempUnit === 'F' ? cToF(silo.telemetry.temperature).toFixed(1) : silo.telemetry.temperature.toFixed(1);
  const tempUnitLabel = tempUnit === 'F' ? '°F' : '°C';

  return (
    <button
      onClick={() => onSelect(silo.id)}
      className={`group relative w-full overflow-hidden rounded-2xl border ${cardBorder} bg-white/60 p-5 text-left backdrop-blur-sm transition-all duration-300 hover:bg-white/80 dark:bg-slate-800/40 dark:hover:bg-slate-800/60`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${
          status === 'critical'
            ? 'bg-red-500/60'
            : status === 'warning'
            ? 'bg-amber-500/60'
            : 'bg-emerald-500/40'
        }`}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700/50">
            <GrainIcon className="h-5 w-5 text-slate-600 dark:text-slate-200" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{silo.name}</h3>
            <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-3 w-3" />
              {silo.location}
            </p>
          </div>
        </div>
        <StatusBadgeInline status={status} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700/40 dark:text-slate-300">
          {silo.grainLabel}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {silo.currentKg.toLocaleString()} / {silo.capacityKg.toLocaleString()} kg · {fillPercent}%
        </span>
      </div>

      {/* Visual fill gauge */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-slate-400 dark:text-slate-500">Capacity</span>
          <span className="font-bold tabular-nums text-slate-500 dark:text-slate-400">{fillPercent}%</span>
        </div>
        <div className="relative h-6 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700/50">
          {/* Segment ticks at 25/50/75% */}
          <div className="absolute inset-0 flex justify-between px-[25%] pointer-events-none">
            <div className="h-full w-px bg-slate-200 dark:bg-slate-600/50" />
            <div className="h-full w-px bg-slate-200 dark:bg-slate-600/50" />
            <div className="h-full w-px bg-slate-200 dark:bg-slate-600/50" />
          </div>
          <div
            className={`flex h-full items-center justify-end rounded-lg px-1.5 transition-all duration-500 ${
              fillPercent > 90
                ? 'bg-red-500/70'
                : fillPercent > 75
                ? 'bg-amber-500/70'
                : 'bg-emerald-500/70'
            }`}
            style={{ width: `${fillPercent}%` }}
          >
            {fillPercent > 15 && (
              <span className="text-[9px] font-bold text-white tabular-nums">
                {fillPercent}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mini metrics grid */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          { icon: Thermometer, label: 'Temp', value: tempDisplay, unit: tempUnitLabel },
          { icon: Droplets, label: 'Moist', value: silo.telemetry.moisture.toFixed(1), unit: '%' },
          { icon: Wind, label: 'Hum', value: silo.telemetry.humidity.toFixed(0), unit: '%' },
          { icon: Biohazard, label: 'CO₂', value: silo.telemetry.co2.toFixed(0), unit: 'ppm' },
        ].map((m) => (
          <div key={m.label} className="rounded-lg bg-slate-100/60 p-2 text-center dark:bg-slate-900/40">
            <m.icon className="mx-auto h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <p className="mt-1 text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-200">
              {m.value}
            </p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500">{m.unit}</p>
          </div>
        ))}
      </div>

      {/* Bottom row: risk + vent */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-400">Risk</span>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700/50">
              <div
                className={`h-full rounded-full ${riskBgColor(risk.level)} transition-all duration-500`}
                style={{ width: `${risk.score}%` }}
              />
            </div>
            <span className="text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-300">
              {risk.score}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Fan
            className={`h-3.5 w-3.5 ${silo.ventilation ? 'text-emerald-500 dark:text-emerald-400 animate-spin' : 'text-slate-400 dark:text-slate-500'}`}
            style={silo.ventilation ? { animationDuration: '1.5s' } : undefined}
          />
          <span className={`text-xs ${silo.ventilation ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
            {silo.ventilation ? 'Vent ON' : 'Vent OFF'}
          </span>
        </div>
      </div>
    </button>
  );
}

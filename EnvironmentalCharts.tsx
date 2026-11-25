import { useState, useMemo } from 'react';
import type { Silo, TimeRange } from '@/types';
import { generateHistory, formatTimeLabel } from '@/lib/historicalData';
import LineChart from './LineChart';
import { Thermometer, Droplets, Wind, Biohazard, ShieldAlert } from 'lucide-react';

const RANGES: { value: TimeRange; label: string }[] = [
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
];

type MetricKey = 'temperature' | 'humidity' | 'moisture' | 'co2' | 'risk';

const METRICS: {
  key: MetricKey;
  label: string;
  color: string;
  icon: typeof Thermometer;
}[] = [
  { key: 'temperature', label: 'Temperature', color: 'text-orange-500 dark:text-orange-400', icon: Thermometer },
  { key: 'humidity', label: 'Humidity', color: 'text-sky-500 dark:text-sky-400', icon: Wind },
  { key: 'moisture', label: 'Grain Moisture', color: 'text-emerald-500 dark:text-emerald-400', icon: Droplets },
  { key: 'co2', label: 'CO₂', color: 'text-amber-500 dark:text-amber-400', icon: Biohazard },
  { key: 'risk', label: 'Spoilage Risk', color: 'text-red-500 dark:text-red-400', icon: ShieldAlert },
];

export default function EnvironmentalCharts({ silo }: { silo: Silo }) {
  const [range, setRange] = useState<TimeRange>('24h');
  const [activeMetric, setActiveMetric] = useState<MetricKey>('temperature');

  const history = useMemo(() => generateHistory(silo, range), [silo, range]);

  const chartData = history.map((p) => ({ time: p.time, value: p[activeMetric] }));

  const activeConfig = METRICS.find((m) => m.key === activeMetric)!;
  const threshold =
    activeMetric === 'temperature' ? silo.thresholds.maxTemperature :
    activeMetric === 'humidity' ? silo.thresholds.maxHumidity :
    activeMetric === 'moisture' ? silo.thresholds.maxMoisture :
    activeMetric === 'co2' ? silo.thresholds.maxCo2 :
    undefined;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/40">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <activeConfig.icon className={`h-5 w-5 ${activeConfig.color}`} />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Historical Analytics · {silo.name}
          </h3>
        </div>

        {/* Time range selector */}
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50/40 p-0.5 dark:border-slate-700/50 dark:bg-slate-900/40">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                range === r.value
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveMetric(m.key)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              activeMetric === m.key
                ? `border-slate-300 bg-slate-100/60 ${m.color} dark:border-slate-600/50 dark:bg-slate-700/40`
                : 'border-slate-200 bg-slate-50/30 text-slate-500 hover:bg-slate-100 dark:border-slate-700/40 dark:bg-slate-900/30 dark:text-slate-400 dark:hover:bg-slate-700/30'
            }`}
          >
            <m.icon className="h-3.5 w-3.5" />
            {m.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <LineChart
        data={chartData}
        color={activeConfig.color}
        height={200}
        threshold={threshold}
        formatLabel={(t) => formatTimeLabel(t, range)}
      />
    </div>
  );
}

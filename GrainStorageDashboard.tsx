import { useState, useMemo } from 'react';
import { useGrainSimulation, computeStatus } from '@/hooks/useGrainSimulation';
import { computeRisk, riskBgColor, riskBorderColor, riskColor } from '@/lib/risk';
import StatCard from './StatCard';
import SensorCard from './SensorCard';
import SpoilageRiskCard from './SpoilageRiskCard';
import VentilationControl from './VentilationControl';
import StorageBinCard from './StorageBinCard';
import AlertsPanel from './AlertsPanel';
import EnvironmentalCharts from './EnvironmentalCharts';
import {
  Warehouse,
  Activity,
  Thermometer,
  Wind,
  ShieldAlert,
  Fan,
  Bell,
  Radio,
  MapPin,
  Clock,
  Droplets,
  Biohazard,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Flame,
} from 'lucide-react';
import type { TempUnit } from '@/types';

interface GrainStorageDashboardProps {
  tempUnit: TempUnit;
}

export function cToF(c: number): number {
  return (c * 9) / 5 + 32;
}

export default function GrainStorageDashboard({ tempUnit }: GrainStorageDashboardProps) {
  const {
    silos,
    simulating,
    lastUpdate,
    alerts,
    toggleVentilation,
    setVentMode,
    toggleSimulation,
  } = useGrainSimulation();

  const [selectedBinId, setSelectedBinId] = useState(1);
  const selectedBin = silos.find((s) => s.id === selectedBinId) ?? silos[0];

  const fmtTemp = (celsius: number) => {
    if (tempUnit === 'F') return cToF(celsius).toFixed(1);
    return celsius.toFixed(1);
  };
  const tempUnitLabel = tempUnit === 'F' ? '°F' : '°C';

  const summary = useMemo(() => {
    const avgTemp = silos.reduce((sum, s) => sum + s.telemetry.temperature, 0) / silos.length;
    const avgHumid = silos.reduce((sum, s) => sum + s.telemetry.humidity, 0) / silos.length;
    const highRisk = silos.filter((s) => {
      const r = computeRisk(s);
      return r.level === 'HIGH' || r.level === 'CRITICAL';
    }).length;
    const activeVent = silos.filter((s) => s.ventilation).length;
    return { avgTemp, avgHumid, highRisk, activeVent };
  }, [silos]);

  // Overall risk across all bins
  const overallRisk = useMemo(() => {
    const scores = silos.map((s) => computeRisk(s).score);
    const maxScore = Math.max(...scores);
    const maxSilo = silos.find((s) => computeRisk(s).score === maxScore)!;
    return computeRisk(maxSilo);
  }, [silos]);

  const riskBannerConfig = {
    LOW: {
      icon: CheckCircle2,
      label: 'Low Risk',
      text: 'All storage conditions are within safe parameters. Continue routine monitoring.',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      border: 'border-emerald-300 dark:border-emerald-500/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      labelColor: 'text-emerald-700 dark:text-emerald-300',
      textColor: 'text-emerald-800 dark:text-emerald-200',
    },
    MODERATE: {
      icon: AlertTriangle,
      label: 'Moderate Risk',
      text: 'Some bins are approaching unsafe thresholds. Consider preventive ventilation.',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      border: 'border-amber-300 dark:border-amber-500/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      labelColor: 'text-amber-700 dark:text-amber-300',
      textColor: 'text-amber-800 dark:text-amber-200',
    },
    HIGH: {
      icon: AlertTriangle,
      label: 'High Risk',
      text: 'Unsafe conditions detected. Activate ventilation immediately and inspect grain.',
      bg: 'bg-orange-50 dark:bg-orange-500/10',
      border: 'border-orange-300 dark:border-orange-500/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      labelColor: 'text-orange-700 dark:text-orange-300',
      textColor: 'text-orange-800 dark:text-orange-200',
    },
    CRITICAL: {
      icon: XCircle,
      label: 'Critical Risk',
      text: 'Critically high sensor readings. Ventilate, inspect, and consider transferring grain.',
      bg: 'bg-red-50 dark:bg-red-500/10',
      border: 'border-red-300 dark:border-red-500/30',
      iconColor: 'text-red-600 dark:text-red-400',
      labelColor: 'text-red-700 dark:text-red-300',
      textColor: 'text-red-800 dark:text-red-200',
    },
  };

  const banner = riskBannerConfig[overallRisk.level];
  const BannerIcon = banner.icon;

  if (!selectedBin) return null;

  const { telemetry: t, thresholds: th } = selectedBin;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/5" />
        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl dark:bg-amber-500/5" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-500/5 blur-3xl dark:bg-sky-500/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 ring-1 ring-slate-300/50 dark:ring-slate-700/50">
              <Warehouse className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
                Smart Grain Storage Monitor
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Agricultural IoT · Spoilage Risk Prediction & Auto-Ventilation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/60 px-3 py-2 dark:border-slate-700/50 dark:bg-slate-800/40">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-medium tabular-nums text-slate-600 dark:text-slate-300">
                {lastUpdate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>

            <button
              onClick={toggleSimulation}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-300 ${
                simulating
                  ? 'border-emerald-300 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-300'
                  : 'border-slate-300 bg-slate-200/50 text-slate-600 hover:bg-slate-200 dark:border-slate-600/40 dark:bg-slate-700/30 dark:text-slate-300 dark:hover:bg-slate-700/50'
              }`}
            >
              <Radio className={`h-4 w-4 ${simulating ? 'animate-pulse' : ''}`} />
              {simulating ? 'Live Simulation' : 'Paused'}
            </button>
          </div>
        </header>

        {/* Spoilage Risk Alert Banner */}
        <div
          className={`mb-6 flex items-center gap-4 rounded-2xl border ${banner.border} ${banner.bg} p-4 backdrop-blur-sm transition-all duration-500`}
        >
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/60 dark:bg-slate-800/40`}>
            <BannerIcon className={`h-6 w-6 ${banner.iconColor} ${overallRisk.level === 'HIGH' || overallRisk.level === 'CRITICAL' ? 'animate-pulse' : ''}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold tracking-wide ${banner.labelColor}`}>
                {banner.label}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Highest risk score: <span className="font-bold tabular-nums">{overallRisk.score}/100</span>
              </span>
            </div>
            <p className={`mt-0.5 text-xs ${banner.textColor}`}>{banner.text}</p>
          </div>
          {/* Mini risk level pills */}
          <div className="hidden gap-1.5 sm:flex">
            {(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const).map((lvl) => (
              <span
                key={lvl}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all ${
                  overallRisk.level === lvl
                    ? `${riskBgColor(lvl)} text-white`
                    : 'bg-slate-200/60 text-slate-400 dark:bg-slate-800/60 dark:text-slate-600'
                }`}
              >
                {lvl}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          <StatCard icon={Warehouse} label="Storage Bins" value={silos.length} accent="slate" />
          <StatCard icon={Activity} label="Under Monitoring" value={silos.length} sublabel="All active" accent="sky" />
          <StatCard icon={Thermometer} label="Avg Temperature" value={`${fmtTemp(summary.avgTemp)}${tempUnitLabel}`} accent="amber" />
          <StatCard icon={Wind} label="Avg Humidity" value={`${summary.avgHumid.toFixed(0)}%`} accent="sky" />
          <StatCard
            icon={ShieldAlert}
            label="High-Risk Bins"
            value={summary.highRisk}
            accent={summary.highRisk > 0 ? 'red' : 'emerald'}
          />
          <StatCard icon={Fan} label="Ventilation Active" value={`${summary.activeVent}/${silos.length}`} accent="emerald" />
          <StatCard icon={Bell} label="Active Alerts" value={alerts.length} accent={alerts.length > 0 ? 'red' : 'emerald'} />
        </div>

        {/* Main grid: bin list + detail */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Storage bins */}
          <div className="lg:col-span-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Storage Bins
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {silos.map((silo) => (
                <StorageBinCard
                  key={silo.id}
                  silo={silo}
                  selected={silo.id === selectedBinId}
                  onSelect={setSelectedBinId}
                  tempUnit={tempUnit}
                />
              ))}
            </div>
          </div>

          {/* Right: Detail panel */}
          <div className="space-y-6 lg:col-span-7">
            {/* Bin header */}
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/60 p-5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {selectedBin.name}
                </h2>
                <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {selectedBin.location}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Grain Type</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {selectedBin.grainLabel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Quantity</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {selectedBin.currentKg.toLocaleString()} kg
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Last Update</p>
                  <p className="text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                    {new Date(selectedBin.lastSensorUpdate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Environmental Status Cards */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <Flame className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                Environmental Status
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Temperature */}
                <div className="rounded-xl border border-slate-200 bg-white/60 p-4 backdrop-blur-sm transition-colors hover:bg-white/80 dark:border-slate-700/50 dark:bg-slate-800/40 dark:hover:bg-slate-800/60">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 dark:text-orange-400">
                      <Thermometer className="h-4.5 w-4.5" />
                    </div>
                    {(() => {
                      const isDanger = t.temperature > th.maxTemperature;
                      const isWarning = t.temperature > th.warningTemperature && !isDanger;
                      if (isDanger) return <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />;
                      if (isWarning) return <span className="h-2 w-2 rounded-full bg-amber-500" />;
                      return <span className="h-2 w-2 rounded-full bg-emerald-500" />;
                    })()}
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Grain Temperature</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className={`text-2xl font-bold tabular-nums ${
                      t.temperature > th.maxTemperature
                        ? 'text-red-600 dark:text-red-300'
                        : t.temperature > th.warningTemperature
                        ? 'text-amber-600 dark:text-amber-300'
                        : 'text-slate-900 dark:text-slate-50'
                    }`}>
                      {fmtTemp(t.temperature)}
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-500">{tempUnitLabel}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-600">
                    Safe: ≤ {fmtTemp(th.maxTemperature)}{tempUnitLabel}
                  </p>
                </div>

                {/* Moisture */}
                <div className="rounded-xl border border-slate-200 bg-white/60 p-4 backdrop-blur-sm transition-colors hover:bg-white/80 dark:border-slate-700/50 dark:bg-slate-800/40 dark:hover:bg-slate-800/60">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                      <Droplets className="h-4.5 w-4.5" />
                    </div>
                    {(() => {
                      const isDanger = t.moisture > th.maxMoisture;
                      const isWarning = t.moisture > th.warningMoisture && !isDanger;
                      if (isDanger) return <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />;
                      if (isWarning) return <span className="h-2 w-2 rounded-full bg-amber-500" />;
                      return <span className="h-2 w-2 rounded-full bg-emerald-500" />;
                    })()}
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Moisture Content</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className={`text-2xl font-bold tabular-nums ${
                      t.moisture > th.maxMoisture
                        ? 'text-red-600 dark:text-red-300'
                        : t.moisture > th.warningMoisture
                        ? 'text-amber-600 dark:text-amber-300'
                        : 'text-slate-900 dark:text-slate-50'
                    }`}>
                      {t.moisture.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-500">%</span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-600">
                    Safe: ≤ {th.maxMoisture}%
                  </p>
                </div>

                {/* CO2 */}
                <div className="rounded-xl border border-slate-200 bg-white/60 p-4 backdrop-blur-sm transition-colors hover:bg-white/80 dark:border-slate-700/50 dark:bg-slate-800/40 dark:hover:bg-slate-800/60">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400">
                      <Biohazard className="h-4.5 w-4.5" />
                    </div>
                    {(() => {
                      const isDanger = t.co2 > th.maxCo2;
                      const isWarning = t.co2 > th.warningCo2 && !isDanger;
                      if (isDanger) return <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />;
                      if (isWarning) return <span className="h-2 w-2 rounded-full bg-amber-500" />;
                      return <span className="h-2 w-2 rounded-full bg-emerald-500" />;
                    })()}
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">CO₂ Levels</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className={`text-2xl font-bold tabular-nums ${
                      t.co2 > th.maxCo2
                        ? 'text-red-600 dark:text-red-300'
                        : t.co2 > th.warningCo2
                        ? 'text-amber-600 dark:text-amber-300'
                        : 'text-slate-900 dark:text-slate-50'
                    }`}>
                      {t.co2.toFixed(0)}
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-500">ppm</span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-600">
                    Safe: ≤ {th.maxCo2} ppm
                  </p>
                </div>
              </div>
            </div>

            {/* Sensor cards (full 4 metrics) */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Sensor Readings
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SensorCard
                  icon={Thermometer}
                  label="Temperature"
                  value={tempUnit === 'F' ? cToF(t.temperature) : t.temperature}
                  unit={tempUnitLabel}
                  accent="orange"
                  threshold={{ max: tempUnit === 'F' ? cToF(th.maxTemperature) : th.maxTemperature, warning: tempUnit === 'F' ? cToF(th.warningTemperature) : th.warningTemperature }}
                />
                <SensorCard
                  icon={Droplets}
                  label="Moisture"
                  value={t.moisture}
                  unit="%"
                  accent="emerald"
                  threshold={{ max: th.maxMoisture, warning: th.warningMoisture }}
                />
                <SensorCard
                  icon={Wind}
                  label="Humidity"
                  value={t.humidity}
                  unit="%"
                  decimals={0}
                  accent="sky"
                  threshold={{ max: th.maxHumidity, warning: th.warningHumidity }}
                />
                <SensorCard
                  icon={Biohazard}
                  label="CO₂ Level"
                  value={t.co2}
                  unit="ppm"
                  decimals={0}
                  accent="amber"
                  threshold={{ max: th.maxCo2, warning: th.warningCo2 }}
                />
              </div>
            </div>

            {/* Spoilage risk */}
            <SpoilageRiskCard silo={selectedBin} />

            {/* Ventilation control */}
            <VentilationControl
              silo={selectedBin}
              onToggleVent={toggleVentilation}
              onSetMode={setVentMode}
            />

            {/* Analytics */}
            <EnvironmentalCharts silo={selectedBin} />
          </div>
        </div>

        {/* Alerts panel — full width at bottom */}
        <div className="mt-6">
          <AlertsPanel alerts={alerts} />
        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-400 dark:border-slate-800/50 dark:text-slate-600">
          <p>
            Smart Grain Storage Monitor — Agricultural IoT Dashboard · Safe limits:
            Rice 22°C/13.0%
          </p>
        </footer>
      </div>
    </div>
  );
}

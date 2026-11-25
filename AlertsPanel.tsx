import type { AlertItem } from '@/types';
import {
  Thermometer,
  Droplets,
  Wind,
  Biohazard,
  ShieldAlert,
  Fan,
  Bell,
} from 'lucide-react';

const TYPE_ICONS = {
  high_temp: Thermometer,
  high_humidity: Wind,
  excess_moisture: Droplets,
  high_co2: Biohazard,
  high_risk: ShieldAlert,
  vent_activated: Fan,
};

const SEVERITY_STYLES = {
  critical: 'border-red-300 dark:border-red-500/30 bg-red-50/60 dark:bg-red-500/5',
  warning: 'border-amber-300 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/5',
  info: 'border-sky-300 dark:border-sky-500/30 bg-sky-50/60 dark:bg-sky-500/5',
};

const SEVERITY_ICON_COLORS = {
  critical: 'text-red-500 dark:text-red-400',
  warning: 'text-amber-500 dark:text-amber-400',
  info: 'text-sky-500 dark:text-sky-400',
};

export default function AlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/40">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-500 dark:text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Active Alerts</h3>
        </div>
        <span className="rounded-full bg-slate-200/60 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
          {alerts.length}
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
            <ShieldAlert className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">All Clear</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">No active alerts across all bins.</p>
        </div>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {alerts.map((alert) => {
            const Icon = TYPE_ICONS[alert.type];
            return (
              <div
                key={alert.id}
                className={`rounded-lg border ${SEVERITY_STYLES[alert.severity]} p-3`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${SEVERITY_ICON_COLORS[alert.severity]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {alert.binName}
                      </span>
                      <span className="shrink-0 text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
                        {new Date(alert.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{alert.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

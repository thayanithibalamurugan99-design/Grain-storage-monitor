import type { Silo, VentMode } from '@/types';
import { Fan, Zap, Bot, Hand, Clock } from 'lucide-react';

interface VentilationControlProps {
  silo: Silo;
  onToggleVent: (id: number) => void;
  onSetMode: (id: number, mode: VentMode) => void;
}

export default function VentilationControl({
  silo,
  onToggleVent,
  onSetMode,
}: VentilationControlProps) {
  const lastActivation = silo.ventHistory[silo.ventHistory.length - 1];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/40">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fan
            className={`h-5 w-5 ${silo.ventilation ? 'text-emerald-500 dark:text-emerald-400 animate-spin' : 'text-slate-400'}`}
            style={silo.ventilation ? { animationDuration: '1.5s' } : undefined}
          />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Automated Aeration Control
          </h3>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            silo.ventilation
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
              : 'bg-slate-200/60 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400'
          }`}
        >
          {silo.ventilation ? 'Fan Running' : 'Fan Stopped'}
        </span>
      </div>

      {/* Mode selector */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => onSetMode(silo.id, 'auto')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all ${
            silo.ventMode === 'auto'
              ? 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-300'
              : 'border-slate-200 bg-slate-100/40 text-slate-500 hover:bg-slate-100 dark:border-slate-600/40 dark:bg-slate-700/20 dark:text-slate-400 dark:hover:bg-slate-700/40'
          }`}
        >
          <Bot className="h-4 w-4" />
          AUTO
        </button>
        <button
          onClick={() => onSetMode(silo.id, 'manual')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all ${
            silo.ventMode === 'manual'
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300'
              : 'border-slate-200 bg-slate-100/40 text-slate-500 hover:bg-slate-100 dark:border-slate-600/40 dark:bg-slate-700/20 dark:text-slate-400 dark:hover:bg-slate-700/40'
          }`}
        >
          <Hand className="h-4 w-4" />
          MANUAL
        </button>
      </div>

      {/* Fan toggle (only in manual mode) */}
      {silo.ventMode === 'manual' ? (
        <button
          onClick={() => onToggleVent(silo.id)}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-all duration-300 ${
            silo.ventilation
              ? 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15'
              : 'border-slate-200 bg-slate-100/40 hover:bg-slate-100 dark:border-slate-600/40 dark:bg-slate-700/30 dark:hover:bg-slate-700/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <Zap
              className={`h-5 w-5 ${silo.ventilation ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400'}`}
            />
            <div className="text-left">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Cooling Fan Power</p>
              <p className={`text-xs ${silo.ventilation ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {silo.ventilation ? 'ON — Fans running' : 'OFF — Fans stopped'}
              </p>
            </div>
          </div>
          <div
            className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
              silo.ventilation ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                silo.ventilation ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </div>
        </button>
      ) : (
        <div className="rounded-xl border border-sky-300 bg-sky-50/60 px-4 py-3 dark:border-sky-500/20 dark:bg-sky-500/5">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-sky-500 dark:text-sky-400" />
            <p className="text-xs text-sky-600 dark:text-sky-300">
              Auto mode — ventilation is controlled automatically based on sensor readings. Switch to MANUAL to trigger cooling fans yourself.
            </p>
          </div>
        </div>
      )}

      {/* Activation reason */}
      {silo.ventilation && lastActivation && (
        <div className="mt-3 rounded-lg border border-emerald-300 bg-emerald-50/60 px-3 py-2 dark:border-emerald-500/20 dark:bg-emerald-500/5">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-300">
            Activated: {new Date(lastActivation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{lastActivation.reason}</p>
        </div>
      )}

      {/* Activation history */}
      {silo.ventHistory.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            Activation History
          </p>
          <div className="max-h-24 space-y-1 overflow-y-auto">
            {silo.ventHistory.slice(-5).reverse().map((entry, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span className="tabular-nums text-slate-500 dark:text-slate-400">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="truncate">{entry.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

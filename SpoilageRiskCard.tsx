import type { Silo } from '@/types';
import { computeRisk, riskBorderColor } from '@/lib/risk';
import RiskGauge from './RiskGauge';
import { AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';

export default function SpoilageRiskCard({ silo }: { silo: Silo }) {
  const risk = computeRisk(silo);

  const maxContribution = risk.factors.length > 0 ? risk.factors[0].contribution : 1;

  return (
    <div className={`rounded-2xl border ${riskBorderColor(risk.level)} bg-white/60 p-5 backdrop-blur-sm dark:bg-slate-800/40`}>
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Spoilage Risk Prediction
        </h3>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <RiskGauge score={risk.score} level={risk.level} />

        <div className="flex-1 space-y-3">
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Risk Factors
            </p>
            <div className="space-y-1.5">
              {risk.factors.map((f) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300">{f.label}</span>
                    <span className="font-medium tabular-nums text-slate-400 dark:text-slate-400">
                      {f.contribution} pts
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700/50">
                    <div
                      className={`h-full rounded-full ${
                        f.contribution > 25
                          ? 'bg-red-500'
                          : f.contribution > 15
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      } transition-all duration-500`}
                      style={{ width: `${(f.contribution / Math.max(maxContribution, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {risk.factors.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500">No significant risk factors detected.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700/50 dark:bg-slate-900/40">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-sky-500 dark:text-sky-400" />
              <div>
                <p className="text-xs font-medium text-sky-600 dark:text-sky-300">Recommended Action</p>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{risk.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {silo.unfavorableSeconds > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50/60 px-3 py-2 dark:border-amber-500/20 dark:bg-amber-500/5">
          <TrendingUp className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          <span className="text-xs text-amber-700 dark:text-amber-300">
            Unfavorable conditions for {Math.round(silo.unfavorableSeconds / 60)} min —
            prolonged exposure increases spoilage risk.
          </span>
        </div>
      )}
    </div>
  );
}

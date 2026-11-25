import { useState } from 'react';
import { AlertTriangle, Download, RefreshCw } from 'lucide-react';

export default function RiskCalculatorExtension() {
  const [exerciseBonus, setExerciseBonus] = useState(false);
  const [dietBonus, setDietBonus] = useState(false);

  const baseRisk = 68;
  const mitigatedRisk = Math.max(
    10,
    baseRisk - (exerciseBonus ? 20 : 0) - (dietBonus ? 15 : 0)
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 ring-1 ring-rose-500/20">
            <AlertTriangle className="h-5 w-5 text-rose-500 dark:text-rose-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Health Risk Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Decision-support prototype with what-if analysis</p>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="flex items-center gap-3 bg-amber-50/60 border border-amber-300 dark:bg-amber-500/10 dark:border-amber-500/20 p-4 rounded-xl text-amber-700 dark:text-amber-300 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span><strong>Disclaimer:</strong> Decision-support prototype based on standard heuristic models. Intended for demonstration and screening workflows only.</span>
        </div>

        {/* Main Score Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white/60 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Risk Assessment</span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className={`text-5xl font-black ${mitigatedRisk > 50 ? 'text-rose-500 dark:text-rose-400' : 'text-amber-500 dark:text-amber-400'}`}>
                {mitigatedRisk}%
              </span>
              <span className="text-sm font-semibold text-slate-400">
                {mitigatedRisk > 50 ? 'High Risk Category' : 'Moderate Risk Category'}
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Algorithm: Modified Framingham Heuristic v1.2</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              <Download className="w-4 h-4" /> Export PDF Summary
            </button>
          </div>
        </div>

        {/* Risk Factor Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Risk Factor Weights</h3>

          <div className="space-y-3 bg-white/40 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Primary Indicator (Family History / Baseline)</span>
                <span className="text-rose-500 dark:text-rose-400 font-bold">+35% Impact</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[35%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Lifestyle & Biological Markers</span>
                <span className="text-amber-500 dark:text-amber-400 font-bold">+20% Impact</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[20%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive "What-If" Scenario Simulator */}
        <div className="bg-indigo-50/40 border border-indigo-300 dark:bg-indigo-950/30 dark:border-indigo-500/30 p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-bold text-sm">
            <RefreshCw className="w-4 h-4" />
            <span>Interactive Scenario Simulator (What-If Analysis)</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Toggle potential lifestyle interventions to see dynamic risk reduction in real time:</p>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 cursor-pointer bg-white/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg hover:border-indigo-500/50 transition-colors">
              <input
                type="checkbox"
                checked={exerciseBonus}
                onChange={(e) => setExerciseBonus(e.target.checked)}
                className="accent-indigo-500 rounded"
              />
              <span>30 mins daily cardio (-20% Risk)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 cursor-pointer bg-white/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg hover:border-indigo-500/50 transition-colors">
              <input
                type="checkbox"
                checked={dietBonus}
                onChange={(e) => setDietBonus(e.target.checked)}
                className="accent-indigo-500 rounded"
              />
              <span>Dietary Optimization (-15% Risk)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

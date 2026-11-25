import { useState } from 'react';
import { Warehouse, Sparkles, HeartPulse, Radio, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import type { TempUnit } from '@/types';
import GrainStorageDashboard from '@/components/GrainStorageDashboard';
import HackathonDashboard from '@/components/HackathonDashboard';
import RiskCalculatorExtension from '@/components/RiskCalculatorExtension';

type View = 'grain' | 'hackathon' | 'risk';

export default function App() {
  const [view, setView] = useState<View>('grain');
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top navigation bar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-slate-50/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 ring-1 ring-slate-300/50 dark:ring-slate-700/50">
              <Radio className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
              IoT Dashboard Suite
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Temperature unit toggle */}
            {view === 'grain' && (
              <div className="flex gap-0.5 rounded-lg border border-slate-200 bg-white/60 p-0.5 dark:border-slate-800 dark:bg-slate-900/60">
                <button
                  onClick={() => setTempUnit('C')}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                    tempUnit === 'C'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  °C
                </button>
                <button
                  onClick={() => setTempUnit('F')}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                    tempUnit === 'F'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  °F
                </button>
              </div>
            )}

            {/* View selector */}
            <div className="flex gap-1 rounded-lg border border-slate-200 bg-white/60 p-1 dark:border-slate-800 dark:bg-slate-900/60">
              <button
                onClick={() => setView('grain')}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  view === 'grain'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Warehouse className="h-4 w-4" />
                <span className="hidden sm:inline">Grain Storage</span>
              </button>
              <button
                onClick={() => setView('hackathon')}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  view === 'hackathon'
                    ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">HackPro AI</span>
              </button>
              <button
                onClick={() => setView('risk')}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  view === 'risk'
                    ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <HeartPulse className="h-4 w-4" />
                <span className="hidden sm:inline">Risk Calculator</span>
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white/60 text-slate-600 transition-colors hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </nav>

      {view === 'grain' && <GrainStorageDashboard tempUnit={tempUnit} />}
      {view === 'hackathon' && <HackathonDashboard />}
      {view === 'risk' && <RiskCalculatorExtension />}
    </div>
  );
}

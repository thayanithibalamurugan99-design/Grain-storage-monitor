import { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
  LayoutDashboard,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  priority: 'High' | 'Medium' | 'Low';
}

export default function HackathonDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [items, setItems] = useState<Task[]>([
    { id: '1', title: 'AI Recommendation Pipeline', category: 'Backend', status: 'Completed', priority: 'High' },
    { id: '2', title: 'Interactive Dashboard UI', category: 'Frontend', status: 'In Progress', priority: 'High' },
    { id: '3', title: 'Authentication & Roles', category: 'Security', status: 'Pending', priority: 'Medium' },
    { id: '4', title: 'Real-time WebSocket Sync', category: 'Infrastructure', status: 'In Progress', priority: 'Low' },
  ]);

  const handleAddItem = () => {
    const newItem: Task = {
      id: Date.now().toString(),
      title: `Hackathon Feature #${items.length + 1}`,
      category: 'Core',
      status: 'In Progress',
      priority: 'High',
    };
    setItems([newItem, ...items]);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const analyticsView = (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="bg-white/60 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Feature Velocity</h3>
        </div>
        <div className="space-y-3">
          {['Backend', 'Frontend', 'Security', 'Infrastructure', 'Core'].map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            const pct = items.length > 0 ? (count / items.length) * 100 : 0;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400">{cat}</span>
                  <span className="text-slate-400 dark:text-slate-500 tabular-nums">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white/60 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Status Breakdown</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {(['Completed', 'In Progress', 'Pending'] as const).map((status) => {
            const count = items.filter((i) => i.status === status).length;
            const color =
              status === 'Completed' ? 'text-emerald-500 dark:text-emerald-400' :
              status === 'In Progress' ? 'text-amber-500 dark:text-amber-400' :
              'text-slate-400';
            return (
              <div key={status} className="text-center">
                <p className={`text-3xl font-black ${color}`}>{count}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{status}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const settingsView = (
    <div className="bg-white/60 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 space-y-4 max-w-2xl">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Project Settings</h3>
      </div>
      {[
        { label: 'Project Name', value: 'Smart India Hackathon 2026' },
        { label: 'Team Size', value: '6 Members' },
        { label: 'Sprint Duration', value: '36 Hours' },
        { label: 'Repository', value: 'github.com/team/hackpro-ai' },
      ].map((row) => (
        <div key={row.label} className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">{row.label}</span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{row.value}</span>
        </div>
      ))}
    </div>
  );

  const overviewView = (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white/60 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Features</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{items.length}</p>
          <span className="inline-block mt-3 text-xs text-emerald-500 dark:text-emerald-400 font-medium">+100% Operational</span>
        </div>
        <div className="bg-white/60 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</p>
          <p className="text-3xl font-black text-emerald-500 dark:text-emerald-400 mt-2">
            {items.filter((i) => i.status === 'Completed').length}
          </p>
          <span className="inline-block mt-3 text-xs text-slate-400 dark:text-slate-500 font-medium">Ready for Demo</span>
        </div>
        <div className="bg-white/60 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Sprint</p>
          <p className="text-3xl font-black text-indigo-500 dark:text-indigo-400 mt-2">Internal</p>
          <span className="inline-block mt-3 text-xs text-indigo-500 dark:text-indigo-400 font-medium">Target: First Place</span>
        </div>
      </section>

      <section className="bg-white/60 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl max-w-md">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search features, modules, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-sm w-full"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100/50 dark:bg-slate-950/50 text-slate-400 uppercase text-xs font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Module Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{item.title}</td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{item.category}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      item.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                      'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold ${
                      item.priority === 'High' ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col md:flex-row font-sans">
      {showNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg font-semibold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>New action executed successfully!</span>
        </div>
      )}

      <aside className="w-full md:w-64 bg-white/60 border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">HackPro AI</span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-600 dark:text-slate-300">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Hackathon User</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Judge Mode Active</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Hackathon Control Center</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time status monitor and AI feature management</p>
          </div>
          <button
            onClick={handleAddItem}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Generate Entry</span>
          </button>
        </header>

        {activeTab === 'overview' && overviewView}
        {activeTab === 'analytics' && analyticsView}
        {activeTab === 'settings' && settingsView}
      </main>
    </div>
  );
}

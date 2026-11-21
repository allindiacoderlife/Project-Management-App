import { LayoutGrid, ListTodo, Users, Settings } from 'lucide-react';

export const Sidebar = ({ currentTab = 'board', onTabChange }) => {
  const navItems = [
    { id: 'board', label: 'Kanban Board', icon: LayoutGrid },
    { id: 'issues', label: 'All Issues', icon: ListTodo },
    { id: 'team', label: 'Team Members', icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-50/70 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
      <div className="space-y-6">
        <div>
          <div className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Planning
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange?.(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-600 dark:text-slate-400">
        <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
          Modern Bug Tracker
        </div>
        Built with MERN Stack, React 19, and accessible web primitives.
      </div>
    </aside>
  );
};

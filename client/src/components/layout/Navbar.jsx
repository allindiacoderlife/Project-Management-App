import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { FolderKanban, Plus, LogOut, ChevronDown, Check } from 'lucide-react';

export const Navbar = ({ onOpenCreateProject }) => {
  const { user, logout } = useAuth();
  const { projects, activeProject, setActiveProject } = useProject();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-30 sticky top-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight">
          <FolderKanban className="w-6 h-6" />
          <span>TrackFlow</span>
        </div>

        {/* Project Selector Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="max-w-[140px] truncate">
              {activeProject ? activeProject.title : 'No Project'}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1.5 z-40 animate-in fade-in-0 zoom-in-95"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Projects
              </div>
              <div className="max-h-56 overflow-y-auto">
                {projects.map((proj) => (
                  <button
                    key={proj._id}
                    type="button"
                    onClick={() => {
                      setActiveProject(proj);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <div className="truncate">
                      <div className="font-medium truncate">{proj.title}</div>
                      <div className="text-xs text-slate-400">{proj.key}</div>
                    </div>
                    {activeProject?._id === proj._id && (
                      <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenCreateProject();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-semibold flex items-center justify-center text-xs shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {user?.name}
            </div>
            <div className="text-xs text-slate-400 capitalize">{user?.role}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

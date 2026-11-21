import { GripVertical, AlertTriangle, Bug, Sparkles, CheckSquare, MessageSquare } from 'lucide-react';

const priorityConfig = {
  low: { label: 'Low', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  medium: { label: 'Medium', bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
  high: { label: 'High', bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
  urgent: { label: 'Urgent', bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' },
};

const typeIcons = {
  bug: Bug,
  feature: Sparkles,
  task: CheckSquare,
  improvement: AlertTriangle,
};

export const TicketCard = ({ ticket, onClick, dragHandleProps }) => {
  const TypeIcon = typeIcons[ticket.type] || Bug;
  const priority = priorityConfig[ticket.priority] || priorityConfig.medium;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <TypeIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-mono font-medium text-slate-400 uppercase">
            {ticket._id.slice(-5)}
          </span>
        </div>

        {/* Dedicated Drag Handle with touch-action: none per Modern Web Guidance */}
        <div
          {...dragHandleProps}
          onClick={(e) => e.stopPropagation()}
          className="text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded cursor-grab active:cursor-grabbing touch-none"
          title="Drag to reorder"
          aria-label="Drag handle"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-2 mb-2">
        {ticket.title}
      </h3>

      {ticket.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
          {ticket.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <span className={`px-2 py-0.5 rounded font-medium ${priority.bg}`}>
          {priority.label}
        </span>

        <div className="flex items-center gap-2">
          {ticket.assignee ? (
            <div
              title={`Assigned to ${ticket.assignee.name}`}
              className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold flex items-center justify-center text-[10px]"
            >
              {ticket.assignee.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <span className="text-slate-400 italic text-[11px]">Unassigned</span>
          )}
        </div>
      </div>
    </div>
  );
};

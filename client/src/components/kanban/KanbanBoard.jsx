import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TicketCard } from './TicketCard';
import { CircleDot, Clock, CheckCircle2 } from 'lucide-react';

const COLUMNS = [
  { id: 'todo', label: 'To Do', icon: CircleDot, color: 'text-amber-500' },
  { id: 'in_progress', label: 'In Progress', icon: Clock, color: 'text-blue-500' },
  { id: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-500' },
];

export const KanbanBoard = ({ tickets, onTicketClick, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {COLUMNS.map((column) => {
          const colTickets = tickets.filter((t) => t.status === column.id);
          const Icon = column.icon;

          return (
            <div
              key={column.id}
              className="bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${column.color}`} />
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {column.label}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-xs border border-slate-200 dark:border-slate-700">
                  {colTickets.length}
                </span>
              </div>

              {/* Droppable Container */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 flex flex-col gap-3 min-h-[200px] rounded-xl transition p-1 ${
                      snapshot.isDraggingOver
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-400/30'
                        : ''
                    }`}
                  >
                    {colTickets.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400 text-center">
                        No issues in {column.label.toLowerCase()}
                      </div>
                    ) : (
                      colTickets.map((ticket, index) => (
                        <Draggable
                          key={ticket._id}
                          draggableId={ticket._id}
                          index={index}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              style={dragProvided.draggableProps.style}
                              className={`transition-shadow ${
                                dragSnapshot.isDragging ? 'shadow-xl rotate-1 scale-[1.02]' : ''
                              }`}
                            >
                              <TicketCard
                                ticket={ticket}
                                onClick={() => onTicketClick(ticket)}
                                dragHandleProps={dragProvided.dragHandleProps}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

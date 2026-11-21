import { useState, useEffect, useCallback } from 'react';
import { useProject } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { FilterBar } from '../components/kanban/FilterBar';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { CreateTicketModal } from '../components/modals/CreateTicketModal';
import { TicketDetailModal } from '../components/modals/TicketDetailModal';
import { CreateProjectModal } from '../components/modals/CreateProjectModal';
import { FolderPlus, Users, UserPlus, Mail } from 'lucide-react';

export const DashboardPage = () => {
  const { activeProject, createProject, addMember, projects } = useProject();
  const { addToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('board'); // 'board' | 'issues' | 'team'

  // Modals state
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Team invite state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  const fetchTickets = useCallback(async () => {
    if (!activeProject?._id) return;

    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        projectId: activeProject._id,
        ...(priorityFilter ? { priority: priorityFilter } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(search ? { search } : {}),
      });

      const data = await apiFetch(`/tickets?${queryParams.toString()}`);
      setTickets(data);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [activeProject?._id, priorityFilter, statusFilter, search, addToast]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = async (ticketData) => {
    const created = await apiFetch('/tickets', {
      method: 'POST',
      body: JSON.stringify({ ...ticketData, project: activeProject._id }),
    });
    setTickets((prev) => [...prev, created]);
    addToast('Issue created successfully', 'success');
  };

  const handleUpdateTicket = async (ticketId, fields) => {
    const updated = await apiFetch(`/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify(fields),
    });
    setTickets((prev) => prev.map((t) => (t._id === ticketId ? updated : t)));
    if (selectedTicket?._id === ticketId) {
      setSelectedTicket(updated);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    await apiFetch(`/tickets/${ticketId}`, {
      method: 'DELETE',
    });
    setTickets((prev) => prev.filter((t) => t._id !== ticketId));
    if (selectedTicket?._id === ticketId) {
      setSelectedTicket(null);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const ticketToMove = tickets.find((t) => t._id === draggableId);
    if (!ticketToMove) return;

    const newStatus = destination.droppableId;
    const oldStatus = source.droppableId;

    // Optimistically update tickets
    const updatedList = [...tickets];
    const itemIndex = updatedList.findIndex((t) => t._id === draggableId);
    updatedList[itemIndex] = {
      ...updatedList[itemIndex],
      status: newStatus,
      order: destination.index,
    };
    setTickets(updatedList);

    try {
      await apiFetch(`/tickets/${draggableId}/order`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus,
          order: destination.index,
        }),
      });
    } catch (err) {
      console.error('Failed to update ticket order:', err);
      addToast('Failed to update ticket status', 'error');
      fetchTickets(); // Revert on failure
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !activeProject) return;
    try {
      setInviting(true);
      await addMember(activeProject._id, inviteEmail.trim());
      setInviteEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar onOpenCreateProject={() => setCreateProjectOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {!activeProject ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <FolderPlus className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-1">
                No Projects Found
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-sm">
                Get started by creating your first project workspace to track issues and sprints.
              </p>
              <button
                type="button"
                onClick={() => setCreateProjectOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div>
              {/* Project Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                      {activeProject.key}
                    </span>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {activeProject.title}
                    </h1>
                  </div>
                  {activeProject.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {activeProject.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {activeProject.members?.slice(0, 4).map((m, idx) => (
                      <div
                        key={idx}
                        title={m.user?.name || 'Member'}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-semibold flex items-center justify-center text-xs shadow-xs"
                      >
                        {m.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium ml-1">
                    {activeProject.members?.length || 1} members
                  </span>
                </div>
              </div>

              {currentTab === 'board' && (
                <>
                  <FilterBar
                    search={search}
                    onSearchChange={setSearch}
                    priorityFilter={priorityFilter}
                    onPriorityChange={setPriorityFilter}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    onOpenCreateTicket={() => setCreateTicketOpen(true)}
                  />

                  {loading ? (
                    <div className="py-20 flex justify-center">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <KanbanBoard
                      tickets={tickets}
                      onTicketClick={(ticket) => setSelectedTicket(ticket)}
                      onDragEnd={handleDragEnd}
                    />
                  )}
                </>
              )}

              {currentTab === 'issues' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                      All Issues ({tickets.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCreateTicketOpen(true)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                    >
                      New Issue
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {tickets.map((t) => (
                      <div
                        key={t._id}
                        onClick={() => setSelectedTicket(t)}
                        className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer flex items-center justify-between gap-4 transition"
                      >
                        <div>
                          <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                            {t.title}
                          </div>
                          <div className="text-xs text-slate-400 capitalize">
                            Status: {t.status.replace('_', ' ')} • Priority: {t.priority}
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTab === 'team' && (
                <div className="max-w-2xl space-y-6">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-indigo-500" />
                      <span>Invite Team Member</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      Add registered users by email to collaborate on issues and sprint planning.
                    </p>
                    <form onSubmit={handleInviteMember} className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="colleague@example.com"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={inviting || !inviteEmail.trim()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
                      >
                        {inviting ? 'Inviting...' : 'Add Member'}
                      </button>
                    </form>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-500" />
                      <span>Current Members ({activeProject.members?.length || 1})</span>
                    </h3>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {activeProject.members?.map((m, idx) => (
                        <div key={idx} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-sm">
                              {m.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {m.user?.name || 'Member'}
                              </div>
                              <div className="text-xs text-slate-400">{m.user?.email}</div>
                            </div>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                            {m.role || 'member'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateTicketModal
        isOpen={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
        onCreateTicket={handleCreateTicket}
        members={activeProject?.members || []}
      />

      <CreateProjectModal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onCreateProject={createProject}
      />

      <TicketDetailModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onUpdateTicket={handleUpdateTicket}
        onDeleteTicket={handleDeleteTicket}
        members={activeProject?.members || []}
      />
    </div>
  );
};

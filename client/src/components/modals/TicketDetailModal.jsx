import { useState, useEffect } from 'react';
import { Dialog } from '../common/Dialog';
import { apiFetch } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Trash2, MessageSquare, Send, Calendar, User } from 'lucide-react';

export const TicketDetailModal = ({
  isOpen,
  onClose,
  ticket,
  onUpdateTicket,
  onDeleteTicket,
  members = [],
}) => {
  const { addToast } = useToast();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!ticket?._id || !isOpen) return;

    const fetchComments = async () => {
      try {
        const data = await apiFetch(`/tickets/${ticket._id}/comments`);
        setComments(data);
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    };

    fetchComments();
    setConfirmDelete(false);
  }, [ticket?._id, isOpen]);

  if (!ticket) return null;

  const handleFieldChange = async (field, value) => {
    try {
      await onUpdateTicket(ticket._id, { [field]: value });
      addToast('Ticket updated', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const created = await apiFetch(`/tickets/${ticket._id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: newComment.trim() }),
      });
      setComments((prev) => [...prev, created]);
      setNewComment('');
      addToast('Comment added', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDeleteTicket(ticket._id);
      addToast('Issue deleted', 'success');
      onClose();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Issue Details: ${ticket.title}`} maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Title, Description, Comments */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Title
            </label>
            <input
              type="text"
              defaultValue={ticket.title}
              onBlur={(e) => {
                if (e.target.value !== ticket.title) {
                  handleFieldChange('title', e.target.value);
                }
              }}
              className="w-full px-3 py-2 text-base font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              defaultValue={ticket.description}
              placeholder="Add more details about this issue..."
              onBlur={(e) => {
                if (e.target.value !== ticket.description) {
                  handleFieldChange('description', e.target.value);
                }
              }}
              className="w-full px-3 py-2 text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Activity / Comments */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <h4 className="flex items-center gap-2 font-semibold text-sm text-slate-800 dark:text-slate-200 mb-3">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span>Activity & Comments ({comments.length})</span>
            </h4>

            {/* Comment List */}
            <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No comments yet. Start the conversation!</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <span>{comment.author?.name || 'User'}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Box */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="bg-slate-50/80 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Status</label>
            <select
              value={ticket.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Priority</label>
            <select
              value={ticket.priority}
              onChange={(e) => handleFieldChange('priority', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Assignee</label>
            <select
              value={ticket.assignee?._id || ''}
              onChange={(e) => handleFieldChange('assignee', e.target.value || null)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.user?._id || m._id} value={m.user?._id || m._id}>
                  {m.user?.name || m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Reporter: {ticket.reporter?.name || 'Team member'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Issue</span>
              </button>
            ) : (
              <div className="space-y-2 p-2 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900">
                <p className="text-rose-700 dark:text-rose-300 font-medium text-center">
                  Are you sure?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-medium shadow-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 py-1 bg-rose-600 text-white rounded font-medium hover:bg-rose-700 shadow-xs"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

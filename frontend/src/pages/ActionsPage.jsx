import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  AlertCircle,
  Calendar,
  Filter,
  ShieldCheck,
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { fetchActions, createAction, updateAction, deleteAction } from '../services/api';
import { useToast } from '../components/Toast';

export default function ActionsPage() {
  const { addToast } = useToast();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal for new task
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newCategory, setNewCategory] = useState('Immediate Actions');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      setLoading(true);
      const data = await fetchActions();
      setActions(data || []);
    } catch (e) {
      console.error(e);
      addToast('Could not load farm actions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const updated = await updateAction(id, { status: 'approved' });
      setActions((prev) => prev.map((a) => (a.id === id ? updated : a)));
      addToast('AI recommendation approved by farmer!', 'success');
    } catch (e) {
      addToast('Failed to approve action', 'error');
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'approved' : 'completed';
    try {
      const updated = await updateAction(id, { status: nextStatus });
      setActions((prev) => prev.map((a) => (a.id === id ? updated : a)));
      addToast(
        nextStatus === 'completed' ? 'Task marked as completed! 🎉' : 'Task reopened',
        'success'
      );
    } catch (e) {
      addToast('Failed to update task status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this farm action?')) return;
    try {
      await deleteAction(id);
      setActions((prev) => prev.filter((a) => a.id !== id));
      addToast('Task deleted successfully', 'info');
    } catch (e) {
      addToast('Failed to delete task', 'error');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast('Please enter a task title', 'warning');
      return;
    }

    try {
      const created = await createAction({
        title: newTitle,
        description: newDesc,
        reason: newReason || 'Farmer-initiated field management task',
        priority: newPriority,
        category: newCategory,
        suggested_date: newDate || new Date().toISOString().split('T')[0],
        status: 'approved' // Custom farmer tasks are pre-approved
      });
      setActions((prev) => [created, ...prev]);
      addToast('Custom farm task created successfully!', 'success');
      setIsModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      setNewReason('');
    } catch (e) {
      addToast('Failed to create task', 'error');
    }
  };

  const categories = [
    'All',
    'Immediate Actions',
    'Preventive Measures',
    'Monitoring Tasks',
    'Follow-up Activities'
  ];

  const filteredActions = actions.filter((act) => {
    const matchesCat = selectedCategory === 'All' || act.category === selectedCategory;
    const matchesStat =
      selectedStatus === 'All' ||
      (selectedStatus === 'pending' && act.status === 'pending') ||
      (selectedStatus === 'approved' && act.status === 'approved') ||
      (selectedStatus === 'completed' && act.status === 'completed');
    return matchesCat && matchesStat;
  });

  const pendingApprovalCount = actions.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            Decision Support & Task Management
          </div>
          <h1 className="text-3xl font-black text-forest-900 tracking-tight">
            Farm Action Planner
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Prioritized tasks synthesized by the Farm Action Planner Agent. Requires farmer approval before field execution.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Custom Task
        </button>
      </div>

      {/* Ethical Safety Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Farmer Approval Protocol</p>
          <p className="text-amber-900 mt-0.5 leading-relaxed">
            AI recommendations are not automatically executed in the physical world. Each recommended intervention
            must be explicitly reviewed and approved by the farmer to maintain complete human agency.
          </p>
        </div>
      </div>

      {/* Category Tabs & Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses ({actions.length})</option>
            <option value="pending">Awaiting Approval ({pendingApprovalCount})</option>
            <option value="approved">Approved & Scheduled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading scheduled farm actions...</p>
        </div>
      ) : filteredActions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <CheckCircle2 className="w-12 h-12 text-forest-700 mx-auto opacity-40" />
          <h3 className="text-base font-bold text-slate-800">No tasks in this view</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You have no tasks matching this filter. Run a crop investigation or click "Add Custom Task" to plan new activities.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActions.map((task) => {
            const isCompleted = task.status === 'completed';
            const isPending = task.status === 'pending';

            return (
              <div
                key={task.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                    : isPending
                    ? 'border-amber-200 hover:border-amber-300 shadow-sm'
                    : 'border-slate-200 hover:border-forest-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left task details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200">
                        {task.category}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                          task.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {task.priority} Priority
                      </span>

                      {isPending && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" /> Awaiting Farmer Approval
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Completed
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-base font-bold text-slate-900 ${
                        isCompleted ? 'line-through text-slate-500' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

                    {task.reason && (
                      <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <strong>Why this is recommended:</strong> {task.reason}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Scheduled: {task.suggested_date || 'Today'}
                      </span>
                    </div>
                  </div>

                  {/* Right Action Controls */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    {isPending ? (
                      <button
                        onClick={() => handleApprove(task.id)}
                        className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Action
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleComplete(task.id, task.status)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs border transition flex items-center gap-1.5 ${
                          isCompleted
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600 shadow-sm'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isCompleted ? 'Reopen Task' : 'Mark Completed'}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Add Custom Farm Action</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Apply compost tea on Block B"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  placeholder="Detailed instructions for field laborers or self..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason / Rationale</label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="e.g. Prevent secondary fungal spread after rain"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option>Immediate Actions</option>
                    <option>Preventive Measures</option>
                    <option>Monitoring Tasks</option>
                    <option>Follow-up Activities</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Scheduled Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest-800 text-white font-bold hover:bg-forest-900 shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from './components/Layout';
import api from './api';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    duration: 30,
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      toast.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/events', formData);
      toast.success('Event type created successfully!');
      setShowForm(false);
      setFormData({ title: '', duration: 30, description: '' });
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event type?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted.');
      fetchEvents();
    } catch (err) {
      toast.error('Deletion failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const copyLink = (slug) => {
    const link = `${window.location.origin}/book/${user.username}/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(slug);
    toast.success('Booking link copied!', {
      position: 'bottom-center',
      autoClose: 2000,
      theme: 'dark',
    });
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const durationPresets = [15, 30, 45, 60, 90];

  const colorPalette = [
    'from-indigo-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-sky-600',
  ];

  return (
    <Layout>

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-15%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="flex flex-col gap-6 lg:gap-8 max-w-6xl mx-auto py-8 px-6 sm:px-10 lg:px-12">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-indigo-400 to-purple-500" />
              <p className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-[0.25em]">
                Scheduling
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Event Types
            </h1>
            <p className="text-slate-400 text-sm sm:text-base font-medium max-w-md">
              Create templates for your meetings. Each type gets a unique booking link you can share.
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="group relative flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.97] overflow-hidden whitespace-nowrap"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Event Type
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          )}
        </div>

{showForm && (
          <div className="relative bg-white/[0.03] border border-indigo-500/15 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">

            <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">New Event Type</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Fill in the details below
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  Event Name
                  <span className="text-red-400 text-xs">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm font-medium placeholder-slate-600 transition-all duration-200 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/[0.03] focus:ring-1 focus:ring-indigo-500/20"
                  placeholder="e.g. 30-Min Strategy Call"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

<div className="space-y-3">
                <label className="text-sm font-bold text-slate-300">Duration</label>
                <div className="flex flex-wrap items-center gap-2">
                  {durationPresets.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, duration: d }))
                      }
                      className={`py-2 px-4 rounded-lg text-xs font-bold transition-all duration-200 ${
                        formData.duration === d
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400/30'
                          : 'bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      {d} min
                    </button>
                  ))}
                  <div className="relative">
                    <input
                      type="number"
                      name="duration"
                      className="w-20 py-2 px-3 bg-white/[0.04] border border-white/[0.06] rounded-lg text-white text-xs font-bold text-center placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                      placeholder="Custom"
                      value={
                        durationPresets.includes(formData.duration)
                          ? ''
                          : formData.duration
                      }
                      onChange={handleChange}
                      min="5"
                      max="480"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 font-medium">
                  Selected: {formData.duration} minutes
                </p>
              </div>

<div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  Description
                  <span className="text-slate-600 text-[10px] font-medium uppercase tracking-wider">
                    Optional
                  </span>
                </label>
                <textarea
                  name="description"
                  className="w-full p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm font-medium placeholder-slate-600 transition-all duration-200 min-h-[100px] resize-y focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/[0.03] focus:ring-1 focus:ring-indigo-500/20"
                  placeholder="Brief description for your guests..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-white/[0.04]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="py-3 px-6 rounded-xl text-sm font-bold text-slate-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.title.trim()}
                  className="relative py-3 px-8 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-indigo-500/20 active:scale-[0.97] flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Create Event Type
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

{loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/[0.04] rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/[0.06] rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-white/[0.06] rounded-lg" />
                    <div className="h-3 w-16 bg-white/[0.04] rounded-lg" />
                  </div>
                </div>
                <div className="h-3 w-full bg-white/[0.04] rounded-lg" />
                <div className="h-3 w-2/3 bg-white/[0.03] rounded-lg" />
                <div className="h-10 w-full bg-white/[0.04] rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : events.length === 0 && !showForm ? (

          <div className="relative bg-white/[0.02] border border-white/[0.05] rounded-2xl sm:rounded-3xl p-10 sm:p-16 text-center overflow-hidden">

            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <svg width="400" height="400" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="150" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="200" cy="200" r="120" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="200" cy="200" r="90" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="200" cy="200" r="60" stroke="white" strokeWidth="0.5" fill="none" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-indigo-500/10">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">
                No event types yet
              </h3>
              <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto mb-8 leading-relaxed">
                Event types are templates for your meetings. Create one to generate a shareable booking link.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-7 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.97]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create Your First Event
              </button>
            </div>
          </div>
        ) : events.length > 0 ? (
          <>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {events.length} event type{events.length !== 1 ? 's' : ''}
              </span>
              <div className="flex-1 h-px bg-white/[0.04]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {events.map((event, idx) => {
                const gradient = colorPalette[idx % colorPalette.length];
                const isDeleting = deletingId === event._id;
                const isCopied = copiedSlug === event.slug;

                return (
                  <div
                    key={event._id}
                    className={`group relative flex flex-col bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.1] hover:-translate-y-0.5 hover:shadow-xl ${
                      isDeleting ? 'opacity-50 scale-95' : ''
                    }`}
                  >

                    <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />

                    <div className="flex flex-col flex-1 p-5 sm:p-6">

                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                            >
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[15px] font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                                {event.duration} min
                              </span>
                            </div>
                          </div>
                        </div>

<button
                          onClick={() => handleDelete(event._id)}
                          disabled={isDeleting}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent text-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                          title="Delete event type"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>

<p className="text-xs text-slate-500 leading-relaxed flex-1 mb-5 line-clamp-2">
                        {event.description || 'No description provided.'}
                      </p>

<div className="mt-auto">
                        <div className="flex items-center justify-between gap-2 bg-white/[0.03] border border-white/[0.04] p-3 rounded-xl group-hover:border-white/[0.08] transition-colors">
                          <span className="text-[11px] text-slate-500 font-mono truncate flex-1">
                            /{user.username}/{event.slug}
                          </span>
                          <button
                            onClick={() => copyLink(event.slug)}
                            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all duration-200 whitespace-nowrap ${
                              isCopied
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 hover:bg-indigo-500/20'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Copied!
                              </>
                            ) : (
                              <>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

{!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="group flex flex-col items-center justify-center min-h-[220px] bg-white/[0.02] border-2 border-dashed border-white/[0.06] rounded-2xl transition-all duration-300 hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3 group-hover:bg-indigo-500/10 group-hover:scale-110 transition-all duration-300">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-slate-600 group-hover:text-indigo-400 transition-colors"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-400 transition-colors">
                    Add Event Type
                  </span>
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </Layout>
  );
}

export default Events;

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from './components/Layout';
import api from './api';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    const actionLabel = status === 'cancelled' ? 'cancel' : 'restore';
    if (!window.confirm(`Are you sure you want to ${actionLabel} this booking?`)) return;

    setUpdatingId(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status} successfully!`);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const getTabCount = (tab) => {
    const now = new Date();
    return bookings.filter((b) => {
      const start = new Date(b.startTime);
      if (tab === 'upcoming') return start > now && b.status === 'confirmed';
      if (tab === 'past') return start < now && b.status === 'confirmed';
      if (tab === 'cancelled') return b.status === 'cancelled';
      return false;
    }).length;
  };

  const filteredBookings = bookings.filter((booking) => {
    const now = new Date();
    const start = new Date(booking.startTime);
    if (activeTab === 'upcoming') return start > now && booking.status === 'confirmed';
    if (activeTab === 'past') return start < now && booking.status === 'confirmed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getRelativeDay = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return null;
  };

const groupedByDate = filteredBookings.reduce((groups, booking) => {
    const dateKey = new Date(booking.startTime).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(booking);
    return groups;
  }, {});

  return (
    <Layout>

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-15%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-purple-600/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="flex flex-col gap-6 lg:gap-8 max-w-5xl mx-auto py-8 px-6 sm:px-10 lg:px-12">

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-indigo-400 to-purple-500" />
            <p className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-[0.25em]">
              Appointments
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your Schedule
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-medium max-w-lg">
            View and manage all your guest appointments in one place.
          </p>
        </div>

<div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
          {tabs.map((tab) => {
            const count = getTabCount(tab.key);
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 py-2 px-4 sm:px-5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center tabular-nums ${
                      isActive
                        ? tab.key === 'cancelled'
                          ? 'bg-red-500/15 text-red-400'
                          : 'bg-indigo-500/15 text-indigo-400'
                        : 'bg-white/[0.05] text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

<div className="min-h-[400px]">
          {loading ? (

            <div className="space-y-3 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/[0.04] rounded-2xl p-5 flex items-center gap-5"
                >
                  <div className="w-14 h-14 bg-white/[0.06] rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 bg-white/[0.06] rounded-lg" />
                    <div className="h-3 w-56 bg-white/[0.04] rounded-lg" />
                  </div>
                  <div className="hidden sm:block w-20 h-6 bg-white/[0.04] rounded-lg" />
                  <div className="hidden sm:block w-10 h-10 bg-white/[0.04] rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (

            <div className="text-center py-16 sm:py-20 bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.05]">
              <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-5">
                {activeTab === 'cancelled' ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-extrabold text-white mb-1.5">
                No {activeTab} bookings
              </h3>
              <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                {activeTab === 'upcoming'
                  ? 'New appointments will appear here once guests book a time with you.'
                  : activeTab === 'past'
                  ? 'Your completed meetings will show up here.'
                  : 'Cancelled bookings will be listed here.'}
              </p>
            </div>
          ) : activeTab === 'upcoming' ? (

            <div className="space-y-6">
              {Object.entries(groupedByDate).map(([dateKey, dateBookings]) => {
                const relDay = getRelativeDay(dateBookings[0].startTime);
                return (
                  <div key={dateKey}>

                    <div className="flex items-center gap-3 mb-3 px-1">
                      <span className="text-xs font-bold text-slate-400">
                        {formatDate(dateBookings[0].startTime)}
                      </span>
                      {relDay && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          relDay === 'Today'
                            ? 'bg-indigo-500/15 text-indigo-400'
                            : 'bg-white/[0.05] text-slate-500'
                        }`}>
                          {relDay}
                        </span>
                      )}
                      <div className="flex-1 h-px bg-white/[0.04]" />
                    </div>

<div className="space-y-2">
                      {dateBookings.map((booking) => (
                        <BookingCard
                          key={booking._id}
                          booking={booking}
                          onStatusUpdate={handleStatusUpdate}
                          updatingId={updatingId}
                          formatTime={formatTime}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (

            <div className="space-y-2">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onStatusUpdate={handleStatusUpdate}
                  updatingId={updatingId}
                  formatTime={formatTime}
                  showDate
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function BookingCard({ booking, onStatusUpdate, updatingId, formatTime, showDate = false }) {
  const isUpdating = updatingId === booking._id;
  const isCancelled = booking.status === 'cancelled';

  const formatDateShort = (dateStr) =>
    new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div
      className={`group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
        isUpdating
          ? 'opacity-50 scale-[0.99]'
          : isCancelled
          ? 'bg-white/[0.015] border-white/[0.04] hover:bg-white/[0.03]'
          : 'bg-white/[0.025] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1]'
      }`}
    >

      <div className={`flex items-center sm:flex-col sm:items-center justify-center gap-2 sm:gap-0 min-w-[72px] h-auto sm:h-[68px] px-3 sm:px-0 py-2 sm:py-0 rounded-xl border transition-all group-hover:scale-[1.03] ${
        isCancelled
          ? 'bg-red-500/5 border-red-500/10'
          : 'bg-indigo-500/8 border-indigo-500/10 group-hover:border-indigo-500/20'
      }`}>
        {showDate && (
          <span className={`text-xs font-bold leading-none ${isCancelled ? 'text-slate-500' : 'text-slate-300'}`}>
            {formatDateShort(booking.startTime)}
          </span>
        )}
        <span className={`text-sm sm:text-base font-extrabold leading-none ${
          isCancelled ? 'text-slate-500' : 'text-white'
        }`}>
          {formatTime(booking.startTime)}
        </span>
        {!showDate && (
          <span className="text-[10px] font-semibold text-slate-600 hidden sm:block mt-0.5">
            {(() => {
              if (!booking.endTime) return '';
              const start = new Date(booking.startTime);
              const end = new Date(booking.endTime);
              const mins = Math.round((end - start) / 60000);
              return `${mins}m`;
            })()}
          </span>
        )}
      </div>

<div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`text-[15px] font-bold truncate transition-colors ${
            isCancelled
              ? 'text-slate-500 line-through decoration-slate-700'
              : 'text-white group-hover:text-indigo-300'
          }`}>
            {booking.guestName}
          </h4>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/[0.04] rounded-md text-[10px] font-bold text-slate-400 uppercase tracking-wider border border-white/[0.04]">
            <span className={`w-1.5 h-1.5 rounded-full ${isCancelled ? 'bg-red-400/50' : 'bg-indigo-400/60'}`} />
            {booking.eventId?.title || 'Meeting'}
          </span>
          <span className="text-xs text-slate-600 font-medium truncate max-w-[200px]">
            {booking.guestEmail}
          </span>
        </div>
      </div>

<div className="hidden md:block">
        <span className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
          isCancelled
            ? 'bg-red-500/8 text-red-400/80 border border-red-500/10'
            : 'bg-emerald-500/8 text-emerald-400 border border-emerald-500/10'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-current ${
            !isCancelled ? 'animate-pulse' : ''
          }`} />
          {booking.status}
        </span>
      </div>

<div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-none border-white/[0.04]">
        {isCancelled ? (
          <button
            onClick={() => onStatusUpdate(booking._id, 'confirmed')}
            disabled={isUpdating}
            className="flex-1 sm:flex-none h-9 sm:w-9 flex items-center justify-center gap-2 sm:gap-0 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-500 transition-all duration-200 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 disabled:opacity-30"
            title="Restore booking"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="sm:hidden text-xs font-bold">Restore</span>
          </button>
        ) : (
          <button
            onClick={() => onStatusUpdate(booking._id, 'cancelled')}
            disabled={isUpdating}
            className="flex-1 sm:flex-none h-9 sm:w-9 flex items-center justify-center gap-2 sm:gap-0 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 disabled:opacity-30"
            title="Cancel booking"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span className="sm:hidden text-xs font-bold">Cancel</span>
          </button>
        )}
        <a
          href={`mailto:${booking.guestEmail}`}
          className="flex-1 sm:flex-none h-9 sm:w-9 flex items-center justify-center gap-2 sm:gap-0 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-500 transition-all duration-200 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/20"
          title="Email guest"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span className="sm:hidden text-xs font-bold">Email</span>
        </a>
      </div>
    </div>
  );
}

export default Bookings;

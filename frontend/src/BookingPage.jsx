import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from './api';

function BookingPage() {
  const { username, eventSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [step, setStep] = useState(1);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/public/event/${username}/${eventSlug}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Event not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username, eventSlug]);

useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!guestInfo.name || !guestInfo.email) return toast.error('Please fill in all fields.');

    setIsSubmitting(true);
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');

      const startTime = new Date(`${year}-${month}-${day}T${selectedTime}`);
      const endTime = new Date(startTime.getTime() + data.event.duration * 60000);

      await api.post('/public/book', {
        userId: data.user._id,
        eventId: data.event._id,
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        startTime,
        endTime,
      });

      setStep(3);
      toast.success('Meeting booked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeDisplay = (time24) => {
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const renderCalendar = () => {
    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const days = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const canGoPrev = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

    const cells = [];
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }
    for (let d = 1; d <= days; d++) {
      const date = new Date(year, month, d);
      date.setHours(0, 0, 0, 0);
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isSelected = selectedDate && date.getTime() === selectedDate.getTime();

      cells.push(
        <button
          key={d}
          disabled={isPast}
          onClick={() => {
            setSelectedDate(date);
            setSelectedTime('');
          }}
          className={`
            relative aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200
            ${isPast ? 'text-slate-700 cursor-not-allowed' : 'cursor-pointer hover:bg-white/[0.06]'}
            ${isSelected
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/30 scale-105'
              : isToday
                ? 'bg-white/[0.04] text-indigo-400 ring-1 ring-indigo-500/20'
                : 'text-slate-300'
            }
          `}
        >
          {d}
          {isToday && !isSelected && (
            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
          )}
        </button>
      );
    }

    return (
      <div className="select-none">

        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => canGoPrev && setViewDate(new Date(year, month - 1, 1))}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
              canGoPrev
                ? 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                : 'text-slate-700 cursor-not-allowed'
            }`}
            disabled={!canGoPrev}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h3 className="text-sm font-bold text-white">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

<div className="grid grid-cols-7 mb-2">
          {weekDays.map((wd) => (
            <div key={wd} className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider py-1">
              {wd}
            </div>
          ))}
        </div>

<div className="grid grid-cols-7 gap-1">{cells}</div>
      </div>
    );
  };

if (loading) {
    return (
      <div className="min-h-screen min-h-dvh bg-[#0a0a0c] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading booking page…</p>
        </div>
      </div>
    );
  }

if (error) {
    return (
      <div className="min-h-screen min-h-dvh bg-[#0a0a0c] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 sm:p-10 text-center backdrop-blur-xl">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-white mb-2">Page Not Found</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { user, event } = data;
  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

  return (
    <div ref={topRef} className="min-h-screen min-h-dvh bg-[#0a0a0c] flex items-start sm:items-center justify-center p-3 sm:p-6 lg:p-8 font-['Inter',system-ui,sans-serif] text-white">

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/[0.06] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-purple-600/[0.04] rounded-full blur-[120px]" />
      </div>

      <div
        ref={containerRef}
        className={`w-full max-w-[960px] bg-white/[0.02] border border-white/[0.06] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl my-4 sm:my-0 ${
          step === 3 ? '' : 'grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[340px_1fr]'
        }`}
      >

        {step !== 3 && (
          <div className="p-6 sm:p-8 bg-white/[0.01] flex flex-col gap-6 border-b md:border-b-0 md:border-r border-white/[0.04]">

          <div className={`flex flex-col gap-4 ${step === 3 ? 'items-center' : ''}`}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">
                {user.name}
              </p>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

<div className="space-y-3">
            <div className={`flex items-center gap-3 ${step === 3 ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="text-sm text-slate-400 font-medium">{event.duration} minutes</span>
            </div>

            {selectedDate && (
              <div className={`flex items-center gap-3 ${step === 3 ? 'justify-center' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <span className="text-sm text-indigo-400 font-semibold">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                  {selectedTime && (
                    <span className="text-indigo-300"> · {formatTimeDisplay(selectedTime)}</span>
                  )}
                </span>
              </div>
            )}

            {event.description && (
              <p className={`text-xs text-slate-500 leading-relaxed pt-1 ${step === 3 ? 'max-w-xs' : 'max-w-[280px]'}`}>
                {event.description}
              </p>
            )}
          </div>

          </div>
        )}

<div className="p-5 sm:p-8 flex flex-col">

          {step === 1 && (
            <div className="flex flex-col h-full">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-0.5">Select Date & Time</h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Times shown in your local timezone
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Step 1 of 2
                </div>
              </div>

<div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1">

                <div className="flex-1 min-w-0">{renderCalendar()}</div>

<div className="lg:w-[180px] shrink-0">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    {selectedDate
                      ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
                      : 'Available times'}
                  </p>

                  {!selectedDate ? (
                    <div className="flex items-center justify-center py-10 lg:py-16 border border-dashed border-white/[0.06] rounded-xl">
                      <p className="text-xs text-slate-600 font-medium text-center px-4">
                        Pick a date to see available times
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-1 gap-1.5 max-h-[280px] lg:max-h-[340px] overflow-y-auto pr-0.5 scrollbar-thin">
                      {timeSlots.map((t) => {
                        const isSelected = selectedTime === t;
                        return (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 text-center border ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-indigo-500/30 hover:text-white hover:bg-white/[0.04]'
                            }`}
                          >
                            {formatTimeDisplay(t)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

<div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-white/[0.04]">
                <p className="text-[10px] text-slate-600 font-medium hidden sm:block">
                  {selectedDate && selectedTime
                    ? `${formatTimeDisplay(selectedTime)} · ${event.duration} min`
                    : 'Select date and time to continue'}
                </p>
                <button
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(2)}
                  className={`flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${
                    selectedDate && selectedTime
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.97]'
                      : 'bg-white/[0.04] text-slate-600 cursor-not-allowed'
                  }`}
                >
                  Continue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          )}

{step === 2 && (
            <div className="max-w-md mx-auto w-full flex flex-col justify-center min-h-[380px]">

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-bold text-white mb-0.5">Your Details</h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    We'll send a confirmation to your email
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Step 2 of 2
                </div>
              </div>

<div className="flex items-center gap-3 p-3.5 bg-indigo-500/[0.06] border border-indigo-500/15 rounded-xl mb-8">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedDate?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-indigo-400/80 font-medium">
                    {formatTimeDisplay(selectedTime)} · {event.duration} min
                  </p>
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 pl-0.5">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-3.5 bg-white/[0.03] border border-white/[0.07] rounded-xl text-white text-sm font-medium placeholder-slate-600 outline-none transition-all duration-200 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/15 focus:bg-white/[0.04]"
                    placeholder="John Doe"
                    value={guestInfo.name}
                    onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 pl-0.5">Email Address</label>
                  <input
                    type="email"
                    className="w-full p-3.5 bg-white/[0.03] border border-white/[0.07] rounded-xl text-white text-sm font-medium placeholder-slate-600 outline-none transition-all duration-200 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/15 focus:bg-white/[0.04]"
                    placeholder="john@example.com"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                    required
                  />
                </div>

<div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !guestInfo.name.trim() || !guestInfo.email.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Booking…
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center text-center py-6 sm:py-10 px-4 max-w-md mx-auto">
              <div className="relative mb-6">
                <div className="absolute inset-0 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl animate-pulse -m-2" />
                <div className="relative w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center rotate-3">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Confirmed!</h2>
                <p className="text-slate-400 text-sm font-medium">Scheduled with <span className="text-white font-bold">{user.name}</span></p>
              </div>

              <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 mb-8 relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.04] blur-2xl rounded-full" />
                <h3 className="text-lg font-bold text-white mb-4 relative z-10">{event.title}</h3>
                
                <div className="space-y-3 relative z-10">
                  <div className="flex items-start gap-3.5 p-3.5 bg-white/[0.04] rounded-2xl border border-white/[0.06]">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Time & Date</p>
                      <p className="text-sm font-bold text-white leading-tight">
                        {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs font-semibold text-indigo-400">
                        {formatTimeDisplay(selectedTime)} · {event.duration}m
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-3 py-0.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[11px] text-slate-500 font-medium">
                      Invitation sent to <span className="text-slate-300 font-bold">{guestInfo.email}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-center">
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedDate(null);
                    setSelectedTime('');
                    setGuestInfo({ name: '', email: '' });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-10 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                >
                  Book Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

{step !== 3 && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0a0a0c]/90 backdrop-blur-lg border-t border-white/[0.04] py-3 flex items-center justify-center gap-2 z-50">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              <path d="M7 12h10" /><path d="M12 7v10" />
            </svg>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Powered by <span className="text-white">SchedulePro</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default BookingPage;

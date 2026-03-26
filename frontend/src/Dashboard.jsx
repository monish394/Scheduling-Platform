import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from './components/Layout';
import api from './api';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({
    todayMeetings: 0,
    upcomingCount: 0,
    totalBookings: 0,
    meetingHours: '0.0'
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes, notifRes, eventsRes, availRes] = await Promise.all([
          api.get('/bookings/stats'),
          api.get('/bookings'),
          api.get('/notifications'),
          api.get('/events'),
          api.get('/availability')
        ]);

        setStats(statsRes.data);
        setEventTypes(eventsRes.data);
        setAvailability(availRes.data);
        setAllBookings(bookingsRes.data);

        const upcoming = bookingsRes.data
          .filter(b => b.status === 'confirmed' && new Date(b.startTime) > new Date())
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
          .slice(0, 3);
        setRecentBookings(upcoming);
        setNotifications(notifRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyLink = (slug = '') => {
    const link = `${window.location.origin}/book/${user.username}${slug ? '/' + slug : ''}`;
    navigator.clipboard.writeText(link);
    toast.success('Booking link copied! 📋');
  };

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDateShort = (dateStr) =>
    new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const activeDays = Array.isArray(availability) && availability.length > 0
    ? availability.filter(d => d.enabled).map(d => d.day.slice(0, 3)).join(', ')
    : 'Not set';

  const bookingChartData = (() => {
    const days = [];
    for (let i = 0; i <= 6; i++) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + i);
      days.push({
        label: i === 0 ? 'Today' : d.toLocaleDateString([], { weekday: 'short' }),
        date: d.toDateString(),
        count: 0
      });
    }
    allBookings.forEach(b => {
      const bd = new Date(b.startTime);
      bd.setHours(0, 0, 0, 0);
      const found = days.find(d => d.date === bd.toDateString());
      if (found) found.count++;
    });
    return days;
  })();

  const maxCount = Math.max(...bookingChartData.map(d => d.count), 1);
  const chartW = 560, chartH = 120, padX = 30, padY = 10;
  const pts = bookingChartData.map((d, i) => ({
    x: padX + (i / (bookingChartData.length - 1)) * (chartW - padX * 2),
    y: padY + (1 - d.count / maxCount) * (chartH - padY * 2),
    ...d
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${(chartH - padY).toFixed(1)} L${pts[0].x.toFixed(1)},${(chartH - padY).toFixed(1)} Z`;

  const eventBreakdown = eventTypes.slice(0, 4).map(ev => ({
    title: ev.title,
    color: ev.color || '#6366f1',
    duration: ev.duration,
    count: allBookings.filter(b => b.eventId?._id === ev._id || b.eventId === ev._id).length
  }));
  const totalBreakdownCount = eventBreakdown.reduce((s, e) => s + e.count, 0) || 1;

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col gap-8 max-w-7xl mx-auto pt-8 pb-20 px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="h-12 w-80 bg-white/[0.06] rounded-2xl" />
              <div className="h-6 w-64 bg-white/[0.04] rounded-xl" />
            </div>
            <div className="h-20 w-full lg:w-96 bg-white/[0.04] rounded-3xl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white/[0.04] rounded-3xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="h-80 bg-white/[0.04] rounded-[2rem]" />
              <div className="h-56 bg-white/[0.04] rounded-[2rem]" />
            </div>
            <div className="lg:col-span-4 space-y-8">
              <div className="h-44 bg-white/[0.04] rounded-[2rem]" />
              <div className="h-64 bg-white/[0.04] rounded-[2rem]" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/[0.05] rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-cyan-500/[0.03] rounded-full blur-[80px]" />
      </div>

      <div className="flex flex-col gap-8 lg:gap-10 max-w-[1600px] pt-2 pb-24 px-6 sm:px-10 lg:px-12">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 w-full">
  <div className="space-y-1.5 text-left">
    <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white m-0">
      {greeting}, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user.name?.split(' ')[0] || 'User'}</span>
    </h1>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest m-0">
      {stats.todayMeetings > 0 
        ? `${stats.todayMeetings} Session${stats.todayMeetings > 1 ? 's' : ''} Today` 
        : "No sessions today"}
    </p>
  </div>
  
  <div className="flex flex-wrap items-center gap-2.5">
    <Link id="btn-create-event" to="/events" className="flex items-center gap-2 px-3.5 py-2.5 bg-indigo-500 text-white rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/10">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Create Event
    </Link>
    <button id="btn-share-profile" onClick={() => copyLink()} className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] text-slate-300 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-white/[0.08] transition-all">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
      Share Profile
    </button>
  </div>
</div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              label: 'Today\'s Meetings',
              value: stats.todayMeetings,
              sub: 'scheduled',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
              gradient: 'from-blue-500 to-indigo-600',
              ring: 'ring-blue-500/20'
            },
            {
              label: 'Upcoming',
              value: stats.upcomingCount,
              sub: 'confirmed',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              gradient: 'from-violet-500 to-purple-600',
              ring: 'ring-violet-500/20'
            },
            {
              label: 'Total Bookings',
              value: stats.totalBookings,
              sub: 'all time',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ),
              gradient: 'from-emerald-500 to-teal-600',
              ring: 'ring-emerald-500/20'
            },
            {
              label: 'Meeting Hours',
              value: `${stats.meetingHours}h`,
              sub: 'invested',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
              gradient: 'from-amber-500 to-orange-600',
              ring: 'ring-amber-500/20'
            }
          ].map((stat, i) => (
            <div
              key={i}
              className={`group relative bg-white/[0.03] border border-white/[0.06] p-5 sm:p-6 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.1] hover:-translate-y-0.5 hover:shadow-xl cursor-default`}
            >
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider leading-none">
                    {stat.label}
                  </p>
                  <div className="text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight">
                    {stat.value}
                  </div>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.15em] hidden sm:block">
                    {stat.sub}
                  </p>
                </div>
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br ${stat.gradient} shadow-lg ring-1 ${stat.ring} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}>
                  {stat.icon}
                </div>
              </div>
              <div className={`absolute -bottom-8 -right-8 w-28 h-28 bg-gradient-to-br ${stat.gradient} opacity-[0.04] rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity duration-700`} />
            </div>
          ))}
        </div>

        <section className="bg-white/[0.03] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-violet-400 to-indigo-500" />
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Booking Activity</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium pl-5">Upcoming bookings — today through next 6 days</p>
            </div>
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-2xl font-black text-white tabular-nums">{stats.totalBookings}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total</p>
              </div>
              <div className="w-px h-8 bg-white/[0.06]" />
              <div className="text-center">
                <p className="text-2xl font-black text-indigo-400 tabular-nums">{stats.upcomingCount}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upcoming</p>
              </div>
              <div className="w-px h-8 bg-white/[0.06]" />
              <div className="text-center">
                <p className="text-2xl font-black text-emerald-400 tabular-nums">{stats.meetingHours}h</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hours</p>
              </div>
            </div>
          </div>

          <div className="relative w-full" style={{ height: '160px' }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${chartW} ${chartH + padY * 2}`} preserveAspectRatio="none" className="overflow-visible">
              <defs>
                <linearGradient id="bookingArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="bookingLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                const yVal = Math.round(maxCount * (1 - t));
                return (
                  <g key={i}>
                    <line
                      x1={padX} y1={padY + t * (chartH - padY * 2)}
                      x2={chartW - padX} y2={padY + t * (chartH - padY * 2)}
                      stroke="rgba(255,255,255,0.04)" strokeWidth="1"
                    />
                    {yVal > 0 && (
                      <text x={padX - 6} y={padY + t * (chartH - padY * 2) + 4} textAnchor="end" fontSize="8" fill="#475569" fontWeight="600">
                        {yVal}
                      </text>
                    )}
                  </g>
                );
              })}

              <path d={areaPath} fill="url(#bookingArea)" />

              <path d={linePath} fill="none" stroke="url(#bookingLine)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />

              {pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#a78bfa" stroke="#0a0a0c" strokeWidth="2" />
                  <circle cx={p.x} cy={p.y} r="10" fill="#6366f1" opacity="0.12" />

                  <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill="#c4b5fd" opacity="0.9">
                    {p.count}
                  </text>

                  <text x={p.x} y={chartH + padY + 8} textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569">
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {eventBreakdown.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/[0.04] grid grid-cols-2 sm:grid-cols-4 gap-3">
              {eventBreakdown.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                  <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{ev.title}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{ev.duration}m · {ev.count} booking{ev.count !== 1 ? 's' : ''}</p>
                    <div className="mt-1.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(ev.count / totalBreakdownCount) * 100}%`, backgroundColor: ev.color, opacity: 0.8 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 lg:gap-8">

            <section className="bg-white/[0.03] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 rounded-full bg-indigo-500" />
                  <h3 id="schedule-heading" className="text-sm font-extrabold text-white uppercase tracking-widest">Your Schedule</h3>
                </div>
                <Link to="/bookings" className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 flex items-center gap-1.5 group/link uppercase tracking-wider">
                  View Calendar
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/link:translate-x-0.5 transition-transform"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>

              {recentBookings.length > 0 && (
                <div id="next-up-card" className="mb-8 p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl relative overflow-hidden group hover:bg-white/[0.03] transition-all">
                  <div className="absolute top-0 right-0 p-5 text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-400/30">Next Up</div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex flex-col items-center justify-center shadow-lg shadow-indigo-500/10 transition-transform group-hover:scale-105">
                      <span className="text-base font-black leading-none">{new Date(recentBookings[0].startTime).getDate()}</span>
                      <span className="text-[8px] font-bold uppercase tracking-wider">{new Date(recentBookings[0].startTime).toLocaleDateString([], { month: 'short' })}</span>
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white mb-0.5 group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{recentBookings[0].guestName}</h4>
                      <div className="flex items-center gap-3 text-slate-500 text-[11px] font-bold">
                        <span className="flex items-center gap-1.5 uppercase tracking-wider text-indigo-400/80">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {formatTime(recentBookings[0].startTime)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-800" />
                        <span className="flex items-center gap-1.5 uppercase tracking-widest text-slate-400">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          {recentBookings[0].eventId?.title || 'Meeting'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.location.href = `mailto:${recentBookings[0].guestEmail}`}
                      className="mt-4 sm:mt-0 sm:ml-auto px-5 py-2.5 bg-white text-indigo-600 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                    >
                      Prepare
                    </button>
                  </div>
                </div>
              )}

              {recentBookings.length === 0 ? (
                <div className="text-center py-16 bg-white/[0.02] rounded-2xl border border-dashed border-white/[0.06]">
                  <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm font-semibold mb-1">No upcoming meetings</p>
                  <p className="text-slate-600 text-xs mb-6">Create an event type to start receiving bookings</p>
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 py-2.5 px-6 rounded-xl font-bold text-xs hover:bg-indigo-500/20 transition-all border border-indigo-500/20 hover:border-indigo-500/30"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create Event Type
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((booking, idx) => (
                    <div
                      key={booking._id}
                      className="group flex flex-col sm:flex-row items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-white/[0.02] border border-white/[0.04] rounded-2xl transition-all duration-300 hover:bg-white/[0.05] hover:border-indigo-500/15"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >

                      <div className="flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 min-w-[80px] h-auto sm:h-[78px] px-4 sm:px-0 py-2 sm:py-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/10 group-hover:border-indigo-500/20 transition-all group-hover:scale-[1.03]">
                        <span className="text-lg font-black text-white leading-none">
                          {formatDateShort(booking.startTime)}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-wider">
                          {formatTime(booking.startTime)}
                        </span>
                      </div>

                      <div className="flex-1 text-center sm:text-left min-w-0">
                        <h4 className="text-[15px] font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                          {booking.guestName}
                        </h4>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] rounded-lg text-[10px] text-slate-400 font-bold uppercase tracking-wider border border-white/[0.04]">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/60" />
                            {booking.eventId?.title || 'Meeting'}
                          </span>
                          <span className="text-xs text-slate-500 font-medium truncate max-w-[180px]">
                            {booking.guestEmail}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${booking.guestEmail}`}
                          className="w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/[0.06] rounded-xl text-slate-500 transition-all duration-300 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/20"
                          title="Send email"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </a>
                        <Link
                          to={`/bookings`}
                          className="w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/[0.06] rounded-xl text-slate-500 transition-all duration-300 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.12]"
                          title="View details"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white/[0.03] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-500" />
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    Event Templates
                  </h3>
                  {eventTypes.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-500 bg-white/[0.05] px-2.5 py-1 rounded-lg">
                      {eventTypes.length}
                    </span>
                  )}
                </div>
                <Link
                  to="/events"
                  className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-wider flex items-center gap-1.5 group/link"
                >
                  Manage
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/link:translate-x-0.5 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              {eventTypes.length === 0 ? (
                <div className="text-center py-12 bg-white/[0.02] rounded-2xl border border-dashed border-white/[0.06]">
                  <p className="text-slate-500 text-sm font-medium">No event templates created yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {eventTypes.map(event => (
                    <div
                      key={event._id}
                      className="group relative p-5 bg-white/[0.02] border border-white/[0.04] rounded-2xl transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.08] hover:-translate-y-0.5"
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className="w-1 h-full min-h-[44px] rounded-full shrink-0 transition-all duration-300 group-hover:w-1.5 group-hover:shadow-lg"
                          style={{
                            backgroundColor: event.color || '#6366f1',
                            boxShadow: `0 0 12px ${event.color || '#6366f1'}30`
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[15px] font-bold text-white truncate group-hover:text-indigo-300 transition-colors mb-1">
                            {event.title}
                          </h5>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                              </svg>
                              {event.duration}m
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-slate-600" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => copyLink(event.slug)}
                          className="w-9 h-9 flex items-center justify-center bg-white/[0.03] border border-white/[0.06] rounded-lg text-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/20"
                          title="Copy booking link"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:gap-8">

            <section className="bg-white/[0.03] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 lg:p-6 xl:p-8 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] blur-3xl rounded-full group-hover:bg-emerald-500/[0.06] transition-colors duration-700" />

              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-40" />
                  </div>
                  Availability
                </h3>
                <Link
                  to="/availability"
                  className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-wider"
                >
                  Edit →
                </Link>
              </div>

              <div className="relative z-10 p-4 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">Accepting Bookings</p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{activeDays}</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="quick-links" className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl sm:rounded-3xl p-6 lg:p-7 text-white relative overflow-hidden group">
  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
  <div className="relative z-10">
    <h3 className="text-base font-black uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      Quick Links
    </h3>
    <p className="text-xs text-indigo-100 font-medium mb-5">Your permanent booking page is ready to share with clients and colleagues.</p>
    <div className="space-y-3">
      <button 
        id="copy-booking-link"
        onClick={() => copyLink()} 
        className="w-full flex items-center justify-between p-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all group/btn"
      >
        <span className="text-xs font-bold truncate">schedulepro.com/{user.username}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover/btn:scale-110 transition-transform"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      </button>
      <Link 
        id="view-public-page"
        to={`/book/${user.username}`} 
        target="_blank"
        className="w-full flex items-center justify-center gap-2 py-3 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-indigo-50 transition-all"
      >
        View Public Page
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </Link>
    </div>
  </div>
</section>

<section id="focus-mode" className="bg-white/[0.03] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 lg:p-6 backdrop-blur-xl">
  <div className="flex items-center gap-3 mb-6">
    <div className="w-1.5 h-6 rounded-full bg-amber-400" />
    <h3 className="text-sm font-black uppercase tracking-widest text-white">Focus Mode</h3>
  </div>
  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-2">
    <p className="text-xs font-semibold text-amber-200/70 mb-1">PRO TIP</p>
    <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
      You have a <span className="text-white font-bold">2-hour deep work block</span> between your morning and afternoon sessions today.
    </p>
  </div>
</section>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-8deg); }
          40% { transform: rotate(14deg); }
          50% { transform: rotate(-4deg); }
          60% { transform: rotate(10deg); }
          70% { transform: rotate(0deg); }
        }
      `}</style>
    </Layout>
  );
}

export default Dashboard;

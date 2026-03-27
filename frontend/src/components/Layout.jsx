import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProfileModal from './ProfileModal';
import api from '../api';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('general');
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const menuItems = [
    { title: 'Overview', path: '/dashboard' },
    { title: 'Events', path: '/events' },
    { title: 'Availability', path: '/availability' },
    { title: 'Bookings', path: '/bookings' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotifyOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications.');
    }
  };

  const handleReadAll = async () => {
    if (unreadCount === 0) return;
    try {
      await api.post('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read.');
    }
  };

  const toggleNotifications = () => {
      setIsProfileOpen(false);
      setIsNotifyOpen(!isNotifyOpen);
      if (!isNotifyOpen && unreadCount > 0) handleReadAll();
  };

  const toggleProfile = () => {
      setIsNotifyOpen(false);
      setIsProfileOpen(!isProfileOpen);
  };

  const openProfileModal = (type) => {
      setModalType(type);
      setIsModalOpen(true);
      setIsProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0a0c',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
    },
    content: {
      flex: 1,
      marginLeft: '280px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
    },
    header: {
      height: '80px',
      padding: '0 2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(10, 10, 12, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    },
    search: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.65rem 1.25rem',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '400px',
      color: '#64748b',
    },
    searchInput: {
      background: 'none',
      border: 'none',
      color: '#fff',
      outline: 'none',
      fontSize: '0.9rem',
      width: '100%',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
    },
    iconBtn: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      width: '42px',
      height: '42px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748b',
      cursor: 'pointer',
      position: 'relative',
      transition: '0.2s',
    },
    badge: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      background: '#ef4444',
      color: '#fff',
      fontSize: '0.65rem',
      fontWeight: '800',
      padding: '2px 6px',
      borderRadius: '99px',
      border: '2px solid #0a0a0c',
    },
    profile: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.4rem 0.6rem 0.4rem 0.4rem',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '99px',
      cursor: 'pointer',
      transition: '0.2s',
    },
    avatar: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: '800',
      color: '#fff',
    },
    main: {
      padding: '2.5rem',
      flex: 1,
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 1rem)',
      right: 0,
      width: '300px',
      background: 'rgba(15, 15, 20, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      overflow: 'hidden',
      zIndex: 1000,
    },
    dropItem: {
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      color: '#e2e8f0',
      fontSize: '0.9rem',
      fontWeight: '600',
      width: '100%',
      textAlign: 'left',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: '0.2s',
    },
    glow: (n) => ({
      position: 'fixed',
      width: '600px',
      height: '600px',
      background: n === 1 ? 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, transparent 70%)',
      top: n === 1 ? '-200px' : '40%',
      left: n === 1 ? '20%' : '60%',
      pointerEvents: 'none',
      zIndex: 0,
    })
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-white font-['Inter',sans-serif]">

      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px]">

        <header className="h-20 px-6 sm:px-10 flex items-center justify-between bg-[#0a0a0c]/80 backdrop-blur-2xl border-b border-white/[0.05] sticky top-0 z-50">
          <div className="flex items-center gap-4 flex-1">

             <button
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
             </button>

            <div className="hidden sm:flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-xl w-full max-w-[400px] text-slate-500 focus-within:border-indigo-500/50 focus-within:bg-white/[0.05] transition-all group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-focus-within:text-indigo-400 transition-colors"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search anything..." className="bg-transparent border-none text-white outline-none text-sm w-full font-medium placeholder:text-slate-600" />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative">
              <button
                className={`w-11 h-11 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.08] transition-all hover:-translate-y-1 hover:bg-white/[0.06] hover:text-white group ${isNotifyOpen ? 'text-indigo-400 border-indigo-500/30' : 'text-slate-500'}`}
                onClick={toggleNotifications}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#0a0a0c]">{unreadCount}</span>}
              </button>

              {isNotifyOpen && (
                <div className="absolute top-full mt-4 right-0 w-[300px] sm:w-[350px] bg-[#111114]/95 backdrop-blur-3xl border border-white/[0.08] rounded-[2rem] shadow-2xl overflow-hidden z-[1000] animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.02]">
                    <h4 className="m-0 text-sm font-black uppercase tracking-widest text-white">Stream</h4>
                    <button onClick={handleReadAll} className="text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-300">Clear</button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-10 text-center text-slate-500 text-sm italic font-medium">No new activity.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n._id} className="p-5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer group">
                          <p className="m-0 mb-1 text-sm font-bold text-slate-300 group-hover:text-white leading-relaxed">{n.message}</p>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{new Date(n.createdAt).toLocaleTimeString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div
                className={`flex items-center gap-3 pl-1 pr-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] cursor-pointer transition-all hover:border-white/[0.15] hover:bg-white/[0.06] group ${isProfileOpen ? 'bg-white/[0.06] border-indigo-500/30' : ''}`}
                onClick={toggleProfile}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg transition-transform group-hover:scale-105">{getInitials(user.name)}</div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-black text-white leading-none mb-0.5">{user.name.split(' ')[0]}</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">{user.role || 'Free'}</span>
                </div>
              </div>

              {isProfileOpen && (
                <div className="absolute top-full mt-4 right-0 w-[240px] bg-[#111114]/95 backdrop-blur-3xl border border-white/[0.08] rounded-[2rem] shadow-2xl overflow-hidden z-[1000] animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="p-6 border-b border-white/[0.05] bg-white/[0.02]">
                    <p className="m-0 mb-1 font-black text-white text-sm">{user.name}</p>
                    <p className="m-0 text-[10px] font-bold text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => openProfileModal('general')} className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-400 hover:bg-white/[0.04] rounded-2xl transition-all group/item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/item:scale-110 transition-transform"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Edit Profile
                    </button>
                    <button onClick={() => openProfileModal('security')} className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-400 hover:bg-white/[0.04] rounded-2xl transition-all group/item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/item:scale-110 transition-transform"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        Change Password
                    </button>
                    <div className="h-px bg-white/[0.05] my-2 mx-5"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all group/item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/item:translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 relative z-10 w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialTab={modalType} />

<div className="fixed top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed top-[40%] left-[60%] w-[600px] h-[600px] bg-violet-600/3 rounded-full blur-[120px] pointer-events-none z-0"></div>

{isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0a0a0c] border-r border-white/10 animate-in slide-in-from-left duration-300">
                <div className="flex justify-end p-4">
                     <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                     </button>
                </div>
                <Sidebar />
            </div>
        </div>
      )}
    </div>
  );
}

export default Layout;

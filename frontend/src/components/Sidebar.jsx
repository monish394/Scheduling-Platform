import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Overview',
      path: '/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      title: 'Events',
      path: '/events',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      title: 'Availability',
      path: '/availability',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      title: 'Bookings',
      path: '/bookings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
  ];

  const styles = {
    sidebar: {
      width: '280px',
      height: '100vh',
      background: 'rgba(255, 255, 255, 0.01)',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
    },
    brand: {
      padding: '2.5rem 2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '1.25rem',
      fontWeight: '800',
      color: '#fff',
    },
    logo: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
    },
    nav: {
      flex: 1,
      padding: '0 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
    },
    link: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem 1.25rem',
      borderRadius: '14px',
      color: active ? '#fff' : '#64748b',
      textDecoration: 'none',
      fontSize: '0.95rem',
      fontWeight: '700',
      background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
      border: '1px solid',
      borderColor: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
      transition: 'all 0.2s',
    }),
    footer: {
      padding: '2rem',
    },
    upgradeCard: {
      width: '100%',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '20px',
      textAlign: 'left',
      cursor: 'pointer',
      transition: '0.3s',
    }
  };

  return (
    <aside className="w-[280px] h-screen bg-white/[0.01] border-r border-white/5 flex flex-col fixed left-0 top-0 z-[100]">
      <Link to="/" className="p-10 px-8 flex items-center gap-3 group transition-all active:scale-95">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
          <img src="/images/logo.png" alt="SchedulePro Logo" className="w-full h-full object-cover" />
        </div>
        <span className="text-xl font-black tracking-tighter text-white">SchedulePro</span>
      </Link>

      <nav className="flex-1 px-4 flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-[0.95rem] font-bold transition-all duration-200 group ${
                active
                  ? 'text-white bg-indigo-500/10 border border-indigo-500/15'
                  : 'text-slate-500 hover:bg-white/[0.03] hover:text-white border border-transparent'
              }`}
            >
              <span className={`transition-colors duration-200 ${active ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`}>
                {item.icon}
              </span>
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-8">
        <button className="w-full p-6 text-left rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-2xl active:scale-95 group">
          <h4 className="m-0 mb-2 text-sm font-black text-white group-hover:text-indigo-300">Upgrade Pro</h4>
          <p className="m-0 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">Unlimited events & premium themes.</p>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

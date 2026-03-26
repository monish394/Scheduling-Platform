import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-['Inter',system-ui,sans-serif] overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0c]/70 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all active:scale-95">
              <img src="/images/logo.png" alt="SchedulePro Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-cyan-200 to-sky-400 bg-clip-text text-transparent">SchedulePro</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              How it Works
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors hidden sm:block"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white text-sm font-black py-2.5 px-6 rounded-xl transition-all duration-300 shadow-xl shadow-cyan-500/10 active:scale-[0.97]"
            >
              Get Started
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="hidden sm:block">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-indigo-600/[0.08] rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-purple-600/[0.06] rounded-full blur-[100px]" />
        </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-6 sm:mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Scheduling made simple
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.02]">
              The Power of
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                Vibrant Scheduling
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-400 font-medium max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              Eliminate the manual work. Schedule smarter with automated time blocks, AI-driven availability, and cinematic user experiences.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-20 sm:mb-24">
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-indigo-500/30 active:scale-[0.97]"
              >
                Get Started Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-sm font-bold py-3.5 px-8 rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
              >
                Watch Cinematic Demo
              </a>
            </div>

            <div className="mt-4 max-w-5xl mx-auto px-2 relative group">
               <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10 group-hover:bg-indigo-500/20 transition-all duration-700" />
              
              
            </div>

            <div className="mt-20 sm:mt-24 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
              {[
                { value: '10K+', label: 'Teams Syncing' },
                { value: '1.2M+', label: 'Meetings Handled' },
                { value: '99.9%', label: 'Cloud Uptime' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
      </section>

      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3 sm:mb-4">
              Everything you need to schedule smarter
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-medium max-w-2xl mx-auto">
              Powerful tools designed to save you hours every week
            </p>
          </div>

          <div id="feature-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: `Custom Availability`,
                desc: `Set your working hours and let people book within your schedule.`,
                gradient: `from-indigo-500 to-blue-600`,
              },
              {
                title: `Calendar Sync`,
                desc: `Two-way sync with Google Calendar, Outlook, and iCloud.`,
                gradient: `from-violet-500 to-purple-600`,
              },
              {
                title: `Instant Notifications`,
                desc: `Get real-time alerts when someone books or cancels a meeting.`,
                gradient: `from-pink-500 to-rose-600`,
              },
              {
                title: `Multiple Event Types`,
                desc: `Create different meeting templates with custom durations.`,
                gradient: `from-amber-500 to-orange-600`,
              },
              {
                title: `Time Zone Detection`,
                desc: `Automatically adjusts to your guests' local time zones.`,
                gradient: `from-emerald-500 to-teal-600`,
              },
              {
                title: `Secure & Private`,
                desc: `Your data is encrypted and never shared with third parties.`,
                gradient: `from-cyan-500 to-sky-600`,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04]"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">How it Works</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Get started in 3 simple steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {[
              { num: `01`, title: `Create Your Account`, desc: `Sign up for free in under 30 seconds. No credit card required.` },
              { num: `02`, title: `Set Your Availability`, desc: `Define when you're free to meet. Multiple time slots per day supported.` },
              { num: `03`, title: `Share Your Link`, desc: `Send your custom booking link. People choose a time that works for both of you.` },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-5xl sm:text-6xl font-black text-white/[0.06] mb-4">{step.num}</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden sm:block absolute top-8 -right-3 w-6 h-px bg-white/[0.08]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 border border-indigo-500/20 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3 sm:mb-4">
                Ready to simplify your scheduling?
              </h2>
              <p className="text-sm sm:text-base text-slate-400 font-medium mb-8 max-w-xl mx-auto">
                Join thousands of professionals who've reclaimed hours every week.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm sm:text-base font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-xl transition-all duration-300 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.97]"
              >
                Get Started — It's Free
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 border-t border-white/[0.05] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <span className="text-base font-bold">SchedulePro</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                Making scheduling simple for everyone.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="block text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                  How it Works
                </a>
                <Link to="/register" className="block text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                  Pricing
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                  About
                </a>
                <a href="#" className="block text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                  Blog
                </a>
                <a href="#" className="block text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                  Careers
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                  Privacy
                </a>
                <a href="#" className="block text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                  Terms
                </a>
                <a href="#" className="block text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                  Security
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.05] text-center">
            <p className="text-xs text-slate-600 font-medium">
              © {new Date().getFullYear()} SchedulePro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
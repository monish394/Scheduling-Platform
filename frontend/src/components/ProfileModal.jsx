import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api';

function ProfileModal({ isOpen, onClose, initialTab = 'general' }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user.name || '',
    username: user.username || '',
    timezone: user.timezone || 'Asia/Kolkata'
  });

  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (isOpen) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(currentUser);
        setProfileData({
            name: currentUser.name || '',
            username: currentUser.username || '',
            timezone: currentUser.timezone || 'Asia/Kolkata'
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/profile', profileData);
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully! ✨');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    setLoading(true);
    try {
      await api.patch('/users/password', {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword
      });
      toast.success('Password changed successfully! 🔐');
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1.5rem',
    },
    modal: {
      width: '100%',
      maxWidth: '460px',
      background: 'rgba(15, 15, 20, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
      animation: 'modalSlideIn 0.3s ease-out',
    },
    header: {
      padding: '1.5rem 2rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    h3: { margin: 0, fontSize: '1.15rem', color: '#fff', fontWeight: '800' },
    closeBtn: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#64748b',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '1.25rem',
      transition: '0.2s',
    },
    body: { padding: '2rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    group: { display: 'flex', flexDirection: 'column', gap: '0.65rem' },
    label: { fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0' },
    input: {
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      padding: '0.9rem 1.25rem',
      color: '#fff',
      fontSize: '0.95rem',
      outline: 'none',
      transition: '0.2s',
    },
    submit: {
      background: 'linear-gradient(135deg, #6366f1, #818cf8)',
      color: '#fff',
      border: 'none',
      padding: '1.1rem',
      borderRadius: '14px',
      fontWeight: '800',
      fontSize: '0.95rem',
      cursor: 'pointer',
      marginTop: '1rem',
      boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
      transition: '0.3s',
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1100] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <h3 className="m-0 text-sm font-bold text-white uppercase tracking-widest">
            {initialTab === 'general' ? 'Edit Profile' : 'Security'}
          </h3>
          <button
            className="text-slate-500 hover:text-white transition-colors text-xl font-light"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {initialTab === 'general' ? (
            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5 focus-within:text-indigo-400 transition-colors">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Name</label>
                <input
                  type="text"
                  className="bg-white/[0.02] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500/50 transition-all w-full"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 focus-within:text-indigo-400 transition-colors">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm">@</span>
                  <input
                    type="text"
                    className="bg-white/[0.02] border border-white/[0.1] rounded-xl pl-8 pr-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500/50 transition-all w-full"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 focus-within:text-indigo-400 transition-colors">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Timezone</label>
                <select
                  className="bg-[#0f0f12] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500/50 transition-all w-full cursor-pointer"
                  value={profileData.timezone}
                  onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                >
                  <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
                  <option value="UTC">UTC (Standard)</option>
                  <option value="America/New_York">EST (New York)</option>
                </select>
              </div>
              <button
                type="submit"
                className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5 focus-within:text-emerald-400 transition-colors">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Current Password</label>
                <input
                  type="password"
                  className="bg-white/[0.02] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all w-full"
                  value={passData.currentPassword}
                  onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 focus-within:text-emerald-400 transition-colors">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">New Password</label>
                <input
                  type="password"
                  className="bg-white/[0.02] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all w-full"
                  value={passData.newPassword}
                  onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 focus-within:text-emerald-400 transition-colors">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Confirm Password</label>
                <input
                  type="password"
                  className="bg-white/[0.02] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all w-full"
                  value={passData.confirmPassword}
                  onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;

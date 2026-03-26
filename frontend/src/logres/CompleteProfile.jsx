import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './logres.css';

const API_URL = 'http://localhost:5001/api/users';

function CompleteProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) {
      navigate('/login');
      return;
    }
    setUserData(savedUser);
    setFormData({
      name: savedUser.name || '',
      username: savedUser.username || '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setError('Username is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.patch(`${API_URL}/complete-profile`, {
        _id: userData._id,
        ...formData
      });

      localStorage.setItem('user', JSON.stringify({
        ...userData,
        name: res.data.name,
        username: res.data.username,
      }));

      toast.success('Profile completed! 🎉');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="logres-page">
      <div className="logres-form-section">
        <div className="logres-form-container">
          <div className="logres-brand">
            <div className="logres-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                <path d="M7 12h10" /><path d="M12 7v10" />
              </svg>
            </div>
            <span>SchedulePro</span>
          </div>

          <div className="logres-heading">
            <h1>Almost there! 🚀</h1>
            <p>Please finalize your profile details to get started.</p>
          </div>

          {error && <div className="logres-error-msg">{error}</div>}

          <form className="logres-form" onSubmit={handleSubmit}>
            <div className="logres-field">
              <label>Full Name</label>
              <div className="logres-input-wrapper">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className={error && !formData.name ? 'error' : ''}
                />
              </div>
            </div>

            <div className="logres-field">
              <label>Username</label>
              <div className="logres-input-wrapper">
                <span className="logres-at-symbol">@</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username"
                  className={error && !formData.username ? 'error' : ''}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div className="logres-field">
              <label>Timezone</label>
              <select 
                name="timezone" 
                value={formData.timezone} 
                onChange={handleChange}
                className="logres-select"
              >
                {Intl.supportedValuesOf('timeZone').map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="logres-submit-btn" disabled={loading}>
              {loading ? (
                <div className="logres-loader"></div>
              ) : 'Complete Signup'}
            </button>
          </form>
        </div>
      </div>

      <div className="logres-image-section">
        <div className="logres-image-overlay"></div>
        <img src="/login_hero.png" alt="Onboarding" className="logres-hero-img" />
        <div className="logres-image-content">
          <div className="logres-image-badge">✨ One last step</div>
          <h2>Personalize your experience</h2>
          <p>Choose a unique username and select your local timezone for accurate meeting coordination.</p>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;

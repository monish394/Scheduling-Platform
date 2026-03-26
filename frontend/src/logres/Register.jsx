import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import './logres.css';

const API_URL = '/api/users';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

const validate = () => {
    if (!formData.name.trim()) return 'Full name is required.';
    if (formData.name.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!formData.username.trim()) return 'Username is required.';
    if (formData.username.trim().length < 3) return 'Username must be at least 3 characters.';
    if (/\s/.test(formData.username)) return 'Username cannot contain spaces.';
    if (!formData.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email address.';
    if (!formData.password) return 'Password is required.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (!formData.confirmPassword) return 'Please confirm your password.';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...payload } = formData;
      const res = await axios.post(`${API_URL}/register`, payload);

      toast.success(res.data.message || 'Registration successful! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      console.log('Google credentialResponse:', credentialResponse);
      const res = await axios.post(`${API_URL}/google-login`, {
        credential: credentialResponse.credential
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        username: res.data.username,
        role: res.data.role,
      }));

      toast.success(res.data.isNew ? 'Almost there! 🚀' : 'Social Account linked! 🎉');
      
      if (res.data.isNew) {
        setTimeout(() => navigate('/complete-profile'), 1500);
      } else {
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      console.error('Google Sign-up Error:', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Google Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

const getPasswordStrength = (pw) => {
    if (!pw) return { level: 0, text: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
      { level: 1, text: 'Weak', color: '#ef4444' },
      { level: 2, text: 'Fair', color: '#f59e0b' },
      { level: 3, text: 'Good', color: '#3b82f6' },
      { level: 4, text: 'Strong', color: '#10b981' },
    ];
    return levels[score - 1] || { level: 0, text: '', color: '' };
  };

  const pwStrength = getPasswordStrength(formData.password);

  return (
    <div className="logres-page logres-register">
      <div className="logres-image-section">
        <div className="logres-image-overlay"></div>
        <img src="/register_hero.png" alt="Join the team illustration" className="logres-hero-img" />
        <div className="logres-image-content">
          <div className="logres-image-badge">🚀 Get started in 2 minutes</div>
          <h2>Join thousands of teams</h2>
          <p>Create your free account and start organizing your schedule like a pro. No credit card required.</p>
          <div className="logres-features-list">
            <div className="logres-feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Unlimited scheduling</span>
            </div>
            <div className="logres-feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Team collaboration</span>
            </div>
            <div className="logres-feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Calendar integration</span>
            </div>
          </div>
        </div>
      </div>

      <div className="logres-form-section">
        <Link to="/" className="logres-back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Home
        </Link>
        <div className="logres-form-container">
          <div className="logres-brand">
            <div className="logres-brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                <path d="M7 12h10" /><path d="M12 7v10" />
              </svg>
            </div>
            <span className="logres-brand-name">SchedulePro</span>
          </div>

          <div className="logres-heading">
            <h1>Create your account</h1>
            <p>Start scheduling smarter today</p>
          </div>

{error && (
            <div className="logres-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          
          <form onSubmit={handleSubmit} className="logres-form" noValidate>
                        <div className="logres-field-row">
              <div className="logres-field">
                <label htmlFor="reg-name">Full Name</label>
                <div className="logres-input-wrapper">
                  <svg className="logres-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    id="reg-name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="logres-field">
                <label htmlFor="reg-username">Username</label>
                <div className="logres-input-wrapper">
                  <svg className="logres-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="2" x2="12" y2="7" />
                  </svg>
                  <input
                    id="reg-username"
                    type="text"
                    name="username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="logres-field">
              <label htmlFor="reg-email">Email address</label>
              <div className="logres-input-wrapper">
                <svg className="logres-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

                        <div className="logres-field-row">
              <div className="logres-field">
                <label htmlFor="reg-password">Password</label>
                <div className="logres-input-wrapper">
                  <svg className="logres-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button type="button" className="logres-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="logres-field">
                <label htmlFor="reg-confirm-password">Confirm</label>
                <div className="logres-input-wrapper">
                  <svg className="logres-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button type="button" className="logres-toggle-pw" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="logres-field">
              <label htmlFor="reg-timezone">Timezone</label>
              <div className="logres-input-wrapper">
                <svg className="logres-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <select
                  id="reg-timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="logres-select"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (US)</option>
                  <option value="America/Chicago">Central Time (US)</option>
                  <option value="America/Denver">Mountain Time (US)</option>
                  <option value="America/Los_Angeles">Pacific Time (US)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Europe/Berlin">Berlin (CET)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Asia/Shanghai">China (CST)</option>
                  <option value="Asia/Tokyo">Japan (JST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                  <option value="Pacific/Auckland">Auckland (NZST)</option>
                </select>
              </div>
            </div>

            <div className="logres-remember">
              <label className="logres-checkbox-label">
                <input type="checkbox" required />
                <span className="logres-checkmark"></span>
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="logres-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </form>

          <p className="logres-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <div className="flex justify-center mt-6">
            <GoogleLogin
               onSuccess={handleGoogleSuccess}
               onError={() => toast.error('Google Sign-up failed')}
               useOneTap
               theme="filled_black"
               shape="pill"
               text="signup_with"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

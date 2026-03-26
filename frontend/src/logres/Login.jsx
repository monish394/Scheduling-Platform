import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import './logres.css';

const API_URL = '/api/users';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

const validate = () => {
    if (!formData.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email address.';
    if (!formData.password) return 'Password is required.';
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
      const res = await axios.post(`${API_URL}/login`, formData);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        username: res.data.username,
        role: res.data.role,
      }));

      toast.success('Login successful! Welcome back 🎉');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
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

      toast.success(res.data.isNew ? 'Almost there! 🚀' : 'Social Login successful! 🎉');
      
      if (res.data.isNew) {
        setTimeout(() => navigate('/complete-profile'), 1500);
      } else {
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      console.error('Google Social Login Error:', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Google Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logres-page">

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
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue scheduling</p>
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
            <div className="logres-field">
              <label htmlFor="login-email">Email address</label>
              <div className="logres-input-wrapper">
                <svg className="logres-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="logres-field">
              <div className="logres-label-row">
                <label htmlFor="login-password">Password</label>
                <a href="#" className="logres-forgot">Forgot password?</a>
              </div>
              <div className="logres-input-wrapper">
                <svg className="logres-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="logres-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="logres-remember">
              <label className="logres-checkbox-label">
                <input type="checkbox" />
                <span className="logres-checkmark"></span>
                Remember me for 30 days
              </label>
            </div>

            <button type="submit" className="logres-submit-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </form>

          <p className="logres-switch">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>

          <div className="flex justify-center mt-6">
            <GoogleLogin
               onSuccess={handleGoogleSuccess}
               onError={() => toast.error('Google Sign-In failed')}
               useOneTap
               theme="filled_black"
               shape="pill"
            />
          </div>
        </div>
      </div>

      <div className="logres-image-section">
        <div className="logres-image-overlay"></div>
        <img src="/login_hero.png" alt="Team scheduling illustration" className="logres-hero-img" />
        <div className="logres-image-content">
          <div className="logres-image-badge">✨ Trusted by 10,000+ teams</div>
          <h2>Streamline your scheduling</h2>
          <p>Collaborate seamlessly with your team. Set availability, book meetings, and manage events — all in one place.</p>
          <div className="logres-image-dots">
            <span className="logres-dot active"></span>
            <span className="logres-dot"></span>
            <span className="logres-dot"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

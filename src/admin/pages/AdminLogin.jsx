import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../styles/AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Check if redirected due to session expiration
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === '1') {
      setError('Your security session has expired. Please log in again.');
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('Login submission failed:', err);
      setError(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adl-wrapper">
      {/* Ambient background glows */}
      <div className="adl-ambient">
        <div className="adl-orb adl-orb--top"></div>
        <div className="adl-orb adl-orb--bottom"></div>
        <div className="adl-grid-overlay"></div>
      </div>

      <div className="adl-card-container">
        {/* Brand Card Header */}
        <div className="adl-brand">
          <div className="adl-brand__icon-wrap">
            <ShieldCheck size={28} className="adl-brand__icon" />
          </div>
          <span className="adl-brand__title">BER SERVICES</span>
          <span className="adl-brand__pill">ENTERPRISE ADMIN GATEWAY</span>
        </div>

        {/* Main Card */}
        <div className="adl-card">
          <div className="adl-card__header">
            <h1 className="adl-card__title">Sign In to Console</h1>
            <p className="adl-card__subtitle">
              Enter your authorized credentials to manage client telemetry and leads.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="adl-alert adl-alert--error">
              <AlertCircle size={18} className="adl-alert__icon" />
              <div className="adl-alert__text">{error}</div>
            </div>
          )}

          {/* Form */}
          <form className="adl-form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="adl-field">
              <label className="adl-label" htmlFor="admin-email">
                Admin Email Address
              </label>
              <div className="adl-input-wrap">
                <Mail size={18} className="adl-input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  className="adl-input"
                  placeholder="Enter authorized email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="adl-field">
              <div className="adl-field__header">
                <label className="adl-label" htmlFor="admin-password">
                  Security Password
                </label>
              </div>
              <div className="adl-input-wrap">
                <Lock size={18} className="adl-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="adl-input"
                  placeholder="Enter security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="adl-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Session notice */}
            <div className="adl-session-info">
              <CheckCircle2 size={14} className="adl-session-icon" />
              <span>Session stored securely in browser session storage</span>
            </div>

            {/* Submit Button */}
            <button type="submit" className="adl-btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="adl-spinner"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter Console</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Public Website link */}
        <div className="adl-footer-links">
          <Link to="/" className="adl-back-link">
            <ArrowLeft size={15} />
            <span>Back to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate('/posts');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-inner animate-in">
        <Link to="/" className="auth-back">
          ← Back to home
        </Link>
        <h1 className="page-title">Sign in</h1>
        <p className="auth-subtitle">Enter your email and password</p>

        <div className="card auth-card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Login'}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}

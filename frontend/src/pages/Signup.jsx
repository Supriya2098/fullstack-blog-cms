import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await signup(name, email, password);
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
        <h1 className="page-title">Create account</h1>
        <p className="auth-subtitle">Join the full-stack developer blog</p>

        <div className="card auth-card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={submitting}
            >
              {submitting ? 'Creating…' : 'Sign Up'}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container-wide navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">{'</>'}</span>
          Full<span className="brand-accent">Stack</span> Blog
        </Link>
        <nav className="navbar-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/posts">Articles</NavLink>
          {user ? (
            <>
              <NavLink to="/posts/new" className="nav-write">
                + Write
              </NavLink>
              <span className="navbar-user">
                <span className="user-dot" />
                {user.name}
              </span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup" className="nav-cta">
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

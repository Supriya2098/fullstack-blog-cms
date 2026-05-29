import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import TechMarquee from '../components/TechMarquee';
import { getCategoryBadgeClass, DEFAULT_POST_IMAGE } from '../utils/badges';
import './Home.css';

const STACK = [
  { icon: '⚛️', label: 'React', desc: 'Component-driven UIs' },
  { icon: '🟢', label: 'Node.js', desc: 'JavaScript runtime' },
  { icon: '🗄️', label: 'SQL', desc: 'Relational data' },
  { icon: '🔐', label: 'JWT', desc: 'Secure auth' },
  { icon: '🚀', label: 'REST', desc: 'API design' },
  { icon: '☁️', label: 'Deploy', desc: 'Ship to production' },
];

export default function Home() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState({ posts: 0, comments: 0 });

  useEffect(() => {
    api.getPosts().then(({ posts }) => {
      setFeatured(posts.slice(0, 3));
      const comments = posts.reduce((n, p) => n + (p._count?.comments ?? 0), 0);
      setStats({ posts: posts.length, comments });
    }).catch(() => {});
  }, []);

  return (
    <div className="home">
      <section className="hero-section container-wide animate-in">
        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-eyebrow mono">&lt;FullStackBlog /&gt;</p>
            <h1>
              Opinions, patterns &amp;{' '}
              <span className="gradient-text">real-world stack</span> talk
            </h1>
            <p className="hero-desc">
              Deep dives on React, Node.js, databases, APIs, and deployment—from
              developers building production full-stack applications.
            </p>
            <div className="hero-actions">
              <Link to="/posts" className="btn btn-primary">
                Explore Articles
              </Link>
              {user ? (
                <Link to="/posts/new" className="btn btn-secondary">
                  Write Post
                </Link>
              ) : (
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
              )}
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num gradient-text">{stats.posts}</span>
                <span className="stat-label">Articles</span>
              </div>
              <div className="stat">
                <span className="stat-num gradient-text">{stats.comments}</span>
                <span className="stat-label">Discussions</span>
              </div>
              <div className="stat">
                <span className="stat-num gradient-text">6+</span>
                <span className="stat-label">Stack Topics</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-window">
              <div className="code-window-bar">
                <span /><span /><span />
                <span className="mono">app.js</span>
              </div>
              <pre className="code-window-body mono">
{`const stack = {
  frontend: "React + Vite",
  backend:  "Express + Prisma",
  database: "SQLite → Postgres",
  auth:     "JWT + bcrypt"
};

export default stack;`}
              </pre>
            </div>
            <div className="floating-badge fb-1">React 19</div>
            <div className="floating-badge fb-2">Node 24</div>
            <div className="floating-badge fb-3">Prisma ORM</div>
          </div>
        </div>
      </section>

      <TechMarquee />

      <section className="container stack-section">
        <h2 className="section-title">
          The <span className="gradient-text">Full Stack</span> Toolkit
        </h2>
        <div className="stack-grid">
          {STACK.map((item, i) => (
            <div
              key={item.label}
              className="stack-card card animate-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="stack-icon">{item.icon}</span>
              <h3>{item.label}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container featured-section">
          <div className="section-header">
            <h2 className="section-title">Latest from the stack</h2>
            <Link to="/posts" className="view-all">
              View all →
            </Link>
          </div>
          <div className="featured-grid">
            {featured.map((post, i) => (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                className="featured-card animate-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="featured-img-wrap">
                  <img
                    src={post.imageUrl || DEFAULT_POST_IMAGE}
                    alt=""
                    loading="lazy"
                  />
                  {post.category && (
                    <span className={`badge ${getCategoryBadgeClass(post.category)}`}>
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="featured-body">
                  <h3>{post.title}</h3>
                  <p>{post.content.slice(0, 100)}…</p>
                  <span className="featured-author">By {post.author.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

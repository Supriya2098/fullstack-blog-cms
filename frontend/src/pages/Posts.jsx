import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { getCategoryBadgeClass, DEFAULT_POST_IMAGE } from '../utils/badges';
import './Posts.css';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .getPosts()
      .then(({ posts }) => setPosts(posts))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(posts.map((p) => p.category).filter(Boolean))];
    return ['All', ...cats];
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = filter === 'All' || p.category === filter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [posts, filter, search]);

  if (loading) return <div className="container loading">Loading articles</div>;

  return (
    <div className="posts-page container-wide">
      <header className="posts-header animate-in">
        <p className="mono posts-eyebrow">// team articles</p>
        <h1 className="page-title">
          Full Stack <span className="gradient-text">Articles</span>
        </h1>
        <p className="page-subtitle">
          Opinions and insights on React, Node.js, databases, APIs, security, and
          deployment.
        </p>
      </header>

      <div className="posts-toolbar card">
        <input
          type="search"
          className="posts-search"
          placeholder="Search topics…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="posts-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-chip ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {filtered.length === 0 ? (
        <div className="empty-state card">
          <p>No articles match your filters.</p>
          <Link to="/posts/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Write the first post
          </Link>
        </div>
      ) : (
        <div className="posts-grid">
          {filtered.map((post, i) => (
            <Link
              key={post.id}
              to={`/posts/${post.id}`}
              className="post-card-pro animate-in"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="post-card-img">
                <img
                  src={post.imageUrl || DEFAULT_POST_IMAGE}
                  alt=""
                  loading="lazy"
                />
                <div className="post-card-overlay" />
                {post.category && (
                  <span className={`badge ${getCategoryBadgeClass(post.category)}`}>
                    {post.category}
                  </span>
                )}
              </div>
              <div className="post-card-body">
                <h2>{post.title}</h2>
                <p className="post-card-excerpt">{post.content}</p>
                <div className="post-card-footer">
                  <span className="post-author">{post.author.name}</span>
                  <span className="post-meta">
                    {formatDate(post.createdAt)} · {post._count?.comments ?? 0} comments
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

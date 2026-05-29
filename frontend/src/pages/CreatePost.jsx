import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../utils/badges';

export default function CreatePost() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('React');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { post } = await api.createPost({
        title,
        content,
        category,
        imageUrl: imageUrl || undefined,
      });
      navigate(`/posts/${post.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container form-page">
      <p className="mono" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
        // publishArticle()
      </p>
      <h1 className="page-title">
        Write <span className="gradient-text">Article</span>
      </h1>
      <p className="page-subtitle">Share your full-stack opinion with the community.</p>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Why I Choose Prisma Over Raw SQL"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">Cover Image URL</label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Your technical opinion and insights…"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing…' : 'Publish Article'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/posts')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

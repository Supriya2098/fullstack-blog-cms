import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../utils/badges';

export default function EditPost() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('React');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    api
      .getPost(id)
      .then(({ post }) => {
        if (user && post.author.id !== user.id) {
          navigate(`/posts/${id}`);
          return;
        }
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category || 'Other');
        setImageUrl(post.imageUrl || '');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.updatePost(id, {
        title,
        content,
        category,
        imageUrl: imageUrl || undefined,
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return <div className="container loading">Loading</div>;
  }

  return (
    <div className="container form-page">
      <h1 className="page-title">Edit Article</h1>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/posts/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

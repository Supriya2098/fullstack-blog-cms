import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { getCategoryBadgeClass, DEFAULT_POST_IMAGE } from '../utils/badges';
import './PostDetail.css';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPost = () => {
    setLoading(true);
    api
      .getPost(id)
      .then(({ post }) => setPost(post))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await api.deletePost(id);
      navigate('/posts');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.createComment(id, { content: commentText });
      setCommentText('');
      loadPost();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.deleteComment(commentId);
      loadPost();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="container loading">Loading article</div>;
  if (!post) {
    return (
      <div className="container">
        <div className="alert alert-error">{error || 'Post not found'}</div>
        <Link to="/posts">← Back to articles</Link>
      </div>
    );
  }

  const isAuthor = user?.id === post.author.id;

  return (
    <article className="post-detail-page">
      <div className="post-hero">
        <img
          src={post.imageUrl || DEFAULT_POST_IMAGE}
          alt=""
          className="post-hero-img"
        />
        <div className="post-hero-overlay" />
        <div className="container post-hero-content animate-in">
          <Link to="/posts" className="back-link">
            ← All articles
          </Link>
          {post.category && (
            <span className={`badge ${getCategoryBadgeClass(post.category)}`}>
              {post.category}
            </span>
          )}
          <h1>{post.title}</h1>
          <p className="post-hero-meta">
            <span className="author-avatar">{post.author.name.charAt(0)}</span>
            {post.author.name} · {formatDate(post.createdAt)}
          </p>
        </div>
      </div>

      <div className="container post-detail-body">
        {error && <div className="alert alert-error">{error}</div>}

        {isAuthor && (
          <div className="post-actions">
            <Link to={`/posts/${id}/edit`} className="btn btn-secondary">
              Edit
            </Link>
            <button type="button" className="btn btn-danger" onClick={handleDeletePost}>
              Delete
            </button>
          </div>
        )}

        <div className="post-content card">{post.content}</div>

        <section className="comments-section card">
          <h2>
            <span className="gradient-text">{post.comments.length}</span> Comments
          </h2>

          {post.comments.length === 0 ? (
            <p className="empty-comments">Start the discussion below.</p>
          ) : (
            <div className="comment-list">
              {post.comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-avatar">
                      {comment.author.name.charAt(0)}
                    </span>
                    <div>
                      <strong>{comment.author.name}</strong>
                      <span className="comment-meta">{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                  {user?.id === comment.author.id && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {user ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <div className="form-group">
                <label htmlFor="comment">Your take</label>
                <textarea
                  id="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your opinion on this topic…"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Posting…' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="login-prompt">
              <Link to="/login">Sign in</Link> to join the discussion.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}

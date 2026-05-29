const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('token');
}

function validationMessage(data) {
  if (typeof data?.error === 'string') return data.error;
  if (data?.message) return data.message;
  return null;
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      'Cannot connect to the server. Open a terminal, run: cd backend → npm run dev'
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      validationMessage(data) || `Request failed (${res.status})`
    );
  }

  return data;
}

export const api = {
  signup: (body) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  getPosts: () => request('/posts'),
  getPost: (id) => request(`/posts/${id}`),
  createPost: (body) =>
    request('/posts', { method: 'POST', body: JSON.stringify(body) }),
  updatePost: (id, body) =>
    request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  createComment: (postId, body) =>
    request(`/comments/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  deleteComment: (id) => request(`/comments/${id}`, { method: 'DELETE' }),
};

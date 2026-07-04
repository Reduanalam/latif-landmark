const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function req(path, opts = {}) {
  const token = localStorage.getItem('ll_admin_token');
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  get:    (p)      => req(p),
  post:   (p, b)   => req(p, { method: 'POST',   body: JSON.stringify(b) }),
  put:    (p, b)   => req(p, { method: 'PUT',    body: JSON.stringify(b) }),
  delete: (p)      => req(p, { method: 'DELETE' }),
};

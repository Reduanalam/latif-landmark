// src/api/index.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Warn loudly in the browser console if the API URL was never configured for production.
// This is the #1 cause of "plots/properties not showing" — silent failures otherwise.
if (import.meta.env.PROD && (!import.meta.env.VITE_API_URL || BASE_URL.includes('localhost'))) {
  console.error(
    '[Landmark] VITE_API_URL is not set for this production build. ' +
    'API calls will try to reach ' + BASE_URL + ' which will fail in the browser. ' +
    'Set VITE_API_URL in your Netlify site settings (Site configuration → Environment variables) ' +
    'to your Railway backend URL, e.g. https://your-backend.up.railway.app/api, then redeploy.'
  );
}

async function request(path, options = {}) {
  const token = localStorage.getItem('landmark_token');
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...options,
    });
  } catch (networkErr) {
    // fetch throws on network failure / CORS block — surface a clear message instead of a cryptic one
    console.error(`[Landmark] Network/CORS error calling ${BASE_URL}${path}:`, networkErr);
    throw new Error(
      `Could not reach the server at ${BASE_URL}. This usually means the backend is down, ` +
      `VITE_API_URL is wrong, or the backend's CLIENT_URL does not include this site's domain (CORS).`
    );
  }

  let data;
  try {
    data = await res.json();
  } catch {
    console.error(`[Landmark] Non-JSON response from ${BASE_URL}${path} (status ${res.status})`);
    throw new Error(`Server returned an invalid response (status ${res.status}).`);
  }

  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  get:    (path)         => request(path),
  post:   (path, body)   => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: 'DELETE' }),
};

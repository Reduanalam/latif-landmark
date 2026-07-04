import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ll_admin_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(r => setAdmin(r.admin))
      .catch(() => localStorage.removeItem('ll_admin_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password });
    localStorage.setItem('ll_admin_token', r.token);
    setAdmin(r.admin);
  };

  const logout = () => {
    localStorage.removeItem('ll_admin_token');
    setAdmin(null);
  };

  return (
    <AuthCtx.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      nav('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.glow} />
      <div style={styles.box}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>LL</div>
          <div>
            <div style={styles.logoName}>Latif Landmark</div>
            <div style={styles.logoSub}>Admin Portal</div>
          </div>
        </div>

        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.sub}>Sign in to manage your properties</p>

        {error && <div style={styles.errBox}>{error}</div>}

        <form onSubmit={handle} style={styles.form}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              className="form-control"
              type="email"
              placeholder="admin@latiflandmark.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button className="btn btn-gold" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '.75rem', fontSize: '1rem', marginTop: '.5rem' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'var(--bg)' },
  glow: { position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #c9a84c18 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' },
  box: { background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 20, padding: '2.5rem', width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 },
  logo: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  logoMark: { width: 44, height: 44, background: 'linear-gradient(135deg, var(--gold), var(--gold-dk))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1rem', color: '#000' },
  logoName: { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem' },
  logoSub: { fontSize: '.75rem', color: 'var(--text2)' },
  heading: { fontFamily: 'var(--font-head)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '.25rem' },
  sub: { color: 'var(--text2)', fontSize: '.9rem', marginBottom: '1.75rem' },
  errBox: { background: '#ef444418', border: '1px solid #ef444430', borderRadius: 8, padding: '.7rem 1rem', color: 'var(--red)', fontSize: '.875rem', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
};

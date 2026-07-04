import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiHome, FiMail, FiStar, FiLogOut, FiMenu, FiX, FiMap } from 'react-icons/fi';
import { useState } from 'react';

const nav = [
  { to: '/',               icon: <FiGrid />, label: 'Dashboard'      },
  { to: '/properties',     icon: <FiHome />, label: 'Properties'     },
  { to: '/plot-bookings',  icon: <FiMap  />, label: 'Plot Bookings'  },
  { to: '/inquiries',      icon: <FiMail />, label: 'Inquiries'      },
  { to: '/reviews',        icon: <FiStar />, label: 'Reviews'        },
];

export default function Layout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={s.root}>
      {/* Mobile overlay */}
      {open && <div style={s.overlay} onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside style={{ ...s.sidebar, transform: open ? 'translateX(0)' : undefined }}>
        <div style={s.sideTop}>
          <div style={s.brand}>
            <div style={s.brandMark}>LL</div>
            <div>
              <div style={s.brandName}>Latif Landmark</div>
              <div style={s.brandSub}>Admin Panel</div>
            </div>
          </div>
          <nav style={s.nav}>
            {nav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                style={({ isActive }) => ({ ...s.navItem, ...(isActive ? s.navActive : {}) })}
              >
                <span style={s.navIcon}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div style={s.sideBot}>
          <div style={s.adminInfo}>
            <div style={s.adminAvatar}>{admin?.name?.[0] || 'A'}</div>
            <div>
              <div style={{ fontSize: '.85rem', fontWeight: 600 }}>{admin?.name}</div>
              <div style={{ fontSize: '.72rem', color: 'var(--text3)' }}>{admin?.role}</div>
            </div>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout} title="Logout">
            <FiLogOut />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={s.main}>
        {/* Topbar (mobile) */}
        <header style={s.topbar}>
          <button style={s.menuBtn} onClick={() => setOpen(o => !o)}>
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem' }}>Latif Landmark</span>
          <div style={s.adminAvatar}>{admin?.name?.[0] || 'A'}</div>
        </header>

        <main style={s.content}>{children}</main>
      </div>
    </div>
  );
}

const s = {
  root:       { display: 'flex', minHeight: '100vh', background: 'var(--bg)' },
  overlay:    { position: 'fixed', inset: 0, background: '#00000060', zIndex: 49 },
  sidebar:    {
    width: 'var(--sidebar-w)', background: 'var(--bg2)', borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
    transition: 'transform .25s ease',
    ['@media(max-width:768px)']: { transform: 'translateX(-100%)' },
  },
  sideTop:    { flex: 1, overflow: 'auto', padding: '1.5rem 1rem' },
  brand:      { display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '2rem', paddingLeft: '.5rem' },
  brandMark:  { width: 38, height: 38, background: 'linear-gradient(135deg, var(--gold), var(--gold-dk))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '.85rem', color: '#000', flexShrink: 0 },
  brandName:  { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '.9rem', lineHeight: 1.2 },
  brandSub:   { fontSize: '.68rem', color: 'var(--text3)', marginTop: 2 },
  nav:        { display: 'flex', flexDirection: 'column', gap: '.2rem' },
  navItem:    { display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.65rem .9rem', borderRadius: 8, color: 'var(--text2)', fontSize: '.88rem', fontWeight: 500, transition: 'all .15s' },
  navActive:  { background: '#c9a84c18', color: 'var(--gold)', fontWeight: 600 },
  navIcon:    { fontSize: '1rem', flexShrink: 0 },
  sideBot:    { padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '.75rem' },
  adminInfo:  { display: 'flex', alignItems: 'center', gap: '.6rem', flex: 1, overflow: 'hidden' },
  adminAvatar:{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-dk))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.82rem', color: '#000', flexShrink: 0 },
  logoutBtn:  { background: 'none', border: 'none', color: 'var(--text3)', fontSize: '1.1rem', display: 'flex', padding: '.4rem', borderRadius: 6, transition: 'color .15s' },
  main:       { flex: 1, marginLeft: 'var(--sidebar-w)', display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar:     { display: 'none', alignItems: 'center', gap: '1rem', padding: '0 1rem', height: 'var(--topbar-h)', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 40 },
  menuBtn:    { background: 'none', border: 'none', color: 'var(--text)', display: 'flex', padding: '.4rem' },
  content:    { padding: '2rem', flex: 1 },
};

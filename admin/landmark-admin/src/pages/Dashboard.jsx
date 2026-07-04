import { useState, useEffect } from 'react';
import { api } from '../api';
import { FiHome, FiMail, FiStar, FiTrendingUp, FiClock } from 'react-icons/fi';

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: color + '20', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-head)', fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: '.82rem', color: 'var(--text2)', marginTop: '.2rem' }}>{label}</div>
        {sub && <div style={{ fontSize: '.75rem', color: 'var(--text3)', marginTop: '.15rem' }}>{sub}</div>}
      </div>
    </div>
  );
}

function statusBadge(s) {
  const map = { new: 'badge-blue', contacted: 'badge-gold', closed: 'badge-gray' };
  return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'var(--text2)', padding: '2rem' }}>Loading dashboard…</div>;
  if (!data)   return <div style={{ color: 'var(--red)', padding: '2rem' }}>Failed to load dashboard.</div>;

  const { properties, inquiries, reviews, recentInquiries } = data;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of Latif Landmark operations</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon={<FiHome />}      label="Total Properties"   value={properties.total}     color="var(--gold)"  sub={`${properties.available} available`} />
        <StatCard icon={<FiTrendingUp />} label="Properties Sold"    value={properties.sold}      color="var(--green)" />
        <StatCard icon={<FiMail />}       label="Total Inquiries"    value={inquiries.total}      color="var(--blue)"  sub={`${inquiries.new} new`} />
        <StatCard icon={<FiStar />}       label="Published Reviews"  value={reviews.total}        color="#a855f7" />
      </div>

      {/* Recent inquiries */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1.25rem' }}>
          <FiClock style={{ color: 'var(--gold)' }} />
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700 }}>Recent New Inquiries</h2>
        </div>
        {recentInquiries.length === 0
          ? <p className="empty-state">No new inquiries.</p>
          : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th><th>Phone</th><th>Plot Interest</th><th>Status</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map(inq => (
                    <tr key={inq._id}>
                      <td style={{ fontWeight: 500 }}>{inq.name}</td>
                      <td>{inq.phone}</td>
                      <td style={{ color: 'var(--text2)', maxWidth: 180 }}>{inq.plot || '—'}</td>
                      <td>{statusBadge(inq.status)}</td>
                      <td style={{ color: 'var(--text3)' }}>{new Date(inq.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
}

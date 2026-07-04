import { useState, useEffect } from 'react';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import { FiX, FiTrash2, FiEye } from 'react-icons/fi';

const STATUS_OPTIONS = ['new', 'contacted', 'closed'];

function InquiryModal({ inq, onClose, onSaved }) {
  const toast = useToast();
  const [status, setStatus] = useState(inq.status);
  const [notes, setNotes]   = useState(inq.notes || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/inquiries/${inq._id}`, { status, notes });
      toast('Inquiry updated!');
      onSaved();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const badgeColor = { new: '#3b82f6', contacted: 'var(--gold)', closed: 'var(--text3)' };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Inquiry Details</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><FiX /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '1.25rem' }}>
          {[
            ['Name',    inq.name],
            ['Phone',   inq.phone],
            ['Email',   inq.email || '—'],
            ['Date',    new Date(inq.createdAt).toLocaleString()],
          ].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '.75rem' }}>
              <div style={{ fontSize: '.72rem', color: 'var(--text3)', marginBottom: '.2rem' }}>{k}</div>
              <div style={{ fontSize: '.88rem', fontWeight: 500 }}>{v}</div>
            </div>
          ))}
          {inq.plot && (
            <div style={{ gridColumn: '1/-1', background: 'var(--bg3)', borderRadius: 8, padding: '.75rem' }}>
              <div style={{ fontSize: '.72rem', color: 'var(--text3)', marginBottom: '.2rem' }}>Interested Plot</div>
              <div style={{ fontSize: '.88rem' }}>{inq.plot}</div>
            </div>
          )}
          {inq.message && (
            <div style={{ gridColumn: '1/-1', background: 'var(--bg3)', borderRadius: 8, padding: '.75rem' }}>
              <div style={{ fontSize: '.72rem', color: 'var(--text3)', marginBottom: '.2rem' }}>Message</div>
              <div style={{ fontSize: '.88rem', color: 'var(--text2)', whiteSpace: 'pre-wrap' }}>{inq.message}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Status</label>
            <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Internal Notes</label>
            <textarea className="form-control" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add follow-up notes…" />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-gold" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Update'}</button>
        </div>
      </div>
    </div>
  );
}

export default function Inquiries() {
  const toast = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('');
  const [selected, setSelected]   = useState(null);

  const load = () => {
    setLoading(true);
    const q = filter ? `?status=${filter}` : '';
    api.get(`/admin/inquiries${q}`).then(r => setInquiries(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const del = async inq => {
    if (!window.confirm(`Delete inquiry from ${inq.name}?`)) return;
    try {
      await api.delete(`/admin/inquiries/${inq._id}`);
      toast('Inquiry deleted.');
      load();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const statusBadge = s => {
    const map = { new: 'badge-blue', contacted: 'badge-gold', closed: 'badge-gray' };
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>;
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Inquiries</h1><p>Contact form submissions from visitors</p></div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          {['', 'new', 'contacted', 'closed'].map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-gold' : 'btn-ghost'}`} onClick={() => setFilter(s)}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading
          ? <p style={{ padding: '2rem', color: 'var(--text2)' }}>Loading…</p>
          : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr><th>Name</th><th>Phone</th><th>Plot Interest</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {inquiries.length === 0
                    ? <tr><td colSpan={6} className="empty-state">No inquiries found.</td></tr>
                    : inquiries.map(inq => (
                      <tr key={inq._id}>
                        <td style={{ fontWeight: 500 }}>{inq.name}</td>
                        <td>{inq.phone}</td>
                        <td style={{ color: 'var(--text2)', maxWidth: 160 }}>{inq.plot || '—'}</td>
                        <td>{statusBadge(inq.status)}</td>
                        <td style={{ color: 'var(--text3)' }}>{new Date(inq.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '.4rem' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setSelected(inq)}><FiEye /> View</button>
                            <button className="btn btn-danger btn-sm" onClick={() => del(inq)}><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      {selected && (
        <InquiryModal
          inq={selected}
          onClose={() => setSelected(null)}
          onSaved={() => { setSelected(null); load(); }}
        />
      )}
    </div>
  );
}

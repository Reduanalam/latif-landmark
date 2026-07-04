import { useState, useEffect } from 'react';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import { FiPlus, FiEdit2, FiTrash2, FiEyeOff, FiEye, FiX } from 'react-icons/fi';

const EMPTY = { name: '', location: '', rating: 5, date: '', avatar: '', text: '', tag: '', visible: true };

function ReviewModal({ rev, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(rev || EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Auto-generate avatar initials from name
  const handleNameChange = e => {
    const name = e.target.value;
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    setForm(f => ({ ...f, name, avatar: initials }));
  };

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (rev) await api.put(`/admin/reviews/${rev._id}`, form);
      else     await api.post('/admin/reviews', form);
      toast(rev ? 'Review updated!' : 'Review added!');
      onSaved();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{rev ? 'Edit Review' : 'Add Review'}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><FiX /></button>
        </div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Client Name *</label>
              <input className="form-control" value={form.name} onChange={handleNameChange} required placeholder="Mohammad Rafiqul Islam" />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input className="form-control" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Dhaka, Bangladesh" />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <select className="form-control" value={form.rating} onChange={e => set('rating', Number(e.target.value))}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date (display text)</label>
              <input className="form-control" value={form.date} onChange={e => set('date', e.target.value)} placeholder="January 2025" />
            </div>
            <div className="form-group">
              <label>Tag / Plot</label>
              <input className="form-control" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Araihazar Plot" />
            </div>
            <div className="form-group">
              <label>Avatar Initials</label>
              <input className="form-control" value={form.avatar} onChange={e => set('avatar', e.target.value)} placeholder="MR" maxLength={2} />
            </div>
            <div className="form-group full">
              <label>Review Text *</label>
              <textarea className="form-control" rows={4} value={form.text} onChange={e => set('text', e.target.value)} required placeholder="Write the client's testimonial…" />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.visible} onChange={e => set('visible', e.target.checked)} />
                Visible on website
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-gold" disabled={saving}>{saving ? 'Saving…' : 'Save Review'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Reviews() {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/admin/reviews').then(r => setReviews(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const del = async r => {
    if (!window.confirm(`Delete review from ${r.name}?`)) return;
    try {
      await api.delete(`/admin/reviews/${r._id}`);
      toast('Review deleted.');
      load();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const toggleVisibility = async r => {
    try {
      await api.put(`/admin/reviews/${r._id}`, { ...r, visible: !r.visible });
      toast(r.visible ? 'Review hidden.' : 'Review shown.');
      load();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Reviews</h1><p>Manage client testimonials</p></div>
        <button className="btn btn-gold" onClick={() => setModal('add')}><FiPlus /> Add Review</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading
          ? <p style={{ padding: '2rem', color: 'var(--text2)' }}>Loading…</p>
          : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr><th>Client</th><th>Tag</th><th>Rating</th><th>Date</th><th>Visible</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {reviews.length === 0
                    ? <tr><td colSpan={6} className="empty-state">No reviews yet.</td></tr>
                    : reviews.map(r => (
                      <tr key={r._id} style={{ opacity: r.visible ? 1 : .5 }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold-dk)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.72rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{r.avatar}</div>
                            <div>
                              <div style={{ fontWeight: 500, fontSize: '.88rem' }}>{r.name}</div>
                              <div style={{ fontSize: '.72rem', color: 'var(--text3)' }}>{r.location}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-gold">{r.tag}</span></td>
                        <td style={{ color: 'var(--gold)' }}>{'★'.repeat(r.rating)}</td>
                        <td style={{ color: 'var(--text2)' }}>{r.date}</td>
                        <td>{r.visible ? <span className="badge badge-green">Visible</span> : <span className="badge badge-gray">Hidden</span>}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '.4rem' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setModal(r)}><FiEdit2 /></button>
                            <button className="btn btn-ghost btn-sm" onClick={() => toggleVisibility(r)} title={r.visible ? 'Hide' : 'Show'}>
                              {r.visible ? <FiEyeOff /> : <FiEye />}
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => del(r)}><FiTrash2 /></button>
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

      {modal && (
        <ReviewModal
          rev={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
    </div>
  );
}

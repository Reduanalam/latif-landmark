import { useState, useEffect } from 'react';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const EMPTY = { title: '', location: '', status: 'Available', description: '', images: '', featured: false, order: 0 };

function PropertyModal({ prop, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(prop
    ? { ...prop, images: prop.images.join('\n') }
    : EMPTY
  );
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, images: form.images.split('\n').map(s => s.trim()).filter(Boolean) };
      if (prop) await api.put(`/admin/properties/${prop._id}`, payload);
      else      await api.post('/admin/properties', payload);
      toast(prop ? 'Property updated!' : 'Property created!');
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
          <h2>{prop ? 'Edit Property' : 'Add Property'}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><FiX /></button>
        </div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-group full">
              <label>Title *</label>
              <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required placeholder="e.g. Duplex Province – Block A" />
            </div>
            <div className="form-group full">
              <label>Location *</label>
              <input className="form-control" value={form.location} onChange={e => set('location', e.target.value)} required placeholder="e.g. Araihazar, Narayanganj" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option>Available</option>
                <option>Sold</option>
                <option>Reserved</option>
              </select>
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input className="form-control" type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} />
            </div>
            <div className="form-group full">
              <label>Description</label>
              <textarea className="form-control" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the property…" />
            </div>
            <div className="form-group full">
              <label>Image URLs (one per line)</label>
              <textarea className="form-control" rows={4} value={form.images} onChange={e => set('images', e.target.value)} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                Featured property
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-gold" disabled={saving}>{saving ? 'Saving…' : 'Save Property'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Properties() {
  const toast = useToast();
  const [props, setProps]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null); // null | 'add' | property object
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/properties').then(r => setProps(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const del = async p => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    setDeleting(p._id);
    try {
      await api.delete(`/admin/properties/${p._id}`);
      toast('Property deleted.');
      load();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setDeleting(null);
    }
  };

  const statusBadge = s => {
    const map = { Available: 'badge-green', Sold: 'badge-red', Reserved: 'badge-gold' };
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>;
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Properties</h1><p>Manage your real estate listings</p></div>
        <button className="btn btn-gold" onClick={() => setModal('add')}><FiPlus /> Add Property</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading
          ? <p style={{ padding: '2rem', color: 'var(--text2)' }}>Loading…</p>
          : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr><th>Title</th><th>Location</th><th>Status</th><th>Featured</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {props.length === 0
                    ? <tr><td colSpan={5} className="empty-state">No properties yet.</td></tr>
                    : props.map(p => (
                      <tr key={p._id}>
                        <td style={{ fontWeight: 500, maxWidth: 200 }}>{p.title}</td>
                        <td style={{ color: 'var(--text2)', maxWidth: 200 }}>{p.location}</td>
                        <td>{statusBadge(p.status)}</td>
                        <td>{p.featured ? <span className="badge badge-gold">⭐ Yes</span> : <span style={{ color: 'var(--text3)' }}>—</span>}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '.5rem' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setModal(p)}><FiEdit2 /> Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => del(p)} disabled={deleting === p._id}><FiTrash2 /></button>
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
        <PropertyModal
          prop={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
    </div>
  );
}

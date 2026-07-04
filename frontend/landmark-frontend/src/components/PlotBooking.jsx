// src/components/PlotBooking.jsx
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import './PlotBooking.css';

// ── 5 Katha set ────────────────────────────────────────────────────────────────
const FIVE_KATHA = new Set([
  ...[1,13,14,26,27,39,40,52,53,65].map(n=>`A-S-${n}`),
  ...[1,10,11,20,21,30,31,40,47,48].map(n=>`A-N-${n}`),
  ...[1,6,7,12,13,23,24,34,44,45].map(n=>`B-S-${n}`),
  ...[1,16,17,25,37,38,50,51,63].map(n=>`B-N-${n}`),
  ...[9,10,19,29,30,40,41,51].map(n=>`C-S-${n}`),
  ...[1,13,14,26,27,37,38,48,49,61].map(n=>`C-N-${n}`),
]);

const BLOCK_LAYOUT = {
  A: {
    N: { cols:[[1,2,3,4,5,6,7,8,9,10,11,12,13],[26,25,24,23,22,21,20,19,18,17,16,15,14],[27,28,29,30,31,32,33,34,35,36,37,38,39],[52,51,50,49,48,47,46,45,44,43,42,41,40],[53,54,0,0,0,0,0,0,0,0,0,0,0]], max:54 },
    S: { cols:[[1,2,3,4,5,6,7,8,9,10,11,12,13],[26,25,24,23,22,21,20,19,18,17,16,15,14],[27,28,29,30,31,32,33,34,35,36,37,38,39],[52,51,50,49,48,47,46,45,44,43,42,41,40],[53,54,55,56,57,58,59,60,61,62,63,64,65]], max:65 },
  },
  B: {
    N: { cols:[[1,2,3,4,5,6,7,8,9,10,11,12,13],[26,25,24,23,22,21,20,19,18,17,16,15,14],[27,28,29,30,31,32,33,34,35,36,37,38,39],[52,51,50,49,48,47,46,45,44,43,42,41,40],[53,54,55,56,57,58,59,60,61,62,63,0,0]], max:63 },
    S: { cols:[[1,2,3,4,5,6,7,8,9,10,11,12,13],[26,25,24,23,22,21,20,19,18,17,16,15,14],[27,28,29,30,31,32,33,34,35,36,37,38,39],[52,51,50,49,48,47,46,45,44,43,42,41,40],[53,54,0,0,0,0,0,0,0,0,0,0,0]], max:54 },
  },
  C: {
    N: { cols:[[1,2,3,4,5,6,7,8,9,10,11,12,13],[26,25,24,23,22,21,20,19,18,17,16,15,14],[27,28,29,30,31,32,33,34,35,36,37,38,39],[52,51,50,49,48,47,46,45,44,43,42,41,40],[53,54,55,56,57,58,59,60,61,0,0,0,0]], max:61 },
    S: { cols:[[1,2,3,4,5,6,7,8,9,10,11,12,13],[26,25,24,23,22,21,20,19,18,17,16,15,14],[27,28,29,30,31,32,33,34,35,36,37,38,39],[51,50,49,48,47,46,45,44,43,42,41,40,0]], max:51 },
  },
};

function PlotCell({ plot, onSelect }) {
  if (!plot) return <div className="pb-cell pb-empty" />;
  const fiveK = FIVE_KATHA.has(plot.plotId);
  const cls = plot.status === 'available'
    ? (fiveK ? 'pb-cell pb-5k' : 'pb-cell pb-3k')
    : plot.status === 'pending' ? 'pb-cell pb-pending' : 'pb-cell pb-booked';
  return (
    <div
      className={cls}
      onClick={() => plot.status === 'available' && onSelect(plot)}
      title={`Block ${plot.block} #${String(plot.num).padStart(2,'0')} — ${plot.status} — ${fiveK ? '5 Katha' : '3 Katha'}`}
    >
      <span className="pb-num">{String(plot.num).padStart(2,'0')}</span>
      <span className="pb-size">{fiveK ? '5K' : '3K'}</span>
    </div>
  );
}

function ZoneMap({ plotMap, block, zone, onSelect }) {
  const layout = BLOCK_LAYOUT[block]?.[zone];
  if (!layout) return null;
  return (
    <div className="pb-zone-scroll">
      <div className="pb-road">25' WIDE LINK ROAD</div>
      <div className="pb-cols-wrap">
        {layout.cols.map((col, ci) => (
          <div key={ci} className="pb-col">
            {col.map((num, ri) =>
              num > 0 && num <= layout.max
                ? <PlotCell key={ri} plot={plotMap[`${block}-${zone}-${num}`]} onSelect={onSelect} />
                : <div key={ri} className="pb-cell pb-empty" />
            )}
          </div>
        ))}
      </div>
      <div className="pb-road">25' WIDE LINK ROAD</div>
    </div>
  );
}

function BookingModal({ plot, onClose, onSubmit, loading }) {
  const fiveK = FIVE_KATHA.has(plot.plotId);
  const [form, setForm] = useState({ name:'', phone:'', email:'', note:'' });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    onSubmit(plot.plotId, form);
  };

  return (
    <div className="pb-modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pb-modal">
        <button className="pb-modal-close" onClick={onClose}>✕</button>
        <h3>Book Plot {String(plot.num).padStart(2,'0')} — Block {plot.block}</h3>
        <p className="pb-modal-sub">Submit request — our team will confirm within 24 hours.</p>
        <div className="pb-modal-info">
          <span>Zone: {plot.zone === 'N' ? 'North' : 'South'}</span>
          <span>Size: {fiveK ? '5 Katha (66-8"×54-0")' : '3 Katha (54-0"×40-0")'}</span>
          <span className="pb-available">✔ Available</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="pb-form-row">
            <div className="pb-field">
              <label>Full Name *</label>
              <input value={form.name} onChange={set('name')} placeholder="Your full name" required />
            </div>
            <div className="pb-field">
              <label>Phone Number *</label>
              <input value={form.phone} onChange={set('phone')} placeholder="01XXXXXXXXX" required />
            </div>
          </div>
          <div className="pb-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" />
          </div>
          <div className="pb-field">
            <label>Message / Note</label>
            <textarea value={form.note} onChange={set('note')} placeholder="Any questions or requirements…" rows={3} />
          </div>
          <div className="pb-modal-actions">
            <button type="submit" className="pb-btn-primary" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit Booking Request'}
            </button>
            <button type="button" className="pb-btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SuccessModal({ plot, onClose }) {
  return (
    <div className="pb-modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pb-modal pb-success-modal">
        <div className="pb-success-icon">✓</div>
        <h3>Request Submitted!</h3>
        <p>Your booking request for <strong>Block {plot.block} Plot #{String(plot.num).padStart(2,'0')}</strong> has been submitted.</p>
        <p style={{ marginTop: 8, color: '#888', fontSize: '.9rem' }}>Our team will contact you within 24 hours to confirm.</p>
        <button className="pb-btn-primary" onClick={onClose} style={{ marginTop: 20, width: '100%' }}>Done</button>
      </div>
    </div>
  );
}

export default function PlotBooking() {
  const [plots, setPlots]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [loadError, setLoadError]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected]     = useState(null);
  const [success, setSuccess]       = useState(null);
  const [activeBlock, setActiveBlock] = useState('A');

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await api.get('/plots');
      setPlots(res.data);
    } catch (e) {
      console.error('[Landmark] Failed to load plots:', e);
      setLoadError(e.message || 'Failed to load plot data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Build a map for fast lookup
  const plotMap = {};
  plots.forEach(p => { plotMap[p.plotId] = p; });

  const total     = plots.length;
  const available = plots.filter(p => p.status === 'available').length;
  const pending   = plots.filter(p => p.status === 'pending').length;
  const booked    = plots.filter(p => p.status === 'booked').length;

  const handleSubmit = async (plotId, form) => {
    setSubmitting(true);
    try {
      await api.post(`/plots/${plotId}/book`, form);
      const res = await api.get('/plots');
      setPlots(res.data);
      const submittedPlot = selected;
      setSelected(null);
      setSuccess(submittedPlot);
    } catch (e) {
      alert(e.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section pb-section" id="plot-booking">
      <div className="container">
        <div className="pb-header">
          <p className="section-label">Book Your Plot</p>
          <h2 className="section-title">Interactive Plot Map</h2>
          <p className="section-subtitle">
            Click any <span className="pb-highlight-green">green plot</span> to submit a booking request.
            Our team reviews all requests within 24 hours.
          </p>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="pb-stats">
            <div className="pb-stat"><span className="pb-stat-val">{total}</span><span className="pb-stat-label">Total Plots</span></div>
            <div className="pb-stat pb-stat--green"><span className="pb-stat-val">{available}</span><span className="pb-stat-label">Available</span></div>
            <div className="pb-stat pb-stat--amber"><span className="pb-stat-val">{pending}</span><span className="pb-stat-label">Pending</span></div>
            <div className="pb-stat pb-stat--red"><span className="pb-stat-val">{booked}</span><span className="pb-stat-label">Booked</span></div>
          </div>
        )}

        {/* Legend */}
        <div className="pb-legend">
          <span className="pb-legend-item"><span className="pb-ld" style={{ background:'#1e40af' }}></span>5 Katha – Available</span>
          <span className="pb-legend-item"><span className="pb-ld" style={{ background:'#1a5c38' }}></span>3 Katha – Available</span>
          <span className="pb-legend-item"><span className="pb-ld" style={{ background:'#b45309' }}></span>Pending Approval</span>
          <span className="pb-legend-item"><span className="pb-ld" style={{ background:'#991b1b' }}></span>Booked</span>
        </div>

        {/* Block Tabs */}
        <div className="pb-block-tabs">
          {['A','B','C'].map(b => (
            <button key={b} className={`pb-block-tab ${activeBlock===b?'pb-block-tab--active':''}`} onClick={() => setActiveBlock(b)}>
              Block {b}
              <span className="pb-tab-count">
                {plots.filter(p=>p.block===b&&p.status==='available').length} available
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="pb-loading">Loading plot data…</div>
        ) : loadError ? (
          <div className="pb-loading" style={{ color: '#991b1b' }}>
            ⚠ {loadError}
            <br />
            <button
              className="pb-btn-primary"
              style={{ marginTop: 12 }}
              onClick={() => { setLoading(true); load(); }}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="pb-block-wrap">
            <div className="pb-block-header">◆ BLOCK – {activeBlock}</div>
            <div className="pb-zones-row">
              <div className="pb-zone-col">
                <div className="pb-zone-label">▲ NORTH ZONE</div>
                <ZoneMap plotMap={plotMap} block={activeBlock} zone="N" onSelect={setSelected} />
              </div>
              <div className="pb-avenue">50' AVENUE ROAD</div>
              <div className="pb-zone-col">
                <div className="pb-zone-label">▼ SOUTH ZONE</div>
                <ZoneMap plotMap={plotMap} block={activeBlock} zone="S" onSelect={setSelected} />
              </div>
            </div>
          </div>
        )}

        <p className="pb-note">
          💡 Click any available plot to submit a booking request. Plots marked as "Pending" are awaiting admin approval.
        </p>
      </div>

      {selected && (
        <BookingModal plot={selected} onClose={() => setSelected(null)} onSubmit={handleSubmit} loading={submitting} />
      )}
      {success && (
        <SuccessModal plot={success} onClose={() => { setSuccess(null); }} />
      )}
    </section>
  );
}

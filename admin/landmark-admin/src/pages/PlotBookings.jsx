import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import { FiMap, FiCheck, FiX, FiUnlock, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

// ── 5 Katha plot IDs (mirrors backend/seed) ──────────────────────────────────
const FIVE_KATHA = new Set([
  ...[1,13,14,26,27,39,40,52,53,65].map(n=>`A-S-${n}`),
  ...[1,10,11,20,21,30,31,40,47,48].map(n=>`A-N-${n}`),
  ...[1,6,7,12,13,23,24,34,44,45].map(n=>`B-S-${n}`),
  ...[1,16,17,25,37,38,50,51,63].map(n=>`B-N-${n}`),
  ...[9,10,19,29,30,40,41,51].map(n=>`C-S-${n}`),
  ...[1,13,14,26,27,37,38,48,49,61].map(n=>`C-N-${n}`),
]);

const STATUS_COLOR = {
  available: { bg: '#dcfce7', color: '#15803d' },
  pending:   { bg: '#fef3c7', color: '#b45309' },
  booked:    { bg: '#fee2e2', color: '#b91c1c' },
};

function Badge({ status }) {
  const c = STATUS_COLOR[status] || {};
  return (
    <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:20,
      fontSize:'.72rem', fontWeight:700, background:c.bg, color:c.color }}>
      {status}
    </span>
  );
}

// ── PLOT MAP ──────────────────────────────────────────────────────────────────
const CW = 42, CH = 40, G = 3;

const BLOCK_LAYOUT = {
  A: {
    N: { cols: [[1,2,3,4,5,6,7,8,9,10,11,12,13],[26,25,24,23,22,21,20,19,18,17,16,15,14],[27,28,29,30,31,32,33,34,35,36,37,38,39],[52,51,50,49,48,47,46,45,44,43,42,41,40],[53,54,0,0,0,0,0,0,0,0,0,0,0]], max:54 },
    S: { cols: [[1,2,3,4,5,6,7,8,9,10,11,12,13],[26,25,24,23,22,21,20,19,18,17,16,15,14],[27,28,29,30,31,32,33,34,35,36,37,38,39],[52,51,50,49,48,47,46,45,44,43,42,41,40],[53,54,55,56,57,58,59,60,61,62,63,64,65]], max:65 },
  },
  B: {
    N: { cols: [[1,2,3,4,5,6,7,8,9,10,11,12,13],[26,25,24,23,22,21,20,19,18,17,16,15,14],[27,28,29,30,31,32,33,34,35,36,37,38,39],[52,51,50,49,48,47,46,45,44,43,42,41,40],[53,54,55,56,57,58,59,60,61,62,63,0,0]], max:63 },
    S: { cols: [[1,2,3,4,5,6,7,8,9,10,11,12,13],[26,25,24,23,22,21,20,19,18,17,16,15,14],[27,28,29,30,31,32,33,34,35,36,37,38,39],[52,51,50,49,48,47,46,45,44,43,42,41,40],[53,54,0,0,0,0,0,0,0,0,0,0,0]], max:54 },
  },
  C: {
    N: { cols: [[1,2,3,4,5,6,7,8,9,10,11,12,13],[26,25,24,23,22,21,20,19,18,17,16,15,14],[27,28,29,30,31,32,33,34,35,36,37,38,39],[52,51,50,49,48,47,46,45,44,43,42,41,40],[53,54,55,56,57,58,59,60,61,0,0,0,0]], max:61 },
    S: { cols: [[1,2,3,4,5,6,7,8,9,10,11,12,13],[26,25,24,23,22,21,20,19,18,17,16,15,14],[27,28,29,30,31,32,33,34,35,36,37,38,39],[51,50,49,48,47,46,45,44,43,42,41,40,0]], max:51 },
  },
};

function PlotCell({ plot, onSelect }) {
  if (!plot) return <div style={{ width: CW, height: CH, flexShrink: 0 }} />;
  const fiveK = FIVE_KATHA.has(plot.plotId);
  const bg = plot.status === 'available'
    ? (fiveK ? '#1e40af' : '#1a5c38')
    : plot.status === 'pending' ? '#b45309' : '#991b1b';
  return (
    <div
      onClick={() => onSelect(plot)}
      title={`Block ${plot.block} ${plot.zone === 'N' ? 'North' : 'South'} #${String(plot.num).padStart(2,'0')} — ${plot.status}`}
      style={{
        width: CW, height: CH, borderRadius: 5, background: bg, flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', border: '1.5px solid rgba(255,255,255,.15)',
        transition: 'transform .12s, box-shadow .12s',
        fontSize: '.78rem', fontWeight: 700, color: '#fff', lineHeight: 1.1,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform='scale(1.12)'; e.currentTarget.style.zIndex='10'; e.currentTarget.style.position='relative'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.zIndex=''; e.currentTarget.style.position=''; }}
    >
      <span>{String(plot.num).padStart(2,'0')}</span>
      <span style={{ fontSize:'.5rem', opacity:.8 }}>{fiveK?'5K':'3K'}</span>
    </div>
  );
}

function ZoneMap({ plots, block, zone, onSelect }) {
  const layout = BLOCK_LAYOUT[block]?.[zone];
  if (!layout) return null;
  const plotMap = {};
  plots.forEach(p => { if (p.block === block && p.zone === zone) plotMap[p.num] = p; });

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 6 }}>
      <div style={{ display: 'flex', gap: G, alignItems: 'flex-start', width: 'max-content', padding: '6px 8px' }}>
        {layout.cols.map((col, ci) => (
          <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: G }}>
            {col.map((num, ri) =>
              num > 0 && num <= layout.max
                ? <PlotCell key={ri} plot={plotMap[num]} onSelect={onSelect} />
                : <div key={ri} style={{ width: CW, height: CH, flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DETAIL MODAL ──────────────────────────────────────────────────────────────
function PlotModal({ plot, onClose, onAction, loading }) {
  if (!plot) return null;
  const fiveK = FIVE_KATHA.has(plot.plotId);
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:28,width:440,maxWidth:'95vw',boxShadow:'0 20px 60px rgba(0,0,0,.2)' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
          <h2 style={{ fontFamily:'var(--font-head)',fontSize:'1.3rem',color:'var(--gold)' }}>
            Block {plot.block} — {plot.zone === 'N' ? 'North' : 'South'} #{String(plot.num).padStart(2,'0')}
          </h2>
          <button onClick={onClose} style={{ background:'none',border:'none',color:'var(--text2)',fontSize:'1.2rem',cursor:'pointer' }}>✕</button>
        </div>

        {/* Info rows */}
        {[
          ['Plot ID', plot.plotId],
          ['Size', fiveK ? '5 Katha (66-8"×54-0")' : '3 Katha (54-0"×40-0")'],
          ['Status', <Badge key="s" status={plot.status} />],
          ...(plot.name  ? [['Applicant', plot.name]]  : []),
          ...(plot.phone ? [['Phone',     plot.phone]]  : []),
          ...(plot.email ? [['Email',     plot.email]]  : []),
          ...(plot.note  ? [['Note',      plot.note]]   : []),
        ].map(([label, val]) => (
          <div key={label} style={{ display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--border)',fontSize:'.85rem' }}>
            <span style={{ color:'var(--text2)' }}>{label}</span>
            <span style={{ fontWeight:500 }}>{val}</span>
          </div>
        ))}

        {/* Actions */}
        <div style={{ display:'flex',gap:8,marginTop:18,flexWrap:'wrap' }}>
          {plot.status === 'pending' && (<>
            <button disabled={loading} onClick={() => onAction(plot.plotId,'approve')}
              style={{ flex:1,padding:'8px 14px',background:'var(--green,#15803d)',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
              <FiCheck /> Approve
            </button>
            <button disabled={loading} onClick={() => onAction(plot.plotId,'reject')}
              style={{ flex:1,padding:'8px 14px',background:'var(--red,#dc2626)',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
              <FiX /> Reject
            </button>
          </>)}
          {plot.status === 'booked' && (
            <button disabled={loading} onClick={() => onAction(plot.plotId,'release')}
              style={{ flex:1,padding:'8px 14px',background:'var(--gold)',color:'#000',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
              <FiUnlock /> Release Plot
            </button>
          )}
          <button onClick={onClose}
            style={{ padding:'8px 14px',background:'none',border:'1px solid var(--border)',borderRadius:8,color:'var(--text)',cursor:'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function PlotBookings() {
  const toast = useToast();
  const [plots, setPlots]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);
  const [selected, setSelected]   = useState(null);
  const [view, setView]           = useState('map');   // 'map' | 'list'
  const [filterBlock,  setFilterBlock]  = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch]             = useState('');

  const load = useCallback(async () => {
    try {
      const res = await api.get('/admin/plots');
      setPlots(res.data);
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (plotId, action) => {
    setActioning(true);
    try {
      await api.put(`/admin/plots/${plotId}/${action}`, {});
      toast(
        action === 'approve' ? '✅ Plot approved!' :
        action === 'reject'  ? 'Plot request rejected.' : 'Plot released.',
        action === 'approve' ? 'success' : 'info'
      );
      const res = await api.get('/admin/plots');
      setPlots(res.data);
      setSelected(prev => prev ? res.data.find(p => p.plotId === prev.plotId) || null : null);
    } catch (e) { toast(e.message, 'error'); }
    finally { setActioning(false); }
  };

  const handleReset = async () => {
    if (!confirm('Reset ALL plot bookings? This cannot be undone.')) return;
    setActioning(true);
    try {
      await api.post('/admin/plots/reset', {});
      toast('All plots reset to available.', 'info');
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setActioning(false); }
  };

  const total     = plots.length;
  const available = plots.filter(p => p.status === 'available').length;
  const pending   = plots.filter(p => p.status === 'pending').length;
  const booked    = plots.filter(p => p.status === 'booked').length;

  const filteredPlots = plots.filter(p => {
    if (filterBlock  && p.block  !== filterBlock)  return false;
    if (filterStatus && p.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!String(p.num).includes(q) && !p.block.toLowerCase().includes(q) && !p.name.toLowerCase().includes(q) && !p.phone.includes(q))
        return false;
    }
    return true;
  });

  if (loading) return <div style={{ color:'var(--text2)',padding:'2rem' }}>Loading plots…</div>;

  return (
    <div>
      <div className="page-header" style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ display:'flex',alignItems:'center',gap:10 }}><FiMap /> Plot Booking Management</h1>
          <p style={{ color:'var(--text2)',marginTop:4 }}>Manage all 348 plots — approve, reject or release bookings</p>
        </div>
        <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
          <button onClick={load} style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'none',border:'1px solid var(--border)',borderRadius:8,color:'var(--text)',cursor:'pointer',fontWeight:500 }}>
            <FiRefreshCw size={14} /> Refresh
          </button>
          <button onClick={handleReset} style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'#dc2626',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:600 }}>
            <FiAlertTriangle size={14} /> Reset All
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'1rem',marginBottom:'1.5rem' }}>
        {[
          { label:'Total Plots',  value:total,     color:'var(--gold)' },
          { label:'Available',    value:available,  color:'#15803d' },
          { label:'Pending',      value:pending,    color:'#b45309' },
          { label:'Booked',       value:booked,     color:'#b91c1c' },
        ].map(c => (
          <div key={c.label} className="card" style={{ display:'flex',flexDirection:'column',gap:4 }}>
            <div style={{ fontSize:'1.8rem',fontFamily:'var(--font-head)',fontWeight:800,color:c.color }}>{c.value}</div>
            <div style={{ fontSize:'.78rem',color:'var(--text2)' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* View Toggle + Filters */}
      <div style={{ display:'flex',gap:8,flexWrap:'wrap',marginBottom:'1rem',alignItems:'center' }}>
        <button onClick={() => setView('map')} style={{ padding:'7px 16px',borderRadius:8,border:'1px solid var(--border)',background:view==='map'?'var(--gold)':'none',color:view==='map'?'#000':'var(--text)',fontWeight:600,cursor:'pointer' }}>🗺 Map View</button>
        <button onClick={() => setView('list')} style={{ padding:'7px 16px',borderRadius:8,border:'1px solid var(--border)',background:view==='list'?'var(--gold)':'none',color:view==='list'?'#000':'var(--text)',fontWeight:600,cursor:'pointer' }}>📋 List View</button>
        <select value={filterBlock} onChange={e=>setFilterBlock(e.target.value)} style={{ padding:'7px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg2)',color:'var(--text)' }}>
          <option value="">All Blocks</option>
          <option value="A">Block A</option>
          <option value="B">Block B</option>
          <option value="C">Block C</option>
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ padding:'7px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg2)',color:'var(--text)' }}>
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="booked">Booked</option>
        </select>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name / plot #…"
          style={{ padding:'7px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg2)',color:'var(--text)',minWidth:180 }} />
      </div>

      {/* Legend */}
      <div style={{ display:'flex',gap:16,flexWrap:'wrap',marginBottom:'1rem',fontSize:'.8rem',color:'var(--text2)' }}>
        {[['#1e40af','5 Katha – Available'],['#1a5c38','3 Katha – Available'],['#b45309','Pending Approval'],['#991b1b','Booked']].map(([c,l])=>(
          <span key={l} style={{ display:'flex',alignItems:'center',gap:5 }}><span style={{ width:14,height:14,borderRadius:3,background:c,display:'inline-block' }}></span>{l}</span>
        ))}
      </div>

      {/* MAP VIEW */}
      {view === 'map' && (
        <div>
          {['A','B','C'].map(block => (
            (filterBlock && filterBlock !== block) ? null :
            <div key={block} className="card" style={{ marginBottom:'1.5rem',overflow:'hidden',padding:0 }}>
              <div style={{ background:'linear-gradient(135deg,#1a5c38,#1e7044)',color:'#fff',padding:'10px 18px',fontFamily:'var(--font-head)',fontWeight:700,fontSize:'1.05rem',letterSpacing:2,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                <span>◆ BLOCK – {block}</span>
                <span style={{ fontSize:'.78rem',opacity:.9,fontWeight:400 }}>
                  {plots.filter(p=>p.block===block&&p.status==='available').length} avail •{' '}
                  {plots.filter(p=>p.block===block&&p.status==='pending').length} pending •{' '}
                  {plots.filter(p=>p.block===block&&p.status==='booked').length} booked
                </span>
              </div>
              <div style={{ display:'flex',gap:0,flexWrap:'wrap' }}>
                {['N','S'].map(zone => (
                  <div key={zone} style={{ flex:1,minWidth:280 }}>
                    <div style={{ textAlign:'center',fontSize:'.65rem',fontWeight:700,letterSpacing:2,color:'var(--text2)',padding:'6px',background:'var(--bg)',borderBottom:'1px solid var(--border)' }}>
                      {zone === 'N' ? '▲ NORTH ZONE' : '▼ SOUTH ZONE'}
                    </div>
                    <ZoneMap plots={plots} block={block} zone={zone} onSelect={setSelected} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <div style={{ overflowX:'auto',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:10 }}>
          <table style={{ width:'100%',borderCollapse:'collapse',fontSize:'.83rem' }}>
            <thead>
              <tr style={{ background:'var(--bg)' }}>
                {['Plot #','Block','Zone','Size','Status','Applicant','Phone','Actions'].map(h=>(
                  <th key={h} style={{ padding:'10px 14px',textAlign:'left',fontFamily:'var(--font-head)',fontSize:'.86rem',letterSpacing:1,color:'var(--gold)',borderBottom:'1.5px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPlots.length === 0 ? (
                <tr><td colSpan={8} style={{ padding:'2rem',textAlign:'center',color:'var(--text2)' }}>No plots found.</td></tr>
              ) : filteredPlots.map(p => (
                <tr key={p.plotId} style={{ borderBottom:'1px solid var(--border)',cursor:'pointer' }} onClick={() => setSelected(p)}>
                  <td style={{ padding:'8px 14px',fontWeight:700 }}>{String(p.num).padStart(2,'0')}</td>
                  <td style={{ padding:'8px 14px' }}>Block {p.block}</td>
                  <td style={{ padding:'8px 14px',fontSize:'.75rem',color:'var(--text2)' }}>{p.zone==='N'?'North':'South'}</td>
                  <td style={{ padding:'8px 14px',fontSize:'.75rem' }}>{FIVE_KATHA.has(p.plotId)?'5 Katha':'3 Katha'}</td>
                  <td style={{ padding:'8px 14px' }}><Badge status={p.status} /></td>
                  <td style={{ padding:'8px 14px' }}>{p.name||<span style={{color:'var(--text3)'}}>—</span>}</td>
                  <td style={{ padding:'8px 14px' }}>{p.phone||<span style={{color:'var(--text3)'}}>—</span>}</td>
                  <td style={{ padding:'8px 14px',whiteSpace:'nowrap' }}>
                    {p.status==='pending'&&<>
                      <button onClick={e=>{e.stopPropagation();handleAction(p.plotId,'approve');}} style={{ marginRight:4,padding:'3px 9px',background:'#15803d',color:'#fff',border:'none',borderRadius:5,cursor:'pointer',fontSize:'.73rem',fontWeight:600 }}>✓ Approve</button>
                      <button onClick={e=>{e.stopPropagation();handleAction(p.plotId,'reject');}} style={{ padding:'3px 9px',background:'#dc2626',color:'#fff',border:'none',borderRadius:5,cursor:'pointer',fontSize:'.73rem',fontWeight:600 }}>✕ Reject</button>
                    </>}
                    {p.status==='booked'&&
                      <button onClick={e=>{e.stopPropagation();handleAction(p.plotId,'release');}} style={{ padding:'3px 9px',background:'var(--gold)',color:'#000',border:'none',borderRadius:5,cursor:'pointer',fontSize:'.73rem',fontWeight:600 }}>Release</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <PlotModal plot={selected} onClose={() => setSelected(null)} onAction={handleAction} loading={actioning} />
      )}
    </div>
  );
}

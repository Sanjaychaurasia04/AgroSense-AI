// src/pages/Market/Market.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import { theme } from '../../styles/theme';
import { getMandiPrices } from '../../api/api';

const STATES = [
  'All States','Andhra Pradesh','Assam','Bihar','Chhattisgarh',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab',
  'Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand',
  'West Bengal',
];

const QUICK_CROPS = ['Rice','Wheat','Tomato','Onion','Potato','Cotton','Soybean','Maize','Mustard','Groundnut'];

const FALLBACK = [
  { commodity:'Rice (Basmati)', modal_price:'3250', min_price:'3100', max_price:'3400', market:'Delhi',      state:'Delhi'          },
  { commodity:'Wheat',          modal_price:'2450', min_price:'2380', max_price:'2520', market:'Ludhiana',   state:'Punjab'         },
  { commodity:'Tomato',         modal_price:'1800', min_price:'1500', max_price:'2200', market:'Nashik',     state:'Maharashtra'    },
  { commodity:'Onion',          modal_price:'1200', min_price:'1000', max_price:'1450', market:'Pune',       state:'Maharashtra'    },
  { commodity:'Potato',         modal_price:'900',  min_price:'800',  max_price:'1050', market:'Agra',       state:'Uttar Pradesh'  },
  { commodity:'Cotton',         modal_price:'6800', min_price:'6500', max_price:'7100', market:'Nagpur',     state:'Maharashtra'    },
  { commodity:'Soybean',        modal_price:'4500', min_price:'4300', max_price:'4750', market:'Indore',     state:'Madhya Pradesh' },
  { commodity:'Maize',          modal_price:'1950', min_price:'1850', max_price:'2050', market:'Patna',      state:'Bihar'          },
  { commodity:'Mustard',        modal_price:'5200', min_price:'5000', max_price:'5450', market:'Jaipur',     state:'Rajasthan'      },
  { commodity:'Groundnut',      modal_price:'5800', min_price:'5500', max_price:'6100', market:'Rajkot',     state:'Gujarat'        },
];

// ── Min/Max/Modal range bar ───────────────────────────────────
const RangeBar = ({ min, max, modal }) => {
  const spread = max - min;
  const pct = spread > 0 ? Math.min(Math.max(((modal - min) / spread) * 100, 0), 100) : 50;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'rgba(200,230,201,0.35)', marginBottom:3 }}>
        <span>₹{min.toLocaleString()}</span>
        <span>₹{max.toLocaleString()}</span>
      </div>
      <div style={{ height:4, background:'rgba(255,255,255,0.07)', borderRadius:999, position:'relative' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,rgba(74,222,128,0.2),rgba(74,222,128,0.5))', borderRadius:999 }} />
        <div style={{
          position:'absolute', left:`${pct}%`, top:-2, transform:'translateX(-50%)',
          width:8, height:8, borderRadius:'50%',
          background:'#4ade80', boxShadow:'0 0 6px rgba(74,222,128,0.6)',
        }} />
      </div>
      <div style={{ textAlign:'center', fontSize:10, color:'#86efac', marginTop:3 }}>
        Modal ₹{modal.toLocaleString()}
      </div>
    </div>
  );
};

// ── Price card ────────────────────────────────────────────────
const PriceCard = ({ r, isDemo }) => {
  const [hov, setHov] = useState(false);
  const modal = Number(r.modal_price) || 0;
  const min   = Number(r.min_price)   || 0;
  const max   = Number(r.max_price)   || 0;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
        border:`1px solid ${hov ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius:16, padding:'18px 16px', boxSizing:'border-box',
        transition:'all 0.22s', cursor:'default',
        transform: hov ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:2 }}>
        <p style={{ color:'#f0fdf4', fontSize:13, fontWeight:600, lineHeight:1.3, margin:0 }}>
          {r.commodity}
        </p>
        {isDemo && (
          <span style={{ fontSize:9, color:'rgba(251,191,36,0.7)', background:'rgba(251,191,36,0.1)', padding:'2px 6px', borderRadius:4, fontWeight:600, flexShrink:0, marginLeft:6 }}>
            DEMO
          </span>
        )}
      </div>
      <p style={{ color:'rgba(200,230,201,0.45)', fontSize:11, margin:'4px 0 8px' }}>
        {r.market} · {r.state}
      </p>
      <p style={{ color:'#f0fdf4', fontSize:26, fontWeight:700, lineHeight:1, margin:0 }}>
        ₹{modal.toLocaleString()}
        <span style={{ fontSize:11, color:'rgba(200,230,201,0.35)', fontWeight:400, marginLeft:4 }}>/Qtl</span>
      </p>
      <RangeBar min={min} max={max} modal={modal} />
      {r.arrival_date && (
        <p style={{ color:'rgba(200,230,201,0.3)', fontSize:10, marginTop:8, marginBottom:0 }}>
          📅 {r.arrival_date}
        </p>
      )}
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────
const Skeleton = () => (
  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
    {[...Array(8)].map((_,i) => (
      <div key={i} style={{
        height:150, borderRadius:16,
        background:'rgba(255,255,255,0.04)',
        border:'1px solid rgba(255,255,255,0.06)',
        animation:`mktShimmer 1.4s ${i*0.08}s ease-in-out infinite alternate`,
      }} />
    ))}
    <style>{`@keyframes mktShimmer{from{opacity:.3}to{opacity:.7}}`}</style>
  </div>
);

// ── Main ──────────────────────────────────────────────────────
const Market = () => {
  const [records, setRecords]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [isDemo, setIsDemo]           = useState(false);
  const [search, setSearch]           = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPrices = useCallback(async (st = 'All States', crop = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await getMandiPrices(st, crop);
      if (!data.records?.length) throw new Error('No records for this filter.');
      setRecords(data.records);
      setIsDemo(false);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      setRecords(FALLBACK);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPrices(); }, []);

  const handleState = (s) => { setSelectedState(s); setSearch(''); fetchPrices(s, ''); };
  const handleCrop  = (c) => { const next = search === c ? '' : c; setSearch(next); fetchPrices(selectedState, next); };

  const filtered = records.filter(r =>
    (r.commodity?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (r.market?.toLowerCase()    || '').includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6, flexWrap:'wrap', gap:8 }}>
        <div>
          <h2 style={{ color:theme.wheat, fontFamily:"'Playfair Display', serif", fontSize:28, marginBottom:4 }}>
            Mandi Prices
          </h2>
          <p style={{ color:theme.mist, opacity:0.65, fontSize:13 }}>
            {isDemo
              ? '⚠️ Showing demo data — API unavailable'
              : `✅ Live · AGMARKNET · ${lastUpdated?.toLocaleTimeString('en-IN') ?? ''}`
            }
          </p>
        </div>
        <button onClick={() => fetchPrices(selectedState, search)} disabled={loading} style={{
          padding:'8px 16px', borderRadius:10, cursor: loading ? 'not-allowed' : 'pointer',
          background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.2)',
          color:'#86efac', fontFamily:'inherit', fontSize:12, fontWeight:600,
          opacity: loading ? 0.5 : 1,
        }}>↻ Refresh</button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background:'rgba(251,191,36,0.07)', border:'1px solid rgba(251,191,36,0.2)',
          borderRadius:12, padding:'10px 16px', marginBottom:16,
          display:'flex', gap:8, alignItems:'center',
        }}>
          <span>⚠️</span>
          <p style={{ color:'#fbbf24', fontSize:13, margin:0 }}>{error}</p>
        </div>
      )}

      {/* State filter */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, flexWrap:'wrap' }}>
        <select value={selectedState} onChange={e => handleState(e.target.value)} style={{
          padding:'9px 14px', borderRadius:10,
          background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
          color:'#f0fdf4', fontFamily:'inherit', fontSize:13, outline:'none', cursor:'pointer',
        }}>
          {STATES.map(s => <option key={s} value={s} style={{ background:'#202c21' }}>{s}</option>)}
        </select>
        <span style={{ color:'rgba(200,230,201,0.35)', fontSize:12 }}>{filtered.length} entries</span>
      </div>

      {/* Quick crop chips */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
        {QUICK_CROPS.map(c => (
          <button key={c} onClick={() => handleCrop(c)} disabled={loading} style={{
            padding:'5px 13px', borderRadius:999, cursor: loading ? 'not-allowed' : 'pointer',
            border:`1px solid ${search===c ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.1)'}`,
            background: search===c ? 'rgba(74,222,128,0.1)' : 'transparent',
            color: search===c ? '#86efac' : 'rgba(200,230,201,0.5)',
            fontFamily:'inherit', fontSize:12, transition:'all 0.18s',
            opacity: loading ? 0.5 : 1,
          }}>{c}</button>
        ))}
        {search && (
          <button onClick={() => handleCrop('')} style={{
            padding:'5px 13px', borderRadius:999, cursor:'pointer',
            border:'1px solid rgba(248,113,113,0.3)', background:'rgba(248,113,113,0.08)',
            color:'#f87171', fontFamily:'inherit', fontSize:12,
          }}>✕ Clear</button>
        )}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Type to filter results..."
        style={{
          width:'100%', boxSizing:'border-box', marginBottom:20,
          background:'rgba(255,248,238,0.05)', border:`1px solid ${theme.earth}`,
          borderRadius:12, padding:'11px 16px',
          color:theme.cream, fontFamily:'inherit', fontSize:14, outline:'none',
        }}
      />

      {/* Grid */}
      {loading ? <Skeleton /> : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:48 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🌾</div>
          <p style={{ color:'rgba(200,230,201,0.5)', fontSize:15 }}>No results for "{search}"</p>
          <p style={{ color:'rgba(200,230,201,0.3)', fontSize:13, marginTop:6 }}>Try a different crop or clear filters</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
          {filtered.map((r,i) => <PriceCard key={i} r={r} isDemo={isDemo} />)}
        </div>
      )}

      <p style={{ color:'rgba(200,230,201,0.2)', fontSize:11, textAlign:'center', marginTop:24 }}>
        Source: AGMARKNET · Ministry of Agriculture &amp; Farmers Welfare, Government of India
      </p>
    </div>
  );
};

export default Market;
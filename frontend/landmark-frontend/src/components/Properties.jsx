// src/components/Properties.jsx
import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import PropertyModal from './PropertyModal';
import { api } from '../api';
import './Properties.css';

const filters = ['All', 'Available', 'Sold'];

export default function Properties() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const query = filter === 'All' ? '' : `?status=${filter}`;
    api.get(`/properties${query}`)
      .then(res => setProperties(res.data))   // backend: { success, data: [...] }
      .catch(() => setError('Failed to load properties.'))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <section className="section properties" id="properties">
      <div className="container">
        <div className="properties__header">
          <div>
            <p className="section-label">Our Listings</p>
            <h2 className="section-title">Available Properties</h2>
            <p className="section-subtitle">
              Explore our hand-picked selection of residential plots, commercial land, and flats across prime locations in Bangladesh.
            </p>
          </div>
          <div className="properties__filters">
            {filters.map(f => (
              <button
                key={f}
                className={`properties__filter-btn ${filter === f ? 'properties__filter-btn--active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="properties__empty">Loading properties…</p>}
        {error   && <p className="properties__empty" style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <div className="properties__grid">
            {properties.map(p => (
              <PropertyCard key={p._id} property={p} onClick={setSelected} />
            ))}
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <p className="properties__empty">No properties found.</p>
        )}
      </div>

      {selected && <PropertyModal property={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

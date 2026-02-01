import React, { useEffect, useMemo, useState } from 'react';

const Newsletter = () => {
  const API_BASE = process.env.REACT_APP_API_BASE || 'https://dev.makemyveggies.com/';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState('');

  const readJsonSafe = async (response) => {
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      const preview = text?.slice(0, 200) || '';
      throw new Error(`Invalid server response. ${preview}`);
    }
  };

  const fetchSubscribers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/backend/api/admin/get_newsletter_subscribers.php`, {
        method: 'GET',
        credentials: 'include'
      });

      const data = await readJsonSafe(response);

      if (!response.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to load newsletter subscribers');
      }

      setSubscribers(Array.isArray(data.subscribers) ? data.subscribers : []);
    } catch (e) {
      setError(e?.message || 'Failed to load newsletter subscribers');
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((s) => String(s?.email || '').toLowerCase().includes(q));
  }, [search, subscribers]);

  return (
    <div className="container-fluid">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h4 className="mb-0">Newsletter</h4>
          <div className="text-muted small">Manage subscribers</div>
        </div>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={fetchSubscribers} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {loading && <p className="text-muted mb-0">Loading...</p>}
          {!loading && error && <p className="text-danger mb-0">{error}</p>}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 90 }}>Sr No</th>
                    <th>Email</th>
                    <th style={{ width: 220 }}>Subscribed On</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-muted">
                        No subscribers found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s, idx) => (
                      <tr key={s.id ?? `${s.email}-${idx}`}>
                        <td>{idx + 1}</td>
                        <td className="fw-semibold">{s.email}</td>
                        <td className="text-muted">{s.created_at || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;

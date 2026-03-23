import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { useHasAnyPermission } from '../../rbac/useHasPermission';

const AdminNewsletter = () => {
  const canRefresh = useHasAnyPermission(['view.newsletter', 'update.newsletter']);

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const readJsonSafe = useCallback(async (response) => {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch (e) {
      const preview = text?.slice(0, 200) || '';
      throw new Error(`Invalid server response. ${preview}`);
    }
  }, []);

  const getSubscribersEndpointCandidates = useCallback(() => {
    const path = '/backend/api/admin/get_newsletter_subscribers.php?limit=1000';
    return [
      path,
      `http://localhost/git_mmv/makemyveggies/${path}`
    ];
  }, []);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const urls = getSubscribersEndpointCandidates();
      let lastError = null;

      for (const url of urls) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
          });

          const contentType = response.headers.get('content-type') || '';
          if (!contentType.toLowerCase().includes('application/json')) {
            const text = await response.text();
            const preview = text?.slice(0, 200) || '';
            throw new Error(`Invalid server response. ${preview}`);
          }

          const data = await readJsonSafe(response);

          if (!response.ok || data?.status !== 'success') {
            throw new Error(data?.message || 'Failed to load newsletter subscribers');
          }

          setSubscribers(Array.isArray(data?.subscribers) ? data.subscribers : []);
          lastError = null;
          break;
        } catch (innerErr) {
          lastError = innerErr;
        }
      }

      if (lastError) {
        throw lastError;
      }
    } catch (e) {
      setError(e?.message || 'Failed to load newsletter subscribers');
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  }, [getSubscribersEndpointCandidates, readJsonSafe]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const filteredSubscribers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((s) => String(s?.email || '').toLowerCase().includes(q));
  }, [query, subscribers]);

  const handleRefresh = async () => {
    if (!canRefresh) return;
    await fetchSubscribers();
    toast.success('Subscribers refreshed');
  };

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
        <div>
          <h4 className="mb-1">Newsletter Subscribers</h4>
          <p className="text-muted mb-0 small">All emails submitted in the website newsletter section.</p>
        </div>

        <div className="d-flex gap-2">
          <div className="input-group input-group-sm" style={{ maxWidth: 420, width: '100%' }}>
            <span className="input-group-text" style={{ height: 31, display: 'flex', alignItems: 'center' }}>
              Search
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="email@example.com"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ height: 31 }}
            />
          </div>

          {canRefresh && (
            <button
              type="button"
              className="btn btn-sm btn-outline-success"
              onClick={handleRefresh}
              disabled={loading}
              aria-label="Refresh"
              title="Refresh"
              style={{ height: 31 }}
            >
              <RotateCw size={16} />
            </button>
          )}
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
                    <th style={{ width: 220 }}>Subscribed At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-muted">
                        No subscribers found.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((s, idx) => (
                      <tr key={s?.id ?? `${s?.email ?? 'row'}-${idx}`}>
                        <td>{idx + 1}</td>
                        <td className="fw-semibold">{s?.email || '-'}</td>
                        <td className="text-muted">{s?.created_at || '-'}</td>
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

export default AdminNewsletter;

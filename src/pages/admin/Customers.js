import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getApiBase } from '../../utils/api';
import { useHasAnyPermission } from '../../rbac/useHasPermission';

const Customers = () => {
  const API_BASE = getApiBase();
  const apiPrefix = `${API_BASE}/backend/api/admin`;

  const maskPhone = (phone) => {
    if (!phone) return '—';
    const digits = String(phone).replace(/\D/g, '');
    if (!digits) return '—';
    const last4 = digits.slice(-4);
    return `XXXXXX${last4}`;
  };

  const exportCsv = (rows) => {
    const safe = (v) => {
      const s = v === null || v === undefined ? '' : String(v);
      return `"${s.replace(/"/g, '""')}"`;
    };

    const header = ['ID', 'Name', 'Email', 'Phone', 'Active', 'Email Verified'];
    const lines = [header.map(safe).join(',')];

    (Array.isArray(rows) ? rows : []).forEach((u) => {
      const name = `${u?.first_name || ''} ${u?.last_name || ''}`.trim();
      lines.push(
        [
          u?.user_id,
          name || '',
          u?.email || '',
          maskPhone(u?.phone),
          u?.is_active ? 'Active' : 'Inactive',
          u?.email_verified ? 'Verified' : 'Not verified'
        ].map(safe).join(',')
      );
    });

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    a.href = url;
    a.download = `customers-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const canViewCustomers = useHasAnyPermission(['view.customer', 'view.user']);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);
  const limit = 10;

  const customers = useMemo(() => {
    return (Array.isArray(users) ? users : []).filter((u) => !Array.isArray(u?.roles) || u.roles.length === 0);
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((u) => {
      const hay = [u?.first_name, u?.last_name, u?.email, u?.phone]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase())
        .join(' ');
      return hay.includes(q);
    });
  }, [customers, search]);

  const totalPages = Math.ceil(filtered.length / limit) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const load = async () => {
      if (!canViewCustomers) {
        setLoading(false);
        setUsers([]);
        setError('Access denied');
        return;
      }

      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set('search', search.trim());

        const res = await fetch(`${apiPrefix}/get_users.php?${params.toString()}`, {
          method: 'GET',
          credentials: 'include'
        });

        const text = await res.text();
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch (e) {
          const preview = text?.slice(0, 200) || '';
          throw new Error(`Invalid server response. ${preview}`);
        }

        if (!res.ok || data?.status !== 'success') {
          throw new Error(data?.message || 'Failed to load customers');
        }

        setUsers(Array.isArray(data?.users) ? data.users : []);
      } catch (e) {
        setUsers([]);
        setError(e?.message || 'Failed to load customers');
        toast.error(e?.message || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [apiPrefix, canViewCustomers, search]);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Customers</h4>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
            <div className="input-group input-group-sm" style={{ maxWidth: 420, width: '100%' }}>
              <span className="input-group-text" style={{ height: 31, display: 'flex', alignItems: 'center' }}>
                Search
              </span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="name / email / phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ height: 31 }}
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                disabled={loading || !!error || filtered.length === 0}
                onClick={() => exportCsv(filtered)}
              >
                Export
              </button>
              <div className="text-muted small">Total: {loading ? '—' : filtered.length}</div>
            </div>
          </div>

          {loading && <p className="text-muted mb-0">Loading...</p>}
          {!loading && error && <p className="text-danger mb-0">{error}</p>}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 70 }}>SR.NO</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th style={{ width: 160 }}>Phone</th>
                    <th style={{ width: 140 }}>Active</th>
                    <th style={{ width: 160 }}>Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        No customers found.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((u, idx) => (
                      <tr key={u.user_id}>
                        <td>{(page - 1) * limit + idx + 1}</td>
                        <td className="fw-semibold">{`${u.first_name || ''} ${u.last_name || ''}`.trim() || '—'}</td>
                        <td>{u.email || '—'}</td>
                        <td className="text-muted">{maskPhone(u.phone)}</td>
                        <td>
                          <span className={`badge ${u.is_active ? 'bg-success' : 'bg-secondary'}`}>{u.is_active ? 'Active' : 'Inactive'}</span>
                        </td>
                        <td>
                          <span className={`badge ${u.email_verified ? 'bg-success' : 'bg-warning text-dark'}`}>{
                            u.email_verified ? 'Verified' : 'Not verified'
                          }</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {!loading && !error && totalPages > 1 && (
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
              <div className="text-muted small">
                Page {page} of {totalPages}
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;

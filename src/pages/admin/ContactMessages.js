import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, Eye, RotateCw, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useHasPermission } from '../../rbac/useHasPermission';

const ContactMessages = () => {
  const canUpdateMessage = useHasPermission('update.contact_message');
  const canDeleteMessage = useHasPermission('delete.contact_message');

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE || 'https://dev.makemyveggies.com/';

  const readJsonSafe = useCallback(async (response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch (e) {
      const preview = text?.slice(0, 200) || '';
      throw new Error(`Invalid server response. ${preview}`);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.set('limit', '200');
      if (status) params.set('status', status);
      if (query.trim()) params.set('search', query.trim());

      const response = await fetch(`${API_BASE}/backend/api/admin/get_contact_messages.php?${params.toString()}`, {
        method: 'GET',
        credentials: 'include'
      });

      const data = await readJsonSafe(response);

      if (!response.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to load messages');
      }

      setMessages(Array.isArray(data?.messages) ? data.messages : []);
    } catch (e) {
      setMessages([]);
      setError(e?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, query, readJsonSafe, status]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const filteredMessages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;

    return messages.filter((m) => {
      const hay = [m?.email, m?.first_name, m?.last_name, m?.subject, m?.message, m?.phone]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase())
        .join(' ');
      return hay.includes(q);
    });
  }, [messages, query]);

  const closeModal = () => setSelected(null);

  const updateStatus = async (id, nextStatus) => {
    if (!canUpdateMessage) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`${API_BASE}/backend/api/admin/update_contact_message.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status: nextStatus })
      });

      const data = await readJsonSafe(response);
      if (!response.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to update message');
      }

      toast.success('Message updated');
      await fetchMessages();
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status: nextStatus } : prev));
    } catch (e) {
      toast.error(e?.message || 'Failed to update message');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!canDeleteMessage) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`${API_BASE}/backend/api/admin/delete_contact_message.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      const data = await readJsonSafe(response);
      if (!response.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to delete message');
      }

      toast.success('Message deleted');
      closeModal();
      await fetchMessages();
    } catch (e) {
      toast.error(e?.message || 'Failed to delete message');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
        <div>
          <h4 className="mb-1">Contact Messages</h4>
          <p className="text-muted mb-0 small">Messages submitted from the website contact form.</p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <div className="input-group input-group-sm" style={{ maxWidth: 320 }}>
            <span className="input-group-text">Search</span>
            <input
              type="text"
              className="form-control"
              placeholder="email / subject / name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select className="form-select form-select-sm" style={{ maxWidth: 180 }} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </select>

          <button
            type="button"
            className="btn btn-sm btn-outline-success"
            onClick={fetchMessages}
            disabled={loading}
            aria-label="Refresh"
            title="Refresh"
          >
            <RotateCw size={16} />
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
                    <th style={{ width: 110 }}>Status</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th style={{ width: 200 }}>Received</th>
                    <th style={{ width: 120 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-muted">No messages found.</td>
                    </tr>
                  ) : (
                    filteredMessages.map((m, idx) => {
                      const name = `${m?.first_name || ''} ${m?.last_name || ''}`.trim() || '—';
                      return (
                        <tr key={m?.id ?? `row-${idx}`}>
                          <td>{idx + 1}</td>
                          <td>
                            <span className={`badge ${m?.status === 'new' ? 'bg-success' : m?.status === 'read' ? 'bg-primary' : 'bg-secondary'}`}>
                              {m?.status || 'new'}
                            </span>
                          </td>
                          <td className="fw-semibold">{name}</td>
                          <td>{m?.email || '-'}</td>
                          <td className="text-truncate" style={{ maxWidth: 260 }}>{m?.subject || '-'}</td>
                          <td className="text-muted">{m?.created_at || '-'}</td>
                          <td>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setSelected(m)} aria-label="View">
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Message #{selected?.id}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="text-muted small">Name</div>
                      <div className="fw-semibold">{`${selected?.first_name || ''} ${selected?.last_name || ''}`.trim() || '—'}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Phone</div>
                      <div className="fw-semibold">{selected?.phone || '—'}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Email</div>
                      <div className="fw-semibold">{selected?.email || '—'}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Status</div>
                      <div className="fw-semibold">{selected?.status || 'new'}</div>
                    </div>
                    <div className="col-12">
                      <div className="text-muted small">Subject</div>
                      <div className="fw-semibold">{selected?.subject || '—'}</div>
                    </div>
                    <div className="col-12">
                      <div className="text-muted small">Message</div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{selected?.message || '—'}</div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer d-flex flex-wrap gap-2 justify-content-between">
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => updateStatus(selected.id, 'read')}
                      disabled={isUpdating}
                      aria-label="Mark Read"
                      title="Mark Read"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateStatus(selected.id, 'archived')}
                      disabled={isUpdating}
                      aria-label="Archive"
                      title="Archive"
                    >
                      <Archive size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm"
                      onClick={() => updateStatus(selected.id, 'new')}
                      disabled={isUpdating}
                      aria-label="Mark New"
                      title="Mark New"
                    >
                      New
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteMessage(selected.id)}
                    disabled={isUpdating}
                  >
                    <Trash2 size={16} className="me-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeModal} />
        </>
      )}
    </div>
  );
};

export default ContactMessages;

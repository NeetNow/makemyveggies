import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const Users = () => {
  const API_BASE = process.env.PUBLIC_URL || '';
  const apiPrefix = `${API_BASE}/backend/api/admin`;

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const emptyForm = useMemo(
    () => ({
      user_id: null,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      email_verified: true,
      is_active: true,
      roles: []
    }),
    []
  );

  const [form, setForm] = useState(emptyForm);

  const readJsonSafe = async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      const preview = text?.slice(0, 200) || '';
      throw new Error(`Invalid server response. ${preview}`);
    }
  };

  const loadRoles = async () => {
    const res = await fetch(`${apiPrefix}/get_roles.php`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await readJsonSafe(res);
    if (!res.ok || data?.status !== 'success') {
      throw new Error(data?.message || 'Failed to load roles');
    }
    setRoles(Array.isArray(data.roles) ? data.roles : []);
  };

  const loadUsers = async () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());

    const res = await fetch(`${apiPrefix}/get_users.php?${params.toString()}`, {
      method: 'GET',
      credentials: 'include'
    });

    const data = await readJsonSafe(res);
    if (!res.ok || data?.status !== 'success') {
      throw new Error(data?.message || 'Failed to load users');
    }

    setUsers(Array.isArray(data.users) ? data.users : []);
  };

  const refresh = async () => {
    setLoading(true);
    try {
      await Promise.all([loadRoles(), loadUsers()]);
    } catch (e) {
      toast.error(e?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      loadUsers().catch((e) => toast.error(e?.message || 'Failed to load users'));
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const openCreate = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (u) => {
    setForm({
      user_id: u.user_id,
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      email: u.email || '',
      phone: u.phone || '',
      password: '',
      email_verified: !!u.email_verified,
      is_active: !!u.is_active,
      roles: Array.isArray(u.roles) ? u.roles : []
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
  };

  const toggleRole = (roleName) => {
    setForm((prev) => {
      const has = prev.roles.includes(roleName);
      return { ...prev, roles: has ? prev.roles.filter((r) => r !== roleName) : [...prev.roles, roleName] };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const isEdit = !!form.user_id;
      const endpoint = isEdit ? 'update_user.php' : 'create_user.php';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        user_id: form.user_id,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        email_verified: form.email_verified,
        is_active: form.is_active,
        roles: form.roles
      };

      const res = await fetch(`${apiPrefix}/${endpoint}`, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await readJsonSafe(res);
      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Save failed');
      }

      toast.success(isEdit ? 'User updated' : 'User created');
      setShowModal(false);
      await loadUsers();
    } catch (e) {
      toast.error(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (userId) => {
    if (!userId) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`${apiPrefix}/delete_user.php`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      const data = await readJsonSafe(res);
      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Delete failed');
      }

      toast.success('User deleted');
      await loadUsers();
    } catch (e) {
      toast.error(e?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
        <div>
          <h4 className="mb-0">Users & Roles</h4>
          <small className="text-muted">Only super admins can create/update/delete users.</small>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <input
            className="form-control"
            placeholder="Search name/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 220 }}
          />
          <button type="button" className="btn btn-success" onClick={openCreate}>
            + Add User
          </button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-muted">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 80 }}>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th style={{ width: 140 }}>Active</th>
                    <th style={{ width: 160 }}>Verified</th>
                    <th>Roles</th>
                    <th style={{ width: 220 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.user_id}>
                        <td>{u.user_id}</td>
                        <td>{`${u.first_name || ''} ${u.last_name || ''}`.trim() || '—'}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge ${u.is_active ? 'bg-success' : 'bg-secondary'}`}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.email_verified ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {u.email_verified ? 'Verified' : 'Not verified'}
                          </span>
                        </td>
                        <td>
                          {(Array.isArray(u.roles) ? u.roles : []).length ? (
                            (u.roles || []).map((r) => (
                              <span key={r} className="badge bg-primary me-1">
                                {r}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => openEdit(u)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => remove(u.user_id)}
                              disabled={deletingId === u.user_id}
                            >
                              {deletingId === u.user_id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.55)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{form.user_id ? 'Edit User' : 'Create User'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First name</label>
                    <input
                      className="form-control"
                      value={form.first_name}
                      onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last name</label>
                    <input
                      className="form-control"
                      value={form.last_name}
                      onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      type="email"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-control"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Password {form.user_id ? '(leave blank to keep unchanged)' : ''}</label>
                    <input
                      className="form-control"
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      type="password"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Active</label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                        id="u-active"
                      />
                      <label className="form-check-label" htmlFor="u-active">Enabled</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Email verified</label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.email_verified}
                        onChange={(e) => setForm((p) => ({ ...p, email_verified: e.target.checked }))}
                        id="u-verified"
                      />
                      <label className="form-check-label" htmlFor="u-verified">Verified</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Roles</label>
                    <div className="d-flex gap-2 flex-wrap">
                      {roles.length === 0 ? (
                        <span className="text-muted">No roles found.</span>
                      ) : (
                        roles.map((r) => (
                          <div key={r.id} className="form-check me-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={form.roles.includes(r.name)}
                              onChange={() => toggleRole(r.name)}
                              id={`role-${r.id}`}
                            />
                            <label className="form-check-label" htmlFor={`role-${r.id}`}>{r.name}</label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={save} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

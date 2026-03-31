import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getApiBase } from '../../utils/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

const Users = () => {
  const API_BASE = getApiBase();
  const apiPrefix = `${API_BASE}/backend/api/admin`;

  const { refresh: refreshAdminAuth } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [search, setSearch] = useState('');

  const [activeTab, setActiveTab] = useState('users');

  const [userPage, setUserPage] = useState(1);
  const [rolePage, setRolePage] = useState(1);
  const limit = 10;

  const roleAssignedUsers = useMemo(() => {
    return (Array.isArray(users) ? users : []).filter((u) => Array.isArray(u?.roles) && u.roles.length > 0);
  }, [users]);

  const userTotalPages = Math.ceil(roleAssignedUsers.length / limit) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * limit;
    return roleAssignedUsers.slice(start, start + limit);
  }, [roleAssignedUsers, userPage, limit]);

  const roleTotalPages = Math.ceil(roles.length / limit) || 1;
  const paginatedRoles = useMemo(() => {
    const start = (rolePage - 1) * limit;
    return roles.slice(start, start + limit);
  }, [roles, rolePage, limit]);

  useEffect(() => {
    setUserPage(1);
  }, [search]);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [userPickSearch, setUserPickSearch] = useState('');
  const [userPickLoading, setUserPickLoading] = useState(false);
  const [userPickResults, setUserPickResults] = useState([]);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleSaving, setRoleSaving] = useState(false);
  const [roleDeletingId, setRoleDeletingId] = useState(null);
  const [roleForm, setRoleForm] = useState({ id: null, name: '', permissionIds: [] });

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

  const permissionMatrix = useMemo(() => {
    const list = Array.isArray(permissions) ? permissions : [];
    const actionsSet = new Set();
    const modulesSet = new Set();

    const byModuleAction = new Map();
    for (const p of list) {
      const name = String(p?.name || '');
      const idx = name.indexOf('.');
      if (idx <= 0 || idx === name.length - 1) continue;

      const action = name.slice(0, idx).trim();
      const module = name.slice(idx + 1).trim();
      if (!action || !module) continue;

      actionsSet.add(action);
      modulesSet.add(module);

      const key = `${module}::${action}`;
      byModuleAction.set(key, Number(p?.id));
    }

    const preferredActionOrder = ['view', 'add', 'create', 'update', 'edit', 'delete', 'export', 'import', 'approve', 'manage'];
    const actions = Array.from(actionsSet);
    actions.sort((a, b) => {
      const ai = preferredActionOrder.indexOf(a);
      const bi = preferredActionOrder.indexOf(b);
      if (ai !== -1 || bi !== -1) {
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      }
      return a.localeCompare(b);
    });

    const modules = Array.from(modulesSet).sort((a, b) => a.localeCompare(b));

    const getId = (module, action) => {
      const id = byModuleAction.get(`${module}::${action}`);
      const n = Number(id);
      return Number.isFinite(n) && n > 0 ? n : null;
    };

    const modulePermissionIds = (moduleName) => {
      const ids = [];
      for (const action of actions) {
        const id = getId(moduleName, action);
        if (id) ids.push(id);
      }
      return ids;
    };

    const allPermissionIds = list
      .map((x) => Number(x?.id))
      .filter((x) => Number.isFinite(x) && x > 0);

    return { actions, modules, getId, modulePermissionIds, allPermissionIds };
  }, [permissions]);

  const openCreateRole = () => {
    setRoleForm({ id: null, name: '', permissionIds: [] });
    setShowRoleModal(true);
  };

  const openEditRole = async (r) => {
    if (!r?.id) return;
    setRoleSaving(true);
    try {
      const res = await fetch(`${apiPrefix}/get_role_permissions.php?role_id=${encodeURIComponent(String(r.id))}`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await readJsonSafe(res);
      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to load role permissions');
      }
      const ids = Array.isArray(data.permissionIds) ? data.permissionIds.map((x) => Number(x)).filter((x) => Number.isFinite(x) && x > 0) : [];
      setRoleForm({ id: r.id, name: r.name || '', permissionIds: ids });
      setShowRoleModal(true);
    } catch (e) {
      toast.error(e?.message || 'Failed to load role');
    } finally {
      setRoleSaving(false);
    }
  };

  const closeRoleModal = () => {
    if (roleSaving) return;
    setShowRoleModal(false);
  };

  const toggleRolePermission = (permId) => {
    setRoleForm((prev) => {
      const n = Number(permId);
      const has = prev.permissionIds.includes(n);
      return { ...prev, permissionIds: has ? prev.permissionIds.filter((x) => x !== n) : [...prev.permissionIds, n] };
    });
  };

  const saveRole = async () => {
    const name = (roleForm.name || '').trim();
    if (!name) {
      toast.error('Role name is required');
      return;
    }

    setRoleSaving(true);
    try {
      const isEdit = !!roleForm.id;
      const endpoint = isEdit ? 'update_role.php' : 'create_role.php';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = isEdit
        ? { id: roleForm.id, name, permissionIds: roleForm.permissionIds }
        : { name, permissionIds: roleForm.permissionIds };

      const res = await fetch(`${apiPrefix}/${endpoint}`, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await readJsonSafe(res);
      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to save role');
      }

      toast.success(isEdit ? 'Role updated' : 'Role created');
      setShowRoleModal(false);
      await loadRoles();
      await refreshAdminAuth();
    } catch (e) {
      toast.error(e?.message || 'Failed to save role');
    } finally {
      setRoleSaving(false);
    }
  };

  const deleteRole = async (roleId) => {
    if (!roleId) return;
    setRoleDeletingId(roleId);
    try {
      const res = await fetch(`${apiPrefix}/delete_role.php`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: roleId })
      });

      const data = await readJsonSafe(res);
      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to delete role');
      }

      toast.success('Role deleted');
      await loadRoles();
    } catch (e) {
      toast.error(e?.message || 'Failed to delete role');
    } finally {
      setRoleDeletingId(null);
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

  const loadPermissions = async () => {
    const res = await fetch(`${apiPrefix}/get_permissions.php`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await readJsonSafe(res);
    if (!res.ok || data?.status !== 'success') {
      throw new Error(data?.message || 'Failed to load permissions');
    }
    setPermissions(Array.isArray(data.permissions) ? data.permissions : []);
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
      await Promise.all([loadRoles(), loadUsers(), loadPermissions()]);
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
    setUserPickSearch('');
    setUserPickResults([]);
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
    setUserPickSearch('');
    setUserPickResults([]);
  };

  useEffect(() => {
    if (!showModal) return;
    if (form.user_id) return;

    const q = userPickSearch.trim();
    if (q.length < 2) {
      setUserPickResults([]);
      return;
    }

    const t = setTimeout(() => {
      (async () => {
        setUserPickLoading(true);
        try {
          const params = new URLSearchParams();
          params.set('search', q);
          const res = await fetch(`${apiPrefix}/get_users.php?${params.toString()}`, {
            method: 'GET',
            credentials: 'include'
          });
          const data = await readJsonSafe(res);
          if (!res.ok || data?.status !== 'success') {
            throw new Error(data?.message || 'Failed to search users');
          }
          setUserPickResults(Array.isArray(data.users) ? data.users : []);
        } catch (e) {
          setUserPickResults([]);
        } finally {
          setUserPickLoading(false);
        }
      })();
    }, 250);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPickSearch, showModal, form.user_id]);

  const selectExistingUser = (u) => {
    if (!u?.user_id) return;
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
    setUserPickSearch('');
    setUserPickResults([]);
  };

  const toggleRole = (roleName) => {
    setForm((prev) => {
      const has = prev.roles.includes(roleName);
      return { ...prev, roles: has ? prev.roles.filter((r) => r !== roleName) : [...prev.roles, roleName] };
    });
  };

  const validateEmail = (email) => {
    if (!email || !email.includes('@')) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    const localPart = email.split('@')[0];
    if (/^\d+$/.test(localPart)) return false;
    return true;
  };

  const validatePhone = (phone) => {
    if (!phone) return true;
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const save = async () => {
    if (!form.email || !validateEmail(form.email)) {
      toast.error('Please enter a valid email address. Numeric-only emails are not allowed.');
      return;
    }
    if (form.phone && !validatePhone(form.phone)) {
      toast.error('Phone number must be exactly 10 digits.');
      return;
    }
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
          {activeTab === 'users' && (
            <>
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
            </>
          )}
          {activeTab === 'roles' && (
            <button type="button" className="btn btn-success" onClick={openCreateRole}>
              + Create Role
            </button>
          )}
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Roles
          </button>
        </li>
      </ul>

      {activeTab === 'users' && (
        <div className="card shadow-sm">
          <div className="card-body">
            {loading ? (
              <div className="text-muted">Loading...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 70 }}>SR.NO</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th style={{ width: 140 }}>Active</th>
                      <th style={{ width: 160 }}>Verified</th>
                      <th>Roles</th>
                      <th style={{ width: 220 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center text-muted py-4">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((u, idx) => (
                        <tr key={u.user_id}>
                          <td>{(userPage - 1) * limit + idx + 1}</td>
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
            {!loading && paginatedUsers.length > 0 && userTotalPages > 1 && (
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
                <div className="text-muted small">
                  Page {userPage} of {userTotalPages}
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    disabled={userPage <= 1}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                    disabled={userPage >= userTotalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="card shadow-sm">
          <div className="card-body">
            {loading ? (
              <div className="text-muted">Loading...</div>
            ) : roles.length === 0 ? (
              <div className="text-muted">No roles found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 70 }}>SR.NO</th>
                      <th>Role</th>
                      <th style={{ width: 240 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRoles.map((r, idx) => (
                      <tr key={r.id}>
                        <td>{(rolePage - 1) * limit + idx + 1}</td>
                        <td className="fw-semibold">{r.name}</td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openEditRole(r)}
                              disabled={roleSaving}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteRole(r.id)}
                              disabled={roleDeletingId === r.id}
                            >
                              {roleDeletingId === r.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!loading && paginatedRoles.length > 0 && roleTotalPages > 1 && (
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
                <div className="text-muted small">
                  Page {rolePage} of {roleTotalPages}
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setRolePage((p) => Math.max(1, p - 1))}
                    disabled={rolePage <= 1}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setRolePage((p) => Math.min(roleTotalPages, p + 1))}
                    disabled={rolePage >= roleTotalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                  {!form.user_id && (
                    <div className="col-12">
                      <label className="form-label">Find existing customer/user</label>
                      <input
                        className="form-control"
                        placeholder="Search by name or email..."
                        value={userPickSearch}
                        onChange={(e) => setUserPickSearch(e.target.value)}
                      />

                      {(userPickLoading || userPickResults.length > 0) && (
                        <div className="border rounded mt-2" style={{ maxHeight: 220, overflow: 'auto' }}>
                          {userPickLoading ? (
                            <div className="p-2 text-muted">Searching...</div>
                          ) : (
                            <div className="list-group list-group-flush">
                              {userPickResults.map((u) => {
                                const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim();
                                return (
                                  <button
                                    key={u.user_id}
                                    type="button"
                                    className="list-group-item list-group-item-action"
                                    onClick={() => selectExistingUser(u)}
                                  >
                                    <div className="fw-semibold">{fullName || '—'}</div>
                                    <div className="text-muted small">{u.email}</div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-muted small mt-1">Select a user to assign roles, or fill the form below to create a new user.</div>
                    </div>
                  )}
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

      {showRoleModal && (
        <div className="modal d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.55)' }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{roleForm.id ? 'Edit Role' : 'Create Role'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeRoleModal} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12 col-lg-4">
                    <label className="form-label">Role name</label>
                    <input
                      className="form-control"
                      value={roleForm.name}
                      onChange={(e) => setRoleForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. product_manager"
                    />
                    <div className="text-muted small mt-2">Assign permissions to control admin actions.</div>
                  </div>

                  <div className="col-12 col-lg-8">
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-2">
                      <div className="fw-semibold">Permissions</div>
                      <div className="text-muted small">Selected: {roleForm.permissionIds.length}</div>
                    </div>
                    <div className="border rounded p-2" style={{ maxHeight: 520, overflow: 'auto' }}>
                      {permissions.length === 0 ? (
                        <div className="text-muted">No permissions found.</div>
                      ) : permissionMatrix.modules.length === 0 || permissionMatrix.actions.length === 0 ? (
                        <div className="text-muted">No valid permission names found (expected format like add.product).</div>
                      ) : (
                        <>
                          <div className="d-flex gap-2 flex-wrap mb-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                setRoleForm((p) => ({
                                  ...p,
                                  permissionIds: permissionMatrix.allPermissionIds
                                }))
                              }
                              disabled={roleSaving}
                            >
                              Select all
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => setRoleForm((p) => ({ ...p, permissionIds: [] }))}
                              disabled={roleSaving}
                            >
                              Clear
                            </button>
                          </div>

                          <div className="table-responsive">
                            <table className="table table-sm table-bordered align-middle mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th style={{ minWidth: 160 }}>Module</th>
                                  <th style={{ width: 120 }}>All</th>
                                  {permissionMatrix.actions.map((a) => (
                                    <th key={a} style={{ minWidth: 110 }}>
                                      {a}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {permissionMatrix.modules.map((m) => {
                                  const ids = permissionMatrix.modulePermissionIds(m);
                                  const selectedCount = ids.filter((id) => roleForm.permissionIds.includes(id)).length;
                                  const allSelected = ids.length > 0 && selectedCount === ids.length;

                                  return (
                                    <tr key={m}>
                                      <td className="fw-semibold">{m}</td>
                                      <td>
                                        <div className="form-check mb-0">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={() => {
                                              setRoleForm((p) => {
                                                const current = Array.isArray(p.permissionIds) ? p.permissionIds : [];
                                                if (allSelected) {
                                                  return { ...p, permissionIds: current.filter((x) => !ids.includes(x)) };
                                                }
                                                return { ...p, permissionIds: Array.from(new Set([...current, ...ids])) };
                                              });
                                            }}
                                            disabled={roleSaving}
                                            id={`mod-${m}`}
                                          />
                                          <label className="form-check-label" htmlFor={`mod-${m}`}>
                                            {selectedCount}/{ids.length}
                                          </label>
                                        </div>
                                      </td>
                                      {permissionMatrix.actions.map((a) => {
                                        const id = permissionMatrix.getId(m, a);
                                        if (!id) return <td key={`${m}-${a}`} />;

                                        const checked = roleForm.permissionIds.includes(id);
                                        return (
                                          <td key={`${m}-${a}`}>
                                            <div className="form-check mb-0">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleRolePermission(id)}
                                                disabled={roleSaving}
                                                id={`perm-${id}`}
                                              />
                                            </div>
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={closeRoleModal} disabled={roleSaving}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={saveRole} disabled={roleSaving}>
                  {roleSaving ? 'Saving...' : 'Save'}
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

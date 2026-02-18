import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getApiBase } from '../utils/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isLoggedIn) {
      setAdminUser(null);
      setPermissions([]);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const API_BASE = getApiBase();
      const res = await fetch(`${API_BASE}/backend/api/admin/me.php`, {
        method: 'GET',
        credentials: 'include'
      });
      const text = await res.text();

      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error('Invalid server response');
      }

      if (!res.ok || !data?.success) {
        setAdminUser(null);
        setPermissions([]);
        throw new Error(data?.message || 'Unauthorized');
      }

      const u = data?.data?.user || null;
      const p = Array.isArray(data?.data?.permissions) ? data.data.permissions : [];

      setAdminUser(u);
      setPermissions(p);
    } catch (e) {
      setError(e?.message || 'Failed to load admin session');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e && e.key && e.key !== 'isAdminLoggedIn') return;
      refresh();
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };

    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refresh]);

  const hasPermission = useCallback(
    (perm) => {
      if (!perm) return false;
      return permissions.includes(String(perm));
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (perms) => {
      if (!Array.isArray(perms) || perms.length === 0) return false;
      return perms.some((p) => permissions.includes(String(p)));
    },
    [permissions]
  );

  const value = useMemo(
    () => ({
      loading,
      adminUser,
      permissions,
      error,
      refresh,
      hasPermission,
      hasAnyPermission
    }),
    [loading, adminUser, permissions, error, refresh, hasPermission, hasAnyPermission]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
};

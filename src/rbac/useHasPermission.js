import { useMemo } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const useHasPermission = (permission) => {
  const { permissions } = useAdminAuth();
  return useMemo(() => {
    if (!permission) return false;
    return Array.isArray(permissions) && permissions.includes(String(permission));
  }, [permissions, permission]);
};

export const useHasAnyPermission = (permissionList) => {
  const { permissions } = useAdminAuth();
  return useMemo(() => {
    if (!Array.isArray(permissionList) || permissionList.length === 0) return false;
    if (!Array.isArray(permissions) || permissions.length === 0) return false;
    return permissionList.some((p) => permissions.includes(String(p)));
  }, [permissions, permissionList]);
};

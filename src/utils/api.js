export const getApiBase = () => {
  const envBase = process.env.REACT_APP_API_BASE;

  if (envBase) {
    const trimmed = String(envBase).replace(/\/+$/, '');
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (typeof window !== 'undefined') return `${window.location.origin}${trimmed}`.replace(/\/+$/, '');
    return trimmed;
  }

  if (typeof window === 'undefined') return 'http://localhost';

  if (window.location.port === '3000') {
    return process.env.REACT_APP_API_BASE;
  }

  const origin = window.location.origin;
  const publicUrl = process.env.PUBLIC_URL;

  if (publicUrl) {
    try {
      const u = new URL(publicUrl, origin);
      const basePath = (u.pathname || '').replace(/\/+$/, '');
      return `${origin}${basePath}`.replace(/\/+$/, '');
    } catch (e) {
      const basePath = String(publicUrl).replace(/\/+$/, '');
      return `${origin}${basePath}`.replace(/\/+$/, '');
    }
  }

  const path = window.location.pathname || '/';
  const idx = path.toLowerCase().indexOf('/admin');
  const basePath = idx >= 0 ? path.slice(0, idx) : '';
  return `${origin}${basePath}`.replace(/\/+$/, '');
};

export const apiUrl = (path) => {
  const base = getApiBase();
  if (!path) return base;

  const p = String(path).startsWith('/') ? String(path) : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
};

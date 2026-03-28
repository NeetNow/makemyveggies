export const getApiBase = () => {
  const envBaseRaw = process.env.REACT_APP_API_BASE;

  // Prefer explicit env configuration.
  // Supports:
  // - Absolute URL: https://example.com
  // - Absolute/relative path: /myapp or myapp (resolved against window.location.origin)
  if (envBaseRaw) {
    const trimmed = String(envBaseRaw).trim().replace(/\/+$/, '');
    if (trimmed) {
      if (/^https?:\/\//i.test(trimmed)) return trimmed;
      if (typeof window !== 'undefined') {
        const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
        return `${window.location.origin}${path}`.replace(/\/+$/, '');
      }
      return trimmed;
    }
  }

  // SSR / tests fallback
  if (typeof window === 'undefined') return 'http://localhost';

  // Local CRA dev server: use relative URLs + proxy.
  // Returning '' ensures callers can do `${API_BASE}/backend/...` safely.
  if (window.location.hostname === 'localhost' && window.location.port === '3000') {
    return 'http://localhost';
  }

  const origin = window.location.origin;
  const publicUrlRaw = process.env.PUBLIC_URL;

  // In production, PUBLIC_URL can represent a sub-path where the app is hosted.
  if (publicUrlRaw) {
    const cleaned = String(publicUrlRaw).trim();
    if (cleaned) {
      try {
        const u = new URL(cleaned, origin);
        const basePath = (u.pathname || '').replace(/\/+$/, '');
        return `${origin}${basePath}`.replace(/\/+$/, '');
      } catch (e) {
        const basePath = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
        return `${origin}${basePath}`.replace(/\/+$/, '');
      }
    }
  }

  return origin.replace(/\/+$/, '');
};

export const apiUrl = (path) => {
  const base = getApiBase();
  if (!path) return base;

  const p = String(path).startsWith('/') ? String(path) : `/${path}`;
  if (!base) return p;
  return `${String(base).replace(/\/+$/, '')}${p}`;
};

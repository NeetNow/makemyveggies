import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Gauge, Box, Receipt, Users, FileText, Tag, LineChart, Search, UserCog, CreditCard } from 'lucide-react';
import '../../styles/Admin.css';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { getApiBase } from '../../utils/api';

const AdminLayout = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { permissions, adminUser, loading: adminLoading } = useAdminAuth();

  const API_BASE = getApiBase();
  const apiPrefix = `${API_BASE}/backend/api/admin`;

  const closeMobileMenu = () => setMobileOpen(false);

  const isProductsRoute = location.pathname.startsWith('/admin/products');

  const isSuperAdmin = Array.isArray(adminUser?.roles) && adminUser.roles.includes('super_admin');

  const hasAny = (permissionList) => {
    if (isSuperAdmin) return true;
    const list = Array.isArray(permissions) ? permissions : [];
    if (!Array.isArray(permissionList) || permissionList.length === 0) return false;
    return permissionList.some((p) => list.includes(String(p)));
  };

  const canSeeProducts = hasAny(['view.product', 'add.product', 'update.product', 'delete.product']);
  const canSeeOrders = hasAny(['view.order', 'add.order', 'update.order', 'delete.order']);
  const canSeeCustomers = hasAny(['view.customer', 'view.user']);
  const canSeeUsers = hasAny(['view.user', 'view.role', 'view.permission', 'manage.user', 'manage.role', 'manage.permission']);
  const canSeeCategories = hasAny(['view.category', 'add.category', 'update.category', 'delete.category']);
  const canSeeNewsletter = hasAny(['view.newsletter', 'add.newsletter', 'update.newsletter', 'delete.newsletter']);
  const canSeeContact = hasAny(['view.contact', 'add.contact', 'update.contact', 'delete.contact']);
  const canSeeDiscounts = hasAny(['view.discount', 'add.discount', 'update.discount', 'delete.discount']);
  const canSeeAnalytics = hasAny(['view.analytics']);
  const canSeePayments = hasAny(['view.payments']);

  const [topSearch, setTopSearch] = useState('');
  const [topSearchOpen, setTopSearchOpen] = useState(false);
  const [topSearchLoading, setTopSearchLoading] = useState(false);
  const [topSearchResults, setTopSearchResults] = useState([]);
  const topSearchWrapRef = useRef(null);

  const readJsonSafe = async (response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch (e) {
      const preview = text?.slice(0, 200) || '';
      throw new Error(`Invalid server response. ${preview}`);
    }
  };

  const canUseTopSearch = useMemo(() => {
    return canSeeProducts || canSeeOrders || canSeeCustomers || canSeeCategories;
  }, [canSeeCategories, canSeeCustomers, canSeeOrders, canSeeProducts]);

  useEffect(() => {
    if (!topSearchOpen) return;
    const onDocDown = (e) => {
      const el = topSearchWrapRef.current;
      if (!el) return;
      if (el.contains(e.target)) return;
      setTopSearchOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [topSearchOpen]);

  useEffect(() => {
    const q = topSearch.trim();
    if (!canUseTopSearch) return;
    if (q.length < 2) {
      setTopSearchResults([]);
      setTopSearchLoading(false);
      return;
    }

    const t = setTimeout(() => {
      (async () => {
        setTopSearchLoading(true);
        try {
          const results = [];

          if (canSeeProducts) {
            try {
              const params = new URLSearchParams();
              params.set('search', q);
              params.set('limit', '5');
              params.set('offset', '0');
              const res = await fetch(`${apiPrefix}/get_products.php?${params.toString()}`, {
                method: 'GET',
                credentials: 'include'
              });
              const data = await readJsonSafe(res);
              if (res.ok && data?.status === 'success' && Array.isArray(data.products)) {
                for (const p of data.products) {
                  results.push({
                    type: 'product',
                    id: p.id,
                    title: p.title || `Product #${p.id}`,
                    subtitle: p.sku ? `SKU: ${p.sku}` : (p.categoryName ? String(p.categoryName) : ''),
                    meta: p
                  });
                }
              }
            } catch (e) {
              // ignore
            }
          }

          if (canSeeCategories) {
            try {
              const res = await fetch(`${apiPrefix}/get_categories.php`, {
                method: 'GET',
                credentials: 'include'
              });
              const data = await readJsonSafe(res);
              if (res.ok && data?.status === 'success' && Array.isArray(data.categories)) {
                const q2 = q.toLowerCase();
                const matches = data.categories
                  .filter((c) => {
                    const hay = [c?.name, c?.description]
                      .filter(Boolean)
                      .map((v) => String(v).toLowerCase())
                      .join(' ');
                    return hay.includes(q2);
                  })
                  .slice(0, 5);

                for (const c of matches) {
                  results.push({
                    type: 'category',
                    id: c.id,
                    title: c.name || `Category #${c.id}`,
                    subtitle: c.productCount ? `${c.productCount} products` : '',
                    meta: c
                  });
                }
              }
            } catch (e) {
              // ignore
            }
          }

          if (canSeeOrders) {
            try {
              const params = new URLSearchParams();
              params.set('search', q);
              params.set('limit', '5');
              params.set('offset', '0');
              const res = await fetch(`${apiPrefix}/get_orders.php?${params.toString()}`, {
                method: 'GET',
                credentials: 'include'
              });
              const data = await readJsonSafe(res);
              if (res.ok && data?.status === 'success' && Array.isArray(data.orders)) {
                for (const o of data.orders) {
                  results.push({
                    type: 'order',
                    id: o.id,
                    title: o.orderNumber ? `#${o.orderNumber}` : `Order #${o.id}`,
                    subtitle: o.customerName ? String(o.customerName) : '',
                    meta: o
                  });
                }
              }
            } catch (e) {
              // ignore
            }
          }

          if (canSeeCustomers) {
            try {
              const params = new URLSearchParams();
              params.set('search', q);
              const res = await fetch(`${apiPrefix}/get_users.php?${params.toString()}`, {
                method: 'GET',
                credentials: 'include'
              });
              const data = await readJsonSafe(res);
              if (res.ok && data?.status === 'success' && Array.isArray(data.users)) {
                const onlyCustomers = data.users.filter((u) => !Array.isArray(u?.roles) || u.roles.length === 0);
                for (const u of onlyCustomers.slice(0, 5)) {
                  const name = `${u.first_name || ''} ${u.last_name || ''}`.trim() || '—';
                  results.push({
                    type: 'customer',
                    id: u.user_id,
                    title: name,
                    subtitle: u.email || '',
                    meta: u
                  });
                }
              }
            } catch (e) {
              // ignore
            }
          }

          setTopSearchResults(results);
        } finally {
          setTopSearchLoading(false);
        }
      })();
    }, 300);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topSearch, canUseTopSearch, canSeeProducts, canSeeOrders, canSeeCustomers, apiPrefix]);

  const onSelectTopSearch = (item) => {
    if (!item) return;
    setTopSearchOpen(false);

    if (item.type === 'order') {
      navigate(`/admin/orders/${encodeURIComponent(String(item.id))}`);
      return;
    }

    if (item.type === 'customer') {
      navigate(`/admin/customers`);
      return;
    }

    if (item.type === 'product') {
      navigate(`/admin/products/diy-kits`);
      return;
    }

    if (item.type === 'category') {
      navigate(`/admin/categories`);
    }
  };

  useEffect(() => {
    setIsProductsOpen(isProductsRoute);
  }, [isProductsRoute]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const logout = () => {
    try {
      localStorage.removeItem('isAdminLoggedIn');
      document.cookie = 'admin_auth_token=; Max-Age=0; path=/; samesite=lax';
    } catch (e) {
      // ignore
    }
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className={`admin-layout d-flex ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
      {mobileOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className="admin-sidebar bg-dark text-white d-flex flex-column" aria-label="Admin navigation">
        <div className="admin-sidebar-header d-flex align-items-center justify-content-between px-3 py-2">
          <div className="d-flex flex-column sidebar-brand-wrap">
            <span className="admin-brand">MMV</span>
            <small className="text-muted-50 sidebar-brand-sub">Admin</small>
          </div>
        </div>

        <div className="admin-sidebar-menu flex-grow-1 mt-3 px-2">
          <div className="admin-menu-section-title px-2 mb-1">GENERAL</div>
          <nav className="nav flex-column">
            {adminLoading && (
              <div className="px-2 py-2 text-muted small">Loading permissions...</div>
            )}
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
              onClick={() => {
                setIsProductsOpen(false);
                closeMobileMenu();
              }}
            >
              <span className="sidebar-icon me-2"><Gauge size={16} /></span>
              <span className="sidebar-text">Dashboard</span>
            </NavLink>
            {canSeeProducts && (
              <>
                <button
                  type="button"
                  className={`nav-link text-white d-flex align-items-center ${isProductsRoute ? 'active' : ''}`}
                  onClick={() => setIsProductsOpen((prev) => !prev)}
                  style={{ background: 'transparent', border: 0, width: '100%', textAlign: 'left' }}
                >
                  <span className="sidebar-icon me-2"><Box size={16} /></span>
                  <span className="sidebar-text">Products</span>
                </button>
                {isProductsOpen && (
                  <>
                    <NavLink
                      to="/admin/products/diy-kits"
                      className={({ isActive }) =>
                        `nav-link text-white d-flex align-items-center sidebar-sub-link ${isActive ? 'active' : ''}`
                      }
                      onClick={closeMobileMenu}
                    >
                      <span className="sidebar-icon me-2">•</span>
                      <span className="sidebar-text">DIY Kits</span>
                    </NavLink>
                    <NavLink
                      to="/admin/products/supplements"
                      className={({ isActive }) =>
                        `nav-link text-white d-flex align-items-center sidebar-sub-link ${isActive ? 'active' : ''}`
                      }
                      onClick={closeMobileMenu}
                    >
                      <span className="sidebar-icon me-2">•</span>
                      <span className="sidebar-text">Supplements</span>
                    </NavLink>
                  </>
                )}
              </>
            )}

            {canSeeOrders && (
              <NavLink
                to="/admin/orders"
                className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setIsProductsOpen(false);
                  closeMobileMenu();
                }}
              >
                <span className="sidebar-icon me-2"><Receipt size={16} /></span>
                <span className="sidebar-text">Orders</span>
              </NavLink>
            )}

            {canSeePayments && (
              <NavLink
                to="/admin/payments"
                className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setIsProductsOpen(false);
                  closeMobileMenu();
                }}
              >
                <span className="sidebar-icon me-2"><CreditCard size={16} /></span>
                <span className="sidebar-text">Payments</span>
              </NavLink>
            )}
            {canSeeCustomers && (
              <NavLink
                to="/admin/customers"
                className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setIsProductsOpen(false);
                  closeMobileMenu();
                }}
              >
                <span className="sidebar-icon me-2"><Users size={16} /></span>
                <span className="sidebar-text">Customers</span>
              </NavLink>
            )}
            {canSeeUsers && (
              <NavLink
                to="/admin/users"
                className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setIsProductsOpen(false);
                  closeMobileMenu();
                }}
              >
                <span className="sidebar-icon me-2"><UserCog size={16} /></span>
                <span className="sidebar-text">Users</span>
              </NavLink>
            )}

            {canSeeCategories && (
              <NavLink
                to="/admin/categories"
                className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setIsProductsOpen(false);
                  closeMobileMenu();
                }}
              >
                <span className="sidebar-icon me-2"><Tag size={16} /></span>
                <span className="sidebar-text">Categories</span>
              </NavLink>
            )}
            
            {canSeeNewsletter && (
              <NavLink
                to="/admin/newsletter"
                className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setIsProductsOpen(false);
                  closeMobileMenu();
                }}
              >
                <span className="sidebar-icon me-2"><FileText size={16} /></span>
                <span className="sidebar-text">Newsletter</span>
              </NavLink>
            )}
            {canSeeContact && (
              <NavLink
                to="/admin/contact-messages"
                className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setIsProductsOpen(false);
                  closeMobileMenu();
                }}
              >
                <span className="sidebar-icon me-2"><FileText size={16} /></span>
                <span className="sidebar-text">Contact</span>
              </NavLink>
            )}
            {canSeeDiscounts && (
              <NavLink
                to="/admin/discounts"
                className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setIsProductsOpen(false);
                  closeMobileMenu();
                }}
              >
                <span className="sidebar-icon me-2"><Tag size={16} /></span>
                <span className="sidebar-text">Discounts</span>
              </NavLink>
            )}
            {canSeeAnalytics && (
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setIsProductsOpen(false);
                  closeMobileMenu();
                }}
              >
                <span className="sidebar-icon me-2"><LineChart size={16} /></span>
                <span className="sidebar-text">Analytics</span>
              </NavLink>
            )}
          </nav>
        </div>

        <div className="admin-sidebar-footer mt-auto px-3 py-2 small text-muted d-flex align-items-center justify-content-between gap-2">
          <span className="sidebar-text">Logged in as Admin</span>
          <button type="button" className="btn btn-sm btn-outline-light" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main d-flex flex-column flex-grow-1">
        <header className="admin-topnav d-flex align-items-center justify-content-between px-4">
          <div className="d-flex flex-column">
            <span className="topnav-welcome">WELCOME!</span>
            <small className="text-muted">Here is your analytics dashboard.</small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary admin-mobile-menu-btn"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Open menu"
            >
              ☰
            </button>
            {canUseTopSearch && (
              <div ref={topSearchWrapRef} className="position-relative d-none d-md-block">
                <div
                  className="topnav-search d-flex align-items-center bg-white border"
                  style={{ height: 36, borderRadius: 10, width: 360 }}
                >
                  <span className="ms-3 me-2 text-muted d-flex align-items-center">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-sm border-0"
                    placeholder="Search..."
                    value={topSearch}
                    onChange={(e) => {
                      setTopSearch(e.target.value);
                      setTopSearchOpen(true);
                    }}
                    onFocus={() => setTopSearchOpen(true)}
                    style={{ boxShadow: 'none', height: 34 }}
                  />
                </div>

                {topSearchOpen && (topSearchLoading || topSearchResults.length > 0) && (
                  <div
                    className="dropdown-menu show mt-2 p-0"
                    style={{
                      width: 360,
                      maxHeight: 360,
                      overflow: 'auto'
                    }}
                  >
                    {topSearchLoading ? (
                      <div className="px-3 py-2 text-muted small">Searching...</div>
                    ) : (
                      <>
                        {topSearchResults.map((r) => (
                          <button
                            key={`${r.type}-${r.id}`}
                            type="button"
                            className="dropdown-item"
                            onClick={() => onSelectTopSearch(r)}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="fw-semibold" style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {r.title}
                              </div>
                              <span className="badge bg-light text-dark text-uppercase">{r.type}</span>
                            </div>
                            {r.subtitle ? <div className="text-muted small">{r.subtitle}</div> : null}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
        <main className="admin-content flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

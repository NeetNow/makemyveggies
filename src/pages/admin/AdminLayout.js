import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Gauge, Box, Receipt, Users, FileText, Tag, LineChart, Search, UserCog, CreditCard } from 'lucide-react';
import '../../styles/Admin.css';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { permissions, adminUser } = useAdminAuth();

  const closeMobileMenu = () => setMobileOpen(false);

  const isProductsRoute = location.pathname.startsWith('/admin/products');

  const isSuperAdmin = Array.isArray(adminUser?.roles) && adminUser.roles.includes('super_admin');

  const canSeeModule = (moduleName) => {
    if (isSuperAdmin) return true;
    if (!moduleName) return false;
    const list = Array.isArray(permissions) ? permissions : [];
    return list.some((p) => String(p || '').endsWith(`.${moduleName}`));
  };

  const canSeeProducts = canSeeModule('product');
  const canSeeOrders = canSeeModule('order');
  const canSeeUsers = canSeeModule('user') || canSeeModule('role') || canSeeModule('permission');
  const canSeeCategories = canSeeModule('category');

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
    <div className={`admin-layout d-flex ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
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
          <button
            type="button"
            className="btn btn-sm btn-outline-light sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>

        <div className="admin-sidebar-menu flex-grow-1 mt-3 px-2">
          <div className="admin-menu-section-title px-2 mb-1">GENERAL</div>
          <nav className="nav flex-column">
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
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={logout}>
              Logout
            </button>
            <div className="topnav-search d-none d-md-flex align-items-center px-3 py-1 rounded-pill bg-white border">
              <span className="me-2 text-muted d-flex align-items-center">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control form-control-sm border-0 bg-transparent"
                placeholder="Search..."
              />
            </div>
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

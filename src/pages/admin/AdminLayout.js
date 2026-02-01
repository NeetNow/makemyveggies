import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Gauge, Box, Receipt, Users, FileText, Tag, LineChart, Search } from 'lucide-react';
import '../../styles/Admin.css';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const location = useLocation();

  const isProductsRoute = location.pathname.startsWith('/admin/products');

  useEffect(() => {
    setIsProductsOpen(isProductsRoute);
  }, [isProductsRoute]);

  const pageMeta = useMemo(() => {
    const path = location.pathname;

    if (path === '/admin' || path === '/admin/') {
      return { title: 'Dashboard', subtitle: 'Overview & analytics' };
    }
    if (path.startsWith('/admin/products/diy-kits')) {
      return { title: 'DIY Kits', subtitle: 'Manage DIY kit products' };
    }
    if (path.startsWith('/admin/products/supplements')) {
      return { title: 'Supplements', subtitle: 'Manage supplement products' };
    }
    if (path.startsWith('/admin/products')) {
      return { title: 'Products', subtitle: 'Manage your product catalog' };
    }
    if (path.startsWith('/admin/orders')) {
      return { title: 'Orders', subtitle: 'Track and manage customer orders' };
    }
    if (path.startsWith('/admin/customers')) {
      return { title: 'Customers', subtitle: 'Customer list & details' };
    }
    if (path.startsWith('/admin/categories')) {
      return { title: 'Categories', subtitle: 'Organize products by category' };
    }
    if (path.startsWith('/admin/content')) {
      return { title: 'Content', subtitle: 'Manage website content' };
    }
    if (path.startsWith('/admin/newsletter')) {
      return { title: 'Newsletter', subtitle: 'Manage subscribers & campaigns' };
    }
    if (path.startsWith('/admin/discounts')) {
      return { title: 'Discounts', subtitle: 'Offers, promotions & coupons' };
    }
    if (path.startsWith('/admin/analytics')) {
      return { title: 'Analytics', subtitle: 'Sales and performance insights' };
    }

    return { title: 'Admin', subtitle: 'Manage your store' };
  }, [location.pathname]);

  return (
    <div className={`admin-layout d-flex ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="admin-sidebar bg-dark text-white d-flex flex-column">
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
              onClick={() => setIsProductsOpen(false)}
            >
              <span className="sidebar-icon me-2"><Gauge size={16} /></span>
              <span className="sidebar-text">Dashboard</span>
            </NavLink>
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
                >
                  <span className="sidebar-icon me-2">•</span>
                  <span className="sidebar-text">DIY Kits</span>
                </NavLink>
                <NavLink
                  to="/admin/products/supplements"
                  className={({ isActive }) =>
                    `nav-link text-white d-flex align-items-center sidebar-sub-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="sidebar-icon me-2">•</span>
                  <span className="sidebar-text">Supplements</span>
                </NavLink>
              </>
            )}
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
              onClick={() => setIsProductsOpen(false)}
            >
              <span className="sidebar-icon me-2"><Receipt size={16} /></span>
              <span className="sidebar-text">Orders</span>
            </NavLink>
            <NavLink
              to="/admin/customers"
              className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
              onClick={() => setIsProductsOpen(false)}
            >
              <span className="sidebar-icon me-2"><Users size={16} /></span>
              <span className="sidebar-text">Customers</span>
            </NavLink>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
              onClick={() => setIsProductsOpen(false)}
            >
              <span className="sidebar-icon me-2"><Tag size={16} /></span>
              <span className="sidebar-text">Categories</span>
            </NavLink>
            <NavLink
              to="/admin/content"
              className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
              onClick={() => setIsProductsOpen(false)}
            >
              <span className="sidebar-icon me-2"><FileText size={16} /></span>
              <span className="sidebar-text">Content</span>
            </NavLink>
            <NavLink
              to="/admin/newsletter"
              className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
              onClick={() => setIsProductsOpen(false)}
            >
              <span className="sidebar-icon me-2"><FileText size={16} /></span>
              <span className="sidebar-text">Newsletter</span>
            </NavLink>
            <NavLink
              to="/admin/discounts"
              className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
              onClick={() => setIsProductsOpen(false)}
            >
              <span className="sidebar-icon me-2"><Tag size={16} /></span>
              <span className="sidebar-text">Discounts</span>
            </NavLink>
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`}
              onClick={() => setIsProductsOpen(false)}
            >
              <span className="sidebar-icon me-2"><LineChart size={16} /></span>
              <span className="sidebar-text">Analytics</span>
            </NavLink>
          </nav>
        </div>

        <div className="admin-sidebar-footer mt-auto px-3 py-2 small text-muted">
          <span className="sidebar-text">Logged in as Admin</span>
        </div>
      </aside>

      <div className="admin-main d-flex flex-column flex-grow-1">
        <header className="admin-topnav d-flex align-items-center justify-content-between px-4">
          <div className="d-flex flex-column">
            <span className="topnav-welcome">{pageMeta.title}</span>
            <small className="text-muted">{pageMeta.subtitle}</small>
          </div>
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
        </header>
        <main className="admin-content flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

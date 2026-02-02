import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'fa-solid fa-gauge-high' },
    { path: '/admin/orders', label: 'Orders', icon: 'fa-solid fa-box' },
    { path: '/admin/products', label: 'Products', icon: 'fa-solid fa-seedling' },
    { path: '/admin/customers', label: 'Customers', icon: 'fa-solid fa-users' },
    { path: '/admin/settings', label: 'Settings', icon: 'fa-solid fa-gear' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="admin-layout d-flex"
      style={{ minHeight: '100vh', backgroundColor: '#eef2f6' }}
    >
      {/* Sidebar */}
      <aside
        className="admin-sidebar bg-white shadow-sm d-flex flex-column"
        style={{ width: '260px' }}
      >
        <div className="admin-sidebar__header p-3 border-bottom">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <img
              src="/assets/img/logo/logo.png"
              alt="Make My Veggies Admin"
              style={{ maxHeight: '40px' }}
            />
          </Link>
          <p className="mt-2 mb-0 small text-muted">Admin Panel</p>
        </div>
        <nav className="admin-sidebar__nav p-2">
          <ul className="list-unstyled mb-0">
            {menuItems.map((item) => (
              <li key={item.path} className="mb-1">
                <Link
                  to={item.path}
                  className={`d-flex align-items-center px-3 py-2 rounded-3 text-decoration-none ${
                    isActive(item.path) ? 'bg-success text-white' : 'text-dark'
                  }`}
                >
                  <i className={`${item.icon} me-2`} />
                  <span className="small fw-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="admin-main flex-grow-1 d-flex flex-column">
        <header className="admin-main__header bg-white shadow-sm py-3">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">Admin Dashboard</h5>
                <p className="mb-0 small text-muted">
                  Manage products, orders, customers and settings from one place.
                </p>
              </div>
              <div className="d-flex align-items-center gap-3">
                <Link to="/" className="small text-decoration-none text-muted">
                  &larr; Back to website
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main
          className="admin-main__content flex-grow-1 py-4"
          style={{ overflowY: 'auto' }}
        >
          <div className="container-fluid">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

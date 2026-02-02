import React from 'react';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard-page padding-block">
        <div className="row">
          <div className="col-12">
            <div className="section__header">
              <h2>Admin Dashboard</h2>
              <p>Welcome to the Make My Veggies admin panel.</p>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-md-4">
            <div className="admin-card">
              <h5>Total Orders</h5>
              <p className="admin-card-number">0</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="admin-card">
              <h5>Total Customers</h5>
              <p className="admin-card-number">0</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="admin-card">
              <h5>Total Products</h5>
              <p className="admin-card-number">0</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

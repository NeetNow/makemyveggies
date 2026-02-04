import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost/git_mmv/git_pr/makemyveggies';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [sales7, setSales7] = useState([]);

  const readJsonSafe = async (response) => {
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      const preview = text?.slice(0, 200) || '';
      throw new Error(`Invalid server response. ${preview}`);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/backend/api/admin/dashboard_stats.php`, {
          method: 'GET',
          credentials: 'include'
        });

        const data = await readJsonSafe(res);

        if (!res.ok || data?.status !== 'success') {
          throw new Error(data?.message || 'Failed to load dashboard');
        }

        setStats(data.stats || null);
        setRecentOrders(Array.isArray(data.recentOrders) ? data.recentOrders : []);
        setSales7(Array.isArray(data.salesLast7Days) ? data.salesLast7Days : []);
      } catch (e) {
        setError(e?.message || 'Failed to load dashboard');
        toast.error(e?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const revenueFmt = useMemo(() => {
    return (v) => `₹${Number(v || 0).toFixed(2)}`;
  }, []);

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-md-3 mb-3 card-animate">
          <div className="card shadow-sm stat-card stat-card--primary">
            <div className="card-body py-3">
              <h6 className="text-muted mb-1">Total Orders</h6>
              <h3 className="mb-0 stat-value">{loading ? '—' : stats?.ordersTotal ?? 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3 card-animate">
          <div className="card shadow-sm stat-card stat-card--warning">
            <div className="card-body py-3">
              <h6 className="text-muted mb-1">Revenue</h6>
              <h3 className="mb-0 stat-value">{loading ? '—' : revenueFmt(stats?.paidRevenueTotal)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3 card-animate">
          <div className="card shadow-sm stat-card stat-card--info">
            <div className="card-body py-3">
              <h6 className="text-muted mb-1">Products</h6>
              <h3 className="mb-0 stat-value">{loading ? '—' : stats?.productsTotal ?? 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3 card-animate">
          <div className="card shadow-sm stat-card stat-card--danger">
            <div className="card-body py-3">
              <h6 className="text-muted mb-1">Customers</h6>
              <h3 className="mb-0 stat-value">{loading ? '—' : stats?.customersTotal ?? 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Sales Overview</h5>
              {loading ? (
                <p className="text-muted mb-0">Loading...</p>
              ) : error ? (
                <p className="text-danger mb-0">{error}</p>
              ) : (
                <>
                  <div className="row g-2 mb-3">
                    <div className="col-12 col-md-4">
                      <div className="p-3 border rounded">
                        <div className="text-muted small">Today Revenue</div>
                        <div className="fw-semibold">{revenueFmt(stats?.todayRevenue)}</div>
                        <div className="text-muted small mt-1">Today Orders: {stats?.todayOrders ?? 0}</div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="p-3 border rounded">
                        <div className="text-muted small">This Month Revenue</div>
                        <div className="fw-semibold">{revenueFmt(stats?.monthRevenue)}</div>
                        <div className="text-muted small mt-1">Last 7 days Orders: {stats?.weekOrders ?? 0}</div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="p-3 border rounded">
                        <div className="text-muted small">Paid Revenue Total</div>
                        <div className="fw-semibold">{revenueFmt(stats?.paidRevenueTotal)}</div>
                        <div className="text-muted small mt-1">All Orders: {stats?.ordersTotal ?? 0}</div>
                      </div>
                    </div>
                  </div>

                  {sales7.length === 0 ? (
                    <p className="text-muted mb-0">No sales data found for last 7 days.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: 160 }}>Date</th>
                            <th>Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sales7.map((r) => (
                            <tr key={r.date}>
                              <td>{r.date}</td>
                              <td className="fw-semibold">{revenueFmt(r.revenue)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Recent Orders</h5>
              {loading ? (
                <p className="text-muted mb-0">Loading...</p>
              ) : error ? (
                <p className="text-danger mb-0">{error}</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-muted mb-0">No recent orders.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order</th>
                        <th className="text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => (
                        <tr key={o.id}>
                          <td>
                            <div className="fw-semibold">{o.orderNumber}</div>
                            <div className="text-muted small">{o.customerName}</div>
                            <div className="text-muted small">
                              {o.status} • {o.paymentStatus} • Items: {o.items}
                            </div>
                          </td>
                          <td className="text-end fw-semibold">{revenueFmt(o.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

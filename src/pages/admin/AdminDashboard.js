import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { ShoppingBag, IndianRupee, Package, Users, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const API_BASE = process.env.REACT_APP_API_BASE || '';

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
    <div className="container-fluid py-4">
      {/* Stat Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm stat-card stat-card--primary h-100">
            <div className="card-body d-flex align-items-center justify-content-between py-3">
              <div>
                <div className="text-muted small mb-1">Total Orders</div>
                <div className="fw-bold fs-4">{loading ? '—' : stats?.ordersTotal ?? 0}</div>
              </div>
              <div className="stat-icon bg-primary bg-opacity-10 text-primary rounded-3 p-2">
                <ShoppingBag size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm stat-card stat-card--warning h-100">
            <div className="card-body d-flex align-items-center justify-content-between py-3">
              <div>
                <div className="text-muted small mb-1">Revenue</div>
                <div className="fw-bold fs-4">{loading ? '—' : revenueFmt(stats?.paidRevenueTotal)}</div>
              </div>
              <div className="stat-icon bg-warning bg-opacity-10 text-warning rounded-3 p-2">
                <IndianRupee size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm stat-card stat-card--info h-100">
            <div className="card-body d-flex align-items-center justify-content-between py-3">
              <div>
                <div className="text-muted small mb-1">Products</div>
                <div className="fw-bold fs-4">{loading ? '—' : stats?.productsTotal ?? 0}</div>
              </div>
              <div className="stat-icon bg-info bg-opacity-10 text-info rounded-3 p-2">
                <Package size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm stat-card stat-card--danger h-100">
            <div className="card-body d-flex align-items-center justify-content-between py-3">
              <div>
                <div className="text-muted small mb-1">Customers</div>
                <div className="fw-bold fs-4">{loading ? '—' : stats?.customersTotal ?? 0}</div>
              </div>
              <div className="stat-icon bg-danger bg-opacity-10 text-danger rounded-3 p-2">
                <Users size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Row */}
      <div className="row g-4">
        {/* Sales Overview */}
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white border-bottom py-3">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 fw-semibold">Sales Overview</h5>
                <Link to="/admin/analytics" className="btn btn-sm btn-outline-primary">
                  View Analytics
                </Link>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger mb-0">{error}</div>
              ) : (
                <>
                  {/* Quick Stats Cards */}
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-4">
                      <div className="p-3 bg-light rounded-3 border">
                        <div className="d-flex align-items-center mb-2">
                          <Calendar size={16} className="text-primary me-2" />
                          <span className="text-muted small">Today Revenue</span>
                        </div>
                        <div className="fw-bold fs-5">{revenueFmt(stats?.todayRevenue)}</div>
                        <div className="text-muted small mt-1">{stats?.todayOrders ?? 0} orders today</div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="p-3 bg-light rounded-3 border">
                        <div className="d-flex align-items-center mb-2">
                          <TrendingUp size={16} className="text-success me-2" />
                          <span className="text-muted small">This Month</span>
                        </div>
                        <div className="fw-bold fs-5">{revenueFmt(stats?.monthRevenue)}</div>
                        <div className="text-muted small mt-1">{stats?.weekOrders ?? 0} orders (7 days)</div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="p-3 bg-light rounded-3 border">
                        <div className="d-flex align-items-center mb-2">
                          <CreditCard size={16} className="text-info me-2" />
                          <span className="text-muted small">Total Paid</span>
                        </div>
                        <div className="fw-bold fs-5">{revenueFmt(stats?.paidRevenueTotal)}</div>
                        <div className="text-muted small mt-1">{stats?.ordersTotal ?? 0} total orders</div>
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Sales Table */}
                  <h6 className="fw-semibold mb-3">Last 7 Days Revenue</h6>
                  {sales7.length === 0 ? (
                    <div className="text-center py-4 text-muted bg-light rounded-3">
                      No sales data found for last 7 days.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="fw-semibold" style={{ width: 180 }}>Date</th>
                            <th className="fw-semibold text-end">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sales7.map((r) => (
                            <tr key={r.date}>
                              <td className="text-muted">{r.date}</td>
                              <td className="text-end fw-semibold text-success">{revenueFmt(r.revenue)}</td>
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

        {/* Recent Orders */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white border-bottom py-3">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 fw-semibold">Recent Orders</h5>
                <Link to="/admin/orders" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger m-3">{error}</div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <ShoppingBag size={48} className="mb-3 opacity-25" />
                  <p>No recent orders.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentOrders.map((o) => (
                    <Link
                      key={o.id}
                      to={`/admin/orders/${o.id}`}
                      className="list-group-item list-group-item-action py-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-semibold">{o.orderNumber}</div>
                          <div className="text-muted small">{o.customerName}</div>
                          <div className="text-muted small mt-1">
                            <span className="badge bg-light text-dark me-1">{o.status}</span>
                            <span className="badge bg-light text-dark">{o.items} items</span>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-semibold text-success">{revenueFmt(o.totalAmount)}</div>
                          <div className="text-muted small">{o.paymentStatus}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
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

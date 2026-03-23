import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, TrendingUp, Users, Package, ShoppingBag, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getApiBase } from '../../utils/api';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesLast7Days, setSalesLast7Days] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const readJsonSafe = useCallback(async (response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch (e) {
      const preview = text?.slice(0, 200) || '';
      throw new Error(`Invalid server response. ${preview}`);
    }
  }, []);

  const moneyFmt = useMemo(() => {
    return (v) => `₹${Number(v || 0).toFixed(2)}`;
  }, []);

  const exportPdfHtml = useCallback(() => {
    const now = new Date();
    const stamp = now.toLocaleString();
    const safe = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => {
      switch (ch) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#39;';
        default:
          return ch;
      }
    });

    const s = stats || {};
    const kpiRows = [
      { label: 'Total Orders', value: s.ordersTotal ?? 0 },
      { label: 'Total Products', value: s.productsTotal ?? 0 },
      { label: 'Active Customers', value: s.customersTotal ?? 0 },
      { label: 'Paid Revenue (Total)', value: moneyFmt(s.paidRevenueTotal ?? 0) },
      { label: "Today's Revenue", value: moneyFmt(s.todayRevenue ?? 0) },
      { label: 'This Month Revenue', value: moneyFmt(s.monthRevenue ?? 0) },
      { label: 'Today Orders', value: s.todayOrders ?? 0 },
      { label: 'Orders (Last 7 Days)', value: s.weekOrders ?? 0 }
    ];

    const salesRows = (Array.isArray(salesLast7Days) ? salesLast7Days : []).map((p) => {
      return {
        date: p?.date || '—',
        revenue: moneyFmt(p?.revenue || 0)
      };
    });

    const orderRows = (Array.isArray(recentOrders) ? recentOrders : []).map((o) => {
      return {
        order: o?.orderNumber || `#${o?.id ?? ''}`,
        customer: o?.customerName || '—',
        items: o?.items ?? 0,
        total: moneyFmt(o?.totalAmount || 0),
        status: o?.status || '—',
        payment: o?.paymentStatus || '—',
        placed: o?.placedAt || '—'
      };
    });

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Analytics Report</title>
    <style>
      @page { size: A4; margin: 14mm; }
      * { box-sizing: border-box; }
      body { font-family: Arial, Helvetica, sans-serif; color: #111; }
      .header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #939E5B; padding-bottom: 10px; margin-bottom: 14px; }
      .title { font-size: 18px; font-weight: 700; }
      .meta { font-size: 12px; color: #555; }
      .section { margin: 14px 0; }
      .section h2 { font-size: 14px; margin: 0 0 8px; color: #2c2c2c; }
      .kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .kpi { border: 1px solid #e6e6e6; border-radius: 8px; padding: 10px; }
      .kpi .label { font-size: 11px; color: #666; margin-bottom: 6px; }
      .kpi .value { font-size: 14px; font-weight: 700; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #e6e6e6; padding: 8px; font-size: 12px; text-align: left; }
      th { background: #f6f7f5; }
      .muted { color: #666; }
      .footer { margin-top: 18px; padding-top: 10px; border-top: 1px solid #e6e6e6; font-size: 11px; color: #666; }
      @media print {
        .no-print { display: none !important; }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="title">Analytics & Reporting</div>
        <div class="meta">Generated: ${safe(stamp)}</div>
      </div>
      <div class="meta">MakeMyVeggies Admin</div>
    </div>

    <div class="section">
      <h2>Summary KPIs</h2>
      <div class="kpi-grid">
        ${kpiRows.map((r) => `
          <div class="kpi">
            <div class="label">${safe(r.label)}</div>
            <div class="value">${safe(r.value)}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <h2>Revenue (Last 7 Days)</h2>
      <table>
        <thead>
          <tr><th>Date</th><th>Revenue</th></tr>
        </thead>
        <tbody>
          ${salesRows.length === 0 ? '<tr><td colspan="2" class="muted">No data</td></tr>' : salesRows.map((r) => `
            <tr>
              <td>${safe(r.date)}</td>
              <td>${safe(r.revenue)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Recent Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Placed</th>
          </tr>
        </thead>
        <tbody>
          ${orderRows.length === 0 ? '<tr><td colspan="7" class="muted">No orders</td></tr>' : orderRows.map((r) => `
            <tr>
              <td>${safe(r.order)}</td>
              <td>${safe(r.customer)}</td>
              <td>${safe(r.items)}</td>
              <td>${safe(r.total)}</td>
              <td>${safe(r.status)}</td>
              <td>${safe(r.payment)}</td>
              <td>${safe(r.placed)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="footer">
      This report is generated from the currently loaded analytics data in the admin panel.
    </div>
  </body>
</html>`;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.onload = () => {
      w.print();
    };
  }, [moneyFmt, recentOrders, salesLast7Days, stats]);

  const getDashboardStatsEndpointCandidates = useCallback(() => {
    const path = '/backend/api/admin/dashboard_stats.php';
    return [
      path,
      getApiBase() + path
    ];
  }, []);

  const fetchStats = useCallback(async () => {
    setError('');

    try {
      const urls = getDashboardStatsEndpointCandidates();
      let lastError = null;

      for (const url of urls) {
        try {
          const res = await fetch(url, {
            method: 'GET',
            credentials: 'include'
          });

          const contentType = res.headers.get('content-type') || '';
          if (!contentType.toLowerCase().includes('application/json')) {
            const text = await res.text();
            const preview = text?.slice(0, 200) || '';
            throw new Error(`Invalid server response. ${preview}`);
          }

          const data = await readJsonSafe(res);

          if (!res.ok || data?.status !== 'success') {
            throw new Error(data?.message || 'Failed to load analytics');
          }

          setStats(data?.stats || null);
          setRecentOrders(Array.isArray(data?.recentOrders) ? data.recentOrders : []);
          setSalesLast7Days(Array.isArray(data?.salesLast7Days) ? data.salesLast7Days : []);
          lastError = null;
          break;
        } catch (innerErr) {
          lastError = innerErr;
        }
      }

      if (lastError) {
        throw lastError;
      }
    } catch (e) {
      setError(e?.message || 'Failed to load analytics');
      setStats(null);
      setRecentOrders([]);
      setSalesLast7Days([]);
    }
  }, [getDashboardStatsEndpointCandidates, readJsonSafe]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchStats();
      setLoading(false);
    };

    load();
  }, [fetchStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const chart = useMemo(() => {
    const points = Array.isArray(salesLast7Days) ? salesLast7Days : [];
    const w = 560;
    const h = 140;
    const pad = 14;
    const maxRevenue = Math.max(1, ...points.map((p) => Number(p?.revenue || 0)));

    const xy = points.map((p, i) => {
      const x = points.length <= 1
        ? pad
        : pad + (i * (w - pad * 2)) / (points.length - 1);
      const y = pad + (1 - Number(p?.revenue || 0) / maxRevenue) * (h - pad * 2);
      return { x, y, date: p?.date, revenue: Number(p?.revenue || 0) };
    });

    const poly = xy.map((p) => `${p.x},${p.y}`).join(' ');
    const last = xy[xy.length - 1];

    return {
      w,
      h,
      poly,
      maxRevenue,
      last
    };
  }, [salesLast7Days]);

  const kpis = useMemo(() => {
    const s = stats || {};
    return [
      {
        label: 'Total Orders',
        value: s.ordersTotal ?? 0,
        icon: ShoppingBag
      },
      {
        label: 'Total Products',
        value: s.productsTotal ?? 0,
        icon: Package
      },
      {
        label: 'Active Customers',
        value: s.customersTotal ?? 0,
        icon: Users
      },
      {
        label: 'Paid Revenue (Total)',
        value: moneyFmt(s.paidRevenueTotal ?? 0),
        icon: IndianRupee
      },
      {
        label: "Today's Revenue",
        value: moneyFmt(s.todayRevenue ?? 0),
        icon: TrendingUp
      },
      {
        label: 'This Month Revenue',
        value: moneyFmt(s.monthRevenue ?? 0),
        icon: TrendingUp
      }
    ];
  }, [moneyFmt, stats]);

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
        <div>
          <h4 className="mb-1">Analytics & Reporting</h4>
          <p className="text-muted mb-0 small">Sales summary, customer activity, and recent orders.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={exportPdfHtml}
            disabled={loading || !!error || !stats}
          >
            Export
          </button>
          <button
            type="button"
            className="btn btn-sm btn-success"
            onClick={handleRefresh}
            disabled={loading || refreshing}
          >
            <RefreshCw size={16} className="me-2" />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="row g-3 mb-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div className="col-12 col-sm-6 col-lg-4" key={k.label}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted small">{k.label}</div>
                    <div className="h5 mb-0 fw-semibold">{k.value}</div>
                  </div>
                  <div className="text-success opacity-75">
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between mb-2">
                <div>
                  <div className="fw-semibold">Revenue (Last 7 Days)</div>
                  <div className="text-muted small">Max day: {moneyFmt(chart.maxRevenue)}</div>
                </div>
                <div className="text-end">
                  <div className="text-muted small">Latest</div>
                  <div className="fw-semibold">{moneyFmt(chart?.last?.revenue || 0)}</div>
                  <div className="text-muted small">{chart?.last?.date || '—'}</div>
                </div>
              </div>

              {loading && <p className="text-muted mb-0">Loading...</p>}
              {!loading && error && <p className="text-danger mb-0">{error}</p>}

              {!loading && !error && (
                <div className="bg-white border rounded-3 p-2">
                  <svg
                    width="100%"
                    height="160"
                    viewBox={`0 0 ${chart.w} ${chart.h}`}
                    preserveAspectRatio="none"
                  >
                    <polyline
                      fill="none"
                      stroke="rgba(147, 158, 91, 0.35)"
                      strokeWidth="10"
                      points={chart.poly}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      fill="none"
                      stroke="#939E5B"
                      strokeWidth="3"
                      points={chart.poly}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx={chart?.last?.x || 0}
                      cy={chart?.last?.y || 0}
                      r="4"
                      fill="#939E5B"
                    />
                  </svg>

                  <div className="d-flex justify-content-between text-muted small px-1">
                    <span>{salesLast7Days?.[0]?.date || '—'}</span>
                    <span>{salesLast7Days?.[salesLast7Days.length - 1]?.date || '—'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <div className="fw-semibold">Recent Orders</div>
                  <div className="text-muted small">Latest 8 orders from your store.</div>
                </div>
                <div className="text-muted small">
                  Today: <span className="fw-semibold">{stats?.todayOrders ?? 0}</span> | Last 7 days:{' '}
                  <span className="fw-semibold">{stats?.weekOrders ?? 0}</span>
                </div>
              </div>

              {loading && <p className="text-muted mb-0">Loading...</p>}
              {!loading && error && <p className="text-danger mb-0">{error}</p>}

              {!loading && !error && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th style={{ width: 80 }}>Items</th>
                        <th style={{ width: 140 }}>Total</th>
                        <th style={{ width: 120 }}>Status</th>
                        <th style={{ width: 140 }}>Payment</th>
                        <th style={{ width: 170 }}>Placed</th>
                        <th style={{ width: 90 }} />
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-muted">
                            No orders found.
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map((o) => (
                          <tr key={o.id}>
                            <td className="fw-semibold">{o.orderNumber || `#${o.id}`}</td>
                            <td>{o.customerName || '—'}</td>
                            <td>{o.items ?? 0}</td>
                            <td>{moneyFmt(o.totalAmount)}</td>
                            <td>{o.status || '—'}</td>
                            <td>{o.paymentStatus || '—'}</td>
                            <td className="text-muted">{o.placedAt || '—'}</td>
                            <td className="text-end">
                              <Link to={`/admin/orders/${o.id}`} className="btn btn-sm btn-outline-secondary">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
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

export default Analytics;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CreditCard, RefreshCw, Eye, CheckCircle, XCircle, Clock, IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';
import { getApiBase } from '../../utils/api';
import { useHasPermission } from '../../rbac/useHasPermission';

const Payments = () => {
  const API_BASE = getApiBase();
  const canViewPayments = useHasPermission('view.payments');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const [activeModal, setActiveModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const moneyFmt = useMemo(() => {
    return (v) => `₹${Number(v || 0).toFixed(2)}`;
  }, []);

  const readJsonSafe = useCallback(async (response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch (e) {
      const preview = text?.slice(0, 200) || '';
      throw new Error(`Invalid server response. ${preview}`);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!canViewPayments) return;
    setError('');

    try {
      const offset = (page - 1) * limit;
      const params = new URLSearchParams();
      params.set('limit', String(limit));
      params.set('offset', String(offset));
      if (query.trim()) params.set('search', query.trim());
      if (paymentFilter) params.set('paymentStatus', paymentFilter);
      if (statusFilter) params.set('status', statusFilter);

      const path = `/backend/api/admin/get_orders.php?${params.toString()}`;

      const res = await fetch(`${API_BASE}${path}`, { method: 'GET', credentials: 'include' });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.toLowerCase().includes('application/json')) {
        const text = await res.text();
        const preview = text?.slice(0, 200) || '';
        throw new Error(`Invalid server response. ${preview}`);
      }

      const data = await readJsonSafe(res);
      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to load orders');
      }

      const rows = Array.isArray(data?.orders) ? data.orders : [];
      setOrders(rows);
      setTotalPages(data?.pagination?.totalPages || 1);
      setTotalCount(data?.pagination?.total || 0);
    } catch (e) {
      setError(e?.message || 'Failed to load orders');
      setOrders([]);
      setTotalPages(1);
      setTotalCount(0);
    }
  }, [API_BASE, canViewPayments, limit, page, query, paymentFilter, statusFilter, readJsonSafe]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!canViewPayments) {
        setOrders([]);
        setTotalPages(1);
        setTotalCount(0);
        setError('Access denied');
        setLoading(false);
        return;
      }
      await fetchOrders();
      setLoading(false);
    };
    load();
  }, [canViewPayments, fetchOrders]);

  useEffect(() => {
    setPage(1);
  }, [query, paymentFilter, statusFilter]);

  const handleRefresh = async () => {
    if (!canViewPayments) return;
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
    toast.success('Payments refreshed');
  };

  const closeModal = () => {
    setActiveModal(false);
    setSelectedOrder(null);
  };

  const openOrderDetails = (order) => {
    setActiveModal(true);
    setSelectedOrder(order);
  };

  const normalizePaymentStatus = useCallback((v) => {
    const s = String(v || '').trim().toLowerCase();
    if (!s) return 'unknown';
    if (s === 'paid' || s === 'success' || s === 'successful') return 'paid';
    if (s === 'pending') return 'pending';
    if (s === 'failed' || s === 'failure') return 'failed';
    if (s === 'refunded' || s === 'refund') return 'refunded';
    return s;
  }, []);

  const normalizedOrders = useMemo(() => {
    return (Array.isArray(orders) ? orders : []).map((o) => {
      const raw = o?.paymentStatusRaw ?? o?.paymentStatus;
      return {
        ...o,
        paymentStatusNorm: normalizePaymentStatus(raw)
      };
    });
  }, [normalizePaymentStatus, orders]);

  const getPaymentStatusBadge = (status) => {
    const s = normalizePaymentStatus(status);
    switch (status) {
      case 'paid':
        return <span className="badge text-bg-success"><CheckCircle size={12} className="me-1" />Paid</span>;
      case 'pending':
        return <span className="badge text-bg-warning"><Clock size={12} className="me-1" />Pending</span>;
      case 'failed':
        return <span className="badge text-bg-danger"><XCircle size={12} className="me-1" />Failed</span>;
      case 'refunded':
        return <span className="badge text-bg-info"><IndianRupee size={12} className="me-1" />Refunded</span>;
      default:
        return <span className="badge text-bg-secondary">{s || 'Unknown'}</span>;
    }
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return <span className="badge text-bg-primary">Placed</span>;
      case 'confirmed':
        return <span className="badge text-bg-info">Confirmed</span>;
      case 'shipped':
        return <span className="badge text-bg-warning">Shipped</span>;
      case 'delivered':
        return <span className="badge text-bg-success">Delivered</span>;
      case 'cancelled':
        return <span className="badge text-bg-danger">Cancelled</span>;
      default:
        return <span className="badge text-bg-secondary">{status || 'Unknown'}</span>;
    }
  };

  const totalPaid = useMemo(() => {
    return normalizedOrders
      .filter((o) => o.paymentStatusNorm === 'paid')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [normalizedOrders]);

  const totalPending = useMemo(() => {
    return normalizedOrders
      .filter((o) => o.paymentStatusNorm === 'pending')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [normalizedOrders]);

  const paidCount = normalizedOrders.filter((o) => o.paymentStatusNorm === 'paid').length;
  const pendingCount = normalizedOrders.filter((o) => o.paymentStatusNorm === 'pending').length;

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
        <div>
          <h4 className="mb-1">Payments</h4>
          <p className="text-muted mb-0 small">Manage order payments and track payment status.</p>
        </div>
        {canViewPayments && (
          <button
            type="button"
            className="btn btn-sm btn-outline-success"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            aria-label="Refresh"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small">Total Paid</div>
                <div className="h5 mb-0 text-success">{moneyFmt(totalPaid)}</div>
              </div>
              <div className="bg-success bg-opacity-10 p-2 rounded">
                <CheckCircle size={24} className="text-success" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small">Pending Payments</div>
                <div className="h5 mb-0 text-warning">{moneyFmt(totalPending)}</div>
              </div>
              <div className="bg-warning bg-opacity-10 p-2 rounded">
                <Clock size={24} className="text-warning" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small">Paid Orders</div>
                <div className="h5 mb-0 text-primary">{paidCount}</div>
              </div>
              <div className="bg-primary bg-opacity-10 p-2 rounded">
                <CreditCard size={24} className="text-primary" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small">Pending Orders</div>
                <div className="h5 mb-0 text-secondary">{pendingCount}</div>
              </div>
              <div className="bg-secondary bg-opacity-10 p-2 rounded">
                <Clock size={24} className="text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between">
            <div className="input-group input-group-sm" style={{ maxWidth: 300 }}>
              <span className="input-group-text">Search</span>
              <input
                type="text"
                className="form-control"
                placeholder="Order # or customer"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2">
              <select
                className="form-select form-select-sm"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                style={{ minWidth: 150 }}
              >
                <option value="">All Payment Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ minWidth: 150 }}
              >
                <option value="">All Order Status</option>
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          {loading && <p className="text-muted mb-0">Loading...</p>}
          {!loading && error && <p className="text-danger mb-0">{error}</p>}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th style={{ width: 120 }}>Amount</th>
                    <th style={{ width: 130 }}>Payment Status</th>
                    <th style={{ width: 120 }}>Order Status</th>
                    <th style={{ width: 160 }}>Placed At</th>
                    <th style={{ width: 100 }} className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {normalizedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-muted text-center py-4">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    normalizedOrders.map((o) => (
                      <tr key={o.id}>
                        <td className="fw-semibold">{o.orderNumber}</td>
                        <td>
                          <div className="fw-medium">{o.customerName}</div>
                          <div className="text-muted small">{o.customerEmail}</div>
                        </td>
                        <td className="fw-semibold">{moneyFmt(o.totalAmount)}</td>
                        <td>{getPaymentStatusBadge(o.paymentStatusNorm)}</td>
                        <td>{getOrderStatusBadge(o.status)}</td>
                        <td className="text-muted small">
                          {o.placedAt ? new Date(o.placedAt).toLocaleString() : '—'}
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openOrderDetails(o)}
                            aria-label="View"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && !error && totalPages > 1 && (
          <div className="card-footer bg-white d-flex align-items-center justify-content-between">
            <div className="text-muted small">
              Showing {orders.length} of {totalCount} orders • Page {page} of {totalPages}
            </div>
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {activeModal && selectedOrder && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Order Details - {selectedOrder.orderNumber}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted small mb-1">Customer</label>
                      <div className="fw-medium">{selectedOrder.customerName}</div>
                      <div className="small text-muted">{selectedOrder.customerEmail}</div>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted small mb-1">Placed At</label>
                      <div>{selectedOrder.placedAt ? new Date(selectedOrder.placedAt).toLocaleString() : '—'}</div>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted small mb-1">Transaction ID</label>
                      <div className="fw-medium">{selectedOrder.transactionId || '—'}</div>
                      {selectedOrder.gatewayOrderId ? <div className="text-muted small">Gateway Order: {selectedOrder.gatewayOrderId}</div> : null}
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted small mb-1">Payment Method</label>
                      <div className="fw-medium">{selectedOrder.paymentMethod || '—'}</div>
                      {selectedOrder.paymentGateway ? <div className="text-muted small">Gateway: {selectedOrder.paymentGateway}</div> : null}
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted small mb-1">Order Status</label>
                      <div>{getOrderStatusBadge(selectedOrder.status)}</div>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted small mb-1">Payment Status</label>
                      <div>{getPaymentStatusBadge(selectedOrder.paymentStatusNorm ?? selectedOrder.paymentStatusRaw ?? selectedOrder.paymentStatus)}</div>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small mb-1">Total Amount</label>
                      <div className="h4 text-success mb-0">{moneyFmt(selectedOrder.totalAmount)}</div>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small mb-1">Items</label>
                      <div>{selectedOrder.items} item(s)</div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeModal} />
        </>
      )}
    </div>
  );
};

export default Payments;

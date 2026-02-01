import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Orders = () => {
  const API_BASE = process.env.REACT_APP_API_BASE || 'https://dev.makemyveggies.com/';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [sort, setSort] = useState('newest');

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const readJsonSafe = async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      const preview = text?.slice(0, 200) || '';
      throw new Error(`Invalid server response. ${preview}`);
    }
  };

  const moneyFmt = useMemo(() => {
    return (v) => `₹${Number(v || 0).toFixed(2)}`;
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, status, paymentStatus, sort]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const offset = (page - 1) * limit;
        const params = new URLSearchParams();
        params.set('limit', String(limit));
        params.set('offset', String(offset));
        params.set('sort', sort);

        if (search.trim()) params.set('search', search.trim());
        if (status) params.set('status', status);
        if (paymentStatus) params.set('paymentStatus', paymentStatus);

        const res = await fetch(`${API_BASE}/backend/api/admin/get_orders.php?${params.toString()}`, {
          method: 'GET',
          credentials: 'include'
        });

        const data = await readJsonSafe(res);

        if (!res.ok || data?.status !== 'success') {
          throw new Error(data?.message || 'Failed to load orders');
        }

        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setTotalPages(data?.pagination?.totalPages || 1);
        setTotal(data?.pagination?.total || 0);
      } catch (e) {
        setError(e?.message || 'Failed to load orders');
        toast.error(e?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, status, paymentStatus, sort]);

  const openCancelModal = (o) => {
    setSelectedOrder(o);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    if (cancelling) return;
    setShowCancelModal(false);
    setSelectedOrder(null);
  };

  const cancelOrder = async () => {
    if (!selectedOrder?.id) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE}/backend/api/admin/update_order.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: 'Cancelled'
        })
      });

      const data = await readJsonSafe(res);
      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to cancel order');
      }

      toast.success('Order cancelled');
      closeCancelModal();
      setPage(1);
    } catch (e) {
      toast.error(e?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h4 className="mb-0">Orders</h4>
          <div className="text-muted small">Total: {loading ? '—' : total}</div>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-sm-6 col-lg-4">
              <label className="form-label small text-muted mb-1">Search</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Order # / customer name / email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ height: 31 }}
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <label className="form-label small text-muted mb-1">Order Status</label>
              <select
                className="form-select form-select-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ height: 31 }}
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <label className="form-label small text-muted mb-1">Payment Status</label>
              <select
                className="form-select form-select-sm"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                style={{ height: 31 }}
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Success">Success</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <label className="form-label small text-muted mb-1">Sort</label>
              <select className="form-select form-select-sm" value={sort} onChange={(e) => setSort(e.target.value)} style={{ height: 31 }}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="amount_high">Amount: High to Low</option>
                <option value="amount_low">Amount: Low to High</option>
              </select>
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => {
                  setSearch('');
                  setStatus('');
                  setPaymentStatus('');
                  setSort('newest');
                }}
                disabled={loading}
                style={{ height: 31 }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-3">
              <p className="text-muted mb-0">Loading...</p>
            </div>
          ) : error ? (
            <div className="p-3">
              <p className="text-danger mb-0">{error}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th className="text-end">Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <div className="fw-semibold">{o.orderNumber}</div>
                          <div className="text-muted small">Items: {o.items}</div>
                        </td>
                        <td>
                          <div className="fw-semibold">{o.customerName}</div>
                          <div className="text-muted small">{o.customerEmail || '—'}</div>
                        </td>
                        <td className="text-end fw-semibold">{moneyFmt(o.totalAmount)}</td>
                        <td>{o.status}</td>
                        <td>{o.paymentStatus}</td>
                        <td className="text-muted">{o.placedAt}</td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-2">
                            <Link to={`/admin/orders/${o.id}`} className="btn btn-sm btn-outline-primary">
                              View
                            </Link>
                            <Link to={`/admin/orders/${o.id}`} className="btn btn-sm btn-outline-success">
                              Edit
                            </Link>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => openCancelModal(o)}
                            >
                              Delete
                            </button>
                          </div>
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
          <div className="card-footer d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="text-muted small">
              Page {page} of {totalPages}
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showCancelModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cancel Order</h5>
                <button type="button" className="btn-close" onClick={closeCancelModal} aria-label="Close" />
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to cancel order{' '}
                  <span className="fw-semibold">{selectedOrder?.orderNumber}</span>?
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={closeCancelModal} disabled={cancelling}>
                  Close
                </button>
                <button type="button" className="btn btn-danger" onClick={cancelOrder} disabled={cancelling}>
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && <div className="modal-backdrop fade show" onClick={closeCancelModal} />}
    </div>
  );
};

export default Orders;

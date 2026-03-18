import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Pencil, Trash2 } from 'lucide-react';
import { useHasPermission } from '../../rbac/useHasPermission';
import { getApiBase } from '../../utils/api';

const ViewOrder = () => {
  const API_BASE = getApiBase();

  const canUpdateOrder = useHasPermission('update.order');
  const canDeleteOrder = useHasPermission('delete.order');
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [orderTrackingId, setOrderTrackingId] = useState('');

  const [showCancelModal, setShowCancelModal] = useState(false);
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

  const openCancelModal = () => {
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    if (cancelling) return;
    setShowCancelModal(false);
  };

  const cancelOrder = async () => {
    if (!order?.id) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE}/backend/api/admin/update_order.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId: order.id,
          status: 'Cancelled'
        })
      });

      const data = await readJsonSafe(res);
      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to cancel order');
      }

      toast.success('Order cancelled');
      closeCancelModal();
      await loadOrder();
    } catch (e) {
      toast.error(e?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const moneyFmt = useMemo(() => {
    return (v) => `₹${Number(v || 0).toFixed(2)}`;
  }, []);

  const loadOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/backend/api/admin/get_order.php?id=${encodeURIComponent(id)}`, {
        method: 'GET',
        credentials: 'include'
      });

      const data = await readJsonSafe(res);

      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to load order');
      }

      setOrder(data.order || null);
      setStatus(data.order?.status || '');
      setPaymentStatus(data.order?.paymentStatus || '');
      setOrderTrackingId(data.order?.orderTrackingId || '');
    } catch (e) {
      setError(e?.message || 'Failed to load order');
      toast.error(e?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSave = async () => {
    if (!order) return;

    const nextStatus = status?.trim() || '';
    const nextPayment = paymentStatus?.trim() || '';
    const nextTracking = orderTrackingId?.trim() || '';

    const currentTracking = (order.orderTrackingId || '').toString();
    if (nextStatus === order.status && nextPayment === order.paymentStatus && nextTracking === currentTracking) {
      toast.info('No changes to save');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/backend/api/admin/update_order.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId: order.id,
          status: nextStatus,
          paymentStatus: nextPayment,
          orderTrackingId: nextTracking
        })
      });

      const data = await readJsonSafe(res);

      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to update order');
      }

      toast.success('Order updated');
      await loadOrder();
    } catch (e) {
      toast.error(e?.message || 'Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h4 className="mb-0">Order Details</h4>
          <div className="text-muted small">{order?.orderNumber ? `#${order.orderNumber}` : ''}</div>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
            Back
          </button>
          <Link to="/admin/orders" className="btn btn-outline-secondary btn-sm">
            Orders List
          </Link>
          {canUpdateOrder && (
            <Link
              to={`/admin/orders/${id}`}
              className="btn btn-outline-success btn-sm"
              aria-label="Edit"
              title="Edit"
            >
              <Pencil size={16} />
            </Link>
          )}
          {canDeleteOrder && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={openCancelModal}
              disabled={cancelling}
              aria-label="Delete"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="card shadow-sm">
          <div className="card-body">
            <p className="text-muted mb-0">Loading...</p>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : !order ? (
        <div className="alert alert-warning">Order not found.</div>
      ) : (
        <div className="row g-3">
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="mb-3">Summary</h6>

                <div className="mb-2">
                  <div className="text-muted small">Total Amount</div>
                  <div className="fw-semibold">{moneyFmt(order.totalAmount)}</div>
                </div>

                <div className="mb-2">
                  <div className="text-muted small">Placed At</div>
                  <div className="fw-semibold">{order.placedAt}</div>
                </div>

                <div className="mb-2">
                  <div className="text-muted small">Updated At</div>
                  <div className="fw-semibold">{order.updatedAt}</div>
                </div>

                <div className="row g-2 mt-3">
                  <div className="col-12">
                    <label className="form-label small text-muted">Order Status</label>
                    <select className="form-select form-select-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Select</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label small text-muted">Order Tracking ID</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={orderTrackingId}
                      onChange={(e) => setOrderTrackingId(e.target.value)}
                      placeholder="Enter tracking id"
                      disabled={!canUpdateOrder}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small text-muted">Payment Status</label>
                    <select
                      className="form-select form-select-sm"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Pending">Pending</option>
                      <option value="Success">Success</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div className="d-grid mt-3">
                  <button type="button" className="btn btn-primary btn-sm" onClick={onSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>

            <div className="card shadow-sm mt-3">
              <div className="card-body">
                <h6 className="mb-3">Customer</h6>
                <div className="fw-semibold">{order.customer?.name || '—'}</div>
                <div className="text-muted small">{order.customer?.email || '—'}</div>
                <div className="text-muted small">{order.customer?.phone || '—'}</div>
              </div>
            </div>

            <div className="card shadow-sm mt-3">
              <div className="card-body">
                <h6 className="mb-3">Shipping Address</h6>
                <div className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                  {order.shippingAddress || '—'}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="mb-3">Items</h6>
                {order.items?.length ? (
                  <div className="table-responsive">
                    <table className="table table-sm table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th style={{ width: 120 }}>SKU</th>
                          <th className="text-end" style={{ width: 90 }}>
                            Qty
                          </th>
                          <th className="text-end" style={{ width: 140 }}>
                            Unit
                          </th>
                          <th className="text-end" style={{ width: 140 }}>
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((it) => (
                          <tr key={it.id}>
                            <td>
                              <div className="fw-semibold">{it.title || `Product #${it.productId}`}</div>
                              <div className="text-muted small">ID: {it.productId}</div>
                            </td>
                            <td className="text-muted">{it.sku || '—'}</td>
                            <td className="text-end">{it.quantity}</td>
                            <td className="text-end">{moneyFmt(it.unitPrice)}</td>
                            <td className="text-end fw-semibold">{moneyFmt(it.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="4" className="text-end fw-semibold">
                            Order Total
                          </td>
                          <td className="text-end fw-bold">{moneyFmt(order.totalAmount)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted mb-0">No items found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <span className="fw-semibold">{order?.orderNumber}</span>?
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

export default ViewOrder;

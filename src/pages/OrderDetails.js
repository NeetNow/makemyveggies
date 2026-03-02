import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const moneyFmt = useMemo(() => {
    return (v) => `₹${Number(v || 0).toFixed(2)}`;
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/backend/api/get_user_order_details.php?id=${encodeURIComponent(id)}`, {
          method: 'GET',
          credentials: 'include'
        });

        const data = await res.json();
        if (!res.ok || data.status !== 'success') {
          throw new Error(data.message || 'Failed to load order details');
        }

        setOrder(data.order);
      } catch (e) {
        setOrder(null);
        setError(e?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const statusBadge = (s) => {
    const v = String(s || '').toLowerCase();
    const cls = v === 'delivered'
      ? 'bg-success'
      : v === 'cancelled'
        ? 'bg-danger'
        : v === 'confirmed'
          ? 'bg-info'
          : v === 'shipped'
            ? 'bg-primary'
            : 'bg-secondary';

    return <span className={`badge ${cls}`}>{s || '—'}</span>;
  };

  const paymentBadge = (s) => {
    const v = String(s || '').toLowerCase();
    const cls = v === 'paid' || v === 'success'
      ? 'bg-success'
      : v === 'pending'
        ? 'bg-warning'
        : v === 'failed'
          ? 'bg-danger'
          : 'bg-secondary';

    return <span className={`badge ${cls}`}>{s || '—'}</span>;
  };

  return (
    <>
      <div className="container padding-block">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div>
            <h3 className="mb-1">Order Details</h3>
            <div className="text-muted small">{order?.orderNumber ? `#${order.orderNumber}` : ''}</div>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
              Back
            </button>
            <Link to="/profile" className="btn btn-outline-secondary btn-sm">
              Profile
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="card">
            <div className="card-body">
              <p className="mb-0 text-muted">Loading...</p>
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
                  <div className="mb-2"><span className="text-muted small">Order Status</span></div>
                  <div className="mb-3">{statusBadge(order.status)}</div>

                  <div className="mb-2"><span className="text-muted small">Payment Status</span></div>
                  <div className="mb-3">{paymentBadge(order.paymentStatus)}</div>

                  <div className="mb-2"><span className="text-muted small">Total</span></div>
                  <div className="h5 mb-0 text-success">{moneyFmt(order.totalAmount)}</div>

                  <hr />

                  <div className="text-muted small">Placed At</div>
                  <div className="mb-2">{order.placedAt ? new Date(order.placedAt).toLocaleString() : '—'}</div>

                  <div className="text-muted small">Updated At</div>
                  <div>{order.updatedAt ? new Date(order.updatedAt).toLocaleString() : '—'}</div>
                </div>
              </div>

              <div className="card shadow-sm mt-3">
                <div className="card-body">
                  <h6 className="mb-2">Payment</h6>
                  <div className="row g-2">
                    <div className="col-6 text-muted small">Method</div>
                    <div className="col-6 text-end">{order.payment?.paymentMethod || '—'}</div>

                    <div className="col-6 text-muted small">Gateway</div>
                    <div className="col-6 text-end">{order.payment?.paymentGateway || '—'}</div>

                    <div className="col-6 text-muted small">Transaction</div>
                    <div className="col-6 text-end" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {order.payment?.transactionId || '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="mb-3">Items</h6>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th style={{ width: 90 }} className="text-end">Qty</th>
                          <th style={{ width: 140 }} className="text-end">Unit</th>
                          <th style={{ width: 140 }} className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(order.items || []).map((it) => (
                          <tr key={it.id}>
                            <td>
                              <div className="fw-medium">{it.title}</div>
                            </td>
                            <td className="text-end">{it.quantity}</td>
                            <td className="text-end">{moneyFmt(it.unitPrice)}</td>
                            <td className="text-end fw-semibold">{moneyFmt(it.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h6 className="mb-2">Billing</h6>
                      <div className="small">
                        <div className="fw-medium">{`${order.billing?.first_name || ''} ${order.billing?.last_name || ''}`.trim() || '—'}</div>
                        <div className="text-muted">{order.billing?.email || '—'}</div>
                        <div className="text-muted">{order.billing?.phone || '—'}</div>
                        <div className="mt-2">
                          {order.billing?.address_line1 || ''}{order.billing?.address_line1 ? <br /> : null}
                          {order.billing?.address_line2 || ''}{order.billing?.address_line2 ? <br /> : null}
                          {order.billing?.city || ''}{order.billing?.city ? ', ' : ''}{order.billing?.state || ''}
                          {(order.billing?.city || order.billing?.state) ? <br /> : null}
                          {order.billing?.country || ''}{order.billing?.postal_code ? ` - ${order.billing?.postal_code}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h6 className="mb-2">Shipping</h6>
                      <div className="small">
                        <div>
                          {order.shipping?.address_line1 || ''}{order.shipping?.address_line1 ? <br /> : null}
                          {order.shipping?.address_line2 || ''}{order.shipping?.address_line2 ? <br /> : null}
                          {order.shipping?.city || ''}{order.shipping?.city ? ', ' : ''}{order.shipping?.state || ''}
                          {(order.shipping?.city || order.shipping?.state) ? <br /> : null}
                          {order.shipping?.country || ''}{order.shipping?.postal_code ? ` - ${order.shipping?.postal_code}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;

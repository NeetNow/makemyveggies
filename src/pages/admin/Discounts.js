import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Tag, RefreshCw, Pencil, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useHasPermission } from '../../rbac/useHasPermission';
import { getApiBase } from '../../utils/api';

const Discounts = () => {
  const canUpdateProduct = useHasPermission('update.product');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [onlyDiscounted, setOnlyDiscounted] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const [activeModal, setActiveModal] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    enabled: false,
    percent: '',
    fromDate: '',
    toDate: ''
  });

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

  const getEndpointCandidates = useCallback((path) => {
    return [
      path,
      getApiBase() + path
    ];
  }, []);

  const fetchProducts = useCallback(async () => {
    setError('');

    try {
      const offset = (page - 1) * limit;
      const params = new URLSearchParams();
      params.set('limit', String(limit));
      params.set('offset', String(offset));
      params.set('sort', 'newest');
      if (query.trim()) params.set('search', query.trim());

      const path = `/backend/api/admin/get_products.php?${params.toString()}`;
      const urls = getEndpointCandidates(path);
      let lastError = null;

      for (const url of urls) {
        try {
          const res = await fetch(url, { method: 'GET', credentials: 'include' });
          const contentType = res.headers.get('content-type') || '';
          if (!contentType.toLowerCase().includes('application/json')) {
            const text = await res.text();
            const preview = text?.slice(0, 200) || '';
            throw new Error(`Invalid server response. ${preview}`);
          }

          const data = await readJsonSafe(res);
          if (!res.ok || data?.status !== 'success') {
            throw new Error(data?.message || 'Failed to load products');
          }

          const rows = Array.isArray(data?.products) ? data.products : [];
          setProducts(rows);
          setTotalPages(data?.pagination?.totalPages || 1);
          lastError = null;
          break;
        } catch (innerErr) {
          lastError = innerErr;
        }
      }

      if (lastError) throw lastError;
    } catch (e) {
      setError(e?.message || 'Failed to load products');
      setProducts([]);
      setTotalPages(1);
    }
  }, [getEndpointCandidates, limit, page, query, readJsonSafe]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    load();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [query, onlyDiscounted]);

  const visibleProducts = useMemo(() => {
    if (!onlyDiscounted) return products;
    return products.filter((p) => !!p?.discount);
  }, [onlyDiscounted, products]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
    toast.success('Discounts refreshed');
  };

  const closeModal = () => {
    setActiveModal(false);
    setProductDetails(null);
    setDetailLoading(false);
    setSaving(false);
    setForm({ enabled: false, percent: '', fromDate: '', toDate: '' });
  };

  const openManageDiscount = async (productId) => {
    if (!canUpdateProduct) return;
    setActiveModal(true);
    setDetailLoading(true);
    setProductDetails(null);

    try {
      const path = `/backend/api/admin/get_product.php?id=${encodeURIComponent(String(productId))}`;
      const urls = getEndpointCandidates(path);
      let lastError = null;

      for (const url of urls) {
        try {
          const res = await fetch(url, { method: 'GET', credentials: 'include' });
          const contentType = res.headers.get('content-type') || '';
          if (!contentType.toLowerCase().includes('application/json')) {
            const text = await res.text();
            const preview = text?.slice(0, 200) || '';
            throw new Error(`Invalid server response. ${preview}`);
          }

          const data = await readJsonSafe(res);
          if (!res.ok || data?.status !== 'success') {
            throw new Error(data?.message || 'Failed to load product details');
          }

          const prod = data?.product || null;
          setProductDetails(prod);

          const d = prod?.discount;
          setForm({
            enabled: !!d,
            percent: d?.percent != null ? String(d.percent) : '',
            fromDate: d?.fromDate ? String(d.fromDate).slice(0, 10) : '',
            toDate: d?.toDate ? String(d.toDate).slice(0, 10) : ''
          });

          lastError = null;
          break;
        } catch (innerErr) {
          lastError = innerErr;
        }
      }

      if (lastError) throw lastError;
    } catch (e) {
      toast.error(e?.message || 'Failed to load product details');
      closeModal();
    } finally {
      setDetailLoading(false);
    }
  };

  const submitDiscount = async (e) => {
    e.preventDefault();
    if (!productDetails?.id) return;

    setSaving(true);

    try {
      const enabled = !!form.enabled;
      const percent = form.percent === '' ? null : Number(form.percent);
      const fromDate = form.fromDate || null;
      const toDate = form.toDate || null;

      if (enabled) {
        if (!percent || percent <= 0) throw new Error('Discount percent is required');
        if (!fromDate || !toDate) throw new Error('Discount from/to date is required');
      }

      const payload = {
        productId: productDetails.id,
        title: productDetails.title,
        description: productDetails.description,
        price: productDetails.price,
        keyFeatures: productDetails.keyFeatures,
        stock: productDetails.stock,
        sku: productDetails.sku,
        status: productDetails.status,
        categoryId: productDetails.categoryId,
        primaryImageUrl: productDetails.primaryImage,
        secondaryImageUrls: Array.isArray(productDetails.secondaryImages) ? productDetails.secondaryImages : [],
        productIncludes: Array.isArray(productDetails.productIncludes) ? productDetails.productIncludes : [],
        discount: enabled
          ? { enabled: true, percent, fromDate, toDate }
          : { enabled: false }
      };

      const path = '/backend/api/admin/update_product.php';
      const urls = getEndpointCandidates(path);
      let lastError = null;

      for (const url of urls) {
        try {
          const res = await fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const contentType = res.headers.get('content-type') || '';
          if (!contentType.toLowerCase().includes('application/json')) {
            const text = await res.text();
            const preview = text?.slice(0, 200) || '';
            throw new Error(`Invalid server response. ${preview}`);
          }

          const data = await readJsonSafe(res);
          if (!res.ok || data?.status !== 'success') {
            throw new Error(data?.message || 'Failed to update discount');
          }

          lastError = null;
          break;
        } catch (innerErr) {
          lastError = innerErr;
        }
      }

      if (lastError) throw lastError;

      toast.success('Discount updated');
      closeModal();
      await fetchProducts();
    } catch (e2) {
      toast.error(e2?.message || 'Failed to update discount');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
        <div>
          <h4 className="mb-1">Discounts & Promotions</h4>
          <p className="text-muted mb-0 small">Manage product-level discounts shown on your store.</p>
        </div>
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
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between">
            <div className="input-group input-group-sm" style={{ maxWidth: 420, width: '100%' }}>
              <span className="input-group-text" style={{ height: 31, display: 'flex', alignItems: 'center' }}>
                Search
              </span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Product name or description"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ height: 31 }}
              />
            </div>

            <div className="form-check form-switch mb-0" style={{ minHeight: 31, display: 'flex', alignItems: 'center' }}>
              <input
                className="form-check-input"
                type="checkbox"
                id="onlyDiscounted"
                checked={onlyDiscounted}
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="onlyDiscounted">
                Show only discounted products
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {loading && <p className="text-muted mb-0">Loading...</p>}
          {!loading && error && <p className="text-danger mb-0">{error}</p>}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th style={{ width: 150 }}>Price</th>
                    <th style={{ width: 220 }}>Discount</th>
                    <th style={{ width: 180 }}>Category</th>
                    <th style={{ width: 110 }}>Status</th>
                    <th style={{ width: 140 }} className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-muted">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    visibleProducts.map((p) => {
                      const d = p.discount;
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={p.primaryImage}
                                alt={p.title}
                                style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 8 }}
                              />
                              <div>
                                <div className="fw-semibold">{p.title}</div>
                                <div className="text-muted small">SKU: {p.sku || '—'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="fw-semibold">{moneyFmt(p.price)}</td>
                          <td>
                            {d ? (
                              <span className="badge text-bg-success">
                                <Tag size={14} className="me-1" />
                                {Number(d.percent || 0).toFixed(0)}% ({moneyFmt(d.amount)})
                              </span>
                            ) : (
                              <span className="badge text-bg-light text-muted">No discount</span>
                            )}
                          </td>
                          <td className="text-muted">{p.categoryName || '—'}</td>
                          <td>
                            {p.status === 1 ? (
                              <span className="badge text-bg-success">Active</span>
                            ) : (
                              <span className="badge text-bg-secondary">Inactive</span>
                            )}
                          </td>
                          <td className="text-end">
                            {canUpdateProduct && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => openManageDiscount(p.id)}
                                aria-label="Manage"
                                title="Manage"
                              >
                                <Pencil size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && !error && totalPages > 1 && (
          <div className="card-footer bg-white d-flex align-items-center justify-content-between">
            <div className="text-muted small">Page {page} of {totalPages}</div>
            <div className="btn-group btn-group-sm">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                Prev
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {activeModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Manage Discount</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} disabled={saving} />
                </div>

                <form onSubmit={submitDiscount}>
                  <div className="modal-body">
                    {detailLoading && <p className="text-muted mb-0">Loading product...</p>}
                    {!detailLoading && productDetails && (
                      <>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="fw-semibold">{productDetails.title}</div>
                          <div className="text-muted small">{moneyFmt(productDetails.price)}</div>
                        </div>

                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="discountEnabled"
                            checked={!!form.enabled}
                            onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.checked }))}
                          />
                          <label className="form-check-label" htmlFor="discountEnabled">
                            Enable discount
                          </label>
                        </div>

                        <div className="row g-2">
                          <div className="col-12">
                            <label className="form-label">Discount Percent</label>
                            <input
                              type="number"
                              className="form-control"
                              min="0"
                              step="0.01"
                              value={form.percent}
                              onChange={(e) => setForm((p) => ({ ...p, percent: e.target.value }))}
                              disabled={!form.enabled}
                              placeholder="e.g. 10"
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label className="form-label">From Date</label>
                            <input
                              type="date"
                              className="form-control"
                              value={form.fromDate}
                              onChange={(e) => setForm((p) => ({ ...p, fromDate: e.target.value }))}
                              disabled={!form.enabled}
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label className="form-label">To Date</label>
                            <input
                              type="date"
                              className="form-control"
                              value={form.toDate}
                              onChange={(e) => setForm((p) => ({ ...p, toDate: e.target.value }))}
                              disabled={!form.enabled}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={saving}>
                      <X size={16} className="me-2" />
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success" disabled={saving || detailLoading || !productDetails}>
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={saving ? undefined : closeModal} />
        </>
      )}
    </div>
  );
};

export default Discounts;

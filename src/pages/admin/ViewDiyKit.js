import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useHasPermission } from '../../rbac/useHasPermission';

const ViewDiyKit = () => {
  const API_PREFIX = `${process.env.PUBLIC_URL || ''}/backend`;

  const canUpdateProduct = useHasPermission('update.product');
  const canDeleteProduct = useHasPermission('delete.product');
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const readJsonSafe = async (response) => {
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      const preview = text?.slice(0, 200) || '';
      throw new Error(`Invalid server response. ${preview}`);
    }
  };

  const resolveImageUrl = useMemo(() => {
    return (url) => {
      if (!url) return '/images/placeholder-product.jpg';
      const s = String(url);
      if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')) return s;
      if (s.startsWith('/backend/')) return `${process.env.PUBLIC_URL || ''}${s}`;
      return s;
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setProduct(null);

      try {
        const response = await fetch(`${API_PREFIX}/api/admin/get_product.php?id=${encodeURIComponent(id || '')}`, {
          method: 'GET',
          credentials: 'include'
        });

        const data = await readJsonSafe(response);

        if (!response.ok || data?.status !== 'success') {
          throw new Error(data?.message || 'Failed to load product');
        }

        setProduct(data.product || null);
      } catch (e) {
        toast.error(e?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onEdit = () => {
    if (!id) return;
    navigate(`/admin/products/diy-kits/${encodeURIComponent(String(id))}/edit`);
  };

  const onDelete = () => {
    if (!id) return;
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!id) return;

    setDeleting(true);
    try {
      const res = await fetch(`${API_PREFIX}/api/admin/delete_product.php?id=${encodeURIComponent(String(id))}`, {
        method: 'POST',
        credentials: 'include'
      });

      const data = await readJsonSafe(res);
      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to delete product');
      }

      toast.success('Product deleted');
      navigate('/admin/products/diy-kits');
    } catch (e) {
      toast.error(e?.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const secondaryImages = Array.isArray(product?.secondaryImages) ? product.secondaryImages : [];

  return (
    <div className="admin-form-page pb-2">
      <div className="d-flex align-items-center justify-content-between mb-3 admin-page-header">
        <div>
          <h4 className="mb-0">View DIY Kit</h4>
          <div className="text-muted small">Product details</div>
        </div>
        <div className="d-flex gap-2">
          {canUpdateProduct && (
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={onEdit}>
              Edit
            </button>
          )}
          {canDeleteProduct && (
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={onDelete}>
              Delete
            </button>
          )}
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/products/diy-kits')}>
            Back
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted mb-0">Loading...</p>
      ) : !product ? (
        <p className="text-muted mb-0">Product not found.</p>
      ) : (
        <div className="row g-3">
          <div className="col-12 col-lg-5">
            <div className="card h-100">
              <div className="card-body">
                <div className="ratio ratio-4x3 bg-light" style={{ borderRadius: 16, overflow: 'hidden' }}>
                  <img
                    src={resolveImageUrl(product.primaryImage)}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-product.jpg';
                    }}
                  />
                </div>

                {secondaryImages.length > 0 && (
                  <div className="mt-3">
                    <div className="text-muted small mb-2">More images</div>
                    <div className="d-flex flex-wrap gap-2">
                      {secondaryImages.map((u) => (
                        <img
                          key={u}
                          src={resolveImageUrl(u)}
                          alt="Secondary"
                          style={{ height: 70, width: 70, objectFit: 'cover', borderRadius: 10 }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-product.jpg';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div style={{ minWidth: 0 }}>
                    <div className="text-muted small">Title</div>
                    <div className="fw-semibold" style={{ wordBreak: 'break-word' }}>
                      {product.title}
                    </div>
                  </div>
                  <span className={`badge ${product.status === 1 ? 'bg-success' : 'bg-secondary'}`}>{product.status === 1 ? 'Active' : 'Inactive'}</span>
                </div>

                <hr />

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="text-muted small">ID</div>
                    <div className="fw-semibold">{product.id}</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="text-muted small">SKU</div>
                    <div className="fw-semibold">{product.sku || '-'}</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Price</div>
                    <div className="fw-semibold">₹{Number(product.price || 0).toFixed(2)}</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Stock</div>
                    <div className="fw-semibold">{product.stock ?? 0}</div>
                  </div>
                  <div className="col-12">
                    <div className="text-muted small">Category</div>
                    <div className="fw-semibold">{product.categoryName || '-'}</div>
                  </div>
                  <div className="col-12">
                    <div className="text-muted small">Description</div>
                    <div className="fw-semibold" style={{ whiteSpace: 'pre-wrap' }}>
                      {product.description || '-'}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="text-muted small">Key Features</div>
                    <div className="fw-semibold" style={{ whiteSpace: 'pre-wrap' }}>
                      {product.keyFeatures || '-'}
                    </div>
                  </div>

                  {Array.isArray(product.productIncludes) && product.productIncludes.length > 0 && (
                    <div className="col-12">
                      <div className="text-muted small">Product Includes</div>
                      <ul className="mb-0">
                        {product.productIncludes.map((x) => (
                          <li key={x} className="fw-semibold">
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.discount && (
                    <div className="col-12">
                      <div className="text-muted small">Discount</div>
                      <div className="fw-semibold">
                        {Number(product.discount.percent || 0).toFixed(2)}% ({product.discount.fromDate} to {product.discount.toDate})
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeDeleteModal} />
                </div>
                <div className="modal-body">
                  <div className="text-muted">Are you sure you want to delete this product?</div>
                  {product?.title ? <div className="fw-semibold mt-2">{product.title}</div> : null}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeDeleteModal} disabled={deleting}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeDeleteModal} />
        </>
      )}
    </div>
  );
};

export default ViewDiyKit;

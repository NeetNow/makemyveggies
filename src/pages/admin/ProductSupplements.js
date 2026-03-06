import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useHasPermission } from '../../rbac/useHasPermission';

const SUPPLEMENTS_CATEGORIES = ['supplements', 'suppliments', 'supplement'];

const ProductSupplements = () => {
  const API_PREFIX = `${process.env.PUBLIC_URL || ''}/backend`;
  const ROWS_PER_PAGE = 9;

  const canAddProduct = useHasPermission('add.product');
  const canUpdateProduct = useHasPermission('update.product');
  const canDeleteProduct = useHasPermission('delete.product');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [statusFilter, setStatusFilter] = useState('all');
  const [childCategoryId, setChildCategoryId] = useState('');
  const [sort, setSort] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [supplementsCategoryId, setSupplementsCategoryId] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const navigate = useNavigate();

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
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_PREFIX}/api/admin/get_categories.php`, {
          method: 'GET',
          credentials: 'include'
        });

        const data = await readJsonSafe(res);
        if (!res.ok || data?.status !== 'success') {
          throw new Error(data?.message || 'Failed to load categories');
        }

        const list = Array.isArray(data.categories) ? data.categories : [];
        setCategories(list);

        const match = list.find((c) => SUPPLEMENTS_CATEGORIES.includes((c?.name || '').trim().toLowerCase()));
        if (match?.id) setSupplementsCategoryId(match.id);
      } catch (e) {
        toast.error(e?.message || 'Failed to load categories');
      }
    };

    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const supplementsResolvedCategoryId = useMemo(() => {
    if (supplementsCategoryId) return supplementsCategoryId;
    const match = categories.find((c) => SUPPLEMENTS_CATEGORIES.includes((c?.name || '').trim().toLowerCase()));
    return match?.id || null;
  }, [categories, supplementsCategoryId]);

  const supplementsChildCategories = useMemo(() => {
    if (!supplementsResolvedCategoryId) return [];
    return categories
      .filter((c) => Number(c?.parentId) === Number(supplementsResolvedCategoryId))
      .sort((a, b) => String(a?.name || '').localeCompare(String(b?.name || '')));
  }, [categories, supplementsResolvedCategoryId]);

  const offset = useMemo(() => (currentPage - 1) * ROWS_PER_PAGE, [currentPage]);

  const fetchProductsForCategory = async (categoryName) => {
    const qs = new URLSearchParams();
    qs.set('category', String(categoryName));
    qs.set('limit', String(ROWS_PER_PAGE));
    qs.set('offset', String(offset));
    if (search.trim()) qs.set('search', search.trim());
    if (statusFilter !== 'all') qs.set('status', String(statusFilter));
    if (sort) qs.set('sort', String(sort));

    const response = await fetch(`${API_PREFIX}/api/admin/get_products.php?${qs.toString()}`, {
      method: 'GET',
      credentials: 'include'
    });

    const data = await readJsonSafe(response);
    if (!response.ok || data?.status !== 'success') {
      throw new Error(data?.message || 'Failed to load supplements');
    }

    return data;
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      let data;
      if (childCategoryId) {
        data = await fetchProductsForCategory(childCategoryId);
      } else {
        data = await fetchProductsForCategory(SUPPLEMENTS_CATEGORIES[0]);
        const firstProducts = Array.isArray(data?.products) ? data.products : [];

        if (firstProducts.length === 0) {
          for (let i = 1; i < SUPPLEMENTS_CATEGORIES.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const nextData = await fetchProductsForCategory(SUPPLEMENTS_CATEGORIES[i]);
            const nextProducts = Array.isArray(nextData?.products) ? nextData.products : [];
            if (nextProducts.length > 0) {
              data = nextData;
              break;
            }
          }
        }
      }

      setProducts(Array.isArray(data.products) ? data.products : []);
      setTotalPages(data?.pagination?.totalPages ? Number(data.pagination.totalPages) : 1);
      setTotalCount(data?.pagination?.total ? Number(data.pagination.total) : 0);
    } catch (e) {
      setError(e?.message || 'Failed to load supplements');
      setProducts([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, childCategoryId, sort]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, search, statusFilter, childCategoryId, sort]);

  const openViewPage = (p) => {
    if (!p?.id) return;
    navigate(`/admin/products/supplements/${encodeURIComponent(String(p.id))}`);
  };

  const onEdit = (p) => {
    if (!p?.id) return;
    navigate(`/admin/products/supplements/${encodeURIComponent(String(p.id))}/edit`);
  };

  const onDelete = (p) => {
    if (!p?.id) return;
    setProductToDelete(p);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete?.id) return;

    setDeleting(true);
    try {
      const res = await fetch(`${API_PREFIX}/api/admin/delete_product.php?id=${encodeURIComponent(String(productToDelete.id))}`, {
        method: 'POST',
        credentials: 'include'
      });

      const data = await readJsonSafe(res);
      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to delete product');
      }

      toast.success('Product deleted');
      fetchProducts();
      closeDeleteModal();
    } catch (e) {
      toast.error(e?.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Supplements</h4>
        {canAddProduct && (
          <button type="button" className="btn btn-success btn-sm" onClick={() => navigate('/admin/products/supplements/add')}>
            Add Supplement
          </button>
        )}
      </div>

      <div className="card mb-3">
        <div className="card-body py-2">
          <div className="row g-2">
            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label mb-1 small text-muted">Search</label>
              <input
                className="form-control form-control-sm"
                style={{ height: 31 }}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label mb-1 small text-muted">Status</label>
              <select
                className="form-select form-select-sm"
                style={{ height: 31 }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label mb-1 small text-muted">Category</label>
              <select
                className="form-select form-select-sm"
                style={{ height: 31 }}
                value={childCategoryId}
                onChange={(e) => setChildCategoryId(e.target.value)}
              >
                <option value="">All Supplements</option>
                {supplementsChildCategories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label mb-1 small text-muted">Sort</label>
              <select className="form-select form-select-sm" style={{ height: 31 }} value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name_asc">Name: A-Z</option>
                <option value="name_desc">Name: Z-A</option>
              </select>
            </div>

            <div className="col-12">
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mt-1">
                <div className="text-muted small">Total: {totalCount}</div>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  style={{ height: 31 }}
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                    setChildCategoryId('');
                    setSort('newest');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && <p className="text-muted mb-0">Loading...</p>}
      {!loading && error && <p className="text-danger mb-0">{error}</p>}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-muted">No supplements found.</div>
          ) : (
            <div className="row g-3">
              {products.map((p) => {
                const img = resolveImageUrl(p?.primaryImage);
                return (
                  <div key={p.id} className="col-12 col-sm-6 col-lg-4">
                    <div
                      className="card admin-product-card h-100"
                      role="button"
                      tabIndex={0}
                      onClick={() => openViewPage(p)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') openViewPage(p);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className="ratio ratio-4x3 bg-light"
                        style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden' }}
                      >
                        <img
                          src={img}
                          alt={p.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-product.jpg';
                          }}
                        />
                      </div>

                      <div className="card-body d-flex flex-column">
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <div className="flex-grow-1" style={{ minWidth: 0 }}>
                            <div className="fw-semibold text-truncate" title={p.title}>
                              {p.title}
                            </div>
                            <div className="text-muted small text-truncate" title={p.categoryName || ''}>
                              {p.categoryName || '—'}
                            </div>
                          </div>

                          <span className={`badge ${p.status === 1 ? 'bg-success' : 'bg-secondary'}`}>
                            {p.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="mt-2 d-flex align-items-center justify-content-between">
                          <div className="fw-semibold">₹{Number(p.price || 0).toFixed(2)}</div>
                          <div className="text-muted small">Stock: {p.stock ?? 0}</div>
                        </div>

                        {(canUpdateProduct || canDeleteProduct) && (
                          <div className="mt-3 d-flex gap-2">
                            {canUpdateProduct && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(p);
                                }}
                                aria-label="Edit"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                            )}
                            {canDeleteProduct && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(p);
                                }}
                                aria-label="Delete"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-between mt-3">
              <div className="text-muted small">
                Page {currentPage} of {totalPages}
              </div>

              <nav aria-label="Supplements pagination">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button type="button" className="page-link" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                      Prev
                    </button>
                  </li>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        <button type="button" className="page-link" onClick={() => setCurrentPage(page)}>
                          {page}
                        </button>
                      </li>
                    );
                  })}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button type="button" className="page-link" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
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
                  {productToDelete?.title ? <div className="fw-semibold mt-2">{productToDelete.title}</div> : null}
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

export default ProductSupplements;

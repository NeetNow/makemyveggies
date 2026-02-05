import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const SUPPLEMENTS_CATEGORY_NAMES = ['supplements', 'suppliments', 'supplement'];

const EditSupplement = () => {
  const API_BASE = process.env.REACT_APP_API_BASE || 'https://dev.makemyveggies.com/';

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingSecondary, setUploadingSecondary] = useState(false);

  const [categories, setCategories] = useState([]);
  const [supplementsCategoryId, setSupplementsCategoryId] = useState(null);

  const [primaryFile, setPrimaryFile] = useState(null);
  const [primaryPreviewUrl, setPrimaryPreviewUrl] = useState('');

  const [secondaryFiles, setSecondaryFiles] = useState([]);
  const [secondaryPreviewUrls, setSecondaryPreviewUrls] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    feature: '',
    productIncludes: '',
    price: '',
    hasDiscount: 'no',
    discountPercent: '',
    discountFromDate: '',
    discountToDate: '',
    categoryId: '',
    stock: '0',
    sku: '',
    status: '1',
    primaryImageUrl: '',
    secondaryImageUrls: []
  });

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
      if (s.startsWith('/backend/')) return `${API_BASE}${s}`;
      return s;
    };
  }, [API_BASE]);

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append('image', file);

    const res = await fetch(`${API_BASE}/backend/api/admin/upload_product_image.php`, {
      method: 'POST',
      credentials: 'include',
      body: fd
    });

    const data = await readJsonSafe(res);
    if (!res.ok || data?.status !== 'success' || !data?.url) {
      throw new Error(data?.message || 'Failed to upload image');
    }
    return String(data.url);
  };

  const resolvedCategoryId = useMemo(() => {
    if (supplementsCategoryId) return supplementsCategoryId;
    const match = categories.find((c) => SUPPLEMENTS_CATEGORY_NAMES.includes((c?.name || '').trim().toLowerCase()));
    return match?.id || null;
  }, [categories, supplementsCategoryId]);

  const supplementsChildCategories = useMemo(() => {
    if (!resolvedCategoryId) return [];
    return categories
      .filter((c) => Number(c?.parentId) === Number(resolvedCategoryId))
      .sort((a, b) => String(a?.name || '').localeCompare(String(b?.name || '')));
  }, [categories, resolvedCategoryId]);

  const basePrice = useMemo(() => {
    const v = Number(form.price);
    return Number.isFinite(v) ? v : 0;
  }, [form.price]);

  const discountPercentNum = useMemo(() => {
    const v = Number(form.discountPercent);
    return Number.isFinite(v) ? v : 0;
  }, [form.discountPercent]);

  const discountCalc = useMemo(() => {
    if (form.hasDiscount !== 'yes') return null;
    if (!basePrice || basePrice <= 0) return null;
    if (!discountPercentNum || discountPercentNum <= 0) return null;
    if (discountPercentNum > 100) return null;

    const savings = (basePrice * discountPercentNum) / 100;
    const finalPrice = Math.max(0, basePrice - savings);
    return {
      savings,
      finalPrice
    };
  }, [basePrice, discountPercentNum, form.hasDiscount]);

  useEffect(() => {
    if (!primaryFile) {
      if (primaryPreviewUrl) URL.revokeObjectURL(primaryPreviewUrl);
      setPrimaryPreviewUrl('');
      return;
    }

    const u = URL.createObjectURL(primaryFile);
    if (primaryPreviewUrl) URL.revokeObjectURL(primaryPreviewUrl);
    setPrimaryPreviewUrl(u);

    return () => {
      URL.revokeObjectURL(u);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryFile]);

  useEffect(() => {
    if (secondaryPreviewUrls.length) {
      secondaryPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
    }

    const next = secondaryFiles.map((f) => URL.createObjectURL(f));
    setSecondaryPreviewUrls(next);

    return () => {
      next.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondaryFiles]);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);

      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_BASE}/backend/api/admin/get_categories.php`, {
            method: 'GET',
            credentials: 'include'
          }),
          fetch(`${API_BASE}/backend/api/admin/get_product.php?id=${encodeURIComponent(id || '')}`, {
            method: 'GET',
            credentials: 'include'
          })
        ]);

        const catData = await readJsonSafe(catRes);
        if (!catRes.ok || catData?.status !== 'success') {
          throw new Error(catData?.message || 'Failed to load categories');
        }

        const prodData = await readJsonSafe(prodRes);
        if (!prodRes.ok || prodData?.status !== 'success') {
          throw new Error(prodData?.message || 'Failed to load product');
        }

        const list = Array.isArray(catData.categories) ? catData.categories : [];
        setCategories(list);

        const match = list.find((c) => SUPPLEMENTS_CATEGORY_NAMES.includes((c?.name || '').trim().toLowerCase()));
        if (match?.id) setSupplementsCategoryId(match.id);

        const p = prodData.product;
        const includesText = Array.isArray(p?.productIncludes) ? p.productIncludes.join('\n') : '';

        setForm((prev) => ({
          ...prev,
          title: p?.title || '',
          description: p?.description || '',
          feature: p?.keyFeatures || '',
          productIncludes: includesText,
          price: p?.price !== undefined && p?.price !== null ? String(p.price) : '',
          hasDiscount: p?.discount ? 'yes' : 'no',
          discountPercent: p?.discount ? String(p.discount.percent ?? '') : '',
          discountFromDate: p?.discount ? String(p.discount.fromDate ?? '') : '',
          discountToDate: p?.discount ? String(p.discount.toDate ?? '') : '',
          categoryId: p?.categoryId ? String(p.categoryId) : '',
          stock: p?.stock !== undefined && p?.stock !== null ? String(p.stock) : '0',
          sku: p?.sku || '',
          status: p?.status !== undefined && p?.status !== null ? String(p.status) : '1',
          primaryImageUrl: p?.primaryImage || '',
          secondaryImageUrls: Array.isArray(p?.secondaryImages) ? p.secondaryImages : []
        }));
      } catch (e) {
        toast.error(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!form.categoryId && supplementsChildCategories.length > 0) {
      setForm((p) => ({ ...p, categoryId: String(supplementsChildCategories[0].id) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplementsChildCategories.length]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!resolvedCategoryId) {
      toast.error('Supplements category not found. Please create it in Categories first.');
      return;
    }

    if (supplementsChildCategories.length === 0) {
      toast.error('No child categories found under Supplements. Please create Supplements child categories first.');
      return;
    }

    if (!form.categoryId) {
      toast.error('Please select a category');
      return;
    }

    if (form.hasDiscount === 'yes') {
      const percent = Number(form.discountPercent);
      if (!percent || percent <= 0) {
        toast.error('Please enter discount percentage');
        return;
      }
      if (percent > 100) {
        toast.error('Discount percentage cannot be greater than 100');
        return;
      }
      if (!form.discountFromDate || !form.discountToDate) {
        toast.error('Please select discount from/to dates');
        return;
      }
    }

    if (!primaryFile && !form.primaryImageUrl) {
      toast.error('Primary image is required');
      return;
    }

    setSaving(true);

    try {
      let primaryImageUrl = form.primaryImageUrl;
      if (primaryFile) {
        setUploadingPrimary(true);
        primaryImageUrl = await uploadImage(primaryFile);
      }

      let secondaryImageUrls = Array.isArray(form.secondaryImageUrls) ? [...form.secondaryImageUrls] : [];
      if (secondaryFiles.length > 0) {
        setUploadingSecondary(true);
        const uploaded = [];
        for (const f of secondaryFiles) {
          // eslint-disable-next-line no-await-in-loop
          uploaded.push(await uploadImage(f));
        }
        secondaryImageUrls = [...secondaryImageUrls, ...uploaded];
      }

      const includesArray = String(form.productIncludes || '')
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        productId: Number(id),
        title: form.title,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        sku: form.sku,
        status: Number(form.status),
        keyFeatures: form.feature,
        primaryImageUrl,
        secondaryImageUrls,
        categoryId: Number(form.categoryId),
        productIncludes: includesArray,
        discount: {
          enabled: form.hasDiscount === 'yes',
          percent: form.discountPercent === '' ? null : Number(form.discountPercent),
          fromDate: form.discountFromDate || null,
          toDate: form.discountToDate || null
        }
      };

      const res = await fetch(`${API_BASE}/backend/api/admin/update_product.php`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await readJsonSafe(res);
      if (!res.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to update product');
      }

      toast.success('Product updated successfully');
      navigate(`/admin/products/supplements/${encodeURIComponent(String(id))}`);
    } catch (e2) {
      toast.error(e2?.message || 'Failed to update product');
    } finally {
      setUploadingPrimary(false);
      setUploadingSecondary(false);
      setSaving(false);
      setSecondaryFiles([]);
    }
  };

  return (
    <div className="admin-form-page pb-2">
      <div className="d-flex align-items-center justify-content-between mb-3 admin-page-header">
        <div>
          <h4 className="mb-0">Edit Supplement</h4>
          <div className="text-muted small">Update product details</div>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate(`/admin/products/supplements/${encodeURIComponent(String(id || ''))}`)}>
          Back
        </button>
      </div>

      {loading ? (
        <p className="text-muted mb-0">Loading...</p>
      ) : (
        <form onSubmit={onSubmit} className="admin-form" style={{ maxWidth: 1100 }}>
          <div className="row g-3 admin-form__row">
            <div className="col-12 col-lg-8">
              <label className="form-label">Title</label>
              <input className="form-control" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
            </div>

            <div className="col-12 col-lg-4">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={4} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
            </div>

            <div className="col-12">
              <label className="form-label">Feature</label>
              <textarea className="form-control" rows={3} value={form.feature} onChange={(e) => setForm((p) => ({ ...p, feature: e.target.value }))} />
            </div>

            <div className="col-12">
              <label className="form-label">Product Includes</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="One item per line"
                value={form.productIncludes}
                onChange={(e) => setForm((p) => ({ ...p, productIncludes: e.target.value }))}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="form-label">Price</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                required
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="form-label">Offer / Discount</label>
              <select
                className="form-select"
                value={form.hasDiscount}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    hasDiscount: e.target.value,
                    discountPercent: e.target.value === 'yes' ? p.discountPercent : '',
                    discountFromDate: e.target.value === 'yes' ? p.discountFromDate : '',
                    discountToDate: e.target.value === 'yes' ? p.discountToDate : ''
                  }))
                }
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={form.categoryId}
                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                required
              >
                <option value="">Select category</option>
                {supplementsChildCategories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="form-text">Only Supplements child categories are shown.</div>
            </div>

            {form.hasDiscount === 'yes' && (
              <>
                <div className="col-12 col-md-4">
                  <label className="form-label">Discount %</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="form-control"
                    value={form.discountPercent}
                    onChange={(e) => setForm((p) => ({ ...p, discountPercent: e.target.value }))}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.discountFromDate}
                    onChange={(e) => setForm((p) => ({ ...p, discountFromDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.discountToDate}
                    onChange={(e) => setForm((p) => ({ ...p, discountToDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="col-12">
                  <div className="p-3 border rounded bg-white">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="text-muted small">Discount Calculation</div>
                      <div className="text-muted small">Based on entered Price</div>
                    </div>

                    {discountCalc ? (
                      <div className="row g-2 mt-1">
                        <div className="col-12 col-md-4">
                          <div className="text-muted small">You Save</div>
                          <div className="fw-semibold">₹{Number(discountCalc.savings || 0).toFixed(2)}</div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="text-muted small">Final Price</div>
                          <div className="fw-semibold">₹{Number(discountCalc.finalPrice || 0).toFixed(2)}</div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="text-muted small">Original Price</div>
                          <div className="fw-semibold">₹{Number(basePrice || 0).toFixed(2)}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted small mt-2">Enter Price and Discount % to see the final price.</div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="col-12 col-md-6">
              <label className="form-label">Stock</label>
              <input type="number" className="form-control" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">SKU ID</label>
              <input className="form-control" value={form.sku} onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))} />
            </div>

            <div className="col-12">
              <label className="form-label">Primary Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                  setPrimaryFile(f);
                }}
              />
              {primaryPreviewUrl ? (
                <div className="mt-2">
                  <img src={primaryPreviewUrl} alt="Primary preview" style={{ height: 70, width: 70, objectFit: 'cover', borderRadius: 10 }} />
                </div>
              ) : form.primaryImageUrl ? (
                <div className="mt-2">
                  <img src={resolveImageUrl(form.primaryImageUrl)} alt="Primary" style={{ height: 70, width: 70, objectFit: 'cover', borderRadius: 10 }} />
                </div>
              ) : null}
              {uploadingPrimary ? <div className="form-text">Uploading primary image...</div> : null}
            </div>

            <div className="col-12">
              <label className="form-label">Secondary Images</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files) : [];
                  setSecondaryFiles(files);
                }}
              />

              {Array.isArray(form.secondaryImageUrls) && form.secondaryImageUrls.length ? (
                <div className="mt-2">
                  <div className="text-muted small mb-2">Existing images</div>
                  <div className="d-flex flex-wrap gap-2">
                    {form.secondaryImageUrls.map((u, idx) => (
                      <div key={`${u}-${idx}`} style={{ position: 'relative' }}>
                        <img src={resolveImageUrl(u)} alt={`Secondary ${idx + 1}`} style={{ height: 70, width: 70, objectFit: 'cover', borderRadius: 10 }} />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          style={{ position: 'absolute', top: -8, right: -8, borderRadius: 999 }}
                          onClick={() => {
                            setForm((p) => ({
                              ...p,
                              secondaryImageUrls: (p.secondaryImageUrls || []).filter((_, i) => i !== idx)
                            }));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {secondaryPreviewUrls.length ? (
                <div className="mt-2">
                  <div className="text-muted small mb-2">New selected images (will be uploaded)</div>
                  <div className="d-flex flex-wrap gap-2">
                    {secondaryPreviewUrls.map((u, idx) => (
                      <div key={u} style={{ position: 'relative' }}>
                        <img src={u} alt={`New secondary ${idx + 1}`} style={{ height: 70, width: 70, objectFit: 'cover', borderRadius: 10 }} />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          style={{ position: 'absolute', top: -8, right: -8, borderRadius: 999 }}
                          onClick={() => {
                            setSecondaryFiles((prev) => prev.filter((_, i) => i !== idx));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {uploadingSecondary ? <div className="form-text">Uploading secondary images...</div> : null}
            </div>

            <div className="col-12 d-flex gap-2">
              <button type="submit" className="btn btn-success" disabled={saving || uploadingPrimary || uploadingSecondary}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-outline-secondary" disabled={saving} onClick={() => navigate(`/admin/products/supplements/${encodeURIComponent(String(id || ''))}`)}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditSupplement;

import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeModal, setActiveModal] = useState(null); // 'add' | 'view' | 'edit' | 'delete' | null
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    parentId: ''
  });

  const closeModal = () => {
    setActiveModal(null);
    setSelectedCategory(null);
    setModalError('');
    setIsSubmitting(false);
  };

  const API_BASE = process.env.REACT_APP_API_BASE || 'https://dev.makemyveggies.com/';

  const readJsonSafe = async (response) => {
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      const preview = text?.slice(0, 200) || '';
      throw new Error(`Invalid server response. ${preview}`);
    }
  };

  const openAddModal = () => {
    setSelectedCategory(null);
    setForm({ name: '', description: '', parentId: '' });
    setModalError('');
    setActiveModal('add');
  };

  const openEditModal = (cat) => {
    setSelectedCategory(cat);
    setForm({
      name: cat?.name || '',
      description: cat?.description || '',
      parentId: cat?.parentId ?? ''
    });
    setModalError('');
    setActiveModal('edit');
  };

  const openViewModal = (cat) => {
    setSelectedCategory(cat);
    setModalError('');
    setActiveModal('view');
  };

  const openDeleteModal = (cat) => {
    setSelectedCategory(cat);
    setModalError('');
    setActiveModal('delete');
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/backend/api/get_categories.php`, {
        method: 'GET',
        credentials: 'include'
      });

      const data = await readJsonSafe(response);

      if (!response.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to load categories');
      }

      setCategories(Array.isArray(data.categories) ? data.categories : []);
    } catch (e) {
      setError(e?.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const submitAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError('');

    try {
      const response = await fetch(`${API_BASE}/backend/api/add_category.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          parentId: form.parentId === '' ? null : Number(form.parentId)
        })
      });

      const data = await readJsonSafe(response);

      if (!response.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to add category');
      }

      await fetchCategories();
      closeModal();
      toast.success('Category added successfully');
    } catch (e2) {
      setModalError(e2?.message || 'Failed to add category');
      toast.error(e2?.message || 'Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!selectedCategory?.id) return;

    setIsSubmitting(true);
    setModalError('');

    try {
      const response = await fetch(`${API_BASE}/backend/api/update_category.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedCategory.id,
          name: form.name,
          description: form.description,
          parentId: form.parentId === '' ? null : Number(form.parentId)
        })
      });

      const data = await readJsonSafe(response);

      if (!response.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to update category');
      }

      await fetchCategories();
      closeModal();
      toast.success('Category updated successfully');
    } catch (e2) {
      setModalError(e2?.message || 'Failed to update category');
      toast.error(e2?.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitDelete = async () => {
    if (!selectedCategory?.id) return;

    setIsSubmitting(true);
    setModalError('');

    try {
      const response = await fetch(`${API_BASE}/backend/api/delete_category.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: selectedCategory.id })
      });

      const data = await readJsonSafe(response);

      if (!response.ok || data?.status !== 'success') {
        throw new Error(data?.message || 'Failed to delete category');
      }

      await fetchCategories();
      closeModal();
      toast.success('Category deleted successfully');
    } catch (e2) {
      setModalError(e2?.message || 'Failed to delete category');
      toast.error(e2?.message || 'Failed to delete category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Categories</h4>
        <button type="button" className="btn btn-sm btn-success" onClick={openAddModal}>
          Add Category
        </button>
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
                    <th style={{ width: 90 }}>Sr No</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th style={{ width: 170 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-muted">
                        No categories found.
                      </td>
                    </tr>
                  ) : (
                    categories.map((c, idx) => (
                      <tr key={c.id}>
                        <td>{idx + 1}</td>
                        <td className="fw-semibold">{c.name}</td>
                        <td className="text-muted">{c.description || '-'}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => openViewModal(c)}
                              aria-label="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openEditModal(c)}
                              aria-label="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => openDeleteModal(c)}
                              aria-label="Delete"
                            >
                              <Trash2 size={16} />
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
      </div>

      {activeModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {activeModal === 'add' && 'Add Category'}
                    {activeModal === 'view' && 'View Category'}
                    {activeModal === 'edit' && 'Edit Category'}
                    {activeModal === 'delete' && 'Delete Category'}
                  </h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
                </div>

                {activeModal === 'view' ? (
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <div className="text-muted small">ID</div>
                        <div className="fw-semibold">{selectedCategory?.id ?? '-'}</div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="text-muted small">Product Count</div>
                        <div className="fw-semibold">{selectedCategory?.productCount ?? 0}</div>
                      </div>
                      <div className="col-12">
                        <div className="text-muted small">Name</div>
                        <div className="fw-semibold">{selectedCategory?.name || '-'}</div>
                      </div>
                      <div className="col-12">
                        <div className="text-muted small">Description</div>
                        <div className="fw-semibold">{selectedCategory?.description || '-'}</div>
                      </div>
                      <div className="col-12">
                        <div className="text-muted small">Parent</div>
                        <div className="fw-semibold">{selectedCategory?.parentId ?? '-'}</div>
                      </div>
                    </div>
                  </div>
                ) : activeModal === 'delete' ? (
                  <div className="modal-body">
                    <p className="mb-0">
                      Are you sure you want to delete <strong>{selectedCategory?.name}</strong>?
                    </p>
                  </div>
                ) : (
                  <form onSubmit={activeModal === 'add' ? submitAdd : submitEdit}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={form.description}
                          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        />
                      </div>

                      <div className="mb-0">
                        <label className="form-label">Parent Category (optional)</label>
                        <select
                          className="form-select"
                          value={form.parentId}
                          onChange={(e) => setForm((p) => ({ ...p, parentId: e.target.value }))}
                        >
                          <option value="">None</option>
                          {categories
                            .filter((c) => (activeModal === 'edit' ? c.id !== selectedCategory?.id : true))
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                )}

                {activeModal === 'view' && (
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                )}

                {activeModal === 'delete' && (
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-danger" onClick={submitDelete} disabled={isSubmitting}>
                      {isSubmitting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeModal} />
        </>
      )}
    </div>
  );
};

export default Categories;

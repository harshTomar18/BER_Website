import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileText,
  Save,
  X
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { blogApi } from '../../api';
import '../styles/AdminCategories.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  // New Category Form
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState('#16a1ce');
  const [creating, setCreating] = useState(false);

  // Editing Category
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editColor, setEditColor] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await blogApi.getAdminCategories();
      if (res?.success && res?.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showNotification = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('Please enter a category name.');
      return;
    }

    setCreating(true);
    try {
      const res = await blogApi.createCategory({
        name: newName.trim(),
        description: newDesc.trim(),
        color: newColor.trim(),
      });

      if (res.success) {
        setNewName('');
        setNewDesc('');
        showNotification('Category created successfully.');
        fetchCategories();
      }
    } catch (err) {
      alert(err.message || 'Failed to create category.');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditDesc(cat.description || '');
    setEditColor(cat.color || '#16a1ce');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) {
      alert('Category name is required.');
      return;
    }

    setUpdating(true);
    try {
      const res = await blogApi.updateCategory(id, {
        name: editName.trim(),
        description: editDesc.trim(),
        color: editColor.trim(),
      });

      if (res.success) {
        showNotification('Category updated successfully.');
        setEditingId(null);
        fetchCategories();
      }
    } catch (err) {
      alert(err.message || 'Failed to update category.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }

    try {
      const res = await blogApi.deleteCategory(id);
      if (res.success) {
        showNotification(`Category "${name}" deleted.`);
        fetchCategories();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete category.');
    }
  };

  return (
    <AdminLayout activeTab="categories">
      <div className="act-container">
        {/* Top Header */}
        <div className="act-top-bar">
          <div className="act-top-left">
            <Link to="/admin/blogs" className="act-back-link">
              <ArrowLeft size={16} />
              <span>Articles</span>
            </Link>
            <h1 className="act-main-title">Taxonomy & Categories</h1>
          </div>

          <Link to="/admin/blogs/new" className="act-btn-new-article">
            <Plus size={15} />
            <span>Compose Article</span>
          </Link>
        </div>

        {/* Notices */}
        {notice && (
          <div className="act-alert act-alert--success">
            <CheckCircle size={18} />
            <span>{notice}</span>
          </div>
        )}

        {error && (
          <div className="act-alert act-alert--error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="act-grid">
          {/* Create New Category Card */}
          <div className="act-create-card">
            <h2 className="act-card-title">Add Universal Category</h2>
            <p className="act-card-sub">
              Define new topical categories for organizing content, search filter tabs, and SEO clusters.
            </p>

            <form onSubmit={handleCreate} className="act-form">
              <div className="act-field">
                <label className="act-label">Category Name *</label>
                <input
                  type="text"
                  className="act-input"
                  placeholder="e.g. Artificial Intelligence"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="act-field">
                <label className="act-label">Description (Optional)</label>
                <textarea
                  className="act-textarea"
                  placeholder="Brief summary of topics covered under this taxonomy..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="act-field">
                <label className="act-label">Accent Color</label>
                <div className="act-color-picker">
                  <input
                    type="color"
                    className="act-color-input"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                  />
                  <span className="act-color-hex">{newColor}</span>
                </div>
              </div>

              <button type="submit" className="act-btn-create" disabled={creating}>
                <Plus size={16} />
                <span>{creating ? 'Creating...' : 'Create Category'}</span>
              </button>
            </form>
          </div>

          {/* Existing Categories Listing */}
          <div className="act-list-card">
            <h2 className="act-card-title">
              Active Taxonomies ({categories.length})
            </h2>

            {loading ? (
              <div className="act-loading">
                <div className="act-spinner"></div>
                <p>Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="act-empty">
                <Layers size={36} />
                <p>No categories found. Create your first category above.</p>
              </div>
            ) : (
              <div className="act-items-list">
                {categories.map((cat) => {
                  const isEditing = editingId === cat._id;

                  return (
                    <div key={cat._id} className="act-item">
                      {isEditing ? (
                        <div className="act-item__edit-box">
                          <input
                            type="text"
                            className="act-input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                          <textarea
                            className="act-textarea act-textarea--sm"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            placeholder="Description"
                          />
                          <div className="act-edit-actions">
                            <button
                              type="button"
                              className="act-btn-save"
                              onClick={() => handleUpdate(cat._id)}
                              disabled={updating}
                            >
                              <Save size={14} />
                              <span>{updating ? 'Saving...' : 'Save'}</span>
                            </button>
                            <button
                              type="button"
                              className="act-btn-cancel"
                              onClick={cancelEdit}
                            >
                              <X size={14} />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="act-item__left">
                            <span
                              className="act-color-dot"
                              style={{ backgroundColor: cat.color || '#16a1ce' }}
                            ></span>
                            <div className="act-item__details">
                              <div className="act-item__name-row">
                                <h3 className="act-item__name">{cat.name}</h3>
                                <span className="act-item__count">
                                  {cat.articleCount || 0} published ({cat.totalCount || 0} total)
                                </span>
                              </div>
                              <span className="act-item__slug">/{cat.slug}</span>
                              {cat.description && (
                                <p className="act-item__desc">{cat.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="act-item__actions">
                            <button
                              type="button"
                              className="act-btn-action"
                              onClick={() => startEdit(cat)}
                              title="Edit Category"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              className="act-btn-action act-btn-action--delete"
                              onClick={() => handleDelete(cat._id, cat.name)}
                              title="Delete Category"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit3,
  Star,
  CheckCircle2,
  XCircle,
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Info,
  ExternalLink,
  Tag
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { faqApi } from '../../api';
import '../styles/AdminFaqManager.css';

export default function AdminFaqManager() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null); // null = creating, object = editing
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formOrder, setFormOrder] = useState(1);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formIsLandingFeatured, setFormIsLandingFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all FAQs for Admin
  const fetchFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await faqApi.getAdminFaqs();
      if (res?.success && Array.isArray(res?.data?.faqs)) {
        setFaqs(res.data.faqs);
      } else {
        setFaqs([]);
      }
    } catch (err) {
      console.error('Error fetching admin FAQs:', err);
      setError(err?.message || 'Failed to fetch FAQs from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const showNotification = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Distinct categories list
  const existingCategories = useMemo(() => {
    const set = new Set(['General', 'Process & Timelines', 'Support & SLA', 'Technical & SEO', 'Billing & Pricing']);
    faqs.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set);
  }, [faqs]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCat =
        selectedCategory === 'ALL' ||
        faq.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        faq.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingFaq(null);
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('General');
    setFormCustomCategory('');
    setFormOrder(faqs.length + 1);
    setFormIsActive(true);
    setFormIsLandingFeatured(faqs.length === 0); // auto-feature if first item
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (faq) => {
    setEditingFaq(faq);
    setFormQuestion(faq.question || '');
    setFormAnswer(faq.answer || '');
    if (existingCategories.includes(faq.category)) {
      setFormCategory(faq.category || 'General');
      setFormCustomCategory('');
    } else {
      setFormCategory('OTHER');
      setFormCustomCategory(faq.category || '');
    }
    setFormOrder(faq.order ?? 1);
    setFormIsActive(faq.isActive !== false);
    setFormIsLandingFeatured(Boolean(faq.isLandingFeatured));
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formQuestion.trim()) {
      alert('Please enter the question text.');
      return;
    }
    if (!formAnswer.trim()) {
      alert('Please enter the answer text.');
      return;
    }

    const resolvedCategory =
      formCategory === 'OTHER'
        ? formCustomCategory.trim() || 'General'
        : formCategory;

    const payload = {
      question: formQuestion.trim(),
      answer: formAnswer.trim(),
      category: resolvedCategory,
      order: Number(formOrder) || 1,
      isActive: Boolean(formIsActive),
      isLandingFeatured: Boolean(formIsLandingFeatured),
    };

    setSubmitting(true);
    try {
      if (editingFaq) {
        // Update
        const res = await faqApi.updateFaq(editingFaq._id, payload);
        if (res?.success) {
          showNotification('FAQ item updated successfully.');
          handleCloseModal();
          fetchFaqs();
        } else {
          alert(res?.message || 'Failed to update FAQ');
        }
      } else {
        // Create
        const res = await faqApi.createFaq(payload);
        if (res?.success) {
          showNotification('New FAQ item created successfully.');
          handleCloseModal();
          fetchFaqs();
        } else {
          alert(res?.message || 'Failed to create FAQ');
        }
      }
    } catch (err) {
      console.error('Save FAQ error:', err);
      alert(err?.message || 'Error occurred while saving FAQ.');
    } finally {
      setSubmitting(false);
    }
  };

  // Fast Toggle Active / Published status
  const handleToggleActive = async (faq) => {
    try {
      const res = await faqApi.updateFaq(faq._id, { isActive: !faq.isActive });
      if (res?.success) {
        setFaqs((prev) =>
          prev.map((item) =>
            item._id === faq._id ? { ...item, isActive: !item.isActive } : item
          )
        );
        showNotification(`FAQ marked as ${!faq.isActive ? 'Active' : 'Inactive'}.`);
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      alert('Failed to update status.');
    }
  };

  // Fast Toggle Landing Featured status (Ensure only ONE is featured)
  const handleToggleLandingFeatured = async (faq) => {
    try {
      const newFeaturedState = !faq.isLandingFeatured;
      const res = await faqApi.updateFaq(faq._id, { isLandingFeatured: newFeaturedState });
      if (res?.success) {
        setFaqs((prev) =>
          prev.map((item) => ({
            ...item,
            isLandingFeatured: item._id === faq._id ? newFeaturedState : false,
          }))
        );
        if (newFeaturedState) {
          showNotification('Set as the ONE Featured FAQ for Landing Page!');
        } else {
          showNotification('Unset from Landing Page featured slot.');
        }
      }
    } catch (err) {
      console.error('Toggle landing featured error:', err);
      alert('Failed to update landing featured status.');
    }
  };

  // Delete FAQ
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this FAQ item?')) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await faqApi.deleteFaq(id);
      if (res?.success) {
        showNotification('FAQ item deleted.');
        fetchFaqs();
      } else {
        alert(res?.message || 'Failed to delete FAQ.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete FAQ item.');
    } finally {
      setDeletingId(null);
    }
  };

  // Quick Order Up / Down
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const copy = [...faqs];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // Recalculate order values
    const items = copy.map((item, idx) => ({
      id: item._id,
      order: idx + 1,
    }));

    setFaqs(copy.map((item, idx) => ({ ...item, order: idx + 1 })));

    try {
      await faqApi.reorderFaqs(items);
      showNotification('FAQ display order updated.');
    } catch (err) {
      console.error('Reorder error:', err);
      fetchFaqs();
    }
  };

  // Stats
  const activeCount = faqs.filter((f) => f.isActive).length;
  const currentLandingFaq = faqs.find((f) => f.isLandingFeatured && f.isActive) || faqs.find((f) => f.isLandingFeatured);

  return (
    <AdminLayout activeTab="faqs">
      <div className="afm-container">
        {/* Top Header & Breadcrumb */}
        <div className="afm-top-bar">
          <div className="afm-top-left">
            <div className="afm-header-badge">
              <HelpCircle size={18} />
              <span>Universal Content Hub</span>
            </div>
            <h1 className="afm-main-title">FAQ Manager</h1>
            <p className="afm-subtitle">
              Manage Frequently Asked Questions across all pages. Controls the single featured FAQ shown on the Landing Page.
            </p>
          </div>

          <div className="afm-top-actions">
            <button
              type="button"
              className="afm-btn-refresh"
              onClick={fetchFaqs}
              title="Refresh FAQ list"
            >
              <RefreshCw size={16} className={loading ? 'afm-spin' : ''} />
              <span>Refresh</span>
            </button>

            <Link to="/faq" target="_blank" className="afm-btn-preview">
              <ExternalLink size={16} />
              <span>Live FAQ Page</span>
            </Link>

            <button
              type="button"
              className="afm-btn-add"
              onClick={handleOpenCreateModal}
            >
              <Plus size={18} />
              <span>Add New FAQ</span>
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {notice && (
          <div className="afm-alert afm-alert--success">
            <CheckCircle2 size={18} />
            <span>{notice}</span>
          </div>
        )}

        {error && (
          <div className="afm-alert afm-alert--error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Executive Metrics Strip */}
        <div className="afm-stats-grid">
          <div className="afm-stat-card">
            <div className="afm-stat-icon-box afm-stat-icon-box--blue">
              <HelpCircle size={22} />
            </div>
            <div>
              <span className="afm-stat-label">Total Questions</span>
              <strong className="afm-stat-val">{faqs.length}</strong>
            </div>
          </div>

          <div className="afm-stat-card">
            <div className="afm-stat-icon-box afm-stat-icon-box--green">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="afm-stat-label">Active / Live</span>
              <strong className="afm-stat-val">{activeCount}</strong>
            </div>
          </div>

          <div className="afm-stat-card afm-stat-card--landing">
            <div className="afm-stat-icon-box afm-stat-icon-box--gold">
              <Star size={22} />
            </div>
            <div className="afm-stat-info-landing">
              <span className="afm-stat-label">⭐ Landing Page (Only 1 FAQ)</span>
              <strong className="afm-stat-val-truncate" title={currentLandingFaq?.question || 'None Selected'}>
                {currentLandingFaq ? currentLandingFaq.question : 'No featured FAQ selected'}
              </strong>
            </div>
          </div>

          <div className="afm-stat-card">
            <div className="afm-stat-icon-box afm-stat-icon-box--purple">
              <Tag size={22} />
            </div>
            <div>
              <span className="afm-stat-label">Categories</span>
              <strong className="afm-stat-val">{existingCategories.length}</strong>
            </div>
          </div>
        </div>

        {/* Control & Filter Strip */}
        <div className="afm-filter-bar">
          <div className="afm-search-wrap">
            <Search size={17} className="afm-search-icon" />
            <input
              type="text"
              placeholder="Search by question, answer text, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="afm-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="afm-search-clear"
                onClick={() => setSearchQuery('')}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="afm-category-filter">
            <span className="afm-filter-lbl">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="afm-category-select"
            >
              <option value="ALL">All Categories ({faqs.length})</option>
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FAQ List Content */}
        <div className="afm-list-card">
          {loading ? (
            <div className="afm-state-box">
              <div className="afm-spinner" />
              <p>Loading questions from database...</p>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="afm-state-box">
              <HelpCircle size={44} className="afm-state-icon" />
              <h3>No FAQ Items Found</h3>
              <p>No questions match your current search or category filter.</p>
              <button
                type="button"
                className="afm-btn-add afm-btn-add--inline"
                onClick={handleOpenCreateModal}
              >
                <Plus size={16} />
                <span>Create New Question</span>
              </button>
            </div>
          ) : (
            <div className="afm-table-wrap">
              <table className="afm-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Order</th>
                    <th>Question & Answer Details</th>
                    <th style={{ width: '160px' }}>Category</th>
                    <th style={{ width: '130px' }}>Status</th>
                    <th style={{ width: '170px' }}>Landing (1 FAQ)</th>
                    <th style={{ width: '110px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaqs.map((faq, index) => (
                    <tr
                      key={faq._id}
                      className={`afm-row ${faq.isLandingFeatured ? 'afm-row--featured' : ''} ${
                        !faq.isActive ? 'afm-row--inactive' : ''
                      }`}
                    >
                      {/* Order Controls */}
                      <td className="afm-td-order">
                        <div className="afm-order-box">
                          <span className="afm-order-badge">#{faq.order ?? index + 1}</span>
                          <div className="afm-order-arrows">
                            <button
                              type="button"
                              className="afm-order-btn"
                              disabled={index === 0}
                              onClick={() => handleMoveOrder(index, 'up')}
                              title="Move up"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button
                              type="button"
                              className="afm-order-btn"
                              disabled={index === faqs.length - 1}
                              onClick={() => handleMoveOrder(index, 'down')}
                              title="Move down"
                            >
                              <ChevronDown size={14} />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Question & Answer Preview */}
                      <td className="afm-td-content">
                        <div className="afm-q-wrap">
                          <h4 className="afm-q-title">{faq.question}</h4>
                          <p className="afm-a-preview">{faq.answer}</p>
                        </div>
                      </td>

                      {/* Category Tag */}
                      <td className="afm-td-cat">
                        <span className="afm-cat-tag">
                          {faq.category || 'General'}
                        </span>
                      </td>

                      {/* Active Status Switch */}
                      <td className="afm-td-status">
                        <button
                          type="button"
                          className={`afm-status-pill ${
                            faq.isActive ? 'is-active' : 'is-inactive'
                          }`}
                          onClick={() => handleToggleActive(faq)}
                          title="Click to toggle Active / Inactive"
                        >
                          {faq.isActive ? (
                            <>
                              <CheckCircle2 size={13} />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={13} />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Landing Featured (The ONLY ONE featured question) */}
                      <td className="afm-td-featured">
                        <button
                          type="button"
                          className={`afm-star-btn ${
                            faq.isLandingFeatured ? 'is-featured' : ''
                          }`}
                          onClick={() => handleToggleLandingFeatured(faq)}
                          title={
                            faq.isLandingFeatured
                              ? 'This question is currently shown on the Landing Page (Click to unfeature)'
                              : 'Click to make this the ONE question on the Landing Page'
                          }
                        >
                          <Star size={14} className="afm-star-icon" />
                          <span>
                            {faq.isLandingFeatured ? '⭐ Landing (1)' : 'Set Landing'}
                          </span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="afm-td-actions">
                        <div className="afm-actions-wrap">
                          <button
                            type="button"
                            className="afm-action-btn afm-action-btn--edit"
                            onClick={() => handleOpenEditModal(faq)}
                            title="Edit FAQ"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            type="button"
                            className="afm-action-btn afm-action-btn--delete"
                            onClick={() => handleDelete(faq._id)}
                            disabled={deletingId === faq._id}
                            title="Delete FAQ"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Create / Edit FAQ */}
        {isModalOpen && (
          <div className="afm-modal-backdrop" onClick={handleCloseModal}>
            <div
              className="afm-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="afm-modal-header">
                <div className="afm-modal-title-wrap">
                  <div className="afm-modal-icon-box">
                    {editingFaq ? <Edit3 size={20} /> : <Plus size={20} />}
                  </div>
                  <div>
                    <h3 className="afm-modal-title">
                      {editingFaq ? 'Edit Frequently Asked Question' : 'Create New FAQ Item'}
                    </h3>
                    <p className="afm-modal-desc">
                      Configure question wording, rich answer text, and display options.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="afm-modal-close"
                  onClick={handleCloseModal}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="afm-form">
                {/* Question */}
                <div className="afm-form-group">
                  <label className="afm-label">
                    Question Text <span className="afm-req">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. What services does BER Services provide?"
                    value={formQuestion}
                    onChange={(e) => setFormQuestion(e.target.value)}
                    className="afm-input"
                  />
                </div>

                {/* Answer */}
                <div className="afm-form-group">
                  <label className="afm-label">
                    Comprehensive Answer Text <span className="afm-req">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide a clear, authoritative, and helpful answer for prospective clients..."
                    value={formAnswer}
                    onChange={(e) => setFormAnswer(e.target.value)}
                    className="afm-textarea"
                  />
                </div>

                {/* Category Selection */}
                <div className="afm-form-row">
                  <div className="afm-form-group afm-flex-1">
                    <label className="afm-label">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="afm-select"
                    >
                      {existingCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="OTHER">+ Add Custom Category...</option>
                    </select>
                  </div>

                  {formCategory === 'OTHER' && (
                    <div className="afm-form-group afm-flex-1">
                      <label className="afm-label">Custom Category Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Enterprise Cloud"
                        value={formCustomCategory}
                        onChange={(e) => setFormCustomCategory(e.target.value)}
                        className="afm-input"
                      />
                    </div>
                  )}

                  <div className="afm-form-group afm-w-100">
                    <label className="afm-label">Sort Order</label>
                    <input
                      type="number"
                      min={1}
                      value={formOrder}
                      onChange={(e) => setFormOrder(e.target.value)}
                      className="afm-input"
                    />
                  </div>
                </div>

                {/* Switches / Checkboxes */}
                <div className="afm-toggles-strip">
                  {/* Active Toggle */}
                  <label className="afm-toggle-card">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="afm-toggle-input"
                    />
                    <div className="afm-toggle-text">
                      <span className="afm-toggle-title">Active & Published</span>
                      <span className="afm-toggle-desc">
                        Visible on website FAQ sections across all relevant pages.
                      </span>
                    </div>
                  </label>

                  {/* Landing Featured Toggle */}
                  <label className="afm-toggle-card afm-toggle-card--featured">
                    <input
                      type="checkbox"
                      checked={formIsLandingFeatured}
                      onChange={(e) => setFormIsLandingFeatured(e.target.checked)}
                      className="afm-toggle-input"
                    />
                    <div className="afm-toggle-text">
                      <span className="afm-toggle-title">
                        ⭐ Set as the ONE Landing Page Featured FAQ
                      </span>
                      <span className="afm-toggle-desc">
                        Per requirements, the landing page shows strictly 1 FAQ. Enabling this sets this question as the featured one.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="afm-modal-footer">
                  <button
                    type="button"
                    className="afm-btn-cancel"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="afm-btn-save"
                    disabled={submitting}
                  >
                    <Save size={16} />
                    <span>{submitting ? 'Saving...' : editingFaq ? 'Save Changes' : 'Create FAQ'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

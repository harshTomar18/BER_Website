import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Tag
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { blogApi } from '../../api';
import '../styles/AdminBlogList.css';

export default function AdminBlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalAll: 0, totalPublished: 0, totalDrafts: 0, totalScheduled: 0 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const [blogRes, catRes] = await Promise.all([
        blogApi.getAdminBlogs({ status: statusFilter, category: categoryFilter, search }),
        blogApi.getAdminCategories(),
      ]);

      if (blogRes?.success && blogRes?.data) {
        setBlogs(blogRes.data.blogs || []);
        if (blogRes.data.stats) setStats(blogRes.data.stats);
      }
      if (catRes?.success && catRes?.data?.categories) {
        setCategories(catRes.data.categories);
      }
    } catch (err) {
      console.error('Error fetching admin blogs:', err);
      setError(err.message || 'Failed to load articles from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  const showNotification = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingId(id);
    try {
      const res = await blogApi.toggleBlogStatus(id);
      if (res.success) {
        setBlogs((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: res.data.status, publishedAt: res.data.publishedAt } : b))
        );
        showNotification(res.message || 'Status updated.');
      }
    } catch (err) {
      alert(err.message || 'Failed to update article status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDuplicate = async (id, title) => {
    try {
      const res = await blogApi.duplicateBlog(id);
      if (res.success) {
        showNotification(`Duplicated "${title}" as draft.`);
        fetchBlogs();
      }
    } catch (err) {
      alert(err.message || 'Failed to duplicate article.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await blogApi.deleteBlog(id);
      if (res.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        showNotification(`Article "${title}" deleted.`);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete article.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout activeTab="blogs">
      <div className="abl-container">
        {/* Top Header */}
        <div className="abl-top-header">
          <div>
            <div className="abl-title-wrap">
              <h1 className="abl-title">Articles & Content Hub</h1>

            </div>
            <p className="abl-subtitle">
              Manage universal articles, categories, internal links, SEO metadata, and publishing workflows.
            </p>
          </div>

          <div className="abl-header-actions">
            <Link to="/admin/categories" className="abl-btn-categories">
              <Layers size={15} />
              <span>Categories</span>
            </Link>

            <Link to="/admin/blogs/new" className="abl-btn-create">
              <Plus size={16} />
              <span>Write Article</span>
            </Link>
          </div>
        </div>

        {/* Notifications */}
        {notice && (
          <div className="abl-alert abl-alert--success">
            <CheckCircle size={18} />
            <span>{notice}</span>
          </div>
        )}

        {error && (
          <div className="abl-alert abl-alert--error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Metrics Cards */}
        <div className="abl-stats-grid">
          <div className="abl-stat-card">
            <span className="abl-stat-label">Total Articles</span>
            <div className="abl-stat-val">{stats.totalAll}</div>
            <span className="abl-stat-sub">Across all categories</span>
          </div>

          <div className="abl-stat-card">
            <span className="abl-stat-label">Published</span>
            <div className="abl-stat-val text-emerald">{stats.totalPublished}</div>
            <span className="abl-stat-sub">Live on public website</span>
          </div>

          <div className="abl-stat-card">
            <span className="abl-stat-label">Drafts</span>
            <div className="abl-stat-val text-amber">{stats.totalDrafts}</div>
            <span className="abl-stat-sub">Work in progress</span>
          </div>

          <div className="abl-stat-card">
            <span className="abl-stat-label">Categories</span>
            <div className="abl-stat-val text-cyan">{categories.length}</div>
            <span className="abl-stat-sub">Taxonomies active</span>
          </div>
        </div>

        {/* Controls: Search, Status tabs, Category filter */}
        <div className="abl-controls-card">
          <div className="abl-controls-top">
            {/* Status Tabs */}
            <div className="abl-status-tabs">
              <button
                type="button"
                className={`abl-tab ${statusFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                <span>All ({stats.totalAll})</span>
              </button>
              <button
                type="button"
                className={`abl-tab ${statusFilter === 'published' ? 'is-active' : ''}`}
                onClick={() => setStatusFilter('published')}
              >
                <span>Published ({stats.totalPublished})</span>
              </button>
              <button
                type="button"
                className={`abl-tab ${statusFilter === 'draft' ? 'is-active' : ''}`}
                onClick={() => setStatusFilter('draft')}
              >
                <span>Drafts ({stats.totalDrafts})</span>
              </button>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="abl-cat-filter">
                <Filter size={14} className="abl-cat-icon" />
                <select
                  className="abl-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form className="abl-search-form" onSubmit={handleSearchSubmit}>
            <div className="abl-search-box">
              <Search size={16} className="abl-search-icon" />
              <input
                type="text"
                className="abl-search-input"
                placeholder="Search articles by title, slug, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="abl-search-clear"
                  onClick={() => {
                    setSearch('');
                    fetchBlogs();
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <button type="submit" className="abl-btn-search">
              Search
            </button>
          </form>
        </div>

        {/* Blog Table / Listing */}
        {loading ? (
          <div className="abl-loading-state">
            <div className="abl-spinner"></div>
            <h3>Loading Articles...</h3>

          </div>
        ) : blogs.length === 0 ? (
          <div className="abl-empty-state">
            <div className="abl-empty-icon">
              <FileText size={44} />
            </div>
            <h3>No Articles Found</h3>
            <p>
              {search || categoryFilter !== 'ALL' || statusFilter !== 'all'
                ? 'No articles match the current filter criteria.'
                : 'Get started by creating your first universal blog article.'}
            </p>
            <Link to="/admin/blogs/new" className="abl-btn-create">
              <Plus size={16} />
              <span>Create First Article</span>
            </Link>
          </div>
        ) : (
          <div className="abl-table-wrapper">
            <table className="abl-table">
              <thead>
                <tr>
                  <th>Article Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Stats</th>
                  <th>Updated</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => {
                  const updatedStr = blog.updatedAt
                    ? new Date(blog.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                    : '';

                  return (
                    <tr key={blog._id} className="abl-table-row">
                      {/* Title & Slug */}
                      <td>
                        <div className="abl-title-cell">
                          <Link to={`/admin/blogs/edit/${blog._id}`} className="abl-title-link">
                            {blog.title}
                          </Link>
                          <div className="abl-slug-text">/{blog.slug}</div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="abl-cat-pill">{blog.category}</span>
                      </td>

                      {/* Status */}
                      <td>
                        <button
                          type="button"
                          className={`abl-status-badge abl-status-badge--${blog.status}`}
                          onClick={() => handleToggleStatus(blog._id, blog.status)}
                          disabled={togglingId === blog._id}
                          title="Click to toggle status"
                        >
                          <span className="abl-status-dot"></span>
                          <span>{togglingId === blog._id ? 'Updating...' : blog.status}</span>
                        </button>
                      </td>

                      {/* Stats */}
                      <td>
                        <div className="abl-stats-cell">
                          <span>{blog.views || 0} views</span>
                          <span className="abl-stats-time">{blog.readingTime || 3}m read</span>
                        </div>
                      </td>

                      {/* Updated Date */}
                      <td>
                        <span className="abl-date-cell">{updatedStr}</span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="abl-actions-wrap">
                          {blog.status === 'published' && (
                            <Link
                              to={`/news-and-article/${blog.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="abl-action-btn"
                              title="View Live Public Article"
                            >
                              <ExternalLink size={15} />
                            </Link>
                          )}

                          <Link
                            to={`/admin/blogs/edit/${blog._id}`}
                            className="abl-action-btn abl-action-btn--edit"
                            title="Edit Article"
                          >
                            <Edit size={15} />
                          </Link>

                          <button
                            type="button"
                            className="abl-action-btn"
                            onClick={() => handleDuplicate(blog._id, blog.title)}
                            title="Duplicate Article as Draft"
                          >
                            <Copy size={15} />
                          </button>

                          <button
                            type="button"
                            className="abl-action-btn abl-action-btn--delete"
                            onClick={() => handleDelete(blog._id, blog.title)}
                            disabled={deletingId === blog._id}
                            title="Delete Article"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

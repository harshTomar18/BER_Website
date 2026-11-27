import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Eye,
  FileText,
  Search,
  Link2,
  Megaphone,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Check,
  X,
  UploadCloud,
  ImagePlus
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import RichTextEditor from '../components/RichTextEditor';
import { blogApi } from '../../api';
import '../styles/AdminBlogEditor.css';

export default function AdminBlogEditor() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  // Active Tab: 'content' | 'seo' | 'interlinking' | 'cta' | 'author'
  const [activeTab, setActiveTab] = useState('content');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    featuredImageAlt: '',
    category: '',
    tags: '',
    status: 'draft',
    scheduledAt: '',
    readingTime: 3,
    author: {
      name: '',
      designation: '',
      image: '',
      bio: '',
    },
    reviewer: {
      name: '',
      designation: '',
      image: '',
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
      secondaryKeywords: '',
      canonicalUrl: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      robots: 'index, follow',
      schemaType: 'BlogPosting',
    },
    cta: {
      enabled: false,
      badge: '',
      heading: '',
      description: '',
      buttonText: '',
      buttonUrl: '',
      secondaryButtonText: '',
      secondaryButtonUrl: '',
      phone: '',
      bulletPoints: '',
      backgroundStyle: 'navy_gradient',
      placement: 'end_of_article',
    },
    internalLinks: [],
  });

  const [categories, setCategories] = useState([]);
  const [internalRoutes, setInternalRoutes] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Image Upload States
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingAuthorImg, setUploadingAuthorImg] = useState(false);
  const featuredFileInputRef = useRef(null);
  const authorFileInputRef = useRef(null);

  // Upload handler for Featured Image
  const handleFeaturedImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP, SVG).');
      return;
    }
    setUploadingFeatured(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await blogApi.uploadImage(fd);
      if (res.success && res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          featuredImage: res.data.url,
          featuredImageAlt: prev.featuredImageAlt || prev.title || file.name.replace(/\.[^/.]+$/, ''),
        }));
      } else {
        alert(res.message || 'Image upload failed.');
      }
    } catch (err) {
      alert(err.message || 'Failed to upload image.');
    } finally {
      setUploadingFeatured(false);
    }
  };

  // Remove handler for Featured Image
  const handleRemoveFeaturedImage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFormData((prev) => ({
      ...prev,
      featuredImage: '',
      featuredImageAlt: '',
    }));
    if (featuredFileInputRef.current) {
      featuredFileInputRef.current.value = '';
    }
  };

  // Upload handler for Author Profile Image
  const handleAuthorImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    setUploadingAuthorImg(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await blogApi.uploadImage(fd);
      if (res.success && res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          author: { ...prev.author, image: res.data.url },
        }));
      } else {
        alert(res.message || 'Image upload failed.');
      }
    } catch (err) {
      alert(err.message || 'Failed to upload author image.');
    } finally {
      setUploadingAuthorImg(false);
    }
  };

  // New Internal Link input state
  const [newLink, setNewLink] = useState({ anchorText: '', targetUrl: '', description: '' });

  // Load Categories & Internal Routes
  useEffect(() => {
    const loadPrerequisites = async () => {
      try {
        const [catRes, routeRes] = await Promise.all([
          blogApi.getAdminCategories(),
          blogApi.getInternalRoutes(),
        ]);

        if (catRes?.success && catRes?.data?.categories) {
          setCategories(catRes.data.categories);
          if (!isEditMode && catRes.data.categories.length > 0) {
            setFormData((prev) => ({ ...prev, category: catRes.data.categories[0].name }));
          }
        }

        if (routeRes?.success && routeRes?.data?.routes) {
          setInternalRoutes(routeRes.data.routes);
        }
      } catch (err) {
        console.error('Failed to load editor prerequisites:', err);
      }
    };

    loadPrerequisites();
  }, [isEditMode]);

  // Load Blog Data if in Edit Mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await blogApi.getAdminBlogById(id);
        if (res.success && res.data?.blog) {
          const b = res.data.blog;
          setFormData({
            title: b.title || '',
            slug: b.slug || '',
            excerpt: b.excerpt || '',
            content: b.content || '',
            featuredImage: b.featuredImage || '',
            featuredImageAlt: b.featuredImageAlt || '',
            category: b.category || '',
            tags: (b.tags || []).join(', '),
            status: b.status || 'draft',
            scheduledAt: b.scheduledAt ? b.scheduledAt.slice(0, 16) : '',
            readingTime: b.readingTime || 3,
            author: {
              name: b.author?.name || '',
              designation: b.author?.designation || '',
              image: b.author?.image || '',
              bio: b.author?.bio || '',
            },
            reviewer: {
              name: b.reviewer?.name || '',
              designation: b.reviewer?.designation || '',
              image: b.reviewer?.image || '',
            },
            seo: {
              metaTitle: b.seo?.metaTitle || '',
              metaDescription: b.seo?.metaDescription || '',
              focusKeyword: b.seo?.focusKeyword || '',
              secondaryKeywords: (b.seo?.secondaryKeywords || []).join(', '),
              canonicalUrl: b.seo?.canonicalUrl || '',
              ogTitle: b.seo?.ogTitle || '',
              ogDescription: b.seo?.ogDescription || '',
              ogImage: b.seo?.ogImage || '',
              robots: b.seo?.robots || 'index, follow',
              schemaType: b.seo?.schemaType || 'BlogPosting',
            },
            cta: {
              enabled: Boolean(b.cta?.enabled),
              badge: b.cta?.badge || '',
              heading: b.cta?.heading || '',
              description: b.cta?.description || '',
              buttonText: b.cta?.buttonText || '',
              buttonUrl: b.cta?.buttonUrl || '',
              secondaryButtonText: b.cta?.secondaryButtonText || '',
              secondaryButtonUrl: b.cta?.secondaryButtonUrl || '',
              phone: b.cta?.phone || '',
              bulletPoints: Array.isArray(b.cta?.bulletPoints)
                ? b.cta.bulletPoints.join('\n')
                : (b.cta?.bulletPoints || ''),
              backgroundStyle: b.cta?.backgroundStyle || 'navy_gradient',
              placement: b.cta?.placement || 'end_of_article',
            },
            internalLinks: b.internalLinks || [],
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load article.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, isEditMode]);

  // Auto generate slug from title when title changes in create mode
  const handleTitleChange = (val) => {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (!isEditMode && (!prev.slug || prev.slug === slugify(prev.title))) {
        updated.slug = slugify(val);
      }
      return updated;
    });
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Add internal link to contextual list
  const handleAddInternalLink = () => {
    if (!newLink.targetUrl) {
      alert('Please select or enter an internal URL.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      internalLinks: [
        ...prev.internalLinks,
        {
          anchorText: newLink.anchorText || newLink.targetUrl,
          targetUrl: newLink.targetUrl,
          description: newLink.description || '',
        },
      ],
    }));

    setNewLink({ anchorText: '', targetUrl: '', description: '' });
  };

  const handleRemoveInternalLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      internalLinks: prev.internalLinks.filter((_, i) => i !== index),
    }));
  };

  // Submit Handler
  const handleSave = async (statusOverride = null) => {
    if (!formData.title.trim()) {
      alert('Please provide an article title.');
      setActiveTab('content');
      return;
    }

    if (!formData.content.trim()) {
      alert('Please provide article content.');
      setActiveTab('content');
      return;
    }

    if (!formData.category) {
      alert('Please select an article category.');
      setActiveTab('content');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      ...formData,
      status: statusOverride || formData.status,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      seo: {
        ...formData.seo,
        secondaryKeywords: formData.seo.secondaryKeywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
      },
      cta: {
        ...formData.cta,
        bulletPoints: typeof formData.cta.bulletPoints === 'string'
          ? formData.cta.bulletPoints.split('\n').map((b) => b.trim()).filter(Boolean)
          : (formData.cta.bulletPoints || []),
      },
    };

    try {
      if (isEditMode) {
        const res = await blogApi.updateBlog(id, payload);
        if (res.success) {
          setNotice('Article updated successfully.');
          setTimeout(() => setNotice(null), 3000);
        }
      } else {
        const res = await blogApi.createBlog(payload);
        if (res.success && res.data?.blog) {
          navigate(`/admin/blogs/edit/${res.data.blog._id}`, { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="blogs">
        <div className="abe-loading">
          <div className="abe-spinner"></div>
          <p>Loading article editor...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="blogs">
      <div className="abe-container">
        {/* Top Action Bar */}
        <div className="abe-top-bar">
          <div className="abe-top-bar__left">
            <Link to="/admin/blogs" className="abe-back-link">
              <ArrowLeft size={16} />
              <span>Articles</span>
            </Link>
            <h1 className="abe-main-title">
              {isEditMode ? 'Edit Article' : 'Compose Universal Article'}
            </h1>
          </div>

          <div className="abe-top-bar__right">
            <button
              type="button"
              className="abe-btn-preview"
              onClick={() => setShowPreview(true)}
              title="Preview Article Layout"
            >
              <Eye size={15} />
              <span>Preview</span>
            </button>

            <button
              type="button"
              className="abe-btn-draft"
              onClick={() => handleSave('draft')}
              disabled={saving}
            >
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              className="abe-btn-publish"
              onClick={() => handleSave('published')}
              disabled={saving}
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : formData.status === 'published' ? 'Update & Publish' : 'Publish Article'}</span>
            </button>
          </div>
        </div>

        {/* Notices */}
        {notice && (
          <div className="abe-alert abe-alert--success">
            <CheckCircle size={18} />
            <span>{notice}</span>
          </div>
        )}

        {error && (
          <div className="abe-alert abe-alert--error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="abe-tabs-card">
          <button
            type="button"
            className={`abe-tab-btn ${activeTab === 'content' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FileText size={16} />
            <span>1. Content & Media</span>
          </button>

          <button
            type="button"
            className={`abe-tab-btn ${activeTab === 'seo' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            <Search size={16} />
            <span>2. SEO & Schemas</span>
          </button>

          <button
            type="button"
            className={`abe-tab-btn ${activeTab === 'interlinking' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('interlinking')}
          >
            <Link2 size={16} />
            <span>3. Internal Linking</span>
          </button>

          <button
            type="button"
            className={`abe-tab-btn ${activeTab === 'cta' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('cta')}
          >
            <Megaphone size={16} />
            <span>4. CTA Builder</span>
          </button>

          <button
            type="button"
            className={`abe-tab-btn ${activeTab === 'author' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('author')}
          >
            <UserCheck size={16} />
            <span>5. Author & Trust</span>
          </button>
        </div>

        {/* =========================================================
            TAB 1: CONTENT & MEDIA
            ========================================================= */}
        {activeTab === 'content' && (
          <div className="abe-section-card">
            <div className="abe-field">
              <label className="abe-label">Article Title *</label>
              <input
                type="text"
                className="abe-input abe-input--title"
                placeholder="e.g. The Strategic Playbook for Technical Web Engineering"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="abe-grid-2">
              <div className="abe-field">
                <label className="abe-label">URL Slug *</label>
                <div className="abe-slug-wrap">
                  <span className="abe-slug-prefix">/news-and-article/</span>
                  <input
                    type="text"
                    className="abe-input"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                  />
                </div>
              </div>

              <div className="abe-field">
                <label className="abe-label">Category *</label>
                <select
                  className="abe-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="abe-field">
              <label className="abe-label">Excerpt / Overview</label>
              <textarea
                className="abe-textarea abe-textarea--sm"
                placeholder="Brief 1-2 sentence summary for article listings and search engine snippets..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>

            {/* Rich Visual & HTML Editor Area */}
            <div className="abe-field">
              <div className="abe-editor-header">
                <label className="abe-label">Article Body Content * (Visual Rich Text & HTML)</label>
                <span className="abe-editor-hint">Highlight any text and click "+ Insert Link" to connect internal routes</span>
              </div>

              <RichTextEditor
                value={formData.content}
                onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                internalRoutes={internalRoutes}
              />
            </div>

            {/* Featured Image Uploader & Preview */}
            <div className="abe-field">
              <label className="abe-label">Featured Image (Upload from Computer or enter URL)</label>

              {/* Hidden file input always in DOM for reliable Replace and Upload actions */}
              <input
                type="file"
                ref={featuredFileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFeaturedImageUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="abe-featured-upload-box">
                {formData.featuredImage ? (
                  <div className="abe-featured-preview-card">
                    <div className="abe-featured-thumb-wrap">
                      <img
                        src={formData.featuredImage}
                        alt={formData.featuredImageAlt || 'Featured preview'}
                        className="abe-featured-thumb"
                      />
                    </div>
                    <div className="abe-featured-preview-info">
                      <div className="abe-featured-preview-top">
                        <span className="abe-featured-tag">ACTIVE FEATURED IMAGE</span>
                        <div className="abe-featured-actions">
                          <button
                            type="button"
                            className="abe-btn-change-img"
                            onClick={() => featuredFileInputRef.current && featuredFileInputRef.current.click()}
                            disabled={uploadingFeatured}
                          >
                            <UploadCloud size={14} />
                            <span>{uploadingFeatured ? 'Uploading...' : 'Replace Image'}</span>
                          </button>
                          <button
                            type="button"
                            className="abe-btn-remove-img"
                            onClick={handleRemoveFeaturedImage}
                          >
                            <Trash2 size={14} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      <div className="abe-featured-url-row">
                        <span className="abe-featured-url-label">Direct URL:</span>
                        <input
                          type="text"
                          className="abe-input abe-input--sm"
                          value={formData.featuredImage}
                          onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                          placeholder="Image URL"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`abe-upload-dropzone ${uploadingFeatured ? 'is-uploading' : ''}`}
                    onClick={() => featuredFileInputRef.current && featuredFileInputRef.current.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFeaturedImageUpload(e.dataTransfer.files[0]);
                      }
                    }}
                  >
                    <div className="abe-dropzone-content">
                      <div className="abe-dropzone-icon-circle">
                        {uploadingFeatured ? (
                          <div className="abe-spinner-sm"></div>
                        ) : (
                          <UploadCloud size={24} />
                        )}
                      </div>
                      <div className="abe-dropzone-text">
                        <strong>
                          {uploadingFeatured
                            ? 'Uploading image to server...'
                            : 'Click to Upload Featured Image or Drag & Drop'}
                        </strong>
                        <span>Supports JPG, PNG, WebP, GIF, SVG up to 10MB</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="abe-field">
              <label className="abe-label">Featured Image Alt Text (SEO & Accessibility)</label>
              <input
                type="text"
                className="abe-input"
                placeholder="Descriptive image alt for search crawlers and screen readers"
                value={formData.featuredImageAlt}
                onChange={(e) => setFormData({ ...formData, featuredImageAlt: e.target.value })}
              />
            </div>

            <div className="abe-field">
              <label className="abe-label">Tags (comma separated)</label>
              <input
                type="text"
                className="abe-input"
                placeholder="Web Development, Technical SEO, Performance, Cloud"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: SEO & META CONFIGURATION
            ========================================================= */}
        {activeTab === 'seo' && (
          <div className="abe-section-card">
            {/* SERP Snippet Preview */}
            <div className="abe-serp-card">
              <span className="abe-serp-heading">GOOGLE SEARCH PREVIEW</span>
              <div className="abe-serp-box">
                <div className="abe-serp-url">
                  https://thebermedia.com &gt; news-and-article &gt; {formData.slug || 'article-slug'}
                </div>
                <div className="abe-serp-title">
                  {formData.seo.metaTitle || formData.title || 'Article Meta Title Placeholder'}
                </div>
                <div className="abe-serp-desc">
                  {formData.seo.metaDescription ||
                    formData.excerpt ||
                    'Article meta description preview as it will appear in search engine result pages.'}
                </div>
              </div>
            </div>

            <div className="abe-field">
              <div className="abe-field-meta">
                <label className="abe-label">Meta Title</label>
                <span className="abe-char-count">{formData.seo.metaTitle.length}/60 chars</span>
              </div>
              <input
                type="text"
                className="abe-input"
                placeholder="Targeted title for search engines"
                value={formData.seo.metaTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seo: { ...formData.seo, metaTitle: e.target.value },
                  })
                }
              />
            </div>

            <div className="abe-field">
              <div className="abe-field-meta">
                <label className="abe-label">Meta Description</label>
                <span className="abe-char-count">{formData.seo.metaDescription.length}/160 chars</span>
              </div>
              <textarea
                className="abe-textarea abe-textarea--sm"
                placeholder="High-CTR description summarizing key insights for searchers"
                value={formData.seo.metaDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seo: { ...formData.seo, metaDescription: e.target.value },
                  })
                }
              />
            </div>

            <div className="abe-grid-2">
              <div className="abe-field">
                <label className="abe-label">Focus Keyword</label>
                <input
                  type="text"
                  className="abe-input"
                  placeholder="Primary organic target keyword"
                  value={formData.seo.focusKeyword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, focusKeyword: e.target.value },
                    })
                  }
                />
              </div>

              <div className="abe-field">
                <label className="abe-label">Secondary Keywords (comma separated)</label>
                <input
                  type="text"
                  className="abe-input"
                  placeholder="Related semantic keywords"
                  value={formData.seo.secondaryKeywords}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, secondaryKeywords: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="abe-grid-2">
              <div className="abe-field">
                <label className="abe-label">Robots Indexing Directive</label>
                <select
                  className="abe-select"
                  value={formData.seo.robots}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, robots: e.target.value },
                    })
                  }
                >
                  <option value="index, follow">index, follow (Recommended)</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </div>

              <div className="abe-field">
                <label className="abe-label">Structured Data Schema Type</label>
                <select
                  className="abe-select"
                  value={formData.seo.schemaType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, schemaType: e.target.value },
                    })
                  }
                >
                  <option value="BlogPosting">BlogPosting (Recommended)</option>
                  <option value="Article">Article</option>
                  <option value="NewsArticle">NewsArticle</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: ADVANCED INTERNAL LINKING ENGINE
            ========================================================= */}
        {activeTab === 'interlinking' && (
          <div className="abe-section-card">
            <div className="abe-interlink-intro">
              <h3 className="abe-section-heading">Universal Internal Link Engine</h3>
              <p className="abe-section-sub">
                Connect this article contextually with your service capabilities, industry hubs, and relevant knowledge articles.
              </p>
            </div>

            {/* Link Selector Box */}
            <div className="abe-link-builder-box">
              <span className="abe-box-label">ADD CONTEXTUAL INTERNAL LINK</span>

              <div className="abe-grid-2">
                <div className="abe-field">
                  <label className="abe-label">Target Website Route</label>
                  <select
                    className="abe-select"
                    value={newLink.targetUrl}
                    onChange={(e) => {
                      const selected = internalRoutes.find((r) => r.url === e.target.value);
                      setNewLink({
                        ...newLink,
                        targetUrl: e.target.value,
                        anchorText: selected ? selected.title : newLink.anchorText,
                      });
                    }}
                  >
                    <option value="">Choose Internal Route...</option>
                    {internalRoutes.map((r, i) => (
                      <option key={i} value={r.url}>
                        [{r.category}] {r.title} ({r.url})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="abe-field">
                  <label className="abe-label">Descriptive Anchor Text</label>
                  <input
                    type="text"
                    className="abe-input"
                    placeholder="e.g. Website Designing & Development Services"
                    value={newLink.anchorText}
                    onChange={(e) => setNewLink({ ...newLink, anchorText: e.target.value })}
                  />
                </div>
              </div>

              <div className="abe-field">
                <label className="abe-label">Contextual Note / Reader Benefit</label>
                <input
                  type="text"
                  className="abe-input"
                  placeholder="e.g. Explore our full engineering capabilities and technology stacks."
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                />
              </div>

              <button
                type="button"
                className="abe-btn-add-link"
                onClick={handleAddInternalLink}
              >
                <Plus size={15} />
                <span>Attach Internal Link</span>
              </button>
            </div>

            {/* Attached Links List */}
            <div className="abe-attached-links">
              <span className="abe-box-label">
                ATTACHED INTERNAL LINKS ({formData.internalLinks.length})
              </span>

              {formData.internalLinks.length === 0 ? (
                <div className="abe-empty-links">
                  <Link2 size={32} />
                  <p>No internal links configured yet for this article.</p>
                </div>
              ) : (
                <div className="abe-links-list">
                  {formData.internalLinks.map((link, idx) => (
                    <div key={idx} className="abe-link-row">
                      <div className="abe-link-info">
                        <strong>{link.anchorText}</strong>
                        <span className="abe-link-url">{link.targetUrl}</span>
                        {link.description && <p className="abe-link-desc">{link.description}</p>}
                      </div>

                      <button
                        type="button"
                        className="abe-btn-remove-link"
                        onClick={() => handleRemoveInternalLink(idx)}
                        title="Remove Link"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: DYNAMIC CTA BUILDER
            ========================================================= */}
        {activeTab === 'cta' && (
          <div className="abe-section-card">
            <div className="abe-cta-toggle-box">
              <label className="abe-switch-label">
                <input
                  type="checkbox"
                  checked={formData.cta.enabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cta: { ...formData.cta, enabled: e.target.value === 'on' || e.target.checked },
                    })
                  }
                />
                <span className="abe-switch-slider"></span>
                <span className="abe-switch-text">Enable Call-to-Action (CTA) in this Article</span>
              </label>
            </div>

            {formData.cta.enabled && (
              <div className="abe-cta-config">
                <div className="abe-grid-2">
                  <div className="abe-field">
                    <label className="abe-label">Eyebrow / Badge Text</label>
                    <input
                      type="text"
                      className="abe-input"
                      placeholder="e.g. Independent Doctor Directory or Advisory Hub"
                      value={formData.cta.badge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cta: { ...formData.cta, badge: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="abe-field">
                    <label className="abe-label">Direct Hotline / Contact Phone</label>
                    <input
                      type="text"
                      className="abe-input"
                      placeholder="e.g. +98765432210 or +91 98765 43210"
                      value={formData.cta.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cta: { ...formData.cta, phone: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="abe-field">
                  <label className="abe-label">CTA Main Heading</label>
                  <input
                    type="text"
                    className="abe-input"
                    placeholder="e.g. Injured in an Accident? or Ready to Transform Your Platform?"
                    value={formData.cta.heading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta: { ...formData.cta, heading: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="abe-field">
                  <label className="abe-label">CTA Description</label>
                  <textarea
                    className="abe-textarea abe-textarea--sm"
                    placeholder="e.g. Connect with authorized specialists who document requirements and protect your project."
                    value={formData.cta.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta: { ...formData.cta, description: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="abe-field">
                  <label className="abe-label">Bullet Point Benefits (One per line)</label>
                  <textarea
                    className="abe-textarea abe-textarea--sm"
                    placeholder={"Direct Technical Advisory\nSame-Day Diagnostic Architecture Evaluation\nEnterprise SLA & Compliance Guarantee"}
                    value={formData.cta.bulletPoints}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta: { ...formData.cta, bulletPoints: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="abe-grid-2">
                  <div className="abe-field">
                    <label className="abe-label">Primary Button Text</label>
                    <input
                      type="text"
                      className="abe-input"
                      placeholder="e.g. Request Appointment or Book Consultation"
                      value={formData.cta.buttonText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cta: { ...formData.cta, buttonText: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="abe-field">
                    <label className="abe-label">Primary Button Destination URL</label>
                    <input
                      type="text"
                      className="abe-input"
                      placeholder="e.g. /contact-us"
                      value={formData.cta.buttonUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cta: { ...formData.cta, buttonUrl: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="abe-grid-2">
                  <div className="abe-field">
                    <label className="abe-label">Secondary Button Text (Optional)</label>
                    <input
                      type="text"
                      className="abe-input"
                      placeholder="e.g. Browse Doctors or Explore Services"
                      value={formData.cta.secondaryButtonText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cta: { ...formData.cta, secondaryButtonText: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="abe-field">
                    <label className="abe-label">Secondary Button Destination URL</label>
                    <input
                      type="text"
                      className="abe-input"
                      placeholder="e.g. /services-we-provide"
                      value={formData.cta.secondaryButtonUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cta: { ...formData.cta, secondaryButtonUrl: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="abe-grid-2">
                  <div className="abe-field">
                    <label className="abe-label">Visual Theme / Background</label>
                    <select
                      className="abe-select"
                      value={formData.cta.backgroundStyle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cta: { ...formData.cta, backgroundStyle: e.target.value },
                        })
                      }
                    >
                      <option value="navy_gradient">Navy Brand Gradient (Recommended)</option>
                      <option value="dark_card">Midnight Dark Card (Sidebar High-Converting)</option>
                      <option value="cyan_glow">Electric Cyan Glow</option>
                      <option value="minimal_slate">Minimal Slate</option>
                    </select>
                  </div>

                  <div className="abe-field">
                    <label className="abe-label">Placement</label>
                    <select
                      className="abe-select"
                      value={formData.cta.placement}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cta: { ...formData.cta, placement: e.target.value },
                        })
                      }
                    >
                      <option value="sidebar">Sidebar Card & Bottom Banner (Recommended)</option>
                      <option value="end_of_article">At the End of Article</option>
                      <option value="inside_content">In-Stream Inside Article</option>
                      <option value="banner">Full-Width Highlight Banner</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 5: AUTHOR & EDITORIAL TRUST (E-E-A-T)
            ========================================================= */}
        {activeTab === 'author' && (
          <div className="abe-section-card">
            <h3 className="abe-section-heading">Author Profile & Credentials</h3>

            <div className="abe-grid-2">
              <div className="abe-field">
                <label className="abe-label">Author Name</label>
                <input
                  type="text"
                  className="abe-input"
                  placeholder="e.g. BER Technical Solutions"
                  value={formData.author.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      author: { ...formData.author, name: e.target.value },
                    })
                  }
                />
              </div>

              <div className="abe-field">
                <label className="abe-label">Author Designation</label>
                <input
                  type="text"
                  className="abe-input"
                  placeholder="e.g. Solutions Architecture Team"
                  value={formData.author.designation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      author: { ...formData.author, designation: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="abe-field">
              <label className="abe-label">Author Profile Photo</label>
              <div className="abe-author-upload-row">
                <div className="abe-author-thumb-circle">
                  {formData.author.image ? (
                    <img
                      src={formData.author.image}
                      alt={formData.author.name}
                      className="abe-author-thumb"
                    />
                  ) : (
                    <div className="abe-author-fallback-init">
                      {formData.author.name ? formData.author.name.charAt(0).toUpperCase() : <UserCheck size={18} />}
                    </div>
                  )}
                </div>
                <div className="abe-author-upload-actions">
                  <input
                    type="file"
                    ref={authorFileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleAuthorImageUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="abe-btn-upload-author"
                    onClick={() => authorFileInputRef.current && authorFileInputRef.current.click()}
                    disabled={uploadingAuthorImg}
                  >
                    <UploadCloud size={14} />
                    <span>{uploadingAuthorImg ? 'Uploading...' : 'Upload Profile Photo'}</span>
                  </button>
                  {formData.author.image && (
                    <button
                      type="button"
                      className="abe-btn-remove-sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          author: { ...prev.author, image: '' },
                        }))
                      }
                    >
                      Remove
                    </button>
                  )}
                  <input
                    type="text"
                    className="abe-input abe-input--sm"
                    placeholder="Or enter direct image URL"
                    value={formData.author.image}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        author: { ...formData.author, image: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="abe-field">
              <label className="abe-label">Author Profile Bio</label>
              <textarea
                className="abe-textarea abe-textarea--sm"
                placeholder="Author credentials, domain expertise, and background..."
                value={formData.author.bio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    author: { ...formData.author, bio: e.target.value },
                  })
                }
              />
            </div>

            <h3 className="abe-section-heading" style={{ marginTop: '24px' }}>
              Editorial Reviewer (E-E-A-T Quality)
            </h3>

            <div className="abe-grid-2">
              <div className="abe-field">
                <label className="abe-label">Reviewer Name</label>
                <input
                  type="text"
                  className="abe-input"
                  placeholder="e.g. Chief Systems Architect"
                  value={formData.reviewer.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reviewer: { ...formData.reviewer, name: e.target.value },
                    })
                  }
                />
              </div>

              <div className="abe-field">
                <label className="abe-label">Reviewer Designation</label>
                <input
                  type="text"
                  className="abe-input"
                  placeholder="e.g. Technical QA & Integrity Lead"
                  value={formData.reviewer.designation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reviewer: { ...formData.reviewer, designation: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Live Preview Modal */}
        {showPreview && (
          <div className="abe-preview-modal" onClick={() => setShowPreview(false)}>
            <div className="abe-preview-box" onClick={(e) => e.stopPropagation()}>
              <div className="abe-preview-header">
                <div>
                  <span className="abe-preview-cat">{formData.category || 'Category'}</span>
                  <h2 className="abe-preview-title">{formData.title || 'Untitled Article'}</h2>
                </div>
                <button
                  type="button"
                  className="abe-preview-close"
                  onClick={() => setShowPreview(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="abe-preview-body">
                {formData.featuredImage && (
                  <img
                    src={formData.featuredImage}
                    alt={formData.featuredImageAlt || formData.title}
                    className="abe-preview-img"
                  />
                )}

                {formData.excerpt && <p className="abe-preview-excerpt">{formData.excerpt}</p>}

                <div
                  className="abe-preview-content"
                  dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content entered yet.</p>' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

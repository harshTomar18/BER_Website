import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sliders,
  Save,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  Trash2,
  Plus,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Layers,
  Code,
  Eye,
  ExternalLink,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { heroApi } from '../../api';
import '../styles/AdminHeroManager.css';

export default function AdminHeroManager() {
  const [activeTab, setActiveTab] = useState('headlines'); // 'headlines' | 'actions' | 'visual' | 'platform'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    badge: '',
    title: '',
    titleSub: '',
    dynamicWords: [],
    description: '',
    primaryCta: {
      text: '',
      url: '',
      action: 'modal',
    },
    secondaryCta: {
      text: '',
      url: '',
    },
    features: [],
    heroImage: '',
    heroImageAlt: '',
    windowBadge: '',
    windowLiveStatus: '',
    stats: [],
    codeSnippet: {
      fileName: '',
      language: '',
      code: '',
    },
    techPills: [],
    isActive: true,
  });

  // Local helper states for adding new items
  const [newWordText, setNewWordText] = useState('');
  const [newWordColor, setNewWordColor] = useState('#16a1ce');
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newTechPill, setNewTechPill] = useState('');

  // Fetch Hero Configuration
  const fetchHeroData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await heroApi.getAdminHero();
      if (res?.success && res?.data?.hero) {
        const h = res.data.hero;
        setFormData({
          badge: h.badge || '',
          title: h.title || '',
          titleSub: h.titleSub || '',
          dynamicWords: Array.isArray(h.dynamicWords) ? h.dynamicWords : [],
          description: h.description || '',
          primaryCta: {
            text: h.primaryCta?.text || '',
            url: h.primaryCta?.url || '',
            action: h.primaryCta?.action || 'modal',
          },
          secondaryCta: {
            text: h.secondaryCta?.text || '',
            url: h.secondaryCta?.url || '',
          },
          features: Array.isArray(h.features) ? h.features : [],
          heroImage: h.heroImage || '',
          heroImageAlt: h.heroImageAlt || '',
          windowBadge: h.windowBadge || '',
          windowLiveStatus: h.windowLiveStatus || '',
          stats: Array.isArray(h.stats) ? h.stats : [],
          codeSnippet: {
            fileName: h.codeSnippet?.fileName || '',
            language: h.codeSnippet?.language || '',
            code: h.codeSnippet?.code || '',
          },
          techPills: Array.isArray(h.techPills) ? h.techPills : [],
          isActive: h.isActive !== undefined ? h.isActive : true,
        });
      }
    } catch (err) {
      console.error('Failed to load hero configuration:', err);
      setError(err.message || 'Failed to load hero section.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  const showNotification = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Image Upload handler
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await heroApi.uploadImage(fd);
      if (res?.success && res?.data?.url) {
        setFormData((prev) => ({
          ...prev,
          heroImage: res.data.url,
          heroImageAlt: prev.heroImageAlt || file.name.replace(/\.[^/.]+$/, ''),
        }));
        showNotification('Hero image uploaded and attached successfully!');
      } else {
        throw new Error(res?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Hero image upload failed:', err);
      setError(err.message || 'Image upload failed. Ensure it is a valid JPG, PNG, or WebP image under 10MB.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save / Overwrite Form Submit
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a Hero Main Title.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await heroApi.updateHero(formData);
      if (res?.success) {
        showNotification('Hero section successfully updated and published live!');
        if (res.data?.hero) {
          setFormData((prev) => ({ ...prev, ...res.data.hero }));
        }
      } else {
        throw new Error(res?.message || 'Failed to update hero section.');
      }
    } catch (err) {
      console.error('Failed to save hero section:', err);
      setError(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  // Add Dynamic Word
  const handleAddWord = () => {
    if (!newWordText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      dynamicWords: [...prev.dynamicWords, { text: newWordText.trim(), color: newWordColor }],
    }));
    setNewWordText('');
  };

  const handleRemoveWord = (index) => {
    setFormData((prev) => ({
      ...prev,
      dynamicWords: prev.dynamicWords.filter((_, i) => i !== index),
    }));
  };

  // Add Feature point
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeatureText.trim()],
    }));
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Add Tech Pill
  const handleAddTechPill = () => {
    if (!newTechPill.trim()) return;
    setFormData((prev) => ({
      ...prev,
      techPills: [...prev.techPills, newTechPill.trim()],
    }));
    setNewTechPill('');
  };

  const handleRemoveTechPill = (index) => {
    setFormData((prev) => ({
      ...prev,
      techPills: prev.techPills.filter((_, i) => i !== index),
    }));
  };

  // Update Stat item
  const handleStatChange = (index, field, value) => {
    setFormData((prev) => {
      const nextStats = [...prev.stats];
      if (nextStats[index]) {
        nextStats[index] = { ...nextStats[index], [field]: value };
      }
      return { ...prev, stats: nextStats };
    });
  };

  return (
    <AdminLayout activeTab="hero">
      <div className="ahm-page">
        {/* Header Bar */}
        <div className="ahm-header">
          <div>
            <div className="ahm-breadcrumb">
              <Link to="/admin/dashboard">Admin Console</Link>
              <span>/</span>
              <span>Home Hero Section</span>
            </div>
            <h1 className="ahm-title">Homepage Hero Section Manager</h1>
            <p className="ahm-subtitle">
              Manage the primary above-the-fold headline, rotating highlight phrases, call-to-action buttons, and the interactive platform showcase.
            </p>
          </div>

          <div className="ahm-header-actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="ahm-btn-secondary">
              <Eye size={16} />
              <span>View Live Site</span>
            </a>
            <button
              type="button"
              className="ahm-btn-primary"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? <div className="ahm-spinner"></div> : <Save size={16} />}
              <span>{saving ? 'Saving...' : 'Save & Overwrite Hero'}</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {notice && (
          <div className="ahm-alert ahm-alert--success">
            <CheckCircle size={18} />
            <span>{notice}</span>
          </div>
        )}
        {error && (
          <div className="ahm-alert ahm-alert--error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="ahm-loading-card">
            <div className="ahm-spinner ahm-spinner--lg"></div>
            <p>Loading hero configuration from database...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="ahm-form-grid">

            {/* Navigation Tabs Bar */}
            <div className="ahm-tabs-nav-wrap">
              <nav className="ahm-tabs-nav">
                <button
                  type="button"
                  className={`ahm-tab-btn ${activeTab === 'headlines' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('headlines')}
                >
                  <Sparkles size={16} />
                  <span>1. Headlines & Dynamic Words</span>
                </button>
                <button
                  type="button"
                  className={`ahm-tab-btn ${activeTab === 'actions' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('actions')}
                >
                  <Layers size={16} />
                  <span>2. CTAs & Features</span>
                </button>
                <button
                  type="button"
                  className={`ahm-tab-btn ${activeTab === 'visual' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('visual')}
                >
                  <ImageIcon size={16} />
                  <span>3. Hero Image & Upload</span>
                </button>
                <button
                  type="button"
                  className={`ahm-tab-btn ${activeTab === 'platform' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('platform')}
                >
                  <Code size={16} />
                  <span>4. 3D Platform & Mockup</span>
                </button>
              </nav>
            </div>

            {/* =========================================================
                CARD 1: HEADLINES, ROTATING WORDS & DESCRIPTION
                ========================================================= */}
            {activeTab === 'headlines' && (
            <div className="ahm-card">
              <div className="ahm-card-header">
                <Sparkles size={18} className="ahm-card-icon" />
                <div>
                  <h3 className="ahm-card-title">Main Headlines & Rotating Words</h3>
                  <p className="ahm-card-desc">Edit primary title, dynamic color-cycling phrases, and supporting copy.</p>
                </div>
              </div>

              <div className="ahm-card-body">
                {/* Optional Eyebrow Badge */}
                <div className="ahm-field">
                  <label className="ahm-label">Eyebrow / Badge Text (Optional)</label>
                  <input
                    type="text"
                    className="ahm-input"
                    placeholder="e.g. Enterprise Technology Flagship"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  />
                </div>

                {/* Title Line 1 */}
                <div className="ahm-field">
                  <label className="ahm-label">Title Main Line 1 *</label>
                  <input
                    type="text"
                    className="ahm-input"
                    placeholder="e.g. Custom Website Development &"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Title Line 2 */}
                <div className="ahm-field">
                  <label className="ahm-label">Title Sub Line 2</label>
                  <input
                    type="text"
                    className="ahm-input"
                    placeholder="e.g. Digital Solutions That"
                    value={formData.titleSub}
                    onChange={(e) => setFormData({ ...formData, titleSub: e.target.value })}
                  />
                </div>

                {/* Rotating Dynamic Words Manager */}
                <div className="ahm-field">
                  <label className="ahm-label">Dynamic Rotating Words (Color-Cycling Highlights)</label>
                  <div className="ahm-words-list">
                    {formData.dynamicWords.map((w, idx) => (
                      <div key={idx} className="ahm-word-chip">
                        <span className="ahm-word-color-dot" style={{ backgroundColor: w.color }}></span>
                        <strong className="ahm-word-text" style={{ color: w.color }}>{w.text}</strong>
                        <span className="ahm-word-hex">({w.color})</span>
                        <button
                          type="button"
                          className="ahm-word-delete-btn"
                          onClick={() => handleRemoveWord(idx)}
                          title="Remove word"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add word controls */}
                  <div className="ahm-add-row">
                    <input
                      type="text"
                      className="ahm-input ahm-input--add"
                      placeholder="Add rotating word e.g. Accelerate Growth"
                      value={newWordText}
                      onChange={(e) => setNewWordText(e.target.value)}
                    />
                    <input
                      type="color"
                      className="ahm-color-picker"
                      value={newWordColor}
                      onChange={(e) => setNewWordColor(e.target.value)}
                      title="Select word highlight color"
                    />
                    <button type="button" className="ahm-btn-add" onClick={handleAddWord}>
                      <Plus size={15} />
                      <span>Add Word</span>
                    </button>
                  </div>
                </div>

                {/* Paragraph Description */}
                <div className="ahm-field">
                  <label className="ahm-label">Hero Description / Supporting Copy</label>
                  <textarea
                    rows={3}
                    className="ahm-textarea"
                    placeholder="Enter supporting paragraph copy..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            </div>
            )}

            {/* =========================================================
                CARD 2: CALL TO ACTIONS & FEATURE CHECKLIST
                ========================================================= */}
            {activeTab === 'actions' && (
            <div className="ahm-card">
              <div className="ahm-card-header">
                <Layers size={18} className="ahm-card-icon" />
                <div>
                  <h3 className="ahm-card-title">Call to Actions & Feature Highlights</h3>
                  <p className="ahm-card-desc">Configure buttons, modal triggers, and feature checkmarks.</p>
                </div>
              </div>

              <div className="ahm-card-body">
                {/* Primary CTA */}
                <div className="ahm-sub-section">
                  <h4 className="ahm-sub-title">Primary Call to Action Button</h4>
                  <div className="ahm-grid-2">
                    <div className="ahm-field">
                      <label className="ahm-label">Button Text</label>
                      <input
                        type="text"
                        className="ahm-input"
                        placeholder="e.g. Get a Free Consultation"
                        value={formData.primaryCta.text}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            primaryCta: { ...formData.primaryCta, text: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="ahm-field">
                      <label className="ahm-label">Action Type</label>
                      <select
                        className="ahm-select"
                        value={formData.primaryCta.action}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            primaryCta: { ...formData.primaryCta, action: e.target.value },
                          })
                        }
                      >
                        <option value="modal">Open Consultation Modal</option>
                        <option value="url">Navigate to Custom URL</option>
                      </select>
                    </div>
                  </div>

                  {formData.primaryCta.action === 'url' && (
                    <div className="ahm-field">
                      <label className="ahm-label">Destination URL</label>
                      <input
                        type="text"
                        className="ahm-input"
                        placeholder="e.g. /contact-us or https://..."
                        value={formData.primaryCta.url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            primaryCta: { ...formData.primaryCta, url: e.target.value },
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Secondary CTA */}
                <div className="ahm-sub-section">
                  <h4 className="ahm-sub-title">Secondary Call to Action Button</h4>
                  <div className="ahm-grid-2">
                    <div className="ahm-field">
                      <label className="ahm-label">Button Text</label>
                      <input
                        type="text"
                        className="ahm-input"
                        placeholder="e.g. Explore Services"
                        value={formData.secondaryCta.text}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            secondaryCta: { ...formData.secondaryCta, text: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="ahm-field">
                      <label className="ahm-label">Destination Link / Anchor</label>
                      <input
                        type="text"
                        className="ahm-input"
                        placeholder="e.g. /services-we-provide"
                        value={formData.secondaryCta.url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            secondaryCta: { ...formData.secondaryCta, url: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="ahm-field">
                  <label className="ahm-label">Feature Checklist (Bullet Points)</label>
                  <div className="ahm-features-list">
                    {formData.features.map((feat, i) => (
                      <div key={i} className="ahm-feature-item">
                        <span className="ahm-feat-check">✔</span>
                        <span>{feat}</span>
                        <button
                          type="button"
                          className="ahm-feat-delete-btn"
                          onClick={() => handleRemoveFeature(i)}
                          title="Remove feature"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="ahm-add-row">
                    <input
                      type="text"
                      className="ahm-input ahm-input--add"
                      placeholder="Add feature e.g. 24/7 Enterprise Support"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                    />
                    <button type="button" className="ahm-btn-add" onClick={handleAddFeature}>
                      <Plus size={15} />
                      <span>Add Feature</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* =========================================================
                CARD 3: HERO IMAGE UPLOADER & VISUAL INTEGRATION
                ========================================================= */}
            {activeTab === 'visual' && (
            <div className="ahm-card">
              <div className="ahm-card-header">
                <ImageIcon size={18} className="ahm-card-icon" />
                <div>
                  <h3 className="ahm-card-title">Visual Showcase & Image Upload</h3>
                  <p className="ahm-card-desc">Upload a custom hero image directly from your computer or enter an image URL.</p>
                </div>
              </div>

              <div className="ahm-card-body">
                {/* Upload Dropzone */}
                <div className="ahm-field">
                  <label className="ahm-label">Upload Hero Image from Computer</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  {formData.heroImage ? (
                    <div className="ahm-image-preview-box">
                      <div className="ahm-preview-img-wrap">
                        <img src={formData.heroImage} alt={formData.heroImageAlt || 'Hero visual preview'} />
                      </div>
                      <div className="ahm-preview-controls">
                        <span className="ahm-preview-url">{formData.heroImage}</span>
                        <div className="ahm-preview-btn-row">
                          <button
                            type="button"
                            className="ahm-btn-replace"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            disabled={uploadingImage}
                          >
                            <UploadCloud size={14} />
                            <span>Replace Image</span>
                          </button>
                          <button
                            type="button"
                            className="ahm-btn-remove"
                            onClick={() => setFormData({ ...formData, heroImage: '' })}
                          >
                            <Trash2 size={14} />
                            <span>Remove Image</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="ahm-dropzone"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <UploadCloud size={32} className="ahm-dropzone-icon" />
                      <p className="ahm-dropzone-title">
                        {uploadingImage ? 'Uploading Image to Server...' : 'Click to Upload Hero Image from Computer'}
                      </p>
                      <p className="ahm-dropzone-subtitle">Supports WebP, PNG, JPG, or SVG up to 10MB</p>
                    </div>
                  )}
                </div>

                {/* Direct Image URL input */}
                <div className="ahm-grid-2">
                  <div className="ahm-field">
                    <label className="ahm-label">Or Image URL</label>
                    <input
                      type="text"
                      className="ahm-input"
                      placeholder="https://... or /uploads/hero/..."
                      value={formData.heroImage}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    />
                  </div>
                  <div className="ahm-field">
                    <label className="ahm-label">Image Alt Description</label>
                    <input
                      type="text"
                      className="ahm-input"
                      placeholder="e.g. Enterprise Cloud Software Architecture"
                      value={formData.heroImageAlt}
                      onChange={(e) => setFormData({ ...formData, heroImageAlt: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* =========================================================
                CARD 4: 3D PLATFORM WINDOW, STATS & CODE MOCKUP
                ========================================================= */}
            {activeTab === 'platform' && (
            <div className="ahm-card">
              <div className="ahm-card-header">
                <Code size={18} className="ahm-card-icon" />
                <div>
                  <h3 className="ahm-card-title">Interactive Software Platform Window & Code Mockup</h3>
                  <p className="ahm-card-desc">Customize window bar labels, statistics counters, and code snippet.</p>
                </div>
              </div>

              <div className="ahm-card-body">
                <div className="ahm-grid-2">
                  <div className="ahm-field">
                    <label className="ahm-label">Window Address Bar Badge</label>
                    <input
                      type="text"
                      className="ahm-input"
                      placeholder="e.g. thebermedia.com/enterprise"
                      value={formData.windowBadge}
                      onChange={(e) => setFormData({ ...formData, windowBadge: e.target.value })}
                    />
                  </div>
                  <div className="ahm-field">
                    <label className="ahm-label">Window Live Ping Status</label>
                    <input
                      type="text"
                      className="ahm-input"
                      placeholder="e.g. Active System"
                      value={formData.windowLiveStatus}
                      onChange={(e) => setFormData({ ...formData, windowLiveStatus: e.target.value })}
                    />
                  </div>
                </div>

                {/* Stat Boxes */}
                <div className="ahm-field">
                  <label className="ahm-label">Platform Performance Statistics</label>
                  <div className="ahm-grid-2">
                    {/* Stat 1 */}
                    <div className="ahm-stat-edit-box">
                      <span className="ahm-stat-box-title">Stat Card 1</span>
                      <div className="ahm-field">
                        <label className="ahm-label-sm">Icon / Emoji</label>
                        <input
                          type="text"
                          className="ahm-input"
                          value={formData.stats[0]?.icon || ''}
                          onChange={(e) => handleStatChange(0, 'icon', e.target.value)}
                        />
                      </div>
                      <div className="ahm-field">
                        <label className="ahm-label-sm">Metric Number</label>
                        <input
                          type="text"
                          className="ahm-input"
                          placeholder="99.98%"
                          value={formData.stats[0]?.value || ''}
                          onChange={(e) => handleStatChange(0, 'value', e.target.value)}
                        />
                      </div>
                      <div className="ahm-field">
                        <label className="ahm-label-sm">Label Name</label>
                        <input
                          type="text"
                          className="ahm-input"
                          placeholder="Uptime & Scalability"
                          value={formData.stats[0]?.label || ''}
                          onChange={(e) => handleStatChange(0, 'label', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="ahm-stat-edit-box">
                      <span className="ahm-stat-box-title">Stat Card 2</span>
                      <div className="ahm-field">
                        <label className="ahm-label-sm">Icon / Emoji</label>
                        <input
                          type="text"
                          className="ahm-input"
                          value={formData.stats[1]?.icon || ''}
                          onChange={(e) => handleStatChange(1, 'icon', e.target.value)}
                        />
                      </div>
                      <div className="ahm-field">
                        <label className="ahm-label-sm">Metric Number</label>
                        <input
                          type="text"
                          className="ahm-input"
                          placeholder="500+"
                          value={formData.stats[1]?.value || ''}
                          onChange={(e) => handleStatChange(1, 'value', e.target.value)}
                        />
                      </div>
                      <div className="ahm-field">
                        <label className="ahm-label-sm">Label Name</label>
                        <input
                          type="text"
                          className="ahm-input"
                          placeholder="Projects Delivered"
                          value={formData.stats[1]?.label || ''}
                          onChange={(e) => handleStatChange(1, 'label', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Code Architecture Card */}
                <div className="ahm-field">
                  <label className="ahm-label">Code Architecture Window</label>
                  <div className="ahm-grid-2">
                    <div className="ahm-field">
                      <label className="ahm-label-sm">File Name</label>
                      <input
                        type="text"
                        className="ahm-input"
                        placeholder="e.g. BER_Architecture.ts"
                        value={formData.codeSnippet.fileName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            codeSnippet: { ...formData.codeSnippet, fileName: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="ahm-field">
                      <label className="ahm-label-sm">Language Label</label>
                      <input
                        type="text"
                        className="ahm-input"
                        placeholder="e.g. Enterprise • TypeScript"
                        value={formData.codeSnippet.language}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            codeSnippet: { ...formData.codeSnippet, language: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="ahm-field">
                    <label className="ahm-label-sm">Code Snippet Content</label>
                    <textarea
                      rows={5}
                      className="ahm-textarea ahm-textarea--code"
                      value={formData.codeSnippet.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          codeSnippet: { ...formData.codeSnippet, code: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="ahm-field">
                  <label className="ahm-label">Technology Stack Pills</label>
                  <div className="ahm-tech-pills-list">
                    {formData.techPills.map((pill, i) => (
                      <div key={i} className="ahm-tech-pill-chip">
                        <span>{pill}</span>
                        <button
                          type="button"
                          className="ahm-pill-delete-btn"
                          onClick={() => handleRemoveTechPill(i)}
                          title="Remove pill"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="ahm-add-row">
                    <input
                      type="text"
                      className="ahm-input ahm-input--add"
                      placeholder="Add tech pill e.g. Next.js, Docker, Kubernetes"
                      value={newTechPill}
                      onChange={(e) => setNewTechPill(e.target.value)}
                    />
                    <button type="button" className="ahm-btn-add" onClick={handleAddTechPill}>
                      <Plus size={15} />
                      <span>Add Pill</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Bottom Save & Tab Navigation Bar */}
            <div className="ahm-bottom-bar">
              <div className="ahm-bottom-bar__left">
                {activeTab === 'actions' && (
                  <button
                    type="button"
                    className="ahm-btn-nav ahm-btn-nav--prev"
                    onClick={() => setActiveTab('headlines')}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous: Headlines</span>
                  </button>
                )}
                {activeTab === 'visual' && (
                  <button
                    type="button"
                    className="ahm-btn-nav ahm-btn-nav--prev"
                    onClick={() => setActiveTab('actions')}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous: CTAs & Features</span>
                  </button>
                )}
                {activeTab === 'platform' && (
                  <button
                    type="button"
                    className="ahm-btn-nav ahm-btn-nav--prev"
                    onClick={() => setActiveTab('visual')}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous: Hero Image</span>
                  </button>
                )}
              </div>

              <div className="ahm-bottom-bar__right">
                {activeTab === 'headlines' && (
                  <button
                    type="button"
                    className="ahm-btn-nav ahm-btn-nav--next"
                    onClick={() => setActiveTab('actions')}
                  >
                    <span>Next: CTAs & Features</span>
                    <ChevronRight size={16} />
                  </button>
                )}
                {activeTab === 'actions' && (
                  <button
                    type="button"
                    className="ahm-btn-nav ahm-btn-nav--next"
                    onClick={() => setActiveTab('visual')}
                  >
                    <span>Next: Hero Image</span>
                    <ChevronRight size={16} />
                  </button>
                )}
                {activeTab === 'visual' && (
                  <button
                    type="button"
                    className="ahm-btn-nav ahm-btn-nav--next"
                    onClick={() => setActiveTab('platform')}
                  >
                    <span>Next: 3D Platform & Mockup</span>
                    <ChevronRight size={16} />
                  </button>
                )}

                <button
                  type="submit"
                  className="ahm-btn-primary ahm-btn-primary--lg"
                  disabled={saving || loading}
                >
                  {saving ? <div className="ahm-spinner"></div> : <Save size={18} />}
                  <span>{saving ? 'Publishing Changes...' : 'Save & Overwrite Hero Section'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}

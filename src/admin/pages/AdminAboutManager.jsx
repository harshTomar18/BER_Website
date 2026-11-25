import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
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
  Target,
  Compass,
  ShieldCheck,
  Zap,
  ExternalLink,
  Users
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { aboutApi } from '../../api';
import '../styles/AdminAboutManager.css';

export default function AdminAboutManager() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'missionVision' | 'values' | 'whyChoose' | 'media'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  // Form State initialized to empty strings / null equivalents
  const [formData, setFormData] = useState({
    overview: {
      pill: '',
      headline: {
        line1: '',
        line2: '',
        accent: '',
      },
      description: '',
      ctaPrimary: '',
      ctaSecondary: '',
      stats: [],
      artworkImage: '',
      artworkImageAlt: '',
    },
    missionVisionHeader: {
      title: '',
      titleAccent: '',
      subtitle: '',
    },
    mission: {
      badge: '',
      title: '',
      tagline: '',
      description: '',
      pillars: [],
    },
    vision: {
      badge: '',
      title: '',
      tagline: '',
      description: '',
      milestones: [],
    },
    valuesHeader: {
      badge: '',
      title: '',
      titleAccent: '',
      subtitle: '',
    },
    values: [],
    whyChooseUsHeader: {
      badge: '',
      title: '',
      titleAccent: '',
      subtitle: '',
    },
    whyChooseUs: [],
    ctaBox: {
      title: '',
      text: '',
      buttonText: '',
    },
    isActive: true,
  });

  // Fetch current About configuration
  const fetchAboutData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aboutApi.getAdminAbout();
      if (res?.success && res?.data?.about) {
        const a = res.data.about;
        setFormData({
          overview: {
            pill: a.overview?.pill || '',
            headline: {
              line1: a.overview?.headline?.line1 || '',
              line2: a.overview?.headline?.line2 || '',
              accent: a.overview?.headline?.accent || '',
            },
            description: a.overview?.description || '',
            ctaPrimary: a.overview?.ctaPrimary || '',
            ctaSecondary: a.overview?.ctaSecondary || '',
            stats: Array.isArray(a.overview?.stats) ? a.overview.stats : [],
            artworkImage: a.overview?.artworkImage || '',
            artworkImageAlt: a.overview?.artworkImageAlt || '',
          },
          missionVisionHeader: {
            title: a.missionVisionHeader?.title || '',
            titleAccent: a.missionVisionHeader?.titleAccent || '',
            subtitle: a.missionVisionHeader?.subtitle || '',
          },
          mission: {
            badge: a.mission?.badge || '',
            title: a.mission?.title || '',
            tagline: a.mission?.tagline || '',
            description: a.mission?.description || '',
            pillars: Array.isArray(a.mission?.pillars) ? a.mission.pillars : [],
          },
          vision: {
            badge: a.vision?.badge || '',
            title: a.vision?.title || '',
            tagline: a.vision?.tagline || '',
            description: a.vision?.description || '',
            milestones: Array.isArray(a.vision?.milestones) ? a.vision.milestones : [],
          },
          valuesHeader: {
            badge: a.valuesHeader?.badge || '',
            title: a.valuesHeader?.title || '',
            titleAccent: a.valuesHeader?.titleAccent || '',
            subtitle: a.valuesHeader?.subtitle || '',
          },
          values: Array.isArray(a.values) ? a.values : [],
          whyChooseUsHeader: {
            badge: a.whyChooseUsHeader?.badge || '',
            title: a.whyChooseUsHeader?.title || '',
            titleAccent: a.whyChooseUsHeader?.titleAccent || '',
            subtitle: a.whyChooseUsHeader?.subtitle || '',
          },
          whyChooseUs: Array.isArray(a.whyChooseUs) ? a.whyChooseUs : [],
          ctaBox: {
            title: a.ctaBox?.title || '',
            text: a.ctaBox?.text || '',
            buttonText: a.ctaBox?.buttonText || '',
          },
          isActive: a.isActive !== undefined ? a.isActive : true,
        });
      }
    } catch (err) {
      console.error('Failed to load about section configuration:', err);
      setError(err.message || 'Failed to load about section.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const showNotification = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Image upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await aboutApi.uploadImage(fd);
      if (res?.success && res?.data?.url) {
        setFormData((prev) => ({
          ...prev,
          overview: {
            ...prev.overview,
            artworkImage: res.data.url,
          },
        }));
        showNotification('About artwork image uploaded successfully!');
      } else {
        throw new Error(res?.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Artwork upload failed:', err);
      setError(err.message || 'Failed to upload artwork image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Save form handler
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await aboutApi.updateAbout(formData);
      if (res?.success) {
        showNotification('About BER configuration updated & overwritten live in DB!');
      } else {
        throw new Error(res?.message || 'Failed to save configuration.');
      }
    } catch (err) {
      console.error('Failed to save about configuration:', err);
      setError(err.message || 'Failed to update about section.');
    } finally {
      setSaving(false);
    }
  };

  // Array handlers: Stats
  const handleAddStat = () => {
    setFormData((prev) => ({
      ...prev,
      overview: {
        ...prev.overview,
        stats: [...prev.overview.stats, { n: '100+', l: 'New Stat', icon: 'code' }],
      },
    }));
  };

  const handleRemoveStat = (index) => {
    setFormData((prev) => ({
      ...prev,
      overview: {
        ...prev.overview,
        stats: prev.overview.stats.filter((_, i) => i !== index),
      },
    }));
  };

  const handleStatChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.overview.stats];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return {
        ...prev,
        overview: {
          ...prev.overview,
          stats: updated,
        },
      };
    });
  };

  // Array handlers: Mission Pillars
  const handleAddPillar = () => {
    setFormData((prev) => ({
      ...prev,
      mission: {
        ...prev.mission,
        pillars: [...prev.mission.pillars, { title: 'New Pillar', desc: '' }],
      },
    }));
  };

  const handleRemovePillar = (index) => {
    setFormData((prev) => ({
      ...prev,
      mission: {
        ...prev.mission,
        pillars: prev.mission.pillars.filter((_, i) => i !== index),
      },
    }));
  };

  const handlePillarChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.mission.pillars];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return {
        ...prev,
        mission: {
          ...prev.mission,
          pillars: updated,
        },
      };
    });
  };

  // Array handlers: Vision Milestones
  const handleAddMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      vision: {
        ...prev.vision,
        milestones: [...prev.vision.milestones, { title: 'Strategic Milestone', desc: '' }],
      },
    }));
  };

  const handleRemoveMilestone = (index) => {
    setFormData((prev) => ({
      ...prev,
      vision: {
        ...prev.vision,
        milestones: prev.vision.milestones.filter((_, i) => i !== index),
      },
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.vision.milestones];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return {
        ...prev,
        vision: {
          ...prev.vision,
          milestones: updated,
        },
      };
    });
  };

  // Array handlers: Core Values
  const handleAddValue = () => {
    const nextNum = String(formData.values.length + 1).padStart(2, '0');
    setFormData((prev) => ({
      ...prev,
      values: [
        ...prev.values,
        { number: nextNum, title: 'New Core Value', desc: '', icon: 'ShieldCheck' },
      ],
    }));
  };

  const handleRemoveValue = (index) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  const handleValueChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.values];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, values: updated };
    });
  };

  // Array handlers: Why Choose Us
  const handleAddWhy = () => {
    setFormData((prev) => ({
      ...prev,
      whyChooseUs: [
        ...prev.whyChooseUs,
        { title: 'New Advantage', desc: '', icon: 'Layers' },
      ],
    }));
  };

  const handleRemoveWhy = (index) => {
    setFormData((prev) => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs.filter((_, i) => i !== index),
    }));
  };

  const handleWhyChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.whyChooseUs];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, whyChooseUs: updated };
    });
  };

  return (
    <AdminLayout activeTab="about">
      <div className="aam-page">
        {/* Header Bar */}
        <div className="aam-header">
          <div>
            <div className="aam-breadcrumb">
              <Link to="/admin/dashboard">Admin Console</Link>
              <span>/</span>
              <span>About BER Section</span>
            </div>
            <h1 className="aam-title">About BER Section Manager</h1>
            <p className="aam-subtitle">
              Manage all dynamic copy, headlines, statistics, mission & vision statements, core values, capabilities, and artwork displayed on the homepage & About BER page.
            </p>
          </div>

          <div className="aam-header-actions">
            <Link
              to="/about-us"
              target="_blank"
              rel="noopener noreferrer"
              className="aam-btn-secondary"
            >
              <ExternalLink size={16} />
              <span>View About Page</span>
            </Link>

            <button
              type="button"
              className="aam-btn-primary"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? <div className="aam-spinner"></div> : <Save size={16} />}
              <span>{saving ? 'Saving...' : 'Save & Overwrite About'}</span>
            </button>
          </div>
        </div>

        {/* Notification alerts */}
        {notice && (
          <div className="aam-alert aam-alert--success">
            <CheckCircle size={18} />
            <span>{notice}</span>
          </div>
        )}
        {error && (
          <div className="aam-alert aam-alert--error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="aam-loading-card">
            <div className="aam-spinner aam-spinner--lg"></div>
            <p>Loading About section configuration from database...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="aam-form-grid">
            {/* Tab Navigation */}
            <div className="aam-tabs-nav-wrap">
              <nav className="aam-tabs-nav">
                <button
                  type="button"
                  className={`aam-tab-btn ${activeTab === 'overview' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <Sparkles size={16} />
                  <span>1. Overview & Stats</span>
                </button>
                <button
                  type="button"
                  className={`aam-tab-btn ${activeTab === 'missionVision' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('missionVision')}
                >
                  <Target size={16} />
                  <span>2. Mission & Vision</span>
                </button>
                <button
                  type="button"
                  className={`aam-tab-btn ${activeTab === 'values' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('values')}
                >
                  <ShieldCheck size={16} />
                  <span>3. Core Values</span>
                </button>
                <button
                  type="button"
                  className={`aam-tab-btn ${activeTab === 'whyChoose' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('whyChoose')}
                >
                  <Zap size={16} />
                  <span>4. Why Choose Us & CTA</span>
                </button>
                <button
                  type="button"
                  className={`aam-tab-btn ${activeTab === 'media' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('media')}
                >
                  <ImageIcon size={16} />
                  <span>5. Artwork & Media Upload</span>
                </button>
              </nav>
            </div>

            {/* TAB 1: OVERVIEW & STATS */}
            {activeTab === 'overview' && (
              <div className="aam-card">
                <div className="aam-card-header">
                  <div className="aam-card-title-group">
                    <div className="aam-card-icon">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h2 className="aam-card-title">Overview Section & Statistics Strip</h2>
                      <p className="aam-card-desc">
                        Controls the homepage About section and top banner of the About page.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="aam-card-body">
                  <div className="aam-field">
                    <label className="aam-label">Pill / Badge Label</label>
                    <input
                      type="text"
                      className="aam-input"
                      placeholder="e.g. About BER Services"
                      value={formData.overview.pill}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          overview: { ...prev.overview, pill: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="aam-row-3">
                    <div className="aam-field">
                      <label className="aam-label">Headline Line 1</label>
                      <input
                        type="text"
                        className="aam-input"
                        placeholder="e.g. Building Smart"
                        value={formData.overview.headline.line1}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            overview: {
                              ...prev.overview,
                              headline: { ...prev.overview.headline, line1: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="aam-field">
                      <label className="aam-label">Headline Line 2</label>
                      <input
                        type="text"
                        className="aam-input"
                        placeholder="e.g. Software Solutions"
                        value={formData.overview.headline.line2}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            overview: {
                              ...prev.overview,
                              headline: { ...prev.overview.headline, line2: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="aam-field">
                      <label className="aam-label">Headline Accent Text</label>
                      <input
                        type="text"
                        className="aam-input"
                        placeholder="e.g. for a Better Tomorrow"
                        value={formData.overview.headline.accent}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            overview: {
                              ...prev.overview,
                              headline: { ...prev.overview.headline, accent: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="aam-field">
                    <label className="aam-label">Overview Description Text</label>
                    <textarea
                      className="aam-textarea"
                      placeholder="Describe the company overview and mission..."
                      value={formData.overview.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          overview: { ...prev.overview, description: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="aam-row-2">
                    <div className="aam-field">
                      <label className="aam-label">Primary CTA Button Text</label>
                      <input
                        type="text"
                        className="aam-input"
                        placeholder="e.g. Let's Build Together"
                        value={formData.overview.ctaPrimary}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            overview: { ...prev.overview, ctaPrimary: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="aam-field">
                      <label className="aam-label">Secondary CTA Button Text</label>
                      <input
                        type="text"
                        className="aam-input"
                        placeholder="e.g. Our Vision"
                        value={formData.overview.ctaSecondary}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            overview: { ...prev.overview, ctaSecondary: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Statistics Strip */}
                  <div className="aam-subcard">
                    <div className="aam-subcard-header">
                      <div className="aam-subcard-title">
                        <Code size={18} color="#16a1ce" />
                        <span>Glass Statistics Strip (Horizontal Counter Bar)</span>
                      </div>
                      <button
                        type="button"
                        className="aam-item-badge"
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={handleAddStat}
                      >
                        + Add Stat
                      </button>
                    </div>

                    <div className="aam-items-list">
                      {formData.overview.stats.map((stat, idx) => (
                        <div key={idx} className="aam-item-card">
                          <div className="aam-item-card-top">
                            <span className="aam-item-badge">Stat Item #{idx + 1}</span>
                            <button
                              type="button"
                              className="aam-item-btn-del"
                              onClick={() => handleRemoveStat(idx)}
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          </div>
                          <div className="aam-row-3">
                            <div className="aam-field">
                              <label className="aam-label">Value / Number</label>
                              <input
                                type="text"
                                className="aam-input"
                                placeholder="e.g. 50+"
                                value={stat.n}
                                onChange={(e) => handleStatChange(idx, 'n', e.target.value)}
                              />
                            </div>
                            <div className="aam-field">
                              <label className="aam-label">Label / Metric</label>
                              <input
                                type="text"
                                className="aam-input"
                                placeholder="e.g. Projects Delivered"
                                value={stat.l}
                                onChange={(e) => handleStatChange(idx, 'l', e.target.value)}
                              />
                            </div>
                            <div className="aam-field">
                              <label className="aam-label">Icon Type</label>
                              <select
                                className="aam-input"
                                value={stat.icon}
                                onChange={(e) => handleStatChange(idx, 'icon', e.target.value)}
                              >
                                <option value="code">Code (Terminal)</option>
                                <option value="clients">Clients (Users)</option>
                                <option value="uptime">Uptime (Lightning)</option>
                                <option value="satisfaction">Satisfaction (Star)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="aam-card-footer">
                  <span className="aam-hint">Changes will reflect across both Home and About pages.</span>
                  <button type="submit" className="aam-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Overview Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: MISSION & VISION */}
            {activeTab === 'missionVision' && (
              <div className="aam-card">
                <div className="aam-card-header">
                  <div className="aam-card-title-group">
                    <div className="aam-card-icon">
                      <Target size={20} />
                    </div>
                    <div>
                      <h2 className="aam-card-title">Mission & Vision Spotlight</h2>
                      <p className="aam-card-desc">
                        Manage section headers, mission commitment pillars, and vision milestones.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="aam-card-body">
                  {/* Section Header */}
                  <div className="aam-subcard">
                    <div className="aam-subcard-title">
                      <span>Section Header</span>
                    </div>
                    <div className="aam-row-2">
                      <div className="aam-field">
                        <label className="aam-label">Title Line 1</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="e.g. Driven by Purpose."
                          value={formData.missionVisionHeader.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              missionVisionHeader: {
                                ...prev.missionVisionHeader,
                                title: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="aam-field">
                        <label className="aam-label">Title Accent (Gradient)</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="e.g. Defined by Engineering Excellence."
                          value={formData.missionVisionHeader.titleAccent}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              missionVisionHeader: {
                                ...prev.missionVisionHeader,
                                titleAccent: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="aam-field">
                      <label className="aam-label">Section Subtitle</label>
                      <textarea
                        className="aam-textarea"
                        placeholder="Subtitle description..."
                        value={formData.missionVisionHeader.subtitle}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            missionVisionHeader: {
                              ...prev.missionVisionHeader,
                              subtitle: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Mission Card Details */}
                  <div className="aam-subcard">
                    <div className="aam-subcard-header">
                      <div className="aam-subcard-title">
                        <Target size={18} color="#16a1ce" />
                        <span>Mission Card Settings & Commitments</span>
                      </div>
                    </div>

                    <div className="aam-row-2">
                      <div className="aam-field">
                        <label className="aam-label">Mission Badge</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="e.g. Our Mission"
                          value={formData.mission.badge}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              mission: { ...prev.mission, badge: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="aam-field">
                        <label className="aam-label">Mission Title</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="Mission headline"
                          value={formData.mission.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              mission: { ...prev.mission, title: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="aam-field">
                      <label className="aam-label">Mission Tagline</label>
                      <input
                        type="text"
                        className="aam-input"
                        placeholder="Mission tagline"
                        value={formData.mission.tagline}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            mission: { ...prev.mission, tagline: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="aam-field">
                      <label className="aam-label">Full Mission Description</label>
                      <textarea
                        className="aam-textarea"
                        placeholder="Detailed mission narrative..."
                        value={formData.mission.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            mission: { ...prev.mission, description: e.target.value },
                          }))
                        }
                      />
                    </div>

                    {/* Mission Pillars List */}
                    <div className="aam-field">
                      <div className="aam-subcard-header">
                        <label className="aam-label">Key Mission Commitments (Pillars)</label>
                        <button
                          type="button"
                          className="aam-item-badge"
                          style={{ cursor: 'pointer', border: 'none' }}
                          onClick={handleAddPillar}
                        >
                          + Add Commitment
                        </button>
                      </div>

                      <div className="aam-items-list">
                        {formData.mission.pillars.map((pillar, idx) => (
                          <div key={idx} className="aam-item-card">
                            <div className="aam-item-card-top">
                              <span className="aam-item-badge">Pillar #{idx + 1}</span>
                              <button
                                type="button"
                                className="aam-item-btn-del"
                                onClick={() => handleRemovePillar(idx)}
                              >
                                <Trash2 size={12} />
                                <span>Remove</span>
                              </button>
                            </div>
                            <div className="aam-row-2">
                              <div className="aam-field">
                                <label className="aam-label">Pillar Title</label>
                                <input
                                  type="text"
                                  className="aam-input"
                                  placeholder="e.g. Architectural Excellence"
                                  value={pillar.title}
                                  onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                                />
                              </div>
                              <div className="aam-field">
                                <label className="aam-label">Pillar Description</label>
                                <input
                                  type="text"
                                  className="aam-input"
                                  placeholder="Pillar explanation"
                                  value={pillar.desc}
                                  onChange={(e) => handlePillarChange(idx, 'desc', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vision Card Details */}
                  <div className="aam-subcard">
                    <div className="aam-subcard-header">
                      <div className="aam-subcard-title">
                        <Compass size={18} color="#f97316" />
                        <span>Vision Card Settings & Strategic Horizons</span>
                      </div>
                    </div>

                    <div className="aam-row-2">
                      <div className="aam-field">
                        <label className="aam-label">Vision Badge</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="e.g. Our Vision"
                          value={formData.vision.badge}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              vision: { ...prev.vision, badge: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="aam-field">
                        <label className="aam-label">Vision Title</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="Vision headline"
                          value={formData.vision.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              vision: { ...prev.vision, title: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="aam-field">
                      <label className="aam-label">Vision Tagline</label>
                      <input
                        type="text"
                        className="aam-input"
                        placeholder="Vision tagline"
                        value={formData.vision.tagline}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            vision: { ...prev.vision, tagline: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="aam-field">
                      <label className="aam-label">Full Vision Description</label>
                      <textarea
                        className="aam-textarea"
                        placeholder="Detailed vision narrative..."
                        value={formData.vision.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            vision: { ...prev.vision, description: e.target.value },
                          }))
                        }
                      />
                    </div>

                    {/* Vision Milestones List */}
                    <div className="aam-field">
                      <div className="aam-subcard-header">
                        <label className="aam-label">Strategic Horizons (Milestones)</label>
                        <button
                          type="button"
                          className="aam-item-badge"
                          style={{ cursor: 'pointer', border: 'none' }}
                          onClick={handleAddMilestone}
                        >
                          + Add Milestone
                        </button>
                      </div>

                      <div className="aam-items-list">
                        {formData.vision.milestones.map((ms, idx) => (
                          <div key={idx} className="aam-item-card">
                            <div className="aam-item-card-top">
                              <span className="aam-item-badge">Milestone #{idx + 1}</span>
                              <button
                                type="button"
                                className="aam-item-btn-del"
                                onClick={() => handleRemoveMilestone(idx)}
                              >
                                <Trash2 size={12} />
                                <span>Remove</span>
                              </button>
                            </div>
                            <div className="aam-row-2">
                              <div className="aam-field">
                                <label className="aam-label">Milestone Title</label>
                                <input
                                  type="text"
                                  className="aam-input"
                                  placeholder="e.g. 2026 AI-Native Infrastructure"
                                  value={ms.title}
                                  onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                                />
                              </div>
                              <div className="aam-field">
                                <label className="aam-label">Milestone Description</label>
                                <input
                                  type="text"
                                  className="aam-input"
                                  placeholder="Milestone description"
                                  value={ms.desc}
                                  onChange={(e) => handleMilestoneChange(idx, 'desc', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="aam-card-footer">
                  <span className="aam-hint">Mission & Vision cards are responsive with custom blue & orange neon glows.</span>
                  <button type="submit" className="aam-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Mission & Vision'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: CORE VALUES */}
            {activeTab === 'values' && (
              <div className="aam-card">
                <div className="aam-card-header">
                  <div className="aam-card-title-group">
                    <div className="aam-card-icon">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h2 className="aam-card-title">Core Values & Operating Principles</h2>
                      <p className="aam-card-desc">
                        Manage foundational company tenets, numbers, icons, and descriptions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="aam-card-body">
                  <div className="aam-subcard">
                    <div className="aam-subcard-title">
                      <span>Core Values Section Header</span>
                    </div>
                    <div className="aam-row-3">
                      <div className="aam-field">
                        <label className="aam-label">Badge Label</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="e.g. Our Operating Principles"
                          value={formData.valuesHeader.badge}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              valuesHeader: { ...prev.valuesHeader, badge: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="aam-field">
                        <label className="aam-label">Title Line</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="e.g. Our Non-Negotiable"
                          value={formData.valuesHeader.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              valuesHeader: { ...prev.valuesHeader, title: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="aam-field">
                        <label className="aam-label">Title Accent (Gradient)</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="e.g. Core Values"
                          value={formData.valuesHeader.titleAccent}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              valuesHeader: { ...prev.valuesHeader, titleAccent: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="aam-field">
                      <label className="aam-label">Subtitle Description</label>
                      <textarea
                        className="aam-textarea"
                        placeholder="Subtitle explaining operating principles..."
                        value={formData.valuesHeader.subtitle}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            valuesHeader: { ...prev.valuesHeader, subtitle: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Dynamic Values Array */}
                  <div className="aam-subcard">
                    <div className="aam-subcard-header">
                      <div className="aam-subcard-title">
                        <ShieldCheck size={18} color="#16a1ce" />
                        <span>Core Values List</span>
                      </div>
                      <button
                        type="button"
                        className="aam-item-badge"
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={handleAddValue}
                      >
                        + Add Value
                      </button>
                    </div>

                    <div className="aam-items-list">
                      {formData.values.map((val, idx) => (
                        <div key={idx} className="aam-item-card">
                          <div className="aam-item-card-top">
                            <span className="aam-item-badge">Value #{idx + 1}</span>
                            <button
                              type="button"
                              className="aam-item-btn-del"
                              onClick={() => handleRemoveValue(idx)}
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="aam-row-3">
                            <div className="aam-field">
                              <label className="aam-label">Number (Index)</label>
                              <input
                                type="text"
                                className="aam-input"
                                placeholder="01"
                                value={val.number}
                                onChange={(e) => handleValueChange(idx, 'number', e.target.value)}
                              />
                            </div>
                            <div className="aam-field">
                              <label className="aam-label">Title</label>
                              <input
                                type="text"
                                className="aam-input"
                                placeholder="e.g. Engineering Integrity"
                                value={val.title}
                                onChange={(e) => handleValueChange(idx, 'title', e.target.value)}
                              />
                            </div>
                            <div className="aam-field">
                              <label className="aam-label">Icon</label>
                              <select
                                className="aam-input"
                                value={val.icon}
                                onChange={(e) => handleValueChange(idx, 'icon', e.target.value)}
                              >
                                <option value="ShieldCheck">ShieldCheck (Security / Trust)</option>
                                <option value="Users">Users (Collaboration / Team)</option>
                                <option value="CheckCircle2">CheckCircle2 (Quality / Precision)</option>
                                <option value="Zap">Zap (Velocity / Speed)</option>
                              </select>
                            </div>
                          </div>

                          <div className="aam-field">
                            <label className="aam-label">Value Description</label>
                            <textarea
                              className="aam-textarea"
                              placeholder="Explanation of this value..."
                              value={val.desc}
                              onChange={(e) => handleValueChange(idx, 'desc', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="aam-card-footer">
                  <span className="aam-hint">Values are rendered with glass hover cards on the About page.</span>
                  <button type="submit" className="aam-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Core Values'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: WHY CHOOSE US & CTA */}
            {activeTab === 'whyChoose' && (
              <div className="aam-card">
                <div className="aam-card-header">
                  <div className="aam-card-title-group">
                    <div className="aam-card-icon">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h2 className="aam-card-title">Why Choose Us & Consultation CTA Strip</h2>
                      <p className="aam-card-desc">
                        Manage competitive advantages and the bottom consultation callout.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="aam-card-body">
                  <div className="aam-subcard">
                    <div className="aam-subcard-title">
                      <span>Why Choose Us Section Header</span>
                    </div>
                    <div className="aam-row-3">
                      <div className="aam-field">
                        <label className="aam-label">Badge Label</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="e.g. The BER Advantage"
                          value={formData.whyChooseUsHeader.badge}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              whyChooseUsHeader: {
                                ...prev.whyChooseUsHeader,
                                badge: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="aam-field">
                        <label className="aam-label">Title Line</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="e.g. Why Forward-Thinking Brands"
                          value={formData.whyChooseUsHeader.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              whyChooseUsHeader: {
                                ...prev.whyChooseUsHeader,
                                title: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="aam-field">
                        <label className="aam-label">Title Accent (Gradient)</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="e.g. Choose Us"
                          value={formData.whyChooseUsHeader.titleAccent}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              whyChooseUsHeader: {
                                ...prev.whyChooseUsHeader,
                                titleAccent: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="aam-field">
                      <label className="aam-label">Subtitle Description</label>
                      <textarea
                        className="aam-textarea"
                        placeholder="Subtitle explaining competitive advantage..."
                        value={formData.whyChooseUsHeader.subtitle}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            whyChooseUsHeader: {
                              ...prev.whyChooseUsHeader,
                              subtitle: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Advantages List */}
                  <div className="aam-subcard">
                    <div className="aam-subcard-header">
                      <div className="aam-subcard-title">
                        <Zap size={18} color="#16a1ce" />
                        <span>Advantage Cards</span>
                      </div>
                      <button
                        type="button"
                        className="aam-item-badge"
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={handleAddWhy}
                      >
                        + Add Advantage
                      </button>
                    </div>

                    <div className="aam-items-list">
                      {formData.whyChooseUs.map((item, idx) => (
                        <div key={idx} className="aam-item-card">
                          <div className="aam-item-card-top">
                            <span className="aam-item-badge">Advantage #{idx + 1}</span>
                            <button
                              type="button"
                              className="aam-item-btn-del"
                              onClick={() => handleRemoveWhy(idx)}
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="aam-row-2">
                            <div className="aam-field">
                              <label className="aam-label">Title</label>
                              <input
                                type="text"
                                className="aam-input"
                                placeholder="e.g. Full-Stack Mastery"
                                value={item.title}
                                onChange={(e) => handleWhyChange(idx, 'title', e.target.value)}
                              />
                            </div>
                            <div className="aam-field">
                              <label className="aam-label">Icon</label>
                              <select
                                className="aam-input"
                                value={item.icon}
                                onChange={(e) => handleWhyChange(idx, 'icon', e.target.value)}
                              >
                                <option value="Layers">Layers (Architecture / Full-Stack)</option>
                                <option value="Zap">Zap (Performance / Speed)</option>
                                <option value="Lock">Lock (Security / Enterprise)</option>
                                <option value="Headphones">Headphones (Dedicated Support)</option>
                              </select>
                            </div>
                          </div>

                          <div className="aam-field">
                            <label className="aam-label">Description</label>
                            <textarea
                              className="aam-textarea"
                              placeholder="Explanation of this advantage..."
                              value={item.desc}
                              onChange={(e) => handleWhyChange(idx, 'desc', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Consultation CTA Box */}
                  <div className="aam-subcard">
                    <div className="aam-subcard-title">
                      <span>Bottom Consultation Callout Banner</span>
                    </div>

                    <div className="aam-row-2">
                      <div className="aam-field">
                        <label className="aam-label">CTA Box Title</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="e.g. Have an ambitious project in mind?"
                          value={formData.ctaBox.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              ctaBox: { ...prev.ctaBox, title: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="aam-field">
                        <label className="aam-label">CTA Button Label</label>
                        <input
                          type="text"
                          className="aam-input"
                          placeholder="e.g. Get Free Consultation"
                          value={formData.ctaBox.buttonText}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              ctaBox: { ...prev.ctaBox, buttonText: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="aam-field">
                      <label className="aam-label">CTA Box Supporting Text</label>
                      <textarea
                        className="aam-textarea"
                        placeholder="e.g. Speak directly with our senior technology team..."
                        value={formData.ctaBox.text}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ctaBox: { ...prev.ctaBox, text: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="aam-card-footer">
                  <span className="aam-hint">Clicking the consultation CTA button opens the interactive quote modal.</span>
                  <button type="submit" className="aam-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Advantages & CTA'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: ARTWORK & MEDIA UPLOAD */}
            {activeTab === 'media' && (
              <div className="aam-card">
                <div className="aam-card-header">
                  <div className="aam-card-title-group">
                    <div className="aam-card-icon">
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <h2 className="aam-card-title">About Overview Artwork & Media</h2>
                      <p className="aam-card-desc">
                        Upload custom 3D artwork or illustration to display alongside the About Overview section.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="aam-card-body">
                  {/* File Upload Zone */}
                  <div
                    className="aam-upload-zone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="aam-upload-icon-box">
                      {uploadingImage ? (
                        <div className="aam-spinner"></div>
                      ) : (
                        <UploadCloud size={24} />
                      )}
                    </div>
                    <div className="aam-upload-prompt">
                      {uploadingImage
                        ? 'Uploading artwork to server...'
                        : 'Click or drag & drop to upload About artwork image'}
                    </div>
                    <div className="aam-upload-hint">
                      Supported formats: PNG, JPG, WebP, SVG (Max 5MB). Optimal resolution: 1200x900px.
                    </div>
                  </div>

                  {/* Current Image Preview */}
                  {formData.overview.artworkImage ? (
                    <div className="aam-preview-box">
                      <div className="aam-preview-img-wrap">
                        <img
                          src={formData.overview.artworkImage}
                          alt={formData.overview.artworkImageAlt || 'About Artwork Preview'}
                          className="aam-preview-img"
                        />
                      </div>
                      <div className="aam-preview-meta">
                        <div className="aam-preview-title">Current Active Artwork</div>
                        <div className="aam-preview-path">{formData.overview.artworkImage}</div>
                        <div className="aam-preview-actions">
                          <button
                            type="button"
                            className="aam-btn-del-img"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                overview: {
                                  ...prev.overview,
                                  artworkImage: '',
                                },
                              }))
                            }
                          >
                            <Trash2 size={13} />
                            <span>Remove Image (Restore Default 3D Orbit)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aam-subcard">
                      <div className="aam-subcard-title">
                        <Sparkles size={18} color="#16a1ce" />
                        <span>Interactive 3D Neo-Glass Tech Orbit (Default Active)</span>
                      </div>
                      <p className="aam-hint">
                        No custom static image is currently assigned. The public homepage and About page are displaying the interactive 3D Neo-Glass Tech Orbit animation. Uploading an image above will display the custom artwork cleanly in that column instead.
                      </p>
                    </div>
                  )}

                  {/* Manual Image URL & Alt Text */}
                  <div className="aam-row-2">
                    <div className="aam-field">
                      <label className="aam-label">Artwork Image URL (Direct or CDN Link)</label>
                      <input
                        type="text"
                        className="aam-input"
                        placeholder="https://... or /uploads/about/..."
                        value={formData.overview.artworkImage}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            overview: { ...prev.overview, artworkImage: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="aam-field">
                      <label className="aam-label">Artwork Alt Text (Accessibility & SEO)</label>
                      <input
                        type="text"
                        className="aam-input"
                        placeholder="e.g. BER Services 3D Enterprise Architecture"
                        value={formData.overview.artworkImageAlt}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            overview: { ...prev.overview, artworkImageAlt: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="aam-card-footer">
                  <span className="aam-hint">Images are stored in /uploads/about/ and served directly by the backend.</span>
                  <button type="submit" className="aam-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Media Settings'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </AdminLayout>
  );
}

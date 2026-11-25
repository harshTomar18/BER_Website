import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Award,
  Sparkles,
  MessageSquare,
  Users,
  Save,
  Plus,
  Trash2,
  Upload,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  RefreshCw,
  MoveUp,
  MoveDown,
  Layers,
} from 'lucide-react';
import { showcaseApi } from '../../api';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminShowcaseManager.css';

export default function AdminShowcaseManager() {
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' | 'tech' | 'nextGen' | 'testimonials'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  // Form State
  const [techSlider, setTechSlider] = useState({
    eyebrow: '',
    title: '',
    items: [],
    isActive: true,
  });

  const [nextGen, setNextGen] = useState({
    eyebrow: '',
    title: '',
    paragraphs: [],
    isActive: true,
  });

  const [testimonials, setTestimonials] = useState({
    eyebrow: '',
    title: '',
    text: '',
    items: [],
    isActive: true,
  });

  const [clients, setClients] = useState({
    eyebrow: '',
    title: '',
    text: '',
    items: [],
    isActive: true,
  });

  // Fetch admin showcase data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await showcaseApi.getAdminShowcase();
      if (res?.success && res?.data?.showcase) {
        const sc = res.data.showcase;
        setTechSlider({
          eyebrow: sc.techSlider?.eyebrow || '',
          title: sc.techSlider?.title || '',
          items: sc.techSlider?.items || [],
          isActive: sc.techSlider?.isActive !== false,
        });

        setNextGen({
          eyebrow: sc.nextGen?.eyebrow || '',
          title: sc.nextGen?.title || '',
          paragraphs: sc.nextGen?.paragraphs || [],
          isActive: sc.nextGen?.isActive !== false,
        });

        setTestimonials({
          eyebrow: sc.testimonials?.eyebrow || '',
          title: sc.testimonials?.title || '',
          text: sc.testimonials?.text || '',
          items: sc.testimonials?.items || [],
          isActive: sc.testimonials?.isActive !== false,
        });

        setClients({
          eyebrow: sc.clients?.eyebrow || '',
          title: sc.clients?.title || '',
          text: sc.clients?.text || '',
          items: sc.clients?.items || [],
          isActive: sc.clients?.isActive !== false,
        });
      }
    } catch (err) {
      console.error('Failed to load showcase configuration:', err);
      setMessage({ type: 'error', text: 'Failed to load showcase data from server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        techSlider,
        nextGen,
        testimonials,
        clients,
      };

      const res = await showcaseApi.updateShowcase(payload);
      if (res?.success) {
        setMessage({
          type: 'success',
          text: 'Showcase & Client sections updated successfully in database!',
        });
      } else {
        setMessage({
          type: 'error',
          text: res?.message || 'Failed to save showcase changes.',
        });
      }
    } catch (err) {
      console.error('Save error:', err);
      setMessage({
        type: 'error',
        text: err?.message || 'Server error while saving showcase sections.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Upload image handler
  const handleFileUpload = async (file, onUploaded) => {
    try {
      const res = await showcaseApi.uploadImage(file);
      if (res?.success && res?.data?.url) {
        onUploaded(res.data.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image. Please check file format.');
    }
  };

  // -----------------------------------------------------
  // TechSlider Handlers
  // -----------------------------------------------------
  const handleAddTech = () => {
    const newItem = {
      id: `tech-${Date.now()}`,
      pillTitle: '',
      title: '',
      slug: 'website-designing-development',
      iconImg: '',
      iconType: 'code',
      description: '',
      techs: [{ name: '', color: '#1385ac' }],
      order: techSlider.items.length + 1,
      isActive: true,
    };
    setTechSlider((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleUpdateTech = (idx, field, val) => {
    setTechSlider((prev) => {
      const updated = [...prev.items];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, items: updated };
    });
  };

  const handleDeleteTech = (idx) => {
    if (!window.confirm('Delete this technology pill?')) return;
    setTechSlider((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  // -----------------------------------------------------
  // NextGen Handlers
  // -----------------------------------------------------
  const handleAddParagraph = () => {
    setNextGen((prev) => ({ ...prev, paragraphs: [...prev.paragraphs, ''] }));
  };

  const handleUpdateParagraph = (idx, val) => {
    setNextGen((prev) => {
      const updated = [...prev.paragraphs];
      updated[idx] = val;
      return { ...prev, paragraphs: updated };
    });
  };

  const handleDeleteParagraph = (idx) => {
    setNextGen((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== idx),
    }));
  };

  // -----------------------------------------------------
  // Testimonials Handlers
  // -----------------------------------------------------
  const handleAddTestimonial = () => {
    const newItem = {
      name: '',
      role: '',
      text: '',
      avatar: '',
      rating: 5,
      order: testimonials.items.length + 1,
      isActive: true,
    };
    setTestimonials((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleUpdateTestimonial = (idx, field, val) => {
    setTestimonials((prev) => {
      const updated = [...prev.items];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, items: updated };
    });
  };

  const handleDeleteTestimonial = (idx) => {
    if (!window.confirm('Delete this testimonial?')) return;
    setTestimonials((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  // -----------------------------------------------------
  // Clients Handlers
  // -----------------------------------------------------
  const handleAddClient = () => {
    const newItem = {
      name: '',
      logo: '',
      website: '',
      order: clients.items.length + 1,
      isActive: true,
    };
    setClients((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleUpdateClient = (idx, field, val) => {
    setClients((prev) => {
      const updated = [...prev.items];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, items: updated };
    });
  };

  const handleDeleteClient = (idx) => {
    if (!window.confirm('Delete this client logo?')) return;
    setClients((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  if (loading) {
    return (
      <AdminLayout activeTab="showcase">
        <div className="ash-page">
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
            <RefreshCw size={28} className="spin" style={{ marginBottom: 12, color: '#16a1ce' }} />
            <p>Loading Showcase & Clients configuration...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="showcase">
      <div className="ash-page">
      {/* Top Header Bar */}
      <div className="ash-header">
        <div>
          <div className="ash-breadcrumb">
            <Link to="/admin/dashboard">Admin Console</Link>
            <span>/</span>
            <span>Clients & Global Showcase</span>
          </div>
          <h1 className="ash-title">Clients & Global Sections Manager</h1>
          <p className="ash-subtitle">
            Manage Client Logos marquee, Technologies We Work With slider, Next-Gen partner statement,
            and Client Testimonials with live artwork uploads and zero hardcoded text.
          </p>
        </div>

        <div className="ash-header-actions">
          <Link to="/" target="_blank" className="ash-btn-secondary">
            <Eye size={16} />
            <span>View Live Site</span>
          </Link>
          <button
            type="button"
            className="ash-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {message && (
        <div className={`ash-alert ash-alert--${message.type}`}>
          {message.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Sub-Tabs Navigation Bar */}
      <div className="ash-tabs-nav">
        <button
          type="button"
          className={`ash-tab-btn ${activeTab === 'clients' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          <Users size={16} />
          <span>Our Clients Marquee</span>
          <span className="ash-tab-badge">{clients.items?.length || 0}</span>
        </button>

        <button
          type="button"
          className={`ash-tab-btn ${activeTab === 'tech' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('tech')}
        >
          <Code size={16} />
          <span>Technologies We Work With</span>
          <span className="ash-tab-badge">{techSlider.items?.length || 0}</span>
        </button>

        <button
          type="button"
          className={`ash-tab-btn ${activeTab === 'testimonials' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          <MessageSquare size={16} />
          <span>Client Testimonials</span>
          <span className="ash-tab-badge">{testimonials.items?.length || 0}</span>
        </button>

        <button
          type="button"
          className={`ash-tab-btn ${activeTab === 'nextGen' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('nextGen')}
        >
          <Sparkles size={16} />
          <span>Next-Gen Vision Statement</span>
        </button>
      </div>

      {/* =====================================================
          TAB 1: CLIENTS MARQUEE (IMAGE 4)
          ===================================================== */}
      {activeTab === 'clients' && (
        <div className="ash-card">
          <div className="ash-card-header">
            <div className="ash-card-title-wrap">
              <div className="ash-card-icon">
                <Users size={22} />
              </div>
              <div>
                <h2 className="ash-card-title">Our Clients Logo Marquee</h2>
                <p className="ash-card-subtitle">
                  Configure the marquee track of partner logos displayed on the homepage.
                </p>
              </div>
            </div>

            <label className="ash-toggle-wrap">
              <input
                type="checkbox"
                className="ash-toggle-input"
                checked={clients.isActive}
                onChange={(e) =>
                  setClients((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
              <span className="ash-toggle-slider"></span>
              <span className="ash-toggle-label">
                {clients.isActive ? 'Section Active' : 'Section Hidden'}
              </span>
            </label>
          </div>

          {/* Header Copy */}
          <div className="ash-form-grid">
            <div className="ash-field">
              <label className="ash-label">Eyebrow / Badge Text</label>
              <input
                type="text"
                className="ash-input"
                placeholder="e.g. Our Clients"
                value={clients.eyebrow}
                onChange={(e) =>
                  setClients((prev) => ({ ...prev, eyebrow: e.target.value }))
                }
              />
            </div>

            <div className="ash-field">
              <label className="ash-label">Section Title</label>
              <input
                type="text"
                className="ash-input"
                placeholder="e.g. We work with the Best Clients"
                value={clients.title}
                onChange={(e) =>
                  setClients((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div className="ash-field ash-form-full">
              <label className="ash-label">Subtitle Description</label>
              <input
                type="text"
                className="ash-input"
                placeholder="e.g. Trusted by ambitious startups and leading enterprise brands across industries."
                value={clients.text}
                onChange={(e) =>
                  setClients((prev) => ({ ...prev, text: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Client Logos List */}
          <div className="ash-items-list">
            {clients.items.map((client, idx) => (
              <div key={client._id || idx} className="ash-item-card">
                <div className="ash-item-top">
                  <div className="ash-item-title-box">
                    <div className="ash-item-thumb">
                      {client.logo ? (
                        <img
                          src={client.logo}
                          alt={client.name || ''}
                          className="ash-item-thumb-img"
                        />
                      ) : (
                        <Users size={20} color="#94a3b8" />
                      )}
                    </div>
                    <div>
                      <div className="ash-item-name">{client.name || `Client #${idx + 1}`}</div>
                      <span className="ash-item-badge">ORDER #{idx + 1}</span>
                    </div>
                  </div>

                  <div className="ash-item-actions">
                    <label className="ash-toggle-wrap" style={{ marginRight: 8 }}>
                      <input
                        type="checkbox"
                        className="ash-toggle-input"
                        checked={client.isActive !== false}
                        onChange={(e) =>
                          handleUpdateClient(idx, 'isActive', e.target.checked)
                        }
                      />
                      <span className="ash-toggle-slider"></span>
                      <span className="ash-toggle-label" style={{ fontSize: '0.78rem' }}>
                        {client.isActive !== false ? 'Active' : 'Disabled'}
                      </span>
                    </label>

                    <button
                      type="button"
                      className="ash-btn-icon-del"
                      onClick={() => handleDeleteClient(idx)}
                      title="Remove Client"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="ash-form-grid ash-form-grid--3">
                  <div className="ash-field">
                    <label className="ash-label">Client Brand Name</label>
                    <input
                      type="text"
                      className="ash-input"
                      placeholder="e.g. PhonePe"
                      value={client.name}
                      onChange={(e) => handleUpdateClient(idx, 'name', e.target.value)}
                    />
                  </div>

                  <div className="ash-field">
                    <label className="ash-label">Website URL (Optional)</label>
                    <input
                      type="text"
                      className="ash-input"
                      placeholder="e.g. https://phonepe.com"
                      value={client.website || ''}
                      onChange={(e) => handleUpdateClient(idx, 'website', e.target.value)}
                    />
                  </div>

                  <div className="ash-field">
                    <label className="ash-label">Display Order</label>
                    <input
                      type="number"
                      className="ash-input"
                      value={client.order || idx + 1}
                      onChange={(e) =>
                        handleUpdateClient(idx, 'order', parseInt(e.target.value) || 0)
                      }
                    />
                  </div>

                  {/* Direct Logo Upload Component */}
                  <div className="ash-field ash-form-full">
                    <label className="ash-label">Brand Logo Image</label>
                    <div className="ash-uploader">
                      <div className="ash-uploader-preview">
                        {client.logo ? (
                          <img src={client.logo} alt="Preview" />
                        ) : (
                          <Upload size={20} color="#94a3b8" />
                        )}
                      </div>
                      <div className="ash-uploader-content">
                        <p className="ash-uploader-text">
                          {client.logo ? 'Logo Uploaded' : 'Upload Brand Logo (PNG, SVG, WebP)'}
                        </p>
                        <p className="ash-uploader-sub">
                          {client.logo || 'Transparent background PNG or SVG recommended'}
                        </p>
                      </div>
                      <label className="ash-uploader-btn">
                        <Upload size={14} />
                        <span>Browse File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="ash-uploader-file-input"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], (url) => {
                                handleUpdateClient(idx, 'logo', url);
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="ash-btn-add" onClick={handleAddClient}>
            <Plus size={18} />
            <span>Add New Client Logo</span>
          </button>
        </div>
      )}

      {/* =====================================================
          TAB 2: TECHNOLOGIES WE WORK WITH (IMAGE 1)
          ===================================================== */}
      {activeTab === 'tech' && (
        <div className="ash-card">
          <div className="ash-card-header">
            <div className="ash-card-title-wrap">
              <div className="ash-card-icon">
                <Code size={22} />
              </div>
              <div>
                <h2 className="ash-card-title">Technologies We Work With (TechSlider)</h2>
                <p className="ash-card-subtitle">
                  Manage the interactive technology marquee ribbon, icons, and floating detail speech-bubble cards.
                </p>
              </div>
            </div>

            <label className="ash-toggle-wrap">
              <input
                type="checkbox"
                className="ash-toggle-input"
                checked={techSlider.isActive}
                onChange={(e) =>
                  setTechSlider((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
              <span className="ash-toggle-slider"></span>
              <span className="ash-toggle-label">
                {techSlider.isActive ? 'Section Active' : 'Section Hidden'}
              </span>
            </label>
          </div>

          {/* Header Copy */}
          <div className="ash-form-grid">
            <div className="ash-field">
              <label className="ash-label">Eyebrow / Badge Text</label>
              <input
                type="text"
                className="ash-input"
                placeholder="e.g. Our Trusted Suppliers"
                value={techSlider.eyebrow}
                onChange={(e) =>
                  setTechSlider((prev) => ({ ...prev, eyebrow: e.target.value }))
                }
              />
            </div>

            <div className="ash-field">
              <label className="ash-label">Section Title</label>
              <input
                type="text"
                className="ash-input"
                placeholder="e.g. Technologies We Work With"
                value={techSlider.title}
                onChange={(e) =>
                  setTechSlider((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Technology Cards List */}
          <div className="ash-items-list">
            {techSlider.items.map((item, idx) => (
              <div key={item._id || item.id || idx} className="ash-item-card">
                <div className="ash-item-top">
                  <div className="ash-item-title-box">
                    <div className="ash-item-thumb">
                      {item.iconImg ? (
                        <img
                          src={item.iconImg}
                          alt={item.pillTitle || ''}
                          className="ash-item-thumb-img"
                        />
                      ) : (
                        <Code size={20} color="#1385ac" />
                      )}
                    </div>
                    <div>
                      <div className="ash-item-name">
                        {item.pillTitle || item.title || `Tech #${idx + 1}`}
                      </div>
                      <span className="ash-item-badge">PILL #{idx + 1}</span>
                    </div>
                  </div>

                  <div className="ash-item-actions">
                    <label className="ash-toggle-wrap" style={{ marginRight: 8 }}>
                      <input
                        type="checkbox"
                        className="ash-toggle-input"
                        checked={item.isActive !== false}
                        onChange={(e) =>
                          handleUpdateTech(idx, 'isActive', e.target.checked)
                        }
                      />
                      <span className="ash-toggle-slider"></span>
                      <span className="ash-toggle-label" style={{ fontSize: '0.78rem' }}>
                        {item.isActive !== false ? 'Active' : 'Disabled'}
                      </span>
                    </label>

                    <button
                      type="button"
                      className="ash-btn-icon-del"
                      onClick={() => handleDeleteTech(idx)}
                      title="Remove Technology"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="ash-form-grid ash-form-grid--3">
                  <div className="ash-field">
                    <label className="ash-label">Marquee Pill Label</label>
                    <input
                      type="text"
                      className="ash-input"
                      placeholder="e.g. PHP"
                      value={item.pillTitle || ''}
                      onChange={(e) => handleUpdateTech(idx, 'pillTitle', e.target.value)}
                    />
                  </div>

                  <div className="ash-field">
                    <label className="ash-label">Card Headline Title</label>
                    <input
                      type="text"
                      className="ash-input"
                      placeholder="e.g. PHP & Laravel Development"
                      value={item.title || ''}
                      onChange={(e) => handleUpdateTech(idx, 'title', e.target.value)}
                    />
                  </div>

                  <div className="ash-field">
                    <label className="ash-label">Icon Category</label>
                    <select
                      className="ash-select"
                      value={item.iconType || 'code'}
                      onChange={(e) => handleUpdateTech(idx, 'iconType', e.target.value)}
                    >
                      <option value="code">Code (Programming)</option>
                      <option value="mobile">Mobile (Apps)</option>
                      <option value="cloud">Cloud (Infrastructure)</option>
                      <option value="cart">Cart (eCommerce)</option>
                      <option value="ai">Bot / AI</option>
                      <option value="analytics">Analytics (Data)</option>
                      <option value="security">Security (Shield)</option>
                      <option value="marketing">Marketing (Growth)</option>
                      <option value="design">Design (Palette)</option>
                    </select>
                  </div>

                  <div className="ash-field ash-form-full">
                    <label className="ash-label">Detail Description (in Hover Bubble)</label>
                    <textarea
                      className="ash-textarea"
                      placeholder="Brief description of the tech capability..."
                      value={item.description || ''}
                      onChange={(e) => handleUpdateTech(idx, 'description', e.target.value)}
                    />
                  </div>

                  <div className="ash-field">
                    <label className="ash-label">Target Service Route / Slug</label>
                    <input
                      type="text"
                      className="ash-input"
                      placeholder="e.g. custom-software-development"
                      value={item.slug || ''}
                      onChange={(e) => handleUpdateTech(idx, 'slug', e.target.value)}
                    />
                  </div>

                  {/* Direct Technology Logo/Icon Upload */}
                  <div className="ash-field" style={{ gridColumn: 'span 2' }}>
                    <label className="ash-label">Custom Logo Image (Optional)</label>
                    <div className="ash-uploader">
                      <div className="ash-uploader-preview">
                        {item.iconImg ? (
                          <img src={item.iconImg} alt="Preview" />
                        ) : (
                          <Upload size={18} color="#94a3b8" />
                        )}
                      </div>
                      <div className="ash-uploader-content">
                        <p className="ash-uploader-text">
                          {item.iconImg ? 'Tech Logo Uploaded' : 'Upload Tech Logo'}
                        </p>
                        <p className="ash-uploader-sub">
                          {item.iconImg || 'Upload PNG/SVG icon to display on ribbon'}
                        </p>
                      </div>
                      <label className="ash-uploader-btn">
                        <Upload size={14} />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="ash-uploader-file-input"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], (url) => {
                                handleUpdateTech(idx, 'iconImg', url);
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="ash-btn-add" onClick={handleAddTech}>
            <Plus size={18} />
            <span>Add New Technology</span>
          </button>
        </div>
      )}

      {/* =====================================================
          TAB 3: CLIENT TESTIMONIALS (IMAGE 3)
          ===================================================== */}
      {activeTab === 'testimonials' && (
        <div className="ash-card">
          <div className="ash-card-header">
            <div className="ash-card-title-wrap">
              <div className="ash-card-icon">
                <MessageSquare size={22} />
              </div>
              <div>
                <h2 className="ash-card-title">Client Feedback & Testimonials</h2>
                <p className="ash-card-subtitle">
                  Configure testimonials carousel with quote narrative and client photos or initials.
                </p>
              </div>
            </div>

            <label className="ash-toggle-wrap">
              <input
                type="checkbox"
                className="ash-toggle-input"
                checked={testimonials.isActive}
                onChange={(e) =>
                  setTestimonials((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
              <span className="ash-toggle-slider"></span>
              <span className="ash-toggle-label">
                {testimonials.isActive ? 'Section Active' : 'Section Hidden'}
              </span>
            </label>
          </div>

          {/* Header Copy */}
          <div className="ash-form-grid">
            <div className="ash-field">
              <label className="ash-label">Eyebrow / Badge Text</label>
              <input
                type="text"
                className="ash-input"
                placeholder="e.g. Client Feedback"
                value={testimonials.eyebrow}
                onChange={(e) =>
                  setTestimonials((prev) => ({ ...prev, eyebrow: e.target.value }))
                }
              />
            </div>

            <div className="ash-field">
              <label className="ash-label">Section Title</label>
              <input
                type="text"
                className="ash-input"
                placeholder="e.g. Hear what our Clients Say"
                value={testimonials.title}
                onChange={(e) =>
                  setTestimonials((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div className="ash-field ash-form-full">
              <label className="ash-label">Subtitle Description</label>
              <input
                type="text"
                className="ash-input"
                placeholder="e.g. Hear firsthand from our valued clients..."
                value={testimonials.text}
                onChange={(e) =>
                  setTestimonials((prev) => ({ ...prev, text: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Testimonials List */}
          <div className="ash-items-list">
            {testimonials.items.map((t, idx) => (
              <div key={t._id || idx} className="ash-item-card">
                <div className="ash-item-top">
                  <div className="ash-item-title-box">
                    <div className="ash-item-thumb">
                      {t.avatar ? (
                        <img
                          src={t.avatar}
                          alt={t.name || ''}
                          className="ash-item-thumb-img ash-item-thumb-img--avatar"
                        />
                      ) : (
                        <span style={{ fontWeight: 800, color: '#1385ac' }}>
                          {t.name ? t.name[0] : 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="ash-item-name">{t.name || `Client #${idx + 1}`}</div>
                      <span className="ash-item-badge">{t.role || 'Client'}</span>
                    </div>
                  </div>

                  <div className="ash-item-actions">
                    <label className="ash-toggle-wrap" style={{ marginRight: 8 }}>
                      <input
                        type="checkbox"
                        className="ash-toggle-input"
                        checked={t.isActive !== false}
                        onChange={(e) =>
                          handleUpdateTestimonial(idx, 'isActive', e.target.checked)
                        }
                      />
                      <span className="ash-toggle-slider"></span>
                      <span className="ash-toggle-label" style={{ fontSize: '0.78rem' }}>
                        {t.isActive !== false ? 'Active' : 'Disabled'}
                      </span>
                    </label>

                    <button
                      type="button"
                      className="ash-btn-icon-del"
                      onClick={() => handleDeleteTestimonial(idx)}
                      title="Remove Testimonial"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="ash-form-grid ash-form-grid--3">
                  <div className="ash-field">
                    <label className="ash-label">Client Full Name</label>
                    <input
                      type="text"
                      className="ash-input"
                      placeholder="e.g. Rahul Sharma"
                      value={t.name}
                      onChange={(e) => handleUpdateTestimonial(idx, 'name', e.target.value)}
                    />
                  </div>

                  <div className="ash-field">
                    <label className="ash-label">Role / Designation</label>
                    <input
                      type="text"
                      className="ash-input"
                      placeholder="e.g. Business Owner"
                      value={t.role}
                      onChange={(e) => handleUpdateTestimonial(idx, 'role', e.target.value)}
                    />
                  </div>

                  <div className="ash-field">
                    <label className="ash-label">Display Order</label>
                    <input
                      type="number"
                      className="ash-input"
                      value={t.order || idx + 1}
                      onChange={(e) =>
                        handleUpdateTestimonial(
                          idx,
                          'order',
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="ash-field ash-form-full">
                    <label className="ash-label">Testimonial Quote</label>
                    <textarea
                      className="ash-textarea"
                      placeholder="What the client said about BER Services..."
                      value={t.text}
                      onChange={(e) => handleUpdateTestimonial(idx, 'text', e.target.value)}
                    />
                  </div>

                  {/* Direct Avatar Upload Component */}
                  <div className="ash-field ash-form-full">
                    <label className="ash-label">Client Photo / Avatar (Optional)</label>
                    <div className="ash-uploader">
                      <div className="ash-uploader-preview">
                        {t.avatar ? (
                          <img
                            src={t.avatar}
                            alt="Avatar Preview"
                            className="ash-item-thumb-img--avatar"
                          />
                        ) : (
                          <Upload size={18} color="#94a3b8" />
                        )}
                      </div>
                      <div className="ash-uploader-content">
                        <p className="ash-uploader-text">
                          {t.avatar ? 'Avatar Photo Uploaded' : 'Upload Client Photo'}
                        </p>
                        <p className="ash-uploader-sub">
                          {t.avatar || 'Leave empty to display initial circle automatically'}
                        </p>
                      </div>
                      <label className="ash-uploader-btn">
                        <Upload size={14} />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="ash-uploader-file-input"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], (url) => {
                                handleUpdateTestimonial(idx, 'avatar', url);
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="ash-btn-add" onClick={handleAddTestimonial}>
            <Plus size={18} />
            <span>Add New Testimonial</span>
          </button>
        </div>
      )}

      {/* =====================================================
          TAB 4: NEXT-GEN VISION STATEMENT (IMAGE 2)
          ===================================================== */}
      {activeTab === 'nextGen' && (
        <div className="ash-card">
          <div className="ash-card-header">
            <div className="ash-card-title-wrap">
              <div className="ash-card-icon">
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="ash-card-title">Next-Generation Engineering Statement</h2>
                <p className="ash-card-subtitle">
                  Manage the dark blue vision & capability banner displayed on Homepage and About page.
                </p>
              </div>
            </div>

            <label className="ash-toggle-wrap">
              <input
                type="checkbox"
                className="ash-toggle-input"
                checked={nextGen.isActive}
                onChange={(e) =>
                  setNextGen((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
              <span className="ash-toggle-slider"></span>
              <span className="ash-toggle-label">
                {nextGen.isActive ? 'Section Active' : 'Section Hidden'}
              </span>
            </label>
          </div>

          <div className="ash-form-grid">
            <div className="ash-field">
              <label className="ash-label">Eyebrow / Badge Text</label>
              <input
                type="text"
                className="ash-input"
                placeholder="e.g. This is what we will be"
                value={nextGen.eyebrow}
                onChange={(e) =>
                  setNextGen((prev) => ({ ...prev, eyebrow: e.target.value }))
                }
              />
            </div>

            <div className="ash-field">
              <label className="ash-label">Headline Title</label>
              <input
                type="text"
                className="ash-input"
                placeholder="e.g. A Next-Generation Engineering & Digital Solutions Partner"
                value={nextGen.title}
                onChange={(e) =>
                  setNextGen((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Paragraphs List */}
          <div style={{ marginTop: 24 }}>
            <label className="ash-label" style={{ marginBottom: 12 }}>
              Narrative Paragraphs
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {nextGen.paragraphs.map((p, pIdx) => (
                <div
                  key={pIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    background: '#f8fafc',
                    padding: 16,
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#1385ac',
                      marginTop: 10,
                      flexShrink: 0,
                    }}
                  >
                    #{pIdx + 1}
                  </span>
                  <textarea
                    className="ash-textarea"
                    style={{ flex: 1, minHeight: 80 }}
                    value={p}
                    placeholder={`Paragraph #${pIdx + 1}...`}
                    onChange={(e) => handleUpdateParagraph(pIdx, e.target.value)}
                  />
                  <button
                    type="button"
                    className="ash-btn-icon-del"
                    style={{ marginTop: 6 }}
                    onClick={() => handleDeleteParagraph(pIdx)}
                    title="Remove Paragraph"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="ash-btn-add"
              style={{ marginTop: 16 }}
              onClick={handleAddParagraph}
            >
              <Plus size={18} />
              <span>Add Narrative Paragraph</span>
            </button>
          </div>
        </div>
      )}
    </div>
  </AdminLayout>
);
}

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
  Layers,
  Sparkles,
  Zap,
  Code2,
  Cpu,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  Check,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Lock,
  Award
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { serviceApi } from '../../api';
import '../styles/AdminServicesManager.css';

const BLANK_SERVICE = {
  title: '',
  slug: '',
  eyebrow: 'Enterprise Service Overview',
  badge: '',
  tagline: '',
  short: '',
  order: 1,
  heroImage: '',
  galleryImage: '',
  galleryLabel: '',
  image: '',
  overview: [''],
  long: '',
  architectureShowcase: {
    badge: 'Interactive Architecture Showcase',
    title: '',
    tagline: '',
    items: [
      {
        num: '01',
        tag: 'Core Performance',
        title: 'Sub-Second Global Edge Delivery',
        desc: 'Engineered with micro-frontend hydration, automated asset compression, and edge CDN routing achieving sub-400ms TTFB worldwide.',
        metric: 'Sub-400ms TTFB • 99/100 Lighthouse',
        hudBadge: 'EDGE PERFORMANCE ENGINE',
        icon: 'Zap',
        image: '',
      },
      {
        num: '02',
        tag: 'Cyber Defense',
        title: 'Zero-Trust Bank-Grade Security',
        desc: 'End-to-end TLS 1.3 encryption, automated DDoS shielding, continuous dependency vulnerability audits, and sanitized input validation.',
        metric: 'A+ SSL Rating • 100% OWASP Compliance',
        hudBadge: 'ZERO-TRUST CYBER SHIELD',
        icon: 'ShieldCheck',
        image: '',
      },
      {
        num: '03',
        tag: 'Cloud Integration',
        title: 'Modular Headless Integration Mesh',
        desc: 'Bi-directional webhooks and resilient event-driven pipelines seamlessly connecting ERP, CRM, marketing automation, and custom admin portals.',
        metric: 'Sub-50ms REST & GraphQL Gateways',
        hudBadge: 'ENTERPRISE INTEGRATION MESH',
        icon: 'Cpu',
        image: '',
      },
    ],
  },
  keyDeliverables: {
    eyebrow: 'Core Architecture',
    title: 'Explore Key Deliverables & Systems',
    subtitle: 'Scroll down through the deliverables or select any module to inspect detailed architecture specifications.',
    items: [
      {
        title: 'Custom UI/UX & Responsive Design',
        desc: 'Bespoke design systems and mobile-first responsive layouts that captivate audiences and maximize user engagement across every viewport.',
        hudTag: 'Interactive Design System',
        metric: '60 FPS • WCAG 2.1 AA Compliant',
        icon: 'Layout',
        image: '',
        deliverables: [
          'Bespoke Figma design tokens and mobile-first fluid breakpoint architectures.',
          'Precision UI layout engineering with touch-friendly responsive interactions.',
          'Reusable component system ensuring long-term brand identity consistency.',
        ],
      },
    ],
  },
  techStackHeader: {
    eyebrow: 'Battle-Tested Stack',
    title: 'Technologies & Frameworks',
    subtitle: 'Modern, high-performance tools selected for fault-tolerant scalability and long-term security.',
  },
  techStack: [],
  processHeader: {
    eyebrow: 'Execution Roadmap',
    title: 'Our 4-Step Agile Delivery Process',
    subtitle: 'Transparent sprint iterations with continuous staging reviews and zero surprise delays.',
  },
  process: [],
  benefitsHeader: {
    eyebrow: 'Measurable ROI',
    title: 'Target Commercial Outcomes',
    subtitle: 'Concrete performance metrics and business impact we target for every deployment.',
  },
  benefits: [],
  guarantees: [
    {
      icon: 'ShieldCheck',
      title: '100% NDA Protection',
      desc: 'Strict non-disclosure agreements with complete client source code and intellectual property ownership.',
    },
    {
      icon: 'Clock',
      title: '24h Scoping Turnaround',
      desc: 'Fast architectural review and comprehensive milestone estimation delivered within 24 business hours.',
    },
    {
      icon: 'Lock',
      title: 'OWASP Bank-Grade Security',
      desc: 'Rigorous input sanitization, automated DDoS mitigation, and SSL encryption preventing vulnerabilities.',
    },
    {
      icon: 'Award',
      title: 'Dedicated SLA Support',
      desc: 'Continuous uptime monitoring, security patching, and responsive post-launch engineering support.',
    },
  ],
  deskCard: {
    badge: 'Chief Architect On Desk',
    title: 'Need Technical Scoping?',
    desc: 'Speak directly with our senior architecture lead to analyze system requirements and get a detailed quote.',
    phone: '+91 85273 35977',
    email: 'info@thebermedia.com',
    whatsapp: 'https://wa.me/918527335977?text=Hello%20BER%20Services%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.',
  },
  finalCta: {
    title: 'Ready to architect your solution?',
    desc: 'Book a confidential discovery session with our senior technology team.',
    buttonText: 'Get Free Consultation',
  },
  capabilities: [],
  points: [],
  isActive: true,
};

export default function AdminServicesManager() {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('basic'); // 'basic' | 'overview' | 'showcase' | 'deliverables' | 'techProcess' | 'benefitsGuarantees' | 'media'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState(null);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const [uploadTargetInfo, setUploadTargetInfo] = useState({ field: 'heroImage', index: null, subField: null });

  // Form data state
  const [formData, setFormData] = useState(BLANK_SERVICE);

  // Load services from API
  const fetchServices = async (preserveSelectedId = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await serviceApi.getAdminServices();
      if (res?.success && Array.isArray(res?.data?.services)) {
        const srvs = res.data.services;
        setServices(srvs);

        if (preserveSelectedId === 'new') {
          setSelectedServiceId('new');
          setFormData({ ...BLANK_SERVICE, order: srvs.length + 1 });
        } else if (preserveSelectedId) {
          const match = srvs.find((s) => s._id === preserveSelectedId);
          if (match) {
            setSelectedServiceId(match._id);
            setFormData(match);
          } else if (srvs.length > 0) {
            setSelectedServiceId(srvs[0]._id);
            setFormData(srvs[0]);
          }
        } else if (srvs.length > 0) {
          setSelectedServiceId(srvs[0]._id);
          setFormData(srvs[0]);
        } else {
          setSelectedServiceId('new');
          setFormData(BLANK_SERVICE);
        }
      }
    } catch (err) {
      console.error('Failed to load services:', err);
      setError(err.message || 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const showNotification = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Switch selected service tab
  const handleSelectService = (srv) => {
    setSelectedServiceId(srv._id);
    setFormData(srv);
    setError(null);
  };

  // New service tab click
  const handleNewService = () => {
    setSelectedServiceId('new');
    setFormData({
      ...BLANK_SERVICE,
      order: services.length + 1,
    });
    setError(null);
  };

  // Generic Image upload trigger
  const triggerUpload = (field, index = null, subField = null) => {
    setUploadTargetInfo({ field, index, subField });
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    const { field, index, subField } = uploadTargetInfo;
    setUploadingTarget(`${field}-${index ?? 'main'}`);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await serviceApi.uploadImage(fd);
      if (res?.success && res?.data?.url) {
        const uploadedUrl = res.data.url;

        setFormData((prev) => {
          if (field === 'showcaseItem' && typeof index === 'number') {
            const updatedItems = [...(prev.architectureShowcase?.items || [])];
            if (updatedItems[index]) {
              updatedItems[index] = { ...updatedItems[index], image: uploadedUrl };
            }
            return {
              ...prev,
              architectureShowcase: {
                ...prev.architectureShowcase,
                items: updatedItems,
              },
            };
          } else if (field === 'deliverableItem' && typeof index === 'number') {
            const updatedItems = [...(prev.keyDeliverables?.items || [])];
            if (updatedItems[index]) {
              updatedItems[index] = { ...updatedItems[index], image: uploadedUrl };
            }
            return {
              ...prev,
              keyDeliverables: {
                ...prev.keyDeliverables,
                items: updatedItems,
              },
            };
          } else {
            return {
              ...prev,
              [field]: uploadedUrl,
            };
          }
        });

        showNotification('Image uploaded successfully!');
      } else {
        throw new Error(res?.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setError(err.message || 'Failed to upload image.');
    } finally {
      setUploadingTarget(null);
    }
  };

  // Save or Create Service
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title?.trim() || !formData.slug?.trim()) {
      setError('Service Title and Slug are required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (selectedServiceId === 'new') {
        const res = await serviceApi.createService(formData);
        if (res?.success && res?.data?.service) {
          showNotification(`Service "${res.data.service.title}" created successfully!`);
          await fetchServices(res.data.service._id);
        } else {
          throw new Error(res?.message || 'Failed to create service.');
        }
      } else {
        const res = await serviceApi.updateService(selectedServiceId, formData);
        if (res?.success && res?.data?.service) {
          showNotification(`Service "${res.data.service.title}" updated & overwritten in DB!`);
          await fetchServices(selectedServiceId);
        } else {
          throw new Error(res?.message || 'Failed to update service.');
        }
      }
    } catch (err) {
      console.error('Save service failed:', err);
      setError(err.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Service
  const handleDelete = async () => {
    if (!selectedServiceId || selectedServiceId === 'new') return;
    const confirm = window.confirm(`Are you sure you want to delete the service "${formData.title}"?`);
    if (!confirm) return;

    setSaving(true);
    setError(null);
    try {
      const res = await serviceApi.deleteService(selectedServiceId);
      if (res?.success) {
        showNotification('Service deleted successfully.');
        await fetchServices();
      } else {
        throw new Error(res?.message || 'Failed to delete service.');
      }
    } catch (err) {
      console.error('Delete service failed:', err);
      setError(err.message || 'Failed to delete service.');
    } finally {
      setSaving(false);
    }
  };

  // Array handlers: Overview Paragraphs
  const handleAddOverview = () => {
    setFormData((prev) => ({
      ...prev,
      overview: [...(prev.overview || []), ''],
    }));
  };

  const handleRemoveOverview = (idx) => {
    setFormData((prev) => ({
      ...prev,
      overview: prev.overview.filter((_, i) => i !== idx),
    }));
  };

  const handleOverviewChange = (idx, val) => {
    setFormData((prev) => {
      const updated = [...(prev.overview || [])];
      updated[idx] = val;
      return { ...prev, overview: updated };
    });
  };

  // Array handlers: Showcase Cards
  const handleAddShowcaseItem = () => {
    const nextNum = String((formData.architectureShowcase?.items || []).length + 1).padStart(2, '0');
    setFormData((prev) => ({
      ...prev,
      architectureShowcase: {
        ...prev.architectureShowcase,
        items: [
          ...(prev.architectureShowcase?.items || []),
          {
            num: nextNum,
            tag: 'Architecture Track',
            title: 'New Showcase Card',
            desc: '',
            metric: 'Sub-50ms SLA',
            hudBadge: 'ENGINE TRACK',
            icon: 'Zap',
            image: '',
          },
        ],
      },
    }));
  };

  const handleRemoveShowcaseItem = (idx) => {
    setFormData((prev) => ({
      ...prev,
      architectureShowcase: {
        ...prev.architectureShowcase,
        items: prev.architectureShowcase.items.filter((_, i) => i !== idx),
      },
    }));
  };

  const handleShowcaseItemChange = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...(prev.architectureShowcase?.items || [])];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], [field]: val };
      }
      return {
        ...prev,
        architectureShowcase: {
          ...prev.architectureShowcase,
          items: updated,
        },
      };
    });
  };

  // Array handlers: Deliverables Modules
  const handleAddDeliverableModule = () => {
    setFormData((prev) => ({
      ...prev,
      keyDeliverables: {
        ...prev.keyDeliverables,
        items: [
          ...(prev.keyDeliverables?.items || []),
          {
            title: 'New Deliverable Module',
            desc: '',
            hudTag: 'Modular System',
            metric: 'Enterprise Certified SLA',
            icon: 'Layout',
            image: '',
            deliverables: ['Production-ready engineering deliverable.'],
          },
        ],
      },
    }));
  };

  const handleRemoveDeliverableModule = (idx) => {
    setFormData((prev) => ({
      ...prev,
      keyDeliverables: {
        ...prev.keyDeliverables,
        items: prev.keyDeliverables.items.filter((_, i) => i !== idx),
      },
    }));
  };

  const handleDeliverableModuleChange = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...(prev.keyDeliverables?.items || [])];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], [field]: val };
      }
      return {
        ...prev,
        keyDeliverables: {
          ...prev.keyDeliverables,
          items: updated,
        },
      };
    });
  };

  // Add bullet to a module
  const handleAddBulletToModule = (modIdx) => {
    setFormData((prev) => {
      const updated = [...(prev.keyDeliverables?.items || [])];
      if (updated[modIdx]) {
        updated[modIdx] = {
          ...updated[modIdx],
          deliverables: [...(updated[modIdx].deliverables || []), ''],
        };
      }
      return {
        ...prev,
        keyDeliverables: { ...prev.keyDeliverables, items: updated },
      };
    });
  };

  const handleRemoveBulletFromModule = (modIdx, bIdx) => {
    setFormData((prev) => {
      const updated = [...(prev.keyDeliverables?.items || [])];
      if (updated[modIdx]) {
        updated[modIdx] = {
          ...updated[modIdx],
          deliverables: updated[modIdx].deliverables.filter((_, i) => i !== bIdx),
        };
      }
      return {
        ...prev,
        keyDeliverables: { ...prev.keyDeliverables, items: updated },
      };
    });
  };

  const handleBulletChangeInModule = (modIdx, bIdx, val) => {
    setFormData((prev) => {
      const updated = [...(prev.keyDeliverables?.items || [])];
      if (updated[modIdx]) {
        const updatedBullets = [...(updated[modIdx].deliverables || [])];
        updatedBullets[bIdx] = val;
        updated[modIdx] = { ...updated[modIdx], deliverables: updatedBullets };
      }
      return {
        ...prev,
        keyDeliverables: { ...prev.keyDeliverables, items: updated },
      };
    });
  };

  // Array handlers: Tech Stack
  const handleAddTech = () => {
    setFormData((prev) => ({
      ...prev,
      techStack: [...(prev.techStack || []), { name: 'New Tech', color: '#1385ac' }],
    }));
  };

  const handleRemoveTech = (idx) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== idx),
    }));
  };

  const handleTechChange = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...(prev.techStack || [])];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], [field]: val };
      }
      return { ...prev, techStack: updated };
    });
  };

  // Array handlers: Process Steps
  const handleAddProcess = () => {
    const nextNum = String((formData.process || []).length + 1).padStart(2, '0');
    setFormData((prev) => ({
      ...prev,
      process: [...(prev.process || []), { step: nextNum, title: 'Sprint Step', desc: '' }],
    }));
  };

  const handleRemoveProcess = (idx) => {
    setFormData((prev) => ({
      ...prev,
      process: prev.process.filter((_, i) => i !== idx),
    }));
  };

  const handleProcessChange = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...(prev.process || [])];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], [field]: val };
      }
      return { ...prev, process: updated };
    });
  };

  // Array handlers: Benefits / ROI
  const handleAddBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...(prev.benefits || []), { value: '99%', label: 'Metric', desc: '' }],
    }));
  };

  const handleRemoveBenefit = (idx) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== idx),
    }));
  };

  const handleBenefitChange = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...(prev.benefits || [])];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], [field]: val };
      }
      return { ...prev, benefits: updated };
    });
  };

  return (
    <AdminLayout activeTab="services">
      <div className="asm-page">
        {/* Header Bar */}
        <div className="asm-header">
          <div>
            <div className="asm-breadcrumb">
              <Link to="/admin/dashboard">Admin Console</Link>
              <span>/</span>
              <span>Services & Capabilities</span>
            </div>
            <h1 className="asm-title">Services & Capabilities Manager</h1>
            <p className="asm-subtitle">
              Manage all primary services, interactive architecture scrub showcases, core deliverables, technical specifications, and uploaded showcase imagery.
            </p>
          </div>

          <div className="asm-header-actions">
            {formData.slug && (
              <Link
                to={`/services-we-provide/${formData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="asm-btn-secondary"
              >
                <ExternalLink size={16} />
                <span>View Live Service</span>
              </Link>
            )}

            {selectedServiceId !== 'new' && (
              <button
                type="button"
                className="asm-btn-danger"
                onClick={handleDelete}
                disabled={saving || loading}
              >
                <Trash2 size={16} />
                <span>Delete Service</span>
              </button>
            )}

            <button
              type="button"
              className="asm-btn-primary"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? <div className="asm-spinner"></div> : <Save size={16} />}
              <span>{selectedServiceId === 'new' ? 'Create Service' : 'Save Service'}</span>
            </button>
          </div>
        </div>

        {/* Hidden File Input for Image Uploads */}
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

        {/* Notification alerts */}
        {notice && (
          <div className="asm-alert asm-alert--success">
            <CheckCircle size={18} />
            <span>{notice}</span>
          </div>
        )}
        {error && (
          <div className="asm-alert asm-alert--error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. HORIZONTAL SERVICES TABS SELECTOR */}
        <div className="asm-service-tabs-wrap">
          <div className="asm-service-tabs">
            {services.map((srv) => {
              const isSelected = selectedServiceId === srv._id;
              return (
                <button
                  key={srv._id}
                  type="button"
                  className={`asm-service-tab-btn ${isSelected ? 'is-active' : ''}`}
                  onClick={() => handleSelectService(srv)}
                >
                  <Layers size={15} />
                  <span>{srv.title || 'Untitled Service'}</span>
                  {!srv.isActive && <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>(Hidden)</span>}
                </button>
              );
            })}

            <button
              type="button"
              className={`asm-service-tab-btn asm-service-tab-btn--new ${
                selectedServiceId === 'new' ? 'is-active' : ''
              }`}
              onClick={handleNewService}
            >
              <Plus size={15} />
              <span>+ Add New Service</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="asm-loading-card">
            <div className="asm-spinner asm-spinner--lg"></div>
            <p>Loading services configuration from database...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="asm-form-grid">
            {/* 2. SUB-TAB NAVIGATION */}
            <div className="asm-subtabs-wrap">
              <nav className="asm-subtabs-nav">
                <button
                  type="button"
                  className={`asm-subtab-btn ${activeSubTab === 'basic' ? 'is-active' : ''}`}
                  onClick={() => setActiveSubTab('basic')}
                >
                  <Sparkles size={15} />
                  <span>1. Basic Info & Slug</span>
                </button>
                <button
                  type="button"
                  className={`asm-subtab-btn ${activeSubTab === 'overview' ? 'is-active' : ''}`}
                  onClick={() => setActiveSubTab('overview')}
                >
                  <Layers size={15} />
                  <span>2. Overview & Desk</span>
                </button>
                <button
                  type="button"
                  className={`asm-subtab-btn ${activeSubTab === 'showcase' ? 'is-active' : ''}`}
                  onClick={() => setActiveSubTab('showcase')}
                >
                  <Cpu size={15} />
                  <span>3. Architecture Showcase</span>
                </button>
                <button
                  type="button"
                  className={`asm-subtab-btn ${activeSubTab === 'deliverables' ? 'is-active' : ''}`}
                  onClick={() => setActiveSubTab('deliverables')}
                >
                  <Code2 size={15} />
                  <span>4. Deliverables Modules</span>
                </button>
                <button
                  type="button"
                  className={`asm-subtab-btn ${activeSubTab === 'techProcess' ? 'is-active' : ''}`}
                  onClick={() => setActiveSubTab('techProcess')}
                >
                  <Zap size={15} />
                  <span>5. Tech Stack & Process</span>
                </button>
                <button
                  type="button"
                  className={`asm-subtab-btn ${activeSubTab === 'benefitsGuarantees' ? 'is-active' : ''}`}
                  onClick={() => setActiveSubTab('benefitsGuarantees')}
                >
                  <BarChart3 size={15} />
                  <span>6. ROI & Guarantees</span>
                </button>
                <button
                  type="button"
                  className={`asm-subtab-btn ${activeSubTab === 'media' ? 'is-active' : ''}`}
                  onClick={() => setActiveSubTab('media')}
                >
                  <ImageIcon size={15} />
                  <span>7. Main Images Upload</span>
                </button>
              </nav>
            </div>

            {/* SUB-TAB 1: BASIC INFO */}
            {activeSubTab === 'basic' && (
              <div className="asm-card">
                <div className="asm-card-header">
                  <div className="asm-card-title-group">
                    <div className="asm-card-icon">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h2 className="asm-card-title">Basic Information & Navigation Links</h2>
                      <p className="asm-card-desc">
                        Defines title, URL routing slug, badges, and brief summaries.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="asm-card-body">
                  <div className="asm-row-2">
                    <div className="asm-field">
                      <label className="asm-label">Service Title *</label>
                      <input
                        type="text"
                        className="asm-input"
                        placeholder="e.g. Website Designing & Development"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="asm-field">
                      <label className="asm-label">URL Slug *</label>
                      <input
                        type="text"
                        className="asm-input"
                        placeholder="e.g. website-designing-development"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="asm-row-3">
                    <div className="asm-field">
                      <label className="asm-label">Eyebrow Header</label>
                      <input
                        type="text"
                        className="asm-input"
                        placeholder="e.g. Enterprise Service Overview"
                        value={formData.eyebrow}
                        onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                      />
                    </div>
                    <div className="asm-field">
                      <label className="asm-label">Badge Label</label>
                      <input
                        type="text"
                        className="asm-input"
                        placeholder="e.g. Modern Web Engineering"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      />
                    </div>
                    <div className="asm-field">
                      <label className="asm-label">Gallery Label</label>
                      <input
                        type="text"
                        className="asm-input"
                        placeholder="e.g. Website Development"
                        value={formData.galleryLabel}
                        onChange={(e) => setFormData({ ...formData, galleryLabel: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="asm-field">
                    <label className="asm-label">Tagline (High-converting hero subtitle)</label>
                    <input
                      type="text"
                      className="asm-input"
                      placeholder="e.g. Enterprise Web Engineering That Converts Visitors Into Long-Term Brand Advocates."
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    />
                  </div>

                  <div className="asm-field">
                    <label className="asm-label">Short Description (Card teaser)</label>
                    <textarea
                      className="asm-textarea"
                      placeholder="Brief 1-2 sentence description..."
                      value={formData.short}
                      onChange={(e) => setFormData({ ...formData, short: e.target.value })}
                    />
                  </div>

                  <div className="asm-row-2">
                    <div className="asm-field">
                      <label className="asm-label">Display Order Index</label>
                      <input
                        type="number"
                        className="asm-input"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })
                        }
                      />
                    </div>
                    <div className="asm-field">
                      <label className="asm-label">Visibility Status</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          style={{ width: 18, height: 18 }}
                        />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {formData.isActive ? 'Active (Visible on Website)' : 'Inactive (Hidden)'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="asm-card-footer">
                  <span className="asm-hint">Changes save to MongoDB and reflect live on the website.</span>
                  <button type="submit" className="asm-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Basic Info'}
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: OVERVIEW & DESK CARD */}
            {activeSubTab === 'overview' && (
              <div className="asm-card">
                <div className="asm-card-header">
                  <div className="asm-card-title-group">
                    <div className="asm-card-icon">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h2 className="asm-card-title">Overview Story & Engineering Desk Card</h2>
                      <p className="asm-card-desc">
                        Multi-paragraph editorial narrative and senior engineering contact widget.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="asm-card-body">
                  <div className="asm-field">
                    <div className="asm-subcard-header">
                      <label className="asm-label">Overview Paragraphs</label>
                      <button
                        type="button"
                        className="asm-item-badge"
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={handleAddOverview}
                      >
                        + Add Paragraph
                      </button>
                    </div>

                    <div className="asm-items-list">
                      {(formData.overview || []).map((paragraph, idx) => (
                        <div key={idx} className="asm-item-card">
                          <div className="asm-item-card-top">
                            <span className="asm-item-badge">Paragraph #{idx + 1}</span>
                            <button
                              type="button"
                              className="asm-item-btn-del"
                              onClick={() => handleRemoveOverview(idx)}
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          </div>
                          <textarea
                            className="asm-textarea"
                            placeholder="Write comprehensive service narrative..."
                            value={paragraph}
                            onChange={(e) => handleOverviewChange(idx, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Engineering Desk Card Settings */}
                  <div className="asm-subcard">
                    <div className="asm-subcard-title">
                      <Phone size={18} color="#16a1ce" />
                      <span>Chief Architect On Desk Settings</span>
                    </div>

                    <div className="asm-row-2">
                      <div className="asm-field">
                        <label className="asm-label">Desk Badge</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.deskCard?.badge || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              deskCard: { ...(formData.deskCard || {}), badge: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="asm-field">
                        <label className="asm-label">Desk Title</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.deskCard?.title || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              deskCard: { ...(formData.deskCard || {}), title: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="asm-field">
                      <label className="asm-label">Desk Supporting Description</label>
                      <textarea
                        className="asm-textarea"
                        value={formData.deskCard?.desc || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deskCard: { ...(formData.deskCard || {}), desc: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="asm-row-3">
                      <div className="asm-field">
                        <label className="asm-label">Direct Phone</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.deskCard?.phone || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              deskCard: { ...(formData.deskCard || {}), phone: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="asm-field">
                        <label className="asm-label">Engineering Email</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.deskCard?.email || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              deskCard: { ...(formData.deskCard || {}), email: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="asm-field">
                        <label className="asm-label">WhatsApp Link</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.deskCard?.whatsapp || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              deskCard: { ...(formData.deskCard || {}), whatsapp: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="asm-card-footer">
                  <span className="asm-hint">Paragraphs are formatted automatically on the service detail page.</span>
                  <button type="submit" className="asm-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Overview & Desk'}
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: ARCHITECTURE SHOWCASE (PINNED SCROLL SCRUB) */}
            {activeSubTab === 'showcase' && (
              <div className="asm-card">
                <div className="asm-card-header">
                  <div className="asm-card-title-group">
                    <div className="asm-card-icon">
                      <Cpu size={20} />
                    </div>
                    <div>
                      <h2 className="asm-card-title">Interactive Architecture Showcase (Scroll Scrub)</h2>
                      <p className="asm-card-desc">
                        Full-screen 100vh pinned stage with rotating cards and uploaded architecture imagery.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="asm-card-body">
                  <div className="asm-row-2">
                    <div className="asm-field">
                      <label className="asm-label">Showcase Badge</label>
                      <input
                        type="text"
                        className="asm-input"
                        value={formData.architectureShowcase?.badge || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            architectureShowcase: {
                              ...(formData.architectureShowcase || {}),
                              badge: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="asm-field">
                      <label className="asm-label">Showcase Headline</label>
                      <input
                        type="text"
                        className="asm-input"
                        value={formData.architectureShowcase?.title || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            architectureShowcase: {
                              ...(formData.architectureShowcase || {}),
                              title: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="asm-field">
                    <label className="asm-label">Showcase Tagline</label>
                    <input
                      type="text"
                      className="asm-input"
                      value={formData.architectureShowcase?.tagline || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          architectureShowcase: {
                            ...(formData.architectureShowcase || {}),
                            tagline: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="asm-subcard">
                    <div className="asm-subcard-header">
                      <div className="asm-subcard-title">
                        <Cpu size={18} color="#16a1ce" />
                        <span>Showcase Cards & Imagery</span>
                      </div>
                      <button
                        type="button"
                        className="asm-item-badge"
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={handleAddShowcaseItem}
                      >
                        + Add Card
                      </button>
                    </div>

                    <div className="asm-items-list">
                      {(formData.architectureShowcase?.items || []).map((card, idx) => (
                        <div key={idx} className="asm-item-card">
                          <div className="asm-item-card-top">
                            <span className="asm-item-badge">Card #{idx + 1} ({card.num})</span>
                            <button
                              type="button"
                              className="asm-item-btn-del"
                              onClick={() => handleRemoveShowcaseItem(idx)}
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="asm-row-3">
                            <div className="asm-field">
                              <label className="asm-label">Card Number</label>
                              <input
                                type="text"
                                className="asm-input"
                                value={card.num}
                                onChange={(e) => handleShowcaseItemChange(idx, 'num', e.target.value)}
                              />
                            </div>
                            <div className="asm-field">
                              <label className="asm-label">Track Tag</label>
                              <input
                                type="text"
                                className="asm-input"
                                value={card.tag}
                                onChange={(e) => handleShowcaseItemChange(idx, 'tag', e.target.value)}
                              />
                            </div>
                            <div className="asm-field">
                              <label className="asm-label">HUD Badge</label>
                              <input
                                type="text"
                                className="asm-input"
                                value={card.hudBadge}
                                onChange={(e) => handleShowcaseItemChange(idx, 'hudBadge', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="asm-row-2">
                            <div className="asm-field">
                              <label className="asm-label">Card Title</label>
                              <input
                                type="text"
                                className="asm-input"
                                value={card.title}
                                onChange={(e) => handleShowcaseItemChange(idx, 'title', e.target.value)}
                              />
                            </div>
                            <div className="asm-field">
                              <label className="asm-label">Metric Spec</label>
                              <input
                                type="text"
                                className="asm-input"
                                value={card.metric}
                                onChange={(e) => handleShowcaseItemChange(idx, 'metric', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="asm-field">
                            <label className="asm-label">Card Description</label>
                            <textarea
                              className="asm-textarea"
                              value={card.desc}
                              onChange={(e) => handleShowcaseItemChange(idx, 'desc', e.target.value)}
                            />
                          </div>

                          {/* Image Upload for this card */}
                          <div className="asm-field">
                            <label className="asm-label">Card Showcase Image</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <input
                                type="text"
                                className="asm-input"
                                placeholder="https://... or upload below"
                                value={card.image || ''}
                                onChange={(e) => handleShowcaseItemChange(idx, 'image', e.target.value)}
                              />
                              <button
                                type="button"
                                className="asm-btn-secondary"
                                onClick={() => triggerUpload('showcaseItem', idx)}
                              >
                                <UploadCloud size={15} />
                                <span>Upload</span>
                              </button>
                            </div>

                            {card.image && (
                              <div className="asm-preview-box" style={{ marginTop: 8 }}>
                                <div className="asm-preview-img-wrap" style={{ width: 100, height: 70 }}>
                                  <img src={card.image} alt={card.title} className="asm-preview-img" />
                                </div>
                                <span className="asm-preview-path">{card.image}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="asm-card-footer">
                  <span className="asm-hint">Images render in the large left pinned showcase frame.</span>
                  <button type="submit" className="asm-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Architecture Showcase'}
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: DELIVERABLES MODULES (PINNED IMAGE SWAP) */}
            {activeSubTab === 'deliverables' && (
              <div className="asm-card">
                <div className="asm-card-header">
                  <div className="asm-card-title-group">
                    <div className="asm-card-icon">
                      <Code2 size={20} />
                    </div>
                    <div>
                      <h2 className="asm-card-title">Core Architecture Key Deliverables (Image Swap)</h2>
                      <p className="asm-card-desc">
                        Sticky crossfade image modules with "What We Architect & Ship" bullet points.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="asm-card-body">
                  <div className="asm-row-3">
                    <div className="asm-field">
                      <label className="asm-label">Section Eyebrow</label>
                      <input
                        type="text"
                        className="asm-input"
                        value={formData.keyDeliverables?.eyebrow || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            keyDeliverables: {
                              ...(formData.keyDeliverables || {}),
                              eyebrow: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="asm-field">
                      <label className="asm-label">Section Title</label>
                      <input
                        type="text"
                        className="asm-input"
                        value={formData.keyDeliverables?.title || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            keyDeliverables: {
                              ...(formData.keyDeliverables || {}),
                              title: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="asm-field">
                      <label className="asm-label">Section Subtitle</label>
                      <input
                        type="text"
                        className="asm-input"
                        value={formData.keyDeliverables?.subtitle || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            keyDeliverables: {
                              ...(formData.keyDeliverables || {}),
                              subtitle: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="asm-subcard">
                    <div className="asm-subcard-header">
                      <div className="asm-subcard-title">
                        <Code2 size={18} color="#16a1ce" />
                        <span>Deliverable Modules (with Image Upload & Bullets)</span>
                      </div>
                      <button
                        type="button"
                        className="asm-item-badge"
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={handleAddDeliverableModule}
                      >
                        + Add Module
                      </button>
                    </div>

                    <div className="asm-items-list">
                      {(formData.keyDeliverables?.items || []).map((mod, idx) => (
                        <div key={idx} className="asm-item-card">
                          <div className="asm-item-card-top">
                            <span className="asm-item-badge">Module #{idx + 1}: {mod.title || 'Untitled'}</span>
                            <button
                              type="button"
                              className="asm-item-btn-del"
                              onClick={() => handleRemoveDeliverableModule(idx)}
                            >
                              <Trash2 size={12} />
                              <span>Remove Module</span>
                            </button>
                          </div>

                          <div className="asm-row-2">
                            <div className="asm-field">
                              <label className="asm-label">Module Title</label>
                              <input
                                type="text"
                                className="asm-input"
                                value={mod.title}
                                onChange={(e) => handleDeliverableModuleChange(idx, 'title', e.target.value)}
                              />
                            </div>
                            <div className="asm-field">
                              <label className="asm-label">HUD Tag</label>
                              <input
                                type="text"
                                className="asm-input"
                                value={mod.hudTag}
                                onChange={(e) => handleDeliverableModuleChange(idx, 'hudTag', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="asm-row-2">
                            <div className="asm-field">
                              <label className="asm-label">Metric Spec</label>
                              <input
                                type="text"
                                className="asm-input"
                                value={mod.metric}
                                onChange={(e) => handleDeliverableModuleChange(idx, 'metric', e.target.value)}
                              />
                            </div>
                            <div className="asm-field">
                              <label className="asm-label">Icon</label>
                              <select
                                className="asm-input"
                                value={mod.icon}
                                onChange={(e) => handleDeliverableModuleChange(idx, 'icon', e.target.value)}
                              >
                                <option value="Layout">Layout</option>
                                <option value="Zap">Zap</option>
                                <option value="Layers">Layers</option>
                                <option value="Search">Search</option>
                                <option value="ShieldCheck">ShieldCheck</option>
                                <option value="Code2">Code2</option>
                                <option value="ShoppingCart">ShoppingCart</option>
                                <option value="CreditCard">CreditCard</option>
                                <option value="Smartphone">Smartphone</option>
                                <option value="Cpu">Cpu</option>
                                <option value="BarChart3">BarChart3</option>
                                <option value="Database">Database</option>
                                <option value="Palette">Palette</option>
                                <option value="Bot">Bot</option>
                              </select>
                            </div>
                          </div>

                          <div className="asm-field">
                            <label className="asm-label">Description</label>
                            <textarea
                              className="asm-textarea"
                              value={mod.desc}
                              onChange={(e) => handleDeliverableModuleChange(idx, 'desc', e.target.value)}
                            />
                          </div>

                          {/* Module Image Upload */}
                          <div className="asm-field">
                            <label className="asm-label">Module Visual Image</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <input
                                type="text"
                                className="asm-input"
                                placeholder="https://... or upload"
                                value={mod.image || ''}
                                onChange={(e) => handleDeliverableModuleChange(idx, 'image', e.target.value)}
                              />
                              <button
                                type="button"
                                className="asm-btn-secondary"
                                onClick={() => triggerUpload('deliverableItem', idx)}
                              >
                                <UploadCloud size={15} />
                                <span>Upload</span>
                              </button>
                            </div>
                            {mod.image && (
                              <div className="asm-preview-box" style={{ marginTop: 8 }}>
                                <div className="asm-preview-img-wrap" style={{ width: 100, height: 70 }}>
                                  <img src={mod.image} alt={mod.title} className="asm-preview-img" />
                                </div>
                                <span className="asm-preview-path">{mod.image}</span>
                              </div>
                            )}
                          </div>

                          {/* What We Architect & Ship Bullets */}
                          <div className="asm-field">
                            <div className="asm-subcard-header">
                              <label className="asm-label">What We Architect & Ship (Bullets)</label>
                              <button
                                type="button"
                                className="asm-item-badge"
                                style={{ cursor: 'pointer', border: 'none' }}
                                onClick={() => handleAddBulletToModule(idx)}
                              >
                                + Add Bullet
                              </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {(mod.deliverables || []).map((bullet, bIdx) => (
                                <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <input
                                    type="text"
                                    className="asm-input"
                                    value={bullet}
                                    onChange={(e) => handleBulletChangeInModule(idx, bIdx, e.target.value)}
                                    placeholder="Deliverable bullet point..."
                                  />
                                  <button
                                    type="button"
                                    className="asm-item-btn-del"
                                    onClick={() => handleRemoveBulletFromModule(idx, bIdx)}
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="asm-card-footer">
                  <span className="asm-hint">Changes save to MongoDB and reflect live on the website.</span>
                  <button type="submit" className="asm-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Deliverables'}
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB 5: TECH STACK & DELIVERY PROCESS */}
            {activeSubTab === 'techProcess' && (
              <div className="asm-card">
                <div className="asm-card-header">
                  <div className="asm-card-title-group">
                    <div className="asm-card-icon">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h2 className="asm-card-title">Technologies & 4-Step Agile Delivery</h2>
                      <p className="asm-card-desc">
                        Manage framework badges with custom color dots and 4-step delivery roadmaps.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="asm-card-body">
                  {/* Tech Stack Header & Items */}
                  <div className="asm-subcard">
                    <div className="asm-subcard-header">
                      <div className="asm-subcard-title">
                        <Code2 size={18} color="#16a1ce" />
                        <span>Technologies Header & Frameworks</span>
                      </div>
                      <button
                        type="button"
                        className="asm-item-badge"
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={handleAddTech}
                      >
                        + Add Tech
                      </button>
                    </div>

                    <div className="asm-row-3">
                      <div className="asm-field">
                        <label className="asm-label">Eyebrow</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.techStackHeader?.eyebrow || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              techStackHeader: {
                                ...(formData.techStackHeader || {}),
                                eyebrow: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="asm-field">
                        <label className="asm-label">Title</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.techStackHeader?.title || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              techStackHeader: {
                                ...(formData.techStackHeader || {}),
                                title: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="asm-field">
                        <label className="asm-label">Subtitle</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.techStackHeader?.subtitle || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              techStackHeader: {
                                ...(formData.techStackHeader || {}),
                                subtitle: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="asm-items-list">
                      {(formData.techStack || []).map((t, idx) => (
                        <div key={idx} className="asm-item-card">
                          <div className="asm-item-card-top">
                            <span className="asm-item-badge">Tech #{idx + 1}</span>
                            <button
                              type="button"
                              className="asm-item-btn-del"
                              onClick={() => handleRemoveTech(idx)}
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          </div>
                          <div className="asm-row-2">
                            <div className="asm-field">
                              <label className="asm-label">Technology Name</label>
                              <input
                                type="text"
                                className="asm-input"
                                placeholder="e.g. React, Next.js, Python"
                                value={t.name}
                                onChange={(e) => handleTechChange(idx, 'name', e.target.value)}
                              />
                            </div>
                            <div className="asm-field">
                              <label className="asm-label">Badge Color Accent</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <input
                                  type="color"
                                  value={t.color || '#1385ac'}
                                  onChange={(e) => handleTechChange(idx, 'color', e.target.value)}
                                  style={{ width: 44, height: 42, padding: 0, border: 'none', borderRadius: 6, cursor: 'pointer' }}
                                />
                                <input
                                  type="text"
                                  className="asm-input"
                                  value={t.color || '#1385ac'}
                                  onChange={(e) => handleTechChange(idx, 'color', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4-Step Process */}
                  <div className="asm-subcard">
                    <div className="asm-subcard-header">
                      <div className="asm-subcard-title">
                        <Zap size={18} color="#16a1ce" />
                        <span>Execution Roadmap Header & Process Steps</span>
                      </div>
                      <button
                        type="button"
                        className="asm-item-badge"
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={handleAddProcess}
                      >
                        + Add Step
                      </button>
                    </div>

                    <div className="asm-row-3">
                      <div className="asm-field">
                        <label className="asm-label">Eyebrow</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.processHeader?.eyebrow || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              processHeader: {
                                ...(formData.processHeader || {}),
                                eyebrow: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="asm-field">
                        <label className="asm-label">Title</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.processHeader?.title || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              processHeader: {
                                ...(formData.processHeader || {}),
                                title: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="asm-field">
                        <label className="asm-label">Subtitle</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.processHeader?.subtitle || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              processHeader: {
                                ...(formData.processHeader || {}),
                                subtitle: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="asm-items-list">
                      {(formData.process || []).map((step, idx) => (
                        <div key={idx} className="asm-item-card">
                          <div className="asm-item-card-top">
                            <span className="asm-item-badge">Step #{idx + 1}</span>
                            <button
                              type="button"
                              className="asm-item-btn-del"
                              onClick={() => handleRemoveProcess(idx)}
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          </div>
                          <div className="asm-row-2">
                            <div className="asm-field">
                              <label className="asm-label">Step Number</label>
                              <input
                                type="text"
                                className="asm-input"
                                value={step.step}
                                onChange={(e) => handleProcessChange(idx, 'step', e.target.value)}
                              />
                            </div>
                            <div className="asm-field">
                              <label className="asm-label">Step Title</label>
                              <input
                                type="text"
                                className="asm-input"
                                value={step.title}
                                onChange={(e) => handleProcessChange(idx, 'title', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="asm-field">
                            <label className="asm-label">Step Description</label>
                            <textarea
                              className="asm-textarea"
                              value={step.desc}
                              onChange={(e) => handleProcessChange(idx, 'desc', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="asm-card-footer">
                  <span className="asm-hint">Changes save to MongoDB and reflect live on the website.</span>
                  <button type="submit" className="asm-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Tech & Process'}
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB 6: ROI, GUARANTEES & FINAL CTA */}
            {activeSubTab === 'benefitsGuarantees' && (
              <div className="asm-card">
                <div className="asm-card-header">
                  <div className="asm-card-title-group">
                    <div className="asm-card-icon">
                      <BarChart3 size={20} />
                    </div>
                    <div>
                      <h2 className="asm-card-title">Measurable Outcomes, Guarantees & Final CTA</h2>
                      <p className="asm-card-desc">
                        Target commercial metrics, 100% NDA guarantees, and the closing conversion callout.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="asm-card-body">
                  {/* Benefits */}
                  <div className="asm-subcard">
                    <div className="asm-subcard-header">
                      <div className="asm-subcard-title">
                        <BarChart3 size={18} color="#16a1ce" />
                        <span>Target Metrics & Benefits</span>
                      </div>
                      <button
                        type="button"
                        className="asm-item-badge"
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={handleAddBenefit}
                      >
                        + Add Metric
                      </button>
                    </div>

                    <div className="asm-row-3">
                      <div className="asm-field">
                        <label className="asm-label">Eyebrow</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.benefitsHeader?.eyebrow || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              benefitsHeader: {
                                ...(formData.benefitsHeader || {}),
                                eyebrow: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="asm-field">
                        <label className="asm-label">Title</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.benefitsHeader?.title || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              benefitsHeader: {
                                ...(formData.benefitsHeader || {}),
                                title: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="asm-field">
                        <label className="asm-label">Subtitle</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.benefitsHeader?.subtitle || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              benefitsHeader: {
                                ...(formData.benefitsHeader || {}),
                                subtitle: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="asm-items-list">
                      {(formData.benefits || []).map((b, idx) => (
                        <div key={idx} className="asm-item-card">
                          <div className="asm-item-card-top">
                            <span className="asm-item-badge">Metric #{idx + 1}</span>
                            <button
                              type="button"
                              className="asm-item-btn-del"
                              onClick={() => handleRemoveBenefit(idx)}
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          </div>
                          <div className="asm-row-2">
                            <div className="asm-field">
                              <label className="asm-label">Target Value / Stat</label>
                              <input
                                type="text"
                                className="asm-input"
                                placeholder="e.g. <1.2s, 100%, 3.8x"
                                value={b.value}
                                onChange={(e) => handleBenefitChange(idx, 'value', e.target.value)}
                              />
                            </div>
                            <div className="asm-field">
                              <label className="asm-label">Metric Label</label>
                              <input
                                type="text"
                                className="asm-input"
                                placeholder="e.g. Average Page Load"
                                value={b.label}
                                onChange={(e) => handleBenefitChange(idx, 'label', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="asm-field">
                            <label className="asm-label">Supporting Impact Description</label>
                            <input
                              type="text"
                              className="asm-input"
                              placeholder="e.g. Lightning-fast delivery keeping bounce rates near zero."
                              value={b.desc}
                              onChange={(e) => handleBenefitChange(idx, 'desc', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Guarantees */}
                  <div className="asm-subcard">
                    <div className="asm-subcard-title">
                      <ShieldCheck size={18} color="#16a1ce" />
                      <span>Service Guarantees & Trust Badges</span>
                    </div>

                    <div className="asm-items-list">
                      {(formData.guarantees || []).map((g, idx) => (
                        <div key={idx} className="asm-item-card">
                          <div className="asm-row-2">
                            <div className="asm-field">
                              <label className="asm-label">Guarantee Title</label>
                              <input
                                type="text"
                                className="asm-input"
                                value={g.title}
                                onChange={(e) => {
                                  const updated = [...(formData.guarantees || [])];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  setFormData({ ...formData, guarantees: updated });
                                }}
                              />
                            </div>
                            <div className="asm-field">
                              <label className="asm-label">Icon</label>
                              <select
                                className="asm-input"
                                value={g.icon}
                                onChange={(e) => {
                                  const updated = [...(formData.guarantees || [])];
                                  updated[idx] = { ...updated[idx], icon: e.target.value };
                                  setFormData({ ...formData, guarantees: updated });
                                }}
                              >
                                <option value="ShieldCheck">ShieldCheck (NDA Protection)</option>
                                <option value="Clock">Clock (Rapid Turnaround)</option>
                                <option value="Lock">Lock (OWASP Security)</option>
                                <option value="Award">Award (Dedicated SLA)</option>
                              </select>
                            </div>
                          </div>

                          <div className="asm-field">
                            <label className="asm-label">Guarantee Description</label>
                            <textarea
                              className="asm-textarea"
                              value={g.desc}
                              onChange={(e) => {
                                const updated = [...(formData.guarantees || [])];
                                updated[idx] = { ...updated[idx], desc: e.target.value };
                                setFormData({ ...formData, guarantees: updated });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final CTA Banner */}
                  <div className="asm-subcard">
                    <div className="asm-subcard-title">
                      <Sparkles size={18} color="#16a1ce" />
                      <span>Bottom Consultation Banner</span>
                    </div>

                    <div className="asm-row-2">
                      <div className="asm-field">
                        <label className="asm-label">CTA Title</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.finalCta?.title || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              finalCta: { ...(formData.finalCta || {}), title: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="asm-field">
                        <label className="asm-label">CTA Button Label</label>
                        <input
                          type="text"
                          className="asm-input"
                          value={formData.finalCta?.buttonText || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              finalCta: { ...(formData.finalCta || {}), buttonText: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="asm-field">
                      <label className="asm-label">CTA Description</label>
                      <textarea
                        className="asm-textarea"
                        value={formData.finalCta?.desc || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            finalCta: { ...(formData.finalCta || {}), desc: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="asm-card-footer">
                  <span className="asm-hint">Changes save to MongoDB and reflect live on the website.</span>
                  <button type="submit" className="asm-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save ROI & Guarantees'}
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB 7: MAIN IMAGES & MEDIA UPLOAD */}
            {activeSubTab === 'media' && (
              <div className="asm-card">
                <div className="asm-card-header">
                  <div className="asm-card-title-group">
                    <div className="asm-card-icon">
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <h2 className="asm-card-title">Main Service Images & Media Upload</h2>
                      <p className="asm-card-desc">
                        Upload custom high-resolution graphics for Hero media, Showcase presentation, and 3D Carousel.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="asm-card-body">
                  {/* Hero / Main Image */}
                  <div className="asm-subcard">
                    <div className="asm-subcard-title">
                      <ImageIcon size={18} color="#16a1ce" />
                      <span>1. Hero / Main Service Header Image</span>
                    </div>

                    <div
                      className="asm-upload-zone"
                      onClick={() => triggerUpload('heroImage')}
                    >
                      <div className="asm-upload-icon-box">
                        {uploadingTarget === 'heroImage-main' ? (
                          <div className="asm-spinner"></div>
                        ) : (
                          <UploadCloud size={22} />
                        )}
                      </div>
                      <div className="asm-upload-prompt">
                        {uploadingTarget === 'heroImage-main'
                          ? 'Uploading Hero Image...'
                          : 'Click to upload Service Hero Image'}
                      </div>
                      <div className="asm-hint">Recommended: 1400x800px WebP, JPG, or PNG.</div>
                    </div>

                    {formData.heroImage && (
                      <div className="asm-preview-box">
                        <div className="asm-preview-img-wrap">
                          <img
                            src={formData.heroImage}
                            alt={formData.title}
                            className="asm-preview-img"
                          />
                        </div>
                        <div className="asm-preview-meta">
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Active Hero Image</span>
                          <span className="asm-preview-path">{formData.heroImage}</span>
                          <button
                            type="button"
                            className="asm-btn-del-img"
                            onClick={() => setFormData({ ...formData, heroImage: '' })}
                          >
                            <Trash2 size={12} />
                            <span>Clear Image</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="asm-field">
                      <label className="asm-label">Direct URL Link (or CDN)</label>
                      <input
                        type="text"
                        className="asm-input"
                        placeholder="https://... or /uploads/services/..."
                        value={formData.heroImage}
                        onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Showcase Presentation Image */}
                  <div className="asm-subcard">
                    <div className="asm-subcard-title">
                      <ImageIcon size={18} color="#16a1ce" />
                      <span>2. Service Tab Showcase Image (Used on Services We Provide Page)</span>
                    </div>

                    <div
                      className="asm-upload-zone"
                      onClick={() => triggerUpload('image')}
                    >
                      <div className="asm-upload-icon-box">
                        {uploadingTarget === 'image-main' ? (
                          <div className="asm-spinner"></div>
                        ) : (
                          <UploadCloud size={22} />
                        )}
                      </div>
                      <div className="asm-upload-prompt">
                        {uploadingTarget === 'image-main'
                          ? 'Uploading Showcase Image...'
                          : 'Click to upload Tab Showcase Image'}
                      </div>
                      <div className="asm-hint">Recommended: 1000x800px WebP, JPG, or PNG.</div>
                    </div>

                    {formData.image && (
                      <div className="asm-preview-box">
                        <div className="asm-preview-img-wrap">
                          <img
                            src={formData.image}
                            alt={formData.title}
                            className="asm-preview-img"
                          />
                        </div>
                        <div className="asm-preview-meta">
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Active Tab Showcase Image</span>
                          <span className="asm-preview-path">{formData.image}</span>
                          <button
                            type="button"
                            className="asm-btn-del-img"
                            onClick={() => setFormData({ ...formData, image: '' })}
                          >
                            <Trash2 size={12} />
                            <span>Clear Image</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="asm-field">
                      <label className="asm-label">Direct URL Link (or CDN)</label>
                      <input
                        type="text"
                        className="asm-input"
                        placeholder="https://... or /uploads/services/..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Gallery Image */}
                  <div className="asm-subcard">
                    <div className="asm-subcard-title">
                      <ImageIcon size={18} color="#16a1ce" />
                      <span>3. Circular 3D Gallery Card Image</span>
                    </div>

                    <div
                      className="asm-upload-zone"
                      onClick={() => triggerUpload('galleryImage')}
                    >
                      <div className="asm-upload-icon-box">
                        {uploadingTarget === 'galleryImage-main' ? (
                          <div className="asm-spinner"></div>
                        ) : (
                          <UploadCloud size={22} />
                        )}
                      </div>
                      <div className="asm-upload-prompt">
                        {uploadingTarget === 'galleryImage-main'
                          ? 'Uploading Gallery Image...'
                          : 'Click to upload Circular Gallery Image'}
                      </div>
                      <div className="asm-hint">Recommended: 800x1000px Vertical / Aspect 4:5.</div>
                    </div>

                    {formData.galleryImage && (
                      <div className="asm-preview-box">
                        <div className="asm-preview-img-wrap">
                          <img
                            src={formData.galleryImage}
                            alt={formData.title}
                            className="asm-preview-img"
                          />
                        </div>
                        <div className="asm-preview-meta">
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Active Gallery Image</span>
                          <span className="asm-preview-path">{formData.galleryImage}</span>
                          <button
                            type="button"
                            className="asm-btn-del-img"
                            onClick={() => setFormData({ ...formData, galleryImage: '' })}
                          >
                            <Trash2 size={12} />
                            <span>Clear Image</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="asm-field">
                      <label className="asm-label">Direct URL Link (or CDN)</label>
                      <input
                        type="text"
                        className="asm-input"
                        placeholder="https://... or /uploads/services/..."
                        value={formData.galleryImage}
                        onChange={(e) => setFormData({ ...formData, galleryImage: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="asm-card-footer">
                  <span className="asm-hint">Uploaded images are served from /uploads/services/ and rendered in the layout.</span>
                  <button type="submit" className="asm-btn-primary" disabled={saving}>
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

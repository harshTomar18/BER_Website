import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  Layers,
  Award,
  ArrowRight,
  RefreshCw,
  Clock,
  Mail,
  Phone,
  Eye,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Activity,
  Plus,
  ExternalLink,
  MessageSquare,
  X,
  Copy,
  Check,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { contactApi } from '../../api';
import '../styles/AdminDashboard.css';

/**
 * AdminDashboard - Executive Overview
 * Displays high-level count cards across all systems followed by recent inquiries
 */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    inquiries: { total: 0, new: 0, contact: 0, consultation: 0 },
    content: { blogs: 0, services: 0, clients: 0, testimonials: 0, tech: 0 },
    recentInquiries: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  // Quick detail modal from dashboard
  const [activeLead, setActiveLead] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await contactApi.getDashboardStats();
      if (res?.success && res?.data) {
        setStats(res.data);
        setLastSyncTime(new Date());
      } else {
        throw new Error(res?.message || 'Failed to fetch dashboard metrics.');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Failed to load executive statistics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="adb-badge adb-badge--new">New</span>;
      case 'contacted':
        return <span className="adb-badge adb-badge--contacted">Contacted</span>;
      case 'in_progress':
        return <span className="adb-badge adb-badge--progress">In Progress</span>;
      case 'closed':
        return <span className="adb-badge adb-badge--closed">Closed</span>;
      default:
        return <span className="adb-badge adb-badge--new">New</span>;
    }
  };

  const getTypeBadge = (type) => {
    if (type === 'consultation') {
      return (
        <span className="adb-badge adb-badge--consultation">
          Consultancy Form
        </span>
      );
    }
    return (
      <span className="adb-badge adb-badge--contact">
        Contact Page
      </span>
    );
  };

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <AdminLayout activeTab="overview" leadsCount={stats.inquiries?.new || 0}>
      <div className="adb-container">
        {/* Top Header */}
        <div className="adb-top-header">
          <div>
            <div className="adb-title-row">
              <h1 className="adb-title">Executive Command Center</h1>
              <span className="adb-env-badge">Live System Online</span>
            </div>
            <p className="adb-subtitle">
              Unified operational overview of prospective inquiries, content systems, and dynamic enterprise modules.
            </p>
          </div>

          <div className="adb-header-actions">
            <span className="adb-last-sync">
              Synced: {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <button
              className={`adb-btn-sync ${refreshing ? 'is-spinning' : ''}`}
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              title="Refresh statistics"
            >
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
            <Link to="/admin/inquiries" className="adb-btn-export">
              <Users size={15} />
              <span>Open Inquiries ({stats.inquiries?.total || 0})</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="adb-alert adb-alert--error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* =====================================================
            1. KPI COUNT CARDS (Total Inquiries, Blogs, Services, Showcase)
            ===================================================== */}
        <div className="adb-kpi-grid">
          {/* Card 1: Inquiries */}
          <div
            className="adb-kpi-card cursor-pointer"
            onClick={() => navigate('/admin/inquiries')}
            title="Click to view all client inquiries"
          >
            <div className="adb-kpi-card__header">
              <span className="adb-kpi-card__title">Client Inquiries</span>
              <div className="adb-kpi-card__icon adb-kpi-card__icon--cyan">
                <Users size={18} />
              </div>
            </div>
            <div className="adb-kpi-card__value">
              {loading ? '...' : stats.inquiries?.total || 0}
            </div>
            <div className="adb-kpi-card__footer">
              <span className="adb-badge adb-badge--new" style={{ marginRight: '6px' }}>
                {stats.inquiries?.new || 0} New
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {stats.inquiries?.consultation || 0} Consult • {stats.inquiries?.contact || 0} Contact
              </span>
            </div>
          </div>

          {/* Card 2: Blogs */}
          <div
            className="adb-kpi-card cursor-pointer"
            onClick={() => navigate('/admin/blogs')}
            title="Click to manage blogs and articles"
          >
            <div className="adb-kpi-card__header">
              <span className="adb-kpi-card__title">Published Articles</span>
              <div className="adb-kpi-card__icon adb-kpi-card__icon--blue">
                <FileText size={18} />
              </div>
            </div>
            <div className="adb-kpi-card__value">
              {loading ? '...' : stats.content?.blogs || 0}
            </div>
            <div className="adb-kpi-card__footer">
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Live Knowledge Base Articles
              </span>
            </div>
          </div>

          {/* Card 3: Services */}
          <div
            className="adb-kpi-card cursor-pointer"
            onClick={() => navigate('/admin/services')}
            title="Click to manage services and deliverables"
          >
            <div className="adb-kpi-card__header">
              <span className="adb-kpi-card__title">Active Services</span>
              <div className="adb-kpi-card__icon adb-kpi-card__icon--purple">
                <Layers size={18} />
              </div>
            </div>
            <div className="adb-kpi-card__value">
              {loading ? '...' : stats.content?.services || 0}
            </div>
            <div className="adb-kpi-card__footer">
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Enterprise Modules & Systems
              </span>
            </div>
          </div>

          {/* Card 4: Showcase & Social Proof */}
          <div
            className="adb-kpi-card cursor-pointer"
            onClick={() => navigate('/admin/showcase')}
            title="Click to manage client logos and testimonials"
          >
            <div className="adb-kpi-card__header">
              <span className="adb-kpi-card__title">Clients & Showcase</span>
              <div className="adb-kpi-card__icon adb-kpi-card__icon--emerald">
                <Award size={18} />
              </div>
            </div>
            <div className="adb-kpi-card__value">
              {loading ? '...' : stats.content?.clients || 0}
            </div>
            <div className="adb-kpi-card__footer">
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {stats.content?.testimonials || 0} Testimonials • {stats.content?.tech || 0} Tech items
              </span>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts Bar */}
        <div className="adb-quick-actions-bar">
          <span className="adb-quick-actions-title">
            Quick Actions:
          </span>
          <Link
            to="/admin/inquiries"
            className="adb-quick-action-pill"
          >
            <Users size={14} />
            <span>Manage All Inquiries ({stats.inquiries?.total || 0})</span>
          </Link>
          <Link
            to="/admin/blogs/new"
            className="adb-quick-action-pill"
          >
            <Plus size={14} />
            <span>Write New Article</span>
          </Link>
          <Link
            to="/admin/services"
            className="adb-quick-action-pill"
          >
            <Layers size={14} />
            <span>Configure Services</span>
          </Link>
          <Link
            to="/admin/showcase"
            className="adb-quick-action-pill"
          >
            <Award size={14} />
            <span>Update Client Logos</span>
          </Link>
        </div>

        {/* =====================================================
            2. RECENT INQUIRIES SECTION
            ===================================================== */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(32, 40, 91, 0.04)',
          }}
        >
          <div
            style={{
              padding: '18px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#20285b', margin: 0 }}>
                Recent Inquiries & Scoping Leads
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Latest prospective clients who contacted BER Services via the website.
              </p>
            </div>

            <Link
              to="/admin/inquiries"
              style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#16a1ce',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
              }}
            >
              <span>View All Inquiries ({stats.inquiries?.total || 0})</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px' }} />
              <p>Loading recent inquiries...</p>
            </div>
          ) : !stats.recentInquiries || stats.recentInquiries.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <Users size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
              <p style={{ margin: 0 }}>No client inquiries recorded yet.</p>
            </div>
          ) : (
            <div className="adb-table-container" style={{ margin: 0, border: 'none', borderRadius: 0 }}>
              <table className="adb-table">
                <thead>
                  <tr>
                    <th>Client / Organization</th>
                    <th>Source Form</th>
                    <th>Contact Info</th>
                    <th>Service Requested</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentInquiries.map((lead) => (
                    <tr
                      key={lead._id}
                      onClick={() => setActiveLead(lead)}
                      className="cursor-pointer"
                    >
                      <td>
                        <div className="adb-client-cell">
                          <strong>{lead.name}</strong>
                          {lead.company && <small>{lead.company}</small>}
                        </div>
                      </td>
                      <td>{getTypeBadge(lead.type)}</td>
                      <td>
                        <div className="adb-contact-cell">
                          <span>{lead.email}</span>
                          <small>{lead.phone}</small>
                        </div>
                      </td>
                      <td>
                        <span className="adb-service-tag">{lead.service || 'General'}</span>
                      </td>
                      <td>{getStatusBadge(lead.status)}</td>
                      <td>
                        <small className="adb-date-cell">{formatDate(lead.createdAt)}</small>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="adb-action-btn"
                          title="View Details"
                          onClick={() => setActiveLead(lead)}
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Detail Modal */}
        {activeLead && (
          <div className="adb-modal-overlay" onClick={() => setActiveLead(null)}>
            <div className="adb-modal" onClick={(e) => e.stopPropagation()}>
              <div className="adb-modal__header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h2 className="adb-modal__title">{activeLead.name}</h2>
                    {getTypeBadge(activeLead.type)}
                  </div>
                  {activeLead.company && (
                    <p className="adb-modal__company">{activeLead.company}</p>
                  )}
                </div>
                <button
                  className="adb-modal__close"
                  onClick={() => setActiveLead(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="adb-modal__body">
                {/* Contact Fields */}
                <div className="adb-modal-grid">
                  <div className="adb-modal-field">
                    <span className="adb-modal-field__label">Email Address</span>
                    <div className="adb-copyable-val">
                      <a href={`mailto:${activeLead.email}`} className="adb-link">
                        <Mail size={14} />
                        <span>{activeLead.email}</span>
                      </a>
                      <button
                        className="adb-copy-btn"
                        onClick={() => copyToClipboard(activeLead.email, 'email')}
                        title="Copy email"
                      >
                        {copiedField === 'email' ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="adb-modal-field">
                    <span className="adb-modal-field__label">Phone Number</span>
                    <div className="adb-copyable-val">
                      <a href={`tel:${activeLead.phone}`} className="adb-link">
                        <Phone size={14} />
                        <span>{activeLead.phone}</span>
                      </a>
                      <button
                        className="adb-copy-btn"
                        onClick={() => copyToClipboard(activeLead.phone, 'phone')}
                        title="Copy phone"
                      >
                        {copiedField === 'phone' ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="adb-modal-field">
                    <span className="adb-modal-field__label">Service / Domain</span>
                    <p className="adb-modal-val">{activeLead.service || 'General Inquiry'}</p>
                  </div>

                  <div className="adb-modal-field">
                    <span className="adb-modal-field__label">Submitted Date</span>
                    <p className="adb-modal-val">{formatDate(activeLead.createdAt)}</p>
                  </div>
                </div>

                {/* Project Message */}
                <div className="adb-modal-field adb-modal-field--full">
                  <span className="adb-modal-field__label">Project Brief / Message</span>
                  <div className="adb-modal-message-box">
                    {activeLead.message ? (
                      <p>{activeLead.message}</p>
                    ) : (
                      <p className="text-gray-400 italic">No additional message provided.</p>
                    )}
                  </div>
                </div>

                {/* Direct Action Channels */}
                <div className="adb-modal-channels">
                  <a
                    href={`https://wa.me/${(activeLead.phone || '').replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="adb-channel-btn adb-channel-btn--whatsapp"
                  >
                    <MessageSquare size={16} />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${activeLead.email}`}
                    className="adb-channel-btn adb-channel-btn--email"
                  >
                    <Mail size={16} />
                    <span>Send Email</span>
                  </a>
                  <a
                    href={`tel:${activeLead.phone}`}
                    className="adb-channel-btn adb-channel-btn--phone"
                  >
                    <Phone size={16} />
                    <span>Direct Call</span>
                  </a>
                </div>
              </div>

              <div className="adb-modal__footer">
                <Link
                  to="/admin/inquiries"
                  className="adb-btn-export"
                  style={{ textDecoration: 'none' }}
                >
                  Manage Inquiries Page →
                </Link>
                <button
                  className="adb-btn-close-modal"
                  onClick={() => setActiveLead(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

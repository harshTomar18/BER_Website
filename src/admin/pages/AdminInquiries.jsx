import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  Sparkles,
  Inbox,
  AlertCircle,
  CheckCircle,
  Download,
  Filter,
  Eye,
  X,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Activity,
  Table as TableIcon,
  LayoutGrid,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { contactApi } from '../../api';
import '../styles/AdminDashboard.css';

/**
 * AdminInquiries - Dedicated Client Inquiries & Scoping Leads Manager
 * Manages both Contact Form inquiries and Consultancy Modal requests
 */
export default function AdminInquiries() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  // Detail Modal & Actions
  const [activeLead, setActiveLead] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  const showNotice = (msg, isErr = false) => {
    setActionNotice({ msg, isErr });
    setTimeout(() => setActionNotice(null), 3500);
  };

  const fetchLeads = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await contactApi.getLeads(1, 100, {
        type: typeFilter,
        status: statusFilter,
        search,
      });

      if (res?.success && res?.data?.leads) {
        setLeads(res.data.leads);
        setTotal(res.data.total || res.data.leads.length);
        setLastSyncTime(new Date());
      } else {
        throw new Error(res?.message || 'Failed to fetch inquiries.');
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.message || 'Failed to retrieve client inquiries.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [typeFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleStatusChange = async (id, newStatus, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await contactApi.updateStatus(id, newStatus);
      if (res?.success) {
        setLeads((prev) =>
          prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l))
        );
        if (activeLead && activeLead._id === id) {
          setActiveLead((prev) => ({ ...prev, status: newStatus }));
        }
        showNotice(`Inquiry status updated to "${newStatus.replace('_', ' ')}".`);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      showNotice(err.message || 'Failed to update status.', true);
    }
  };

  const handleDelete = async (id, clientName, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Delete inquiry from "${clientName || 'this client'}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await contactApi.deleteLead(id);
      if (res?.success) {
        setLeads((prev) => prev.filter((l) => l._id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
        if (activeLead && activeLead._id === id) {
          setActiveLead(null);
        }
        showNotice('Inquiry removed successfully.');
      }
    } catch (err) {
      console.error('Delete inquiry error:', err);
      showNotice(err.message || 'Failed to delete inquiry.', true);
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      alert('No inquiries available to export.');
      return;
    }

    const headers = ['Date', 'Type', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Status', 'Message'];
    const rows = leads.map((l) => [
      new Date(l.createdAt).toLocaleString(),
      l.type === 'consultation' ? 'Consultation Request' : 'Contact Form',
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.service || '').replace(/"/g, '""')}"`,
      l.status || 'new',
      `"${(l.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BER_Client_Inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="adb-badge adb-badge--new">New Unread</span>;
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

  return (
    <AdminLayout activeTab="leads" leadsCount={total}>
      <div className="adb-container">
        {/* Top Header */}
        <div className="adb-top-header">
          <div>
            <div className="adb-title-row">
              <h1 className="adb-title">Client Inquiries & Scoping Leads</h1>
              <span className="adb-env-badge">{total} Inquiries</span>
            </div>
            <p className="adb-subtitle">
              Unified inbox for prospective client requests from the Contact Page and Consultancy Modal.
            </p>
          </div>

          <div className="adb-header-actions">
            <span className="adb-last-sync">
              Synced: {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <button
              className={`adb-btn-sync ${refreshing ? 'is-spinning' : ''}`}
              onClick={() => fetchLeads(true)}
              disabled={refreshing}
              title="Refresh inquiries"
            >
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
            <button
              className="adb-btn-export"
              onClick={exportToCSV}
              disabled={leads.length === 0}
              title="Export to CSV"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Action Notice */}
        {actionNotice && (
          <div className={`adb-alert ${actionNotice.isErr ? 'adb-alert--error' : 'adb-alert--success'}`}>
            {actionNotice.isErr ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span>{actionNotice.msg}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="adb-filter-bar">
          <form className="adb-search-wrap" onSubmit={handleSearchSubmit}>
            <Search size={16} className="adb-search-icon" />
            <input
              type="text"
              placeholder="Search by client name, email, phone, company, message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="adb-search-input"
            />
            {search && (
              <button
                type="button"
                className="adb-search-clear"
                onClick={() => {
                  setSearch('');
                  fetchLeads();
                }}
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Type Filter */}
          <div className="adb-filter-select-wrap">
            <Filter size={15} />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="adb-filter-select"
            >
              <option value="ALL">All Sources (Contact & Consultation)</option>
              <option value="contact">Contact Page Only</option>
              <option value="consultation">Consultancy Form Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="adb-filter-select-wrap">
            <Activity size={15} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="adb-filter-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="new">New Unread</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="adb-view-toggle">
            <button
              className={`adb-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <TableIcon size={16} />
            </button>
            <button
              className={`adb-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid Cards View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="adb-empty-state">
            <RefreshCw size={36} className="adb-empty-icon animate-spin" />
            <h3>Loading Inquiries...</h3>
            <p>Fetching prospective client submissions from MongoDB Atlas.</p>
          </div>
        ) : error ? (
          <div className="adb-empty-state">
            <AlertCircle size={36} className="adb-empty-icon text-red-500" />
            <h3>Failed to Load Inquiries</h3>
            <p>{error}</p>
            <button className="adb-btn-sync" onClick={() => fetchLeads(true)}>
              Retry
            </button>
          </div>
        ) : leads.length === 0 ? (
          <div className="adb-empty-state">
            <Inbox size={42} className="adb-empty-icon" />
            <h3>No Inquiries Found</h3>
            <p>
              {search || typeFilter !== 'ALL' || statusFilter !== 'ALL'
                ? 'No inquiries match your active filters. Try clearing your search.'
                : 'Submissions from the Contact Page or Consultation Modal will appear here.'}
            </p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="adb-table-container">
            <table className="adb-table">
              <thead>
                <tr>
                  <th>Client / Entity</th>
                  <th>Source</th>
                  <th>Contact Info</th>
                  <th>Service Requested</th>
                  <th>Status</th>
                  <th>Submitted Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
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
                        <span title={lead.email}>{lead.email}</span>
                        <small>{lead.phone}</small>
                      </div>
                    </td>
                    <td>
                      <span className="adb-service-tag">{lead.service || 'General'}</span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status || 'new'}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value, e)}
                        className="adb-status-select"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      <small className="adb-date-cell">{formatDate(lead.createdAt)}</small>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div className="adb-actions-cell">
                        <button
                          className="adb-action-btn"
                          title="View Details"
                          onClick={() => setActiveLead(lead)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="adb-action-btn adb-action-btn--delete"
                          title="Delete Lead"
                          onClick={(e) => handleDelete(lead._id, lead.name, e)}
                          disabled={deletingId === lead._id}
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
        ) : (
          /* Grid View */
          <div className="adb-grid-container">
            {leads.map((lead) => (
              <div
                key={lead._id}
                className="adb-lead-card cursor-pointer"
                onClick={() => setActiveLead(lead)}
              >
                <div className="adb-lead-card__header">
                  <div>
                    <h3 className="adb-lead-card__name">{lead.name}</h3>
                    {lead.company && <p className="adb-lead-card__company">{lead.company}</p>}
                  </div>
                  <div className="adb-lead-card__badges">
                    {getTypeBadge(lead.type)}
                    {getStatusBadge(lead.status)}
                  </div>
                </div>

                <div className="adb-lead-card__meta">
                  <div className="adb-meta-item">
                    <Mail size={14} />
                    <span>{lead.email}</span>
                  </div>
                  <div className="adb-meta-item">
                    <Phone size={14} />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="adb-meta-item">
                    <Layers size={14} />
                    <span>{lead.service || 'General Inquiry'}</span>
                  </div>
                  <div className="adb-meta-item">
                    <Clock size={14} />
                    <span>{formatDate(lead.createdAt)}</span>
                  </div>
                </div>

                {lead.message && (
                  <p className="adb-lead-card__snippet">
                    "{lead.message.length > 110 ? lead.message.slice(0, 110) + '…' : lead.message}"
                  </p>
                )}

                <div className="adb-lead-card__footer" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={lead.status || 'new'}
                    onChange={(e) => handleStatusChange(lead._id, e.target.value, e)}
                    className="adb-status-select"
                  >
                    <option value="new">Status: New</option>
                    <option value="contacted">Status: Contacted</option>
                    <option value="in_progress">Status: In Progress</option>
                    <option value="closed">Status: Closed</option>
                  </select>

                  <div className="adb-card-actions">
                    <button
                      className="adb-action-btn"
                      onClick={() => setActiveLead(lead)}
                      title="Inspect"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      className="adb-action-btn adb-action-btn--delete"
                      onClick={(e) => handleDelete(lead._id, lead.name, e)}
                      title="Delete"
                      disabled={deletingId === lead._id}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
                {/* Status Switcher Bar */}
                <div className="adb-modal-status-bar">
                  <span className="adb-modal-field__label">Lead Status:</span>
                  <div className="adb-status-pills">
                    {['new', 'contacted', 'in_progress', 'closed'].map((st) => (
                      <button
                        key={st}
                        className={`adb-status-pill-btn ${activeLead.status === st ? 'active' : ''}`}
                        onClick={(e) => handleStatusChange(activeLead._id, st, e)}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

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
                    <span className="adb-modal-field__label">Target Domain / Service</span>
                    <p className="adb-modal-val">{activeLead.service || 'General Inquiry'}</p>
                  </div>

                  <div className="adb-modal-field">
                    <span className="adb-modal-field__label">Submission Timestamp</span>
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
                    <span>Chat on WhatsApp</span>
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
                <button
                  className="adb-btn-delete-lead"
                  onClick={(e) => handleDelete(activeLead._id, activeLead.name, e)}
                  disabled={deletingId === activeLead._id}
                >
                  <Trash2 size={15} />
                  <span>Delete Inquiry</span>
                </button>
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

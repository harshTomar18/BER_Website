import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Building2,
  Layers,
  ChevronDown,
  MessageSquare,
  Send,
  ShieldCheck,
  CheckCircle2,
  Headphones,
} from 'lucide-react';
import { useConsult } from '../context/ConsultContext';
import { formServices } from '../config/siteConfig';
import { contactApi } from '../api';
import './ConsultModal.css';

const initialFormData = {
  name: '',
  phone: '',
  email: '',
  company: '',
  service: formServices[0] || 'Website Designing & Development',
  hasProject: 'No',
  message: '',
};

export default function ConsultModal() {
  const { open, closeModal } = useConsult();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closeModal]);

  // Prevent background body scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSent(false);
      setError(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleToggleProject = (val) => {
    setFormData((prev) => ({ ...prev, hasProject: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Format message to include the project status cleanly
    const finalMessage = formData.message.trim()
      ? `[Existing Project: ${formData.hasProject}] ${formData.message.trim()}`
      : `[Existing Project: ${formData.hasProject}] Consultation request submitted from website modal.`;

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        service: formData.service,
        message: finalMessage,
        type: 'consultation',
      };

      const res = await contactApi.submitInquiry(payload);
      if (res?.success) {
        setSent(true);
        setFormData(initialFormData);
      } else {
        throw new Error(res?.message || 'Failed to submit consultation request.');
      }
    } catch (err) {
      console.error('Consultation modal submission error:', err);
      const specificError = err.errors && err.errors[0]?.message;
      setError(specificError || err.message || 'Something went wrong. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cm-backdrop" onClick={closeModal} role="dialog" aria-modal="true">
      <div className="cm-dialog" onClick={(e) => e.stopPropagation()}>
        {/* TOP HEADER - Midnight Navy Gradient with Glowing Badge & Close */}
        <div className="cm-header">
          <div className="cm-header-decor" aria-hidden="true"></div>
          <div className="cm-header-left">
            <div className="cm-header-badge">
              <Headphones size={15} className="cm-header-icon" />
            </div>
            <div className="cm-header-text">
              <h3 className="cm-header-title">Connect with BER Solutions Architecture</h3>
              <p className="cm-header-sub">Direct Engineering Advisory • Zero Obligation</p>
            </div>
          </div>
          <button
            type="button"
            className="cm-header-close"
            onClick={closeModal}
            aria-label="Close modal"
          >
            <X size={15} />
          </button>
        </div>

        {/* NOTICE BANNER - Clean Disclaimer Strip Matching Reference */}
        <div className="cm-notice-bar">
          <p className="cm-notice-text">
            <strong>Notice:</strong> All project inquiries are confidential and protected under 100% strict bilateral NDA. We evaluate technical architecture and provide fast estimation.
          </p>
        </div>

        {/* MODAL BODY */}
        <div className="cm-body">
          {sent ? (
            <div className="cm-success-state">
              <div className="cm-success-icon-wrap">
                <CheckCircle2 size={36} className="cm-success-icon" />
              </div>
              <h4 className="cm-success-title">Consultation Request Received!</h4>
              <p className="cm-success-desc">
                Thank you! Our senior architecture lead is analyzing your project details and will connect with you via email and phone within 24 hours.
              </p>
              <button type="button" className="cm-btn-done" onClick={closeModal}>
                Done & Close
              </button>
            </div>
          ) : (
            <form className="cm-form" onSubmit={handleSubmit}>
              {/* Row 1: Full Name & Phone No */}
              <div className="cm-form-row">
                <div className="cm-field-group">
                  <label className="cm-label">
                    Full Name <span className="cm-req">*</span>
                  </label>
                  <div className="cm-input-wrapper">
                    <User size={13} className="cm-field-icon" />
                    <input
                      type="text"
                      name="name"
                      className="cm-input"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="cm-field-group">
                  <label className="cm-label">
                    Phone No <span className="cm-req">*</span>
                  </label>
                  <div className="cm-input-wrapper">
                    <Phone size={13} className="cm-field-icon" />
                    <input
                      type="tel"
                      name="phone"
                      className="cm-input"
                      placeholder="e.g. +91 85273 35977"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email Id & Company Name */}
              <div className="cm-form-row">
                <div className="cm-field-group">
                  <label className="cm-label">
                    Email Id <span className="cm-req">*</span>
                  </label>
                  <div className="cm-input-wrapper">
                    <Mail size={13} className="cm-field-icon" />
                    <input
                      type="email"
                      name="email"
                      className="cm-input"
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="cm-field-group">
                  <label className="cm-label">Company Name</label>
                  <div className="cm-input-wrapper">
                    <Building2 size={13} className="cm-field-icon" />
                    <input
                      type="text"
                      name="company"
                      className="cm-input"
                      placeholder="e.g. Acme Technologies"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Interested Service & Have Existing Project Toggle (Matching Reference Pills) */}
              <div className="cm-form-row">
                <div className="cm-field-group">
                  <label className="cm-label">
                    Interested Service <span className="cm-req">*</span>
                  </label>
                  <div className="cm-input-wrapper">
                    <Layers size={13} className="cm-field-icon" />
                    <select
                      name="service"
                      className="cm-input cm-select"
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >
                      {formServices.map((svc) => (
                        <option key={svc} value={svc}>
                          {svc}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="cm-select-arrow" />
                  </div>
                </div>

                <div className="cm-field-group">
                  <label className="cm-label">
                    Have an Existing Project? <span className="cm-req">*</span>
                  </label>
                  <div className="cm-toggle-pills">
                    <button
                      type="button"
                      className={`cm-toggle-btn ${formData.hasProject === 'Yes' ? 'is-active' : ''}`}
                      onClick={() => handleToggleProject('Yes')}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`cm-toggle-btn ${formData.hasProject === 'No' ? 'is-active' : ''}`}
                      onClick={() => handleToggleProject('No')}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 4: Project Scope / Message */}
              <div className="cm-field-group">
                <label className="cm-label">Project Scope & Requirements (Optional)</label>
                <div className="cm-input-wrapper cm-textarea-wrapper">
                  <MessageSquare size={13} className="cm-field-icon cm-field-icon--top" />
                  <textarea
                    name="message"
                    rows="2"
                    className="cm-input cm-textarea"
                    placeholder="e.g. Briefly describe your project scope, tech stack, or target timeline..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && <div className="cm-error-alert">{error}</div>}

              {/* Submit CTA Button (Matching Reference Shape & Icon) */}
              <button type="submit" className="cm-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="cm-spinner-sm"></span>
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Request Free Consultation</span>
                  </>
                )}
              </button>

              {/* Trust Footer Badges (Matching Reference Bottom Strip) */}
              <div className="cm-trust-footer">
                <ShieldCheck size={12} className="cm-trust-icon" />
                <span>100% NDA Protection • Sub-24h Direct Architect Response • Free Consultation</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

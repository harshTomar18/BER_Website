import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  MessageSquare,
  User,
  Building2,
  Layers,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Code2,
  Headphones,
  Check,
  Star,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { company, formServices } from '../config/siteConfig';
import { contactApi } from '../api';
import './ContactSection.css';

/* Vector SVG Country Flags to prevent ugly Windows text fallbacks like 'IN' / 'US' */
function CountryFlag({ country, size = 20, className = '' }) {
  const isIndia = country === 'India' || country === 'IN' || country === 'india';
  if (isIndia) {
    return (
      <svg
        width={size}
        height={Math.round((size * 2) / 3)}
        viewBox="0 0 640 480"
        className={className}
        style={{ borderRadius: 2, display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
        aria-label="Flag of India"
      >
        <path fill="#f93" d="M0 0h640v160H0z" />
        <path fill="#fff" d="M0 160h640v160H0z" />
        <path fill="#128807" d="M0 320h640v160H0z" />
        <g transform="matrix(3.2 0 0 3.2 320 240)">
          <circle r="20" fill="none" stroke="#008" strokeWidth="2" />
          <circle r="3.5" fill="#008" />
          <g id="flag-in-d">
            <g id="flag-in-c">
              <g id="flag-in-b">
                <g id="flag-in-a">
                  <path fill="#008" d="M0-20l.8 4L0-5l-.8-11z" />
                </g>
                <use href="#flag-in-a" transform="rotate(15)" />
              </g>
              <use href="#flag-in-b" transform="rotate(30)" />
            </g>
            <use href="#flag-in-c" transform="rotate(60)" />
          </g>
          <use href="#flag-in-d" transform="rotate(120)" />
          <use href="#flag-in-d" transform="rotate(240)" />
        </g>
      </svg>
    );
  }

  // USA Flag
  return (
    <svg
      width={size}
      height={Math.round((size * 2) / 3)}
      viewBox="0 0 640 480"
      className={className}
      style={{ borderRadius: 2, display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      aria-label="Flag of United States"
    >
      <path fill="#bd3d44" d="M0 0h640v480H0z" />
      <path stroke="#fff" strokeWidth="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640" />
      <path fill="#192f5d" d="M0 0h260v260H0z" />
      <circle cx="130" cy="130" r="80" fill="#fff" opacity="0.15" />
      <path
        fill="#fff"
        d="M40 35l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zM67 75l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zM40 115l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zM67 155l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zM40 195l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9zm55 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z"
      />
    </svg>
  );
}

export default function ContactSection({
  contactEmail = company.email,
  phone = company.phone,
  address = company.shortAddress,
  onSubmit,
}) {
  const [activeOffice, setActiveOffice] = useState('india');
  const currentOffice =
    (company.offices || []).find((o) => o.id === activeOffice) || company.offices?.[0];

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Please complete all required fields (Name, Email, Phone, Message).');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      if (typeof onSubmit === 'function') {
        await onSubmit({ ...form, type: 'contact' });
      } else {
        const res = await contactApi.submitInquiry({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          service: form.service.trim() || 'General Inquiry',
          message: form.message.trim(),
          type: 'contact',
        });

        if (!res.success) {
          throw new Error(res.message || 'Failed to submit inquiry.');
        }
      }

      setStatus('success');
      setForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
      });
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus('idle');
      const specificError = err.errors && err.errors[0]?.message;
      setError(specificError || err.message || 'Something went wrong. Please try again or reach out directly.');
    }
  };

  return (
    <section className="ber-contact-page" id="contact-section">
      {/* Background ambient lighting */}
      <div className="contact-bg-glow contact-glow-one" />
      <div className="contact-bg-glow contact-glow-two" />

      <div className="container contact-container">
        {/* ===================================================
            LEFT COLUMN: HERO, CONTACT CARDS & TRUST
            =================================================== */}
        <div className="contact-left">
          {/* Eyebrow Badge */}
          <div className="contact-eyebrow">
            <span className="eyebrow-dot" />
            <span>CONTACT BER SERVICES</span>
          </div>

          <h2 className="contact-heading">
            Let's Build Something <br />
            <span className="heading-gradient">Great Together.</span>
          </h2>

          <p className="contact-intro">
            Have an idea, an enterprise project, or a digital challenge to solve?
            We'd love to hear from you. Let's discuss how technology and scalable
            engineering can move your business forward.
          </p>

          {/* 4 Interactive Contact Cards with Icons */}
          <div className="contact-cards-grid">
            {/* Phone Card */}
            <a
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              className="contact-card-item"
              title="Call Our Team"
            >
              <div className="contact-card-icon-tile">
                <Phone size={20} />
              </div>
              <div className="contact-card-meta">
                <small>Call Our Team</small>
                <strong>{phone}</strong>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${contactEmail}`}
              className="contact-card-item"
              title="Email Us"
            >
              <div className="contact-card-icon-tile">
                <Mail size={20} />
              </div>
              <div className="contact-card-meta">
                <small>Email Inquiries</small>
                <strong>{contactEmail}</strong>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a
              href={company.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="contact-card-item"
              title="Chat on WhatsApp"
            >
              <div className="contact-card-icon-tile contact-card-icon-tile--whatsapp">
                <MessageCircle size={20} />
              </div>
              <div className="contact-card-meta">
                <small>Instant WhatsApp</small>
                <strong>Chat with Engineers</strong>
              </div>
            </a>

            {/* Office Location Card */}
            <a
              href={company.addresses[1]?.map || '#'}
              target="_blank"
              rel="noreferrer"
              className="contact-card-item"
              title="Office Location"
            >
              <div className="contact-card-icon-tile">
                <MapPin size={20} />
              </div>
              <div className="contact-card-meta">
                <small>Headquarters</small>
                <strong>Cloud 9, Vaishali</strong>
              </div>
            </a>
          </div>

          {/* Interactive Live Status Card with Ambient Orbit */}
          <div className="contact-live-status-card">
            <div className="live-status-header">
              <span className="live-pulse-dot" />
              <div>
                <strong>Active Engineering Desk</strong>
                <small>Mon – Sat: 9:30 AM – 6:30 PM IST</small>
              </div>
            </div>
            <div className="live-status-badge">
              <Clock size={14} />
              <span>Avg. response under 2 hours</span>
            </div>
          </div>

          {/* ===================================================
              INLINE INTERACTIVE GOOGLE MAP & DUAL OFFICES
              Directly visible in Left Column next to Contact Form
              =================================================== */}
          <div className="contact-inline-map-card">
            <div className="inline-map-header">
              <div className="inline-map-tabs">
                {(company.offices || []).map((off) => (
                  <button
                    key={off.id}
                    type="button"
                    className={`inline-map-tab ${activeOffice === off.id ? 'is-active' : ''}`}
                    onClick={() => setActiveOffice(off.id)}
                  >
                    <CountryFlag country={off.country} size={16} />
                    <span>{off.country} {off.id === 'india' ? '(HQ)' : '(USA)'}</span>
                  </button>
                ))}
              </div>

              <a
                href={currentOffice?.mapUrl || 'https://share.google/6ojt2XBKe3kBFESxt'}
                target="_blank"
                rel="noreferrer"
                className="inline-map-directions-btn"
                title="Open in Google Maps"
              >
                <span>Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="inline-map-frame-box">
              <iframe
                title={`Map - ${currentOffice?.title || 'BER Services'}`}
                src={currentOffice?.embedUrl}
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="inline-map-iframe"
              />

              <div className="inline-map-floating-info">
                <div className="inline-map-pin-icon">
                  <MapPin size={15} />
                </div>
                <div className="inline-map-meta">
                  <strong>{currentOffice?.title}</strong>
                  <p>{currentOffice?.address}</p>
                </div>
                <a
                  href={currentOffice?.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-map-action-btn"
                >
                  <Navigation size={12} />
                  <span>Directions</span>
                </a>
              </div>
            </div>

            {/* Google My Business Rating & Review Bar */}
            <div className="inline-gmb-strip">
              <div className="inline-gmb-left">
                <div className="inline-gmb-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>
                <div className="inline-gmb-rating">
                  <div className="inline-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#f59e0b" stroke="#f59e0b" />
                    ))}
                  </div>
                  <span><strong>4.9 / 5.0</strong> on Google (85+ Reviews)</span>
                </div>
              </div>

              <a
                href={company.googleBusiness?.reviewUrl || 'https://share.google/6ojt2XBKe3kBFESxt'}
                target="_blank"
                rel="noreferrer"
                className="inline-gmb-btn"
              >
                <Star size={12} fill="#ffffff" />
                <span>Review on Google</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT COLUMN: MODERN FROSTED GLASS FORM
            =================================================== */}
        <div className="contact-right">
          <div className="contact-form-card">
            <div className="form-heading">
              <div className="form-icon">
                <Send size={24} />
              </div>

              <div>
                <span className="form-subheading">GET IN TOUCH</span>
                <h3 className="form-title">Send Us a Message</h3>
                <p className="form-desc">
                  Tell us a little about your project. We'll take it from there.
                </p>
              </div>
            </div>

            {status === 'success' ? (
              <div className="contact-success">
                <div className="success-icon">
                  <CheckCircle2 size={46} />
                </div>

                <h3>Message Received!</h3>

                <p>
                  Thank you for reaching out to BER Services. Our engineering team
                  has received your project inquiry and will contact you shortly.
                </p>

                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="success-back-button"
                >
                  <span>Send Another Message</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <form className="ber-contact-form" onSubmit={handleSubmit}>
                {/* Row 1: Name & Email */}
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="contact-name">
                      Your Name <span className="field-req">*</span>
                    </label>
                    <div className="input-icon-wrap">
                      <User size={18} className="input-icon" />
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        placeholder="e.g. John Smith"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-email">
                      Email Address <span className="field-req">*</span>
                    </label>
                    <div className="input-icon-wrap">
                      <Mail size={18} className="input-icon" />
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        placeholder="e.g. john@company.com"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone & Company */}
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="contact-phone">
                      Phone Number <span className="field-req">*</span>
                    </label>
                    <div className="input-icon-wrap">
                      <Phone size={18} className="input-icon" />
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-company">Company Name</label>
                    <div className="input-icon-wrap">
                      <Building2 size={18} className="input-icon" />
                      <input
                        id="contact-company"
                        name="company"
                        type="text"
                        placeholder="e.g. Acme Innovations"
                        value={form.company}
                        onChange={handleChange}
                        autoComplete="organization"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Service Selection */}
                <div className="form-field">
                  <label htmlFor="contact-service">Service Needed</label>
                  <div className="input-icon-wrap select-wrapper">
                    <Layers size={18} className="input-icon" />
                    <select
                      id="contact-service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                    >
                      <option value="">Select a service / domain</option>
                      {formServices.map((svc) => (
                        <option key={svc} value={svc}>
                          {svc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 4: Project Details */}
                <div className="form-field">
                  <label htmlFor="contact-message">
                    Tell Us About Your Project <span className="field-req">*</span>
                  </label>
                  <div className="input-icon-wrap input-icon-wrap--top">
                    <MessageSquare size={18} className="input-icon" />
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="4"
                      placeholder="Describe what you want to build, key objectives, or timeline..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="contact-form-error" role="alert">
                    {error}
                  </p>
                )}

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  className="contact-submit-button"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <span>Sending Your Request...</span>
                      <span className="submit-spinner" />
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>


              </form>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================
          GLOBAL PRESENCE & INTERACTIVE MAP SECTION
          Multiple Offices (India HQ & United States Office)
          =================================================== */}
      <div className="container contact-map-section">
        <div className="contact-global-header">
          <div className="contact-eyebrow">
            <span className="eyebrow-dot" />
            <span>GLOBAL PRESENCE & MULTIPLE LOCATIONS</span>
          </div>

          <h3 className="contact-global-heading">
            Our Engineering Hubs in <span className="heading-gradient">India & the United States</span>
          </h3>

          <p className="contact-global-desc">
            Serving global enterprises and fast-growing startups with dedicated delivery headquarters in Delhi NCR and strategic client advisory in the United States.
          </p>
        </div>

        {/* Dual Office Cards Grid - Each with its own Direct Map & Details */}
        <div className="offices-grid">
          {(company.offices || []).map((office) => {
            const isActive = activeOffice === office.id;
            return (
              <div
                key={office.id}
                className={`office-card ${isActive ? 'office-card--active' : ''}`}
                onClick={() => setActiveOffice(office.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveOffice(office.id);
                  }
                }}
              >
                <div className="office-card-header">
                  <div className="office-flag-pill">
                    <CountryFlag country={office.country} size={20} />
                    <span className="office-country">{office.country}</span>
                  </div>
                  <span className="office-badge-tag">{office.badge}</span>
                </div>

                <h4 className="office-title">{office.title}</h4>

                {/* Direct Embedded Google Map for this specific country */}
                <div className="office-card-map-box">
                  <iframe
                    title={`Google Map - ${office.country} - ${office.title}`}
                    src={office.embedUrl}
                    width="100%"
                    height="230"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="office-card-iframe"
                  />
                </div>

                <div className="office-info-list">
                  <div className="office-info-item">
                    <MapPin size={16} className="office-info-icon" />
                    <span>{office.address}</span>
                  </div>

                  <div className="office-info-item">
                    <Phone size={16} className="office-info-icon" />
                    <a href={`tel:${office.phone.replace(/[^\d+]/g, '')}`}>{office.phone}</a>
                  </div>

                  <div className="office-info-item">
                    <Mail size={16} className="office-info-icon" />
                    <a href={`mailto:${office.email}`}>{office.email}</a>
                  </div>

                  <div className="office-info-item">
                    <Clock size={16} className="office-info-icon" />
                    <span>{office.hours}</span>
                  </div>
                </div>

                <div className="office-card-footer">
                  <a
                    href={office.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="office-directions-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Navigation size={14} />
                    <span>Open in Google Maps / Directions</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Google Map with Overlay */}
        <div className="contact-interactive-map-box">
          <div className="map-tabs-bar">
            <span className="map-tabs-label">Active Map View:</span>
            <div className="map-tabs-group">
              {(company.offices || []).map((office) => (
                <button
                  key={office.id}
                  type="button"
                  className={`map-tab-btn ${activeOffice === office.id ? 'is-active' : ''}`}
                  onClick={() => setActiveOffice(office.id)}
                >
                  <CountryFlag country={office.country} size={16} />
                  <span>{office.country} ({office.id === 'india' ? 'HQ' : 'Desk'})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="map-iframe-container">
            <iframe
              title={`Google Map - ${currentOffice?.title || 'BER Services'}`}
              src={currentOffice?.embedUrl}
              width="100%"
              height="440"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map-iframe-element"
            />

            {/* Map Floating Floating Glass Overlay Badge */}
            <div className="map-glass-badge">
              <div className="map-glass-icon">
                <MapPin size={18} />
              </div>
              <div className="map-glass-content">
                <span className="map-glass-eyebrow">{currentOffice?.badge}</span>
                <strong className="map-glass-title">{currentOffice?.title}</strong>
                <p className="map-glass-address">{currentOffice?.address}</p>
                <div className="map-glass-row">
                  <span className="map-glass-hours">
                    <Clock size={12} />
                    {currentOffice?.hours}
                  </span>
                </div>
              </div>
              <a
                href={currentOffice?.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="map-glass-cta"
              >
                <Navigation size={13} />
                <span>Open in Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

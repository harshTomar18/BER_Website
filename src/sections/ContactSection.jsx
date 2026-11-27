import React, { useState, useEffect } from 'react';
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
import { WhatsAppIcon } from '../components/SocialIcons';
import { contactApi, showcaseApi } from '../api';
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

  // Dynamic Google My Business Live Rating state
  const [gmbData, setGmbData] = useState(
    company.googleBusiness || {
      name: 'BER Services Pvt Ltd',
      url: 'https://share.google/6ojt2XBKe3kBFESxt',
      reviewUrl: 'https://share.google/6ojt2XBKe3kBFESxt',
      rating: 4.9,
      reviewsCount: '85+',
      status: 'Verified Business on Google',
    }
  );

  useEffect(() => {
    let isMounted = true;
    showcaseApi
      .getPublicShowcase()
      .then((res) => {
        if (isMounted && res?.data?.googleBusiness) {
          setGmbData((prev) => ({ ...prev, ...res.data.googleBusiness }));
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

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
                <WhatsAppIcon size={20} color="#25D366" />
              </div>
              <div className="contact-card-meta">
                <small>Instant WhatsApp</small>
                <strong>Chat with Engineers</strong>
              </div>
            </a>

            {/* Office Location Card */}
            <a
              href={company.offices?.[0]?.mapUrl || company.googleBusiness?.url || 'https://share.google/6ojt2XBKe3kBFESxt'}
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
                <strong>6th Floor, Cloud 9 Towers, Vaishali, UP</strong>
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
              <div className="inline-map-location-tag">
                <MapPin size={15} />
                <span>Headquarters • Vaishali, Delhi NCR</span>
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

            {/* Google My Business Live Dynamic Rating Bar */}
            <div className="inline-gmb-strip">
              <div className="inline-gmb-left">
                <div className="inline-gmb-icon" title="Google Verified Profile">
                  <svg viewBox="0 0 24 24" width="22" height="22">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>

                <div className="inline-gmb-meta">
                  <div className="inline-gmb-score-row">
                    <span className="inline-gmb-score">{gmbData?.rating || 4.9}</span>
                    <div className="inline-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill="#f59e0b" stroke="#f59e0b" />
                      ))}
                    </div>
                    <span className="inline-gmb-verified-badge">
                      <CheckCircle2 size={11} /> Verified
                    </span>
                  </div>
                  <div className="inline-gmb-count">
                    <span>Google Business Rating</span>
                    <span className="inline-gmb-dot">•</span>
                    <span>{gmbData?.reviewsCount || '85+'} Verified Reviews</span>
                  </div>
                </div>
              </div>

              <div className="inline-gmb-actions">
                <a
                  href={gmbData?.reviewUrl || 'https://share.google/6ojt2XBKe3kBFESxt'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-gmb-btn inline-gmb-btn--review"
                  title="Review on Google"
                >
                  <Star size={12} fill="#ffffff" />
                  <span>Review on Google</span>
                  <ExternalLink size={11} />
                </a>
              </div>
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
                        placeholder="e.g. +91 85273 35977"
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
    </section>
  );
}

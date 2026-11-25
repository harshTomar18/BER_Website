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
} from 'lucide-react';
import { company, formServices } from '../config/siteConfig';
import { contactApi } from '../api';
import './ContactSection.css';

export default function ContactSection({
  contactEmail = company.email,
  phone = company.phone,
  address = company.shortAddress,
  onSubmit,
}) {
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
    </section>
  );
}

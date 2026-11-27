import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe, Star } from 'lucide-react';
import { company, services, footerLinks } from '../config/siteConfig';
import { images } from '../config/images';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="ft">
      <div className="container ft__grid">
        {/* Column 1: Brand & Socials */}
        <div className="ft__col ft__col--brand">
          <Link to="/" className="ft__logo-link" aria-label="BER Services Home">
            <img src={images.logoWhite} alt={company.name} className="ft__logo-img" />
          </Link>
          <p className="ft__tagline">{company.tagline}</p>
          <div className="ft__social">
            {/* Facebook */}
            <a
              href={company.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="ft__social-icon-btn"
              aria-label="Facebook"
              title="Follow us on Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href={company.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="ft__social-icon-btn"
              aria-label="Instagram"
              title="Follow us on Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={company.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="ft__social-icon-btn"
              aria-label="LinkedIn"
              title="Connect on LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href={company.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="ft__social-icon-btn ft__social-icon-btn--wa"
              aria-label="WhatsApp"
              title="Chat on WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: About us */}
        <div className="ft__col">
          <div className="ft__heading-wrap">
            <h4 className="ft__heading">About us</h4>
          </div>
          <ul className="ft__links">
            {footerLinks.about.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Business Segments */}
        <div className="ft__col ft__col--services">
          <div className="ft__heading-wrap">
            <h4 className="ft__heading">Business Segments</h4>
          </div>
          <ul className="ft__links">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/services-we-provide/${s.slug}`}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Reach us */}
        <div className="ft__col ft__col--reach">
          <div className="ft__heading-wrap">
            <h4 className="ft__heading">Reach us</h4>
          </div>
          <ul className="ft__contact-list">
            <li>
              <span className="ft__contact-icon-tile">
                <Phone size={15} />
              </span>
              <div className="ft__contact-meta">
                <small>Phone Support</small>
                <a href={`tel:${company.phone.replace(/\s+/g, '')}`}>{company.phone}</a>
              </div>
            </li>
            <li>
              <span className="ft__contact-icon-tile">
                <Mail size={15} />
              </span>
              <div className="ft__contact-meta">
                <small>Email Inquiries</small>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>
            </li>
            <li>
              <span className="ft__contact-icon-tile ft__contact-icon-tile--top">
                <MapPin size={15} />
              </span>
              <div className="ft__contact-meta">
                <small>India HQ (Delhi NCR)</small>
                <a href={company.offices?.[0]?.mapUrl || company.googleBusiness?.url || '#'} target="_blank" rel="noreferrer">
                  Cloud 9 Towers, Vaishali, Ghaziabad
                </a>
              </div>
            </li>
            <li>
              <span className="ft__contact-icon-tile ft__contact-icon-tile--top">
                <Globe size={15} />
              </span>
              <div className="ft__contact-meta">
                <small>Americas Office (USA)</small>
                <a href={company.offices?.[1]?.mapUrl || '#'} target="_blank" rel="noreferrer">
                  Newark, Delaware, United States
                </a>
              </div>
            </li>
            <li className="ft__gmb-item">
              <a
                href={company.googleBusiness?.url || 'https://share.google/6ojt2XBKe3kBFESxt'}
                target="_blank"
                rel="noreferrer"
                className="ft__gmb-link"
              >
                <div className="ft__gmb-stars">
                  <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                  <span>4.9 / 5.0 Google Reviews</span>
                </div>
                <small>Verified Business Profile</small>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Legal */}
      <div className="ft__bottom">
        <div className="container ft__bottom-in">
          <div className="ft__copyright">
            <span>© {new Date().getFullYear()} </span>
            <Link to="/">{company.legalName.replace('SERVICES PVT. LTD.', 'Services PVT. LTD')}</Link>
            <span>. All Rights Reserved.</span>
          </div>
          <div className="ft__legal">
            {footerLinks.legal.map((l) => (
              <Link key={l.to} to={l.to}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

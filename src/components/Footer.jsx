import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe, Star } from 'lucide-react';
import { company, services, footerLinks } from '../config/siteConfig';
import { images } from '../config/images';
import { FacebookIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon } from './SocialIcons';
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
              className="ft__social-icon-btn ft__social-icon-btn--fb"
              aria-label="Facebook"
              title="Follow us on Facebook"
            >
              <FacebookIcon size={18} />
            </a>

            {/* Instagram */}
            <a
              href={company.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="ft__social-icon-btn ft__social-icon-btn--ig"
              aria-label="Instagram"
              title="Follow us on Instagram"
            >
              <InstagramIcon size={18} />
            </a>

            {/* LinkedIn */}
            <a
              href={company.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="ft__social-icon-btn ft__social-icon-btn--li"
              aria-label="LinkedIn"
              title="Connect on LinkedIn"
            >
              <LinkedInIcon size={18} />
            </a>

            {/* WhatsApp */}
            <a
              href={company.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="ft__social-icon-btn ft__social-icon-btn--wa"
              aria-label="WhatsApp"
              title="Chat with us on WhatsApp"
            >
              <WhatsAppIcon size={18} />
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
                <small>Headquarters</small>
                <a href={company.offices?.[0]?.mapUrl || company.googleBusiness?.url || 'https://share.google/6ojt2XBKe3kBFESxt'} target="_blank" rel="noreferrer">
                  6th Floor, Cloud 9 Towers, 5A-62, Sector-1, Vaishali, Ghaziabad, Delhi NCR, UP
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

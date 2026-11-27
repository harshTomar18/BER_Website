import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  Lock,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Scale,
  ArrowRight
} from 'lucide-react';
import PageBanner from '../components/PageBanner';
import CtaBand from '../sections/CtaBand';
import { termsData, privacyData } from '../data/legalData';
import './Legal.css';

export function Terms() {
  return <LegalDocumentView data={termsData} activeType="terms" />;
}

export function Privacy() {
  return <LegalDocumentView data={privacyData} activeType="privacy" />;
}

function LegalDocumentView({ data, activeType }) {
  const { pathname } = useLocation();
  const [activeSectionId, setActiveSectionId] = useState(data.sections[0]?.id || '');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (data.sections && data.sections.length > 0) {
      setActiveSectionId(data.sections[0].id);
    }
  }, [pathname, data]);

  const scrollToSection = (id) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <PageBanner
        title={data.title}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: data.title }
        ]}
      />

      <div className="legal-page-wrap">
        {/* Atmospheric Glow Accents */}
        <div className="legal-bg-glow legal-bg-glow--top"></div>
        <div className="legal-bg-glow legal-bg-glow--bottom"></div>

        <div className="container legal-container">
          {/* Top Document Header & Quick Switcher Bar */}
          <div className="legal-top-bar">
            {/* Quick Switcher Tabs */}
            <div className="legal-doc-switcher">
              <Link
                to="/terms-conditions"
                className={`legal-switch-btn ${activeType === 'terms' ? 'is-active' : ''}`}
              >
                <Shield size={16} />
                <span>Terms & Conditions</span>
              </Link>
              <Link
                to="/privacy-policy"
                className={`legal-switch-btn ${activeType === 'privacy' ? 'is-active' : ''}`}
              >
                <Lock size={16} />
                <span>Privacy Policy</span>
              </Link>
            </div>

            {/* Document Metadata Badges */}
            <div className="legal-meta-badges">
              <div className="legal-meta-badge">
                <Calendar size={14} />
                <span>Last Updated: {data.lastUpdated}</span>
              </div>
              <div className="legal-meta-badge legal-meta-badge--law">
                <Scale size={14} />
                <span>Jurisdiction: India</span>
              </div>
            </div>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="legal-layout-grid">
            {/* Left Column: Sticky Table of Contents Sidebar */}
            <aside className="legal-toc-sidebar">
              <div className="legal-toc-card">
                <div className="legal-toc-header">
                  <span className="legal-toc-sub">Document Navigation</span>
                  <h3 className="legal-toc-title">Table of Contents</h3>
                  <span className="legal-toc-count">{data.sections.length} Sections</span>
                </div>

                <nav className="legal-toc-nav" aria-label="Table of Contents">
                  {data.sections.map((sec) => {
                    const isActive = activeSectionId === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        className={`legal-toc-link ${isActive ? 'is-active' : ''}`}
                        onClick={() => scrollToSection(sec.id)}
                      >
                        <span className="legal-toc-num">{sec.number}</span>
                        <span className="legal-toc-text">{sec.title}</span>
                        <ChevronRight size={14} className="legal-toc-chevron" />
                      </button>
                    );
                  })}
                </nav>

                {/* Direct Support Mini-Card in Sidebar */}
                <div className="legal-sidebar-contact">
                  <div className="legal-sidebar-contact-icon">
                    <Building2 size={16} />
                  </div>
                  <div className="legal-sidebar-contact-info">
                    <span className="legal-sc-label">Legal & Compliance Desk</span>
                    <a href="tel:+918527335977" className="legal-sc-link">+91 85273 35977</a>
                    <a href="mailto:support@thebermedia.com" className="legal-sc-email">support@thebermedia.com</a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Column: Main Document Body */}
            <main className="legal-main-body">
              <div className="legal-doc-card">
                {/* Intro Callout Box */}
                <div className="legal-intro-box">
                  <div className="legal-intro-pill">
                    <Sparkles size={14} />
                    <span>Official Governance Document</span>
                  </div>
                  <h1 className="legal-doc-title">{data.title}</h1>
                  <p className="legal-doc-company-lead">
                    Published by <strong>{data.company}</strong> (Operator of{' '}
                    <a href={data.website} target="_blank" rel="noopener noreferrer">
                      https://thebermedia.com/
                    </a>
                    )
                  </p>

                  <div className="legal-intro-paragraphs">
                    {data.intro.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>

                {/* Numbered Sections */}
                <div className="legal-sections-flow">
                  {data.sections.map((sec) => (
                    <section key={sec.id} id={sec.id} className="legal-section-block">
                      <div className="legal-section-header">
                        <span className="legal-section-num-pill">{sec.number}</span>
                        <h2 className="legal-section-title">{sec.title}</h2>
                      </div>

                      <div className="legal-section-content">
                        {/* Standard Lead Text */}
                        {sec.lead && <p className="legal-p-lead">{sec.lead}</p>}

                        {/* Standard Paragraphs */}
                        {Array.isArray(sec.paragraphs) &&
                          sec.paragraphs.map((p, pIdx) => <p key={pIdx} className="legal-p">{p}</p>)}

                        {/* Bullet Points */}
                        {Array.isArray(sec.bullets) && sec.bullets.length > 0 && (
                          <ul className="legal-bullets-list">
                            {sec.bullets.map((b, bIdx) => (
                              <li key={bIdx} className="legal-bullet-item">
                                <span className="legal-bullet-check">
                                  <CheckCircle2 size={15} />
                                </span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Sub-Bullets if any (e.g. Section 6) */}
                        {sec.subLead && <p className="legal-sublead">{sec.subLead}</p>}
                        {Array.isArray(sec.subBullets) && sec.subBullets.length > 0 && (
                          <ul className="legal-bullets-list legal-bullets-list--sub">
                            {sec.subBullets.map((sb, sbIdx) => (
                              <li key={sbIdx} className="legal-bullet-item">
                                <span className="legal-bullet-dot"></span>
                                <span>{sb}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Subsections if any (e.g. Privacy 2.1, 2.2, 2.3) */}
                        {Array.isArray(sec.subsections) &&
                          sec.subsections.map((sub, sIdx) => (
                            <div key={sIdx} className="legal-subsection-block">
                              <h3 className="legal-subsection-title">{sub.subTitle}</h3>
                              {sub.text && <p className="legal-p">{sub.text}</p>}
                              {Array.isArray(sub.bullets) && sub.bullets.length > 0 && (
                                <ul className="legal-bullets-list">
                                  {sub.bullets.map((b, bIdx) => (
                                    <li key={bIdx} className="legal-bullet-item">
                                      <span className="legal-bullet-check">
                                        <CheckCircle2 size={15} />
                                      </span>
                                      <span>{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {sub.note && (
                                <div className="legal-note-box">
                                  <span className="legal-note-label">Important:</span> {sub.note}
                                </div>
                              )}
                            </div>
                          ))}

                        {/* Numbered Items if any (e.g. Privacy Section 3) */}
                        {Array.isArray(sec.numberedItems) && sec.numberedItems.length > 0 && (
                          <div className="legal-numbered-grid">
                            {sec.numberedItems.map((item, nIdx) => (
                              <div key={nIdx} className="legal-numbered-item">
                                <span className="legal-numbered-idx">{String(nIdx + 1).padStart(2, '0')}</span>
                                <span className="legal-numbered-text">{item}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Footer Paragraphs */}
                        {Array.isArray(sec.footerParagraphs) &&
                          sec.footerParagraphs.map((fp, fpIdx) => (
                            <p key={fpIdx} className="legal-p">{fp}</p>
                          ))}

                        {/* Policy Link (e.g. Section 18) */}
                        {sec.linkUrl && (
                          <div className="legal-cta-inline">
                            <Link to={sec.linkUrl} className="legal-cta-link-btn">
                              <span>{sec.linkText || 'Read Policy'}</span>
                              <ArrowRight size={15} />
                            </Link>
                          </div>
                        )}

                        {/* Note Box */}
                        {sec.note && (
                          <div className="legal-note-box">
                            <span className="legal-note-label">Notice:</span> {sec.note}
                          </div>
                        )}

                        {/* Dedicated Official Contact Card (Section 29 of Terms & Section 14 of Privacy) */}
                        {sec.isContactCard && (
                          <div className="legal-official-contact-card">
                            <div className="legal-occ-header">
                              <Building2 size={22} className="legal-occ-icon" />
                              <div>
                                <h4 className="legal-occ-title">{data.company}</h4>
                                <span className="legal-occ-sub">Corporate & Legal Inquiries</span>
                              </div>
                            </div>

                            <div className="legal-occ-grid">
                              <div className="legal-occ-item">
                                <span className="legal-occ-label">Official Website:</span>
                                <a href={data.website} target="_blank" rel="noopener noreferrer" className="legal-occ-val">
                                  {data.website}
                                  <ExternalLink size={13} />
                                </a>
                              </div>

                              <div className="legal-occ-item">
                                <span className="legal-occ-label">Corporate Phone:</span>
                                <a href={`tel:${data.phone.replace(/\s+/g, '')}`} className="legal-occ-val">
                                  <Phone size={13} />
                                  <span>{data.phone}</span>
                                </a>
                              </div>

                              <div className="legal-occ-item">
                                <span className="legal-occ-label">Support & Inquiries:</span>
                                <a href={`mailto:${data.email}`} className="legal-occ-val">
                                  <Mail size={13} />
                                  <span>{data.email}</span>
                                </a>
                              </div>

                              <div className="legal-occ-item">
                                <span className="legal-occ-label">Official Contact Portal:</span>
                                <Link to="/contact-us" className="legal-occ-val">
                                  <span>https://thebermedia.com/contact-us/</span>
                                  <ExternalLink size={13} />
                                </Link>
                              </div>
                            </div>

                            <div className="legal-occ-action">
                              <Link to="/contact-us" className="legal-occ-btn">
                                <span>Contact Legal Team</span>
                                <ArrowRight size={15} />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Brand CTA Band */}
      <CtaBand />
    </>
  );
}

export default Terms;

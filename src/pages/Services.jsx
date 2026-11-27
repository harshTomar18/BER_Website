import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  ChevronRight,
  Globe,
  ShoppingCart,
  Smartphone,
  Code2,
  BarChart3,
  Palette,
  Bot,
  Phone
} from 'lucide-react';
import PageBanner from '../components/PageBanner';
import ServicesSection from '../sections/ServicesSection';
import CtaBand from '../sections/CtaBand';
import { useConsult } from '../context/ConsultContext';
import { serviceApi } from '../api';
import './Services.css';

const getServiceIcon = (slug = '') => {
  const s = slug.toLowerCase();
  if (s.includes('web') || s.includes('design')) return <Globe size={18} />;
  if (s.includes('ecom') || s.includes('shop') || s.includes('store')) return <ShoppingCart size={18} />;
  if (s.includes('mobile') || s.includes('app')) return <Smartphone size={18} />;
  if (s.includes('software') || s.includes('custom') || s.includes('dev')) return <Code2 size={18} />;
  if (s.includes('market') || s.includes('digital') || s.includes('seo')) return <BarChart3 size={18} />;
  if (s.includes('brand') || s.includes('graphic')) return <Palette size={18} />;
  if (s.includes('ai') || s.includes('auto') || s.includes('bot')) return <Bot size={18} />;
  return <Layers size={18} />;
};

export default function Services() {
  const { openModal } = useConsult();
  const [services, setServices] = useState([]);
  const [activeSlug, setActiveSlug] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all active services from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchServicesData = async () => {
      try {
        const res = await serviceApi.getPublicServices();
        if (isMounted && res?.success && Array.isArray(res?.data?.services)) {
          const srvs = res.data.services;
          setServices(srvs);
          if (srvs.length > 0) {
            setActiveSlug(srvs[0].slug);
          }
        }
      } catch (err) {
        console.error('Failed to load services from API:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchServicesData();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeService = services.find((s) => s.slug === activeSlug) || services[0] || null;

  return (
    <>
      <PageBanner
        title="Services We Provide"
        crumbs={[{ label: 'Services We Provide' }]}
      />

      <section className="services-page-wrap">
        {/* Ambient atmospheric glows */}
        <div className="services-bg-glow services-bg-glow--top"></div>
        <div className="services-bg-glow services-bg-glow--bottom"></div>

        <div className="container services-container">
          {/* Header */}
          <div className="services-header">
            <div className="services-badge-pill">
              <Sparkles size={14} />
              <span>Full-Stack Enterprise Capabilities</span>
            </div>
            <h1 className="services-heading">
              Engineering Digital Solutions That{' '}
              <span className="services-heading-accent">Power Real Growth</span>
            </h1>
            <p className="services-intro-text">
              From high-conversion websites and scalable eCommerce platforms to custom enterprise software and intelligent AI automations, explore our core digital practices below.
            </p>
          </div>

          {/* Vertical Sidebar Tabs Layout (Left Sidebar + Right Dynamic Content) */}
          {services.length > 0 ? (
            <div className="services-vtabs-layout">
              {/* Left Column: Vertical Services Sidebar */}
              <aside className="services-vtabs-sidebar">
                <div className="services-vtabs-side-header">
                  <div className="services-vtabs-side-sub">Core Capabilities</div>
                  <div className="services-vtabs-side-title-row">
                    <h3 className="services-vtabs-side-title">Enterprise Practices</h3>
                    <span className="services-vtabs-count-badge">{services.length} Domains</span>
                  </div>
                </div>

                <nav className="services-vtabs-nav" aria-label="Services List">
                  {services.map((srv, index) => {
                    const isSelected = srv.slug === activeSlug;
                    const numStr = String(index + 1).padStart(2, '0');
                    return (
                      <button
                        key={srv.slug}
                        type="button"
                        className={`services-vtab-btn ${isSelected ? 'is-active' : ''}`}
                        onClick={() => setActiveSlug(srv.slug)}
                      >
                        <div className="services-vtab-btn-left">
                          <span className="services-vtab-num">{numStr}</span>
                          <span className="services-vtab-icon-wrap">
                            {getServiceIcon(srv.slug)}
                          </span>
                          <span className="services-vtab-label">{srv.title || ''}</span>
                        </div>
                        <ChevronRight size={16} className="services-vtab-arrow" />
                      </button>
                    );
                  })}
                </nav>

                {/* Direct Architectural Consultation Link */}
                <div className="services-vtabs-side-footer">
                  <div className="services-vtabs-footer-info">
                    <span className="services-vtabs-footer-label">Direct Scoping Lead</span>
                    <a href="tel:+918527335977" className="services-vtabs-footer-phone">+91 85273 35977</a>
                  </div>
                  <button
                    type="button"
                    className="services-vtabs-footer-btn"
                    onClick={openModal}
                    title="Get Scoping Consultation"
                  >
                    <Phone size={14} />
                  </button>
                </div>
              </aside>

              {/* Right Column: Dynamic Active Service Showcase */}
              <main className="services-vtabs-content">
                {activeService ? (
                  <div className="service-showcase-card">
                    <div className="service-showcase-grid">
                      {/* Left Column: Narrative, Capabilities & Tech */}
                      <div className="service-showcase-content">
                        <div className="service-showcase-main-body">
                          {activeService.badge ? (
                            <div className="service-showcase-badge-row">
                              <span className="service-showcase-badge">{activeService.badge}</span>
                            </div>
                          ) : null}

                          {activeService.title ? (
                            <h2 className="service-showcase-title">{activeService.title}</h2>
                          ) : null}

                          {activeService.tagline ? (
                            <p className="service-showcase-tagline">{activeService.tagline}</p>
                          ) : null}

                          {/* Overview Text */}
                          {Array.isArray(activeService.overview) && activeService.overview.length > 0 ? (
                            <p className="service-showcase-desc">{activeService.overview[0]}</p>
                          ) : activeService.short ? (
                            <p className="service-showcase-desc">{activeService.short}</p>
                          ) : null}

                          {/* Highlights / Capabilities */}
                          {Array.isArray(activeService.capabilities) && activeService.capabilities.length > 0 ? (
                            <div className="service-showcase-caps">
                              {activeService.capabilities.slice(0, 4).map((cap, i) => (
                                <div key={i} className="service-showcase-cap-item">
                                  <div className="service-showcase-cap-dot">
                                    <CheckCircle2 size={13} strokeWidth={2.5} />
                                  </div>
                                  <span className="service-showcase-cap-text">{cap.title || ''}</span>
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {/* Technology Stack Pills */}
                          {Array.isArray(activeService.techStack) && activeService.techStack.length > 0 ? (
                            <div className="service-showcase-tech">
                              <span className="service-showcase-tech-lbl">Stack:</span>
                              {activeService.techStack.map((tech, i) => (
                                <span key={i} className="service-showcase-tech-pill">
                                  <span
                                    className="service-showcase-tech-dot"
                                    style={{ backgroundColor: tech.color || '#16a1ce' }}
                                  ></span>
                                  <span>{tech.name || ''}</span>
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        {/* Action Buttons */}
                        <div className="service-showcase-actions">
                          <Link
                            to={`/services-we-provide/${activeService.slug}`}
                            className="service-btn-primary"
                          >
                            <span>Explore Specifications</span>
                            <ArrowRight size={16} />
                          </Link>

                          <button
                            type="button"
                            className="service-btn-secondary"
                            onClick={openModal}
                          >
                            <span>Get Free Consultation</span>
                          </button>
                        </div>
                      </div>

                      {/* Right Column: Dynamic Image / Showcase Frame */}
                      <div className="service-showcase-visual">
                        <div className="service-showcase-frame">
                          <img
                            src={
                              activeService.heroImage ||
                              activeService.galleryImage ||
                              activeService.image ||
                              '/images/ber_capabilities_mockup.jpg'
                            }
                            alt={activeService.title || ''}
                            className="service-showcase-img"
                          />
                        </div>

                        {/* Measurable ROI Micro-Grid */}
                        {Array.isArray(activeService.benefits) && activeService.benefits.length > 0 ? (
                          <div className="service-showcase-metrics">
                            {activeService.benefits.slice(0, 3).map((b, i) => (
                              <div key={i} className="service-showcase-metric-box">
                                <div className="service-showcase-metric-val">{b.value || ''}</div>
                                <div className="service-showcase-metric-lbl">{b.label || ''}</div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </main>
            </div>
          ) : loading ? (
            <div className="services-loading-state">
              <div className="asm-spinner asm-spinner--lg"></div>
              <p>Loading services from database...</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* 3D Circular Orbit Gallery */}
      <ServicesSection showHeading={true} showButton={false} />

      {/* Final Call to Action Band */}
      <CtaBand />
    </>
  );
}

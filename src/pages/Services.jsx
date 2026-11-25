import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import PageBanner from '../components/PageBanner';
import ServicesSection from '../sections/ServicesSection';
import CtaBand from '../sections/CtaBand';
import { useConsult } from '../context/ConsultContext';
import { serviceApi } from '../api';
import './Services.css';

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

          {/* Interactive Horizontal Service Tabs */}
          {services.length > 0 && (
            <div className="services-nav-tabs-wrapper">
              <div className="services-nav-tabs">
                {services.map((srv) => {
                  const isSelected = srv.slug === activeSlug;
                  return (
                    <button
                      key={srv.slug}
                      type="button"
                      className={`services-tab-btn ${isSelected ? 'is-active' : ''}`}
                      onClick={() => setActiveSlug(srv.slug)}
                    >
                      <Layers size={16} />
                      <span>{srv.title || ''}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Service Tab Showcase Card */}
          {activeService ? (
            <div className="service-showcase-card">
              <div className="service-showcase-grid">
                {/* Left Column: Narrative, Capabilities & Tech */}
                <div className="service-showcase-content">
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

                  {/* Action Buttons */}
                  <div className="service-showcase-actions">
                    <Link
                      to={`/services-we-provide/${activeService.slug}`}
                      className="service-btn-primary"
                    >
                      <span>Explore Full Specifications</span>
                      <ArrowRight size={17} />
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

                {/* Right Column: Uploaded Image / Showcase Frame */}
                <div className="service-showcase-visual">
                  <div className="service-showcase-frame">
                    <img
                      src={
                        activeService.image ||
                        activeService.heroImage ||
                        activeService.galleryImage ||
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

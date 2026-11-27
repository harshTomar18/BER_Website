import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronRight,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  Clock,
  Lock,
  Zap,
  Layout,
  Layers,
  Code2,
  Search,
  ShoppingCart,
  CreditCard,
  Smartphone,
  Sparkles,
  Cpu,
  BarChart3,
  Database,
  Palette,
  Bot,
  MessageCircle,
  Globe,
  Award,
} from 'lucide-react';
import PageBanner from '../components/PageBanner';
import FaqSection from '../sections/FaqSection';
import CtaBand from '../sections/CtaBand';
import PinnedImageSwap from '../components/PinnedImageSwap';
import { company } from '../config/siteConfig';
import { useConsult } from '../context/ConsultContext';
import { serviceApi } from '../api';
import NotFound from './NotFound';
import { WhatsAppIcon } from '../components/SocialIcons';
import './ServiceDetail.css';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { openModal } = useConsult();

  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Fetch current service and all services for sidebar
  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);

    const loadData = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const [srvRes, listRes] = await Promise.all([
          serviceApi.getPublicServiceBySlug(slug),
          serviceApi.getPublicServices(),
        ]);

        if (isMounted) {
          if (srvRes?.success && srvRes?.data?.service) {
            setService(srvRes.data.service);
          } else {
            setNotFound(true);
          }

          if (listRes?.success && Array.isArray(listRes?.data?.services)) {
            setAllServices(listRes.data.services);
          }
        }
      } catch (err) {
        console.error('Failed to load service detail:', err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="sd-page-wrapper" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="asm-spinner asm-spinner--lg"></div>
      </div>
    );
  }

  if (notFound || !service) {
    return <NotFound />;
  }

  const s = service;
  const otherServices = allServices.filter((x) => x.slug !== slug);

  // Icon mapper for services sidebar tabs
  const getServiceIcon = (serviceSlug) => {
    switch (serviceSlug) {
      case 'website-designing-development':
        return <Globe size={16} />;
      case 'ecommerce-website-development':
        return <ShoppingCart size={16} />;
      case 'mobile-app-development':
        return <Smartphone size={16} />;
      case 'custom-software-development':
        return <Code2 size={16} />;
      case 'digital-marketing':
        return <BarChart3 size={16} />;
      case 'branding-graphic-design-services':
        return <Palette size={16} />;
      case 'ai-automation-services':
        return <Bot size={16} />;
      default:
        return <Sparkles size={16} />;
    }
  };

  const getGuaranteeIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck size={28} className="sd-guarantee-icon" />;
      case 'Clock':
        return <Clock size={28} className="sd-guarantee-icon" />;
      case 'Lock':
        return <Lock size={28} className="sd-guarantee-icon" />;
      case 'Award':
        return <Award size={28} className="sd-guarantee-icon" />;
      default:
        return <ShieldCheck size={28} className="sd-guarantee-icon" />;
    }
  };

  const deskPhone = s.deskCard?.phone || company.phone || '';
  const deskEmail = s.deskCard?.email || company.email || '';
  const deskWhatsapp = s.deskCard?.whatsapp || company.whatsapp || '';

  return (
    <>
      <PageBanner
        title={s.title || ''}
        crumbs={[
          { label: 'Services We Provide', to: '/services-we-provide' },
          { label: s.title || '' },
        ]}
      />

      <div className="sd-page-wrapper">
        <div className="container">
          {/* =====================================================
              1. ARCHITECTURE & EXECUTIVE OVERVIEW
              ===================================================== */}
          <section className="sd-overview-section">
            <div className="sd-overview-grid">
              {/* Left Column: Visual Showcase & In-depth Story */}
              <div className="sd-overview-main">
                <div className="sd-hero-media">
                  <img
                    src={s.heroImage || s.galleryImage || s.image || '/images/ber_capabilities_mockup.webp'}
                    alt={s.title || ''}
                    className="sd-hero-img"
                  />
                  <div className="sd-hero-overlay"></div>
                  {s.badge ? (
                    <div className="sd-hero-badge">
                      <Zap size={15} className="sd-hero-badge-icon" />
                      <span>{s.badge}</span>
                    </div>
                  ) : null}
                </div>

                <div className="sd-intro-content">
                  <span className="sd-eyebrow">{s.eyebrow || 'Enterprise Service Overview'}</span>
                  {s.title && <h1 className="sd-title">{s.title}</h1>}
                  {s.tagline && <p className="sd-tagline">{s.tagline}</p>}

                  <div className="sd-text-block">
                    {Array.isArray(s.overview) && s.overview.length > 0 ? (
                      s.overview.map((paragraph, idx) => (
                        <p key={idx} className="sd-desc">
                          {paragraph}
                        </p>
                      ))
                    ) : s.long ? (
                      <p className="sd-desc">{s.long}</p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Right Column: Direct Engineering Desk & Sidebar Tabs */}
              <div className="sd-overview-side">
                {allServices.length > 0 && (
                  <div className="sd-side-tabs-card">
                    <div className="sd-side-tabs-header">
                      <div className="sd-side-tabs-title-wrap">
                        <Sparkles size={16} className="sd-side-tabs-icon" />
                        <span className="sd-side-tabs-title">Explore All Services</span>
                      </div>
                      <span className="sd-side-tabs-badge">{allServices.length} Services</span>
                    </div>

                    <div className="sd-side-tabs-list">
                      {allServices.map((item) => {
                        const isActive = item.slug === slug;
                        return (
                          <Link
                            key={item.slug}
                            to={`/services-we-provide/${item.slug}`}
                            className={`sd-side-tab-btn ${isActive ? 'is-active' : ''}`}
                          >
                            <div className="sd-side-tab-icon">
                              {getServiceIcon(item.slug)}
                            </div>
                            <span className="sd-side-tab-label">{item.title}</span>
                            <ChevronRight size={15} className="sd-side-tab-chevron" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="sd-quick-card">
                  <div className="sd-desk-badge">
                    <span className="sd-pulse-dot"></span>
                    <span>{s.deskCard?.badge || 'Chief Architect On Desk'}</span>
                  </div>

                  <h3 className="sd-quick-title">{s.deskCard?.title || 'Need Technical Scoping?'}</h3>
                  <p className="sd-quick-desc">
                    {s.deskCard?.desc ||
                      'Speak directly with our senior architecture lead to analyze system requirements and get a detailed quote.'}
                  </p>

                  <div className="sd-quick-contacts">
                    {deskPhone && (
                      <a href={`tel:${deskPhone.replace(/\s+/g, '')}`} className="sd-quick-item">
                        <div className="sd-quick-icon">
                          <Phone size={17} />
                        </div>
                        <div>
                          <span className="sd-quick-lbl">Direct Call</span>
                          <strong className="sd-quick-val">{deskPhone}</strong>
                        </div>
                      </a>
                    )}

                    {deskEmail && (
                      <a href={`mailto:${deskEmail}`} className="sd-quick-item">
                        <div className="sd-quick-icon">
                          <Mail size={17} />
                        </div>
                        <div>
                          <span className="sd-quick-lbl">Engineering Mail</span>
                          <strong className="sd-quick-val">{deskEmail}</strong>
                        </div>
                      </a>
                    )}
                  </div>

                  <div className="sd-quick-actions">
                    <button className="sd-btn-consult" onClick={openModal}>
                      <span>Request Free Estimate</span>
                      <ArrowRight size={16} />
                    </button>
                    {deskWhatsapp && (
                      <a
                        href={deskWhatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="sd-btn-wa"
                      >
                        <WhatsAppIcon size={17} color="#25D366" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    )}
                  </div>

                  {/* Trust Micro-Badges */}
                  <div className="sd-quick-trust">
                    <div className="sd-trust-micro">
                      <ShieldCheck size={14} className="sd-trust-micro-icon" />
                      <span>100% NDA Protection</span>
                    </div>
                    <div className="sd-trust-micro">
                      <Clock size={14} className="sd-trust-micro-icon" />
                      <span>24h Rapid Response</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>


        {/* =====================================================
            FEATURE 2: THE PINNED IMAGE SWAP (DELIVERABLES)
            ===================================================== */}
        {s.keyDeliverables?.items && s.keyDeliverables.items.length > 0 && (
          <PinnedImageSwap
            deliverablesData={s.keyDeliverables}
            onInquire={openModal}
          />
        )}

        <div className="container">
          {/* =====================================================
              3. TECHNOLOGIES & TOOLS WE USE
              ===================================================== */}
          {Array.isArray(s.techStack) && s.techStack.length > 0 && (
            <section className="sd-tech-section">
              <div className="sd-section-header">
                {s.techStackHeader?.eyebrow && (
                  <span className="sd-pill-sm">{s.techStackHeader.eyebrow}</span>
                )}
                {s.techStackHeader?.title && (
                  <h2 className="sd-sec-heading">{s.techStackHeader.title}</h2>
                )}
                {s.techStackHeader?.subtitle && (
                  <p className="sd-sec-sub">{s.techStackHeader.subtitle}</p>
                )}
              </div>

              <div className="sd-techs-grid">
                {s.techStack.map((tech, i) => (
                  <div key={i} className="sd-tech-card">
                    <span
                      className="sd-tech-card-dot"
                      style={{ backgroundColor: tech.color || '#1385ac' }}
                    ></span>
                    <span className="sd-tech-card-name">{tech.name || ''}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =====================================================
              4. 4-STEP AGILE DELIVERY PROCESS
              ===================================================== */}
          {Array.isArray(s.process) && s.process.length > 0 && (
            <section className="sd-process-section">
              <div className="sd-section-header">
                {s.processHeader?.eyebrow && (
                  <span className="sd-pill-sm">{s.processHeader.eyebrow}</span>
                )}
                {s.processHeader?.title && (
                  <h2 className="sd-sec-heading">{s.processHeader.title}</h2>
                )}
                {s.processHeader?.subtitle && (
                  <p className="sd-sec-sub">{s.processHeader.subtitle}</p>
                )}
              </div>

              <div className="sd-process-grid">
                {s.process.map((step, idx) => (
                  <div key={idx} className="sd-process-step-card">
                    <div className="sd-process-step-num">{step.step || String(idx + 1).padStart(2, '0')}</div>
                    <h3 className="sd-process-step-title">{step.title || ''}</h3>
                    <p className="sd-process-step-desc">{step.desc || ''}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =====================================================
              5. MEASURABLE BUSINESS OUTCOMES (ROI)
              ===================================================== */}
          {Array.isArray(s.benefits) && s.benefits.length > 0 && (
            <section className="sd-roi-section">
              <div className="sd-section-header">
                {s.benefitsHeader?.eyebrow && (
                  <span className="sd-pill-sm">{s.benefitsHeader.eyebrow}</span>
                )}
                {s.benefitsHeader?.title && (
                  <h2 className="sd-sec-heading">{s.benefitsHeader.title}</h2>
                )}
                {s.benefitsHeader?.subtitle && (
                  <p className="sd-sec-sub">{s.benefitsHeader.subtitle}</p>
                )}
              </div>

              <div className="sd-roi-grid">
                {s.benefits.map((b, i) => (
                  <div key={i} className="sd-roi-card">
                    <div className="sd-roi-val">{b.value || ''}</div>
                    <h4 className="sd-roi-label">{b.label || ''}</h4>
                    <p className="sd-roi-desc">{b.desc || ''}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =====================================================
              6. SERVICE GUARANTEES & TRUST STRIP
              ===================================================== */}
          {Array.isArray(s.guarantees) && s.guarantees.length > 0 && (
            <section className="sd-guarantees-section">
              <div className="sd-guarantees-grid">
                {s.guarantees.map((g, idx) => (
                  <div key={idx} className="sd-guarantee-card">
                    {getGuaranteeIcon(g.icon)}
                    <h4 className="sd-guarantee-title">{g.title || ''}</h4>
                    <p className="sd-guarantee-desc">{g.desc || ''}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =====================================================
              7. EXPLORE OTHER SERVICES
              ===================================================== */}
          {otherServices.length > 0 && (
            <section className="sd-other-section">
              <div className="sd-section-header">
                <span className="sd-pill-sm">Complementary Offerings</span>
                <h2 className="sd-sec-heading">Explore Other BER Services</h2>
                <p className="sd-sec-sub">
                  End-to-end digital solutions designed to scale every facet of your organization.
                </p>
              </div>

              <div className="sd-other-grid">
                {otherServices.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/services-we-provide/${item.slug}`}
                    className="sd-other-card"
                  >
                    <div className="sd-other-card-top">
                      <span className="sd-other-badge">{item.badge || 'Solution'}</span>
                      <ChevronRight size={18} className="sd-other-arrow" />
                    </div>
                    <h4 className="sd-other-title">{item.title || ''}</h4>
                    <p className="sd-other-desc">{item.short || ''}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Direct Consultation Banner */}
          <div className="sd-final-cta-banner">
            <div className="sd-final-cta-text">
              <h3 className="sd-final-cta-title">
                {s.finalCta?.title || 'Ready to architect your solution?'}
              </h3>
              <p className="sd-final-cta-desc">
                {s.finalCta?.desc || 'Book a confidential discovery session with our senior technology team.'}
              </p>
            </div>
            <div className="sd-final-cta-btns">
              <button className="sd-final-btn-primary" onClick={openModal}>
                <span>{s.finalCta?.buttonText || 'Get Free Consultation'}</span>
                <ArrowRight size={18} />
              </button>
              {deskWhatsapp && (
                <a
                  href={deskWhatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="sd-final-btn-secondary"
                >
                  <WhatsAppIcon size={18} color="#25D366" />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <FaqSection title="Frequently Asked Questions" />

      <CtaBand />
    </>
  );
}

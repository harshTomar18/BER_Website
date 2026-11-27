import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  X,
  Monitor,
  Smartphone,
  Quote,
  ShieldCheck,
  TrendingUp,
  Clock,
  Briefcase
} from 'lucide-react';
import PageBanner from '../components/PageBanner';
import FaqSection from '../sections/FaqSection';
import CtaBand from '../sections/CtaBand';
import { useConsult } from '../context/ConsultContext';
import {
  portfolioCategories,
  portfolioStats,
  portfolioProjects
} from '../data/portfolioData';
import './Portfolio.css';

export default function Portfolio() {
  const { openModal } = useConsult();
  const [activeCategory, setActiveCategory] = useState('all');
  const [deviceViews, setDeviceViews] = useState({}); // { [projectId]: 'desktop' | 'mobile' }
  const [activeModalProject, setActiveModalProject] = useState(null);

  // Filter projects by active category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return portfolioProjects;
    return portfolioProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const toggleDeviceView = (projectId, mode) => {
    setDeviceViews((prev) => ({
      ...prev,
      [projectId]: mode
    }));
  };

  const openCaseStudyModal = (project) => {
    setActiveModalProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeCaseStudyModal = () => {
    setActiveModalProject(null);
    document.body.style.overflow = '';
  };

  return (
    <>
      <PageBanner
        title="Portfolio & Case Studies"
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Portfolio & Case Studies' }
        ]}
      />

      <div className="portfolio-page-wrap">
        {/* Atmospheric Ambient Glows */}
        <div className="portfolio-bg-glow portfolio-bg-glow--top"></div>
        <div className="portfolio-bg-glow portfolio-bg-glow--bottom"></div>

        <div className="container portfolio-container">
          {/* Top Header Section */}
          <div className="portfolio-header">
            <div className="portfolio-badge-pill">
              <Sparkles size={14} />
              <span>Proven Commercial Deliveries</span>
            </div>
            <h1 className="portfolio-heading">
              Engineering Digital Solutions That{' '}
              <span className="portfolio-heading-accent">Drive Real Growth</span>
            </h1>
            <p className="portfolio-intro-text">
              Explore our cross-industry portfolio of custom enterprise software, high-conversion eCommerce flagships, mobile applications, and intelligent AI automation systems.
            </p>
          </div>

          {/* Micro-Metrics Bar */}
          <div className="portfolio-stats-bar">
            {portfolioStats.map((stat, i) => (
              <div key={i} className="portfolio-stat-box">
                <div className="portfolio-stat-val">{stat.value}</div>
                <div className="portfolio-stat-lbl">{stat.label}</div>
                <div className="portfolio-stat-sub">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Sticky Category Filter Bar */}
          <div className="portfolio-filter-wrapper">
            <div className="portfolio-filter-bar">
              {portfolioCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`portfolio-filter-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <span className="portfolio-filter-count">{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Bento Showcase Grid */}
          <div className="portfolio-bento-grid">
            {filteredProjects.map((project, index) => {
              const isFlagship = project.featured;
              const currentDevice = deviceViews[project.id] || 'desktop';
              const displayImg =
                currentDevice === 'mobile' && project.mobileImage
                  ? project.mobileImage
                  : project.image;

              return (
                <div
                  key={project.id}
                  className={`portfolio-card ${isFlagship ? 'portfolio-card--flagship' : ''}`}
                >
                  {/* Top Meta Bar */}
                  <div className="portfolio-card-top">
                    <div className="portfolio-card-category-wrap">
                      <span className="portfolio-card-cat-pill">{project.categoryLabel}</span>
                      <span className="portfolio-card-client-pill">{project.industry}</span>
                    </div>

                    {/* Multi-Device Viewport Switcher for Flagships */}
                    {isFlagship && project.mobileImage && (
                      <div className="portfolio-device-toggle">
                        <button
                          type="button"
                          className={`portfolio-dev-btn ${currentDevice === 'desktop' ? 'is-active' : ''}`}
                          onClick={() => toggleDeviceView(project.id, 'desktop')}
                          title="Desktop View"
                        >
                          <Monitor size={14} />
                          <span>Desktop</span>
                        </button>
                        <button
                          type="button"
                          className={`portfolio-dev-btn ${currentDevice === 'mobile' ? 'is-active' : ''}`}
                          onClick={() => toggleDeviceView(project.id, 'mobile')}
                          title="Mobile App View"
                        >
                          <Smartphone size={14} />
                          <span>Mobile</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Visual Artwork / Mockup Window */}
                  <div
                    className={`portfolio-card-media ${
                      currentDevice === 'mobile' ? 'is-mobile-view' : ''
                    }`}
                    onClick={() => openCaseStudyModal(project)}
                  >
                    <div className="portfolio-card-frame">
                      <img
                        src={displayImg}
                        alt={project.title}
                        className="portfolio-card-img"
                        loading="lazy"
                      />
                      <div className="portfolio-card-overlay">
                        <span className="portfolio-card-zoom-pill">
                          <span>Inspect Architecture</span>
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content & Narrative */}
                  <div className="portfolio-card-body">
                    <div className="portfolio-card-client-name">{project.client}</div>
                    <h3
                      className="portfolio-card-title"
                      onClick={() => openCaseStudyModal(project)}
                    >
                      {project.title}
                    </h3>
                    <p className="portfolio-card-tagline">{project.tagline}</p>
                    <p className="portfolio-card-overview">{project.overview}</p>

                    {/* Key Deliverables Highlights */}
                    {Array.isArray(project.deliverables) && project.deliverables.length > 0 && (
                      <div className="portfolio-card-deliverables">
                        {project.deliverables.slice(0, 3).map((del, dIdx) => (
                          <div key={dIdx} className="portfolio-card-del-item">
                            <CheckCircle2 size={13} className="portfolio-card-del-icon" />
                            <span>{del}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack Chips */}
                    {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                      <div className="portfolio-card-tech">
                        {project.techStack.map((tech, tIdx) => (
                          <span key={tIdx} className="portfolio-tech-chip">
                            <span
                              className="portfolio-tech-dot"
                              style={{ backgroundColor: tech.color || '#16a1ce' }}
                            ></span>
                            <span>{tech.name}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* ROI Micro-Metrics Strip */}
                    {Array.isArray(project.metrics) && project.metrics.length > 0 && (
                      <div className="portfolio-card-metrics">
                        {project.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="portfolio-metric-box">
                            <div className="portfolio-metric-val">{m.value}</div>
                            <div className="portfolio-metric-lbl">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="portfolio-card-actions">
                      <button
                        type="button"
                        className="portfolio-btn-primary"
                        onClick={() => openCaseStudyModal(project)}
                      >
                        <span>Deep-Dive Case Study</span>
                        <ArrowRight size={15} />
                      </button>

                      <button
                        type="button"
                        className="portfolio-btn-secondary"
                        onClick={openModal}
                      >
                        <span>Request Architecture</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================
          INTERACTIVE CASE STUDY DEEP-DIVE MODAL
          ===================================================== */}
      {activeModalProject && (
        <div className="portfolio-modal-overlay" onClick={closeCaseStudyModal}>
          <div
            className="portfolio-modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Close Button */}
            <button
              type="button"
              className="portfolio-modal-close"
              onClick={closeCaseStudyModal}
              aria-label="Close Case Study"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="portfolio-modal-header">
              <div className="portfolio-modal-pills">
                <span className="portfolio-modal-pill">{activeModalProject.categoryLabel}</span>
                <span className="portfolio-modal-pill portfolio-modal-pill--ind">
                  {activeModalProject.industry}
                </span>
                <span className="portfolio-modal-client">Client: {activeModalProject.client}</span>
              </div>
              <h2 className="portfolio-modal-title">{activeModalProject.title}</h2>
              <p className="portfolio-modal-tagline">{activeModalProject.tagline}</p>
            </div>

            {/* Modal Media Showcase */}
            <div className="portfolio-modal-media">
              <img
                src={activeModalProject.image}
                alt={activeModalProject.title}
                className="portfolio-modal-img"
              />
            </div>

            {/* Modal Grid: Challenge vs Engineering Solution */}
            <div className="portfolio-modal-comparison">
              <div className="portfolio-modal-comp-box portfolio-modal-comp-box--challenge">
                <div className="portfolio-modal-comp-badge">
                  <Briefcase size={14} />
                  <span>The Commercial Challenge</span>
                </div>
                <p>{activeModalProject.challenge}</p>
              </div>

              <div className="portfolio-modal-comp-box portfolio-modal-comp-box--solution">
                <div className="portfolio-modal-comp-badge">
                  <ShieldCheck size={14} />
                  <span>BER Engineering Solution</span>
                </div>
                <p>{activeModalProject.solution}</p>
              </div>
            </div>

            {/* Key Deliverables & Tech Specs */}
            <div className="portfolio-modal-details-grid">
              {/* Deliverables Checklist */}
              <div className="portfolio-modal-section">
                <h4 className="portfolio-modal-sec-title">What We Architected & Shipped:</h4>
                <ul className="portfolio-modal-del-list">
                  {activeModalProject.deliverables.map((del, idx) => (
                    <li key={idx} className="portfolio-modal-del-item">
                      <CheckCircle2 size={16} className="portfolio-modal-del-check" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies Applied */}
              <div className="portfolio-modal-section">
                <h4 className="portfolio-modal-sec-title">Technology & Infrastructure Stack:</h4>
                <div className="portfolio-modal-tech-grid">
                  {activeModalProject.techStack.map((tech, idx) => (
                    <div key={idx} className="portfolio-modal-tech-card">
                      <span
                        className="portfolio-modal-tech-dot"
                        style={{ backgroundColor: tech.color || '#16a1ce' }}
                      ></span>
                      <span className="portfolio-modal-tech-name">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Measurable ROI Metrics Banner */}
            <div className="portfolio-modal-metrics-banner">
              <div className="portfolio-modal-mb-title">
                <TrendingUp size={18} />
                <span>Verified Commercial Impact & Benchmarks:</span>
              </div>
              <div className="portfolio-modal-mb-grid">
                {activeModalProject.metrics.map((m, idx) => (
                  <div key={idx} className="portfolio-modal-mb-box">
                    <div className="portfolio-modal-mb-val">{m.value}</div>
                    <div className="portfolio-modal-mb-lbl">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Testimonial Quote */}
            {activeModalProject.testimonial && (
              <div className="portfolio-modal-quote-box">
                <Quote size={28} className="portfolio-modal-quote-icon" />
                <p className="portfolio-modal-quote-text">
                  "{activeModalProject.testimonial.quote}"
                </p>
                <div className="portfolio-modal-quote-meta">
                  <strong>{activeModalProject.testimonial.author}</strong>
                  <span> — {activeModalProject.testimonial.role}</span>
                </div>
              </div>
            )}

            {/* Modal Bottom Call To Action */}
            <div className="portfolio-modal-actions">
              <button
                type="button"
                className="portfolio-modal-btn-cta"
                onClick={() => {
                  closeCaseStudyModal();
                  openModal();
                }}
              >
                <span>Architect a Similar Solution for Your Business</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Frequently Asked Questions */}
      <FaqSection title="Frequently Asked Questions About Our Projects & Delivery" />

      {/* Brand High-Conversion CTA Band */}
      <CtaBand />
    </>
  );
}

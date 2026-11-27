import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  X,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  Quote,
  Eye,
  SlidersHorizontal
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProject, setActiveModalProject] = useState(null);

  // Filter projects by active category and search query
  const filteredProjects = useMemo(() => {
    return portfolioProjects.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        (Array.isArray(p.techStack) && p.techStack.some((t) => t.name.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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
        title="Showcase & Case Studies"
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Showcase' }
        ]}
      />

      <div className="portfolio-page-wrap">
        {/* Atmospheric Ambient Glows */}
        <div className="portfolio-bg-glow portfolio-bg-glow--top"></div>
        <div className="portfolio-bg-glow portfolio-bg-glow--bottom"></div>

        <div className="container portfolio-container">
          {/* Top Showcase Hero Section (DigiStreet Signature Header) */}
          <div className="portfolio-header">
            <div className="portfolio-badge-pill">
              <Sparkles size={14} />
              <span>Digital Engineering & Work Showcase</span>
            </div>
            <h1 className="portfolio-heading">
              Client Campaigns, Web Platforms &{' '}
              <span className="portfolio-heading-accent">Digital Solutions Showcase</span>
            </h1>
            <p className="portfolio-intro-text">
              Explore how BER Services powers market-leading enterprises, high-growth eCommerce brands,
              and venture-backed platforms with bespoke technology, sub-second architectures, and measurable commercial results.
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

          {/* Interactive Search & Category Filter Navigation */}
          <div className="portfolio-nav-section">
            {/* Search Input Bar */}
            <div className="portfolio-search-box">
              <Search size={18} className="portfolio-search-icon" />
              <input
                type="text"
                className="portfolio-search-input"
                placeholder="Search by client, industry, or tech stack (e.g. ERP, Next.js, JBM, AI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="portfolio-search-clear"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Category Filter Pills (DigiStreet Signature Tabs) */}
            <div className="portfolio-filter-bar">
              {portfolioCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                // Calculate count dynamically if filtered by search
                const count =
                  cat.id === 'all'
                    ? portfolioProjects.length
                    : portfolioProjects.filter((p) => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`portfolio-filter-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <span className="portfolio-filter-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Cards Counter Bar */}
          <div className="portfolio-results-meta">
            <span className="portfolio-results-text">
              Showing <strong>{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'project' : 'projects'}
              {activeCategory !== 'all' && ` in ${portfolioCategories.find((c) => c.id === activeCategory)?.label}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
            {(activeCategory !== 'all' || searchQuery) && (
              <button
                type="button"
                className="portfolio-reset-btn"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* =====================================================
              SIGNATURE SHOWCASE GRID (DIGISTREET STYLE)
              Uniform 3-Column Grid with Rich Hover Overlays
              ===================================================== */}
          {filteredProjects.length === 0 ? (
            <div className="portfolio-empty-state">
              <div className="portfolio-empty-icon">
                <SlidersHorizontal size={40} />
              </div>
              <h3 className="portfolio-empty-title">No projects match your filter criteria</h3>
              <p className="portfolio-empty-desc">
                Try searching for another keyword or switch category tab to explore our full work showcase.
              </p>
              <button
                type="button"
                className="portfolio-empty-btn"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
              >
                View All Projects
              </button>
            </div>
          ) : (
            <div className="portfolio-showcase-grid">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="portfolio-showcase-card"
                  onClick={() => openCaseStudyModal(project)}
                >
                  {/* Artwork / Showcase Visual Box */}
                  <div className="portfolio-card-artwork">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="portfolio-card-img"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Top Floating Badges */}
                    <div className="portfolio-card-badges">
                      <span className="portfolio-badge-category">
                        {project.categoryLabel}
                      </span>
                      <span className="portfolio-badge-industry">
                        {project.industry}
                      </span>
                    </div>

                    {/* Sleek Hover Glassmorphic Overlay (DigiStreet Signature) */}
                    <div className="portfolio-card-hover-overlay">
                      <div className="portfolio-card-hover-content">
                        <span className="portfolio-hover-pill">
                          <Eye size={15} />
                          <span>View Case Study</span>
                          <ArrowRight size={15} />
                        </span>
                        <p className="portfolio-hover-summary">
                          {project.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Information Body */}
                  <div className="portfolio-card-info">
                    {/* Client Name with Tracked Uppercase Typography */}
                    <div className="portfolio-card-client-brand">
                      {project.client}
                    </div>

                    {/* Project Title */}
                    <h3 className="portfolio-card-title">
                      {project.title}
                    </h3>

                    {/* Brief Tagline */}
                    <p className="portfolio-card-desc">
                      {project.overview}
                    </p>

                    {/* Technology Stack Tags */}
                    {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                      <div className="portfolio-card-tech-chips">
                        {project.techStack.slice(0, 4).map((tech, tIdx) => (
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

                    {/* Bottom Action & Metric Strip */}
                    <div className="portfolio-card-bottom-bar">
                      {Array.isArray(project.metrics) && project.metrics.length > 0 ? (
                        <div className="portfolio-highlight-metric">
                          <span className="portfolio-hm-value">{project.metrics[0].value}</span>
                          <span className="portfolio-hm-label">{project.metrics[0].label}</span>
                        </div>
                      ) : (
                        <div />
                      )}

                      <div className="portfolio-card-link-action">
                        <span>Case Study</span>
                        <span className="portfolio-card-arrow-circle">
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import FaqSection from '../sections/FaqSection';
import CtaBand from '../sections/CtaBand';
import { portfolioCategories, portfolioProjects } from '../data/portfolioData';
import './Portfolio.css';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <>
      <PageBanner
        title="Showcase"
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
          {/* Clean Showcase Heading */}
          <div className="portfolio-header">
            <h1 className="portfolio-heading">
              Work <span className="portfolio-heading-accent">Showcase</span>
            </h1>
          </div>

          {/* Search & Category Filter Navigation */}
          <div className="portfolio-nav-section">
            {/* Search Input Bar */}
            <div className="portfolio-search-box">
              <Search size={18} className="portfolio-search-icon" />
              <input
                type="text"
                className="portfolio-search-input"
                placeholder="Search projects by client, industry, or tech..."
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

            {/* Category Filter Pills */}
            <div className="portfolio-filter-bar">
              {portfolioCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
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

          {/* Results Meta info when filtering */}
          {(activeCategory !== 'all' || searchQuery) && (
            <div className="portfolio-results-meta">
              <span className="portfolio-results-text">
                Showing <strong>{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'project' : 'projects'}
                {activeCategory !== 'all' && ` in ${portfolioCategories.find((c) => c.id === activeCategory)?.label}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
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
            </div>
          )}

          {/* =====================================================
              CLEAN VISUAL-FIRST SHOWCASE GRID
              Pure Artwork, Zero Badges, No Arrows, No Popups
              ===================================================== */}
          {filteredProjects.length === 0 ? (
            <div className="portfolio-empty-state">
              <div className="portfolio-empty-icon">
                <SlidersHorizontal size={36} />
              </div>
              <h3 className="portfolio-empty-title">No projects found</h3>
              <p className="portfolio-empty-desc">
                Try searching for another keyword or switch category to view all projects.
              </p>
              <button
                type="button"
                className="portfolio-empty-btn"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
              >
                View All Work
              </button>
            </div>
          ) : (
            <div className="portfolio-showcase-grid">
              {filteredProjects.map((project) => (
                <div key={project.id} className="portfolio-showcase-card">
                  {/* Clean Artwork Image Box (100% Unobstructed, No overlay, No arrow) */}
                  <div className="portfolio-card-artwork">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="portfolio-card-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Clean Card Information: Client Brand, Category, & Title */}
                  <div className="portfolio-card-info">
                    <div className="portfolio-card-meta-line">
                      <span className="portfolio-card-client-brand">{project.client}</span>
                      <span className="portfolio-card-cat-tag">{project.categoryLabel}</span>
                    </div>

                    <h3 className="portfolio-card-title">
                      {project.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <FaqSection title="Frequently Asked Questions About Our Projects & Delivery" />

      {/* Brand High-Conversion CTA Band */}
      <CtaBand />
    </>
  );
}

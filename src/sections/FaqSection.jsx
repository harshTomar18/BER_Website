import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import { faqApi } from '../api';
import { faqs as defaultStaticFaqs } from '../config/siteConfig';
import { useConsult } from '../context/ConsultContext';
import './FaqSection.css';

export default function FaqSection({
  isLanding = false,
  limit,
  title,
  subtitle,
  badgeText,
  showCategories = true,
  showSearch = false,
  showContactCta = true,
  categoryFilter = null,
  className = '',
}) {
  const { openModal } = useConsult();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0); // first item open by default
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Effective limit: on landing page, strictly 1
  const effectiveLimit = isLanding ? 1 : limit;

  // 1. Fetch dynamic FAQs from Backend API with fallback to static siteConfig
  useEffect(() => {
    let isMounted = true;

    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const params = {};
        if (isLanding) {
          params.landing = true;
          params.limit = 1;
        } else if (effectiveLimit) {
          params.limit = effectiveLimit;
        }

        const res = await faqApi.getPublicFaqs(params);
        if (isMounted && res?.success && Array.isArray(res?.data?.faqs) && res.data.faqs.length > 0) {
          // Normalize API data
          const apiItems = res.data.faqs.map((f, i) => ({
            id: f._id || `faq-${i}`,
            question: f.question,
            answer: f.answer,
            category: f.category || 'General',
            isLandingFeatured: Boolean(f.isLandingFeatured),
            order: f.order ?? i,
          }));

          setFaqs(isLanding ? apiItems.slice(0, 1) : apiItems);
        } else if (isMounted) {
          // Fallback to static siteConfig
          const fallbackItems = defaultStaticFaqs.map((f, i) => ({
            id: `static-${i}`,
            question: f.q,
            answer: f.a,
            category: i === 0 ? 'General' : i === 1 ? 'Process & Timelines' : i === 2 ? 'Support & SLA' : 'Technical & SEO',
            isLandingFeatured: i === 0,
            order: i,
          }));

          setFaqs(isLanding ? fallbackItems.slice(0, 1) : fallbackItems);
        }
      } catch (err) {
        console.warn('Notice: Loading default FAQ dataset due to API unreachable:', err.message);
        if (isMounted) {
          const fallbackItems = defaultStaticFaqs.map((f, i) => ({
            id: `static-${i}`,
            question: f.q,
            answer: f.a,
            category: i === 0 ? 'General' : i === 1 ? 'Process & Timelines' : i === 2 ? 'Support & SLA' : 'Technical & SEO',
            isLandingFeatured: i === 0,
            order: i,
          }));
          setFaqs(isLanding ? fallbackItems.slice(0, 1) : fallbackItems);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(fetchFaqs, 1200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isLanding, effectiveLimit]);

  // Extract unique categories
  const categories = useMemo(() => {
    if (isLanding) return [];
    const set = new Set();
    faqs.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [faqs, isLanding]);

  // Filtered FAQs list
  const displayFaqs = useMemo(() => {
    if (isLanding) {
      // Landing page: strictly return only 1 item
      return faqs.slice(0, 1);
    }

    return faqs.filter((item) => {
      const matchCat =
        selectedCategory === 'ALL' ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [faqs, isLanding, selectedCategory, searchQuery]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  // Structured Data (JSON-LD) for SEO
  const faqSchema = useMemo(() => {
    if (displayFaqs.length === 0) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: displayFaqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
  }, [displayFaqs]);

  return (
    <section className={`faq-sec ${isLanding ? 'faq-sec--landing' : ''} ${className}`}>
      {/* Dynamic Schema Injection for Google SEO */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container faq-sec__container">
        {/* Header Block */}
        <div className="faq-sec__header">
          <div className="faq-sec__badge">
            <Sparkles size={14} className="faq-sec__badge-icon" />
            <span>{badgeText || (isLanding ? 'Quick Answer & Clarity' : 'Knowledge Base & Answers')}</span>
          </div>

          <h2 className="faq-sec__title">
            {title ||
              (isLanding ? (
                <>
                  Frequently Asked <span className="faq-sec__gradient-text">Question</span>
                </>
              ) : (
                <>
                  Frequently Asked <span className="faq-sec__gradient-text">Questions</span>
                </>
              ))}
          </h2>

          <p className="faq-sec__subtitle">
            {subtitle ||
              (isLanding
                ? 'Get immediate clarity on how we engineer scalable digital platforms, deliver projects on time, and build long-term technology partnerships.'
                : 'Clear, transparent answers regarding our custom software engineering, eCommerce architectures, agile delivery timelines, and post-launch support.')}
          </p>
        </div>

        {/* Optional Search Bar (Non-landing) */}
        {!isLanding && showSearch && (
          <div className="faq-sec__search-wrap">
            <div className="faq-sec__search-box">
              <Search size={18} className="faq-sec__search-icon" />
              <input
                type="text"
                placeholder="Search any question or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="faq-sec__search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="faq-sec__search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Optional Category Pills (Non-landing & when > 1 category exists) */}
        {!isLanding && showCategories && categories.length > 2 && (
          <div className="faq-sec__categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`faq-sec__cat-btn ${selectedCategory === cat ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'ALL' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Accordion Container */}
        <div className={`faq-sec__accordion ${isLanding ? 'faq-sec__accordion--landing' : ''}`}>
          {loading ? (
            <div className="faq-sec__loading">
              <div className="faq-sec__spinner" />
              <span>Loading questions...</span>
            </div>
          ) : displayFaqs.length === 0 ? (
            <div className="faq-sec__empty">
              <HelpCircle size={36} className="faq-sec__empty-icon" />
              <p>No questions matched your search criteria.</p>
              <button
                type="button"
                className="faq-sec__reset-btn"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            displayFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={faq.id || idx}
                  className={`faq-sec__item ${isOpen ? 'is-open' : ''} ${isLanding ? 'faq-sec__item--landing' : ''
                    }`}
                >
                  <button
                    type="button"
                    className="faq-sec__question-btn"
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
                  >
                    <div className="faq-sec__q-left">
                      <span className="faq-sec__index">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="faq-sec__question-text">{faq.question}</h3>
                    </div>

                    <div className="faq-sec__toggle-icon-box">
                      <ChevronDown
                        size={20}
                        className={`faq-sec__chevron ${isOpen ? 'is-rotated' : ''}`}
                      />
                    </div>
                  </button>

                  <div
                    className="faq-sec__answer-wrapper"
                    style={{
                      maxHeight: isOpen ? '600px' : '0px',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="faq-sec__answer-content">
                      <p>{faq.answer}</p>

                      {/* {isLanding && (
                        <div className="faq-sec__landing-footer">


                          <Link to="/faq" className="faq-sec__view-all-link">
                            <span>Explore all questions</span>
                            <ArrowRight size={15} />
                          </Link>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Landing Page Action Strip (Show link to full FAQ page) */}
        {isLanding && (
          <div className="faq-sec__landing-more">
            <span className="faq-sec__landing-more-text">
              Looking for answers about pricing, maintenance contracts, or technology stack options?
            </span>
            <Link to="/faq" className="faq-sec__landing-more-btn">
              <span>View All Frequently Asked Questions</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Optional Interactive Contact CTA Strip (Non-landing) */}
        {!isLanding && showContactCta && (
          <div className="faq-sec__cta-banner">
            <div className="faq-sec__cta-info">
              <div className="faq-sec__cta-icon-box">
                <MessageSquare size={24} />
              </div>
              <div>
                <h4 className="faq-sec__cta-title">Still have questions regarding your project?</h4>
                <p className="faq-sec__cta-desc">
                  Our solution architects provide complimentary discovery calls to discuss your requirements, tech stacks, and delivery timelines.
                </p>
              </div>
            </div>

            <div className="faq-sec__cta-actions">
              <button
                type="button"
                className="faq-sec__cta-btn-primary"
                onClick={openModal}
              >
                <span>Get Free Consultation</span>
                <ArrowRight size={16} />
              </button>
              <Link to="/contact-us" className="faq-sec__cta-btn-secondary">
                Contact Team
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

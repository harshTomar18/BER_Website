import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Bookmark,
  Sparkles,
  Link2,
  Phone,
  ChevronRight
} from 'lucide-react';
import { blogApi } from '../api';
import NotFound from './NotFound';
import './NewsDetail.css';

export default function NewsDetail() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [navigation, setNavigation] = useState({ prev: null, next: null });
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // 1. Fetch Article, Categories, and Tags dynamically from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [blogRes, catRes, blogsListRes] = await Promise.all([
          blogApi.getPublicBlogBySlug(slug),
          blogApi.getPublicCategories(),
          blogApi.getPublicBlogs({ limit: 12 }),
        ]);

        if (blogRes?.success && blogRes?.data?.blog) {
          setBlog(blogRes.data.blog);
          setRelatedArticles(blogRes.data.relatedArticles || []);
          if (blogRes.data.navigation) setNavigation(blogRes.data.navigation);
        } else {
          setBlog(null);
        }

        if (catRes?.success && catRes?.data?.categories) {
          setCategories(catRes.data.categories);
        }

        if (blogsListRes?.success && blogsListRes?.data?.blogs) {
          const tagsSet = new Set();
          blogsListRes.data.blogs.forEach((b) => {
            if (Array.isArray(b.tags)) {
              b.tags.forEach((t) => tagsSet.add(t));
            }
          });
          setAllTags(Array.from(tagsSet).slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching blog detail data:', err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // 2. Dynamic SEO Metadata & JSON-LD Schema Markup
  useEffect(() => {
    if (!blog) return;

    // Document Title
    const pageTitle = blog.seo?.metaTitle || `${blog.title} | BER Services`;
    document.title = pageTitle;

    // Helper to dynamically set or update meta tags
    const setMetaTag = (attrName, attrVal, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('name', 'description', blog.seo?.metaDescription || blog.excerpt || '');
    setMetaTag(
      'name',
      'keywords',
      (blog.seo?.secondaryKeywords || []).concat(blog.seo?.focusKeyword || '').filter(Boolean).join(', ')
    );
    setMetaTag('name', 'robots', blog.seo?.robots || 'index, follow');
    setMetaTag('property', 'og:title', blog.seo?.ogTitle || blog.title);
    setMetaTag('property', 'og:description', blog.seo?.ogDescription || blog.excerpt || '');
    setMetaTag('property', 'og:image', blog.seo?.ogImage || blog.featuredImage || '');
    setMetaTag('property', 'og:type', 'article');
    setMetaTag('property', 'og:url', window.location.href);

    // Canonical link
    if (blog.seo?.canonicalUrl) {
      let canonicalEl = document.querySelector('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute('href', blog.seo.canonicalUrl);
    }

    // Dynamic JSON-LD Schema Markup
    const schemaScriptId = 'blog-schema-jsonld';
    let scriptEl = document.getElementById(schemaScriptId);
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = schemaScriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': blog.seo?.schemaType || 'BlogPosting',
          '@id': window.location.href,
          headline: blog.title,
          description: blog.seo?.metaDescription || blog.excerpt || '',
          image: blog.featuredImage || undefined,
          datePublished: blog.publishedAt || blog.createdAt,
          dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
          author: {
            '@type': 'Person',
            name: blog.author?.name || '',
            jobTitle: blog.author?.designation || undefined,
          },
          publisher: {
            '@type': 'Organization',
            name: 'BER SERVICES PVT. LTD.',
            url: 'https://thebermedia.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://thebermedia.com/favicon.ico',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': window.location.href,
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://thebermedia.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'News and Articles',
              item: 'https://thebermedia.com/news-and-article',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: blog.category,
              item: `https://thebermedia.com/news-and-article?category=${encodeURIComponent(blog.category)}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: blog.title,
              item: window.location.href,
            },
          ],
        },
      ],
    };

    scriptEl.textContent = JSON.stringify(schemaData);

    return () => {
      const existingScript = document.getElementById(schemaScriptId);
      if (existingScript) existingScript.remove();
    };
  }, [blog]);

  // 3. Dynamic Table of Contents (TOC) & Anchor-injected headings
  const { tocItems, processedContent } = useMemo(() => {
    if (!blog?.content) return { tocItems: [], processedContent: '' };

    const items = [];
    let headingIndex = 0;

    const htmlWithIds = blog.content.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, text) => {
      headingIndex++;
      const plainText = text.replace(/<[^>]*>/g, '').trim();
      const slugId = `section-${headingIndex}-${plainText.toLowerCase().replace(/[\s\W-]+/g, '-')}`;

      items.push({
        id: slugId,
        text: plainText,
        level: tag.toLowerCase(),
      });

      return `<${tag}${attrs} id="${slugId}">${text}</${tag}>`;
    });

    return { tocItems: items, processedContent: htmlWithIds };
  }, [blog?.content]);

  // Copy Link action
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="bdt-loading">
        <div className="bdt-spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return <NotFound />;
  }

  const publishedDateStr = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="bdt-page">
      {/* =========================================================
          TOP NAV BAR: Back Link (Left) & Category Pill (Right)
          Matches media_1795591721796_1339df56.jpg
          ========================================================= */}
      <header className="bdt-top-nav-bar">
        <div className="container bdt-container bdt-top-nav-inner">
          <Link to="/news-and-article" className="bdt-back-link">
            <ArrowLeft size={16} />
            <span>Back to All Articles</span>
          </Link>
          {blog.category && (
            <Link
              to={`/news-and-article?category=${encodeURIComponent(blog.category)}`}
              className="bdt-top-cat-pill"
            >
              {blog.category}
            </Link>
          )}
        </div>
      </header>

      {/* =========================================================
          MAIN TWO-COLUMN LAYOUT
          Left Column: Main Title, Excerpt, Author, Image, Content, Tags, Bottom CTA
          Right Column: Sticky Dark CTA Card, Categories Widget, Tags/Locations
          ========================================================= */}
      <main className="bdt-main-section">
        <div className="container bdt-container bdt-main-grid">

          {/* ----------------- LEFT / MAIN COLUMN ----------------- */}
          <article className="bdt-article-column">
            {/* Main Article Title (H1) */}
            <h1 className="bdt-article-h1">{blog.title}</h1>

            {/* Subtitle / Excerpt */}
            {blog.excerpt && <p className="bdt-article-subtitle">{blog.excerpt}</p>}

            {/* Author & Meta Row */}
            <div className="bdt-author-meta-row">
              <div className="bdt-author-left">
                {blog.author?.image ? (
                  <img src={blog.author.image} alt={blog.author.name} className="bdt-author-img" />
                ) : (
                  <div className="bdt-author-avatar-fallback">
                    {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                )}
                <div className="bdt-author-details">
                  <span className="bdt-author-name">{blog.author?.name || ''}</span>
                  {blog.author?.designation && (
                    <span className="bdt-author-desig">{blog.author.designation}</span>
                  )}
                </div>
              </div>

              <div className="bdt-meta-right">
                {publishedDateStr && (
                  <span className="bdt-meta-item">
                    <Calendar size={14} />
                    <span>{publishedDateStr}</span>
                  </span>
                )}
                {blog.readingTime && (
                  <span className="bdt-meta-item">
                    <Clock size={14} />
                    <span>{blog.readingTime} min read</span>
                  </span>
                )}
              </div>
            </div>

            {/* Hero Featured Image */}
            {blog.featuredImage && (
              <div className="bdt-hero-image-wrap">
                <img
                  src={blog.featuredImage}
                  alt={blog.featuredImageAlt || blog.title}
                  className="bdt-hero-image"
                />
                {blog.featuredImageAlt && (
                  <span className="bdt-image-caption">{blog.featuredImageAlt}</span>
                )}
              </div>
            )}

            {/* In-Article Table of Contents (if 3+ headings) */}
            {tocItems.length > 2 && (
              <div className="bdt-inpage-toc">
                <span className="bdt-toc-heading">Table of Contents</span>
                <nav className="bdt-toc-nav">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`bdt-toc-link bdt-toc-link--${item.level}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Rich Article Body Content */}
            <div
              className="bdt-content-body"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* =====================================================
                TAGS ROW (Matches media_1795591737439_5186837a.jpg)
                ===================================================== */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="bdt-tags-row">
                <span className="bdt-tags-label">TAGS:</span>
                <div className="bdt-tags-list">
                  {blog.tags.map((tag, idx) => (
                    <Link
                      key={idx}
                      to={`/news-and-article?search=${encodeURIComponent(tag)}`}
                      className="bdt-tag-badge"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* =====================================================
                BOTTOM WIDE CTA BANNER
                Matches media_1795591737439_5186837a.jpg
                ===================================================== */}
            {blog.cta?.enabled && (
              <div className="bdt-bottom-banner-cta">
                <div className="bdt-bottom-banner-left">
                  {blog.cta.badge && (
                    <span className="bdt-bottom-banner-badge">{blog.cta.badge}</span>
                  )}
                  <h3 className="bdt-bottom-banner-title">{blog.cta.heading}</h3>
                  {blog.cta.description && (
                    <p className="bdt-bottom-banner-desc">{blog.cta.description}</p>
                  )}
                </div>

                <div className="bdt-bottom-banner-actions">
                  {blog.cta.phone && (
                    <a
                      href={`tel:${blog.cta.phone.replace(/[\s-]/g, '')}`}
                      className="bdt-btn-white-phone"
                    >
                      <Phone size={15} />
                      <span>Call {blog.cta.phone}</span>
                    </a>
                  )}
                  {blog.cta.buttonUrl && blog.cta.buttonText && (
                    <Link to={blog.cta.buttonUrl} className="bdt-btn-translucent">
                      <span>{blog.cta.buttonText}</span>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Contextual Internal Links Section */}
            {blog.internalLinks && blog.internalLinks.length > 0 && (
              <div className="bdt-context-links-card">
                <div className="bdt-context-links-header">
                  <Link2 size={18} />
                  <h4>Related Capabilities & Architecture Hubs</h4>
                </div>
                <div className="bdt-context-links-grid">
                  {blog.internalLinks.map((link, idx) => (
                    <Link key={idx} to={link.targetUrl} className="bdt-context-link-item">
                      <div className="bdt-context-link-top">
                        <span>{link.anchorText}</span>
                        <ArrowRight size={14} />
                      </div>
                      {link.description && (
                        <p className="bdt-context-link-desc">{link.description}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio Card (E-E-A-T) */}
            {blog.author?.name && (
              <div className="bdt-author-bio-box">
                {blog.author.image ? (
                  <img src={blog.author.image} alt={blog.author.name} className="bdt-bio-avatar-img" />
                ) : (
                  <div className="bdt-bio-avatar-init">
                    {blog.author.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="bdt-bio-info">
                  <span className="bdt-bio-role">Article Author</span>
                  <h4 className="bdt-bio-name">{blog.author.name}</h4>
                  {blog.author.designation && (
                    <span className="bdt-bio-desig">{blog.author.designation}</span>
                  )}
                  {blog.author.bio && <p className="bdt-bio-p">{blog.author.bio}</p>}
                </div>
              </div>
            )}

            {/* Social Share Bar */}
            <div className="bdt-share-footer">
              <span className="bdt-share-text">Share this article:</span>
              <div className="bdt-share-buttons">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bdt-share-btn"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bdt-share-btn"
                >
                  Facebook
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${blog.title} - ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bdt-share-btn"
                >
                  WhatsApp
                </a>
                <button
                  type="button"
                  className="bdt-share-btn bdt-share-btn--copy"
                  onClick={handleCopyLink}
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Previous / Next Article Navigation */}
            {(navigation.prev || navigation.next) && (
              <div className="bdt-prev-next-nav">
                {navigation.prev ? (
                  <Link
                    to={`/news-and-article/${navigation.prev.slug}`}
                    className="bdt-nav-card bdt-nav-card--prev"
                  >
                    <ArrowLeft size={16} />
                    <div>
                      <span className="bdt-nav-eyebrow">Previous Article</span>
                      <strong className="bdt-nav-h">{navigation.prev.title}</strong>
                    </div>
                  </Link>
                ) : (
                  <div></div>
                )}

                {navigation.next && (
                  <Link
                    to={`/news-and-article/${navigation.next.slug}`}
                    className="bdt-nav-card bdt-nav-card--next"
                  >
                    <div style={{ textAlign: 'right' }}>
                      <span className="bdt-nav-eyebrow">Next Article</span>
                      <strong className="bdt-nav-h">{navigation.next.title}</strong>
                    </div>
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            )}
          </article>

          {/* ----------------- RIGHT STICKY SIDEBAR ----------------- */}
          <aside className="bdt-sidebar-column">
            {/* WIDGET 1: DARK LEAD CTA CARD (Matches media_1795591721796_1339df56.jpg) */}
            {blog.cta?.enabled && (
              <div className="bdt-sidebar-dark-cta">
                {blog.cta.badge && (
                  <div className="bdt-dark-cta-badge">
                    <ShieldCheck size={13} />
                    <span>{blog.cta.badge}</span>
                  </div>
                )}
                <h3 className="bdt-dark-cta-title">{blog.cta.heading}</h3>
                {blog.cta.description && (
                  <p className="bdt-dark-cta-desc">{blog.cta.description}</p>
                )}

                {/* Bullet Points with Checkmarks */}
                {blog.cta.bulletPoints && blog.cta.bulletPoints.length > 0 && (
                  <ul className="bdt-dark-cta-bullets">
                    {blog.cta.bulletPoints.map((point, i) => (
                      <li key={i} className="bdt-dark-cta-bullet">
                        <span className="bdt-bullet-check">
                          <Check size={12} />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Primary Button */}
                {blog.cta.buttonUrl && blog.cta.buttonText && (
                  <Link to={blog.cta.buttonUrl} className="bdt-dark-cta-button">
                    <Phone size={15} />
                    <span>{blog.cta.buttonText}</span>
                  </Link>
                )}

                {/* 24/7 Hotline Bar */}
                {blog.cta.phone && (
                  <a
                    href={`tel:${blog.cta.phone.replace(/[\s-]/g, '')}`}
                    className="bdt-dark-cta-hotline"
                  >
                    <Phone size={14} />
                    <span>24/7 Hotline: {blog.cta.phone}</span>
                  </a>
                )}
              </div>
            )}

            {/* WIDGET 2: CATEGORIES (Matches media_1795591721796_1339df56.jpg) */}
            <div className="bdt-sidebar-card">
              <div className="bdt-sidebar-card-header">
                <Bookmark size={16} className="bdt-card-icon" />
                <h4 className="bdt-sidebar-card-title">Categories</h4>
              </div>
              <div className="bdt-sidebar-cat-list">
                {categories.map((c) => (
                  <Link
                    key={c._id || c.name}
                    to={`/news-and-article?category=${encodeURIComponent(c.name)}`}
                    className={`bdt-sidebar-cat-item ${blog.category === c.name ? 'is-active' : ''}`}
                  >
                    <span className="bdt-sidebar-cat-name">
                      <ChevronRight size={13} className="bdt-cat-chevron" />
                      <span>{c.name}</span>
                    </span>
                    <span className="bdt-sidebar-cat-count">{c.articleCount ?? 0}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* WIDGET 3: DOMAINS / LOCATIONS (Matches media_1795591737439_5186837a.jpg) */}
            {allTags.length > 0 && (
              <div className="bdt-sidebar-card">
                <div className="bdt-sidebar-card-header">
                  <Sparkles size={16} className="bdt-card-icon" />
                  <h4 className="bdt-sidebar-card-title">Explore by Domain</h4>
                </div>
                <div className="bdt-sidebar-tag-cloud">
                  {allTags.map((tag, idx) => (
                    <Link
                      key={idx}
                      to={`/news-and-article?search=${encodeURIComponent(tag)}`}
                      className="bdt-sidebar-tag-pill"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Sticky Table of Contents on Desktop */}
            {tocItems.length > 2 && (
              <div className="bdt-sidebar-card bdt-sidebar-toc">
                <span className="bdt-sidebar-toc-title">On this page</span>
                <nav className="bdt-sidebar-toc-nav">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`bdt-sidebar-toc-link bdt-sidebar-toc-link--${item.level}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </aside>

        </div>
      </main>

      {/* =========================================================
          CONTINUE READING / RELATED ARTICLES ENGINE
          ========================================================= */}
      {relatedArticles.length > 0 && (
        <section className="bdt-related-section">
          <div className="container bdt-container">
            <div className="bdt-related-top">
              <span className="bdt-related-eyebrow">Discover Related Insights</span>
              <h2 className="bdt-related-title">Continue Reading</h2>
            </div>

            <div className="bdt-related-grid">
              {relatedArticles.map((rel) => (
                <article key={rel._id || rel.slug} className="bdt-related-card">
                  {rel.featuredImage && (
                    <Link
                      to={`/news-and-article/${rel.slug}`}
                      className="bdt-related-img-wrap"
                    >
                      <img src={rel.featuredImage} alt={rel.title} loading="lazy" />
                    </Link>
                  )}
                  <div className="bdt-related-body">
                    <span className="bdt-cat-badge">{rel.category}</span>
                    <h3 className="bdt-related-card-title">
                      <Link to={`/news-and-article/${rel.slug}`}>{rel.title}</Link>
                    </h3>
                    <Link
                      to={`/news-and-article/${rel.slug}`}
                      className="bdt-related-read-more"
                    >
                      <span>Read Article</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
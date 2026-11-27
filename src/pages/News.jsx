import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Inbox,
  User,
  Mail,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import PageBanner from '../components/PageBanner';
import FaqSection from '../sections/FaqSection';
import { blogApi } from '../api';
import './News.css';

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'ALL';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [blogs, setBlogs] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [topArticles, setTopArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 4, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(currentSearch);

  // Fetch Articles for Grid and Sidebar dynamically
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const [filteredRes, recentRes, catRes] = await Promise.all([
          blogApi.getPublicBlogs({
            category: currentCategory,
            search: currentSearch,
            page: currentPage,
            limit: 4,
          }),
          blogApi.getPublicBlogs({ limit: 5 }),
          blogApi.getPublicCategories(),
        ]);

        if (filteredRes?.success && filteredRes?.data) {
          setBlogs(filteredRes.data.blogs || []);
          if (filteredRes.data.pagination) {
            setPagination(filteredRes.data.pagination);
          }
        }

        if (recentRes?.success && recentRes?.data?.blogs) {
          setRecentPosts(recentRes.data.blogs.slice(0, 5));
          // Use articles with images for the "Top Article" widget
          const withImages = recentRes.data.blogs.filter((b) => Boolean(b.featuredImage));
          setTopArticles(withImages.slice(0, 3));
        }

        if (catRes?.success && catRes?.data?.categories) {
          setCategories(catRes.data.categories);
        } else if (filteredRes?.data?.categories) {
          setCategories(filteredRes.data.categories);
        }
      } catch (err) {
        console.error('Failed to load published blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentCategory, currentSearch, currentPage]);

  // Search Submit Handler
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      nextParams.set('search', searchQuery.trim());
    } else {
      nextParams.delete('search');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  // Category Filter Click Handler
  const handleCategoryClick = (catName) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catName === 'ALL' || catName === currentCategory) {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catName);
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Pagination Page Change Handler
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages || newPage === pagination.page) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    setSearchParams(nextParams);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div className="nws-page">
      <PageBanner
        title="News and Articles"
        crumbs={[{ label: 'News and Articles' }]}
      />

      <section className="nws-section">
        <div className="container nws-container">

          {/* =========================================================
              TOP CONTROLS BAR: Article count (Left) & Search Bar (Right)
              Matches media_1795594700485_7f1717f4.jpg
              ========================================================= */}
          <div className="nws-top-bar">
            <div className="nws-count-indicator">
              <span className="nws-count-number">{pagination.total || blogs.length}</span>
              <span> articles</span>
              {currentCategory !== 'ALL' && (
                <span className="nws-active-filter-badge">
                  Filtered by: <strong>{currentCategory}</strong>
                  <button
                    type="button"
                    className="nws-filter-clear-btn"
                    onClick={() => handleCategoryClick('ALL')}
                    title="Clear filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {currentSearch && (
                <span className="nws-active-filter-badge">
                  Query: "<strong>{currentSearch}</strong>"
                  <button
                    type="button"
                    className="nws-filter-clear-btn"
                    onClick={() => {
                      setSearchQuery('');
                      const next = new URLSearchParams(searchParams);
                      next.delete('search');
                      next.set('page', '1');
                      setSearchParams(next);
                    }}
                    title="Clear search"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            <form className="nws-search-bar" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="nws-search-input"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="nws-search-btn">
                Search
              </button>
            </form>
          </div>

          {/* =========================================================
              MAIN TWO-COLUMN LAYOUT
              Left Column: 2-Card Articles Grid + Pagination
              Right Column: Recent Posts, Categories, Top Articles, Help CTA
              ========================================================= */}
          <div className="nws-layout-grid">

            {/* ----------------- LEFT MAIN CONTENT ----------------- */}
            <main className="nws-main-col">
              {loading ? (
                <div className="nws-loading">
                  <div className="nws-spinner"></div>
                  <p>Loading articles...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="nws-empty">
                  <Inbox size={48} className="nws-empty-icon" />
                  <h3>No Articles Found</h3>
                  <p>
                    No articles match your selected topic or keyword query.
                  </p>
                  {(currentCategory !== 'ALL' || currentSearch) && (
                    <button
                      type="button"
                      className="nws-btn-reset-filters"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchParams({});
                      }}
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* 2-Card Grid matching Screenshot 1 & 2 */}
                  <div className="nws-cards-grid">
                    {blogs.map((article) => {
                      return (
                        <article key={article._id || article.slug} className="nws-article-card">
                          {/* Featured Image */}
                          {article.featuredImage && (
                            <Link
                              to={`/news-and-article/${article.slug}`}
                              className="nws-card-img-link"
                            >
                              <img
                                src={article.featuredImage}
                                alt={article.featuredImageAlt || article.title}
                                className="nws-card-img"
                                loading="lazy"
                              />
                            </Link>
                          )}

                          <div className="nws-card-body">
                            {/* Category Underlined Label */}
                            {article.category && (
                              <div className="nws-card-cat-wrap">
                                <Link
                                  to={`/news-and-article?category=${encodeURIComponent(article.category)}`}
                                  className="nws-card-category"
                                >
                                  {article.category.toUpperCase()}
                                </Link>
                              </div>
                            )}

                            {/* Main Card Title */}
                            <h3 className="nws-card-title">
                              <Link to={`/news-and-article/${article.slug}`}>
                                {article.title}
                              </Link>
                            </h3>

                            {/* Author & Meta Row */}
                            <div className="nws-card-meta">
                              {article.author?.name ? (
                                <span>by {article.author.name}</span>
                              ) : null}
                              {article.readingTime ? (
                                <>
                                  {article.author?.name && <span className="nws-card-meta-dot">•</span>}
                                  <span>{article.readingTime} min read</span>
                                </>
                              ) : null}
                            </div>

                            {/* Excerpt */}
                            {article.excerpt && (
                              <p className="nws-card-excerpt">
                                {article.excerpt}
                              </p>
                            )}

                            {/* Read More Pill Button */}
                            <div className="nws-card-btn-wrap">
                              <Link
                                to={`/news-and-article/${article.slug}`}
                                className="nws-btn-read-more"
                              >
                                READ MORE
                              </Link>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {/* Pagination Bar matching Screenshot 2 */}
                  {pagination.pages > 1 && (
                    <div className="nws-pagination-row">
                      {/* Previous Page Button */}
                      <button
                        type="button"
                        className="nws-pagi-btn nws-pagi-prev"
                        disabled={pagination.page <= 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                      >
                        ← Previous
                      </button>

                      {/* Numbered Page Buttons */}
                      <div className="nws-pagi-numbers">
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => {
                          const isActive = p === pagination.page;
                          return (
                            <button
                              key={p}
                              type="button"
                              className={`nws-pagi-btn nws-pagi-num ${isActive ? 'is-active' : ''}`}
                              onClick={() => handlePageChange(p)}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next Page Button */}
                      <button
                        type="button"
                        className="nws-pagi-btn nws-pagi-next"
                        disabled={pagination.page >= pagination.pages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>

            {/* ----------------- RIGHT SIDEBAR ----------------- */}
            <aside className="nws-sidebar-col">

              {/* 1. RECENT POSTS WIDGET */}
              {recentPosts.length > 0 && (
                <div className="nws-widget-box">
                  <h4 className="nws-widget-heading">Recent Posts</h4>
                  <ul className="nws-recent-list">
                    {recentPosts.map((post) => (
                      <li key={post._id || post.slug} className="nws-recent-item">
                        <Link
                          to={`/news-and-article/${post.slug}`}
                          className="nws-recent-link"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 2. CATEGORIES WIDGET (With article counts) */}
              {categories.length > 0 && (
                <div className="nws-widget-box">
                  <h4 className="nws-widget-heading">Categories</h4>
                  <ul className="nws-categories-list">
                    <li className="nws-cat-item">
                      <button
                        type="button"
                        className={`nws-cat-filter-btn ${currentCategory === 'ALL' ? 'is-active' : ''}`}
                        onClick={() => handleCategoryClick('ALL')}
                      >
                        <span className="nws-bullet-dot">•</span>
                        <span className="nws-cat-btn-name">All Topics</span>
                        <span className="nws-cat-btn-count">({pagination.total || blogs.length})</span>
                      </button>
                    </li>

                    {categories.map((c) => {
                      const isActive = currentCategory === c.name;
                      const count = c.articleCount !== undefined ? c.articleCount : (c.count ?? 0);
                      return (
                        <li key={c._id || c.name} className="nws-cat-item">
                          <button
                            type="button"
                            className={`nws-cat-filter-btn ${isActive ? 'is-active' : ''}`}
                            onClick={() => handleCategoryClick(c.name)}
                          >
                            <span className="nws-bullet-dot">•</span>
                            <span className="nws-cat-btn-name">{c.name}</span>
                            <span className="nws-cat-btn-count">({count})</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* 3. TOP ARTICLE WIDGET (Compact Cards with thumbnails) */}
              {topArticles.length > 0 && (
                <div className="nws-widget-box">
                  <h4 className="nws-widget-heading">Top Article</h4>
                  <div className="nws-top-articles-list">
                    {topArticles.map((top) => (
                      <Link
                        key={top._id || top.slug}
                        to={`/news-and-article/${top.slug}`}
                        className="nws-top-article-card"
                      >
                        {top.featuredImage && (
                          <div className="nws-top-article-thumb-wrap">
                            <img
                              src={top.featuredImage}
                              alt={top.title}
                              className="nws-top-article-thumb"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="nws-top-article-info">
                          {top.category ? (
                            <span className="nws-top-article-cat">
                              {top.category.toUpperCase()}
                            </span>
                          ) : null}
                          <h5 className="nws-top-article-title">{top.title}</h5>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. NEED HELP SUPPORT BOX (Matches Screenshot 2) */}
              <div className="nws-help-box">
                <h4 className="nws-help-title">Need Help Finding Solutions?</h4>
                <p className="nws-help-subtitle">Speak to our Technical Advisory Team</p>
                <a
                  href="mailto:info@thebermedia.com"
                  className="nws-help-btn"
                >
                  info@thebermedia.com
                </a>
              </div>

            </aside>

          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <FaqSection title="Knowledge & Insights FAQ" />
    </div>
  );
}
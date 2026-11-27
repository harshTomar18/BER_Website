import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Code, Users, Zap, Star } from 'lucide-react';
import Ber3DArtwork from '../components/Ber3DArtwork';
import { useConsult } from '../context/ConsultContext';
import { aboutApi } from '../api';
import './AboutSection.css';

/**
 * AboutSection - Fully dynamic from MongoDB via aboutApi.getPublicAbout()
 * Features:
 * - Clean, premium white & soft-blue atmospheric background
 * - Deep navy typography with electric-blue highlights
 * - Interactive 3D Neo-Glass Tech Orbit Centerpiece OR Custom Admin Uploaded Artwork
 * - High-converting pill CTA buttons
 * - Horizontal glass statistics strip with custom blue icon tiles
 * - ZERO hardcoded fallbacks: strictly '' or null fallback
 */
export default function AboutSection() {
  const { openModal } = useConsult();
  const navigate = useNavigate();
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Dynamic About Overview Configuration from Database
  useEffect(() => {
    let isMounted = true;
    const fetchAboutData = async () => {
      try {
        const res = await aboutApi.getPublicAbout();
        if (isMounted && res?.success && res?.data?.about) {
          setAboutData(res.data.about);
        } else if (isMounted) {
          setAboutData(null);
        }
      } catch (err) {
        console.error('Failed to load about section from API:', err);
        if (isMounted) setAboutData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(fetchAboutData, 600);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleVisionClick = () => {
    navigate('/about-us');
  };

  // Helper to render matching soft-blue icon for each stat
  const renderStatIcon = (iconType) => {
    switch (iconType) {
      case 'code':
        return <Code size={20} strokeWidth={2.5} />;
      case 'clients':
        return <Users size={20} strokeWidth={2.4} />;
      case 'uptime':
        return <Zap size={20} strokeWidth={2.4} fill="currentColor" />;
      case 'satisfaction':
        return <Star size={20} strokeWidth={2.4} fill="currentColor" />;
      default:
        return <Code size={20} strokeWidth={2.5} />;
    }
  };

  const overview = aboutData?.overview || {};

  return (
    <section className="section ab-section" id="about-section">
      {/* Soft atmospheric blue ambient wave background */}
      <div className="ab-bg-glow ab-bg-glow--top"></div>
      <div className="ab-bg-glow ab-bg-glow--right"></div>
      <div className="ab-bg-wave"></div>

      <div className="container ab-container">
        {/* Top Section: Left Content + Right 3D Centerpiece / Uploaded Artwork */}
        <div className="ab-grid">
          {/* Left Column: Heading, Description & CTAs */}
          <div className="ab-content">
            {/* Pill-shaped Badge */}
            {overview.pill ? (
              <div className="ab-badge">
                <span className="ab-badge-dot"></span>
                <span>{overview.pill}</span>
              </div>
            ) : null}

            {/* Main Heading */}
            {(overview.headline?.line1 || overview.headline?.line2 || overview.headline?.accent) && (
              <h2 className="ab-title">
                {overview.headline?.line1 || ''}{' '}
                {overview.headline?.line2 ? (
                  <span className="ab-title-block">{overview.headline.line2}</span>
                ) : null}{' '}
                {overview.headline?.accent ? (
                  <span className="ab-title-accent">{overview.headline.accent}</span>
                ) : null}
              </h2>
            )}

            {/* Description Paragraph */}
            {overview.description ? (
              <p className="ab-description">{overview.description}</p>
            ) : null}

            {/* CTA Action Buttons */}
            {(overview.ctaPrimary || overview.ctaSecondary) && (
              <div className="ab-actions">
                {overview.ctaPrimary ? (
                  <button
                    className="ab-btn-primary"
                    onClick={openModal}
                    aria-label={overview.ctaPrimary}
                  >
                    <span>{overview.ctaPrimary}</span>
                    <ArrowRight size={18} className="ab-btn-icon" />
                  </button>
                ) : null}

                {overview.ctaSecondary ? (
                  <button
                    className="ab-btn-secondary"
                    onClick={handleVisionClick}
                    aria-label={overview.ctaSecondary}
                  >
                    <span className="ab-play-circle">
                      <Play size={13} fill="#0066ff" className="ab-play-icon" />
                    </span>
                    <span>{overview.ctaSecondary}</span>
                  </button>
                ) : null}
              </div>
            )}
          </div>

          {/* Right Column: 3D Neo-Glass Tech Orbit OR Uploaded Custom Artwork Image */}
          <div className="ab-artwork-col">
            {overview.artworkImage ? (
              <div className="ab-custom-artwork-wrap">
                <div className="ab-custom-artwork-glow"></div>
                <img
                  src={overview.artworkImage}
                  alt={overview.artworkImageAlt || overview.headline?.line1 || ''}
                  className="ab-custom-artwork-img"
                  loading="lazy"
                />
              </div>
            ) : (
              <Ber3DArtwork />
            )}
          </div>
        </div>

        {/* Bottom Statistics Strip: Glass Container */}
        {overview.stats && overview.stats.length > 0 && (
          <div className="ab-stats-glass-strip">
            {overview.stats.map((stat, idx) => (
              <div key={idx} className="ab-stat-item">
                <div className="ab-stat-icon-tile">
                  {renderStatIcon(stat.icon)}
                </div>
                <div className="ab-stat-meta">
                  <span className="ab-stat-value">{stat.n || ''}</span>
                  <span className="ab-stat-label">{stat.l || ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

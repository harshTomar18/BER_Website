import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code,
  Smartphone,
  Cloud,
  ShoppingBag,
  Bot,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  Palette,
  ArrowRight,
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { showcaseApi } from '../api';
import './TechSlider.css';

/**
 * TechSlider - BER Services Interactive Neo-Glass Marquee & Service Details
 * 100% Dynamic from MongoDB Atlas via showcaseApi
 */
export default function TechSlider() {
  const navigate = useNavigate();
  const [techSliderData, setTechSliderData] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [cardPos, setCardPos] = useState({ left: 0, caretLeft: 0, visible: false });
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const leaveTimerRef = useRef(null);

  // Fetch dynamic showcase configuration from database
  useEffect(() => {
    let isMounted = true;
    const fetchTechSlider = async () => {
      try {
        const res = await showcaseApi.getPublicShowcase();
        if (isMounted && res?.success && res?.data?.techSlider) {
          setTechSliderData(res.data.techSlider);
        }
      } catch (err) {
        console.error('Failed to load TechSlider data:', err);
      }
    };

    fetchTechSlider();
    return () => {
      isMounted = false;
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const items = Array.isArray(techSliderData?.items) ? techSliderData.items : [];
  if (techSliderData?.isActive === false || items.length === 0) {
    return null;
  }

  // Duplicate items for infinite seamless scroll
  const marqueeItems = [...items, ...items];

  // Helper to render icon for marquee pill and detail card
  const renderServiceIcon = (iconType, size = 20) => {
    switch (iconType) {
      case 'code':
        return <Code size={size} strokeWidth={2.4} />;
      case 'mobile':
        return <Smartphone size={size} strokeWidth={2.3} />;
      case 'cloud':
        return <Cloud size={size} strokeWidth={2.3} />;
      case 'cart':
        return <ShoppingBag size={size} strokeWidth={2.3} />;
      case 'ai':
        return <Bot size={size} strokeWidth={2.3} />;
      case 'analytics':
        return <BarChart3 size={size} strokeWidth={2.3} />;
      case 'security':
        return <ShieldCheck size={size} strokeWidth={2.3} />;
      case 'marketing':
        return <TrendingUp size={size} strokeWidth={2.3} />;
      case 'design':
        return <Palette size={size} strokeWidth={2.3} />;
      default:
        return <Cloud size={size} strokeWidth={2.3} />;
    }
  };

  // Position detail card relative to container and hovered item
  const calculateCardPosition = (itemEl) => {
    if (!itemEl || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();

    const itemCenterX = itemRect.left - containerRect.left + itemRect.width / 2;
    const cardWidth = Math.min(540, containerRect.width - 32);

    // Ideal left center
    let targetLeft = itemCenterX - cardWidth / 2;
    // Clamp inside container
    targetLeft = Math.max(16, Math.min(targetLeft, containerRect.width - cardWidth - 16));

    // Caret arrow position on card
    let caretX = itemCenterX - targetLeft;
    caretX = Math.max(28, Math.min(caretX, cardWidth - 28));

    setCardPos({
      left: targetLeft,
      caretLeft: caretX,
      visible: true,
    });
  };

  // Handle item hover
  const handleItemHover = (service, itemIndex, e) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    const currentEl = e.currentTarget;
    const itemId = service._id || service.id || itemIndex;
    setActiveItem(service);
    setActiveServiceId(itemId);
    calculateCardPosition(currentEl);
  };

  // Handle item click on mobile or desktop
  const handleItemClick = (service, itemIndex, e) => {
    const currentEl = e.currentTarget;
    const itemId = service._id || service.id || itemIndex;
    if (activeServiceId === itemId && cardPos.visible) {
      handleExploreClick(service.slug || service.link);
    } else {
      setActiveItem(service);
      setActiveServiceId(itemId);
      calculateCardPosition(currentEl);
    }
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setCardPos((prev) => ({ ...prev, visible: false }));
      setActiveItem(null);
      setActiveServiceId(null);
    }, 280);
  };

  // Keep detail card open if cursor moves inside it
  const handleCardMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  // Navigation when card or button is clicked
  const handleExploreClick = (targetSlug) => {
    if (targetSlug) {
      if (targetSlug.startsWith('/')) {
        navigate(targetSlug);
      } else {
        navigate(`/services-we-provide/${targetSlug}`);
      }
    } else {
      navigate('/services-we-provide');
    }
  };

  const eyebrow = techSliderData?.eyebrow || '';
  const title = techSliderData?.title || '';

  return (
    <section
      className="section tech-marquee-section"
      onMouseLeave={handleMouseLeave}
    >
      {/* Neo-Glass Background Lighting & Floating Orbs (Contained) */}
      <div className="tm-bg-decor" aria-hidden="true">
        <div className="tm-bg-glow tm-bg-glow--left"></div>
        <div className="tm-bg-glow tm-bg-glow--right"></div>
        <div className="tm-bg-wave-line tm-bg-wave-line--1"></div>
        <div className="tm-bg-wave-line tm-bg-wave-line--2"></div>
        <div className="tm-glass-cube tm-glass-cube--1"></div>
        <div className="tm-glass-cube tm-glass-cube--2"></div>
        <div className="tm-glass-cube tm-glass-cube--3"></div>
        <div className="tm-glass-orb tm-glass-orb--1"></div>
        <div className="tm-glass-orb tm-glass-orb--2"></div>
      </div>

      <div className="container">
        {/* Section Heading */}
        {(eyebrow || title) && (
          <div className="tm-heading-wrap">
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
            />
          </div>
        )}
      </div>

      {/* Main Interactive Stage Container */}
      <div ref={containerRef} className="container tm-stage-container">
        {/* Capsule Glass Marquee Track Ribbon */}
        <div
          className={`tm-track-capsule ${isPaused ? 'is-paused' : ''}`}
          onMouseEnter={() => setIsPaused(true)}
        >
          <div
            ref={trackRef}
            className={`tm-marquee-strip ${isPaused ? 'tm-marquee-paused' : ''}`}
          >
            {marqueeItems.map((service, index) => {
              const itemId = service._id || service.id || index;
              const isActive = activeServiceId === itemId && cardPos.visible;
              return (
                <div
                  key={`${itemId}-${index}`}
                  className={`tm-item ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={(e) => handleItemHover(service, index, e)}
                  onClick={(e) => handleItemClick(service, index, e)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                >
                  {/* Radiant sparkle ticks on top-right of active button */}
                  {isActive && (
                    <div className="tm-sparkle-ticks" aria-hidden="true">
                      <span className="tick-1"></span>
                      <span className="tick-2"></span>
                      <span className="tick-3"></span>
                    </div>
                  )}

                  {/* Supplier Brand Icon / Tile */}
                  <div className="tm-item-icon">
                    {service.iconImg ? (
                      <img
                        src={service.iconImg}
                        alt={service.pillTitle || service.title || ''}
                        className="tm-item-supplier-img"
                        loading="lazy"
                      />
                    ) : (
                      renderServiceIcon(service.iconType, 20)
                    )}
                  </div>

                  {/* Service Title */}
                  <span className="tm-item-label">
                    {service.pillTitle || service.title || ''}
                  </span>

                  {/* Vertical Divider */}
                  <span className="tm-item-divider" aria-hidden="true"></span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Detail Card with Speech-Bubble Arrow */}
        <div
          className={`tm-detail-card-wrap ${cardPos.visible && activeItem ? 'is-open' : ''}`}
          style={{
            left: `${cardPos.left}px`,
          }}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Speech-Bubble Caret Arrow pointing up to hovered item */}
          <div
            className="tm-detail-caret"
            style={{ left: `${cardPos.caretLeft}px` }}
            aria-hidden="true"
          ></div>

          {activeItem && (
            <div
              className="tm-detail-card"
              onClick={() => handleExploreClick(activeItem.slug || activeItem.link)}
            >
              {/* Left Column: 3D Neo-Glass Pedestal with floating icon */}
              <div className="tm-card-podium-col">
                <div className="tm-3d-podium">
                  <div className="podium-aura"></div>
                  <div className="podium-orbit-ring"></div>
                  <div className="podium-icon-float">
                    <div className="podium-icon-glow"></div>
                    {activeItem.iconImg ? (
                      <img
                        src={activeItem.iconImg}
                        alt={activeItem.title || ''}
                        className="podium-supplier-img"
                      />
                    ) : (
                      renderServiceIcon(activeItem.iconType, 30)
                    )}
                  </div>
                  <div className="podium-base">
                    <div className="podium-layer layer-top"></div>
                    <div className="podium-layer layer-mid"></div>
                    <div className="podium-layer layer-bottom"></div>
                  </div>
                </div>
              </div>

              {/* Right Column: Service Details & Tech Stack */}
              <div className="tm-card-content-col">
                {/* Title & Explore Arrow */}
                <div className="tm-card-top-row">
                  <h4 className="tm-card-title">{activeItem.title || ''}</h4>
                  <button
                    className="tm-card-arrow-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExploreClick(activeItem.slug || activeItem.link);
                    }}
                    aria-label={`Explore ${activeItem.title || ''}`}
                  >
                    <ArrowRight size={17} strokeWidth={2.4} />
                  </button>
                </div>

                {/* Description */}
                {activeItem.description && (
                  <p className="tm-card-desc">{activeItem.description}</p>
                )}

                {/* Technology Badges */}
                {Array.isArray(activeItem.techs) && activeItem.techs.length > 0 && (
                  <div className="tm-card-tech-row">
                    {activeItem.techs.map((tech, tIdx) => (
                      <span key={tech.name || tIdx} className="tm-tech-badge">
                        <span
                          className="tm-tech-dot"
                          style={{ backgroundColor: tech.color || '#1385ac' }}
                        ></span>
                        <span>{tech.name}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

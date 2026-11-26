import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { showcaseApi } from '../api';
import './TechSlider.css';

/**
 * TechSlider - BER Services Interactive Neo-Glass Marquee
 * 100% Dynamic from MongoDB Atlas via showcaseApi
 */
export default function TechSlider() {
  const navigate = useNavigate();
  const [techSliderData, setTechSliderData] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

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
    };
  }, []);

  const items = Array.isArray(techSliderData?.items) ? techSliderData.items : [];
  if (techSliderData?.isActive === false || items.length === 0) {
    return null;
  }

  // Duplicate items for infinite seamless scroll
  const marqueeItems = [...items, ...items];

  // Helper to render icon for marquee pill
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

  // Navigation when pill is clicked
  const handleItemClick = (targetSlug) => {
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
    <section className="section tech-marquee-section">
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
            <SectionHeading eyebrow={eyebrow} title={title} />
          </div>
        )}
      </div>

      {/* Main Stage Container */}
      <div className="container tm-stage-container">
        {/* Capsule Glass Marquee Track Ribbon */}
        <div
          className={`tm-track-capsule ${isPaused ? 'is-paused' : ''}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`tm-marquee-strip ${isPaused ? 'tm-marquee-paused' : ''}`}
          >
            {marqueeItems.map((service, index) => {
              const itemId = service._id || service.id || index;
              const label = service.pillTitle || service.title || '';
              return (
                <div
                  key={`${itemId}-${index}`}
                  className="tm-item"
                  onClick={() => handleItemClick(service.slug || service.link)}
                  role="button"
                  tabIndex={0}
                  title={label}
                >
                  {/* Supplier Brand Icon / Tile */}
                  <div className="tm-item-icon">
                    {service.iconImg ? (
                      <img
                        src={service.iconImg}
                        alt={label}
                        className="tm-item-supplier-img"
                        loading="lazy"
                      />
                    ) : (
                      renderServiceIcon(service.iconType, 20)
                    )}
                  </div>

                  {/* Service Title */}
                  <span className="tm-item-label">{label}</span>

                  {/* Vertical Divider */}
                  <span className="tm-item-divider" aria-hidden="true"></span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Check,
  Zap,
  ArrowRight,
  Sparkles,
  Layout,
  Layers,
  Code2,
  Search,
  ShieldCheck,
  ShoppingCart,
  CreditCard,
  Smartphone,
  Cpu,
  BarChart3,
  Database,
  Palette,
  Bot,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import './PinnedImageSwap.css';

gsap.registerPlugin(ScrollTrigger);

export default function PinnedImageSwap({ deliverablesData, items, onInquire }) {
  const containerRef = useRef(null);
  const imageRefs = useRef([]);
  const blockRefs = useRef([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const isUserClicking = useRef(false);

  // Dynamic modules list from backend API
  const displayItems =
    deliverablesData?.items && deliverablesData.items.length > 0
      ? deliverablesData.items
      : items && items.length > 0
      ? items
      : [];

  const renderIcon = (iconName, size = 20) => {
    switch (iconName) {
      case 'Layout':
        return <Layout size={size} strokeWidth={2.2} />;
      case 'Zap':
        return <Zap size={size} strokeWidth={2.2} />;
      case 'Layers':
        return <Layers size={size} strokeWidth={2.2} />;
      case 'Search':
        return <Search size={size} strokeWidth={2.2} />;
      case 'ShieldCheck':
        return <ShieldCheck size={size} strokeWidth={2.2} />;
      case 'Code2':
        return <Code2 size={size} strokeWidth={2.2} />;
      case 'ShoppingCart':
        return <ShoppingCart size={size} strokeWidth={2.2} />;
      case 'CreditCard':
        return <CreditCard size={size} strokeWidth={2.2} />;
      case 'Smartphone':
        return <Smartphone size={size} strokeWidth={2.2} />;
      case 'Cpu':
        return <Cpu size={size} strokeWidth={2.2} />;
      case 'BarChart3':
        return <BarChart3 size={size} strokeWidth={2.2} />;
      case 'Database':
        return <Database size={size} strokeWidth={2.2} />;
      case 'Palette':
        return <Palette size={size} strokeWidth={2.2} />;
      case 'Bot':
        return <Bot size={size} strokeWidth={2.2} />;
      default:
        return <CheckCircle2 size={size} strokeWidth={2.2} />;
    }
  };

  // Image swap executor
  const swapImage = (targetIdx) => {
    setActiveIdx(targetIdx);

    imageRefs.current.forEach((img, i) => {
      if (!img) return;
      if (i === targetIdx) {
        gsap.to(img, {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out',
          zIndex: 10,
          overwrite: 'auto',
        });
      } else {
        gsap.to(img, {
          opacity: 0,
          scale: 0.96,
          duration: 0.45,
          ease: 'power2.out',
          zIndex: 1,
          overwrite: 'auto',
        });
      }
    });
  };

  const handleSelectTab = (idx) => {
    isUserClicking.current = true;
    swapImage(idx);

    const targetEl = blockRefs.current[idx];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => {
      isUserClicking.current = false;
    }, 800);
  };

  // Scroll detection to highlight active card & sync sticky image
  useEffect(() => {
    if (!containerRef.current || displayItems.length === 0) return;

    let ticking = false;
    const onScroll = () => {
      if (isUserClicking.current) return;

      const viewportCenter = window.innerHeight * 0.45;
      let closestIdx = activeIdx;
      let closestDistance = Infinity;

      blockRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height * 0.5;
        const distance = Math.abs(elementCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIdx = index;
        }
      });

      if (closestIdx !== activeIdx && closestIdx >= 0 && closestIdx < displayItems.length) {
        swapImage(closestIdx);
      }
    };

    const handleWindowScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [activeIdx, displayItems]);

  useEffect(() => {
    swapImage(0);
  }, [displayItems]);

  if (displayItems.length === 0) return null;

  const eyebrow = deliverablesData?.eyebrow || 'Core Architecture';
  const heading = deliverablesData?.title || 'Explore Key Deliverables & Systems';
  const subtitle =
    deliverablesData?.subtitle ||
    'Scroll down through the deliverables or select any module to inspect detailed architecture specifications.';

  return (
    <section className="pis-section" ref={containerRef}>
      <div className="container">
        {/* Section Heading */}
        <div className="pis-section-header">
          {eyebrow && <span className="pis-pill-sm">{eyebrow}</span>}
          {heading && <h2 className="pis-sec-heading">{heading}</h2>}
          {subtitle && <p className="pis-sec-sub">{subtitle}</p>}

          {/* Interactive Quick-Select Module Tabs Bar */}
          <div className="pis-tabs-wrapper">
            <div className="pis-tabs-bar">
              {displayItems.map((item, idx) => {
                const isActive = activeIdx === idx;
                const shortTitle = item.title ? item.title.split('&')[0].trim() : `Module ${idx + 1}`;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`pis-tab-pill ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectTab(idx)}
                  >
                    <span className="pis-tab-dot"></span>
                    <span className="pis-tab-num">MODULE {String(idx + 1).padStart(2, '0')}</span>
                    <span className="pis-tab-title">{shortTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 1. The Layout: Flex container */}
        <div className="pis-flex-container">
          {/* 2. Left Column (Visuals): Sticky stack of module images */}
          <div className="pis-left-visuals">
            <div className="pis-sticky-box">
              <div className="pis-stack-media">
                {displayItems.map((item, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <div
                      key={idx}
                      ref={(el) => (imageRefs.current[idx] = el)}
                      className={`pis-image-layer ${isActive ? 'is-active' : ''}`}
                    >
                      <img
                        src={item.image || '/images/ber_capabilities_mockup.jpg'}
                        alt={item.title || ''}
                        className="pis-layer-img"
                      />
                      <div className="pis-layer-overlay"></div>

                      {/* HUD Overlay Badges */}
                      <div className="pis-hud-top">
                        {item.hudTag && (
                          <div className="pis-hud-pill">
                            <span className="pis-pulse-dot"></span>
                            <span>{item.hudTag}</span>
                          </div>
                        )}
                        <div className="pis-hud-status">
                          <span className="pis-status-dot"></span>
                          <span>Production Architecture</span>
                        </div>
                      </div>

                      <div className="pis-hud-bottom">
                        {item.metric && (
                          <div className="pis-hud-metric">
                            <Sparkles size={13} className="pis-hud-metric-icon" />
                            <span>{item.metric}</span>
                          </div>
                        )}
                        <div className="pis-hud-brand">BER Services Core Engine</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Right Column (Content Blocks) */}
          <div className="pis-right-content">
            {displayItems.map((item, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={idx}
                  ref={(el) => (blockRefs.current[idx] = el)}
                  className={`pis-text-block ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleSelectTab(idx)}
                >
                  <div className="pis-block-card">
                    {/* Header */}
                    <div className="pis-card-header">
                      <div className="pis-card-num-badge">
                        <span className="pis-card-num">MODULE {String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="pis-card-icon">
                        {renderIcon(item.icon, 20)}
                      </div>
                      <div className="pis-card-arrow-wrap">
                        <ChevronRight
                          size={18}
                          className={`pis-card-arrow ${isActive ? 'is-active' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Title & Desc */}
                    {item.title && <h3 className="pis-card-title">{item.title}</h3>}
                    {item.desc && <p className="pis-card-desc">{item.desc}</p>}

                    {/* Bullet Deliverables (What We Architect & Ship) */}
                    {Array.isArray(item.deliverables) && item.deliverables.length > 0 && (
                      <div className="pis-specs-box">
                        <h4 className="pis-specs-title">What We Architect & Ship:</h4>
                        <ul className="pis-specs-list">
                          {item.deliverables.map((del, dIdx) => (
                            <li key={dIdx} className="pis-spec-item">
                              <span className="pis-spec-check">
                                <Check size={12} strokeWidth={3} />
                              </span>
                              <span className="pis-spec-text">{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Card Footer Action & Metric Indicator */}
                    <div className="pis-card-footer">
                      {item.metric && (
                        <div className="pis-metric-badge">
                          <span className="pis-metric-dot"></span>
                          <span className="pis-metric-text">{item.metric}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        className="pis-cta-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onInquire) onInquire();
                        }}
                      >
                        <span>Inquire About This Feature</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

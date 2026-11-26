import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Zap,
  ShieldCheck,
  Cpu,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Layout,
  Layers,
  Code2,
  Search,
  ShoppingCart,
  CreditCard,
  Smartphone,
  BarChart3,
  Database,
  Palette,
  Bot
} from 'lucide-react';
import './PinnedScrollScrub.css';

gsap.registerPlugin(ScrollTrigger);

export default function PinnedScrollScrub({
  showcase,
  serviceTitle = '',
  tagline = '',
  assetImage = '/images/ber_capabilities_mockup.jpg',
  images = [],
}) {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  // Helper to render matching icon
  const getCardIcon = (iconName) => {
    switch (iconName) {
      case 'Zap':
        return Zap;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Cpu':
        return Cpu;
      case 'Layout':
        return Layout;
      case 'Layers':
        return Layers;
      case 'Code2':
        return Code2;
      case 'Search':
        return Search;
      case 'ShoppingCart':
        return ShoppingCart;
      case 'CreditCard':
        return CreditCard;
      case 'Smartphone':
        return Smartphone;
      case 'BarChart3':
        return BarChart3;
      case 'Database':
        return Database;
      case 'Palette':
        return Palette;
      case 'Bot':
        return Bot;
      default:
        return Sparkles;
    }
  };

  const featureCards =
    showcase?.items && showcase.items.length > 0
      ? showcase.items
      : [
        {
          num: '01',
          tag: 'Core Performance',
          title: 'Sub-Second Global Edge Delivery',
          desc: 'Engineered with micro-frontend hydration, automated asset compression, and edge CDN routing achieving sub-400ms TTFB worldwide.',
          metric: 'Sub-400ms TTFB • 99/100 Lighthouse',
          hudBadge: 'EDGE PERFORMANCE ENGINE',
          icon: 'Zap',
          image: (images && images[0]) || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85',
        },
        {
          num: '02',
          tag: 'Cyber Defense',
          title: 'Zero-Trust Bank-Grade Security',
          desc: 'End-to-end TLS 1.3 encryption, automated DDoS shielding, continuous dependency vulnerability audits, and sanitized input validation.',
          metric: 'A+ SSL Rating • 100% OWASP Compliance',
          hudBadge: 'ZERO-TRUST CYBER SHIELD',
          icon: 'ShieldCheck',
          image: (images && images[1]) || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=85',
        },
        {
          num: '03',
          tag: 'Cloud Integration',
          title: 'Modular Headless Integration Mesh',
          desc: 'Bi-directional webhooks and resilient event-driven pipelines seamlessly connecting ERP, CRM, marketing automation, and custom admin portals.',
          metric: 'Sub-50ms REST & GraphQL Gateways',
          hudBadge: 'ENTERPRISE INTEGRATION MESH',
          icon: 'Cpu',
          image: (images && images[2]) || assetImage || '/images/ber_capabilities_mockup.jpg',
        },
      ];

  useGSAP(
    () => {
      if (!containerRef.current || featureCards.length === 0) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=2000',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const step = 1 / featureCards.length;
            const active = Math.min(Math.floor(p / step), featureCards.length - 1);
            setActiveTab(active);
          },
        },
      });
    },
    { scope: containerRef, dependencies: [featureCards.length] }
  );

  if (featureCards.length === 0) return null;

  const displayTitle = showcase?.title || serviceTitle || '';
  const displayTagline = showcase?.tagline || tagline || '';
  const displayBadge = showcase?.badge || 'Interactive Architecture Showcase';

  return (
    <section className="pss-section-wrapper" ref={containerRef}>
      {/* Ambient background glow & grid */}
      <div className="pss-ambient-bg">
        <div className="pss-glow-orb pss-glow-orb--top"></div>
        <div className="pss-glow-orb pss-glow-orb--bottom"></div>
        <div className="pss-grid-mesh"></div>
      </div>

      <div className="pss-main-container">
        {/* Header Overlay */}
        <div className="pss-header-overlay">
          {displayBadge && (
            <div className="pss-badge">
              <Sparkles size={14} className="pss-badge-icon" />
              <span>{displayBadge}</span>
            </div>
          )}
          {displayTitle && <h2 className="pss-title">{displayTitle}</h2>}
          {displayTagline && <p className="pss-tagline">{displayTagline}</p>}
        </div>

        {/* 2-Column Stage Grid */}
        <div className="pss-stage-grid">
          {/* Left Column: Large Visual Display */}
          <div className="pss-visual-display">
            <div className="pss-visual-frame">
              {featureCards.map((card, idx) => (
                <div
                  key={idx}
                  className={`pss-image-layer ${activeTab === idx ? 'is-active' : ''}`}
                >
                  <img
                    src={card.image || assetImage || '/images/ber_capabilities_mockup.jpg'}
                    alt={card.title || ''}
                    className="pss-large-img"
                  />
                  <div className="pss-asset-glass-overlay"></div>
                  {card.hudBadge && (
                    <div className="pss-asset-hud-badge">
                      <span className="pss-hud-pulse"></span>
                      <span>{card.hudBadge}</span>
                    </div>
                  )}
                  {card.metric && (
                    <div className="pss-asset-hud-metric">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                      <span>{card.metric}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Cards */}
          <div className="pss-cards-col">
            {featureCards.map((card, idx) => {
              const IconComp = typeof card.icon === 'string' ? getCardIcon(card.icon) : (card.icon || Sparkles);
              const isActive = activeTab === idx;
              return (
                <div
                  key={idx}
                  className={`pss-glass-card ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(idx)}
                >
                  <div className="pss-card-top">
                    {card.num && <span className="pss-card-num">{card.num}</span>}
                    {card.tag && <span className="pss-card-tag">{card.tag}</span>}
                    <div className="pss-card-icon-wrap">
                      <IconComp size={18} strokeWidth={2.4} />
                    </div>
                  </div>
                  {card.title && <h3 className="pss-card-title">{card.title}</h3>}
                  {card.desc && <p className="pss-card-desc">{card.desc}</p>}
                  {card.metric && (
                    <div className="pss-card-footer">
                      <span className="pss-card-metric-dot"></span>
                      <span className="pss-card-metric-text">{card.metric}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="pss-scroll-indicator">
          <span className="pss-scroll-text">Scroll or click cards to view architecture</span>
          <ChevronDown size={16} className="pss-scroll-arrow" />
        </div>
      </div>
    </section>
  );
}

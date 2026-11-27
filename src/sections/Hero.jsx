import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import Hero3DCanvas from '../components/Hero3DCanvas';
import { useConsult } from '../context/ConsultContext';
import { heroApi } from '../api';
import './Hero.css';

export default function Hero() {
  const { openModal } = useConsult();
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wordIdx, setWordIdx] = useState(0);
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlayPause = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // 1. Fetch Dynamic Hero Section Configuration from Database
  useEffect(() => {
    let isMounted = true;
    const fetchHeroData = async () => {
      try {
        const res = await heroApi.getPublicHero();
        if (isMounted && res?.success && res?.data?.hero) {
          setHero(res.data.hero);
        } else if (isMounted) {
          setHero(null);
        }
      } catch (err) {
        console.error('Failed to load hero section from API:', err);
        if (isMounted) setHero(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHeroData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Smooth Rotating Highlight Words
  useEffect(() => {
    if (!hero?.dynamicWords || hero.dynamicWords.length === 0) return;
    const timer = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % hero.dynamicWords.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [hero?.dynamicWords]);

  // 3. Subtle 3D Card Tilt on Mouse Move
  const handleCardMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 12;
    const rotateY = (x / rect.width) * 12;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  };

  const handleScrollToServices = () => {
    const el = document.querySelector('.svc-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/services-we-provide';
    }
  };

  // If hero section has not loaded yet, keep background canvas active smoothly
  if (loading && !hero) {
    return (
      <section className="hero">
        <Hero3DCanvas />
        <div className="hero__aurora hero__aurora--cyan"></div>
        <div className="hero__aurora hero__aurora--navy"></div>
        <div className="container hero__in" style={{ minHeight: '600px' }}></div>
      </section>
    );
  }

  // If no hero section exists in database
  if (!hero) {
    return null;
  }

  const currentDynamicWord =
    hero.dynamicWords && hero.dynamicWords.length > 0
      ? hero.dynamicWords[wordIdx % hero.dynamicWords.length]
      : null;

  return (
    <section className="hero">
      {/* 3D WebGL Motion Canvas (Vivid Cyber Wave Grid & Neural Stars) */}
      <Hero3DCanvas />

      {/* Atmospheric Ambient Lighting */}
      <div className="hero__aurora hero__aurora--cyan"></div>
      <div className="hero__aurora hero__aurora--orange"></div>
      <div className="hero__aurora hero__aurora--navy"></div>

      <div className="container hero__in">
        {/* Left Column: Heading & Core Messaging */}
        <div className="hero__content">

          {/* Optional Eyebrow / Badge */}
          {hero.badge && (
            <div className="hero__badge-pill">
              <span>{hero.badge}</span>
            </div>
          )}

          {/* Main Title & Subtitle */}
          <h1 className="hero__title">
            {hero.title && <span>{hero.title} </span>}
            {hero.titleSub && <span className="hero__title-sub">{hero.titleSub}</span>}
            {currentDynamicWord && (
              <div className="hero__dynamic-wrap">
                <span
                  key={wordIdx}
                  className="hero__dynamic-word"
                  style={{ color: currentDynamicWord.color || '#16a1ce' }}
                >
                  {currentDynamicWord.text}
                </span>
              </div>
            )}
          </h1>

          {/* Description */}
          {hero.description && <p className="hero__text">{hero.description}</p>}

          {/* Action Buttons */}
          <div className="hero__actions">
            {/* Primary CTA */}
            {hero.primaryCta?.text && (
              hero.primaryCta.action === 'url' && hero.primaryCta.url ? (
                <Link to={hero.primaryCta.url} className="btn hero__btn-primary">
                  <span>{hero.primaryCta.text}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <button className="btn hero__btn-primary" onClick={openModal}>
                  <span>{hero.primaryCta.text}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>
              )
            )}

            {/* Secondary CTA */}
            {hero.secondaryCta?.text && (
              <button
                className="btn btn--outline hero__btn-ghost"
                onClick={() => {
                  if (
                    !hero.secondaryCta.url ||
                    hero.secondaryCta.url.startsWith('#') ||
                    hero.secondaryCta.url === '/services-we-provide'
                  ) {
                    handleScrollToServices();
                  } else {
                    window.location.href = hero.secondaryCta.url;
                  }
                }}
              >
                <span>{hero.secondaryCta.text}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>

          {/* Features Checklist */}
          {hero.features && hero.features.length > 0 && (
            <ul className="hero__feats">
              {hero.features.map((f, idx) => (
                <li key={idx}>
                  <span>✔</span> {f}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Column: 3D Interactive Software Platform Window */}
        <div className="hero__visual">
          <div
            ref={cardRef}
            className="hero__platform-window"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            {/* Window Header */}
            <div className="hero__window-bar">
              <div className="hero__window-dots">
                <span className="dot dot--red"></span>
                <span className="dot dot--yellow"></span>
                <span className="dot dot--green"></span>
              </div>
              {hero.windowBadge && <div className="hero__window-badge">{hero.windowBadge}</div>}
              {hero.windowLiveStatus && (
                <div className="hero__window-live">
                  <span className="live-ping"></span>
                  <span>{hero.windowLiveStatus}</span>
                </div>
              )}
            </div>

            {/* Window Body */}
            <div className="hero__window-content">

              {/* Uploaded Hero Video / Image Showcase */}
              {((hero.heroMediaType !== 'image' && (hero.heroVideo || '/images/This is what we will be.mp4')) || hero.heroImage) && (
                <div className="hero__window-media-showcase">
                  {hero.heroMediaType !== 'image' ? (
                    <div className="hero__video-box">
                      <video
                        ref={videoRef}
                        src={encodeURI(hero.heroVideo || '/images/This is what we will be.mp4')}
                        autoPlay={hero.heroVideoAutoplay !== false}
                        loop={hero.heroVideoLoop !== false}
                        muted={isMuted}
                        playsInline
                        className="hero__showcase-video"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      <div className="hero__video-overlay-bar">
                        <div className="hero__video-status">
                          <span className="hero__video-dot"></span>
                          <span className="hero__video-title">BER Live Reel</span>
                        </div>
                        <div className="hero__video-controls">
                          <button
                            type="button"
                            className="hero__video-ctrl-btn"
                            onClick={togglePlayPause}
                            title={isPlaying ? 'Pause video' : 'Play video'}
                            aria-label={isPlaying ? 'Pause video' : 'Play video'}
                          >
                            {isPlaying ? <Pause size={11} /> : <Play size={11} />}
                          </button>
                          <button
                            type="button"
                            className="hero__video-ctrl-btn"
                            onClick={toggleMute}
                            title={isMuted ? 'Unmute video' : 'Mute video'}
                            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                          >
                            {isMuted ? <VolumeX size={11} /> : <Volume2 size={11} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : hero.heroImage ? (
                    <div className="hero__window-image-showcase">
                      <img
                        src={hero.heroImage}
                        alt={hero.heroImageAlt || hero.title || ''}
                        className="hero__showcase-img"
                      />
                    </div>
                  ) : null}
                </div>
              )}

              {/* Stat Cards */}
              {hero.stats && hero.stats.length > 0 && (
                <div className="hero__stat-grid">
                  {hero.stats.map((st, i) => (
                    <div key={i} className="hero__stat-box">
                      <div className={`hero__stat-icon-wrap icon-${st.color || 'cyan'}`}>
                        {st.icon}
                      </div>
                      <div>
                        <div className="hero__stat-number">{st.value}</div>
                        <div className="hero__stat-name">{st.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, MessageCircle, Mail } from 'lucide-react';
import { company, nav, services } from '../config/siteConfig';
import { images } from '../config/images';
import { useConsult } from '../context/ConsultContext';
import { serviceApi } from '../api';
import './Header.css';

export default function Header() {
  const [mobile, setMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [servicesList, setServicesList] = useState(services);
  const { openModal } = useConsult();
  const location = useLocation();

  const lastScrollY = useRef(0);
  const sentinelRef = useRef(null);

  const close = () => setMobile(false);

  // Fetch dynamic services for dropdown
  useEffect(() => {
    let isMounted = true;
    serviceApi.getPublicServices().then((res) => {
      if (isMounted && res?.success && Array.isArray(res?.data?.services) && res.data.services.length > 0) {
        setServicesList(res.data.services);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    close();
  }, [location.pathname]);

  // 1. IntersectionObserver observing top sentinel to guarantee top state reset
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsScrolled(false);
          setIsHidden(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // 2. High-performance scroll listener: hide on scroll down, reveal on scroll up
  useEffect(() => {
    let ticking = false;
    const threshold = 8; // minimum delta to avoid jitter

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // When near the top, always show full header
      if (currentScrollY <= 25) {
        setIsScrolled(false);
        setIsHidden(false);
        lastScrollY.current = currentScrollY;
        ticking = false;
        return;
      }

      // Past 35px: enable frosted glass & compact mode
      setIsScrolled(true);

      // Never hide while mobile menu is open
      if (mobile) {
        setIsHidden(false);
        lastScrollY.current = currentScrollY;
        ticking = false;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;

      if (Math.abs(diff) >= threshold) {
        if (diff > 0 && currentScrollY > 100) {
          // Scrolling DOWN -> smoothly hide navbar
          setIsHidden(true);
        } else if (diff < 0) {
          // Scrolling UP -> smoothly reveal navbar
          setIsHidden(false);
        }
        lastScrollY.current = currentScrollY;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobile]);

  return (
    <>
      {/* Top Sentinel for IntersectionObserver */}
      <div ref={sentinelRef} id="top-sentinel" className="hd-sentinel" />

      <header
        className={`hd ${isScrolled ? 'hd--scrolled' : ''} ${
          isHidden ? 'hd--hidden' : 'hd--visible'
        }`}
      >
        {/* Top Announcement & Quick Contact Bar */}
        <div className="hd__top">
          <div className="container hd__top-in">
            <div className="hd__social">
              <a href={company.socials.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a href={company.socials.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={company.socials.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
            <div className="hd__contact">
              <a href={company.whatsapp} target="_blank" rel="noreferrer">
                <MessageCircle size={14} className="hd__contact-icon" />
                <span>Chat with us</span>
              </a>
              <a href={`mailto:${company.email}`}>
                <Mail size={14} className="hd__contact-icon" />
                <span>Email us</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="hd__main">
          <div className="container hd__main-in">
            <Link to="/" className="hd__logo" onClick={close} aria-label="BER Services Home">
              <img src={images.logo} alt={company.name} />
            </Link>

            {/* Modern Animated Burger Button */}
            <button
              className={`hd__burger ${mobile ? 'is-open' : ''}`}
              onClick={() => setMobile(!mobile)}
              aria-label="Toggle navigation"
            >
              <span className="hd__burger-line"></span>
              <span className="hd__burger-line"></span>
              <span className="hd__burger-line"></span>
            </button>

            {/* Desktop & Mobile Navigation Links */}
            <nav className={`hd__nav ${mobile ? 'is-open' : ''}`}>
              <ul>
                {nav.map((n) => (
                  <li key={n.to} className={n.dropdown ? 'has-dd' : ''}>
                    <NavLink
                      to={n.to}
                      end={n.to === '/'}
                      onClick={close}
                      className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                      <span>{n.label}</span>
                      {n.dropdown && (
                        <ChevronDown size={14} className="hd__dd-chevron" />
                      )}
                    </NavLink>
                    {n.dropdown && (
                      <ul className="hd__dd">
                        {servicesList.map((s) => (
                          <li key={s.slug}>
                            <Link
                              to={`/services-we-provide/${s.slug}`}
                              onClick={close}
                            >
                              <span className="hd__dd-item-text">{s.title || ''}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <button
                className="hd__cta"
                onClick={() => {
                  openModal();
                  close();
                }}
              >
                <span>Get Free Consultation</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content jump below fixed navbar */}
      <div className={`hd-spacer ${isScrolled ? 'hd-spacer--compact' : ''}`} />
    </>
  );
}

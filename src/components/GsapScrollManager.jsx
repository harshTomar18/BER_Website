import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * GsapScrollManager - Global GSAP Scroll-Triggered Reveal Animations
 * Smooth, elegant, high-performance animations as the user scrolls down the page
 * Automatically targets headings, cards, grids, stats, and sections with zero layout break
 */
export default function GsapScrollManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable on admin routes
    if (pathname.startsWith('/admin')) {
      return;
    }

    // Allow time for dynamic MongoDB content and route DOM to mount cleanly
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // -----------------------------------------------------------------
        // 1. SECTION HEADINGS (.sh)
        // Staggered reveal for eyebrow, title, and subtitle
        // -----------------------------------------------------------------
        const headings = document.querySelectorAll('.sh, .svc-header-wrap, .cl-heading-wrap');
        headings.forEach((heading) => {
          const eyebrow = heading.querySelector('.sh__eyebrow, .contact-eyebrow');
          const title = heading.querySelector('.sh__title, .contact-heading');
          const text = heading.querySelector('.sh__text, .contact-intro');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              once: true,
            },
          });

          if (eyebrow) {
            tl.fromTo(
              eyebrow,
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }
            );
          }
          if (title) {
            tl.fromTo(
              title,
              { opacity: 0, y: 32 },
              { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
              eyebrow ? '-=0.45' : 0
            );
          }
          if (text) {
            tl.fromTo(
              text,
              { opacity: 0, y: 22 },
              { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
              '-=0.55'
            );
          }
        });

        // -----------------------------------------------------------------
        // 2. SERVICES 3D CAROUSEL (.svc-carousel-wrapper)
        // -----------------------------------------------------------------
        const svcWrapper = document.querySelector('.svc-carousel-wrapper');
        if (svcWrapper) {
          gsap.fromTo(
            svcWrapper,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1.0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: svcWrapper,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        // -----------------------------------------------------------------
        // 3. ABOUT SECTION (.ab-section)
        // Left text + Right artwork + Bottom stats strip
        // -----------------------------------------------------------------
        const abContent = document.querySelector('.ab-content');
        if (abContent) {
          gsap.fromTo(
            abContent,
            { opacity: 0, x: -35 },
            {
              opacity: 1,
              x: 0,
              duration: 0.95,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: abContent,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        const abCenterpiece = document.querySelector('.ab-centerpiece, .ab-artwork-img');
        if (abCenterpiece) {
          gsap.fromTo(
            abCenterpiece,
            { opacity: 0, scale: 0.92, y: 25 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.05,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: abCenterpiece,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        const statItems = document.querySelectorAll('.ab-stat-item');
        if (statItems.length > 0) {
          gsap.fromTo(
            statItems,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.ab-stats-strip',
                start: 'top 88%',
                once: true,
              },
            }
          );
        }

        // -----------------------------------------------------------------
        // 4. TECH SLIDER (.tech-section)
        // -----------------------------------------------------------------
        const techSection = document.querySelector('.tech-section');
        if (techSection) {
          const techTrack = techSection.querySelector('.tech-slider-track, .tech-marquee');
          if (techTrack) {
            gsap.fromTo(
              techTrack,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: techTrack,
                  start: 'top 85%',
                  once: true,
                },
              }
            );
          }
        }

        // -----------------------------------------------------------------
        // 5. NEXT-GEN STATEMENT (.ng)
        // -----------------------------------------------------------------
        const ngContainer = document.querySelector('.ng__in');
        if (ngContainer) {
          const paragraphs = ngContainer.querySelectorAll('.ng__p');
          gsap.fromTo(
            paragraphs,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.18,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: ngContainer,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        // -----------------------------------------------------------------
        // 6. TESTIMONIALS (.tm__grid)
        // -----------------------------------------------------------------
        const testimonialCards = document.querySelectorAll('.tm__card');
        if (testimonialCards.length > 0) {
          gsap.fromTo(
            testimonialCards,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.tm__grid',
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        // -----------------------------------------------------------------
        // 7. NEWS & ARTICLES (.nw__grid)
        // -----------------------------------------------------------------
        const newsCards = document.querySelectorAll('.nw__card');
        if (newsCards.length > 0) {
          gsap.fromTo(
            newsCards,
            { opacity: 0, y: 45 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.14,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: newsCards[0],
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        // -----------------------------------------------------------------
        // 8. CLIENTS LOGO MARQUEE (.cl-marquee-wrapper)
        // -----------------------------------------------------------------
        const clWrapper = document.querySelector('.cl-marquee-wrapper');
        if (clWrapper) {
          gsap.fromTo(
            clWrapper,
            { opacity: 0, scale: 0.98 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.85,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: clWrapper,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        // -----------------------------------------------------------------
        // 9. CONTACT SECTION (.ber-contact-page)
        // -----------------------------------------------------------------
        const contactLeft = document.querySelector('.contact-left');
        const contactRight = document.querySelector('.contact-card, .contact-right');
        if (contactLeft && contactRight) {
          gsap.fromTo(
            contactLeft,
            { opacity: 0, x: -35 },
            {
              opacity: 1,
              x: 0,
              duration: 0.95,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: contactLeft,
                start: 'top 85%',
                once: true,
              },
            }
          );

          gsap.fromTo(
            contactRight,
            { opacity: 0, x: 35 },
            {
              opacity: 1,
              x: 0,
              duration: 0.95,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: contactRight,
                start: 'top 85%',
                once: true,
              },
            }
          );

          const contactCards = document.querySelectorAll('.contact-card-item');
          if (contactCards.length > 0) {
            gsap.fromTo(
              contactCards,
              { opacity: 0, y: 25 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: '.contact-cards-grid',
                  start: 'top 88%',
                  once: true,
                },
              }
            );
          }
        }

        // -----------------------------------------------------------------
        // 10. UNIVERSAL DATA-GSAP ATTRIBUTES
        // Any developer or page can use: data-gsap="fade-up" etc.
        // -----------------------------------------------------------------
        const customElements = document.querySelectorAll('[data-gsap="fade-up"]');
        customElements.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true,
              },
            }
          );
        });

        // Refresh triggers after setting them up
        ScrollTrigger.refresh();
      });

      return () => {
        ctx.revert();
      };
    }, 120);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}

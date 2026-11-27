import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll - High performance momentum scrolling
 * Optimized for 60-120fps with zero initial thread-blocking
 */
export default function SmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable on admin routes or mobile/touch screens (use native smooth scrolling)
    if (pathname.startsWith('/admin')) {
      return;
    }

    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 992 || window.matchMedia('(pointer: coarse)').matches);

    if (isMobile) {
      return;
    }

    let lenis = null;
    let tickerCallback = null;

    // Defer initialization so initial paint is not blocked
    const initTimer = setTimeout(() => {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
      });

      lenis.on('scroll', ScrollTrigger.update);

      tickerCallback = (time) => {
        if (lenis) lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      lenis.scrollTo(0, { immediate: true });
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (lenis) {
        lenis.destroy();
      }
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
    };
  }, [pathname]);

  return null;
}

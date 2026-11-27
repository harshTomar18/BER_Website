import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal Page Title Manager for BER Services
 * Dynamically updates document.title on every route change,
 * preventing stale titles when navigating across pages.
 */
const ROUTE_TITLES = {
  '/': 'Digital Solutions & Web Development Company | BER Services',
  '/about-us': 'About Us | BER Services PVT. LTD.',
  '/services-we-provide': 'Services We Provide | BER Services',
  '/contact-us': 'Contact Us | BER Services',
  '/news-and-article': 'News and Articles | BER Services',
  '/blog': 'News and Articles | BER Services',
  '/faq': 'Frequently Asked Questions | BER Services',
  '/terms-conditions': 'Terms & Conditions | BER Services',
  '/privacy-policy': 'Privacy Policy | BER Services',
  '/admin/login': 'Admin Login | BER Services Portal',
  '/admin/dashboard': 'Admin Dashboard | BER Services',
  '/admin/inquiries': 'Manage Inquiries | BER Services',
  '/admin/blogs': 'Manage News & Articles | BER Services',
  '/admin/blogs/editor': 'Article Editor | BER Services',
};

export default function PageTitleManager() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    // Check direct match
    if (ROUTE_TITLES[pathname]) {
      document.title = ROUTE_TITLES[pathname];
      return;
    }

    // Dynamic service detail route
    if (pathname.startsWith('/services-we-provide/')) {
      const slug = pathname.replace('/services-we-provide/', '');
      const formatted = slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      document.title = `${formatted} | BER Services`;
      return;
    }

    // Dynamic news detail route
    if (pathname.startsWith('/news-and-article/') || pathname.startsWith('/blog/')) {
      // NewsDetail sets specific article title; keep sensible default fallback
      if (!document.title || document.title.includes('Digital Solutions')) {
        document.title = 'News & Article | BER Services';
      }
      return;
    }

    // Fallback default
    document.title = 'BER Services | Strategy. Marketing. Growth.';
  }, [location.pathname]);

  return null;
}

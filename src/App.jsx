import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ConsultModal from './components/ConsultModal';
import FloatingButtons from './components/FloatingButtons';
import ScrollToTop from './components/ScrollToTop';
import PageTitleManager from './components/PageTitleManager';
import SmoothScroll from './components/SmoothScroll';
import GsapScrollManager from './components/GsapScrollManager';
import Home from './pages/Home';

// Lazy-Loaded Public Pages for Maximum Performance & Sub-Second FCP
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Terms = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terms })));
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy-Loaded Admin Module (Completely isolated from public bundle)
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
const ProtectedRoute = lazy(() => import('./admin/components/ProtectedRoute'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminInquiries = lazy(() => import('./admin/pages/AdminInquiries'));
const AdminBlogList = lazy(() => import('./admin/pages/AdminBlogList'));
const AdminBlogEditor = lazy(() => import('./admin/pages/AdminBlogEditor'));
const AdminCategories = lazy(() => import('./admin/pages/AdminCategories'));
const AdminHeroManager = lazy(() => import('./admin/pages/AdminHeroManager'));
const AdminAboutManager = lazy(() => import('./admin/pages/AdminAboutManager'));
const AdminServicesManager = lazy(() => import('./admin/pages/AdminServicesManager'));
const AdminShowcaseManager = lazy(() => import('./admin/pages/AdminShowcaseManager'));
const AdminFaqManager = lazy(() => import('./admin/pages/AdminFaqManager'));

const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{
      width: '36px',
      height: '36px',
      border: '3px solid rgba(22, 161, 206, 0.2)',
      borderTopColor: '#1385ac',
      borderRadius: '50%',
      animation: 'faqSpin 0.7s linear infinite'
    }}></div>
  </div>
);

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AdminAuthProvider>
      <ScrollToTop />
      <PageTitleManager />
      <SmoothScroll />
      <GsapScrollManager />
      {!isAdminRoute && <Header />}
      <main className={isAdminRoute ? 'admin-main-wrap' : ''}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/services-we-provide" element={<Services />} />
          <Route path="/services-we-provide/:slug" element={<ServiceDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/case-studies" element={<Portfolio />} />
          
          {/* Universal Dynamic Blog Routes (Both /news-and-article and /blog supported) */}
          <Route path="/news-and-article" element={<News />} />
          <Route path="/news-and-article/:slug" element={<NewsDetail />} />
          <Route path="/blog" element={<News />} />
          <Route path="/blog/:slug" element={<NewsDetail />} />

          <Route path="/contact-us" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms-conditions" element={<Terms />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Dedicated Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedRoute>
                <AdminInquiries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute>
                <AdminBlogList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs/new"
            element={
              <ProtectedRoute>
                <AdminBlogEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs/edit/:id"
            element={
              <ProtectedRoute>
                <AdminBlogEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <AdminCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hero"
            element={
              <ProtectedRoute>
                <AdminHeroManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/about"
            element={
              <ProtectedRoute>
                <AdminAboutManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <AdminServicesManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/showcase"
            element={
              <ProtectedRoute>
                <AdminShowcaseManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/faqs"
            element={
              <ProtectedRoute>
                <AdminFaqManager />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ConsultModal />}
      {!isAdminRoute && <FloatingButtons />}
    </AdminAuthProvider>
  );
}

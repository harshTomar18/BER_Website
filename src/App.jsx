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
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Portfolio from './pages/Portfolio';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import { Terms, Privacy } from './pages/Legal';
import NotFound from './pages/NotFound';

// Admin Module
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminInquiries from './admin/pages/AdminInquiries';
import AdminBlogList from './admin/pages/AdminBlogList';
import AdminBlogEditor from './admin/pages/AdminBlogEditor';
import AdminCategories from './admin/pages/AdminCategories';
import AdminHeroManager from './admin/pages/AdminHeroManager';
import AdminAboutManager from './admin/pages/AdminAboutManager';
import AdminServicesManager from './admin/pages/AdminServicesManager';
import AdminShowcaseManager from './admin/pages/AdminShowcaseManager';
import AdminFaqManager from './admin/pages/AdminFaqManager';

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
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ConsultModal />}
      {!isAdminRoute && <FloatingButtons />}
    </AdminAuthProvider>
  );
}

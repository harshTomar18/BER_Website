import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Layers,
  BarChart2,
  ShieldCheck,
  Activity,
  LogOut,
  X,
  User,
  Radio,
  Sparkles,
  Info,
  Award
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../styles/AdminSidebar.css';

export default function AdminSidebar({
  activeTab = 'overview',
  onSelectTab,
  sidebarOpen = false,
  onCloseSidebar,
  leadsCount = 0
}) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      badge: null,
    },
    {
      id: 'leads',
      label: 'Client Inquiries',
      icon: Users,
      path: '/admin/inquiries',
      badge: leadsCount > 0 ? leadsCount : null,
      badgeColor: 'cyan',
    },
    {
      id: 'blogs',
      label: 'Articles & Content Hub',
      icon: FileText,
      path: '/admin/blogs',
      badge: null,
      badgeColor: 'cyan',
    },
    {
      id: 'categories',
      label: 'Taxonomy & Categories',
      icon: Layers,
      path: '/admin/categories',
      badge: null,
    },
    {
      id: 'hero',
      label: 'Home Hero Section',
      icon: Sparkles,
      path: '/admin/hero',
      badge: null,
      badgeColor: 'cyan',
    },
    {
      id: 'about',
      label: 'About BER Manager',
      icon: Info,
      path: '/admin/about',
      badge: null,
      badgeColor: 'cyan',
    },
    {
      id: 'services',
      label: 'Services & Tabs Manager',
      icon: Layers,
      path: '/admin/services',
      badge: null,
      badgeColor: 'cyan',
    },
    {
      id: 'showcase',
      label: 'Clients & Showcase',
      icon: Award,
      path: '/admin/showcase',
      badge: null,
      badgeColor: 'cyan',
    },
    {
      id: 'system',
      label: 'System Status',
      icon: Activity,
      path: null,
      badge: null,
      badgeColor: 'emerald',
    },
  ];

  const userInitial = admin?.name
    ? admin.name.charAt(0).toUpperCase()
    : (admin?.email ? admin.email.charAt(0).toUpperCase() : '');

  const handleItemClick = (item) => {
    if (onSelectTab) onSelectTab(item.id);
    if (item.path) {
      navigate(item.path);
    }
    if (onCloseSidebar) onCloseSidebar();
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {sidebarOpen && (
        <div
          className="asb-backdrop"
          onClick={onCloseSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`asb-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        {/* Top Brand Area */}
        <div className="asb-brand">
          <Link to="/admin/dashboard" className="asb-brand__link">
            <div className="asb-brand__icon-box">
              <ShieldCheck size={22} className="asb-brand__icon" />
            </div>
            <div className="asb-brand__text-box">
              <span className="asb-brand__name">BER SERVICES</span>
              <span className="asb-brand__tag">Admin Console</span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            className="asb-close-btn"
            onClick={onCloseSidebar}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="asb-nav-section">
          <span className="asb-nav-heading">MAIN MENU</span>
          <nav className="asb-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.path && location.pathname.startsWith(item.path) && item.id !== 'overview') ||
                (item.id === 'overview' && location.pathname === '/admin/dashboard' && activeTab === 'overview');

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`asb-nav__item ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  <Icon size={18} className="asb-nav__icon" />
                  <span className="asb-nav__label">{item.label}</span>

                  {item.badge && (
                    <span className={`asb-badge asb-badge--${item.badgeColor || 'default'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>



        {/* Bottom User Profile Section */}
        <div className="asb-footer">
          <div className="asb-user-box">
            <div className="asb-avatar">
              {userInitial ? userInitial : <User size={16} />}
            </div>
            <div className="asb-user-info">
              <span className="asb-user-name">{admin?.name || admin?.email || ''}</span>
              <span className="asb-user-email">{admin?.email || ''}</span>
            </div>
          </div>

          <button
            type="button"
            className="asb-logout-btn"
            onClick={handleLogout}
            title="Sign Out of Admin Console"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

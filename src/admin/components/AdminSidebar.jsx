
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Layers,
  ShieldCheck,
  Activity,
  LogOut,
  X,
  User,
  Sparkles,
  Info,
  Award,
  ChevronDown,
  Globe,
  HelpCircle
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

  const [landingExpanded, setLandingExpanded] = useState(
    location.pathname.startsWith('/admin/hero') ||
    location.pathname.startsWith('/admin/about') ||
    location.pathname.startsWith('/admin/services') ||
    location.pathname.startsWith('/admin/showcase') ||
    location.pathname.startsWith('/admin/faqs')
  );

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const landingPageItems = [
    {
      id: 'hero',
      label: 'Home Hero Section',
      icon: Sparkles,
      path: '/admin/hero',
    },
    {
      id: 'about',
      label: 'About BER Manager',
      icon: Info,
      path: '/admin/about',
    },
    {
      id: 'services',
      label: 'Services & Tabs Manager',
      icon: Layers,
      path: '/admin/services',
    },
    {
      id: 'showcase',
      label: 'Clients & Showcase',
      icon: Award,
      path: '/admin/showcase',
    },
    {
      id: 'blogs',
      label: 'Articles & Content Hub',
      icon: FileText,
      path: '/admin/blogs',
    },
    {
      id: 'categories',
      label: 'Taxonomy & Categories',
      icon: Layers,
      path: '/admin/categories',
    },
    {
      id: 'faqs',
      label: 'FAQ Manager',
      icon: HelpCircle,
      path: '/admin/faqs',
    },
  ];

  const navItems = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
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
      id: 'system',
      label: 'System Status',
      icon: Activity,
      path: null,
    },
  ];

  const userInitial = admin?.name
    ? admin.name.charAt(0).toUpperCase()
    : admin?.email
      ? admin.email.charAt(0).toUpperCase()
      : '';

  const isLandingActive = landingPageItems.some(
    item => location.pathname.startsWith(item.path)
  );

  const handleItemClick = (item) => {
    if (onSelectTab) onSelectTab(item.id);

    if (item.path) {
      navigate(item.path);
    }

    if (onCloseSidebar) onCloseSidebar();
  };

  const handleLandingClick = () => {
    setLandingExpanded(prev => !prev);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="asb-backdrop"
          onClick={onCloseSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`asb-sidebar ${sidebarOpen ? 'is-open' : ''}`}>

        {/* Brand */}
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

          <button
            type="button"
            className="asb-close-btn"
            onClick={onCloseSidebar}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="asb-nav-section">
          <span className="asb-nav-heading">MAIN MENU</span>

          <nav className="asb-nav">

            {/* Normal Navigation Items */}
            {navItems.slice(0, 2).map((item) => {
              const Icon = item.icon;

              const isActive =
                activeTab === item.id ||
                (item.path &&
                  location.pathname.startsWith(item.path) &&
                  item.id !== 'overview') ||
                (item.id === 'overview' &&
                  location.pathname === '/admin/dashboard');

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`asb-nav__item ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  <Icon size={18} className="asb-nav__icon" />

                  <span className="asb-nav__label">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span
                      className={`asb-badge asb-badge--${item.badgeColor || 'default'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Landing Page Parent Menu */}
            <div className={`asb-landing-group ${isLandingActive ? 'is-active' : ''}`}>

              <button
                type="button"
                className={`asb-nav__item asb-landing-toggle ${isLandingActive ? 'is-active' : ''}`}
                onClick={handleLandingClick}
                aria-expanded={landingExpanded}
              >
                <Globe size={18} className="asb-nav__icon" />

                <span className="asb-nav__label">
                  Landing Page
                </span>

                <ChevronDown
                  size={16}
                  className={`asb-chevron ${landingExpanded ? 'is-expanded' : ''}`}
                />
              </button>

              {/* Landing Page Submenus */}
              {landingExpanded && (
                <div className="asb-submenu">
                  {landingPageItems.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                      location.pathname.startsWith(item.path);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`asb-submenu__item ${isActive ? 'is-active' : ''}`}
                        onClick={() => handleItemClick(item)}
                      >
                        <Icon
                          size={16}
                          className="asb-submenu__icon"
                        />

                        <span className="asb-nav__label">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Remaining Navigation Items */}
            {navItems.slice(2).map((item) => {
              const Icon = item.icon;

              const isActive =
                activeTab === item.id ||
                (item.path && location.pathname.startsWith(item.path));

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`asb-nav__item ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  <Icon size={18} className="asb-nav__icon" />

                  <span className="asb-nav__label">
                    {item.label}
                  </span>
                </button>
              );
            })}

          </nav>
        </div>

        {/* User Profile */}
        <div className="asb-footer">
          <div className="asb-user-box">
            <div className="asb-avatar">
              {userInitial || <User size={16} />}
            </div>

            <div className="asb-user-info">
              <span className="asb-user-name">
                {admin?.name || admin?.email || ''}
              </span>

              <span className="asb-user-email">
                {admin?.email || ''}
              </span>
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

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ExternalLink,
  LogOut,
  User,
  Activity,
  ChevronRight
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../styles/AdminNavbar.css';

export default function AdminNavbar({ onToggleSidebar, sidebarOpen }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const userInitial = admin?.name
    ? admin.name.charAt(0).toUpperCase()
    : (admin?.email ? admin.email.charAt(0).toUpperCase() : '');

  return (
    <header className="anb-header">
      <div className="anb-container">
        {/* Left: Mobile Toggle & Breadcrumb */}
        <div className="anb-left">
          <button
            type="button"
            className="anb-toggle-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation Sidebar"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>


        </div>



        {/* Right: Actions & User Profile */}
        <div className="anb-right">
          {/* View Public Website */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="anb-site-link"
            title="View Live Public Website"
          >
            <ExternalLink size={15} />
            <span className="anb-site-link__text">View Site</span>
          </Link>

          {/* User Profile Pill */}
          <div className="anb-user-pill">
            <div className="anb-user-avatar">
              {userInitial ? userInitial : <User size={15} />}
            </div>
            <div className="anb-user-details">
              <span className="anb-user-name">{admin?.name || admin?.email || ''}</span>
              {admin?.role && <span className="anb-user-role">{admin.role}</span>}
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            className="anb-btn-logout"
            onClick={handleLogout}
            title="Terminate Admin Session"
          >
            <LogOut size={16} />
            <span className="anb-btn-logout__text">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

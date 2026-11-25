import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import '../styles/AdminLayout.css';

export default function AdminLayout({ 
  children, 
  activeTab = 'overview', 
  onSelectTab, 
  leadsCount = 0 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="lay-container">
      {/* Dedicated Left Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={closeSidebar}
        leadsCount={leadsCount}
      />

      {/* Main Workspace Area (Navbar on top + Scrollable Children Content) */}
      <div className="lay-body">
        <AdminNavbar
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        <main className="lay-content">
          {children}
        </main>
      </div>
    </div>
  );
}

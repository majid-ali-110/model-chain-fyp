import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg-primary text-dark-text-primary">
      <Navbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 pt-[var(--navbar-height)]">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto">
          <div className="page-shell page-content">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
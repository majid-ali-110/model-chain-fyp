import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';

const DashboardLayout = ({ children }) => {
  // Mobile drawer state. On desktop (lg+) the sidebar is always visible and
  // this value is ignored.
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Close the drawer on navigation and lock body scroll while it's open.
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg-primary text-dark-text-primary">
      <Navbar />
      <div className="flex flex-1 pt-[var(--navbar-height)]">
        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 top-[var(--navbar-height)] z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar — off-canvas drawer below lg, static column at lg+ */}
        <aside
          className={clsx(
            'w-64 max-w-[80vw] flex-shrink-0 transform transition-transform duration-300 ease-in-out',
            'fixed top-[var(--navbar-height)] bottom-0 left-0 z-40',
            'lg:static lg:top-auto lg:z-auto lg:translate-x-0',
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
          aria-label="Dashboard navigation"
        >
          <Sidebar isOpen />
        </aside>

        <main className="flex-1 min-w-0 overflow-x-hidden">
          {/* Mobile-only toggle to open the dashboard navigation drawer */}
          <div className="lg:hidden sticky top-[var(--navbar-height)] z-20 -mt-px bg-dark-bg-primary/80 backdrop-blur-md border-b border-dark-border/60">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-dark-text-secondary hover:text-dark-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
              aria-expanded={mobileSidebarOpen}
              aria-label="Open dashboard menu"
            >
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
              Menu
            </button>
          </div>

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

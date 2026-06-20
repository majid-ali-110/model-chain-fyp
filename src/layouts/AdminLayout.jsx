import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';

const AdminLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

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
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 top-[var(--navbar-height)] z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <aside
          className={clsx(
            'w-64 max-w-[80vw] flex-shrink-0 transform transition-transform duration-300 ease-in-out',
            'fixed top-[var(--navbar-height)] bottom-0 left-0 z-40',
            'lg:static lg:top-auto lg:z-auto lg:translate-x-0',
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
          aria-label="Admin navigation"
        >
          <Sidebar isOpen />
        </aside>

        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="lg:hidden sticky top-[var(--navbar-height)] z-20 -mt-px bg-dark-bg-primary/80 backdrop-blur-md border-b border-dark-border/60">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-dark-text-secondary hover:text-dark-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
              aria-expanded={mobileSidebarOpen}
              aria-label="Open admin menu"
            >
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
              Menu
            </button>
          </div>

          <div className="page-shell page-content">
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
              <strong className="font-bold">Admin Panel:</strong>
              <span className="block sm:inline"> You are accessing administrative functions.</span>
            </div>
            {children || <Outlet />}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;

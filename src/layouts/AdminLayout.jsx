import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg-primary text-dark-text-primary">
      <Navbar />
      <div className="flex flex-1 pt-[var(--navbar-height)]">
        <Sidebar />
        <main className="flex-1 overflow-auto">
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
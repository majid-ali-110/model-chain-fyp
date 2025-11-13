import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
              <strong className="font-bold">Admin Panel:</strong>
              <span className="block sm:inline"> You are accessing administrative functions.</span>
            </div>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      {/* Add padding-top to account for fixed navbar (80px = h-20) */}
      <div className="flex flex-1" style={{ paddingTop: '80px' }}>
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
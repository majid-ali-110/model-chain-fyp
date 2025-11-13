import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/**
 * Clean Dashboard Layout - No sidebar, no container constraints
 * Full-width layout with only header and footer
 */
const CleanLayout = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a0c10' }}>
      <Navbar />
      {/* Add padding-top to account for fixed navbar (80px = h-20) */}
      <main className="flex-1" style={{ paddingTop: '80px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CleanLayout;

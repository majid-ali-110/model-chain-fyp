import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Container from '../components/layout/Container';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a0c10', color: '#ffffff' }}>
      <Navbar />
      {/* Add padding-top to account for fixed navbar (80px = h-20) */}
      <main className="flex-grow" style={{ paddingTop: '80px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg-primary text-dark-text-primary">
      <Navbar />
      <main className="flex-1 pt-[var(--navbar-height)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
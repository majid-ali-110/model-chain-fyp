import React from 'react';
import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, UsersIcon, RocketLaunchIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';

const About = () => {
  return (
    <div className="min-h-screen bg-dark-surface-primary py-12">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center text-dark-text-secondary mb-4">
            <Link to="/" className="hover:text-primary-400">Home</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-dark-text-primary">About Us</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">ModelChain</span>
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl">
            Building the future of decentralized AI model marketplace.
          </p>
        </div>

        <Card variant="elevated" className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark-text-primary mb-4">Our Mission</h2>
          <p className="text-dark-text-secondary mb-6">
            ModelChain is democratizing AI by creating a decentralized marketplace where developers can
            share, monetize, and access AI models securely using blockchain technology. We believe in
            making AI accessible to everyone while ensuring creators are fairly compensated.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <BuildingOfficeIcon className="h-12 w-12 text-primary-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-dark-text-primary mb-2">Established 2023</h3>
              <p className="text-dark-text-secondary">Leading the AI revolution</p>
            </div>
            <div className="text-center">
              <UsersIcon className="h-12 w-12 text-secondary-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-dark-text-primary mb-2">50K+ Developers</h3>
              <p className="text-dark-text-secondary">Global community</p>
            </div>
            <div className="text-center">
              <RocketLaunchIcon className="h-12 w-12 text-accent-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-dark-text-primary mb-2">25K+ Models</h3>
              <p className="text-dark-text-secondary">Available marketplace</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, LockClosedIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';

const Security = () => {
  return (
    <div className="min-h-screen bg-dark-surface-primary py-12">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center text-dark-text-secondary mb-4">
            <Link to="/" className="hover:text-primary-400">Home</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-dark-text-primary">Security</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Security
            </span> & Trust
          </h1>
        </div>

        <Card variant="elevated" className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ShieldCheckIcon className="h-12 w-12 text-primary-400 mb-4" />
              <h3 className="text-xl font-bold text-dark-text-primary mb-3">Blockchain Security</h3>
              <p className="text-dark-text-secondary">All transactions secured by smart contracts on immutable blockchain.</p>
            </div>
            <div>
              <LockClosedIcon className="h-12 w-12 text-secondary-400 mb-4" />
              <h3 className="text-xl font-bold text-dark-text-primary mb-3">Data Encryption</h3>
              <p className="text-dark-text-secondary">End-to-end encryption for all model files and user data.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Security;

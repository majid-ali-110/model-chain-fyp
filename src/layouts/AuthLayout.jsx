import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">MC</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-secondary-900">
            ModelChain
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Decentralized AI Model Marketplace
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-secondary-200 mb-4">404</div>
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-secondary-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button>
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
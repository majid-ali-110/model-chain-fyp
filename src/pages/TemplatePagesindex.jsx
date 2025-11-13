// Template pages for quick implementation
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';

const createPage = (title, subtitle, icon, content) => {
  return () => (
    <div className="min-h-screen bg-dark-surface-primary py-12">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center text-dark-text-secondary mb-4">
            <Link to="/" className="hover:text-primary-400">Home</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-dark-text-primary">{title}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              {title}
            </span>
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl">{subtitle}</p>
        </div>

        <Card variant="elevated" className="p-8">
          {content}
        </Card>
      </div>
    </div>
  );
};

// Export all pages
export const Blog = createPage('Blog & News', 'Latest updates and news from ModelChain', null, 
  <div className="text-dark-text-secondary">Stay tuned for the latest ModelChain updates, tutorials, and community highlights.</div>
);

export const Careers = createPage('Careers', 'Join our team and build the future of AI', null,
  <div className="text-dark-text-secondary">We're building an amazing team. Check back soon for open positions or email us at careers@modelchain.io</div>
);

export const Contact = createPage('Contact Us', 'Get in touch with the ModelChain team', null,
  <div className="space-y-4">
    <p className="text-dark-text-secondary">Email: support@modelchain.io</p>
    <p className="text-dark-text-secondary">Discord: discord.gg/modelchain</p>
    <p className="text-dark-text-secondary">Twitter: @modelchain</p>
  </div>
);

export const Press = createPage('Press Kit', 'Media resources and brand assets', null,
  <div className="text-dark-text-secondary">Download our logos, brand guidelines, and press materials.</div>
);

export const Status = createPage('Status Page', 'System status and uptime', null,
  <div className="space-y-4">
    <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-lg">
      <span className="text-dark-text-primary">All Systems Operational</span>
      <span className="text-green-400 font-bold">99.9% Uptime</span>
    </div>
  </div>
);

export const Community = createPage('Community', 'Join the ModelChain community', null,
  <div className="text-dark-text-secondary">Connect with developers, validators, and AI enthusiasts worldwide.</div>
);

export const Documentation = createPage('Documentation', 'Complete ModelChain documentation', null,
  <div className="space-y-4">
    <Link to="/docs/api" className="block p-4 bg-dark-surface rounded-lg hover:bg-dark-surface-hover">API Documentation</Link>
    <Link to="/docs/sdk" className="block p-4 bg-dark-surface rounded-lg hover:bg-dark-surface-hover">SDK & Tools</Link>
    <Link to="/docs/validation" className="block p-4 bg-dark-surface rounded-lg hover:bg-dark-surface-hover">Validation Guidelines</Link>
    <Link to="/docs/node-setup" className="block p-4 bg-dark-surface rounded-lg hover:bg-dark-surface-hover">Node Setup</Link>
  </div>
);

export const Support = createPage('Support Center', 'Get help and support', null,
  <div className="text-dark-text-secondary">Browse our knowledge base or contact support for assistance.</div>
);

export const DeveloperSupport = createPage('Developer Support', 'Technical support for developers', null,
  <div className="text-dark-text-secondary">Get technical help with API integration, SDK usage, and development.</div>
);

export const CookiePolicy = createPage('Cookie Policy', 'How we use cookies', null,
  <div className="text-dark-text-secondary">
    <p className="mb-4">ModelChain uses cookies to enhance your experience and analyze site usage.</p>
    <p>By continuing to use this site, you consent to our use of cookies.</p>
  </div>
);

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon,
  CubeIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const Footer = ({ className = '' }) => {
  const footerLinks = {
    product: {
      title: 'Product',
      icon: CubeIcon,
      links: [
        { name: 'Marketplace', href: '/marketplace' },
        { name: 'Sandbox', href: '/sandbox' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Governance', href: '/governance' },
      ],
    },
    developers: {
      title: 'Developers',
      icon: DocumentTextIcon,
      links: [
        { name: 'Upload Model', href: '/developer/upload' },
      ],
    },
    validators: {
      title: 'Validators',
      icon: ShieldCheckIcon,
      links: [
        { name: 'Validator Dashboard', href: '/validator' },
      ],
    },
    legal: {
      title: 'Legal',
      icon: ScaleIcon,
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
  };

  return (
    <footer className={clsx(
      'bg-gradient-to-b from-dark-bg-primary to-dark-bg-secondary',
      'border-t border-dark-surface-elevated/20',
      className
    )}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          {/* Logo and Description */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <img 
                  src="/modelchainlogo-removebg-preview.png" 
                  alt="ModelChain Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-black text-white">Model</span>
                  <span className="text-xl font-black bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Chain</span>
                </div>
                <div className="text-[9px] font-semibold tracking-[0.15em] text-primary-400/80 -mt-0.5">DECENTRALIZED AI</div>
              </div>
            </div>
            <p className="text-dark-text-secondary text-sm leading-6 mb-6">
              The world's first decentralized AI model marketplace. Discover, validate, and monetize AI models on the blockchain with complete transparency and security.
            </p>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section]) => {
            const Icon = section.icon;
            return (
              <div key={key} className="col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <Icon className="h-5 w-5 text-accent-400" />
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-dark-text-muted hover:text-accent-400 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-dark-surface-elevated/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
              <p className="text-sm text-dark-text-muted">
                © {new Date().getFullYear()} ModelChain. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link to="/terms" className="text-sm text-dark-text-muted hover:text-accent-400 transition-colors">
                  Terms
                </Link>
                <Link to="/privacy" className="text-sm text-dark-text-muted hover:text-accent-400 transition-colors">
                  Privacy
                </Link>
                <Link to="/faq" className="text-sm text-dark-text-muted hover:text-accent-400 transition-colors">
                  FAQ
                </Link>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-2 text-sm text-dark-text-muted">
              <span>Built with</span>
              <HeartIcon className="h-4 w-4 text-red-500 animate-pulse" />
              <span>for the AI community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
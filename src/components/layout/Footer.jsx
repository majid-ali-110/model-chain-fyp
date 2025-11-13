import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon,
  ArrowRightIcon,
  HeartIcon,
  CubeIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../ui/Button';

const Footer = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Mock newsletter signup - replace with actual API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  const footerLinks = {
    product: {
      title: 'Product',
      icon: CubeIcon,
      links: [
        { name: 'Marketplace', href: '/marketplace' },
        { name: 'Sandbox', href: '/sandbox' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Governance', href: '/governance' },
        { name: 'Staking', href: '/staking' },
      ],
    },
    developers: {
      title: 'Developers',
      icon: DocumentTextIcon,
      links: [
        { name: 'Upload Model', href: '/developer/upload' },
        { name: 'API Documentation', href: '/docs/api' },
        { name: 'SDK & Tools', href: '/docs/sdk' },
        { name: 'GitHub', href: 'https://github.com/modelchain' },
        { name: 'Developer Support', href: '/support/developers' },
      ],
    },
    validators: {
      title: 'Validators',
      icon: ShieldCheckIcon,
      links: [
        { name: 'Validator Dashboard', href: '/validator' },
        { name: 'Leaderboard', href: '/validator/leaderboard' },
        { name: 'Rewards Program', href: '/validator/rewards' },
        { name: 'Validation Guidelines', href: '/docs/validation' },
        { name: 'Node Setup', href: '/docs/node-setup' },
      ],
    },
    company: {
      title: 'Company',
      icon: BuildingOfficeIcon,
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Blog & News', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
        { name: 'Press Kit', href: '/press' },
      ],
    },
    legal: {
      title: 'Legal',
      icon: ScaleIcon,
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Security', href: '/security' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
  };

  const socialLinks = [
    { 
      name: 'Twitter', 
      href: 'https://twitter.com/modelchain', 
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )
    },
    { 
      name: 'GitHub', 
      href: 'https://github.com/modelchain', 
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'Discord', 
      href: 'https://discord.gg/modelchain', 
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
        </svg>
      )
    },
    { 
      name: 'LinkedIn', 
      href: 'https://linkedin.com/company/modelchain', 
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'Telegram', 
      href: 'https://t.me/modelchain', 
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      )
    },
  ];

  const quickLinks = [
    { name: 'Status Page', href: '/status', icon: GlobeAltIcon },
    { name: 'Community', href: '/community', icon: UserGroupIcon },
    { name: 'Documentation', href: '/docs', icon: DocumentTextIcon },
    { name: 'Support Center', href: '/support', icon: ShieldCheckIcon },
  ];

  return (
    <footer className={clsx(
      'bg-gradient-to-b from-dark-bg-primary to-dark-bg-secondary',
      'border-t border-dark-surface-elevated/20',
      className
    )}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 rounded-2xl p-8 border border-primary-500/20 backdrop-blur-sm">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Stay in the loop
                </h2>
                <p className="mt-2 max-w-3xl text-lg text-dark-text-secondary">
                  Get the latest updates on new AI models, platform features, and blockchain innovations delivered to your inbox.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8 lg:flex-shrink-0">
                {!isSubscribed ? (
                  <form onSubmit={handleNewsletterSubmit} className="sm:flex">
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={clsx(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-dark-surface-elevated border border-dark-surface-elevated',
                        'text-dark-text-primary placeholder:text-dark-text-muted',
                        'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        'sm:max-w-xs'
                      )}
                      placeholder="Enter your email"
                    />
                    <div className="mt-3 sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        glow
                        loading={isLoading}
                        className="w-full sm:w-auto"
                      >
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        Subscribe
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center space-x-2 text-accent-400">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-accent-500 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-medium">Thanks for subscribing!</p>
                      <p className="text-sm text-dark-text-muted">Check your inbox for a confirmation email.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
            
            {/* Quick Links */}
            <div className="space-y-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="flex items-center text-sm text-dark-text-muted hover:text-accent-400 transition-colors group"
                  >
                    <Icon className="h-4 w-4 mr-2 text-dark-text-muted group-hover:text-accent-400 transition-colors" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
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
                        className="text-sm text-dark-text-muted hover:text-accent-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
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

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-dark-surface-elevated/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-dark-text-muted">Follow us:</span>
              <div className="flex space-x-4">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        'p-2 rounded-lg transition-all duration-200',
                        'text-dark-text-muted hover:text-accent-400',
                        'bg-dark-surface-elevated/30 hover:bg-accent-500/10',
                        'hover:shadow-lg hover:shadow-accent-500/20',
                        'hover:scale-110 transform'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${item.name}`}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 md:mt-0 flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-dark-text-muted">
                <span>Built with</span>
                <HeartIcon className="h-4 w-4 text-red-500 animate-pulse" />
                <span>for the AI community</span>
              </div>
            </div>
          </div>
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
                <Link to="/cookies" className="text-sm text-dark-text-muted hover:text-accent-400 transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-dark-text-muted">
                <span>Network Status:</span>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-accent-500 rounded-full animate-pulse"></div>
                  <span className="text-accent-400 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
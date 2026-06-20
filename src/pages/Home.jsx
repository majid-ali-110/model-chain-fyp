import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CpuChipIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  TrophyIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  LockClosedIcon,
  BeakerIcon,
  LightBulbIcon,
  WalletIcon,
  CubeTransparentIcon
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import WalletConnectModal from '../components/wallet/WalletConnectModal';
import { useWallet } from '../contexts/WalletContext';
import { useModel } from '../contexts/ModelContext';

const Home = () => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { connected, connectWallet, connecting } = useWallet();
  const { models, loadModels } = useModel();

  useEffect(() => {
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featuredModels = [...(models || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
    .map(m => ({
      ...m,
      price: parseFloat(m.price || '0') === 0 ? 'Free' : `${parseFloat(m.price).toFixed(4)} POL`,
    }));

  const statistics = [
    { label: 'AI Models', value: '0', color: 'text-blue-400' },
    { label: 'Total Transactions', value: '--', color: 'text-green-400' },
    { label: 'Active Developers', value: '0', color: 'text-purple-400' },
    { label: 'Model Downloads', value: '0', color: 'text-yellow-400' }
  ];

  const howItWorksSteps = [
    { step: 1, title: 'Browse Models', description: 'Explore our marketplace of AI models across categories like NLP, computer vision, and audio processing.', icon: GlobeAltIcon, color: 'text-blue-400' },
    { step: 2, title: 'Test & Validate', description: 'Use our sandbox environment to test models before purchase. See real performance metrics.', icon: BeakerIcon, color: 'text-green-400' },
    { step: 3, title: 'Secure Purchase', description: 'Buy models using cryptocurrency with smart contract protection. Instant access upon payment.', icon: LockClosedIcon, color: 'text-purple-400' },
    { step: 4, title: 'Deploy & Earn', description: 'Integrate models into your applications or contribute your own models to earn passive income.', icon: RocketLaunchIcon, color: 'text-yellow-400' }
  ];

  const trustIndicators = [
    { name: 'Blockchain Security', icon: ShieldCheckIcon, description: 'All transactions secured by smart contracts' },
    { name: 'Model Verification', icon: CheckCircleIcon, description: 'Rigorous testing and validation process' },
    { name: 'Community Driven', icon: UsersIcon, description: 'Governed by our global developer community' },
    { name: 'Open Source', icon: CubeTransparentIcon, description: 'Transparent and auditable codebase' }
  ];

  return (
    <div className="min-h-screen bg-dark-surface-primary">

      {/* Hero Section */}
      <section
        className="relative py-24 flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1525 50%, #0a0e1a 100%)' }}
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <img
                src="/modelchainlogo-removebg-preview.png"
                alt="ModelChain Logo"
                className="h-48 md:h-64 w-auto"
                style={{ filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.3))' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Decentralized AI Marketplace
            </h1>

            <p className="text-lg md:text-xl text-dark-text-secondary mb-6 max-w-2xl mx-auto">
              Buy, sell, and validate AI models with{' '}
              <span className="text-primary-400 font-semibold">blockchain security</span>.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="primary" size="lg" className="flex items-center">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                Blockchain Secured
              </Badge>
              <Badge variant="secondary" size="lg" className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Verified Models
              </Badge>
              <Badge variant="accent" size="lg" className="flex items-center">
                <TrophyIcon className="h-4 w-4 mr-2" />
                Industry Leading
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/marketplace/models">
                <Button size="lg">
                  <GlobeAltIcon className="h-5 w-5 mr-2" />
                  Explore Marketplace
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/sandbox">
                <Button variant="outline" size="lg">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Try Demo
                </Button>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-dark-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models Section */}
      <section className="py-16 container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-dark-text-primary mb-3">Featured Models</h2>
          <p className="text-dark-text-secondary max-w-xl mx-auto">Discover top-rated AI models from our community of developers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredModels.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <CpuChipIcon className="h-14 w-14 mx-auto mb-4 text-dark-text-muted opacity-50" />
              <h3 className="text-lg font-semibold text-dark-text-primary mb-2">No Models Yet</h3>
              <p className="text-dark-text-secondary mb-6">Be the first to upload an AI model to the marketplace</p>
              <Link to="/developer/upload"><Button variant="primary">Upload Your Model</Button></Link>
            </div>
          ) : featuredModels.map((model) => (
            <Card key={model.id} variant="elevated" className="overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" size="sm">{model.category}</Badge>
                  <span className="text-base font-bold text-primary-400">{model.price}</span>
                </div>
                <h3 className="text-lg font-semibold text-dark-text-primary mb-1">{model.name}</h3>
                <p className="text-sm text-dark-text-secondary mb-4 line-clamp-2">{model.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-text-muted">{model.downloads || 0} downloads</span>
                  <Link to={`/marketplace/models/${model.id}`}><Button size="sm" variant="primary">View Details</Button></Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/marketplace/models">
            <Button variant="outline" size="lg">
              View All Models
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-dark-surface-elevated/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-dark-text-primary mb-3">How It Works</h2>
            <p className="text-dark-text-secondary max-w-xl mx-auto">Get started with ModelChain in four simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30">
                  <step.icon className={`h-7 w-7 ${step.color}`} />
                </div>
                <div className="text-xs font-semibold text-primary-400 mb-1">Step {step.step}</div>
                <h3 className="text-base font-bold text-dark-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-dark-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="py-16 container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-dark-text-primary mb-3">Tokenomics</h2>
          <p className="text-dark-text-secondary max-w-xl mx-auto">Built on a sustainable and transparent economic model</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <Card variant="elevated" className="p-5">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mr-4 shrink-0">
                  <CurrencyDollarIcon className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-text-primary">Model Sales</h3>
                  <p className="text-sm text-dark-text-secondary">70% to creators, 20% to validators, 10% to platform</p>
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="p-5">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-4 shrink-0">
                  <TrophyIcon className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-text-primary">Validation Rewards</h3>
                  <p className="text-sm text-dark-text-secondary">Earn tokens for validating model quality and performance</p>
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="p-5">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4 shrink-0">
                  <LightBulbIcon className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-text-primary">Governance Rights</h3>
                  <p className="text-sm text-dark-text-secondary">Token holders vote on platform improvements and policies</p>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <div className="w-56 h-56 mx-auto relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#3B82F6" strokeWidth="8" fill="none" strokeDasharray="125.6 251.2" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="8" fill="none" strokeDasharray="75.36 251.2" strokeDashoffset="-125.6" />
                <circle cx="50" cy="50" r="40" stroke="#F59E0B" strokeWidth="8" fill="none" strokeDasharray="50.24 251.2" strokeDashoffset="-200.96" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">MCT</div>
                  <div className="text-xs text-dark-text-muted">Token</div>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-2 max-w-xs mx-auto">
              <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded mr-3 shrink-0" /><span className="text-sm text-dark-text-secondary">Community &amp; Ecosystem (50%)</span></div>
              <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-3 shrink-0" /><span className="text-sm text-dark-text-secondary">Team &amp; Advisors (30%)</span></div>
              <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded mr-3 shrink-0" /><span className="text-sm text-dark-text-secondary">Treasury &amp; Operations (20%)</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-16 bg-dark-surface-elevated/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-dark-text-primary mb-3">Why Trust ModelChain?</h2>
            <p className="text-dark-text-secondary max-w-xl mx-auto">Built with security, transparency, and community at its core</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="bg-dark-surface-elevated border border-dark-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                  <indicator.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{indicator.name}</h3>
                <p className="text-sm text-dark-text-muted">{indicator.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-dark-text-primary mb-4">Ready to Get Started?</h2>
          <p className="text-dark-text-secondary mb-8 max-w-xl mx-auto">
            Join developers who are already building the future of AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {connected ? (
              <Link to="/marketplace/models">
                <Button size="lg">
                  <CubeTransparentIcon className="h-5 w-5 mr-2" />
                  Explore Marketplace
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" onClick={() => setShowWalletModal(true)}>
                <WalletIcon className="h-5 w-5 mr-2" />
                Connect Wallet to Start
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            )}
            <Link to="/marketplace/models">
              <Button variant="outline" size="lg">
                <LightBulbIcon className="h-5 w-5 mr-2" />
                Browse Models
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={connectWallet}
        isConnecting={connecting}
      />
    </div>
  );
};

export default Home;

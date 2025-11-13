import React from 'react';
import { Link } from 'react-router-dom';
import { TrophyIcon, CurrencyDollarIcon, ChevronRightIcon, GiftIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';

const RewardsProgram = () => {
  const rewardTiers = [
    { tier: 'Bronze', minValidations: 100, rewardRate: '1.5x', bonus: '500 MCT', color: 'orange-600' },
    { tier: 'Silver', minValidations: 500, rewardRate: '2.0x', bonus: '2,500 MCT', color: 'gray-400' },
    { tier: 'Gold', minValidations: 1000, rewardRate: '2.5x', bonus: '7,500 MCT', color: 'yellow-400' },
    { tier: 'Platinum', minValidations: 5000, rewardRate: '3.0x', bonus: '25,000 MCT', color: 'cyan-400' },
    { tier: 'Diamond', minValidations: 10000, rewardRate: '4.0x', bonus: '75,000 MCT', color: 'purple-400' }
  ];

  const rewardTypes = [
    {
      title: 'Base Validation Rewards',
      description: 'Earn MCT tokens for each successful model validation',
      rate: '10-50 MCT per validation',
      icon: CurrencyDollarIcon
    },
    {
      title: 'Accuracy Bonuses',
      description: 'Additional rewards for maintaining high validation accuracy',
      rate: 'Up to 25% bonus',
      icon: ChartBarIcon
    },
    {
      title: 'Consistency Rewards',
      description: 'Extra tokens for validators with consistent uptime',
      rate: '100-500 MCT weekly',
      icon: GiftIcon
    },
    {
      title: 'Performance Multipliers',
      description: 'Tier-based multipliers on all earned rewards',
      rate: '1.5x - 4.0x multiplier',
      icon: TrophyIcon
    }
  ];

  return (
    <div className="min-h-screen bg-dark-surface-primary py-12">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center text-dark-text-secondary mb-4">
            <Link to="/" className="hover:text-primary-400">Home</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <Link to="/validator" className="hover:text-primary-400">Validator</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-dark-text-primary">Rewards Program</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Validator Rewards
            </span> Program
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl">
            Earn tokens and bonuses for securing the ModelChain network through validation.
          </p>
        </div>

        {/* Reward Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {rewardTypes.map((type, index) => (
            <Card key={index} variant="elevated" className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-500/20 rounded-lg p-3 flex-shrink-0">
                  <type.icon className="h-8 w-8 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-text-primary mb-2">{type.title}</h3>
                  <p className="text-dark-text-secondary mb-3">{type.description}</p>
                  <div className="text-primary-400 font-semibold">{type.rate}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Reward Tiers */}
        <Card variant="elevated" className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark-text-primary mb-6">Validator Tiers</h2>
          <div className="space-y-4">
            {rewardTiers.map((tier, index) => (
              <div key={index} className="bg-dark-surface rounded-lg p-6 border border-dark-border hover:border-primary-400/50 transition-all">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${tier.color} to-${tier.color}/50 flex items-center justify-center`}>
                      <TrophyIcon className={`h-6 w-6 text-${tier.color}`} />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold text-${tier.color}`}>{tier.tier}</h3>
                      <p className="text-dark-text-secondary text-sm">{tier.minValidations}+ validations required</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-dark-text-secondary text-sm">Reward Multiplier</p>
                      <p className="text-2xl font-bold text-dark-text-primary">{tier.rewardRate}</p>
                    </div>
                    <div>
                      <p className="text-dark-text-secondary text-sm">Tier Bonus</p>
                      <p className="text-2xl font-bold text-primary-400">{tier.bonus}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Distribution */}
        <Card variant="elevated" className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark-text-primary mb-6">Monthly Reward Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-dark-text-secondary mb-2">Total Pool</p>
              <p className="text-4xl font-bold text-primary-400 mb-1">100,000 MCT</p>
              <p className="text-sm text-dark-text-secondary">Distributed monthly</p>
            </div>
            <div className="text-center">
              <p className="text-dark-text-secondary mb-2">Avg Per Validator</p>
              <p className="text-4xl font-bold text-secondary-400 mb-1">2,850 MCT</p>
              <p className="text-sm text-dark-text-secondary">Based on performance</p>
            </div>
            <div className="text-center">
              <p className="text-dark-text-secondary mb-2">Top Validator</p>
              <p className="text-4xl font-bold text-accent-400 mb-1">15,420 MCT</p>
              <p className="text-sm text-dark-text-secondary">Last month's leader</p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <Card variant="elevated" className="p-8 text-center">
          <GiftIcon className="h-16 w-16 text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-text-primary mb-4">Start Earning Today</h2>
          <p className="text-dark-text-secondary mb-6">
            Join our validator network and start earning rewards for securing the network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/validator">
              <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Become a Validator
              </button>
            </Link>
            <Link to="/validator/leaderboard">
              <button className="border-2 border-primary-500 text-primary-400 px-8 py-3 rounded-lg font-semibold hover:bg-primary-500/10 transition-all">
                View Leaderboard
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RewardsProgram;

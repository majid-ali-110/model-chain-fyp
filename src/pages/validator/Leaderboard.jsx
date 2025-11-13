import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrophyIcon, FireIcon, ShieldCheckIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const Leaderboard = () => {
  const [timeFrame, setTimeFrame] = useState('all-time');
  
  const validators = [
    { rank: 1, name: 'CryptoValidator', address: '0x1234...5678', validations: 15420, accuracy: 99.8, rewards: '45,230 MCT', badge: 'legendary' },
    { rank: 2, name: 'AIGuardian', address: '0xabcd...ef01', validations: 14850, accuracy: 99.5, rewards: '42,180 MCT', badge: 'legendary' },
    { rank: 3, name: 'ModelMaster', address: '0x2468...acef', validations: 13920, accuracy: 99.3, rewards: '39,450 MCT', badge: 'legendary' },
    { rank: 4, name: 'BlockValidator', address: '0x9876...5432', validations: 12100, accuracy: 98.9, rewards: '35,120 MCT', badge: 'elite' },
    { rank: 5, name: 'NodeRunner', address: '0xfedc...ba98', validations: 11200, accuracy: 98.7, rewards: '32,800 MCT', badge: 'elite' },
    { rank: 6, name: 'ChainGuard', address: '0x1357...2468', validations: 9850, accuracy: 98.5, rewards: '28,950 MCT', badge: 'elite' },
    { rank: 7, name: 'ValidatorPro', address: '0xbcde...4321', validations: 8920, accuracy: 98.2, rewards: '26,100 MCT', badge: 'pro' },
    { rank: 8, name: 'TechValidator', address: '0x5678...9012', validations: 8100, accuracy: 97.9, rewards: '23,800 MCT', badge: 'pro' },
    { rank: 9, name: 'AIValidator', address: '0x3456...7890', validations: 7500, accuracy: 97.5, rewards: '21,950 MCT', badge: 'pro' },
    { rank: 10, name: 'SecureNode', address: '0x8901...2345', validations: 6890, accuracy: 97.2, rewards: '20,200 MCT', badge: 'pro' }
  ];

  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'elite': return 'from-purple-400 to-pink-500';
      case 'pro': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-dark-surface-primary py-12">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center text-dark-text-secondary mb-4">
            <Link to="/" className="hover:text-primary-400">Home</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <Link to="/validator" className="hover:text-primary-400">Validator</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-dark-text-primary">Leaderboard</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Validator
            </span> Leaderboard
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl">
            Top validators ranked by performance, accuracy, and contributions to the network.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Total Validators</p>
                <p className="text-3xl font-bold text-dark-text-primary">1,248</p>
              </div>
              <ShieldCheckIcon className="h-12 w-12 text-primary-400" />
            </div>
          </Card>
          
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Total Validations</p>
                <p className="text-3xl font-bold text-dark-text-primary">2.4M</p>
              </div>
              <FireIcon className="h-12 w-12 text-orange-400" />
            </div>
          </Card>
          
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Rewards Paid</p>
                <p className="text-3xl font-bold text-dark-text-primary">850K MCT</p>
              </div>
              <TrophyIcon className="h-12 w-12 text-yellow-400" />
            </div>
          </Card>
          
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Avg Accuracy</p>
                <p className="text-3xl font-bold text-dark-text-primary">98.2%</p>
              </div>
              <StarIcon className="h-12 w-12 text-green-400" />
            </div>
          </Card>
        </div>

        {/* Time Frame Toggle */}
        <div className="flex gap-4 mb-6">
          {['today', 'week', 'month', 'all-time'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                timeFrame === tf
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-surface text-dark-text-secondary hover:bg-dark-surface-hover'
              }`}
            >
              {tf.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border bg-dark-surface">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary">Validator</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary">Validations</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary">Accuracy</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary">Rewards Earned</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary">Badge</th>
                </tr>
              </thead>
              <tbody>
                {validators.map((validator) => (
                  <tr
                    key={validator.rank}
                    className="border-b border-dark-border hover:bg-dark-surface transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {validator.rank <= 3 && (
                          <TrophyIcon className={`h-5 w-5 ${
                            validator.rank === 1 ? 'text-yellow-400' :
                            validator.rank === 2 ? 'text-gray-400' :
                            'text-orange-600'
                          }`} />
                        )}
                        <span className="text-lg font-bold text-dark-text-primary">#{validator.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-dark-text-primary">{validator.name}</p>
                        <p className="text-sm text-dark-text-secondary font-mono">{validator.address}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-dark-text-primary font-semibold">{validator.validations.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-400 font-semibold">{validator.accuracy}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-primary-400 font-semibold">{validator.rewards}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getBadgeColor(validator.badge)} text-white`}>
                        {validator.badge.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* CTA */}
        <Card variant="elevated" className="p-8 text-center mt-8">
          <TrophyIcon className="h-16 w-16 text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-text-primary mb-4">Join the Leaderboard</h2>
          <p className="text-dark-text-secondary mb-6">
            Become a validator and compete for the top spot while earning rewards.
          </p>
          <Link to="/validator">
            <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Start Validating
            </button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;

import React, { useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  SparklesIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  MinusIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  BanknotesIcon,
  UsersIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useNotification } from '../../contexts/NotificationContext';

const Governance = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [selectedVote, setSelectedVote] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [delegateAddress, setDelegateAddress] = useState('');
  const [isDelegated, setIsDelegated] = useState(false);
  const [delegatedTo, setDelegatedTo] = useState('0x8a3f...4c2d');
  const [userVotes, setUserVotes] = useState({});
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: 'Reduce Model Listing Fee from 2% to 1%',
      category: 'Fee Structure',
      creator: '0x742d...891a',
      timeRemaining: '3 days 14 hours',
      votesYes: 850000,
      votesNo: 390000,
      votesAbstain: 65000,
      quorumReached: true,
      description: 'This proposal aims to reduce the platform listing fee from 2% to 1% to attract more AI model developers.',
      discussionCount: 45,
      trending: true
    },
    {
      id: 2,
      title: 'Implement AI Model Quality Verification System',
      category: 'Platform Updates',
      creator: '0x8a3f...4c2d',
      timeRemaining: '5 days 8 hours',
      votesYes: 1100000,
      votesNo: 250000,
      votesAbstain: 55000,
      quorumReached: true,
      description: 'Introduce a comprehensive quality verification system for all AI models uploaded.',
      discussionCount: 78,
      trending: true
    },
    {
      id: 3,
      title: 'Allocate 500K MCT for Developer Grants',
      category: 'Treasury Management',
      creator: '0x3f9a...12bc',
      timeRemaining: '1 day 22 hours',
      votesYes: 620000,
      votesNo: 660000,
      votesAbstain: 50000,
      quorumReached: true,
      description: 'Allocate 500,000 MCT tokens from the treasury to fund developer grants.',
      discussionCount: 92
    },
    {
      id: 4,
      title: 'Add Support for Polygon Network',
      category: 'Platform Updates',
      creator: '0x5c8d...7e4f',
      timeRemaining: '6 days 4 hours',
      votesYes: 1640000,
      votesNo: 320000,
      votesAbstain: 40000,
      quorumReached: true,
      description: 'Expand platform compatibility by adding support for Polygon network.',
      discussionCount: 56
    },
    {
      id: 5,
      title: 'Update Governance Voting Period to 10 Days',
      category: 'Governance',
      creator: '0x9b2e...3a1d',
      timeRemaining: '4 days 12 hours',
      votesYes: 880000,
      votesNo: 650000,
      votesAbstain: 70000,
      quorumReached: true,
      description: 'Extend the voting period from 7 days to 10 days to allow more participation.',
      discussionCount: 34
    },
    {
      id: 6,
      title: 'Partnership with Chainlink for Oracle Services',
      category: 'Platform Updates',
      creator: '0x2a7c...5f8e',
      timeRemaining: '2 days 11 hours',
      votesYes: 1420000,
      votesNo: 520000,
      votesAbstain: 60000,
      quorumReached: true,
      description: 'Establish a partnership with Chainlink to integrate reliable oracle services.',
      discussionCount: 67,
      trending: true
    }
  ]);

  const userVotingPower = {
    tokens: 1250,
    votingWeight: 0.15,
    status: 'Active'
  };

  // Category definitions
  const categories = [
    { name: 'All', icon: SparklesIcon, color: 'text-white', count: 0 },
    { name: 'Trending', icon: SparklesIcon, color: 'text-yellow-400', count: 0 },
    { name: 'Fee Structure', icon: CurrencyDollarIcon, color: 'text-green-400', count: 0 },
    { name: 'Platform Updates', icon: DocumentTextIcon, color: 'text-cyan-400', count: 0 },
    { name: 'Treasury Management', icon: BanknotesIcon, color: 'text-purple-400', count: 0 },
    { name: 'Governance', icon: UserGroupIcon, color: 'text-pink-400', count: 0 }
  ];

  // Filter proposals by category
  const filteredProposals = proposals.filter(proposal => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Trending') return proposal.trending;
    return proposal.category === selectedCategory;
  });

  // Update category counts
  const categoriesWithCounts = categories.map(cat => {
    if (cat.name === 'All') {
      return { ...cat, count: proposals.length };
    }
    if (cat.name === 'Trending') {
      return { ...cat, count: proposals.filter(p => p.trending).length };
    }
    return {
      ...cat,
      count: proposals.filter(p => p.category === cat.name).length
    };
  });

  const statistics = [
    { label: 'Total Token Holders', value: '12,450', icon: UsersIcon, color: 'cyan' },
    { label: 'Active Voters', value: '8,920', subtitle: '71.6%', icon: CheckBadgeIcon, color: 'purple' },
    { label: 'Treasury Balance', value: '$4.2M', icon: BanknotesIcon, color: 'pink' },
    { label: 'Active Proposals', value: '6', icon: DocumentTextIcon, color: 'blue' },
    { label: 'Proposals Passed', value: '18', subtitle: 'Last 30 days', icon: CheckCircleIcon, color: 'cyan' },
    { label: 'Avg Voting Time', value: '5.2 days', icon: ClockIcon, color: 'purple' }
  ];

  const pastProposals = [
    { title: 'Implement Staking Rewards System', result: 'Passed', percentage: 89, status: 'Executed', color: 'green' },
    { title: 'Increase Platform Fee to 3%', result: 'Failed', percentage: 23, status: 'Rejected', color: 'red' },
    { title: 'Add Ethereum Layer 2 Support', result: 'Passed', percentage: 76, status: 'Executed', color: 'green' },
    { title: 'Launch Bug Bounty Program', result: 'Passed', percentage: 91, status: 'Executed', color: 'green' },
    { title: 'Remove Model Verification Requirements', result: 'Failed', percentage: 18, status: 'Rejected', color: 'red' }
  ];

  const howItWorksSteps = [
    { step: 1, title: 'Hold MCT Tokens', icon: CurrencyDollarIcon, description: 'Acquire MCT tokens to gain voting power' },
    { step: 2, title: 'Browse Active Proposals', icon: DocumentTextIcon, description: 'Review proposals and their details' },
    { step: 3, title: 'Vote (Yes/No/Abstain)', icon: HandThumbUpIcon, description: 'Cast your vote on proposals' },
    { step: 4, title: 'Proposal Executes if Passed', icon: CheckCircleIcon, description: 'Approved proposals are executed' }
  ];

  const calculatePercentage = (votes, proposal) => {
    const total = proposal.votesYes + proposal.votesNo + proposal.votesAbstain;
    return total > 0 ? ((votes / total) * 100).toFixed(1) : 0;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  const openVoteModal = (proposal) => {
    setSelectedProposal(proposal);
    setSelectedVote(null);
    setShowVoteModal(true);
  };

  const openDetailsModal = (proposal) => {
    setSelectedProposal(proposal);
    setShowDetailsModal(true);
  };

  const handleVoteSubmit = async () => {
    if (!selectedVote || !selectedProposal) return;

    // Check if already voted
    if (userVotes[selectedProposal.id]) {
      showWarning('You have already voted on this proposal!', {
        title: 'Already Voted',
        duration: 3000
      });
      return;
    }

    // Check if delegated
    if (isDelegated) {
      showWarning('Cannot vote while voting power is delegated. Please remove delegation first.', {
        title: 'Voting Delegated',
        duration: 3000
      });
      return;
    }

    setIsSubmittingVote(true);

    // Simulate blockchain transaction
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Calculate vote weight
      const voteWeight = userVotingPower.tokens;

      // Update proposal votes
      setProposals(prevProposals => 
        prevProposals.map(proposal => {
          if (proposal.id === selectedProposal.id) {
            return {
              ...proposal,
              votesYes: selectedVote === 'yes' ? proposal.votesYes + voteWeight : proposal.votesYes,
              votesNo: selectedVote === 'no' ? proposal.votesNo + voteWeight : proposal.votesNo,
              votesAbstain: selectedVote === 'abstain' ? proposal.votesAbstain + voteWeight : proposal.votesAbstain
            };
          }
          return proposal;
        })
      );

      // Record user's vote
      setUserVotes(prev => ({
        ...prev,
        [selectedProposal.id]: {
          vote: selectedVote,
          weight: voteWeight,
          timestamp: new Date().toISOString()
        }
      }));

      // Success feedback with custom toast
      const voteText = selectedVote === 'yes' ? 'YES' : selectedVote === 'no' ? 'NO' : 'ABSTAIN';
      showSuccess(`${voteText} • ${voteWeight.toLocaleString()} MCT`, {
        title: 'Vote Cast Successfully!',
        duration: 3000,
        glow: true
      });

      setShowVoteModal(false);
      setSelectedVote(null);
      setSelectedProposal(null);
    } catch {
      showError('Vote submission failed. Please try again.', {
        title: 'Vote Failed',
        duration: 3000,
        autoClose: true
      });
    } finally {
      setIsSubmittingVote(false);
    }
  };

  const handleDelegate = () => {
    if (delegateAddress && delegateAddress.startsWith('0x')) {
      setDelegatedTo(delegateAddress);
      setIsDelegated(true);
      showSuccess(`Delegated to ${delegateAddress.slice(0, 6)}...${delegateAddress.slice(-4)}`, {
        title: 'Voting Power Delegated!',
        duration: 3000,
        glow: true
      });
      setShowDelegateModal(false);
      setDelegateAddress('');
    } else {
      showError('Please enter a valid wallet address', {
        title: 'Invalid Address',
        duration: 3000,
        autoClose: true
      });
    }
  };

  const handleUndelegate = () => {
    setIsDelegated(false);
    setDelegatedTo('');
    setDelegateAddress('');
    setShowDelegateModal(false);
    showSuccess('You can now vote directly', {
      title: 'Delegation Removed',
      duration: 3000,
      glow: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-purple-950 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Community Governance
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Shape the future of ModelChain through decentralized voting
            </p>
            
            <Card className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm border-gray-700 mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <CurrencyDollarIcon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-gray-400 text-sm">Your Voting Power</p>
                      <p className="text-2xl font-bold text-white">{userVotingPower.tokens.toLocaleString()} MCT</p>
                    </div>
                  </div>
                  <Badge variant="success">{userVotingPower.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Voting Weight:</span>
                  <span className="text-purple-400 font-semibold">{userVotingPower.votingWeight}%</span>
                </div>
                {isDelegated ? (
                  <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Delegated to:</span>
                      <span className="text-sm font-mono text-purple-400">{delegatedTo}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDelegateModal(true)}
                    >
                      Change Delegation
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => setShowDelegateModal(true)}
                  >
                    Delegate Votes
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Active Proposals</h2>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" />
            Create Proposal
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {categoriesWithCounts.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.name;
              
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
                    ${isActive 
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/50 scale-105' 
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700 hover:border-gray-600'
                    }
                  `}
                >
                  <IconComponent className={`h-5 w-5 ${isActive ? 'text-white' : category.color}`} />
                  <span>{category.name}</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-700/50 text-gray-400'
                    }
                  `}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProposals.map((proposal) => {
            const yesPercent = calculatePercentage(proposal.votesYes, proposal);
            const noPercent = calculatePercentage(proposal.votesNo, proposal);
            const abstainPercent = calculatePercentage(proposal.votesAbstain, proposal);

            return (
              <Card key={proposal.id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-cyan-500/50 transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" className="text-xs">{proposal.category}</Badge>
                      {proposal.trending && (
                        <Badge variant="secondary" className="text-xs animate-pulse">
                          <SparklesIcon className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    {proposal.quorumReached && (
                      <Badge variant="success" className="text-xs">
                        <CheckBadgeIcon className="h-3 w-3 mr-1" />
                        Quorum
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                    {proposal.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      {proposal.creator}
                    </span>
                    <span className="flex items-center text-yellow-400">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {proposal.timeRemaining}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-green-400 font-medium">Yes</span>
                        <span className="text-gray-300">{yesPercent}% ({formatNumber(proposal.votesYes)} MCT)</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                          style={{ width: `${yesPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-red-400 font-medium">No</span>
                        <span className="text-gray-300">{noPercent}% ({formatNumber(proposal.votesNo)} MCT)</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500"
                          style={{ width: `${noPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400 font-medium">Abstain</span>
                        <span className="text-gray-300">{abstainPercent}% ({formatNumber(proposal.votesAbstain)} MCT)</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-full transition-all duration-500"
                          style={{ width: `${abstainPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                      {proposal.discussionCount} comments
                    </div>
                    {userVotes[proposal.id] && (
                      <Badge variant="success" className="text-xs">
                        ✓ Voted {userVotes[proposal.id].vote.toUpperCase()}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      size="md"
                      onClick={() => openDetailsModal(proposal)}
                      className="gap-2 px-4 py-2.5"
                    >
                      <EyeIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">View Details</span>
                    </Button>
                    <Button 
                      size="md"
                      onClick={() => openVoteModal(proposal)}
                      className="gap-2 px-4 py-2.5"
                      disabled={userVotes[proposal.id] || isDelegated}
                    >
                      <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">{userVotes[proposal.id] ? 'Already Voted' : 'Vote Now'}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 bg-gray-800/30">
        <h2 className="text-3xl font-bold mb-8 text-white">Governance Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
              purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
              pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
              blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            };

            return (
              <Card key={index} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-cyan-500/50 transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                      {stat.subtitle && (
                        <p className="text-sm text-gray-400">{stat.subtitle}</p>
                      )}
                    </div>
                    <div className={`h-14 w-14 rounded-lg flex items-center justify-center border ${colorClasses[stat.color]}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-white">Past Proposals</h2>
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <div className="divide-y divide-gray-700">
            {pastProposals.map((proposal, index) => {
              const Icon = proposal.result === 'Passed' ? CheckCircleIcon : XCircleIcon;
              const resultColor = proposal.color === 'green' ? 'text-green-400' : 'text-red-400';
              
              return (
                <div key={index} className="p-6 hover:bg-gray-700/30 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <Icon className={`h-6 w-6 ${resultColor}`} />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">{proposal.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{proposal.result} • {proposal.percentage}%</span>
                          <Badge variant={proposal.color === 'green' ? 'success' : 'danger'}>
                            {proposal.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="w-32">
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${proposal.color === 'green' ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${proposal.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="container mx-auto px-6 py-16 bg-gray-800/30">
        <h2 className="text-3xl font-bold mb-12 text-center text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorksSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative">
                <div className="text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 px-2">
                    <span className="text-2xl font-bold text-cyan-400">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-cyan-500/50 to-purple-500/50">
                    <ArrowRightIcon className="h-4 w-4 text-cyan-400 absolute -right-2 -top-1.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showVoteModal && selectedProposal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100] overflow-y-auto">
          <div className="w-full max-w-lg my-8">
            <Card className="w-full bg-gray-800 border-2 border-gray-700 shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b-2 border-gray-700 bg-gray-800/80">
                <h3 className="text-3xl font-bold text-white">Cast Your Vote</h3>
                <button
                  onClick={() => {
                    setShowVoteModal(false);
                    setSelectedVote(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
                >
                  <XCircleIcon className="h-7 w-7" />
                </button>
              </div>
              <div className="p-6 max-h-[65vh] overflow-y-auto">
              
              <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                <p className="text-gray-400 text-sm mb-2">Proposal</p>
                <p className="text-white font-semibold">{selectedProposal.title}</p>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-6">
                <p className="text-gray-400 text-sm mb-1">Your Voting Power</p>
                <p className="text-2xl font-bold text-cyan-400">{userVotingPower.tokens.toLocaleString()} MCT</p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setSelectedVote('Yes')}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                    selectedVote === 'Yes'
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-gray-600 hover:border-green-500/50 bg-gray-700/30'
                  }`}
                >
                  <span className="flex items-center text-white font-semibold">
                    <HandThumbUpIcon className="h-5 w-5 mr-3 text-green-400" />
                    Vote Yes
                  </span>
                  {selectedVote === 'Yes' && (
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                  )}
                </button>

                <button
                  onClick={() => setSelectedVote('No')}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                    selectedVote === 'No'
                      ? 'border-red-500 bg-red-500/20'
                      : 'border-gray-600 hover:border-red-500/50 bg-gray-700/30'
                  }`}
                >
                  <span className="flex items-center text-white font-semibold">
                    <HandThumbDownIcon className="h-5 w-5 mr-3 text-red-400" />
                    Vote No
                  </span>
                  {selectedVote === 'No' && (
                    <CheckCircleIcon className="h-6 w-6 text-red-400" />
                  )}
                </button>

                <button
                  onClick={() => setSelectedVote('Abstain')}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                    selectedVote === 'Abstain'
                      ? 'border-gray-400 bg-gray-400/20'
                      : 'border-gray-600 hover:border-gray-400/50 bg-gray-700/30'
                  }`}
                >
                  <span className="flex items-center text-white font-semibold">
                    <MinusIcon className="h-5 w-5 mr-3 text-gray-400" />
                    Abstain
                  </span>
                  {selectedVote === 'Abstain' && (
                    <CheckCircleIcon className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Voting Status Alerts */}
              {isDelegated && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
                  <p className="text-purple-400 text-sm flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Your voting power is currently delegated to {delegatedTo}. Remove delegation to vote.</span>
                  </p>
                </div>
              )}

              {userVotes[selectedProposal.id] && (
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-cyan-400 text-sm font-semibold mb-1">Already Voted</p>
                      <p className="text-cyan-300 text-xs">
                        You voted <span className="font-bold">{userVotes[selectedProposal.id].vote.toUpperCase()}</span> with {userVotes[selectedProposal.id].weight.toLocaleString()} MCT
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
                <p className="text-yellow-400 text-sm flex items-start">
                  <span className="mr-2">⚠️</span>
                  <span>Votes cannot be changed once submitted.</span>
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowVoteModal(false);
                    setSelectedVote(null);
                  }}
                  disabled={isSubmittingVote}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleVoteSubmit}
                  disabled={!selectedVote || isSubmittingVote || userVotes[selectedProposal.id] || isDelegated}
                  loading={isSubmittingVote}
                >
                  {isSubmittingVote ? 'Submitting...' : 'Confirm Vote'}
                </Button>
              </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {showDetailsModal && selectedProposal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100] overflow-y-auto">
          <div className="w-full max-w-3xl my-8">
            <Card className="w-full bg-gray-800 border-2 border-gray-700 shadow-2xl">
              <div className="flex items-start justify-between px-6 py-5 border-b-2 border-gray-700 bg-gray-800/80">
                <div className="flex-1">
                  <Badge variant="primary" className="mb-3 text-sm">{selectedProposal.category}</Badge>
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedProposal.title}</h3>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700 ml-4"
                >
                  <XCircleIcon className="h-7 w-7" />
                </button>
              </div>
              <div className="p-6 max-h-[65vh] overflow-y-auto">

              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <h4 className="text-white font-semibold mb-2">Description</h4>
                <p className="text-gray-300">{selectedProposal.description}</p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setShowDetailsModal(false);
                    openVoteModal(selectedProposal);
                  }}
                >
                  Vote Now
                </Button>
              </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100] overflow-y-auto">
          <div className="w-full max-w-2xl my-8">
            <Card className="w-full bg-gray-800 border-2 border-gray-700 shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b-2 border-gray-700 bg-gray-800/80">
                <h3 className="text-3xl font-bold text-white">Create New Proposal</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
                >
                  <XCircleIcon className="h-7 w-7" />
                </button>
              </div>
              <div className="p-6 max-h-[65vh] overflow-y-auto">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Proposal Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter proposal title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>Fee Structure</option>
                    <option>Platform Updates</option>
                    <option>Treasury Management</option>
                    <option>Governance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Describe your proposal"
                  />
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="text-cyan-400 text-sm">
                    <strong>Note:</strong> Creating a proposal requires 1,000 MCT tokens as a deposit.
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    onClick={(e) => {
                      e.preventDefault();
                      showSuccess('Proposal creation feature will be available soon', {
                        title: 'Coming Soon!',
                        duration: 3000,
                        glow: true
                      });
                      setShowCreateModal(false);
                    }}
                  >
                    Submit Proposal
                  </Button>
                </div>
              </form>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Delegate Votes Modal */}
      {showDelegateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <div className="flex items-center justify-between px-6 py-4 border-b-2 border-cyan-500/30">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
                  {isDelegated ? 'Change Delegation' : 'Delegate Voting Power'}
                </h3>
                <button
                  onClick={() => {
                    setShowDelegateModal(false);
                    setDelegateAddress('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircleIcon className="h-7 w-7" />
                </button>
              </div>
              
              <div className="p-6 max-h-[65vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Current Status */}
                  {isDelegated && (
                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircleIcon className="h-5 w-5 text-purple-400" />
                        <span className="text-sm font-semibold text-purple-400">Currently Delegated</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Delegate Address:</span>
                        <span className="text-sm font-mono text-purple-300">{delegatedTo}</span>
                      </div>
                    </div>
                  )}

                  {/* Voting Power Info */}
                  <div className="flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Your Voting Power</p>
                      <p className="text-2xl font-bold text-white">{userVotingPower.tokens.toLocaleString()} MCT</p>
                    </div>
                    <div className="h-12 w-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <CurrencyDollarIcon className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>

                  {/* Delegate Address Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Delegate Address
                    </label>
                    <input
                      type="text"
                      value={delegateAddress}
                      onChange={(e) => setDelegateAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="0x..."
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Enter the wallet address you want to delegate your voting power to
                    </p>
                  </div>

                  {/* Warning */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex gap-3">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-200">
                        <p className="font-semibold mb-1">Important Notice</p>
                        <ul className="list-disc list-inside space-y-1 text-yellow-200/80">
                          <li>Your delegate can vote on your behalf</li>
                          <li>You cannot vote while delegation is active</li>
                          <li>You can remove delegation at any time</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    {isDelegated && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleUndelegate}
                      >
                        Remove Delegation
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowDelegateModal(false);
                        setDelegateAddress('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleDelegate}
                      disabled={!delegateAddress || !delegateAddress.startsWith('0x')}
                    >
                      {isDelegated ? 'Update Delegation' : 'Delegate'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>  
  );
};

export default Governance;
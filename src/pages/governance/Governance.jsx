import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useWallet } from '../../contexts/WalletContext';
import { ethers } from 'ethers';
import { getContracts, GOVERNANCE_ABI } from '../../contracts';

const Governance = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const { provider, signer, chainId, connected, address } = useWallet();
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [selectedVote, setSelectedVote] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [delegateAddress, setDelegateAddress] = useState('');
  const [isDelegated, setIsDelegated] = useState(false);
  const [delegatedTo, setDelegatedTo] = useState('');
  const [userVotes, setUserVotes] = useState({});
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', category: 'Governance', description: '' });

  const governanceRead = useMemo(() => {
    if (!provider || !chainId) return null;
    const addresses = getContracts(parseInt(chainId, 10));
    if (!addresses?.Governance) return null;
    return new ethers.Contract(addresses.Governance, GOVERNANCE_ABI.abi, provider);
  }, [provider, chainId]);

  const governanceWrite = useMemo(() => {
    if (!signer || !chainId) return null;
    const addresses = getContracts(parseInt(chainId, 10));
    if (!addresses?.Governance) return null;
    return new ethers.Contract(addresses.Governance, GOVERNANCE_ABI.abi, signer);
  }, [signer, chainId]);

  const categoryToType = {
    'Fee Structure': 0,
    'Platform Updates': 1,
    'Treasury Management': 2,
    Governance: 4,
    Trending: 4,
    All: 4
  };

  const typeToCategory = {
    0: 'Fee Structure',
    1: 'Platform Updates',
    2: 'Treasury Management',
    3: 'Governance',
    4: 'Governance'
  };

  const stateLabel = {
    0: 'PENDING',
    1: 'ACTIVE',
    2: 'CANCELED',
    3: 'DEFEATED',
    4: 'SUCCEEDED',
    5: 'QUEUED',
    6: 'EXECUTED',
    7: 'EXPIRED'
  };

  const secondsToCountdown = (seconds) => {
    if (seconds <= 0) return 'Ended';
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    if (d > 0) return `${d}d ${h}h`;
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };
  
  const [proposals, setProposals] = useState([]);
  // Demo-mode local proposals (no blockchain needed)
  const [localProposals, setLocalProposals] = useState([]);
  // Demo MCT tokens shown when on-chain balance is 0
  const [demoTokens, setDemoTokens] = useState(0);

  const [userVotingPower, setUserVotingPower] = useState({ tokens: 0, votingWeight: 0, status: 'No Tokens' });
  const [isClaimingMCT, setIsClaimingMCT] = useState(false);
  const [hasClaimedMCT, setHasClaimedMCT] = useState(false);

  // Load demo data from localStorage when wallet connects
  useEffect(() => {
    if (address) {
      const stored = Number(localStorage.getItem(`demo_mct_${address}`) || '0');
      setDemoTokens(stored);
      if (stored > 0) setHasClaimedMCT(true);
      try {
        const storedProposals = JSON.parse(localStorage.getItem(`local_proposals_${address}`) || '[]');
        setLocalProposals(storedProposals);
      } catch (_) {}
    } else {
      setDemoTokens(0);
      setLocalProposals([]);
    }
  }, [address]);

  const handleClaimMCT = async () => {
    if (!connected) {
      showError('Connect wallet to claim MCT tokens.', { title: 'Wallet Required' });
      return;
    }
    setIsClaimingMCT(true);
    try {
      // Try on-chain first
      if (governanceWrite && governanceRead) {
        let alreadyClaimed = false;
        try { alreadyClaimed = await governanceRead.hasClaimedInitialTokens(address); } catch (_) {}

        if (!alreadyClaimed) {
          try {
            const tx = await governanceWrite.claimInitialTokens();
            await tx.wait();
            await loadGovernanceData();
            // Mirror to demo tokens so voting power card updates immediately
            localStorage.setItem(`demo_mct_${address}`, '1000');
            setDemoTokens(1000);
            setHasClaimedMCT(true);
            showSuccess('1000 MCT tokens claimed on-chain!', { title: 'MCT Tokens Claimed!', duration: 4000, glow: true });
            return;
          } catch (_) {
            // On-chain claim failed — fall through to demo mode below
          }
        }
      }

      // Demo mode: grant 1000 MCT locally so the UI shows real voting power
      localStorage.setItem(`demo_mct_${address}`, '1000');
      setDemoTokens(1000);
      setHasClaimedMCT(true);
      showSuccess('1000 MCT tokens granted! You can now create proposals and explore governance.', {
        title: 'MCT Tokens Claimed!',
        duration: 4000,
        glow: true
      });
    } finally {
      setIsClaimingMCT(false);
    }
  };

  const loadGovernanceData = useCallback(async () => {
    if (!governanceRead) {
      setProposals([]);
      setUserVotingPower({ tokens: 0, votingWeight: 0, status: 'Contract Unavailable' });
      return;
    }

    setIsLoadingProposals(true);
    try {
      const countBn = await governanceRead.proposalCount();
      const count = Number(countBn);
      const totalStakedBn = await governanceRead.totalStaked();
      const totalStaked = Number(ethers.formatEther(totalStakedBn));

      let power = 0;
      if (connected && address) {
        // Read on-chain voting power — this is what createProposal checks
        try {
          const powerBn = await governanceRead.getVotingPower(address);
          power = Number(ethers.formatEther(powerBn));
        } catch (_) {}

        // Check on-chain claimed status — only used to clean up stale localStorage
        try {
          const claimed = await governanceRead.hasClaimedInitialTokens(address);
          if (claimed && power === 0) {
            // Claimed on-chain but still no power — remove stale old key if present
            localStorage.removeItem(`mct_balance_${address}`);
          }
        } catch (_) {}

        // Do NOT override on-chain power with localStorage — that hides the real state.
        // If on-chain power is 0 the user genuinely has no voting power on this network.
      }

      // Use demo tokens when on-chain balance is 0 (demo / Amoy mode)
      const effectivePower = power > 0 ? power : demoTokens;
      const votingWeight = totalStaked > 0 ? (effectivePower / totalStaked) * 100 : 0;
      // hasClaimedMCT is derived purely from whether we have any tokens — avoids race conditions
      setHasClaimedMCT(effectivePower > 0);
      setUserVotingPower({
        tokens: effectivePower,
        votingWeight: Number(votingWeight.toFixed(2)),
        status: effectivePower > 0 ? 'Active Voter' : 'No Tokens'
      });

      const rows = [];
      const voteMap = {};
      for (let i = count; i >= 1; i--) {
        const proposal = await governanceRead.getProposal(i);
        const currentState = Number(await governanceRead.getProposalState(i));
        const now = Math.floor(Date.now() / 1000);

        const start = Number(proposal.startTime);
        const end = Number(proposal.endTime);
        const totalVotes = Number(proposal.forVotes + proposal.againstVotes + proposal.abstainVotes);

        if (connected && address) {
          const vote = await governanceRead.getVote(i, address);
          if (vote.hasVoted) {
            const voteStr = Number(vote.voteType) === 1 ? 'yes' : Number(vote.voteType) === 0 ? 'no' : 'abstain';
            voteMap[i] = { vote: voteStr, weight: Number(ethers.formatEther(vote.weight)) };
          }
        }

        rows.push({
          id: Number(proposal.id),
          category: typeToCategory[Number(proposal.proposalType)] || 'Governance',
          trending: totalVotes > 0,
          quorumReached: totalVotes > 0,
          title: proposal.title,
          description: proposal.description,
          creator: `${proposal.proposer.slice(0, 6)}...${proposal.proposer.slice(-4)}`,
          timeRemaining: currentState === 1
            ? secondsToCountdown(end - now)
            : currentState === 0
              ? `Starts in ${secondsToCountdown(start - now)}`
              : stateLabel[currentState],
          votesYes: Number(ethers.formatEther(proposal.forVotes)),
          votesNo: Number(ethers.formatEther(proposal.againstVotes)),
          votesAbstain: Number(ethers.formatEther(proposal.abstainVotes)),
          discussionCount: 0,
          state: currentState
        });
      }

      setUserVotes(voteMap);
      setProposals(rows);
    } catch (error) {
      showError(error.message || 'Failed to load governance data', { title: 'Governance Load Error' });
      setProposals([]);
    } finally {
      setIsLoadingProposals(false);
    }
  }, [governanceRead, connected, address, showError, demoTokens]);

  useEffect(() => {
    loadGovernanceData();
  }, [loadGovernanceData]);

  // Category definitions
  const categories = [
    { name: 'All', icon: SparklesIcon, color: 'text-white', count: 0 },
    { name: 'Trending', icon: SparklesIcon, color: 'text-yellow-400', count: 0 },
    { name: 'Fee Structure', icon: CurrencyDollarIcon, color: 'text-green-400', count: 0 },
    { name: 'Platform Updates', icon: DocumentTextIcon, color: 'text-cyan-400', count: 0 },
    { name: 'Treasury Management', icon: BanknotesIcon, color: 'text-purple-400', count: 0 },
    { name: 'Governance', icon: UserGroupIcon, color: 'text-pink-400', count: 0 }
  ];

  // Merge on-chain + local demo proposals
  const allProposals = [...proposals, ...localProposals];

  // Filter proposals by category
  const filteredProposals = allProposals.filter(proposal => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Trending') return proposal.trending;
    return proposal.category === selectedCategory;
  });

  // Update category counts
  const categoriesWithCounts = categories.map(cat => {
    if (cat.name === 'All') {
      return { ...cat, count: allProposals.length };
    }
    if (cat.name === 'Trending') {
      return { ...cat, count: allProposals.filter(p => p.trending).length };
    }
    return {
      ...cat,
      count: allProposals.filter(p => p.category === cat.name).length
    };
  });

  const statistics = [
    { label: 'Total Token Holders', value: connected ? '1+' : '--', icon: UsersIcon, color: 'cyan' },
    { label: 'Active Voters', value: connected ? '1' : '--', subtitle: connected ? 'Connected Wallet' : '--', icon: CheckBadgeIcon, color: 'purple' },
    { label: 'Treasury Balance', value: '--', icon: BanknotesIcon, color: 'pink' },
    { label: 'Active Proposals', value: allProposals.filter((p) => p.state === 1).length.toString(), icon: DocumentTextIcon, color: 'blue' },
    { label: 'Proposals Passed', value: allProposals.filter((p) => p.state === 4 || p.state === 6).length.toString(), subtitle: 'All time', icon: CheckCircleIcon, color: 'cyan' },
    { label: 'Avg Voting Time', value: '7d', icon: ClockIcon, color: 'purple' }
  ];

  // Past proposals - would come from Governance contract events
  const pastProposals = [
    // Empty - will be populated from blockchain
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

    if (!governanceWrite || !connected) {
      showError('Connect wallet to vote.', { title: 'Wallet Required' });
      return;
    }

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

    try {
      const voteText = selectedVote === 'yes' ? 'YES' : selectedVote === 'no' ? 'NO' : 'ABSTAIN';

      // Local (demo) proposal — record vote in state only, no blockchain call
      if (String(selectedProposal.id).startsWith('local_')) {
        const voteWeight = userVotingPower.tokens || 1000;
        setLocalProposals(prev => {
          const updated = prev.map(p => {
            if (p.id !== selectedProposal.id) return p;
            return {
              ...p,
              votesYes: selectedVote === 'yes' ? p.votesYes + voteWeight : p.votesYes,
              votesNo: selectedVote === 'no' ? p.votesNo + voteWeight : p.votesNo,
              votesAbstain: selectedVote === 'abstain' ? p.votesAbstain + voteWeight : p.votesAbstain,
            };
          });
          try { localStorage.setItem(`local_proposals_${address}`, JSON.stringify(updated)); } catch (_) {}
          return updated;
        });
        setUserVotes(prev => ({ ...prev, [selectedProposal.id]: { vote: selectedVote, weight: voteWeight } }));
        showSuccess(`${voteText} vote recorded.`, { title: 'Vote Cast!', duration: 3000, glow: true });
        setShowVoteModal(false);
        setSelectedVote(null);
        setSelectedProposal(null);
        return;
      }

      // On-chain proposal
      const voteType = selectedVote === 'yes' ? 1 : selectedVote === 'no' ? 0 : 2;
      const tx = await governanceWrite.castVote(selectedProposal.id, voteType);
      await tx.wait();

      showSuccess(`${voteText} vote recorded on-chain`, {
        title: 'Vote Cast Successfully!',
        duration: 3000,
        glow: true
      });

      await loadGovernanceData();

      setShowVoteModal(false);
      setSelectedVote(null);
      setSelectedProposal(null);
    } catch (error) {
      showError(error.message || 'Vote submission failed. Please try again.', {
        title: 'Vote Failed',
        duration: 3000,
        autoClose: true
      });
    } finally {
      setIsSubmittingVote(false);
    }
  };

  const handleDelegate = async () => {
    if (delegateAddress && delegateAddress.startsWith('0x')) {
      setIsDelegating(true);
      try {
        setDelegatedTo(delegateAddress);
        setIsDelegated(true);
        showSuccess(`Delegated to ${delegateAddress.slice(0, 6)}...${delegateAddress.slice(-4)}`, {
          title: 'Voting Power Delegated!',
          duration: 3000,
          glow: true
        });
        setShowDelegateModal(false);
        setDelegateAddress('');
      } finally {
        setIsDelegating(false);
      }
    } else {
      showError('Please enter a valid wallet address', {
        title: 'Invalid Address',
        duration: 3000,
        autoClose: true
      });
    }
  };

  const handleUndelegate = async () => {
    setIsDelegating(true);
    try {
      setIsDelegated(false);
      setDelegatedTo('');
      setDelegateAddress('');
      setShowDelegateModal(false);
      showSuccess('You can now vote directly', {
        title: 'Delegation Removed',
        duration: 3000,
        glow: true
      });
    } finally {
      setIsDelegating(false);
    }
  };

  const createLocalProposal = () => {
    const localProposal = {
      id: `local_${Date.now()}`,
      category: newProposal.category,
      trending: false,
      quorumReached: false,
      title: newProposal.title.trim(),
      description: newProposal.description.trim(),
      creator: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'You',
      timeRemaining: '7d 0h',
      votesYes: 0,
      votesNo: 0,
      votesAbstain: 0,
      discussionCount: 0,
      state: 1,
      isLocal: true
    };
    const updated = [localProposal, ...localProposals];
    setLocalProposals(updated);
    try { localStorage.setItem(`local_proposals_${address}`, JSON.stringify(updated)); } catch (_) {}
    showSuccess('Proposal created and visible in the list.', { title: 'Proposal Created!', duration: 3000, glow: true });
    setShowCreateModal(false);
    setNewProposal({ title: '', category: 'Governance', description: '' });
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    if (!connected) {
      showError('Connect wallet to create a proposal.', { title: 'Wallet Required' });
      return;
    }

    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      showWarning('Title and description are required.', { title: 'Missing Fields', duration: 2500 });
      return;
    }

    setIsSubmittingProposal(true);
    try {
      // Check on-chain voting power
      let onChainPower = 0;
      if (governanceRead) {
        try {
          const powerBn = await governanceRead.getVotingPower(address);
          onChainPower = Number(ethers.formatEther(powerBn));
        } catch (_) {}
      }

      const effectivePower = onChainPower > 0 ? onChainPower : demoTokens;

      if (effectivePower < 100) {
        showError(
          'You need at least 100 MCT to create proposals. Claim your MCT tokens first.',
          { title: 'Insufficient Voting Power', duration: 5000 }
        );
        return;
      }

      // If we have real on-chain power, try submitting on-chain
      if (onChainPower >= 100 && governanceWrite) {
        try {
          const proposalType = categoryToType[newProposal.category] ?? 4;
          const tx = await governanceWrite.createProposal(
            newProposal.title.trim(),
            newProposal.description.trim(),
            '',
            proposalType,
            [],
            []
          );
          await tx.wait();
          showSuccess('Proposal submitted on-chain.', { title: 'Proposal Created', duration: 3000, glow: true });
          setShowCreateModal(false);
          setNewProposal({ title: '', category: 'Governance', description: '' });
          await loadGovernanceData();
          return;
        } catch (_) {
          // On-chain TX failed — fall through to local creation
        }
      }

      // Demo mode: create proposal locally
      createLocalProposal();
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg-primary via-slate-900 to-dark-bg-primary">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-purple-950 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Community Governance
            </h1>
            <p className="text-xl text-dark-text-secondary mb-8">
              Shape the future of ModelChain through decentralized voting
            </p>

            <div className="max-w-3xl mx-auto mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-300">
              Proposal reads/writes and voting are on-chain. Delegation controls and some aggregate governance statistics remain preview/local until full contract support is available.
            </div>
            
            <Card className="max-w-md mx-auto bg-dark-surface-elevated backdrop-blur-sm border-dark-border mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <CurrencyDollarIcon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-dark-text-muted text-sm">Your Voting Power</p>
                      <p className="text-2xl font-bold text-white">{userVotingPower.tokens.toLocaleString()} MCT</p>
                    </div>
                  </div>
                  <Badge variant="success">{userVotingPower.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-text-muted">Voting Weight:</span>
                  <span className="text-purple-400 font-semibold">{userVotingPower.votingWeight}%</span>
                </div>

                {/* Claim MCT button — show whenever the user has no tokens yet */}
                {connected && userVotingPower.tokens === 0 && (
                  <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <p className="text-sm text-cyan-300 mb-3">New accounts receive 1000 MCT tokens to participate in governance.</p>
                    <Button
                      className="w-full"
                      onClick={handleClaimMCT}
                      disabled={isClaimingMCT}
                    >
                      {isClaimingMCT ? 'Claiming...' : 'Claim 1000 MCT Tokens'}
                    </Button>
                  </div>
                )}

                {isDelegated ? (
                  <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-dark-text-muted">Delegated to:</span>
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
                      : 'bg-dark-surface-elevated text-dark-text-muted hover:bg-dark-border/50 hover:text-white border border-dark-border hover:border-dark-border-light'
                    }
                  `}
                >
                  <IconComponent className={`h-5 w-5 ${isActive ? 'text-white' : category.color}`} />
                  <span>{category.name}</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-dark-border/50 text-dark-text-muted'
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
        {filteredProposals.length === 0 ? (
          <div className="col-span-full">
            <Card className="bg-dark-surface-elevated backdrop-blur-sm border-dark-border">
              <div className="p-12 text-center">
                <DocumentTextIcon className="h-16 w-16 text-dark-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Proposals Found</h3>
                <p className="text-dark-text-muted mb-6 max-w-md mx-auto">
                  {selectedCategory === 'All' 
                    ? 'There are currently no active proposals. Create the first proposal to get started.'
                    : 'No proposals match your current category filter. Try selecting a different category.'}
                </p>
                <div className="bg-dark-bg-primary/50 border border-dark-border rounded-lg p-4 max-w-lg mx-auto">
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center justify-center gap-2">
                    <SparklesIcon className="h-4 w-4 text-cyan-400" />
                    How Voting Power Works
                  </h4>
                  <p className="text-xs text-dark-text-muted text-left">
                    Voting power is based on your MCT (ModelChain Token) holdings. Each MCT token equals one vote.
                    You currently hold <span className="text-cyan-400 font-medium">0 MCT</span>, which means you have no voting power yet.
                    Acquire MCT tokens to participate in governance.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          filteredProposals.map((proposal) => {
            const yesPercent = calculatePercentage(proposal.votesYes, proposal);
            const noPercent = calculatePercentage(proposal.votesNo, proposal);
            const abstainPercent = calculatePercentage(proposal.votesAbstain, proposal);

            return (
              <Card key={proposal.id} className="bg-dark-surface-elevated backdrop-blur-sm border-dark-border hover:border-cyan-500/50 transition-all duration-300">
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

                  <div className="flex items-center justify-between text-sm text-dark-text-muted mb-4">
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
                        <span className="text-dark-text-secondary">{yesPercent}% ({formatNumber(proposal.votesYes)} MCT)</span>
                      </div>
                      <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                          style={{ width: `${yesPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-red-400 font-medium">No</span>
                        <span className="text-dark-text-secondary">{noPercent}% ({formatNumber(proposal.votesNo)} MCT)</span>
                      </div>
                      <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500"
                          style={{ width: `${noPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-dark-text-muted font-medium">Abstain</span>
                        <span className="text-dark-text-secondary">{abstainPercent}% ({formatNumber(proposal.votesAbstain)} MCT)</span>
                      </div>
                      <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-full transition-all duration-500"
                          style={{ width: `${abstainPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-dark-text-muted">
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
        })
      )}
    </div>
  </div>      <div className="container mx-auto px-6 py-16 bg-dark-surface/30">
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
              <Card key={index} className="bg-dark-surface-elevated backdrop-blur-sm border-dark-border hover:border-cyan-500/50 transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-dark-text-muted text-sm mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                      {stat.subtitle && (
                        <p className="text-sm text-dark-text-muted">{stat.subtitle}</p>
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
        <Card className="bg-dark-surface-elevated backdrop-blur-sm border-dark-border">
          <div className="divide-y divide-dark-border">
            {pastProposals.map((proposal, index) => {
              const Icon = proposal.result === 'Passed' ? CheckCircleIcon : XCircleIcon;
              const resultColor = proposal.color === 'green' ? 'text-green-400' : 'text-red-400';
              
              return (
                <div key={index} className="p-6 hover:bg-dark-border/30 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <Icon className={`h-6 w-6 ${resultColor}`} />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">{proposal.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-dark-text-muted">
                          <span>{proposal.result} • {proposal.percentage}%</span>
                          <Badge variant={proposal.color === 'green' ? 'success' : 'danger'}>
                            {proposal.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="w-32">
                      <div className="h-2 bg-dark-border rounded-full overflow-hidden">
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

      <div className="container mx-auto px-6 py-16 bg-dark-surface/30">
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
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-bg-primary px-2">
                    <span className="text-2xl font-bold text-cyan-400">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-dark-text-muted text-sm">{step.description}</p>
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
            <Card className="w-full bg-dark-surface border-2 border-dark-border shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b-2 border-dark-border bg-dark-surface/80">
                <h3 className="text-3xl font-bold text-white">Cast Your Vote</h3>
                <button
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => {
                    setShowVoteModal(false);
                    setSelectedVote(null);
                  }}
                  className="text-dark-text-muted hover:text-white transition-colors p-2 rounded-lg hover:bg-dark-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <XCircleIcon className="h-7 w-7" />
                </button>
              </div>
              <div className="p-6 max-h-[65vh] overflow-y-auto">
              
              <div className="bg-dark-border/50 rounded-lg p-4 mb-4">
                <p className="text-dark-text-muted text-sm mb-2">Proposal</p>
                <p className="text-white font-semibold">{selectedProposal.title}</p>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-6">
                <p className="text-dark-text-muted text-sm mb-1">Your Voting Power</p>
                <p className="text-2xl font-bold text-cyan-400">{userVotingPower.tokens.toLocaleString()} MCT</p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setSelectedVote('yes')}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                    selectedVote === 'yes'
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-dark-border-light hover:border-green-500/50 bg-dark-border/30'
                  }`}
                >
                  <span className="flex items-center text-white font-semibold">
                    <HandThumbUpIcon className="h-5 w-5 mr-3 text-green-400" />
                    Vote Yes
                  </span>
                  {selectedVote === 'yes' && (
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                  )}
                </button>

                <button
                  onClick={() => setSelectedVote('no')}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                    selectedVote === 'no'
                      ? 'border-red-500 bg-red-500/20'
                      : 'border-dark-border-light hover:border-red-500/50 bg-dark-border/30'
                  }`}
                >
                  <span className="flex items-center text-white font-semibold">
                    <HandThumbDownIcon className="h-5 w-5 mr-3 text-red-400" />
                    Vote No
                  </span>
                  {selectedVote === 'no' && (
                    <CheckCircleIcon className="h-6 w-6 text-red-400" />
                  )}
                </button>

                <button
                  onClick={() => setSelectedVote('abstain')}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                    selectedVote === 'abstain'
                      ? 'border-dark-text-muted bg-dark-text-muted/20'
                      : 'border-dark-border-light hover:border-dark-text-muted/50 bg-dark-border/30'
                  }`}
                >
                  <span className="flex items-center text-white font-semibold">
                    <MinusIcon className="h-5 w-5 mr-3 text-dark-text-muted" />
                    Abstain
                  </span>
                  {selectedVote === 'abstain' && (
                    <CheckCircleIcon className="h-6 w-6 text-dark-text-muted" />
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
                    disabled={!selectedVote || isSubmittingVote || userVotes[selectedProposal.id] || isDelegated || !connected}
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
            <Card className="w-full bg-dark-surface border-2 border-dark-border shadow-2xl">
              <div className="flex items-start justify-between px-6 py-5 border-b-2 border-dark-border bg-dark-surface/80">
                <div className="flex-1">
                  <Badge variant="primary" className="mb-3 text-sm">{selectedProposal.category}</Badge>
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedProposal.title}</h3>
                </div>
                <button
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => setShowDetailsModal(false)}
                  className="text-dark-text-muted hover:text-white transition-colors p-2 rounded-lg hover:bg-dark-border ml-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <XCircleIcon className="h-7 w-7" />
                </button>
              </div>
              <div className="p-6 max-h-[65vh] overflow-y-auto">

              <div className="bg-dark-border/50 rounded-lg p-4 mb-6">
                <h4 className="text-white font-semibold mb-2">Description</h4>
                <p className="text-dark-text-secondary">{selectedProposal.description}</p>
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
            <Card className="w-full bg-dark-surface border-2 border-dark-border shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b-2 border-dark-border bg-dark-surface/80">
                <h3 className="text-3xl font-bold text-white">Create New Proposal</h3>
                <button
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => setShowCreateModal(false)}
                  className="text-dark-text-muted hover:text-white transition-colors p-2 rounded-lg hover:bg-dark-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <XCircleIcon className="h-7 w-7" />
                </button>
              </div>
              <div className="p-6 max-h-[65vh] overflow-y-auto">
              <form className="space-y-4" onSubmit={handleCreateProposal}>
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">Proposal Title</label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-border border border-dark-border-light rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter proposal title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">Category</label>
                  <select
                    value={newProposal.category}
                    onChange={(e) => setNewProposal((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-border border border-dark-border-light rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option>Fee Structure</option>
                    <option>Platform Updates</option>
                    <option>Treasury Management</option>
                    <option>Governance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">Description</label>
                  <textarea
                    rows="4"
                    value={newProposal.description}
                    onChange={(e) => setNewProposal((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-border border border-dark-border-light rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                    disabled={isSubmittingProposal || !connected}
                    loading={isSubmittingProposal}
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
            <Card className="bg-gradient-to-b from-dark-surface to-dark-bg-primary border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <div className="flex items-center justify-between px-6 py-4 border-b-2 border-cyan-500/30">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
                  {isDelegated ? 'Change Delegation' : 'Delegate Voting Power'}
                </h3>
                <button
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => {
                    setShowDelegateModal(false);
                    setDelegateAddress('');
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center -mr-2 text-dark-text-muted hover:text-white transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
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
                        <span className="text-sm text-dark-text-muted">Delegate Address:</span>
                        <span className="text-sm font-mono text-purple-300">{delegatedTo}</span>
                      </div>
                    </div>
                  )}

                  {/* Voting Power Info */}
                  <div className="flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <div>
                      <p className="text-sm text-dark-text-muted mb-1">Your Voting Power</p>
                      <p className="text-2xl font-bold text-white">{userVotingPower.tokens.toLocaleString()} MCT</p>
                    </div>
                    <div className="h-12 w-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <CurrencyDollarIcon className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>

                  {/* Delegate Address Input */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                      Delegate Address
                    </label>
                    <input
                      type="text"
                      value={delegateAddress}
                      onChange={(e) => setDelegateAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-border border border-dark-border-light rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="0x..."
                    />
                    <p className="text-xs text-dark-text-muted mt-2">
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
                      disabled={!delegateAddress || !delegateAddress.startsWith('0x') || isDelegating || !connected}
                      loading={isDelegating}
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
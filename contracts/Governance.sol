// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Governance
 * @dev Decentralized governance for ModelChain platform
 * Allows token holders to create and vote on proposals
 */
contract Governance is Ownable, ReentrancyGuard {
    
    // Proposal states
    enum ProposalState { 
        PENDING,    // Just created, waiting for voting period
        ACTIVE,     // Voting in progress
        CANCELED,   // Canceled by proposer
        DEFEATED,   // Did not reach quorum or majority
        SUCCEEDED,  // Passed but not yet executed
        QUEUED,     // Waiting for timelock
        EXECUTED,   // Successfully executed
        EXPIRED     // Execution period passed
    }
    
    // Proposal types
    enum ProposalType {
        PARAMETER_CHANGE,   // Change platform parameters
        FEATURE_REQUEST,    // New feature proposal
        TREASURY,           // Treasury spending
        EMERGENCY,          // Emergency action
        OTHER
    }
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        string ipfsHash;        // Detailed proposal on IPFS
        ProposalType proposalType;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 startTime;
        uint256 endTime;
        uint256 executionTime;
        bool executed;
        bool canceled;
        bytes[] calldatas;      // Execution data
        address[] targets;      // Contracts to call
    }
    
    // Vote types
    enum VoteType { AGAINST, FOR, ABSTAIN }
    
    // Vote record
    struct Vote {
        bool hasVoted;
        VoteType voteType;
        uint256 weight;
    }
    
    // Staking for governance power
    struct Stake {
        uint256 amount;
        uint256 stakedAt;
        uint256 lockPeriod;
    }
    
    // Constants
    uint256 public constant MIN_PROPOSAL_THRESHOLD = 100 ether; // Min stake to propose
    uint256 public constant VOTING_DELAY = 1 days;              // Time before voting starts
    uint256 public constant VOTING_PERIOD = 7 days;             // Voting duration
    uint256 public constant EXECUTION_DELAY = 2 days;           // Timelock
    uint256 public constant EXECUTION_WINDOW = 14 days;         // Time to execute
    uint256 public constant QUORUM_PERCENT = 4;                 // 4% of total supply
    
    // State variables
    uint256 public proposalCount;
    uint256 public totalStaked;
    
    // Mappings
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(address => Stake) public stakes;
    mapping(address => uint256) public votingPower;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        ProposalType proposalType,
        uint256 startTime,
        uint256 endTime
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        VoteType voteType,
        uint256 weight
    );
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event Staked(address indexed user, uint256 amount, uint256 lockPeriod);
    event Unstaked(address indexed user, uint256 amount);
    event DelegateChanged(address indexed delegator, address indexed toDelegate);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Stake tokens for governance power
     */
    function stake(uint256 lockPeriod) external payable nonReentrant {
        require(msg.value > 0, "Amount must be greater than 0");
        require(lockPeriod >= 7 days, "Min lock period is 7 days");
        require(lockPeriod <= 365 days, "Max lock period is 365 days");
        
        Stake storage userStake = stakes[msg.sender];
        
        // Calculate voting power multiplier based on lock period
        // Longer lock = more voting power (up to 4x for 1 year)
        uint256 multiplier = 100 + ((lockPeriod * 300) / 365 days);
        uint256 power = (msg.value * multiplier) / 100;
        
        userStake.amount += msg.value;
        userStake.stakedAt = block.timestamp;
        userStake.lockPeriod = lockPeriod;
        
        votingPower[msg.sender] += power;
        totalStaked += msg.value;
        
        emit Staked(msg.sender, msg.value, lockPeriod);
    }
    
    /**
     * @dev Unstake tokens after lock period
     */
    function unstake(uint256 amount) external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient stake");
        require(
            block.timestamp >= userStake.stakedAt + userStake.lockPeriod,
            "Tokens still locked"
        );
        
        // Recalculate voting power
        uint256 multiplier = 100 + ((userStake.lockPeriod * 300) / 365 days);
        uint256 powerReduction = (amount * multiplier) / 100;
        
        userStake.amount -= amount;
        votingPower[msg.sender] -= powerReduction;
        totalStaked -= amount;
        
        payable(msg.sender).transfer(amount);
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @dev Create a new proposal
     */
    function createProposal(
        string memory title,
        string memory description,
        string memory ipfsHash,
        ProposalType proposalType,
        address[] memory targets,
        bytes[] memory calldatas
    ) external returns (uint256) {
        require(votingPower[msg.sender] >= MIN_PROPOSAL_THRESHOLD, "Insufficient voting power");
        require(bytes(title).length > 0, "Title required");
        require(targets.length == calldatas.length, "Array length mismatch");
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        uint256 startTime = block.timestamp + VOTING_DELAY;
        uint256 endTime = startTime + VOTING_PERIOD;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            title: title,
            description: description,
            ipfsHash: ipfsHash,
            proposalType: proposalType,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            startTime: startTime,
            endTime: endTime,
            executionTime: 0,
            executed: false,
            canceled: false,
            calldatas: calldatas,
            targets: targets
        });
        
        emit ProposalCreated(proposalId, msg.sender, title, proposalType, startTime, endTime);
        return proposalId;
    }
    
    /**
     * @dev Cast a vote on a proposal
     */
    function castVote(uint256 proposalId, VoteType voteType) external {
        require(getProposalState(proposalId) == ProposalState.ACTIVE, "Voting not active");
        require(!votes[proposalId][msg.sender].hasVoted, "Already voted");
        require(votingPower[msg.sender] > 0, "No voting power");
        
        uint256 weight = votingPower[msg.sender];
        
        votes[proposalId][msg.sender] = Vote({
            hasVoted: true,
            voteType: voteType,
            weight: weight
        });
        
        Proposal storage proposal = proposals[proposalId];
        
        if (voteType == VoteType.FOR) {
            proposal.forVotes += weight;
        } else if (voteType == VoteType.AGAINST) {
            proposal.againstVotes += weight;
        } else {
            proposal.abstainVotes += weight;
        }
        
        emit VoteCast(proposalId, msg.sender, voteType, weight);
    }
    
    /**
     * @dev Get current state of a proposal
     */
    function getProposalState(uint256 proposalId) public view returns (ProposalState) {
        Proposal memory proposal = proposals[proposalId];
        
        if (proposal.canceled) {
            return ProposalState.CANCELED;
        }
        
        if (proposal.executed) {
            return ProposalState.EXECUTED;
        }
        
        if (block.timestamp < proposal.startTime) {
            return ProposalState.PENDING;
        }
        
        if (block.timestamp <= proposal.endTime) {
            return ProposalState.ACTIVE;
        }
        
        // Check if quorum reached and majority for
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        uint256 quorum = (totalStaked * QUORUM_PERCENT) / 100;
        
        if (totalVotes < quorum || proposal.forVotes <= proposal.againstVotes) {
            return ProposalState.DEFEATED;
        }
        
        if (proposal.executionTime == 0) {
            return ProposalState.SUCCEEDED;
        }
        
        if (block.timestamp < proposal.executionTime) {
            return ProposalState.QUEUED;
        }
        
        if (block.timestamp > proposal.executionTime + EXECUTION_WINDOW) {
            return ProposalState.EXPIRED;
        }
        
        return ProposalState.QUEUED;
    }
    
    /**
     * @dev Queue a succeeded proposal for execution
     */
    function queueProposal(uint256 proposalId) external {
        require(getProposalState(proposalId) == ProposalState.SUCCEEDED, "Not succeeded");
        
        proposals[proposalId].executionTime = block.timestamp + EXECUTION_DELAY;
    }
    
    /**
     * @dev Execute a queued proposal
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        ProposalState state = getProposalState(proposalId);
        require(state == ProposalState.QUEUED, "Not ready for execution");
        require(
            block.timestamp >= proposals[proposalId].executionTime,
            "Timelock not passed"
        );
        
        Proposal storage proposal = proposals[proposalId];
        proposal.executed = true;
        
        // Execute all calls
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            (bool success, ) = proposal.targets[i].call(proposal.calldatas[i]);
            require(success, "Execution failed");
        }
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Cancel a proposal (only proposer before voting ends)
     */
    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.proposer == msg.sender, "Only proposer");
        require(!proposal.executed, "Already executed");
        require(block.timestamp < proposal.endTime, "Voting ended");
        
        proposal.canceled = true;
        emit ProposalCanceled(proposalId);
    }
    
    // View functions
    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }
    
    function getVote(uint256 proposalId, address voter) external view returns (Vote memory) {
        return votes[proposalId][voter];
    }
    
    function getStake(address user) external view returns (Stake memory) {
        return stakes[user];
    }
    
    function getVotingPower(address user) external view returns (uint256) {
        return votingPower[user];
    }
}

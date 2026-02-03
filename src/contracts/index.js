// Contract addresses for different networks
// Update these after deploying contracts

export const CONTRACT_ADDRESSES = {
  // Localhost/Hardhat
  localhost: {
    ModelRegistry: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    Marketplace: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    Governance: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    UserRegistry: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  },
  
  // Polygon Amoy Testnet (Recommended for FYP)
  polygonAmoy: {
    ModelRegistry: '0x276BBe55C5163a3a7aD3057b35169eCcc344a5AC',
    Marketplace: '0x7e77a578Ad335D2a8459324d91d0a73d1E680b91',
    Governance: '0xfD1907A8B9Bb163dbbfaf656e1113565BaABe0AE',
    UserRegistry: '0x88B072E8d297888a0099d687d238135b481E307D',
  },
  
  // Sepolia Testnet
  sepolia: {
    ModelRegistry: '',
    Marketplace: '',
    Governance: '',
    UserRegistry: '',
  },
  
  // Polygon Mainnet
  polygon: {
    ModelRegistry: '',
    Marketplace: '',
    Governance: '',
    UserRegistry: '',
  },
  
  // Ethereum Mainnet
  mainnet: {
    ModelRegistry: '',
    Marketplace: '',
    Governance: '',
    UserRegistry: '',
  },
};

// Alias for backward compatibility
export const CONTRACTS = CONTRACT_ADDRESSES;

// Get contracts for current network
export const getContracts = (chainId) => {
  switch (chainId) {
    case 1:
      return CONTRACTS.mainnet;
    case 11155111:
      return CONTRACTS.sepolia;
    case 137:
      return CONTRACTS.polygon;
    case 80002:
      return CONTRACTS.polygonAmoy;
    case 31337:
    default:
      return CONTRACTS.localhost;
  }
};

// ABI exports
import ModelRegistryABI from './abis/ModelRegistry.json';
import MarketplaceABI from './abis/Marketplace.json';
import GovernanceABI from './abis/Governance.json';

// UserRegistry ABI - simplified version until contract is compiled
export const USER_REGISTRY_ABI = [
  "function registerUser(string memory _ipfsHash, uint8 _role) external",
  "function updateProfile(string memory _newIpfsHash) external",
  "function upgradeToDeveloper(string memory _newIpfsHash) external",
  "function stakeAsValidator() external payable",
  "function unstakeValidator(uint256 _amount) external",
  "function isUserRegistered(address _user) external view returns (bool)",
  "function getUserProfile(address _user) external view returns (string memory ipfsHash, uint8 primaryRole, bool isDeveloper, bool isValidator, uint256 registeredAt, uint256 reputation, uint256 totalTransactions, bool isActive)",
  "function getDeveloperInfo(address _developer) external view returns (uint256 modelsUploaded, uint256 totalSales, uint256 averageRating)",
  "function getValidatorInfo(address _validator) external view returns (uint256 stakedAmount, uint256 validationsCount, uint256 successfulValidations, bool isApproved)",
  "function getTotalUsers() external view returns (uint256)",
  "function getTotalValidators() external view returns (uint256)",
  "function getTotalDevelopers() external view returns (uint256)",
  "function validatorMinStake() external view returns (uint256)",
  "event UserRegistered(address indexed user, uint8 role, string ipfsHash, uint256 timestamp)",
  "event ProfileUpdated(address indexed user, string newIpfsHash, uint256 timestamp)",
  "event RoleUpgraded(address indexed user, uint8 newRole, uint256 timestamp)",
  "event ValidatorStaked(address indexed validator, uint256 amount, uint256 timestamp)"
];

export const MODEL_REGISTRY_ABI = ModelRegistryABI;
export const MARKETPLACE_ABI = MarketplaceABI;
export const GOVERNANCE_ABI = GovernanceABI;

export { ModelRegistryABI, MarketplaceABI, GovernanceABI };

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title UserRegistry
 * @dev Decentralized user profile registry for ModelChain
 * User data is stored on IPFS, only the hash is stored on-chain
 */
contract UserRegistry is Ownable, ReentrancyGuard {
    
    // User roles
    enum UserRole { Buyer, Developer, Validator }
    
    // User profile structure (minimal on-chain data)
    struct User {
        string ipfsHash;           // IPFS hash containing full profile data
        UserRole primaryRole;      // Primary role: Buyer, Developer, or Validator
        bool isDeveloper;          // Can upload and sell models
        bool isValidator;          // Can validate models
        uint256 registeredAt;      // Registration timestamp
        uint256 reputation;        // Reputation score (0-1000)
        uint256 totalTransactions; // Total completed transactions
        bool isActive;             // Account active status
    }
    
    // Validator-specific data
    struct ValidatorInfo {
        uint256 stakedAmount;      // Amount staked for validation rights
        uint256 validationsCount;  // Number of validations performed
        uint256 successfulValidations; // Successful validations
        bool isApproved;           // Admin approved validator
    }
    
    // Developer-specific data
    struct DeveloperInfo {
        uint256 modelsUploaded;    // Number of models uploaded
        uint256 totalSales;        // Total sales amount
        uint256 totalRatings;      // Sum of all ratings received
        uint256 ratingsCount;      // Number of ratings received
    }
    
    // State variables
    mapping(address => User) public users;
    mapping(address => ValidatorInfo) public validators;
    mapping(address => DeveloperInfo) public developers;
    
    // Lists for enumeration
    address[] public userList;
    address[] public validatorList;
    address[] public developerList;
    
    // Minimum stake required to become a validator (in wei)
    uint256 public validatorMinStake = 0.1 ether;
    
    // Events
    event UserRegistered(address indexed user, UserRole role, string ipfsHash, uint256 timestamp);
    event ProfileUpdated(address indexed user, string newIpfsHash, uint256 timestamp);
    event RoleUpgraded(address indexed user, UserRole newRole, uint256 timestamp);
    event ValidatorStaked(address indexed validator, uint256 amount, uint256 timestamp);
    event ValidatorUnstaked(address indexed validator, uint256 amount, uint256 timestamp);
    event ValidatorApproved(address indexed validator, uint256 timestamp);
    event ReputationUpdated(address indexed user, uint256 newReputation, uint256 timestamp);
    event DeveloperStatsUpdated(address indexed developer, uint256 modelsUploaded, uint256 totalSales);
    
    constructor() Ownable(msg.sender) {}
    
    // Modifiers
    modifier onlyRegistered() {
        require(users[msg.sender].isActive, "User not registered");
        _;
    }
    
    modifier onlyValidator() {
        require(users[msg.sender].isValidator, "Not a validator");
        require(validators[msg.sender].isApproved, "Validator not approved");
        _;
    }
    
    modifier onlyDeveloper() {
        require(users[msg.sender].isDeveloper, "Not a developer");
        _;
    }
    
    /**
     * @dev Register a new user
     * @param _ipfsHash IPFS hash containing full profile data
     * @param _role Primary role selection
     */
    function registerUser(string memory _ipfsHash, UserRole _role) external nonReentrant {
        require(!users[msg.sender].isActive, "User already registered");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        
        bool isDev = (_role == UserRole.Developer);
        bool isVal = (_role == UserRole.Validator);
        
        users[msg.sender] = User({
            ipfsHash: _ipfsHash,
            primaryRole: _role,
            isDeveloper: isDev,
            isValidator: isVal,
            registeredAt: block.timestamp,
            reputation: 500, // Start with neutral reputation
            totalTransactions: 0,
            isActive: true
        });
        
        userList.push(msg.sender);
        
        if (isDev) {
            developers[msg.sender] = DeveloperInfo({
                modelsUploaded: 0,
                totalSales: 0,
                totalRatings: 0,
                ratingsCount: 0
            });
            developerList.push(msg.sender);
        }
        
        if (isVal) {
            validators[msg.sender] = ValidatorInfo({
                stakedAmount: 0,
                validationsCount: 0,
                successfulValidations: 0,
                isApproved: false
            });
            validatorList.push(msg.sender);
        }
        
        emit UserRegistered(msg.sender, _role, _ipfsHash, block.timestamp);
    }
    
    /**
     * @dev Update user profile IPFS hash
     * @param _newIpfsHash New IPFS hash
     */
    function updateProfile(string memory _newIpfsHash) external onlyRegistered {
        require(bytes(_newIpfsHash).length > 0, "IPFS hash required");
        users[msg.sender].ipfsHash = _newIpfsHash;
        emit ProfileUpdated(msg.sender, _newIpfsHash, block.timestamp);
    }
    
    /**
     * @dev Upgrade to developer role
     * @param _newIpfsHash Updated profile IPFS hash
     */
    function upgradeToDeveloper(string memory _newIpfsHash) external onlyRegistered {
        require(!users[msg.sender].isDeveloper, "Already a developer");
        
        users[msg.sender].isDeveloper = true;
        users[msg.sender].ipfsHash = _newIpfsHash;
        
        developers[msg.sender] = DeveloperInfo({
            modelsUploaded: 0,
            totalSales: 0,
            totalRatings: 0,
            ratingsCount: 0
        });
        developerList.push(msg.sender);
        
        emit RoleUpgraded(msg.sender, UserRole.Developer, block.timestamp);
    }
    
    /**
     * @dev Stake to become a validator
     */
    function stakeAsValidator() external payable onlyRegistered nonReentrant {
        require(msg.value >= validatorMinStake, "Insufficient stake amount");
        
        if (!users[msg.sender].isValidator) {
            users[msg.sender].isValidator = true;
            validators[msg.sender] = ValidatorInfo({
                stakedAmount: msg.value,
                validationsCount: 0,
                successfulValidations: 0,
                isApproved: false
            });
            validatorList.push(msg.sender);
        } else {
            validators[msg.sender].stakedAmount += msg.value;
        }
        
        emit ValidatorStaked(msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * @dev Unstake validator funds (only if not actively validating)
     * @param _amount Amount to unstake
     */
    function unstakeValidator(uint256 _amount) external onlyRegistered nonReentrant {
        require(users[msg.sender].isValidator, "Not a validator");
        require(validators[msg.sender].stakedAmount >= _amount, "Insufficient staked balance");
        
        validators[msg.sender].stakedAmount -= _amount;
        
        // If stake falls below minimum, deactivate validator status
        if (validators[msg.sender].stakedAmount < validatorMinStake) {
            validators[msg.sender].isApproved = false;
        }
        
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit ValidatorUnstaked(msg.sender, _amount, block.timestamp);
    }
    
    /**
     * @dev Approve a validator (admin only)
     * @param _validator Validator address
     */
    function approveValidator(address _validator) external onlyOwner {
        require(users[_validator].isValidator, "Not a validator");
        require(validators[_validator].stakedAmount >= validatorMinStake, "Insufficient stake");
        
        validators[_validator].isApproved = true;
        emit ValidatorApproved(_validator, block.timestamp);
    }
    
    /**
     * @dev Update user reputation (called by other contracts)
     * @param _user User address
     * @param _newReputation New reputation score
     */
    function updateReputation(address _user, uint256 _newReputation) external onlyOwner {
        require(users[_user].isActive, "User not registered");
        require(_newReputation <= 1000, "Reputation max is 1000");
        
        users[_user].reputation = _newReputation;
        emit ReputationUpdated(_user, _newReputation, block.timestamp);
    }
    
    /**
     * @dev Increment transaction count
     * @param _user User address
     */
    function incrementTransactions(address _user) external onlyOwner {
        require(users[_user].isActive, "User not registered");
        users[_user].totalTransactions++;
    }
    
    /**
     * @dev Update developer stats (called by Marketplace contract)
     * @param _developer Developer address
     * @param _saleAmount Sale amount to add
     * @param _rating Rating received (0-5)
     */
    function updateDeveloperStats(
        address _developer, 
        uint256 _saleAmount, 
        uint256 _rating
    ) external onlyOwner {
        require(users[_developer].isDeveloper, "Not a developer");
        
        developers[_developer].totalSales += _saleAmount;
        if (_rating > 0 && _rating <= 5) {
            developers[_developer].totalRatings += _rating;
            developers[_developer].ratingsCount++;
        }
        
        emit DeveloperStatsUpdated(
            _developer, 
            developers[_developer].modelsUploaded, 
            developers[_developer].totalSales
        );
    }
    
    /**
     * @dev Increment models uploaded count
     * @param _developer Developer address
     */
    function incrementModelsUploaded(address _developer) external onlyOwner {
        require(users[_developer].isDeveloper, "Not a developer");
        developers[_developer].modelsUploaded++;
    }
    
    /**
     * @dev Record a validation
     * @param _validator Validator address
     * @param _successful Whether validation was successful
     */
    function recordValidation(address _validator, bool _successful) external onlyOwner {
        require(users[_validator].isValidator, "Not a validator");
        
        validators[_validator].validationsCount++;
        if (_successful) {
            validators[_validator].successfulValidations++;
        }
    }
    
    /**
     * @dev Set minimum validator stake
     * @param _minStake New minimum stake
     */
    function setValidatorMinStake(uint256 _minStake) external onlyOwner {
        validatorMinStake = _minStake;
    }
    
    // View functions
    
    /**
     * @dev Check if user is registered
     */
    function isUserRegistered(address _user) external view returns (bool) {
        return users[_user].isActive;
    }
    
    /**
     * @dev Get user's full profile
     */
    function getUserProfile(address _user) external view returns (
        string memory ipfsHash,
        UserRole primaryRole,
        bool isDeveloper,
        bool isValidator,
        uint256 registeredAt,
        uint256 reputation,
        uint256 totalTransactions,
        bool isActive
    ) {
        User memory user = users[_user];
        return (
            user.ipfsHash,
            user.primaryRole,
            user.isDeveloper,
            user.isValidator,
            user.registeredAt,
            user.reputation,
            user.totalTransactions,
            user.isActive
        );
    }
    
    /**
     * @dev Get developer info
     */
    function getDeveloperInfo(address _developer) external view returns (
        uint256 modelsUploaded,
        uint256 totalSales,
        uint256 averageRating
    ) {
        DeveloperInfo memory dev = developers[_developer];
        uint256 avgRating = dev.ratingsCount > 0 
            ? (dev.totalRatings * 100) / dev.ratingsCount 
            : 0;
        return (dev.modelsUploaded, dev.totalSales, avgRating);
    }
    
    /**
     * @dev Get validator info
     */
    function getValidatorInfo(address _validator) external view returns (
        uint256 stakedAmount,
        uint256 validationsCount,
        uint256 successfulValidations,
        bool isApproved
    ) {
        ValidatorInfo memory val = validators[_validator];
        return (val.stakedAmount, val.validationsCount, val.successfulValidations, val.isApproved);
    }
    
    /**
     * @dev Get total user count
     */
    function getTotalUsers() external view returns (uint256) {
        return userList.length;
    }
    
    /**
     * @dev Get total validator count
     */
    function getTotalValidators() external view returns (uint256) {
        return validatorList.length;
    }
    
    /**
     * @dev Get total developer count
     */
    function getTotalDevelopers() external view returns (uint256) {
        return developerList.length;
    }
}

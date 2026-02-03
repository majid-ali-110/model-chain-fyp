// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./ModelRegistry.sol";

/**
 * @title Marketplace
 * @dev Marketplace contract for buying/selling AI models
 * Handles payments, licensing, and revenue distribution
 */
contract Marketplace is Ownable, ReentrancyGuard, Pausable {
    
    // Reference to ModelRegistry contract
    ModelRegistry public modelRegistry;
    
    // Platform fee percentage (e.g., 250 = 2.5%)
    uint256 public platformFeePercent = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Minimum price for paid models
    uint256 public minPrice = 0.001 ether;
    
    // License types
    enum LicenseType { PERSONAL, COMMERCIAL, ENTERPRISE }
    
    // Purchase record
    struct Purchase {
        uint256 modelId;
        address buyer;
        uint256 price;
        LicenseType licenseType;
        uint256 purchasedAt;
        bool isActive;
    }
    
    // Listing structure
    struct Listing {
        uint256 modelId;
        address seller;
        uint256 basePrice;
        uint256 commercialMultiplier;  // e.g., 300 = 3x for commercial
        uint256 enterpriseMultiplier;  // e.g., 1000 = 10x for enterprise
        bool isActive;
        uint256 totalSales;
        uint256 totalRevenue;
    }
    
    // Mappings
    mapping(uint256 => Listing) public listings;
    mapping(address => Purchase[]) public userPurchases;
    mapping(uint256 => mapping(address => bool)) public hasAccess;
    mapping(address => uint256) public sellerEarnings;
    mapping(address => uint256) public pendingWithdrawals;
    
    // Events
    event ModelListed(uint256 indexed modelId, address indexed seller, uint256 basePrice);
    event ModelDelisted(uint256 indexed modelId);
    event ModelPurchased(
        uint256 indexed modelId, 
        address indexed buyer, 
        uint256 price, 
        LicenseType licenseType
    );
    event EarningsWithdrawn(address indexed seller, uint256 amount);
    event PlatformFeeUpdated(uint256 newFee);
    event ListingUpdated(uint256 indexed modelId, uint256 newPrice);
    
    constructor(address _modelRegistry) Ownable(msg.sender) {
        modelRegistry = ModelRegistry(_modelRegistry);
    }
    
    /**
     * @dev List a model for sale
     */
    function listModel(
        uint256 modelId,
        uint256 basePrice,
        uint256 commercialMultiplier,
        uint256 enterpriseMultiplier
    ) external {
        require(modelRegistry.ownerOf(modelId) == msg.sender, "Not the model owner");
        require(basePrice >= minPrice || basePrice == 0, "Price below minimum");
        require(commercialMultiplier >= 100, "Commercial multiplier too low");
        require(enterpriseMultiplier >= commercialMultiplier, "Enterprise must be >= commercial");
        
        listings[modelId] = Listing({
            modelId: modelId,
            seller: msg.sender,
            basePrice: basePrice,
            commercialMultiplier: commercialMultiplier,
            enterpriseMultiplier: enterpriseMultiplier,
            isActive: true,
            totalSales: 0,
            totalRevenue: 0
        });
        
        emit ModelListed(modelId, msg.sender, basePrice);
    }
    
    /**
     * @dev Update listing price
     */
    function updateListing(
        uint256 modelId,
        uint256 newBasePrice,
        uint256 commercialMultiplier,
        uint256 enterpriseMultiplier
    ) external {
        Listing storage listing = listings[modelId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "Listing not active");
        
        listing.basePrice = newBasePrice;
        listing.commercialMultiplier = commercialMultiplier;
        listing.enterpriseMultiplier = enterpriseMultiplier;
        
        emit ListingUpdated(modelId, newBasePrice);
    }
    
    /**
     * @dev Delist a model
     */
    function delistModel(uint256 modelId) external {
        Listing storage listing = listings[modelId];
        require(listing.seller == msg.sender || owner() == msg.sender, "Not authorized");
        
        listing.isActive = false;
        emit ModelDelisted(modelId);
    }
    
    /**
     * @dev Calculate price based on license type
     */
    function calculatePrice(uint256 modelId, LicenseType licenseType) 
        public 
        view 
        returns (uint256) 
    {
        Listing memory listing = listings[modelId];
        require(listing.isActive, "Model not listed");
        
        if (licenseType == LicenseType.PERSONAL) {
            return listing.basePrice;
        } else if (licenseType == LicenseType.COMMERCIAL) {
            return (listing.basePrice * listing.commercialMultiplier) / 100;
        } else {
            return (listing.basePrice * listing.enterpriseMultiplier) / 100;
        }
    }
    
    /**
     * @dev Purchase a model
     */
    function purchaseModel(uint256 modelId, LicenseType licenseType) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        Listing storage listing = listings[modelId];
        require(listing.isActive, "Model not listed");
        require(!hasAccess[modelId][msg.sender], "Already purchased");
        
        uint256 price = calculatePrice(modelId, licenseType);
        require(msg.value >= price, "Insufficient payment");
        
        // Calculate fees
        uint256 platformFee = (price * platformFeePercent) / FEE_DENOMINATOR;
        uint256 sellerAmount = price - platformFee;
        
        // Update state
        hasAccess[modelId][msg.sender] = true;
        listing.totalSales++;
        listing.totalRevenue += price;
        
        // Record purchase
        userPurchases[msg.sender].push(Purchase({
            modelId: modelId,
            buyer: msg.sender,
            price: price,
            licenseType: licenseType,
            purchasedAt: block.timestamp,
            isActive: true
        }));
        
        // Credit seller
        pendingWithdrawals[listing.seller] += sellerAmount;
        sellerEarnings[listing.seller] += sellerAmount;
        
        // Record download in registry
        modelRegistry.recordDownload(modelId);
        
        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        
        emit ModelPurchased(modelId, msg.sender, price, licenseType);
    }
    
    /**
     * @dev Withdraw pending earnings
     */
    function withdrawEarnings() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No earnings to withdraw");
        
        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        
        emit EarningsWithdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Check if user has access to a model
     */
    function checkAccess(uint256 modelId, address user) external view returns (bool) {
        // Owner always has access
        if (modelRegistry.ownerOf(modelId) == user) return true;
        // Check if purchased
        return hasAccess[modelId][user];
    }
    
    /**
     * @dev Get user's purchases
     */
    function getUserPurchases(address user) external view returns (Purchase[] memory) {
        return userPurchases[user];
    }
    
    /**
     * @dev Get listing details
     */
    function getListing(uint256 modelId) external view returns (Listing memory) {
        return listings[modelId];
    }
    
    // Admin functions
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFeePercent = newFee;
        emit PlatformFeeUpdated(newFee);
    }
    
    function setMinPrice(uint256 newMinPrice) external onlyOwner {
        minPrice = newMinPrice;
    }
    
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        payable(owner()).transfer(balance);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ModelRegistry
 * @dev NFT-based registry for AI models on ModelChain
 * Each model is represented as an ERC721 token with metadata stored on IPFS
 */
contract ModelRegistry is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    // Model categories
    enum Category { TEXT, IMAGE, AUDIO, VIDEO, MULTIMODAL, OTHER }
    
    // Model status
    enum Status { PENDING, VALIDATED, REJECTED, SUSPENDED }

    // Model structure
    struct Model {
        uint256 id;
        address owner;
        string name;
        string ipfsHash;        // IPFS hash for model files
        string metadataHash;    // IPFS hash for metadata JSON
        Category category;
        Status status;
        uint256 price;          // Price in wei
        uint256 createdAt;
        uint256 updatedAt;
        uint256 totalDownloads;
        uint256 totalRatings;
        uint256 ratingSum;
    }

    // Mappings
    mapping(uint256 => Model) public models;
    mapping(address => uint256[]) public ownerModels;
    mapping(string => bool) public ipfsHashUsed;
    
    // Events
    event ModelRegistered(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        string ipfsHash,
        Category category,
        uint256 price
    );
    event ModelUpdated(uint256 indexed tokenId, string metadataHash, uint256 price);
    event ModelStatusChanged(uint256 indexed tokenId, Status status);
    event ModelPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event ModelRated(uint256 indexed tokenId, address indexed rater, uint8 rating);
    event ModelDownloaded(uint256 indexed tokenId, address indexed downloader);

    // Modifiers
    modifier onlyModelOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not the model owner");
        _;
    }

    modifier modelExists(uint256 tokenId) {
        require(_exists(tokenId), "Model does not exist");
        _;
    }

    constructor() ERC721("ModelChain AI Model", "MCAI") Ownable(msg.sender) {}

    /**
     * @dev Register a new AI model
     * @param name Model name
     * @param ipfsHash IPFS hash where model files are stored
     * @param metadataHash IPFS hash for metadata JSON
     * @param category Model category
     * @param price Price in wei (0 for free models)
     */
    function registerModel(
        string memory name,
        string memory ipfsHash,
        string memory metadataHash,
        Category category,
        uint256 price
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(!ipfsHashUsed[ipfsHash], "Model already registered");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataHash);

        models[tokenId] = Model({
            id: tokenId,
            owner: msg.sender,
            name: name,
            ipfsHash: ipfsHash,
            metadataHash: metadataHash,
            category: category,
            status: Status.PENDING,
            price: price,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            totalDownloads: 0,
            totalRatings: 0,
            ratingSum: 0
        });

        ownerModels[msg.sender].push(tokenId);
        ipfsHashUsed[ipfsHash] = true;

        emit ModelRegistered(tokenId, msg.sender, name, ipfsHash, category, price);
        return tokenId;
    }

    /**
     * @dev Update model metadata and price
     */
    function updateModel(
        uint256 tokenId,
        string memory metadataHash,
        uint256 price
    ) external modelExists(tokenId) onlyModelOwner(tokenId) {
        Model storage model = models[tokenId];
        model.metadataHash = metadataHash;
        model.price = price;
        model.updatedAt = block.timestamp;
        
        _setTokenURI(tokenId, metadataHash);

        emit ModelUpdated(tokenId, metadataHash, price);
    }

    /**
     * @dev Update model status (only owner/validators)
     */
    function setModelStatus(uint256 tokenId, Status status) 
        external 
        modelExists(tokenId) 
        onlyOwner 
    {
        models[tokenId].status = status;
        models[tokenId].updatedAt = block.timestamp;
        emit ModelStatusChanged(tokenId, status);
    }

    /**
     * @dev Record a model download
     */
    function recordDownload(uint256 tokenId) 
        external 
        modelExists(tokenId) 
    {
        models[tokenId].totalDownloads++;
        emit ModelDownloaded(tokenId, msg.sender);
    }

    /**
     * @dev Rate a model (1-5 stars)
     */
    function rateModel(uint256 tokenId, uint8 rating) 
        external 
        modelExists(tokenId) 
    {
        require(rating >= 1 && rating <= 5, "Rating must be 1-5");
        
        Model storage model = models[tokenId];
        model.totalRatings++;
        model.ratingSum += rating;
        
        emit ModelRated(tokenId, msg.sender, rating);
    }

    // View functions
    function getModel(uint256 tokenId) external view returns (Model memory) {
        require(_exists(tokenId), "Model does not exist");
        return models[tokenId];
    }

    function getOwnerModels(address owner) external view returns (uint256[] memory) {
        return ownerModels[owner];
    }

    function getTotalModels() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function getAverageRating(uint256 tokenId) external view returns (uint256) {
        Model memory model = models[tokenId];
        if (model.totalRatings == 0) return 0;
        return (model.ratingSum * 100) / model.totalRatings; // Returns rating * 100 for precision
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}

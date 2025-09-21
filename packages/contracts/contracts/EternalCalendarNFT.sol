// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title EternalCalendarNFT
 * @dev NFT contract for minting calendar-based NFTs on IRYS Testnet
 * @author Eternal Calendar dApp
 */
contract EternalCalendarNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Minting configuration
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public mintPrice = 0.01 ether; // 0.01 IRYS
    bool public mintingEnabled = true;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MintPriceUpdated(uint256 newPrice);
    event MintingToggled(bool enabled);
    event BaseURIUpdated(string newBaseURI);
    
    /**
     * @dev Constructor sets the initial owner and base URI
     * @param baseURI The base URI for token metadata
     */
    constructor(string memory baseURI) ERC721("Eternal Calendar NFT", "ECNFT") {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Mint a new NFT to the caller
     * @param tokenURI The URI for the token metadata
     */
    function mintNFT(string memory tokenURI) public payable nonReentrant {
        require(mintingEnabled, "Minting is currently disabled");
        require(msg.value >= mintPrice, "Insufficient payment");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Maximum supply reached");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit NFTMinted(msg.sender, tokenId, tokenURI);
    }
    
    /**
     * @dev Mint multiple NFTs in a single transaction
     * @param tokenURIs Array of URIs for the token metadata
     */
    function mintMultipleNFTs(string[] memory tokenURIs) public payable nonReentrant {
        require(mintingEnabled, "Minting is currently disabled");
        require(tokenURIs.length > 0, "No token URIs provided");
        require(tokenURIs.length <= 10, "Maximum 10 NFTs per transaction");
        require(msg.value >= mintPrice * tokenURIs.length, "Insufficient payment");
        require(_tokenIdCounter.current() + tokenURIs.length <= MAX_SUPPLY, "Exceeds maximum supply");
        
        for (uint256 i = 0; i < tokenURIs.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            
            emit NFTMinted(msg.sender, tokenId, tokenURIs[i]);
        }
    }
    
    /**
     * @dev Get the current token ID counter
     * @return Current token ID
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Get the total supply
     * @return Total number of minted tokens
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Check if minting is available
     * @return True if minting is enabled and supply is available
     */
    function isMintingAvailable() public view returns (bool) {
        return mintingEnabled && _tokenIdCounter.current() < MAX_SUPPLY;
    }
    
    /**
     * @dev Set the mint price (only owner)
     * @param newPrice New mint price in wei
     */
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }
    
    /**
     * @dev Toggle minting on/off (only owner)
     * @param enabled Whether minting should be enabled
     */
    function setMintingEnabled(bool enabled) public onlyOwner {
        mintingEnabled = enabled;
        emit MintingToggled(enabled);
    }
    
    /**
     * @dev Set the base URI for token metadata (only owner)
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }
    
    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Override base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Override token URI
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override supportsInterface
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Override _burn
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}

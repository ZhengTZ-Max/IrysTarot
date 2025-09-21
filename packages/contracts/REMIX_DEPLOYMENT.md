# 使用 Remix IDE 部署智能合约

## 步骤 1: 访问 Remix IDE
打开浏览器访问：https://remix.ethereum.org

## 步骤 2: 创建合约文件
1. 在 Remix 左侧文件浏览器中，右键点击 "contracts" 文件夹
2. 选择 "New File"
3. 文件名输入：`EternalCalendarNFT.sol`

## 步骤 3: 复制合约代码
将以下完整合约代码复制到 Remix 中：

```solidity
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
```

## 步骤 4: 安装 OpenZeppelin 依赖
1. 在 Remix 中，点击 "Solidity Compiler" 标签页
2. 在 "Advanced Configurations" 中，点击 "OpenZeppelin Contracts"
3. 选择最新版本并安装

## 步骤 5: 编译合约
1. 确保编译器版本设置为 0.8.19
2. 点击 "Compile EternalCalendarNFT.sol"
3. 等待编译完成，确保没有错误

## 步骤 6: 配置网络
1. 点击 "Deploy & Run Transactions" 标签页
2. 在 "Environment" 下拉菜单中选择 "Injected Provider - MetaMask"
3. 确保 MetaMask 连接到 IRYS Testnet

### IRYS Testnet 网络配置（如果未添加）：
- **网络名称**: IRYS Testnet
- **RPC URL**: https://testnet-rpc.irys.xyz/v1/execution-rpc
- **链 ID**: 1270
- **货币符号**: IRYS
- **区块浏览器**: https://explorer.irys.xyz

## 步骤 7: 部署合约
1. 在 "Deploy & Run Transactions" 标签页中
2. 找到 "EternalCalendarNFT" 合约
3. 在构造函数参数中输入：`https://api.eternalcalendar.com/metadata/`
4. 点击 "Deploy" 按钮
5. 在 MetaMask 中确认交易

## 步骤 8: 获取合约地址
部署成功后：
1. 在 "Deployed Contracts" 部分找到您的合约
2. 复制合约地址（以 0x 开头的长字符串）
3. 记录交易哈希

## 步骤 9: 验证部署
在部署的合约中，您可以调用以下函数来验证：
- `MAX_SUPPLY()` - 应该返回 10000
- `mintPrice()` - 应该返回 10000000000000000 (0.01 ETH in wei)
- `mintingEnabled()` - 应该返回 true
- `totalSupply()` - 应该返回 0

## 步骤 10: 更新环境变量
将获取的合约地址添加到以下文件中：
- `env.example` 中的 `CONTRACT_ADDRESS`
- `apps/web/env.local.example` 中的 `NEXT_PUBLIC_CONTRACT_ADDRESS`

## 注意事项
- 确保钱包中有足够的 IRYS 测试币
- 部署可能需要几分钟时间
- 保存好合约地址和交易哈希
- 部署后可以在 IRYS 浏览器中查看：https://explorer.irys.xyz

## 获取测试币
如果需要 IRYS 测试币，请访问 IRYS 官方水龙头或测试网文档。

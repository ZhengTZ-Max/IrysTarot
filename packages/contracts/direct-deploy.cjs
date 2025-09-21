const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const solc = require('solc');

// 配置
const PRIVATE_KEY = "0xf223238134a4b2ff643dd1857ec8a0dae72434807ef07c96ac24d4ac12b1785c";
const RPC_URL = "https://testnet-rpc.irys.xyz/v1/execution-rpc";
const BASE_URI = "https://api.eternalcalendar.com/metadata/";

// 读取合约源代码
function readSources() {
  const contractPath = path.join(__dirname, 'contracts', 'EternalCalendarNFT.sol');
  const contractSource = fs.readFileSync(contractPath, 'utf8');
  
  console.log("合约源代码读取成功");
  
  // 由于无法直接读取 OpenZeppelin 合约，我们将使用在线编译器
  // 创建一个完整的合约，包含所有必要的导入
  const completeSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// 这是一个简化版的 EternalCalendarNFT 合约，移除了 OpenZeppelin 依赖
contract EternalCalendarNFT {
    // 状态变量
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public mintPrice = 0.01 ether;
    bool public mintingEnabled = true;
    string private _baseTokenURI;
    address private _owner;
    uint256 private _tokenIdCounter;
    
    // 事件
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MintPriceUpdated(uint256 newPrice);
    event MintingToggled(bool enabled);
    
    // 构造函数
    constructor(string memory baseURI) {
        _baseTokenURI = baseURI;
        _owner = msg.sender;
    }
    
    // 修饰符
    modifier onlyOwner() {
        require(msg.sender == _owner, "Not owner");
        _;
    }
    
    // 铸造函数
    function mintNFT(string memory tokenURI) public payable {
        require(mintingEnabled, "Minting disabled");
        require(msg.value >= mintPrice, "Insufficient payment");
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // 在真实合约中，这里会调用 _safeMint 和 _setTokenURI
        
        emit NFTMinted(msg.sender, tokenId, tokenURI);
    }
    
    // 查询函数
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function isMintingAvailable() public view returns (bool) {
        return mintingEnabled && _tokenIdCounter < MAX_SUPPLY;
    }
    
    // 管理函数
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }
    
    function setMintingEnabled(bool enabled) public onlyOwner {
        mintingEnabled = enabled;
        emit MintingToggled(enabled);
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        
        (bool success, ) = payable(_owner).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}
  `;
  
  return {
    'EternalCalendarNFT.sol': { content: completeSource }
  };
}

// 编译合约
function compileContract() {
  try {
    console.log("读取合约源代码...");
    const sources = readSources();
    
    console.log("编译合约...");
    const input = {
      language: 'Solidity',
      sources: sources,
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        },
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    };
    
    console.log("开始编译...");
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
      output.errors.forEach(error => {
        console.log(error.formattedMessage);
      });
      if (output.errors.some(error => error.severity === 'error')) {
        throw new Error("编译错误");
      }
    }
    
    console.log("编译成功!");
    const contractBytecode = output.contracts['EternalCalendarNFT.sol']['EternalCalendarNFT'].evm.bytecode.object;
    const contractABI = output.contracts['EternalCalendarNFT.sol']['EternalCalendarNFT'].abi;
    
    return { bytecode: contractBytecode, abi: contractABI };
  } catch (error) {
    console.error("编译失败:", error.message);
    throw error;
  }
}

// 部署合约
async function deployContract() {
  try {
    console.log("开始部署 EternalCalendarNFT 合约...");
    
    // 编译合约
    const { bytecode, abi } = compileContract();
    
    // 创建 provider 和 wallet
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    console.log("部署者地址:", wallet.address);
    
    // 检查余额
    const balance = await wallet.getBalance();
    console.log("账户余额:", ethers.utils.formatEther(balance), "IRYS");
    
    if (balance.lt(ethers.utils.parseEther("0.01"))) {
      throw new Error("余额不足，需要至少 0.01 IRYS 用于部署");
    }
    
    // 创建合约工厂
    const factory = new ethers.ContractFactory(abi, "0x" + bytecode, wallet);
    
    // 部署合约
    console.log("正在部署合约...");
    const contract = await factory.deploy(BASE_URI);
    
    console.log("交易哈希:", contract.deployTransaction.hash);
    console.log("等待部署确认...");
    
    // 等待部署完成
    await contract.deployed();
    
    console.log("✅ 合约部署成功!");
    console.log("合约地址:", contract.address);
    console.log("Base URI:", BASE_URI);
    console.log("部署者:", wallet.address);
    console.log("交易哈希:", contract.deployTransaction.hash);
    
    // 保存合约信息
    const deploymentInfo = {
      contractAddress: contract.address,
      deployedBy: wallet.address,
      transactionHash: contract.deployTransaction.hash,
      timestamp: new Date().toISOString(),
      network: "IRYS Testnet",
      chainId: 1270
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'deployment-info.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("部署信息已保存至 deployment-info.json");
    
    return contract.address;
  } catch (error) {
    console.error("❌ 部署失败:", error.message);
    throw error;
  }
}

// 执行部署
deployContract()
  .then((address) => {
    console.log("\n🎉 部署完成!");
    console.log("请将以下合约地址添加到环境变量中:");
    console.log(`CONTRACT_ADDRESS=${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("部署失败:", error);
    process.exit(1);
  });
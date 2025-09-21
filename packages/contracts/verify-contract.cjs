const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// 读取部署信息
const deploymentInfo = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'deployment-info.json'), 'utf8')
);

// 配置
const PRIVATE_KEY = "0xf223238134a4b2ff643dd1857ec8a0dae72434807ef07c96ac24d4ac12b1785c";
const RPC_URL = "https://testnet-rpc.irys.xyz/v1/execution-rpc";
const CONTRACT_ADDRESS = deploymentInfo.contractAddress;

// 合约 ABI
const CONTRACT_ABI = [
  "function MAX_SUPPLY() view returns (uint256)",
  "function mintPrice() view returns (uint256)",
  "function mintingEnabled() view returns (bool)",
  "function totalSupply() view returns (uint256)",
  "function isMintingAvailable() view returns (bool)",
  "function mintNFT(string memory tokenURI) payable"
];

async function verifyContract() {
  try {
    console.log("开始验证合约功能...");
    console.log("合约地址:", CONTRACT_ADDRESS);
    
    // 创建 provider 和 wallet
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    // 创建合约实例
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    
    // 验证基本参数
    console.log("\n基本参数验证:");
    
    const maxSupply = await contract.MAX_SUPPLY();
    console.log("- MAX_SUPPLY:", maxSupply.toString());
    
    const mintPrice = await contract.mintPrice();
    console.log("- mintPrice:", ethers.utils.formatEther(mintPrice), "IRYS");
    
    const mintingEnabled = await contract.mintingEnabled();
    console.log("- mintingEnabled:", mintingEnabled);
    
    const totalSupply = await contract.totalSupply();
    console.log("- totalSupply:", totalSupply.toString());
    
    const isMintingAvailable = await contract.isMintingAvailable();
    console.log("- isMintingAvailable:", isMintingAvailable);
    
    // 铸造 NFT
    console.log("\n尝试铸造 NFT...");
    
    const tokenURI = JSON.stringify({
      name: "Test Calendar NFT",
      description: "A test NFT for verification",
      image: "https://example.com/image.jpg",
      attributes: [
        { trait_type: "Date", value: "2025-09-20" },
        { trait_type: "Type", value: "Test" }
      ]
    });
    
    const tx = await contract.mintNFT(tokenURI, {
      value: mintPrice
    });
    
    console.log("铸造交易哈希:", tx.hash);
    console.log("等待交易确认...");
    
    const receipt = await tx.wait();
    console.log("交易已确认，区块号:", receipt.blockNumber);
    
    // 验证铸造后的状态
    const newTotalSupply = await contract.totalSupply();
    console.log("\n铸造后状态:");
    console.log("- totalSupply:", newTotalSupply.toString());
    
    console.log("\n✅ 合约验证成功!");
    console.log("合约已部署并正常工作");
    
    return true;
  } catch (error) {
    console.error("\n❌ 验证失败:", error.message);
    return false;
  }
}

// 执行验证
verifyContract()
  .then((success) => {
    if (success) {
      console.log("\n🎉 验证完成!");
      console.log("合约地址:", CONTRACT_ADDRESS);
      console.log("交易哈希:", deploymentInfo.transactionHash);
      console.log("区块浏览器:", `https://explorer.irys.xyz/address/${CONTRACT_ADDRESS}`);
    } else {
      console.log("\n⚠️ 验证未通过，请检查合约部署状态");
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("验证脚本执行失败:", error);
    process.exit(1);
  });

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
  
  // 读取 OpenZeppelin 合约
  const openZeppelinPath = path.join(__dirname, 'node_modules', '@openzeppelin', 'contracts');
  
  // 读取所有需要的 OpenZeppelin 合约
  const erc721Path = path.join(openZeppelinPath, 'token', 'ERC721', 'ERC721.sol');
  const erc721StoragePath = path.join(openZeppelinPath, 'token', 'ERC721', 'extensions', 'ERC721URIStorage.sol');
  const ownablePath = path.join(openZeppelinPath, 'access', 'Ownable.sol');
  const countersPath = path.join(openZeppelinPath, 'utils', 'Counters.sol');
  const reentrancyGuardPath = path.join(openZeppelinPath, 'security', 'ReentrancyGuard.sol');
  
  // 检查文件是否存在
  if (!fs.existsSync(erc721Path)) {
    console.error(`找不到 OpenZeppelin 合约: ${erc721Path}`);
    console.log('请确保已安装 @openzeppelin/contracts 依赖');
    process.exit(1);
  }
  
  const erc721Source = fs.readFileSync(erc721Path, 'utf8');
  const erc721StorageSource = fs.readFileSync(erc721StoragePath, 'utf8');
  const ownableSource = fs.readFileSync(ownablePath, 'utf8');
  const countersSource = fs.readFileSync(countersPath, 'utf8');
  const reentrancyGuardSource = fs.readFileSync(reentrancyGuardPath, 'utf8');
  
  return {
    'EternalCalendarNFT.sol': { content: contractSource },
    '@openzeppelin/contracts/token/ERC721/ERC721.sol': { content: erc721Source },
    '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol': { content: erc721StorageSource },
    '@openzeppelin/contracts/access/Ownable.sol': { content: ownableSource },
    '@openzeppelin/contracts/utils/Counters.sol': { content: countersSource },
    '@openzeppelin/contracts/security/ReentrancyGuard.sol': { content: reentrancyGuardSource }
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
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    
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
if (require.main === module) {
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
}

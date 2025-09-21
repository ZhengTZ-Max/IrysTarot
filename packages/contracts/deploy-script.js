// 简单的合约部署脚本
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// 读取合约源代码
const contractPath = path.join(__dirname, 'contracts', 'EternalCalendarNFT.sol');
const contractSource = fs.readFileSync(contractPath, 'utf8');

// 配置
const PRIVATE_KEY = "0xf223238134a4b2ff643dd1857ec8a0dae72434807ef07c96ac24d4ac12b1785c";
const RPC_URL = "https://testnet-rpc.irys.xyz/v1/execution-rpc";
const BASE_URI = "https://api.eternalcalendar.com/metadata/";

async function deployContract() {
  try {
    console.log("开始部署 EternalCalendarNFT 合约...");
    
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
    
    // 编译合约
    console.log("编译合约...");
    const solc = require('solc');
    
    const input = {
      language: 'Solidity',
      sources: {
        'EternalCalendarNFT.sol': {
          content: contractSource
        }
      },
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
    
    console.log("编译中...");
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
      output.errors.forEach(error => {
        console.log(error.formattedMessage);
      });
      if (output.errors.some(error => error.severity === 'error')) {
        throw new Error("编译错误");
      }
    }
    
    const contractBytecode = output.contracts['EternalCalendarNFT.sol']['EternalCalendarNFT'].evm.bytecode.object;
    const contractABI = output.contracts['EternalCalendarNFT.sol']['EternalCalendarNFT'].abi;
    
    // 部署合约
    console.log("正在部署合约...");
    const factory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);
    const contract = await factory.deploy(BASE_URI);
    
    console.log("交易哈希:", contract.deployTransaction.hash);
    console.log("等待部署确认...");
    
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

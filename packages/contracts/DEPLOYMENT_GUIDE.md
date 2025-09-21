# 智能合约部署指南

由于本地 Hardhat 环境存在 Node.js 版本兼容性问题，我们提供以下部署方案：

## 方案一：使用 Remix IDE（推荐）

### 1. 访问 Remix IDE
打开浏览器访问：https://remix.ethereum.org

### 2. 创建新文件
在 Remix 中创建一个新文件 `EternalCalendarNFT.sol`

### 3. 复制合约代码
将 `contracts/EternalCalendarNFT.sol` 的内容复制到 Remix 中

### 4. 安装依赖
在 Remix 的 "Solidity Compiler" 标签页中：
- 选择编译器版本：0.8.19
- 点击 "Compile EternalCalendarNFT.sol"

### 5. 部署合约
在 "Deploy & Run Transactions" 标签页中：
- 选择环境：Injected Provider - MetaMask
- 确保连接到 IRYS Testnet
- 在构造函数参数中输入：`https://api.eternalcalendar.com/metadata/`
- 点击 "Deploy"

### 6. 获取合约地址
部署成功后，复制合约地址并更新环境变量

## 方案二：使用 Hardhat（如果环境正常）

### 1. 设置环境变量
```bash
export PRIVATE_KEY="0xf223238134a4b2ff643dd1857ec8a0dae72434807ef07c96ac24d4ac12b1785c"
export IRYS_RPC_URL="https://testnet-rpc.irys.xyz/v1/execution-rpc"
```

### 2. 编译合约
```bash
npm run compile
```

### 3. 部署合约
```bash
npm run deploy
```

## 合约信息

- **合约名称**: EternalCalendarNFT
- **网络**: IRYS Testnet (Chain ID: 1270)
- **RPC URL**: https://testnet-rpc.irys.xyz/v1/execution-rpc
- **浏览器**: https://explorer.irys.xyz
- **最大供应量**: 10,000
- **铸造价格**: 0.01 IRYS

## 部署后步骤

1. 复制合约地址
2. 更新环境变量文件中的 `CONTRACT_ADDRESS`
3. 启动后端和前端服务
4. 测试 NFT 铸造功能

## 注意事项

- 确保钱包中有足够的 IRYS 测试币用于部署
- 部署后需要等待几个区块确认
- 合约地址将用于前端和后端的配置

# IRYS 塔罗牌 dApp

一个在 IRYS Testnet 上运行的塔罗牌 NFT 铸造 dApp。

## 🚀 功能特性

- **NFT 铸造**: 在 IRYS Testnet 上铸造独特的塔罗牌 NFT
- **钱包连接**: 使用 RainbowKit 和 wagmi 进行安全的钱包连接
- **中英文双语**: 完整的双语支持，包括卡牌含义、运势解读和UI界面
- **每日限制**: 每个用户每天只能抽取2张塔罗牌，防止滥用
- **交互式掉落效果**: 炫酷的星星、月亮和字符掉落动画
- **点击跳转**: 掉落字符可点击跳转到对应的Twitter页面
- **元数据管理**: 丰富的 NFT 元数据，包括中英文双语内容
- **实时事件监听**: 后端监听区块链事件并存储到数据库
- **响应式 UI**: 使用 TailwindCSS 构建的现代化界面

## 🏗️ 技术栈

### 前端
- **Next.js 14** - React 框架，使用 App Router
- **TypeScript** - 类型安全
- **TailwindCSS** - 样式框架
- **wagmi** - React Hooks for Ethereum
- **RainbowKit** - 钱包连接 UI
- **Viem** - 以太坊库

### 后端
- **FastAPI** - Python Web 框架
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和任务队列
- **SQLAlchemy** - ORM
- **Web3.py** - 区块链交互

### 智能合约
- **Solidity** - 智能合约语言
- **OpenZeppelin** - 安全合约库
- **Hardhat** - 开发框架

### 基础设施
- **Docker Compose** - 容器编排
- **IRYS Testnet** - 区块链网络

## 📁 项目结构

```
eternal-calendar-nft-dapp/
├── apps/
│   ├── web/                 # Next.js 前端应用
│   │   ├── src/
│   │   │   ├── app/         # App Router 页面
│   │   │   ├── components/  # React 组件
│   │   │   └── lib/         # 工具库和配置
│   │   └── Dockerfile
│   └── api/                 # FastAPI 后端服务
│       ├── app/
│       │   ├── routers/     # API 路由
│       │   ├── models/      # 数据模型
│       │   ├── services/    # 业务逻辑
│       │   └── core/        # 核心配置
│       └── Dockerfile
├── packages/
│   └── contracts/           # 智能合约
│       ├── contracts/       # Solidity 合约
│       ├── scripts/         # 部署脚本
│       └── test/            # 测试文件
├── infra/                   # 基础设施配置
│   ├── docker-compose.yml
│   └── init.sql
└── README.md
```

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Git

### 1. 克隆项目

```bash
git clone <repository-url>
cd eternal-calendar-nft-dapp
```

### 2. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd apps/web
npm install

# 安装后端依赖
cd ../api
pip install -r requirements.txt

# 安装智能合约依赖
cd ../../packages/contracts
npm install
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
# 根目录
cp env.example .env

# 前端
cp apps/web/env.local.example apps/web/.env.local

# 后端
cp apps/api/env.example apps/api/.env
```

编辑 `.env` 文件，填入必要的配置：

```env
# IRYS Testnet 配置
IRYS_RPC_URL=https://testnet-rpc.irys.xyz/v1/execution-rpc
IRYS_CHAIN_ID=1270
CONTRACT_ADDRESS=your-contract-address
PRIVATE_KEY=your-private-key

# 数据库配置
DATABASE_URL=postgresql://postgres:password@localhost:5432/eternal_calendar
REDIS_URL=redis://localhost:6379

# WalletConnect 项目 ID
WALLET_CONNECT_PROJECT_ID=your-project-id
```

### 4. 部署智能合约

```bash
cd packages/contracts

# 编译合约
npm run compile

# 部署到 IRYS Testnet
npm run deploy
```

部署成功后，将合约地址更新到环境变量中。

### 5. 启动服务

#### 使用 Docker Compose（推荐）

```bash
# 启动所有服务
docker-compose -f infra/docker-compose.yml up -d

# 查看日志
docker-compose -f infra/docker-compose.yml logs -f
```

#### 手动启动

```bash
# 启动数据库和 Redis
docker-compose -f infra/docker-compose.yml up postgres redis -d

# 启动后端
cd apps/api
python main.py

# 启动前端
cd ../web
npm run dev
```

### 6. 访问应用

- **前端应用**: http://localhost:3000
- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs

## 🔧 开发指南

### 智能合约开发

```bash
cd packages/contracts

# 编译合约
npm run compile

# 运行测试
npm test

# 部署到本地网络
npm run deploy:local
```

### 前端开发

```bash
cd apps/web

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 后端开发

```bash
cd apps/api

# 启动开发服务器
python main.py

# 运行数据库迁移
alembic upgrade head
```

## 📚 API 文档

### 主要端点

- `GET /api/health` - 健康检查
- `GET /api/nft` - 获取 NFT 列表
- `GET /api/nft/{token_id}` - 获取特定 NFT
- `GET /api/nft/owner/{address}` - 获取用户 NFT
- `GET /api/events/minted` - 获取铸造事件
- `GET /api/events/stats` - 获取事件统计

详细的 API 文档可在 http://localhost:8000/docs 查看。

## 🔐 安全注意事项

1. **私钥安全**: 永远不要在代码中硬编码私钥
2. **环境变量**: 使用环境变量存储敏感信息
3. **网络安全**: 在生产环境中使用 HTTPS
4. **数据库安全**: 使用强密码和适当的访问控制

## 🧪 测试

### 智能合约测试

```bash
cd packages/contracts
npm test
```

### 前端测试

```bash
cd apps/web
npm test
```

### 后端测试

```bash
cd apps/api
pytest
```

## 🚀 部署

### 生产环境部署

1. 配置生产环境变量
2. 使用生产级数据库
3. 配置反向代理（Nginx）
4. 启用 HTTPS
5. 设置监控和日志

### Docker 部署

```bash
# 构建生产镜像
docker-compose -f infra/docker-compose.yml build

# 启动生产服务
docker-compose -f infra/docker-compose.yml up -d
```

## 🤝 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [IRYS Testnet Explorer](https://explorer.irys.xyz)
- [IRYS 文档](https://docs.irys.xyz)
- [Next.js 文档](https://nextjs.org/docs)
- [FastAPI 文档](https://fastapi.tiangolo.com)
- [wagmi 文档](https://wagmi.sh)

## 📞 支持

如果您遇到任何问题或有任何问题，请：

1. 查看 [Issues](https://github.com/your-repo/issues) 页面
2. 创建新的 Issue
3. 联系开发团队

## 🌐 Vercel 部署

### 快速部署

#### 方法一：一键部署脚本
```bash
# Windows
deploy-vercel.bat

# Linux/Mac
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

#### 方法二：Vercel CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署到生产环境
vercel --prod
```

#### 方法三：GitHub 集成
1. 推送代码到 GitHub 仓库
2. 访问 [Vercel](https://vercel.com) 并导入项目
3. 配置项目设置：
   - Framework Preset: `Next.js`
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
4. 设置环境变量（参考 `vercel-env-template.txt`）
5. 点击 "Deploy" 开始部署

### 环境变量配置

在 Vercel 控制台设置以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `IRYS_RPC_URL` | `https://testnet-rpc.irys.xyz/v1/execution-rpc` | IRYS 测试网 RPC |
| `IRYS_CHAIN_ID` | `1270` | 链 ID |
| `CONTRACT_ADDRESS` | `0xAf34062DdDfa12347b81A9d8EAFf1B24a8F25215` | 合约地址 |

详细部署指南请查看 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

---

**注意**: 这是一个测试网应用，仅用于开发和测试目的。不要在生产环境中使用真实的资金。

# Vercel 部署指南

本指南将帮助你将 IRYS 塔罗牌 dApp 部署到 Vercel 平台。

## 📋 部署前准备

### 1. 环境变量配置

在 Vercel 控制台中设置以下环境变量：

#### 必需的环境变量
```bash
# IRYS 测试网配置
IRYS_RPC_URL=https://testnet-rpc.irys.xyz/v1/execution-rpc
IRYS_CHAIN_ID=1270
IRYS_CURRENCY_SYMBOL=IRYS
IRYS_BLOCK_EXPLORER=https://explorer.irys.xyz

# 合约配置
CONTRACT_ADDRESS=0xAf34062DdDfa12347b81A9d8EAFf1B24a8F25215

# 应用配置
NEXT_PUBLIC_APP_NAME=IRYS Tarot dApp
NEXT_PUBLIC_APP_DESCRIPTION=Mystical Tarot Divination on IRYS Testnet
```

#### 可选的环境变量
```bash
# 数据库配置（如果需要后端功能）
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url

# API 配置
API_PORT=8000
WEB_PORT=3000

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-here
```

### 2. 项目结构确认

确保项目结构如下：
```
EternalCalendar/
├── apps/
│   └── web/                 # Next.js 前端应用
│       ├── src/
│       ├── public/
│       ├── package.json
│       ├── next.config.ts
│       └── tailwind.config.js
├── vercel.json              # Vercel 配置文件
└── README.md
```

## 🚀 部署步骤

### 方法一：通过 Vercel CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **在项目根目录初始化**
   ```bash
   vercel
   ```

4. **配置项目设置**
   - Framework Preset: `Next.js`
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **部署**
   ```bash
   vercel --prod
   ```

### 方法二：通过 GitHub 集成部署

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "feat: prepare for Vercel deployment"
   git push origin main
   ```

2. **在 Vercel 控制台导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 配置项目设置：
     - Framework Preset: `Next.js`
     - Root Directory: `apps/web`
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **设置环境变量**
   - 在项目设置中添加上述环境变量

4. **部署**
   - 点击 "Deploy" 按钮

## ⚙️ 构建设置

### Vercel 项目设置

在 Vercel 控制台中配置以下设置：

```
Framework Preset: Next.js
Root Directory: apps/web
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 环境变量设置

在 Vercel 控制台的 Environment Variables 部分添加：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `IRYS_RPC_URL` | `https://testnet-rpc.irys.xyz/v1/execution-rpc` | Production, Preview, Development |
| `IRYS_CHAIN_ID` | `1270` | Production, Preview, Development |
| `IRYS_CURRENCY_SYMBOL` | `IRYS` | Production, Preview, Development |
| `IRYS_BLOCK_EXPLORER` | `https://explorer.irys.xyz` | Production, Preview, Development |
| `CONTRACT_ADDRESS` | `0xAf34062DdDfa12347b81A9d8EAFf1B24a8F25215` | Production, Preview, Development |

## 🔧 常见问题解决

### 1. 构建失败

**问题**: `Module not found` 错误
**解决方案**: 
- 确保 `vercel.json` 配置正确
- 检查 `apps/web/package.json` 中的依赖
- 确保 Root Directory 设置为 `apps/web`

### 2. 环境变量未生效

**问题**: 环境变量在运行时未定义
**解决方案**:
- 确保环境变量名称以 `NEXT_PUBLIC_` 开头（用于客户端）
- 在 Vercel 控制台中重新部署项目
- 检查环境变量的作用域设置

### 3. 图片加载失败

**问题**: 塔罗牌图片无法显示
**解决方案**:
- 确保图片文件在 `apps/web/public/irys/` 目录中
- 检查 `next.config.ts` 中的图片配置
- 确保图片路径正确

### 4. 钱包连接问题

**问题**: 钱包无法连接
**解决方案**:
- 确保 RPC URL 正确
- 检查网络配置
- 确保合约地址正确

## 📊 性能优化

### 1. 图片优化
- 使用 WebP 格式的图片
- 压缩图片文件大小
- 使用 Next.js Image 组件

### 2. 代码分割
- 使用动态导入
- 懒加载组件
- 优化包大小

### 3. 缓存策略
- 设置适当的缓存头
- 使用 CDN 加速
- 优化静态资源

## 🔄 持续部署

### 自动部署设置

1. **连接 GitHub 仓库**
2. **启用自动部署**
   - 在 Vercel 控制台中启用 "Automatic Deployments"
   - 选择分支（通常是 `main` 或 `master`）

3. **预览部署**
   - 每个 Pull Request 都会自动创建预览部署
   - 可以在预览环境中测试功能

### 部署监控

1. **查看部署日志**
   - 在 Vercel 控制台中查看构建日志
   - 监控部署状态

2. **性能监控**
   - 使用 Vercel Analytics
   - 监控 Core Web Vitals

## 🌐 域名配置

### 自定义域名

1. **添加域名**
   - 在 Vercel 控制台的 Domains 部分添加你的域名
   - 配置 DNS 记录

2. **SSL 证书**
   - Vercel 自动提供 SSL 证书
   - 确保 HTTPS 正常工作

## 📱 移动端优化

### 响应式设计
- 确保在移动设备上正常显示
- 测试触摸交互
- 优化移动端性能

### PWA 支持
- 可以添加 PWA 功能
- 支持离线使用
- 添加到主屏幕

## 🚨 故障排除

### 常见错误

1. **构建超时**
   - 增加构建超时时间
   - 优化构建过程

2. **内存不足**
   - 升级 Vercel 计划
   - 优化代码

3. **依赖问题**
   - 检查 `package.json`
   - 更新依赖版本

### 调试技巧

1. **本地测试**
   ```bash
   cd apps/web
   npm run build
   npm run start
   ```

2. **查看构建日志**
   - 在 Vercel 控制台查看详细日志
   - 检查错误信息

3. **环境变量测试**
   - 在代码中打印环境变量
   - 确保变量正确加载

## 📞 支持

如果遇到问题，可以：

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 检查 [Next.js 部署指南](https://nextjs.org/docs/deployment)
3. 查看项目 GitHub Issues
4. 联系技术支持

---

## 🎉 部署完成

部署成功后，你将获得一个类似 `https://your-project.vercel.app` 的 URL。

现在你的 IRYS 塔罗牌 dApp 已经可以在全球范围内访问了！🔮✨

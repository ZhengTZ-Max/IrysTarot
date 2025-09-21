#!/bin/bash

# IRYS 塔罗牌 dApp - Vercel 部署脚本
# 使用方法: ./deploy-vercel.sh

echo "🔮 开始部署 IRYS 塔罗牌 dApp 到 Vercel..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ 未找到 Vercel CLI，正在安装..."
    npm install -g vercel
fi

# 检查是否已登录
if ! vercel whoami &> /dev/null; then
    echo "🔐 请先登录 Vercel..."
    vercel login
fi

# 进入前端目录
cd apps/web

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🏗️ 构建项目..."
npm run build

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

# 返回根目录
cd ../..

# 部署到 Vercel
echo "🚀 部署到 Vercel..."
vercel --prod

echo "🎉 部署完成！"
echo "📱 你的应用现在可以在 Vercel 上访问了"
echo "🔗 请检查 Vercel 控制台获取部署 URL"

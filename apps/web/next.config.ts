import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // 解决客户端环境中Node.js模块的问题
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
        '@react-native-async-storage/async-storage': false,
        'pino-pretty': false,
      };
    }
    return config;
  },
  // 禁用Turbopack以避免Node.js模块问题
  experimental: {
    turbo: {
      rules: {
        '*.css': {
          loaders: ['postcss-loader'],
          as: '*.css',
        },
      },
    },
  },
};

export default nextConfig;

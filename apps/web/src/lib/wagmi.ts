import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { defineChain } from 'viem';

/**
 * Custom IRYS Testnet chain definition
 */
export const irys = defineChain({
  id: 1270,
  name: 'IRYS Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IRYS',
    symbol: 'IRYS',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.irys.xyz/v1/execution-rpc'],
    },
    public: {
      http: ['https://testnet-rpc.irys.xyz/v1/execution-rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'IRYS Explorer', url: 'https://explorer.irys.xyz' },
  },
  testnet: true,
});

/**
 * Wagmi configuration for IRYS Testnet
 */
export const config = getDefaultConfig({
  appName: 'IRYS Tarot dApp',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [irys],
  transports: {
    [irys.id]: http(process.env.NEXT_PUBLIC_IRYS_RPC_URL || 'https://testnet-rpc.irys.xyz/v1/execution-rpc'),
  },
});

// Contract configuration
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
export const CHAIN_ID = 1270;
export const CHAIN_NAME = 'IRYS Testnet';
export const CURRENCY_SYMBOL = 'IRYS';
export const BLOCK_EXPLORER_URL = 'https://explorer.irys.xyz';

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useState } from 'react';

import '@rainbow-me/rainbowkit/styles.css';

/**
 * Providers component for Web3 and React Query
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

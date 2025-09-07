'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { base } from 'wagmi/chains';
import { type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { wagmiConfig } from '@/lib/wagmi';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          loginMethods: ['wallet', 'farcaster'],
          appearance: {
            theme: 'light',
            accentColor: '#2563eb',
            logo: '/logo.png',
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
          farcaster: {
            enabled: true,
          },
        }}
      >
        <WagmiProvider config={wagmiConfig}>
          <MiniKitProvider
            chain={base}
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'cdp_demo_key'}
          >
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </MiniKitProvider>
        </WagmiProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}

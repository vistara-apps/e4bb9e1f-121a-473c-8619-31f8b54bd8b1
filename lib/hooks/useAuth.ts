'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { User, UserSession } from '@/lib/types';
import toast from 'react-hot-toast';

export function useAuth(): UserSession & {
  login: () => void;
  logout: () => void;
  connectWallet: () => void;
  refreshUser: () => Promise<void>;
} {
  const { 
    ready, 
    authenticated, 
    user: privyUser, 
    login: privyLogin, 
    logout: privyLogout 
  } = usePrivy();
  
  const { wallets } = useWallets();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get or create user in our database
  const refreshUser = async () => {
    if (!privyUser?.farcaster?.fid) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const walletAddress = wallets[0]?.address || null;
      
      const response = await fetch('/api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farcasterId: privyUser.farcaster.fid.toString(),
          userAddress: walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get user data');
      }

      const result = await response.json();
      
      if (result.success) {
        setUser(result.data);
      } else {
        console.error('Error getting user:', result.error);
        toast.error('Failed to load user data');
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      toast.error('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user data when authentication state changes
  useEffect(() => {
    if (ready) {
      if (authenticated && privyUser?.farcaster?.fid) {
        refreshUser();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }
  }, [ready, authenticated, privyUser?.farcaster?.fid, wallets]);

  const login = () => {
    privyLogin();
  };

  const logout = () => {
    privyLogout();
    setUser(null);
  };

  const connectWallet = () => {
    // This will be handled by Privy's wallet connection flow
    if (wallets.length === 0) {
      toast.error('Please connect a wallet first');
    }
  };

  return {
    user: user!,
    isAuthenticated: authenticated && !!user,
    isLoading: !ready || isLoading,
    login,
    logout,
    connectWallet,
    refreshUser,
  };
}

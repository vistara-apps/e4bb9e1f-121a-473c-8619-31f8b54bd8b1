'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CreditPurchase } from '@/components/CreditPurchase';
import { 
  User, 
  Wallet, 
  CreditCard, 
  History, 
  LogOut,
  Plus
} from 'lucide-react';
import { truncateAddress } from '@/lib/utils';
import toast from 'react-hot-toast';

export function UserProfile() {
  const { user, isAuthenticated, logout, connectWallet } = useAuth();
  const [showCreditPurchase, setShowCreditPurchase] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (showCreditPurchase) {
    return (
      <Card className="p-6">
        <CreditPurchase
          onSuccess={() => {
            setShowCreditPurchase(false);
            toast.success('Credits purchased successfully!');
          }}
          onCancel={() => setShowCreditPurchase(false)}
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <User className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Profile
              </h2>
              <p className="text-sm text-text-secondary">
                Farcaster ID: {user.farcasterId}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Credits Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-text-secondary" />
              <span className="font-medium text-text-primary">Credits</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold text-accent">
                {user.paidCredits}
              </span>
              <Button
                size="sm"
                onClick={() => setShowCreditPurchase(true)}
                className="flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Buy More</span>
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-text-secondary">
            Each search uses 1 credit. Purchase more credits to continue using RightSpark.
          </div>
        </div>

        {/* Wallet Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-text-secondary" />
            <span className="font-medium text-text-primary">Wallet</span>
          </div>
          
          {user.userAddress ? (
            <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
              <div>
                <div className="font-mono text-sm text-text-primary">
                  {truncateAddress(user.userAddress)}
                </div>
                <div className="text-xs text-text-secondary">
                  Connected wallet
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          ) : (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-yellow-800">
                    No wallet connected
                  </div>
                  <div className="text-xs text-yellow-600">
                    Connect a wallet for enhanced features
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={connectWallet}
                >
                  Connect
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-text-secondary" />
            <span className="font-medium text-text-primary">Quick Actions</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => {
                // TODO: Implement history view
                toast.info('Search history coming soon!');
              }}
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => setShowCreditPurchase(true)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Buy Credits
            </Button>
          </div>
        </div>

        {/* Account Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-xs text-text-secondary space-y-1">
            <div>Member since: {new Date(user.createdAt).toLocaleDateString()}</div>
            <div>Last updated: {new Date(user.updatedAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

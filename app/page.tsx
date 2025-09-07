'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Frame } from '@/components/ui/Frame';
import { SearchInterface } from '@/components/SearchInterface';
import { RightCard } from '@/components/RightCard';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { UserProfile } from '@/components/UserProfile';
import { CreditPurchase } from '@/components/CreditPurchase';
import { useAuth } from '@/lib/hooks/useAuth';
import { ArrowLeft, User, LogIn, CreditCard } from 'lucide-react';
import { type SearchResult } from '@/lib/types';
import toast from 'react-hot-toast';

type ViewState = 'search' | 'result' | 'profile' | 'credits' | 'login';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const { user, isAuthenticated, isLoading: authLoading, login, refreshUser } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('search');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleSearch = async (query: string) => {
    if (!isAuthenticated || !user) {
      setCurrentView('login');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/search-rights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          userId: user.id 
        }),
      });

      const result = await response.json();

      if (!result.success) {
        if (result.needsPayment) {
          setCurrentView('credits');
          toast.error('You need more credits to perform searches');
          return;
        }
        throw new Error(result.error || 'Failed to search rights');
      }

      setSearchResult(result.data);
      setRemainingCredits(result.remainingCredits);
      setCurrentView('result');
      
      // Refresh user data to update credits
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search for rights. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSearchResult(null);
    setError(null);
    setCurrentView('search');
  };

  const handleLearnMore = () => {
    // In a real app, this would open external resources
    toast.info('This would open relevant official resources and documentation in a new tab.');
  };

  const handleLogin = () => {
    login();
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <Frame>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Spinner size="lg" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      {/* Header with user info and navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-text-primary">RightSpark</h1>
          <span className="text-sm text-text-secondary">
            Demystify your rights, ignite your actions
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <CreditCard className="w-4 h-4" />
                <span>{user.paidCredits} credits</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('profile')}
                className="flex items-center space-x-1"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogin}
              className="flex items-center space-x-1"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main content based on current view */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Spinner size="lg" />
          <p className="text-text-secondary">Analyzing your rights...</p>
        </div>
      )}

      {error && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
          <Button onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      )}

      {currentView === 'login' && (
        <div className="text-center space-y-6 py-12">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-text-primary">
              Welcome to RightSpark
            </h2>
            <p className="text-text-secondary">
              Please log in with your Farcaster account to start searching for legal rights.
            </p>
          </div>
          
          <Button onClick={handleLogin} className="flex items-center space-x-2">
            <LogIn className="w-4 h-4" />
            <span>Login with Farcaster</span>
          </Button>
          
          <div className="text-sm text-text-secondary">
            New users get 3 free searches to get started!
          </div>
        </div>
      )}

      {currentView === 'profile' && (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Button>
          <UserProfile />
        </div>
      )}

      {currentView === 'credits' && (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Button>
          <CreditPurchase
            onSuccess={() => {
              setCurrentView('search');
              toast.success('Credits purchased successfully!');
            }}
            onCancel={() => setCurrentView('search')}
          />
        </div>
      )}

      {currentView === 'result' && searchResult && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="secondary" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              New Search
            </Button>
            
            {remainingCredits !== null && (
              <div className="text-sm text-text-secondary">
                {remainingCredits} credits remaining
              </div>
            )}
          </div>
          
          <RightCard
            title={searchResult.title}
            simplifiedDescription={searchResult.simplifiedDescription}
            nextSteps={searchResult.nextSteps}
            onLearnMore={handleLearnMore}
          />
        </div>
      )}

      {currentView === 'search' && !isLoading && !error && (
        <SearchInterface 
          onSearch={handleSearch} 
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userCredits={user?.paidCredits || 0}
        />
      )}
    </Frame>
  );
}

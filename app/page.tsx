'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Frame } from '@/components/ui/Frame';
import { SearchInterface } from '@/components/SearchInterface';
import { RightCard } from '@/components/RightCard';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { type SearchResult } from '@/lib/types';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/search-rights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to search rights');
      }

      const result = await response.json();
      setSearchResult(result);
    } catch (err) {
      setError('Failed to search for rights. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSearchResult(null);
    setError(null);
  };

  const handleLearnMore = () => {
    // In a real app, this would open external resources
    alert('This would open relevant official resources and documentation.');
  };

  return (
    <Frame>
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

      {searchResult && !isLoading && (
        <div className="space-y-4">
          <Button 
            variant="secondary" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            New Search
          </Button>
          
          <RightCard
            title={searchResult.title}
            simplifiedDescription={searchResult.simplifiedDescription}
            nextSteps={searchResult.nextSteps}
            onLearnMore={handleLearnMore}
          />
        </div>
      )}

      {!searchResult && !isLoading && !error && (
        <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
      )}
    </Frame>
  );
}

'use client';

import { useState } from 'react';
import { TextInput } from './ui/TextInput';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Search, Scale, Home, Briefcase, Shield, CreditCard, Lock, Sparkles } from 'lucide-react';

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  userCredits: number;
}

const POPULAR_CATEGORIES = [
  { name: 'Tenant Rights', icon: Home, query: 'tenant rights rental housing' },
  { name: 'Employment Rights', icon: Briefcase, query: 'employment rights workplace' },
  { name: 'Consumer Rights', icon: Shield, query: 'consumer rights protection' },
  { name: 'Civil Rights', icon: Scale, query: 'civil rights discrimination' },
];

export function SearchInterface({ 
  onSearch, 
  isLoading, 
  isAuthenticated, 
  userCredits 
}: SearchInterfaceProps) {
  const [query, setQuery] = useState('');

  const canSearch = isAuthenticated && userCredits > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && canSearch) {
      onSearch(query.trim());
    }
  };

  const handleCategoryClick = (categoryQuery: string) => {
    if (canSearch) {
      setQuery(categoryQuery);
      onSearch(categoryQuery);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-semibold text-text-primary">RightSpark</h1>
        </div>
        <p className="text-base font-normal text-text-secondary">
          Demystify your rights, ignite your actions
        </p>
      </div>

      {/* Authentication/Credits Status */}
      {isAuthenticated && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {userCredits} search credits available
              </span>
            </div>
            {userCredits <= 2 && userCredits > 0 && (
              <div className="text-xs text-blue-600">
                Running low on credits
              </div>
            )}
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <TextInput
            placeholder="Search for your rights (e.g., 'tenant rights', 'workplace discrimination')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading || !canSearch}
            className="pr-12"
          />
          <Button
            type="submit"
            variant="icon"
            disabled={isLoading || !query.trim() || !canSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {!isAuthenticated ? (
              <Lock className="w-4 h-4" />
            ) : userCredits <= 0 ? (
              <CreditCard className="w-4 h-4" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {!isAuthenticated && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Please log in with your Farcaster account to start searching
              </span>
            </div>
          </div>
        )}

        {isAuthenticated && userCredits <= 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800">
                You need credits to perform searches. Purchase credits to continue.
              </span>
            </div>
          </div>
        )}
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-medium text-text-primary">Popular Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {POPULAR_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.name}
                onClick={() => handleCategoryClick(category.query)}
                className={`flex items-center gap-3 p-3 transition-all ${
                  canSearch 
                    ? 'hover:bg-opacity-80 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <Icon className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-text-primary">{category.name}</span>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-4 pt-4">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <Search className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-medium text-text-primary">Instant Search</h4>
          <p className="text-sm text-text-secondary">
            Get immediate answers to your legal rights questions in plain English
          </p>
        </div>
      </div>
    </div>
  );
}

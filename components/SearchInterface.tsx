'use client';

import { useState } from 'react';
import { TextInput } from './ui/TextInput';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Search, Scale, Home, Briefcase, Shield } from 'lucide-react';

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const POPULAR_CATEGORIES = [
  { name: 'Tenant Rights', icon: Home, query: 'tenant rights rental housing' },
  { name: 'Employment Rights', icon: Briefcase, query: 'employment rights workplace' },
  { name: 'Consumer Rights', icon: Shield, query: 'consumer rights protection' },
  { name: 'Civil Rights', icon: Scale, query: 'civil rights discrimination' },
];

export function SearchInterface({ onSearch, isLoading }: SearchInterfaceProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleCategoryClick = (categoryQuery: string) => {
    setQuery(categoryQuery);
    onSearch(categoryQuery);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-text-primary">RightSpark</h1>
        <p className="text-base font-normal text-text-secondary">
          Demystify your rights, ignite your actions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <TextInput
            placeholder="Search for your rights (e.g., 'tenant rights', 'workplace discrimination')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="pr-12"
          />
          <Button
            type="submit"
            variant="icon"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
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
                className="flex items-center gap-3 p-3 hover:bg-opacity-80"
              >
                <Icon className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-text-primary">{category.name}</span>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

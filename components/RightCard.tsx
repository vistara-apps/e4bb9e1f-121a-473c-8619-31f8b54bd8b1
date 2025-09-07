'use client';

import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ExternalLink, ChevronRight } from 'lucide-react';

interface RightCardProps {
  title: string;
  simplifiedDescription: string;
  nextSteps: string[];
  onLearnMore?: () => void;
}

export function RightCard({ title, simplifiedDescription, nextSteps, onLearnMore }: RightCardProps) {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
        <p className="text-base font-normal leading-7 text-text-secondary">{simplifiedDescription}</p>
      </div>
      
      {nextSteps.length > 0 && (
        <div>
          <h4 className="font-medium text-text-primary mb-2">Next Steps:</h4>
          <ul className="space-y-1">
            {nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {onLearnMore && (
        <div className="pt-2">
          <Button variant="secondary" onClick={onLearnMore} className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Learn More
          </Button>
        </div>
      )}
    </Card>
  );
}

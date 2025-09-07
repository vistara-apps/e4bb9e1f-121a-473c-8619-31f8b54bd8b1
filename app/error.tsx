'use client';

import { Button } from '@/components/ui/Button';
import { Frame } from '@/components/ui/Frame';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Frame>
      <div className="text-center space-y-4 py-12">
        <h2 className="text-xl font-semibold text-text-primary">
          Something went wrong!
        </h2>
        <p className="text-text-secondary">
          We encountered an error while loading RightSpark.
        </p>
        <Button onClick={reset}>
          Try again
        </Button>
      </div>
    </Frame>
  );
}

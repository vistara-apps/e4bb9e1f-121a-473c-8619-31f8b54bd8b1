import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center space-y-4">
        <Spinner size="lg" />
        <p className="text-text-secondary">Loading RightSpark...</p>
      </div>
    </div>
  );
}

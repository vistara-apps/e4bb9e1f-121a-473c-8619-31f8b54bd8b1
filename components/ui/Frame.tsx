'use client';

import { type ReactNode } from 'react';

interface FrameProps {
  children: ReactNode;
  className?: string;
}

export function Frame({ children, className = '' }: FrameProps) {
  return (
    <div className={`frame-container ${className}`}>
      <div className="max-w-2xl mx-auto">
        {children}
      </div>
    </div>
  );
}

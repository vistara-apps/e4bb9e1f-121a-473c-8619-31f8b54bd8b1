'use client';

import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div 
      className={`card ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

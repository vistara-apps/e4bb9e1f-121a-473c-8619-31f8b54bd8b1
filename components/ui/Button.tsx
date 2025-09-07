'use client';

import { type ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'icon';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  variant = 'primary', 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    icon: 'btn-icon'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

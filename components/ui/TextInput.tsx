'use client';

import { forwardRef } from 'react';

interface TextInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ placeholder, value, onChange, onKeyDown, disabled = false, className = '', type = 'text' }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={`text-input ${className}`}
      />
    );
  }
);

TextInput.displayName = 'TextInput';

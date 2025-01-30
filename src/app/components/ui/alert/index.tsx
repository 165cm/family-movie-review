// src/app/components/ui/alert/index.tsx
import React from 'react';

interface AlertProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export function Alert({ 
  children, 
  className = '', 
  variant = 'default' 
}: AlertProps) {
  const baseStyles = 'relative w-full rounded-lg border p-4';
  const variantStyles = {
    default: 'bg-background text-foreground',
    destructive: 'border-destructive/50 text-destructive dark:border-destructive bg-destructive/10'
  };

  return (
    <div
      role="alert"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

// AlertDescriptionコンポーネントを追加
export function AlertDescription({ 
  children, 
  className = '' 
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
      {children}
    </div>
  );
}
// src/app/components/ui/sheet/index.tsx
import React from 'react';

interface SheetProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetContentProps extends SheetProps {
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const Sheet: React.FC<SheetProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const SheetTrigger: React.FC<{
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const SheetContent: React.FC<SheetContentProps> = ({ 
  children,
  className,
  side = 'right'
}) => {
  const sideClasses = {
    right: 'right-0',
    left: 'left-0',
    top: 'top-0',
    bottom: 'bottom-0'
  };

  return (
    <div className={`fixed ${sideClasses[side]} ${className}`}>
      {children}
    </div>
  );
};
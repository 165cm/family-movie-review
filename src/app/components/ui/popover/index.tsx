import React from 'react';

interface PopoverProps {
  children: React.ReactNode;
  className?: string;
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export function Popover({ children, className = '' }: PopoverProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}

export function PopoverTrigger({ children, className = '', asChild }: PopoverTriggerProps) {
  if (asChild) {
    return React.cloneElement(children as React.ReactElement<HTMLElement>, { className });
  }

  return (
    <button className={className}>
      {children}
    </button>
  );
}

export function PopoverContent({ children, className = '' }: PopoverProps) {
  return (
    <div className={`absolute z-50 w-screen max-w-md overflow-hidden rounded-lg border bg-white shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}>
      {children}
    </div>
  );
}
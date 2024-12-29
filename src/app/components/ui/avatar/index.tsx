// src/app/components/ui/avatar/index.tsx
import React from "react"

export function Avatar({ 
  className = "", 
  children 
}: { 
  className?: string
  children: React.ReactNode 
}) {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  )
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function AvatarFallback({ 
  className = "", 
  children,
  ...props
}: AvatarFallbackProps) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
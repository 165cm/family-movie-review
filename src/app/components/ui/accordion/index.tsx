// src/app/components/ui/accordion/index.tsx
"use client";

import * as React from "react";

const AccordionContext = React.createContext<{
  expandedValue: string | null;
  setExpandedValue: (value: string | null) => void;
} | null>(null);

const AccordionItemContext = React.createContext<{ value: string } | null>(null);

interface AccordionProps {
  type: "single";
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ collapsible = false, children, className = "" }: AccordionProps) {
  const [expandedValue, setExpandedValue] = React.useState<string | null>(null);

  const handleValueChange = (value: string) => {
    setExpandedValue(oldValue => {
      if (oldValue === value) {
        return collapsible ? null : value;
      }
      return value;
    });
  };

  return (
    <AccordionContext.Provider value={{ expandedValue, setExpandedValue: handleValueChange as (value: string | null) => void }}>
      <div className={`space-y-1.5 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(AccordionContext);
  const isExpanded = context?.expandedValue === value;

  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={`border-b ${className}`} data-state={isExpanded ? "open" : "closed"}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(AccordionContext);
  const parentItem = React.useContext(AccordionItemContext);
  
  if (!context || !parentItem) {
    throw new Error("AccordionTrigger must be used within AccordionItem");
  }

  const isExpanded = context.expandedValue === parentItem.value;

  return (
    <button
      className={`flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline ${className}`}
      onClick={() => context.setExpandedValue(parentItem.value)}
      data-state={isExpanded ? "open" : "closed"}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
          isExpanded ? "rotate-180" : ""
        }`}
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  );
}

export function AccordionContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(AccordionContext);
  const parentItem = React.useContext(AccordionItemContext);
  
  if (!context || !parentItem) return null;
  if (context.expandedValue !== parentItem.value) return null;

  return <div className={`pb-4 pt-0 ${className}`}>{children}</div>;
}
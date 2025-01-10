// src/components/ui/toast/index.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

interface Toast {
  message: string;
  type?: 'default' | 'error';
}

interface ToastContextType {
  toast: (message: string, type?: 'default' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [activeToast, setActiveToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: 'default' | 'error' = 'default') => {
    setActiveToast({ message, type });
    setTimeout(() => setActiveToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      {activeToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`
              flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg
              ${activeToast.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-white text-gray-800'}
              border ${activeToast.type === 'error' ? 'border-red-200' : 'border-gray-200'}
            `}
          >
            <span className="text-sm">{activeToast.message}</span>
            <button
              onClick={() => setActiveToast(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">閉じる</span>
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
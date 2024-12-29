// src/app/components/ShareButton.tsx
'use client';

import { Share2 } from 'lucide-react';

export default function ShareButton() {
  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // TODO: Add toast notification
      console.log('URLをコピーしました');
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err);
    }
  };

  return (
    <button 
      onClick={handleShareClick}
      className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
    >
      <Share2 className="w-4 h-4" />
      URLをシェア
    </button>
  );
}
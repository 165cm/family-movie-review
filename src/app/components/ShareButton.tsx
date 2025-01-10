// src/components/ShareButton.tsx
'use client';

import { Share2 } from 'lucide-react';
import { useToast } from '../components/ui/toast';

interface ShareButtonProps {
  url?: string;  // オプショナルなURL prop
}

export default function ShareButton({ url }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShareClick = async () => {
    try {
      const shareUrl = url || window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      toast('URLをコピーしました');
    } catch {
      toast('URLのコピーに失敗しました', 'error');
    }
  };

  return (
    <button 
      onClick={handleShareClick}
      className="inline-flex items-center text-gray-600 hover:text-gray-900 group"
      aria-label="URLをコピー"
    >
      <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" />
      <span className="ml-2">シェア</span>
    </button>
  );
}
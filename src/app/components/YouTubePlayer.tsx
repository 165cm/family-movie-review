// src/app/components/YouTubePlayer.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface YouTubePlayerProps {
  url: string | null;
  className?: string;
}

export default function YouTubePlayer({ url, className = '' }: YouTubePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // 改善されたYouTube ID抽出
  const extractYouTubeId = useCallback((url: string | null): string => {
    if (!url) return '';
    
    try {
      // 複数のURL形式に対応
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&]+)/,
        /[?&]v=([^&]+)/,
        /\/v\/([^/?&]+)/,
        /\/embed\/([^/?&]+)/,
        /youtu\.be\/([^/?&]+)/
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
      
      throw new Error('Invalid YouTube URL');
    } catch (error) {
      console.error('YouTube URL parsing error:', error);
      setError('動画URLの形式が正しくありません');
      return '';
    }
  }, []);

  const videoId = extractYouTubeId(url);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const handleIframeError = useCallback(() => {
    setError('動画の読み込みに失敗しました');
    setIsLoading(false);
  }, []);

  const handleRetry = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setIsLoading(true);
      setError(null);
      setRetryCount(prev => prev + 1);
    }
  }, [retryCount]);

  // URLが変更された時にステートをリセット
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setRetryCount(0);
  }, [url]);

  if (!videoId) {
    return null;
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="relative aspect-video">
          {/* ローディング表示 */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-gray-500">読み込み中...</span>
            </div>
          )}

          {/* エラー表示 */}
          {error && (
            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
              {retryCount < MAX_RETRIES && (
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  再読み込み
                </Button>
              )}
            </div>
          )}

          {/* YouTube埋め込み */}
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="YouTube video player"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            aria-label="YouTube動画プレーヤー"
          />
        </div>
      </CardContent>
    </Card>
  );
}
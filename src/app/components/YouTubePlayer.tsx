'use client';
// src/app/components/YouTubePlayer.tsx
import { useState, useCallback } from 'react';
import { extractYouTubeId } from '@/app/lib/youtube';
import { Card, CardContent } from '@/app/components/ui/card';

interface YouTubePlayerProps {
  url: string | null;
  className?: string;
}

export default function YouTubePlayer({ url, className = '' }: YouTubePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const videoId = extractYouTubeId(url);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (!videoId) return null;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="relative aspect-video">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="YouTube video player"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        </div>
      </CardContent>
    </Card>
  );
}
// src/utils/youtube.ts
export const getYoutubeThumbnail = (youtubeId: string | undefined, quality: 'default' | 'hq' | 'maxres' = 'hq'): string => {
    if (!youtubeId) return '/placeholder-movie.jpg'; // デフォルトのプレースホルダー画像
    
    switch (quality) {
      case 'default':
        return `https://img.youtube.com/vi/${youtubeId}/default.jpg`;
      case 'hq':
        return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
      case 'maxres':
        return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
      default:
        return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }
  };
  
  export const isValidYoutubeId = (youtubeId: string | undefined): boolean => {
    if (!youtubeId) return false;
    // YouTube IDの一般的な形式（11文字の英数字）をチェック
    return /^[a-zA-Z0-9_-]{11}$/.test(youtubeId);
  };
  
  export const extractYoutubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];
  
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
  
    return null;
  };
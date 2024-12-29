// src/app/lib/youtube.ts
/**
 * URLからYouTubeのビデオIDを抽出します
 * 対応フォーマット:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeId(url: string | null): string | null {
    if (!url) return null;
    
    try {
      const urlObj = new URL(url);
      
      // youtu.be形式
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
      
      // youtube.com形式
      if (urlObj.hostname.includes('youtube.com')) {
        // 通常のwatch URL
        if (urlObj.pathname === '/watch') {
          return urlObj.searchParams.get('v');
        }
        
        // 埋め込みURL
        if (urlObj.pathname.startsWith('/embed/')) {
          return urlObj.pathname.split('/')[2];
        }
      }
      return null;
    } catch {
      // エラー詳細は不要なので無視
      console.error('Invalid YouTube URL:', url);
      return null;
    }
  }
  
  /**
   * ビデオIDからサムネイルURLを生成します
   */
  export function getYouTubeThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
    return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
  }
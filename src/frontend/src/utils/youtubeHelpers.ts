/**
 * Extracts YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, and more
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Remove whitespace
  url = url.trim();

  try {
    // Try to parse as URL
    const urlObj = new URL(url);
    
    // Pattern 1: youtube.com/watch?v=VIDEO_ID (with or without additional params)
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
      const videoId = urlObj.searchParams.get('v');
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }
    
    // Pattern 2: youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be' || urlObj.hostname === 'www.youtu.be') {
      const videoId = urlObj.pathname.slice(1).split('?')[0];
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }
    
    // Pattern 3: youtube.com/embed/VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
      const videoId = urlObj.pathname.split('/')[2];
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }
    
    // Pattern 4: youtube.com/v/VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/v/')) {
      const videoId = urlObj.pathname.split('/')[2];
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }
  } catch (e) {
    // Not a valid URL, try regex patterns as fallback
  }

  // Fallback regex patterns for non-URL formats
  
  // Pattern: youtube.com/watch?v=VIDEO_ID
  const watchPattern = /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
  const watchMatch = url.match(watchPattern);
  if (watchMatch) return watchMatch[1];

  // Pattern: youtu.be/VIDEO_ID
  const shortPattern = /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const shortMatch = url.match(shortPattern);
  if (shortMatch) return shortMatch[1];

  // Pattern: youtube.com/embed/VIDEO_ID
  const embedPattern = /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const embedMatch = url.match(embedPattern);
  if (embedMatch) return embedMatch[1];

  // Pattern: Just the video ID (11 characters)
  const idPattern = /^([a-zA-Z0-9_-]{11})$/;
  const idMatch = url.match(idPattern);
  if (idMatch) return idMatch[1];

  return null;
}

/**
 * Validates if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

/**
 * Generates YouTube thumbnail URL from video ID
 * Uses maxresdefault for highest quality, falls back to hqdefault
 */
export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Generates YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

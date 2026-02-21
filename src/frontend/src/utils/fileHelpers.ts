/**
 * Sanitizes a video title to create a filesystem-safe filename
 * Removes special characters and replaces spaces with hyphens
 */
export function sanitizeFilename(title: string): string {
  if (!title || title.trim() === '') {
    return '';
  }
  
  return title
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Remove invalid filesystem characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/\.+$/, '') // Remove trailing dots
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 200); // Limit length to avoid filesystem issues
}

/**
 * Generates a download filename for a video
 * Uses the video title if available, otherwise falls back to video-{videoId}.mp4
 */
export function generateDownloadFilename(videoId: string, videoTitle?: string): string {
  if (videoTitle) {
    const sanitized = sanitizeFilename(videoTitle);
    if (sanitized) {
      return `${sanitized}.mp4`;
    }
  }
  
  return `video-${videoId}.mp4`;
}

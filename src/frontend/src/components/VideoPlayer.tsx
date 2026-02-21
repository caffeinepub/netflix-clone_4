import { useEffect, useRef } from 'react';
import { ExternalBlob, Video, VideoSource } from '../backend';
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from '../utils/youtubeHelpers';

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && video.source === VideoSource.blob && video.metaData) {
      const videoUrl = video.metaData.getDirectURL();
      videoRef.current.src = videoUrl;
    }
  }, [video]);

  // YouTube video rendering
  if (video.source === VideoSource.youtube && video.url) {
    const videoId = extractYouTubeVideoId(video.url);
    
    if (!videoId) {
      return (
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
          <p className="text-muted-foreground">Invalid YouTube URL</p>
        </div>
      );
    }

    const embedUrl = getYouTubeEmbedUrl(videoId);

    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title={video.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // Blob video rendering (existing functionality)
  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        controls
        className="w-full h-full"
        controlsList="nodownload"
        playsInline
      >
        <source type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

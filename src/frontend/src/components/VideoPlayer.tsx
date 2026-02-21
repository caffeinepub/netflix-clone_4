import { useEffect, useRef, useState } from 'react';
import { Video, VideoSource } from '../backend';
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from '../utils/youtubeHelpers';
import { Loader2, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Handle blob video URL generation
  useEffect(() => {
    if (video.source === VideoSource.blob && video.metaData) {
      try {
        console.log('VideoPlayer: Loading blob video', video.id);
        const url = video.metaData.getDirectURL();
        console.log('VideoPlayer: Blob URL generated', url);
        setBlobUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('VideoPlayer: Error generating blob URL', err);
        setError('Failed to load video');
        setLoading(false);
      }
    } else if (video.source === VideoSource.youtube) {
      console.log('VideoPlayer: Loading YouTube video', video.id);
      setLoading(false);
    }
  }, [video]);

  // Update video element src when blob URL changes
  useEffect(() => {
    if (videoRef.current && blobUrl) {
      console.log('VideoPlayer: Setting video src', blobUrl);
      videoRef.current.src = blobUrl;
    }
  }, [blobUrl]);

  // YouTube video rendering
  if (video.source === VideoSource.youtube) {
    if (!video.url) {
      return (
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
            <p className="text-muted-foreground">YouTube URL not found</p>
          </div>
        </div>
      );
    }

    const videoId = extractYouTubeVideoId(video.url);
    
    if (!videoId) {
      return (
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
            <p className="text-muted-foreground">Invalid YouTube URL</p>
          </div>
        </div>
      );
    }

    const embedUrl = getYouTubeEmbedUrl(videoId);
    console.log('VideoPlayer: Rendering YouTube iframe', embedUrl);

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

  // Blob video rendering
  if (loading) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
          <p className="text-muted-foreground">Video source not available</p>
        </div>
      </div>
    );
  }

  console.log('VideoPlayer: Rendering blob video player');

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        controls
        className="w-full h-full"
        controlsList="nodownload"
        playsInline
        onError={(e) => {
          console.error('VideoPlayer: Video element error', e);
          setError('Failed to play video');
        }}
        onLoadStart={() => console.log('VideoPlayer: Video load started')}
        onLoadedData={() => console.log('VideoPlayer: Video data loaded')}
        onCanPlay={() => console.log('VideoPlayer: Video can play')}
      >
        <source src={blobUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

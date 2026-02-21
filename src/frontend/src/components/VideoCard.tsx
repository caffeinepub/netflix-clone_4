import { Link } from '@tanstack/react-router';
import { Play } from 'lucide-react';
import { Video, VideoSource } from '../backend';
import FavoriteButton from './FavoriteButton';
import WatchlistButton from './WatchlistButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface VideoCardProps {
  video: Video;
}

const thumbnailMap: Record<string, string> = {
  '1': '/assets/generated/video-thumb-1.dim_400x225.png',
  '2': '/assets/generated/video-thumb-2.dim_400x225.png',
  '3': '/assets/generated/video-thumb-3.dim_400x225.png',
  '4': '/assets/generated/video-thumb-4.dim_400x225.png',
  '5': '/assets/generated/video-thumb-5.dim_400x225.png',
  '6': '/assets/generated/video-thumb-6.dim_400x225.png',
};

export default function VideoCard({ video }: VideoCardProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  // Use externalThumbnail for YouTube videos, fallback to static thumbnails
  const thumbnailUrl = video.source === VideoSource.youtube && video.externalThumbnail
    ? video.externalThumbnail
    : thumbnailMap[video.id] || '/assets/generated/video-thumb-1.dim_400x225.png';

  return (
    <div className="group relative rounded-lg overflow-hidden bg-card border border-border/50 hover:border-border transition-all duration-300 hover:scale-[1.02]">
      <Link to="/watch/$videoId" params={{ videoId: video.id }} className="block">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/video-thumb-1.dim_400x225.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
              <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
            </div>
          </div>
        </div>
      </Link>

      {isAuthenticated && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FavoriteButton videoId={video.id} />
          <WatchlistButton videoId={video.id} />
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-[oklch(0.65_0.25_25)] transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-2 py-0.5 rounded-full bg-accent/50 text-accent-foreground text-xs font-medium">
            {video.genre}
          </span>
          <span>•</span>
          <span>{video.category}</span>
        </div>
      </div>
    </div>
  );
}

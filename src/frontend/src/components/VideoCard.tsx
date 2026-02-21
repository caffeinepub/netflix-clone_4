import { Link } from '@tanstack/react-router';
import { Play } from 'lucide-react';
import { Video, VideoSource } from '../backend';
import FavoriteButton from './FavoriteButton';
import WatchlistButton from './WatchlistButton';
import DownloadButton from './DownloadButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);
  
  const thumbnailUrl = video.source === VideoSource.youtube && video.externalThumbnail
    ? video.externalThumbnail
    : thumbnailMap[video.id] || '/assets/generated/video-thumb-1.dim_400x225.png';

  return (
    <div 
      className="group relative rounded overflow-hidden bg-card transition-all duration-300 hover:scale-110 hover:z-50 netflix-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to="/watch/$videoId" params={{ videoId: video.id }} className="block">
        <div className="relative aspect-video overflow-hidden bg-black">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/video-thumb-1.dim_400x225.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {isHovered && (
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent animate-fade-in">
          <h3 className="font-bold text-white text-sm mb-2 line-clamp-1">
            {video.title}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Link to="/watch/$videoId" params={{ videoId: video.id }}>
                <button className="w-8 h-8 rounded-full bg-white hover:bg-white/90 flex items-center justify-center transition-colors">
                  <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                </button>
              </Link>
              {isAuthenticated && (
                <>
                  <WatchlistButton videoId={video.id} />
                  <FavoriteButton videoId={video.id} />
                  <DownloadButton 
                    videoId={video.id} 
                    videoTitle={video.title} 
                    videoSource={video.source} 
                  />
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/80">
            <span className="px-2 py-0.5 border border-white/40 text-white font-medium">
              {video.genre}
            </span>
            <span>•</span>
            <span>{video.category}</span>
          </div>
        </div>
      )}
    </div>
  );
}

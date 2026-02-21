import { useParams, Link } from '@tanstack/react-router';
import { useGetVideoMeta, useGetVideosByCategory } from '../hooks/useQueries';
import VideoPlayer from '../components/VideoPlayer';
import VideoRow from '../components/VideoRow';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import FavoriteButton from '../components/FavoriteButton';
import WatchlistButton from '../components/WatchlistButton';
import DownloadButton from '../components/DownloadButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Watch() {
  const { videoId } = useParams({ from: '/watch/$videoId' });
  const { data: video, isLoading, error } = useGetVideoMeta(videoId);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: relatedVideos = [] } = useGetVideosByCategory(video?.category || '');
  const filteredRelatedVideos = relatedVideos.filter((v) => v.id !== videoId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-netflix-red mb-4" />
          <p className="text-white/60">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-netflix-red mx-auto mb-4" />
          <p className="text-white/80 text-lg mb-4">
            {error instanceof Error ? error.message : 'Video not found'}
          </p>
          <Link to="/">
            <Button className="bg-netflix-red hover:bg-netflix-red/90">Back to Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2 text-white hover:text-white/80">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>

        <div className="max-w-6xl mx-auto">
          <VideoPlayer video={video} />

          <div className="mt-8 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{video.title}</h1>
              <div className="flex items-center gap-3 text-white/80 mb-4">
                <span className="px-3 py-1 border border-white/40 text-white text-sm font-medium">
                  {video.genre}
                </span>
                <span>•</span>
                <span>{video.category}</span>
              </div>
              {video.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {video.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded bg-white/10 text-white/70 text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated && (
              <div className="flex gap-2">
                <FavoriteButton videoId={video.id} />
                <WatchlistButton videoId={video.id} />
                <DownloadButton 
                  videoId={video.id} 
                  videoTitle={video.title} 
                  videoSource={video.source} 
                />
              </div>
            )}
          </div>

          {filteredRelatedVideos.length > 0 && (
            <div className="mt-16">
              <VideoRow title="More Like This" videos={filteredRelatedVideos} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

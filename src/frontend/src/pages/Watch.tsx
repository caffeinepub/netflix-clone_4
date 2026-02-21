import { useParams, Link } from '@tanstack/react-router';
import { useGetVideoMeta } from '../hooks/useQueries';
import VideoPlayer from '../components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import FavoriteButton from '../components/FavoriteButton';
import WatchlistButton from '../components/WatchlistButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Watch() {
  const { videoId } = useParams({ from: '/watch/$videoId' });
  const { data: video, isLoading } = useGetVideoMeta(videoId);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">Video not found</p>
          <Link to="/">
            <Button>Back to Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Button>
      </Link>

      <div className="max-w-6xl mx-auto">
        <VideoPlayer video={video} />

        <div className="mt-6 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <span className="px-3 py-1 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium">
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
                    className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

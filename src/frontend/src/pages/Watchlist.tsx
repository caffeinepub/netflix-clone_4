import { useGetUserWatchlist } from '../hooks/useQueries';
import VideoGrid from '../components/VideoGrid';
import { Loader2, Bookmark } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function Watchlist() {
  const { identity } = useInternetIdentity();
  const { data: watchlist = [], isLoading } = useGetUserWatchlist();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg mb-4">Please log in to view your watchlist</p>
          <Link to="/">
            <Button>Back to Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-[oklch(0.75_0.20_50)]" />
          My Watchlist
        </h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : watchlist.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">Your watchlist is empty</p>
          <Link to="/">
            <Button>Browse Videos</Button>
          </Link>
        </div>
      ) : (
        <VideoGrid videos={watchlist} />
      )}
    </div>
  );
}

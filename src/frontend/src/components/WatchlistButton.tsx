import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetUserWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '../hooks/useQueries';

interface WatchlistButtonProps {
  videoId: string;
}

export default function WatchlistButton({ videoId }: WatchlistButtonProps) {
  const { data: watchlist = [] } = useGetUserWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const isInWatchlist = watchlist.some((v) => v.id === videoId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWatchlist) {
      await removeFromWatchlist.mutateAsync(videoId);
    } else {
      await addToWatchlist.mutateAsync(videoId);
    }
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
      onClick={handleToggle}
      disabled={addToWatchlist.isPending || removeFromWatchlist.isPending}
    >
      <Bookmark
        className={`w-4 h-4 transition-colors ${
          isInWatchlist ? 'fill-[oklch(0.75_0.20_50)] text-[oklch(0.75_0.20_50)]' : 'text-foreground'
        }`}
      />
    </Button>
  );
}

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetUserFavorites, useMarkFavorite, useUnmarkFavorite } from '../hooks/useQueries';

interface FavoriteButtonProps {
  videoId: string;
}

export default function FavoriteButton({ videoId }: FavoriteButtonProps) {
  const { data: favorites = [] } = useGetUserFavorites();
  const markFavorite = useMarkFavorite();
  const unmarkFavorite = useUnmarkFavorite();

  const isFavorite = favorites.some((v) => v.id === videoId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      await unmarkFavorite.mutateAsync(videoId);
    } else {
      await markFavorite.mutateAsync(videoId);
    }
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
      onClick={handleToggle}
      disabled={markFavorite.isPending || unmarkFavorite.isPending}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          isFavorite ? 'fill-[oklch(0.65_0.25_25)] text-[oklch(0.65_0.25_25)]' : 'text-foreground'
        }`}
      />
    </Button>
  );
}

import { useParams } from '@tanstack/react-router';
import { useGetVideosByCategory } from '../hooks/useQueries';
import VideoGrid from '../components/VideoGrid';
import CategoryFilter from '../components/CategoryFilter';
import { Loader2 } from 'lucide-react';

export default function Category() {
  const { categoryName } = useParams({ from: '/category/$categoryName' });
  const { data: videos = [], isLoading } = useGetVideosByCategory(categoryName);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>
        <CategoryFilter activeCategory={categoryName} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </div>
  );
}

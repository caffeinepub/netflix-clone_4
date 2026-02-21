import { useParams } from '@tanstack/react-router';
import { useGetVideosByCategory } from '../hooks/useQueries';
import VideoRow from '../components/VideoRow';
import CategoryFilter from '../components/CategoryFilter';
import { Loader2 } from 'lucide-react';

export default function Category() {
  const { categoryName } = useParams({ from: '/category/$categoryName' });
  const { data: videos = [], isLoading } = useGetVideosByCategory(categoryName);

  return (
    <div className="bg-black min-h-screen pt-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{categoryName}</h1>
          <CategoryFilter />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-netflix-red" />
          </div>
        ) : (
          <VideoRow title={`${categoryName} Videos`} videos={videos} />
        )}

        {!isLoading && videos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/60 text-lg">No videos found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

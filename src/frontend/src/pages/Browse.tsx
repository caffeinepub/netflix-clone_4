import { useGetAllVideos } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import HeroBanner from '../components/HeroBanner';
import VideoRow from '../components/VideoRow';
import CategoryFilter from '../components/CategoryFilter';
import { Loader2 } from 'lucide-react';

export default function Browse() {
  const { data: videos = [], isLoading } = useGetAllVideos();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;

  // Group videos by category
  const videosByCategory = videos.reduce((acc, video) => {
    if (!acc[video.category]) {
      acc[video.category] = [];
    }
    acc[video.category].push(video);
    return acc;
  }, {} as Record<string, typeof videos>);

  // Group videos by genre
  const videosByGenre = videos.reduce((acc, video) => {
    if (!acc[video.genre]) {
      acc[video.genre] = [];
    }
    acc[video.genre].push(video);
    return acc;
  }, {} as Record<string, typeof videos>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-netflix-red" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <HeroBanner />

      <div className="relative -mt-32 z-10">
        <div className="mb-8 px-4 md:px-8">
          <CategoryFilter />
        </div>

        {Object.entries(videosByCategory).map(([category, categoryVideos]) => (
          <VideoRow key={category} title={category} videos={categoryVideos} />
        ))}

        {Object.entries(videosByGenre).map(([genre, genreVideos]) => (
          <VideoRow key={`genre-${genre}`} title={`${genre} Collection`} videos={genreVideos} />
        ))}

        {videos.length > 0 && (
          <VideoRow title="All Videos" videos={videos} />
        )}

        {videos.length === 0 && (
          <div className="text-center py-16 px-4">
            <p className="text-white/60 text-lg">No videos available yet.</p>
            {isAuthenticated && (
              <p className="text-white/40 text-sm mt-2">Be the first to upload content!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

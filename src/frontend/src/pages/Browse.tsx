import { useGetAllVideos } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import VideoGrid from '../components/VideoGrid';
import CategoryFilter from '../components/CategoryFilter';
import { Loader2, Upload, Plus } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Browse() {
  const { data: videos = [], isLoading } = useGetAllVideos();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-12 rounded-2xl overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1920x400.png"
          alt="Saanufox Banner"
          className="w-full h-[300px] md:h-[400px] object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[oklch(0.65_0.25_25)] to-[oklch(0.75_0.20_50)] bg-clip-text text-transparent">
            Discover Amazing Content
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Stream thousands of movies, series, and documentaries in stunning quality
          </p>
        </div>
      </div>

      {isAuthenticated && (
        <Link to="/admin/upload">
          <div className="mb-12 group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[oklch(0.65_0.25_25)] to-[oklch(0.55_0.20_35)] p-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Upload New Video
                    </h2>
                    <p className="text-white/80 text-sm md:text-base">
                      Add YouTube videos or upload your own content to the platform
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 group-hover:translate-x-1 transition-all duration-300">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
        <CategoryFilter />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">All Videos</h2>
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

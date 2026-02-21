import { useGetAllVideos } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Play, Info } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function HeroBanner() {
  const { data: videos = [] } = useGetAllVideos();
  const featuredVideo = videos[0];

  if (!featuredVideo) {
    return null;
  }

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/generated/netflix-hero-bg.dim_1920x1080.png')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative h-full container mx-auto px-4 md:px-8 flex items-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            {featuredVideo.title}
          </h1>
          
          <div className="flex items-center gap-3 text-sm md:text-base">
            <span className="px-3 py-1 bg-netflix-red text-white font-semibold rounded">
              {featuredVideo.genre}
            </span>
            <span className="text-white/80">{featuredVideo.category}</span>
          </div>

          <p className="text-base md:text-lg text-white/90 line-clamp-3">
            {featuredVideo.keywords.length > 0 
              ? featuredVideo.keywords.join(' • ')
              : 'Discover amazing content and start streaming now.'}
          </p>

          <div className="flex items-center gap-4">
            <Link to="/watch/$videoId" params={{ videoId: featuredVideo.id }}>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 font-semibold px-8 gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                Play
              </Button>
            </Link>
            <Link to="/watch/$videoId" params={{ videoId: featuredVideo.id }}>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm font-semibold px-8 gap-2"
              >
                <Info className="w-5 h-5" />
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

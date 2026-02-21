import { useState } from 'react';
import { useSearchVideos } from '../hooks/useQueries';
import SearchBar from '../components/SearchBar';
import VideoGrid from '../components/VideoGrid';
import { Loader2 } from 'lucide-react';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: videos = [], isLoading } = useSearchVideos(searchQuery);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Videos</h1>
        <SearchBar onSearch={setSearchQuery} initialValue={searchQuery} />
      </div>

      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {isLoading ? 'Searching...' : `Results for "${searchQuery}"`}
          </h2>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : searchQuery ? (
        <VideoGrid videos={videos} />
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">Enter a search term to find videos</p>
        </div>
      )}
    </div>
  );
}

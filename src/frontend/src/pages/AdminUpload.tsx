import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAddVideo } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Upload, Youtube } from 'lucide-react';
import { isValidYouTubeUrl, extractYouTubeVideoId, getYouTubeThumbnailUrl } from '../utils/youtubeHelpers';
import { VideoSource, ExternalBlob } from '../backend';
import { toast } from 'sonner';

type UploadMode = 'youtube' | 'file';

export default function AdminUpload() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const addVideoMutation = useAddVideo();

  const [mode, setMode] = useState<UploadMode>('youtube');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [genre, setGenre] = useState('');
  const [keywords, setKeywords] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeUrlError, setYoutubeUrlError] = useState('');

  const isAuthenticated = !!identity;

  // Validate YouTube URL on change
  const handleYoutubeUrlChange = (value: string) => {
    setYoutubeUrl(value);
    if (value && !isValidYouTubeUrl(value)) {
      setYoutubeUrlError('Please enter a valid YouTube URL');
    } else {
      setYoutubeUrlError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !category.trim() || !genre.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (mode === 'youtube') {
      if (!youtubeUrl.trim()) {
        toast.error('Please enter a YouTube URL');
        return;
      }

      if (!isValidYouTubeUrl(youtubeUrl)) {
        toast.error('Please enter a valid YouTube URL');
        return;
      }

      const videoId = extractYouTubeVideoId(youtubeUrl);
      if (!videoId) {
        toast.error('Could not extract video ID from URL');
        return;
      }

      try {
        // Create a placeholder ExternalBlob for metadata (required by backend)
        const placeholderBlob = ExternalBlob.fromBytes(new Uint8Array(0));
        
        // Get YouTube thumbnail URL as string
        const thumbnailUrl = getYouTubeThumbnailUrl(videoId);

        const video = {
          id: `yt-${videoId}-${Date.now()}`,
          title: title.trim(),
          category: category.trim(),
          genre: genre.trim(),
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
          source: VideoSource.youtube,
          blobId: undefined,
          url: youtubeUrl.trim(),
          metaData: placeholderBlob,
          externalThumbnail: thumbnailUrl,
        };

        await addVideoMutation.mutateAsync(video);
        toast.success('YouTube video added successfully!');
        
        // Reset form
        setTitle('');
        setCategory('');
        setGenre('');
        setKeywords('');
        setYoutubeUrl('');
        
        // Navigate to browse page
        navigate({ to: '/' });
      } catch (error: any) {
        console.error('Error adding YouTube video:', error);
        toast.error(error.message || 'Failed to add video');
      }
    } else {
      toast.error('File upload not yet implemented');
    }
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">Please log in to access this page</p>
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

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>Add a new video to your library</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Upload Mode Selection */}
              <div className="space-y-3">
                <Label>Upload Method</Label>
                <RadioGroup value={mode} onValueChange={(value) => setMode(value as UploadMode)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="youtube" id="youtube" />
                    <Label htmlFor="youtube" className="flex items-center gap-2 cursor-pointer font-normal">
                      <Youtube className="w-4 h-4 text-red-500" />
                      YouTube URL
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="file" disabled />
                    <Label htmlFor="file" className="flex items-center gap-2 cursor-not-allowed font-normal text-muted-foreground">
                      <Upload className="w-4 h-4" />
                      File Upload (Coming Soon)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* YouTube URL Input */}
              {mode === 'youtube' && (
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">
                    YouTube URL <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="youtubeUrl"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                    className={youtubeUrlError ? 'border-destructive' : ''}
                  />
                  {youtubeUrlError && (
                    <p className="text-sm text-destructive">{youtubeUrlError}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Supports: youtube.com/watch?v=..., youtu.be/..., or youtube.com/embed/...
                  </p>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="category"
                  placeholder="e.g., Movies, TV Shows, Documentaries"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <Label htmlFor="genre">
                  Genre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="genre"
                  placeholder="e.g., Action, Drama, Comedy"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                />
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  placeholder="Enter keywords separated by commas"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Separate multiple keywords with commas
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={addVideoMutation.isPending || (mode === 'youtube' && !!youtubeUrlError)}
                  className="flex-1"
                >
                  {addVideoMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding Video...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Add Video
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/' })}
                  disabled={addVideoMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

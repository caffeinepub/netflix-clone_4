import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAddVideo } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Upload as UploadIcon, Youtube } from 'lucide-react';
import { isValidYouTubeUrl, extractYouTubeVideoId, getYouTubeThumbnailUrl } from '../utils/youtubeHelpers';
import { VideoSource, ExternalBlob } from '../backend';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isAuthenticated = !!identity;

  const handleYoutubeUrlChange = (value: string) => {
    setYoutubeUrl(value);
    if (value && !isValidYouTubeUrl(value)) {
      setYoutubeUrlError('Please enter a valid YouTube URL');
    } else {
      setYoutubeUrlError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!category.trim()) {
      toast.error('Category is required');
      return;
    }

    if (!genre.trim()) {
      toast.error('Genre is required');
      return;
    }

    try {
      const videoId = `video-${Date.now()}`;
      const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k);

      if (mode === 'youtube') {
        if (!youtubeUrl.trim()) {
          toast.error('YouTube URL is required');
          return;
        }

        if (!isValidYouTubeUrl(youtubeUrl)) {
          toast.error('Please enter a valid YouTube URL');
          return;
        }

        const youtubeVideoId = extractYouTubeVideoId(youtubeUrl);
        if (!youtubeVideoId) {
          toast.error('Could not extract video ID from YouTube URL');
          return;
        }

        const thumbnailUrl = getYouTubeThumbnailUrl(youtubeVideoId);
        const minimalBlob = new Uint8Array([1]);
        const metaData = ExternalBlob.fromBytes(minimalBlob);

        await addVideoMutation.mutateAsync({
          id: videoId,
          title: title.trim(),
          category: category.trim(),
          genre: genre.trim(),
          keywords: keywordsArray,
          source: VideoSource.youtube,
          blobId: undefined,
          url: youtubeUrl.trim(),
          metaData,
          externalThumbnail: thumbnailUrl,
        });

        toast.success('YouTube video added successfully!');
      } else {
        if (!selectedFile) {
          toast.error('Please select a video file');
          return;
        }

        const arrayBuffer = await selectedFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        const metaData = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });

        await addVideoMutation.mutateAsync({
          id: videoId,
          title: title.trim(),
          category: category.trim(),
          genre: genre.trim(),
          keywords: keywordsArray,
          source: VideoSource.blob,
          blobId: videoId,
          url: undefined,
          metaData,
          externalThumbnail: undefined,
        });

        toast.success('Video uploaded successfully!');
      }

      setTitle('');
      setCategory('');
      setGenre('');
      setKeywords('');
      setYoutubeUrl('');
      setSelectedFile(null);
      setUploadProgress(0);
      
      navigate({ to: '/' });
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.message || 'Failed to upload video';
      
      if (errorMessage.includes('Unauthorized')) {
        toast.error('You do not have permission to upload videos');
      } else if (errorMessage.includes('already exists')) {
        toast.error('A video with this ID already exists');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 bg-black min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <UploadIcon className="w-16 h-16 mx-auto mb-4 text-white/60" />
          <h2 className="text-2xl font-bold mb-2 text-white">Login Required</h2>
          <p className="text-white/60 mb-6">
            Please log in to upload videos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2 text-white hover:text-white/80">
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </Button>
        </Link>

        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Upload Video</CardTitle>
            <CardDescription className="text-white/60">
              Add a new video from YouTube or upload your own file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-white">Upload Method</Label>
                <RadioGroup value={mode} onValueChange={(value) => setMode(value as UploadMode)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="youtube" id="youtube" />
                    <Label htmlFor="youtube" className="flex items-center gap-2 cursor-pointer text-white">
                      <Youtube className="w-5 h-5 text-netflix-red" />
                      YouTube URL
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="file" />
                    <Label htmlFor="file" className="flex items-center gap-2 cursor-pointer text-white">
                      <UploadIcon className="w-5 h-5 text-netflix-red" />
                      Upload File
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Title *</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="bg-background/50 border-white/20 text-white"
                  disabled={addVideoMutation.isPending}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Category *</Label>
                  <Input
                    id="category"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Movies, Series"
                    className="bg-background/50 border-white/20 text-white"
                    disabled={addVideoMutation.isPending}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-white">Genre *</Label>
                  <Input
                    id="genre"
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="e.g., Action, Drama"
                    className="bg-background/50 border-white/20 text-white"
                    disabled={addVideoMutation.isPending}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords" className="text-white">Keywords</Label>
                <Input
                  id="keywords"
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Comma-separated keywords"
                  className="bg-background/50 border-white/20 text-white"
                  disabled={addVideoMutation.isPending}
                />
              </div>

              {mode === 'youtube' ? (
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl" className="text-white">YouTube URL *</Label>
                  <Input
                    id="youtubeUrl"
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="bg-background/50 border-white/20 text-white"
                    disabled={addVideoMutation.isPending}
                    required
                  />
                  {youtubeUrlError && (
                    <p className="text-sm text-netflix-red">{youtubeUrlError}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="videoFile" className="text-white">Video File *</Label>
                  <Input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="bg-background/50 border-white/20 text-white file:text-white"
                    disabled={addVideoMutation.isPending}
                    required
                  />
                  {selectedFile && (
                    <p className="text-sm text-white/60">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-sm text-white/60 text-center">{uploadProgress}% uploaded</p>
                    </div>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={addVideoMutation.isPending || (mode === 'youtube' && !!youtubeUrlError)}
                className="w-full bg-netflix-red hover:bg-netflix-red/90 text-white font-semibold"
              >
                {addVideoMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload Video
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

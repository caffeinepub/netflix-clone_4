import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDownloadVideo } from '../hooks/useQueries';
import { VideoSource, ExternalBlob } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { generateDownloadFilename } from '../utils/fileHelpers';

interface DownloadButtonProps {
  videoId: string;
  videoTitle: string;
  videoSource: VideoSource;
}

export default function DownloadButton({ videoId, videoTitle, videoSource }: DownloadButtonProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const downloadVideo = useDownloadVideo();

  if (!isAuthenticated) {
    return null;
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const result = await downloadVideo.mutateAsync({
        videoId,
        videoTitle,
        videoSource,
      });

      if (videoSource === VideoSource.blob) {
        // For blob videos, download the file
        const blob = ExternalBlob.fromURL(result.downloadLink);
        const bytes = await blob.getBytes();
        const blobData = new Blob([bytes], { type: 'video/mp4' });
        const url = URL.createObjectURL(blobData);
        
        const filename = generateDownloadFilename(videoId, videoTitle);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Download started', {
          description: `Downloading ${videoTitle}`,
        });
      } else if (videoSource === VideoSource.youtube) {
        // For YouTube videos, open in new tab
        window.open(result.downloadLink, '_blank');
        toast.info('Opening YouTube', {
          description: 'Use YouTube\'s download options or third-party tools',
        });
      }
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error('Download failed', {
        description: error?.message || 'Unable to download video',
      });
    }
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
      onClick={handleDownload}
      disabled={downloadVideo.isPending}
    >
      {downloadVideo.isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
    </Button>
  );
}

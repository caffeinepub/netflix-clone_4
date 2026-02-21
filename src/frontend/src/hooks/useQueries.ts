import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Video, UserProfile, VideoSource } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userCount'] });
    },
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userCount'] });
    },
  });
}

// Admin Check Query
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// User Count Query
export function useGetUserCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['userCount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserCount();
    },
    enabled: !!actor && !isFetching,
  });
}

// Video Queries
export function useGetAllVideos() {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVideoMeta(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Video>({
    queryKey: ['video', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getVideoMeta(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSearchVideos(searchText: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos', 'search', searchText],
    queryFn: async () => {
      if (!actor) return [];
      if (!searchText.trim()) return [];
      return actor.searchVideos(searchText);
    },
    enabled: !!actor && !isFetching && !!searchText.trim(),
  });
}

export function useGetVideosByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideosByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

// Add Video Mutation
export function useAddVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (video: Video) => {
      console.log('useAddVideo mutation started');
      
      if (!actor) {
        console.error('Actor not available in mutation');
        throw new Error('Actor not available');
      }

      console.log('Calling actor.createVideo with video:', {
        id: video.id,
        title: video.title,
        category: video.category,
        genre: video.genre,
        source: video.source,
      });

      try {
        const result = await actor.createVideo(video);
        console.log('actor.createVideo completed successfully');
        return result;
      } catch (error: any) {
        console.error('Error in actor.createVideo:', error);
        console.error('Error details:', {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
        });
        
        // Re-throw with more context
        if (error?.message) {
          throw new Error(error.message);
        } else {
          throw new Error('Unknown error occurred while creating video');
        }
      }
    },
    onSuccess: () => {
      console.log('Video creation successful, invalidating queries');
      // Invalidate all video-related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
    onError: (error: any) => {
      console.error('Mutation onError handler:', error);
      console.error('Error type:', typeof error);
      console.error('Error properties:', Object.keys(error || {}));
    },
  });
}

// Download Video Mutation
export function useDownloadVideo() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ videoId, videoTitle, videoSource }: { videoId: string; videoTitle: string; videoSource: VideoSource }) => {
      if (!actor) throw new Error('Actor not available');
      
      const downloadLink = await actor.getVideoDownloadLink(videoId);
      
      return {
        downloadLink,
        videoTitle,
        videoSource,
      };
    },
  });
}

// Favorites Queries
export function useGetUserFavorites() {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserFavorites();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markFavorite(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useUnmarkFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unmarkFavorite(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

// Watchlist Queries
export function useGetUserWatchlist() {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['watchlist'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserWatchlist();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToWatchlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToWatchlist(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });
}

export function useRemoveFromWatchlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFromWatchlist(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });
}

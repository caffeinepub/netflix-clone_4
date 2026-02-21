import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Video, UserProfile } from '../backend';

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
      if (!actor) throw new Error('Actor not available');
      return actor.createVideo(video);
    },
    onSuccess: () => {
      // Invalidate all video-related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
    onError: (error: any) => {
      console.error('Error creating video:', error);
      throw error;
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

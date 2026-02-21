import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: string;
    url?: string;
    title: string;
    metaData: ExternalBlob;
    source: VideoSource;
    externalThumbnail?: string;
    keywords: Array<string>;
    genre: string;
    blobId?: string;
    category: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VideoSource {
    blob = "blob",
    youtube = "youtube"
}
export interface backendInterface {
    addToWatchlist(videoId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createVideo(metaData: Video): Promise<void>;
    getAllVideos(): Promise<Array<Video>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserFavorites(): Promise<Array<Video>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserWatchlist(): Promise<Array<Video>>;
    getVideoMeta(id: string): Promise<Video>;
    getVideosByCategory(category: string): Promise<Array<Video>>;
    isCallerAdmin(): Promise<boolean>;
    markFavorite(videoId: string): Promise<void>;
    removeFromWatchlist(videoId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchVideos(searchText: string): Promise<Array<Video>>;
    unmarkFavorite(videoId: string): Promise<void>;
    uploadVideo(blobId: string, videoMeta: Video): Promise<void>;
}

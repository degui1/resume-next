// YouTube API Response Types

export interface YouTubeApiChannel {
  kind: 'youtube#channel';
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
}

export interface YouTubeApiVideo {
  kind: 'youtube#video';
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    channelId: string;
    channelTitle: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export interface YouTubeApiSearchResponse {
  kind: 'youtube#searchListResponse';
  items: Array<{
    kind: 'youtube#searchResult';
    id: {
      kind: 'youtube#video';
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        default: { url: string };
        medium: { url: string };
        high: { url: string };
      };
    };
  }>;
}

// YouTube Configuration Types

export interface YouTubeConfig extends Record<string, unknown> {
  apiKey: string;
  channelIds: string[];
  revalidate: number;
  fallbackToMock: boolean;
}

export interface YouTubeClientConfig {
  apiKey: string;
  baseUrl?: string;
  revalidate?: number;
  locale?: string;
}

// Application Types

export interface YouTubeChannel {
  id: string;
  name: string;
  handle: string;
  subscribers: string;
  url: string;
  viewCount?: string;
  videoCount?: string;
  thumbnailUrl?: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  views?: number;
  channelId?: string;
  channelTitle?: string;
}

// Result Types

export interface QuotaInfo {
  canMakeRequest: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
}

export interface FetchChannelResult {
  data?: YouTubeChannel[];
  source: 'api' | 'cache' | 'error';
  quotaInfo?: QuotaInfo;
  error?: {
    type: 'quota' | 'auth' | 'not_found' | 'network' | 'config';
    message: string;
  };
}

export interface FetchVideosResult {
  data?: Video[];
  source: 'api' | 'cache' | 'error';
  quotaInfo?: QuotaInfo;
  error?: {
    type: 'quota' | 'auth' | 'not_found' | 'network' | 'config';
    message: string;
  };
}

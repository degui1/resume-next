// Public API exports for YouTube integration

export type {
  YouTubeApiChannel,
  YouTubeApiVideo,
  YouTubeApiSearchResponse,
  YouTubeConfig,
  YouTubeClientConfig,
  YouTubeChannel,
  Video,
  QuotaInfo,
  FetchChannelResult,
  FetchVideosResult,
} from './types';

export {
  getYouTubeConfig,
  validateYouTubeConfig,
  isYouTubeConfigured,
} from './config';

export {
  transformChannel,
  transformVideos,
  transformChannels,
} from './transformer';

export { YouTubeClient } from './client';

export { YouTubeService } from './service';

import { formatLargeNumber } from '@/lib/api/formatters';
import type { YouTubeApiChannel, YouTubeApiVideo, YouTubeChannel, Video } from './types';

/**
 * Transform YouTube API channel response to application YouTubeChannel type
 * Extracts all required fields and formats numeric values using shared formatters
 * 
 * @param apiChannel - Raw YouTube API channel response
 * @returns Transformed YouTubeChannel object with formatted values
 */
export function transformChannel(apiChannel: YouTubeApiChannel): YouTubeChannel {
  return {
    id: apiChannel.id,
    name: apiChannel.snippet.title,
    handle: apiChannel.snippet.customUrl,
    subscribers: formatLargeNumber(parseInt(apiChannel.statistics.subscriberCount, 10)),
    url: `https://youtube.com/channel/${apiChannel.id}`,
    viewCount: formatLargeNumber(parseInt(apiChannel.statistics.viewCount, 10)),
    videoCount: formatLargeNumber(parseInt(apiChannel.statistics.videoCount, 10)),
    thumbnailUrl: apiChannel.snippet.thumbnails.high.url
  };
}

/**
 * Transform YouTube API video responses to application Video type
 * Extracts all required fields including view counts and channel information
 * 
 * @param apiVideos - Array of raw YouTube API video responses
 * @returns Array of transformed Video objects
 */
export function transformVideos(apiVideos: YouTubeApiVideo[]): Video[] {
  return apiVideos.map(video => ({
    id: video.id,
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails.medium.url,
    url: `https://youtube.com/watch?v=${video.id}`,
    views: parseInt(video.statistics.viewCount, 10),
    channelId: video.snippet.channelId,
    channelTitle: video.snippet.channelTitle
  }));
}

/**
 * Transform multiple YouTube API channel responses to application YouTubeChannel type
 * Convenience function for batch transformation of channels
 * 
 * @param apiChannels - Array of raw YouTube API channel responses
 * @returns Array of transformed YouTubeChannel objects
 */
export function transformChannels(apiChannels: YouTubeApiChannel[]): YouTubeChannel[] {
  return apiChannels.map(transformChannel);
}

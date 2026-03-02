"use client";

import { useEffect, useState } from 'react';
import { YouTubeChannel } from '@/lib/youtube/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Youtube, Loader2 } from 'lucide-react';
import { Dictionary } from '@/lib/i18n/get-dictionary';
import { getYouTubeChannels } from '@/app/actions/youtube';
import { YouTubeErrorState } from '@/components/youtube/YouTubeErrorState';

interface YouTubeChannelInfoProps {
  topics: string[];
  dict: Dictionary;
}

export function YouTubeChannelInfo({ topics, dict }: YouTubeChannelInfoProps) {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ type: 'quota' | 'auth' | 'not_found' | 'network' | 'config'; message: string } | null>(null);

  useEffect(() => {
    async function fetchChannels() {
      try {
        setLoading(true);
        const result = await getYouTubeChannels();

        if (result.source === 'error' && result.error) {
          setError(result.error);
        } else if (result.data) {
          setChannels(result.data);
          setError(null);
        }
      } catch (err) {
        setError({
          type: 'network',
          message: 'An unexpected error occurred while loading YouTube data.',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchChannels();
  }, []);

  const handleVisitChannel = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading YouTube data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <YouTubeErrorState errorType={error.type} message={error.message} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Channel List */}
        <div className="space-y-4">
          {channels.map((channel) => (
            <div key={channel.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-foreground">{channel.name}</h3>
                  <p className="text-sm text-muted-foreground">{channel.handle}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">{channel.subscribers}</p>
                  <p className="text-sm text-muted-foreground">{dict.home.content.subscribers}</p>
                </div>
                {channel.viewCount && (
                  <div>
                    <p className="text-2xl font-bold text-foreground">{channel.viewCount}</p>
                    <p className="text-sm text-muted-foreground">Views</p>
                  </div>
                )}
                {channel.videoCount && (
                  <div>
                    <p className="text-2xl font-bold text-foreground">{channel.videoCount}</p>
                    <p className="text-sm text-muted-foreground">Videos</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Content Topics */}
        {topics.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Content Topics</h4>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <Badge key={index} variant="secondary" data-chip>
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Visit Channel Button */}
        {channels.length > 0 && (
          <Button 
            className="w-full" 
            onClick={() => handleVisitChannel(channels[0].url)}
          >
            Visit Channel
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

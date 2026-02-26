"use client";

import { YouTubeChannel } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Youtube } from 'lucide-react';
import { Dictionary } from '@/lib/i18n/get-dictionary';

interface YouTubeChannelInfoProps {
  channels: YouTubeChannel[];
  topics: string[];
  dict: Dictionary;
}

export function YouTubeChannelInfo({ channels, topics, dict }: YouTubeChannelInfoProps) {
  const handleVisitChannel = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
              <p className="text-2xl font-bold text-foreground">
                {channel.subscribers} <span className="text-sm font-normal text-muted-foreground">{dict.home.content.subscribers}</span>
              </p>
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

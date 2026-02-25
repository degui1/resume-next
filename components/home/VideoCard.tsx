"use client";

import { Video } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const handleClick = () => {
    window.open(video.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
      onClick={handleClick}
      data-video-card
    >
      <CardContent className="p-0">
        {/* Thumbnail with 16:9 aspect ratio */}
        <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Title */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2">
            {video.title}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}

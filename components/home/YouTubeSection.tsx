import { Suspense } from 'react';
import { VideoCard } from '@/components/home/VideoCard';
import { YouTubeChannelInfo } from '@/components/home/YouTubeChannelInfo';
import { YouTubeErrorState } from '@/components/youtube/YouTubeErrorState';
import { getYouTubeVideos } from '@/app/actions/youtube';
import { Dictionary } from '@/lib/i18n/get-dictionary';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface YouTubeSectionProps {
  contentTopics: string[];
  dict: Dictionary;
  locale?: string;
}

function YouTubeLoadingFallback() {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading YouTube content...</p>
        </div>
      </CardContent>
    </Card>
  );
}

async function YouTubeContent({ dict, locale }: { dict: Dictionary; locale?: string }) {
  try {
    const youtubeVideosResult = await getYouTubeVideos(3, locale);

    if (youtubeVideosResult.source === 'error' && youtubeVideosResult.error) {
      return (
        <YouTubeErrorState 
          errorType={youtubeVideosResult.error.type}
          message={youtubeVideosResult.error.message}
        />
      );
    }

    if (!youtubeVideosResult.data || youtubeVideosResult.data.length === 0) {
      return <p className="text-muted-foreground">No videos available at the moment.</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {youtubeVideosResult.data.map((video) => (
          <VideoCard key={video.id} video={video} dict={dict} />
        ))}
      </div>
    );
  } catch (error) {
    // Catch any unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return (
      <YouTubeErrorState 
        errorType="network"
        message={errorMessage}
      />
    );
  }
}

export function YouTubeSection({ contentTopics, dict, locale }: YouTubeSectionProps) {
  return (
    <>
      {/* Featured Videos Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{dict.home.content.featuredVideos}</h3>
        
        <Suspense fallback={<YouTubeLoadingFallback />}>
          <YouTubeContent dict={dict} locale={locale} />
        </Suspense>
      </div>

      {/* YouTube Channel Info */}
      <div className="mt-12">
        <YouTubeChannelInfo 
          topics={contentTopics}
          dict={dict}
          locale={locale}
          />
      </div>
    </>
  );
}

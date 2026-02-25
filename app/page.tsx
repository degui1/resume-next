import { HeroSection } from '@/components/home/HeroSection';
import { VideoCard } from '@/components/home/VideoCard';
import { YouTubeChannelInfo } from '@/components/home/YouTubeChannelInfo';
import { 
  profile, 
  highlights, 
  statistics, 
  videos, 
  youtubeChannels, 
  contentTopics 
} from '@/lib/data/mockData';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <HeroSection 
          profile={profile}
          highlights={highlights}
          statistics={statistics}
        />
      </section>

      {/* YouTube Section */}
      <section className="bg-muted/30 py-12 sm:py-16">
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">My Content Creation Journey</h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              I create educational content about software development, algorithms, and career growth in tech. 
              My goal is to make complex topics accessible and help developers level up their skills.
            </p>
          </div>

          {/* Featured Videos Grid */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Featured Videos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>

          {/* YouTube Channel Info */}
          <div className="mt-12">
            <YouTubeChannelInfo 
              channels={youtubeChannels}
              topics={contentTopics}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

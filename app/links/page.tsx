"use client";

import { 
  githubProjects, 
  linkedinPosts, 
  socialLinks, 
  videos,
  youtubeChannels 
} from '@/lib/data/mockData';
import { ProjectCard, LinkedInPostCard, LinkCard } from '@/components/links';
import { VideoCard } from '@/components/home/VideoCard';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function LinksPage() {
  // Get most viewed videos (sorted by views)
  const mostViewedVideos = [...videos]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 2);

  // Get GitHub profile link
  const githubProfileLink = socialLinks.find(link => link.platform === 'GitHub')?.url || '#';
  
  // Get LinkedIn profile link
  const linkedinProfileLink = socialLinks.find(link => link.platform === 'LinkedIn')?.url || '#';
  
  // Get YouTube channel link
  const youtubeChannelLink = youtubeChannels[0]?.url || '#';
  
  // Get other social links (excluding GitHub, LinkedIn, YouTube)
  const otherSocialLinks = socialLinks.filter(
    link => !['GitHub', 'LinkedIn', 'YouTube'].includes(link.platform)
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Links
          </h1>
          <p className="text-muted-foreground">
            Connect with me across platforms
          </p>
        </div>

        {/* GitHub Projects Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              GitHub Projects
            </h2>
            <p className="text-muted-foreground">
              Featured open source projects and repositories
            </p>
          </div>
          
          <div className="grid gap-4 sm:gap-6">
            {githubProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => window.open(githubProfileLink, '_blank', 'noopener,noreferrer')}
              className="gap-2"
            >
              View GitHub Profile
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* LinkedIn Activity Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              LinkedIn Activity
            </h2>
            <p className="text-muted-foreground">
              Recent posts and professional updates
            </p>
          </div>
          
          <div className="grid gap-4 sm:gap-6">
            {linkedinPosts.map((post) => (
              <LinkedInPostCard key={post.id} post={post} />
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => window.open(linkedinProfileLink, '_blank', 'noopener,noreferrer')}
              className="gap-2"
            >
              View LinkedIn Profile
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Other Social Links Section */}
        {otherSocialLinks.length > 0 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Social Media
              </h2>
              <p className="text-muted-foreground">
                Find me on other platforms
              </p>
            </div>
            
            <div className="grid gap-4 sm:gap-6">
              {otherSocialLinks.map((link) => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>
          </section>
        )}

        {/* Most Viewed YouTube Videos Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Most Viewed Videos
            </h2>
            <p className="text-muted-foreground">
              Popular content from my YouTube channel
            </p>
          </div>
          
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {mostViewedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => window.open(youtubeChannelLink, '_blank', 'noopener,noreferrer')}
              className="gap-2"
            >
              Visit YouTube Channel
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

import { HeroSection } from '@/components/home/HeroSection';
import { VideoCard } from '@/components/home/VideoCard';
import { YouTubeChannelInfo } from '@/components/home/YouTubeChannelInfo';
import { YouTubeErrorState } from '@/components/youtube/YouTubeErrorState';
import { Timeline } from '@/components/home/Timeline';
import { SkillsCarousel } from '@/components/home/SkillsCarousel';
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { GetInTouch } from '@/components/home/GetInTouch';
import { 
  profile, 
  highlights, 
  statistics, 
  contentTopics,
  jobs,
  socialLinks,
} from '@/lib/data/mockData';
import { skills } from '@/lib/data/skills';
import { testimonials } from '@/lib/data/testimonials';
import { Locale } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getGitHubProjects } from '@/app/actions/github';
import { getYouTubeVideos } from '@/app/actions/youtube';

interface HomeProps {
  params: Promise<{ lang: Locale }>
}

export default async function Home({
  params,
}: HomeProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // Fetch GitHub projects using the server action
  const githubResult = await getGitHubProjects();

  // Fetch YouTube videos using the server action
  const youtubeVideosResult = await getYouTubeVideos(6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="container mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <HeroSection 
          profile={profile}
          highlights={highlights}
          statistics={statistics}
          dict={dict}
        />
      </section>

      {/* YouTube Section */}
      <section id="content" className="bg-muted/30 py-12 sm:py-16">
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">{dict.home.content.title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {dict.home.content.description}
            </p>
          </div>

          {/* Featured Videos Grid */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{dict.home.content.featuredVideos}</h3>
            
            {youtubeVideosResult.source === 'error' && youtubeVideosResult.error ? (
              <YouTubeErrorState 
                errorType={youtubeVideosResult.error.type}
                message={youtubeVideosResult.error.message}
              />
            ) : youtubeVideosResult.data && youtubeVideosResult.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {youtubeVideosResult.data.map((video) => (
                  <VideoCard key={video.id} video={video} dict={dict} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No videos available at the moment.</p>
            )}
          </div>

          {/* YouTube Channel Info */}
          <div className="mt-12">
            <YouTubeChannelInfo 
              topics={contentTopics}
              dict={dict}
            />
          </div>
        </div>
      </section>

      {/* Experience Timeline Section */}
      <section id="experience" className="py-12 sm:py-16">
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">{dict.home.experience.title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {dict.home.experience.description}
            </p>
          </div>
          <Timeline jobs={jobs} dict={dict} />
        </div>
      </section>

      {/* Skills Carousel Section */}
      <section id="skills" className="bg-muted/30 py-12 sm:py-16">
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">{dict.home.skills.title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {dict.home.skills.description}
            </p>
          </div>
          <SkillsCarousel skills={skills} />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-12 sm:py-16">
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <ProjectsSection 
            projects={githubResult.data} 
            dict={dict}
            locale={lang}
            source={githubResult.source}
            error={githubResult.error}
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-muted/30 py-12 sm:py-16">
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">{dict.home.testimonials.title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {dict.home.testimonials.description}
            </p>
          </div>
          <TestimonialsCarousel testimonials={testimonials} dict={dict} />
        </div>
      </section>

      {/* Get in Touch Section */}
      <section id="contact" className="py-12 sm:py-16">
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <GetInTouch 
            dict={dict}
            githubUrl={socialLinks.find(link => link.platform === 'GitHub')?.url}
            linkedinUrl={socialLinks.find(link => link.platform === 'LinkedIn')?.url}
            contactEmail={profile.email}
            lang={lang}
          />
        </div>
      </section>
    </div>
  );
}

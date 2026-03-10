import { HeroSection } from '@/components/home/HeroSection';
import { YouTubeSection } from '@/components/home/YouTubeSection';
import { GitHubProjectsSection } from '@/components/home/GitHubProjectsSection';
import { Timeline } from '@/components/home/Timeline';
import { SkillsCarousel } from '@/components/home/SkillsCarousel';
import { GetInTouch } from '@/components/home/GetInTouch';
import { UnderConstruction } from '@/components/common/UnderConstruction';
import { 
  profile, 
  contentTopics,
  socialLinks,
} from '@/lib/data/mockData';
import { skills } from '@/lib/data/skills';
import { Locale } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n/get-dictionary';

interface HomeProps {
  params: Promise<{ lang: Locale }>
}

export default async function Home({
  params,
}: HomeProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="container mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <HeroSection 
          dict={dict}
          profileImage={profile.profileImage}
          email={profile.email}
          lang={lang}
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
          <YouTubeSection contentTopics={contentTopics} dict={dict} locale={lang} />
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
          <Timeline jobs={dict.about.jobs} dict={dict} />
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
          <GitHubProjectsSection dict={dict} locale={lang} />
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
          {/* <TestimonialsCarousel testimonials={testimonials} dict={dict} /> */}
          <UnderConstruction dict={dict} />
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

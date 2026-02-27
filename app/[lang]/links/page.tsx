import { LinkCard, ProjectCard, LinkedInPostCard } from '@/components/links';
import { socialLinks, githubProjects, linkedinPosts } from '@/lib/data/mockData';
import { Locale } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n/get-dictionary';

interface LinksProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Links({
  params,
}: LinksProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen">
      <section className="container mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{dict.links.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {dict.links.description}
          </p>
        </div>

        {/* Projects Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{dict.links.projects}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {githubProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{dict.links.social}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialLinks.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        </div>

        {/* LinkedIn Posts Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">{dict.links.posts}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {linkedinPosts.map((post) => (
              <LinkedInPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

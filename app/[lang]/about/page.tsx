import { JobSection } from '@/components/about/JobSection';
import { ThesisSection } from '@/components/about/ThesisSection';
import { Locale } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n/get-dictionary';

interface AboutProps {
  params: Promise<{ lang: Locale }>;
}

export default async function About({
  params,
}: AboutProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="container mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{dict.about.title}</h1>
          <p className="text-lg text-muted-foreground text-justify">
            {dict.about.description}
          </p>
        </div>

        {/* Job History Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{dict.about.experience.title}</h2>
          <div className="space-y-6">
            {dict.about.jobs.map((job) => (
              <JobSection key={job.id} job={job} dict={dict} />
            ))}
          </div>
        </div>

        {/* Thesis Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">{dict.about.research.title}</h2>
          <ThesisSection thesis={dict.about.thesis} dict={dict} />
        </div>
      </section>
    </div>
  );
}

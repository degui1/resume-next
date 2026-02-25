import { JobSection } from '@/components/about/JobSection';
import { ThesisSection } from '@/components/about/ThesisSection';
import { jobs, thesis } from '@/lib/data/mockData';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="container mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">About</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            My professional journey and academic background in software development.
          </p>
        </div>

        {/* Job History Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Professional Experience</h2>
          <div className="space-y-6">
            {jobs.map((job) => (
              <JobSection key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Thesis Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Academic Research</h2>
          <ThesisSection thesis={thesis} />
        </div>
      </section>
    </div>
  );
}

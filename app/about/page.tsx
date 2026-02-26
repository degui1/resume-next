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
            Over 3+ years at Apdata, I've contributed to the global-antares platform focusing on modernizing the cloud platform, time tracking systems, and OCR document processing. My work spans frontend development (React, TypeScript), infrastructure improvements, and complex business logic implementation (Delphi, C#) for HR and workforce management systems.
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

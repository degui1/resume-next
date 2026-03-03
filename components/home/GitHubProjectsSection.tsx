import { Suspense } from 'react';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { GitHubErrorState } from '@/components/github/GitHubErrorState';
import { getGitHubProjects } from '@/app/actions/github';
import { Dictionary } from '@/lib/i18n/get-dictionary';
import { Locale } from '@/lib/i18n/locales';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface GitHubProjectsSectionProps {
  dict: Dictionary;
  locale: Locale;
}

function GitHubLoadingFallback() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-3xl font-bold">Projects</h2>
      </div>
      <Card>
        <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading GitHub projects...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function GitHubProjectsContent({ dict, locale }: GitHubProjectsSectionProps) {
  try {
    const githubResult = await getGitHubProjects();

    // If there's a critical error and no data, show error state
    if (githubResult.error && githubResult.data.length === 0) {
      return (
        <div>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-3xl font-bold">{dict.home.projects.title}</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {dict.home.projects.description}
            </p>
          </div>
          <GitHubErrorState message={githubResult.error} />
        </div>
      );
    }

    return (
      <ProjectsSection 
        projects={githubResult.data} 
        dict={dict}
        locale={locale}
        source={githubResult.source}
        error={githubResult.error}
      />
    );
  } catch (error) {
    // Catch any unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return (
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-3xl font-bold">{dict.home.projects.title}</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {dict.home.projects.description}
          </p>
        </div>
        <GitHubErrorState message={errorMessage} />
      </div>
    );
  }
}

export function GitHubProjectsSection({ dict, locale }: GitHubProjectsSectionProps) {
  return (
    <section id="projects" className="py-12 sm:py-16">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<GitHubLoadingFallback />}>
          <GitHubProjectsContent dict={dict} locale={locale} />
        </Suspense>
      </div>
    </section>
  );
}

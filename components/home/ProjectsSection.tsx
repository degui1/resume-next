import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Star, ExternalLink, AlertCircle, GitFork, Code } from 'lucide-react';
import { GitHubProject } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatLargeNumber, formatDate } from '@/lib/github/formatters';
import { Locale } from '@/lib/i18n/locales';

interface ProjectsSectionProps {
  projects: GitHubProject[];
  dict: {
    home: {
      projects: {
        title: string;
        description: string;
        viewProject: string;
        stars: string;
        forks: string;
        language: string;
        lastUpdated: string;
      };
    };
  };
  locale: Locale;
  source?: 'api' | 'cache' | 'fallback';
  error?: string;
}

export function ProjectsSection({ projects, dict, locale, source, error }: ProjectsSectionProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasError = error && projects.length === 0;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-bold">{dict.home.projects.title}</h2>
          {isDevelopment && source && (
            <Badge 
              variant={source === 'api' ? 'default' : source === 'cache' ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {source.toUpperCase()}
            </Badge>
          )}
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {dict.home.projects.description}
        </p>
      </div>

      {hasError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading projects</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Github className="h-8 w-8 text-foreground" />
                <div className="flex items-center gap-3">
                  {project.stars > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{formatLargeNumber(project.stars)}</span>
                    </div>
                  )}
                  {project.forks > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <GitFork className="h-4 w-4" />
                      <span>{formatLargeNumber(project.forks)}</span>
                    </div>
                  )}
                </div>
              </div>
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow space-y-3">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                {project.language && (
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span>{project.language}</span>
                  </div>
                )}
                {project.updatedAt && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs">
                      {dict.home.projects.lastUpdated}: {formatDate(project.updatedAt, locale)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Link href={project.url} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full" variant="default">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {dict.home.projects.viewProject}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

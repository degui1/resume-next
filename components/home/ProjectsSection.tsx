import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Star, ExternalLink } from 'lucide-react';
import { GitHubProject } from '@/lib/types';

interface ProjectsSectionProps {
  projects: GitHubProject[];
  dict: {
    home: {
      projects: {
        title: string;
        description: string;
        viewProject: string;
        stars: string;
      };
    };
  };
}

export function ProjectsSection({ projects, dict }: ProjectsSectionProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">{dict.home.projects.title}</h2>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {dict.home.projects.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Github className="h-8 w-8 text-foreground" />
                {project.stars && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{project.stars}</span>
                  </div>
                )}
              </div>
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
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

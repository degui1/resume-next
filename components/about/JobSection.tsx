import { Job } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dictionary } from '@/lib/i18n/get-dictionary';

interface JobSectionProps {
  job: Job;
  dict: Dictionary;
}

export function JobSection({ job, dict }: JobSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-xl">{job.role}</CardTitle>
            <p className="text-muted-foreground mt-1">{job.company}</p>
          </div>
          <p className="text-sm text-muted-foreground">{job.period}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Features Section */}
        {job.features && job.features.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">{dict.about.experience.keyFeatures}</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {job.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Contributions Section */}
        {job.contributions && job.contributions.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">{dict.about.experience.mainContributions}</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {job.contributions.map((contribution, index) => (
                <li key={index}>{contribution}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies Section */}
        {job.technologies && job.technologies.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">{dict.about.experience.technologies}</h4>
            <div className="flex flex-wrap gap-2">
              {job.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

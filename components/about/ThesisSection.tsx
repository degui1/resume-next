import { Thesis } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface ThesisSectionProps {
  thesis: Thesis;
}

export function ThesisSection({ thesis }: ThesisSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          {thesis.title}
          {thesis.link && (
            <a
              href={thesis.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View thesis document"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <h4 className="font-semibold mb-2">Description</h4>
          <p className="text-muted-foreground">{thesis.description}</p>
        </div>

        {/* Technologies */}
        {thesis.technologies && thesis.technologies.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {thesis.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {thesis.results && thesis.results.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Results</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {thesis.results.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

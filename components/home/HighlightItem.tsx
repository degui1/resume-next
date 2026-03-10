import { Highlight } from '@/lib/types';
import * as Icons from 'lucide-react';

interface HighlightItemProps {
  highlight: Highlight;
}

export function HighlightItem({ highlight }: HighlightItemProps) {
  // Map icon string to lucide-react icon component
  const iconMap: Record<string, keyof typeof Icons> = {
    briefcase: 'Briefcase',
    GraduationCap: 'GraduationCap',
  };

  const IconComponent = Icons[iconMap[highlight.icon] || 'Circle'] as React.ComponentType<{ className?: string }>;

  return (
    <div className="flex items-center gap-3">
      <IconComponent className="h-5 w-5 text-muted-foreground flex-shrink-0" data-icon={highlight.icon} />
      <span className="text-foreground">{highlight.text}</span>
    </div>
  );
}

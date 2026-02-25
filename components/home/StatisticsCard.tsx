import { Statistic } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import * as Icons from 'lucide-react';

interface StatisticsCardProps {
  statistic: Statistic;
}

export function StatisticsCard({ statistic }: StatisticsCardProps) {
  // Map icon string to lucide-react icon component
  const iconMap: Record<string, keyof typeof Icons> = {
    youtube: 'Youtube',
    calendar: 'Calendar',
    'graduation-cap': 'GraduationCap',
    'map-pin': 'MapPin',
  };

  const IconComponent = Icons[iconMap[statistic.icon] || 'Circle'] as React.ComponentType<{ className?: string }>;

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <IconComponent className="h-8 w-8 text-muted-foreground" />
          <div className="text-3xl font-bold">{statistic.value}</div>
          <div className="text-sm text-muted-foreground">{statistic.label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

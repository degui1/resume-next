import { Construction } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface UnderConstructionProps {
  dict: {
    common: {
      underConstruction: {
        title: string;
        description: string;
      };
    };
  };
}

export function UnderConstruction({ dict }: UnderConstructionProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <Construction className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-bold mb-2">{dict.common.underConstruction.title}</h3>
        <p className="text-muted-foreground max-w-md">
          {dict.common.underConstruction.description}
        </p>
      </CardContent>
    </Card>
  );
}

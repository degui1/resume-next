import { SocialLink } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Github, Linkedin, Youtube, Twitter, Mail, Globe } from 'lucide-react';

interface LinkCardProps {
  link: SocialLink;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
  mail: Mail,
  globe: Globe,
};

export function LinkCard({ link }: LinkCardProps) {
  const IconComponent = iconMap[link.icon.toLowerCase()] || Globe;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-all duration-200 hover:scale-[1.02]"
    >
      <Card className="p-6 hover:shadow-lg hover:bg-accent transition-all duration-200">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <IconComponent className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground">
              {link.platform}
            </h3>
            {link.username && (
              <p className="text-sm text-muted-foreground truncate">
                {link.username}
              </p>
            )}
          </div>
        </div>
      </Card>
    </a>
  );
}

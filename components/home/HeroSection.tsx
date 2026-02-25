import { Profile, Highlight, Statistic } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HighlightItem } from './HighlightItem';
import { StatisticsCard } from './StatisticsCard';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface HeroSectionProps {
  profile: Profile;
  highlights: Highlight[];
  statistics: Statistic[];
}

export function HeroSection({ profile, highlights, statistics }: HeroSectionProps) {
  return (
    <section className="py-12 sm:py-16" data-section="hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Profile Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden">
                <Image
                  src={profile.profileImage}
                  alt={`${profile.name} profile picture`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {profile.availability && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="secondary" className="px-4 py-2 text-sm shadow-md">
                    {profile.availability}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Profile Information */}
          <div className="space-y-6">
            {/* Name and Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                {profile.name}
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-3">
                {profile.title}
              </p>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
                <span>•</span>
                <span>{profile.role}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-foreground leading-relaxed">
              {profile.description}
            </p>

            {/* Highlights */}
            <div className="space-y-3">
              {highlights.map((highlight) => (
                <HighlightItem key={highlight.id} highlight={highlight} />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg">Ver Cursos</Button>
              <Button size="lg" variant="outline">Ler Blog</Button>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {statistics.map((statistic) => (
            <StatisticsCard key={statistic.id} statistic={statistic} />
          ))}
        </div>
      </div>
    </section>
  );
}

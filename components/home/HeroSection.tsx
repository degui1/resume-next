import { Dictionary } from '@/lib/i18n/get-dictionary';
import { Locale } from '@/lib/i18n/locales';
import { Button } from '@/components/ui/button';
import { HighlightItem } from './HighlightItem';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  dict: Dictionary;
  profileImage: string;
  email?: string;
  lang: Locale;
}

export function HeroSection({ dict, profileImage, email, lang }: HeroSectionProps) {
  const profile = dict.home.hero.profile;
  const highlights = dict.home.hero.highlights;

  return (
    <section className="py-12 sm:py-16" data-section="hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Profile Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden m-auto">
                <Image
                  src={profileImage}
                  alt={`${profile.name} profile picture`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
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
              <Link href={`/${lang}/links`} className="w-full">
                <Button size="lg" className="w-full">
                  {dict.home.hero.linkButton}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

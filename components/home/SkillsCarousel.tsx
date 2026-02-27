'use client';

import Image from "next/image";

interface Skill {
  name: string;
  icon: string;
}

interface SkillsCarouselProps {
  skills: Skill[];
}

export function SkillsCarousel({ skills }: SkillsCarouselProps) {
  // Duplicate skills for seamless infinite scroll
  const duplicatedSkills = [...skills, ...skills, ...skills, ...skills];

  return (
    <div className="relative overflow-hidden py-8">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      {/* Scrolling container */}
      <div className="flex animate-scroll">
        {duplicatedSkills.map((skill, index) => (
          <div
            key={`${skill.name}-${index}`}
            className="flex-shrink-0 mx-6 flex flex-col items-center justify-center group"
          >
            <div className="w-20 h-20 flex items-center justify-center bg-card border rounded-lg p-4 transition-all group-hover:scale-110 group-hover:shadow-lg">
              <Image
                src={skill.icon}
                alt={skill.name}
                className="w-full h-full object-contain"
                width={80}
                height={80}
              />
            </div>
            <span className="mt-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

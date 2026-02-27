'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Linkedin } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image?: string;
  text: string;
  linkedinUrl?: string;
  date?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  dict: any;
}

export function TestimonialsCarousel({ testimonials, dict }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main testimonial card */}
      <div className="bg-card border rounded-lg p-8 md:p-12 shadow-sm">
        {/* Quote icon */}
        <Quote className="w-12 h-12 text-primary/20 mb-6" />
        
        {/* Testimonial text */}
        <blockquote className="text-lg md:text-xl leading-relaxed mb-8 text-foreground">
          &quot;{currentTestimonial.text}&quot;
        </blockquote>
        
        {/* Author info */}
        <div className="flex items-center gap-4">
          {currentTestimonial.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentTestimonial.image}
              alt={currentTestimonial.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
              <span className="text-xl font-semibold text-primary">
                {currentTestimonial.name.charAt(0)}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-lg">{currentTestimonial.name}</h4>
              {currentTestimonial.linkedinUrl && (
                <a
                  href={currentTestimonial.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0A66C2] hover:text-[#004182] transition-colors"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
            <p className="text-muted-foreground">{currentTestimonial.role}</p>
            <p className="text-sm text-muted-foreground">{currentTestimonial.company}</p>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={goToPrevious}
          className="w-10 h-10 rounded-full border bg-card hover:bg-muted transition-colors flex items-center justify-center"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* Dots indicator */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        
        <button
          onClick={goToNext}
          className="w-10 h-10 rounded-full border bg-card hover:bg-muted transition-colors flex items-center justify-center"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Counter */}
      <div className="text-center mt-4 text-sm text-muted-foreground">
        {currentIndex + 1} / {testimonials.length}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, ArrowRight } from 'lucide-react';

interface GetInTouchProps {
  dict: {
    home: {
      contact: {
        title: string;
        subtitle: string;
        findMe: string;
        emailPlaceholder: string;
        submitButton: string;
        orButton: string;
        moreDetails: string;
      };
    };
  };
  githubUrl?: string;
  linkedinUrl?: string;
  contactEmail?: string;
  lang: string;
}

export function GetInTouch({ dict, githubUrl, linkedinUrl, contactEmail = 'your-email@example.com', lang }: GetInTouchProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link with the email
    const subject = encodeURIComponent('Get in Touch');
    const body = encodeURIComponent(`Hi, I would like to get in touch.\n\nFrom: ${email}`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{dict.home.contact.title}</h2>
        <p className="text-muted-foreground">{dict.home.contact.subtitle}</p>
      </div>

      {/* Social Links */}
      <div className="mb-8">
        <p className="text-center text-sm text-muted-foreground mb-4">
          {dict.home.contact.findMe}
        </p>
        <div className="flex justify-center gap-4">
          {githubUrl && (
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-16 h-16 rounded-xl bg-black hover:bg-black/80 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-8 h-8 text-white" />
            </Link>
          )}
          <Link
            href={`mailto:${contactEmail}`}
            className="flex items-center justify-center w-16 h-16 rounded-xl bg-red-600 hover:bg-red-700 transition-colors"
            aria-label="Email"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </Link>
          {linkedinUrl && (
            <Link
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-16 h-16 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-8 h-8 text-white" />
            </Link>
          )}
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.home.contact.emailPlaceholder}
            required
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {dict.home.contact.moreDetails}
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base"
        >
          {dict.home.contact.submitButton}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">{dict.home.contact.orButton}</p>
          <Link href={`/${lang}/links`}>
            <Button variant="outline" className="w-full" type="button">
              {dict.home.contact.moreDetails}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

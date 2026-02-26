'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Locale } from '@/lib/i18n/locales';
import { Dictionary } from '@/lib/i18n/get-dictionary';

interface NavigationProps {
  lang: Locale;
  dict: Dictionary;
}

export function Navigation({ lang, dict }: NavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: `/${lang}`, label: dict.navigation.home },
    { href: `/${lang}/about`, label: dict.navigation.about },
    { href: `/${lang}/links`, label: dict.navigation.links },
  ];

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'pt' : 'en';
    const pathWithoutLang = pathname.replace(`/${lang}`, '');
    window.location.href = `/${newLang}${pathWithoutLang}`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold text-foreground hover:opacity-80 transition-opacity">
          Portfolio
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-foreground/80 min-h-[44px] flex items-center ${
                  isActive
                    ? 'text-foreground border-b-2 border-foreground pb-1'
                    : 'text-foreground/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground/80 transition-colors min-h-[44px]"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
            {lang.toUpperCase()}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground hover:text-foreground/80 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 text-base font-medium transition-colors hover:bg-accent rounded-md min-h-[44px] flex items-center ${
                    isActive
                      ? 'text-foreground bg-accent'
                      : 'text-foreground/60'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center gap-2 px-4 py-3 text-base font-medium text-foreground/60 hover:bg-accent rounded-md min-h-[44px] transition-colors"
            >
              <Globe className="h-5 w-5" />
              {lang === 'en' ? 'Português' : 'English'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

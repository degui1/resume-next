'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Locale } from '@/lib/i18n/locales';
import { Dictionary } from '@/lib/i18n/get-dictionary';

interface NavigationProps {
  lang: Locale;
  dict: Dictionary;
}

export function Navigation({ lang, dict }: NavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: `/${lang}`, label: dict.navigation.home, hasSubmenu: true },
    { href: `/${lang}/about`, label: dict.navigation.about },
    { href: `/${lang}/links`, label: dict.navigation.links },
  ];

  const homeSections = [
    { id: 'hero', label: dict.navigation.sections.hero },
    { id: 'content', label: dict.navigation.sections.content },
    { id: 'experience', label: dict.navigation.sections.experience },
    { id: 'skills', label: dict.navigation.sections.skills },
    { id: 'testimonials', label: dict.navigation.sections.testimonials },
    { id: 'contact', label: dict.navigation.sections.contact },
  ];

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'pt' : 'en';
    const pathWithoutLang = pathname.replace(`/${lang}`, '');
    window.location.href = `/${newLang}${pathWithoutLang}`;
  };

  const handleSectionClick = (sectionId: string) => {
    setHomeDropdownOpen(false);
    setMobileMenuOpen(false);
    
    // If not on home page, navigate to home first
    if (pathname !== `/${lang}`) {
      window.location.href = `/${lang}#${sectionId}`;
    } else {
      // Smooth scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHomeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            
            if (link.hasSubmenu) {
              return (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setHomeDropdownOpen(!homeDropdownOpen)}
                    className={`text-sm font-medium transition-colors hover:text-foreground/80 min-h-[44px] flex items-center gap-1 ${
                      isActive
                        ? 'text-foreground border-b-2 border-foreground pb-1'
                        : 'text-foreground/60'
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${homeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {homeDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-2 z-50">
                      {homeSections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => handleSectionClick(section.id)}
                          className="w-full text-left px-4 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-foreground transition-colors"
                        >
                          {section.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            
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
              
              if (link.hasSubmenu) {
                return (
                  <div key={link.href}>
                    <button
                      onClick={() => setHomeDropdownOpen(!homeDropdownOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-base font-medium transition-colors hover:bg-accent rounded-md min-h-[44px] ${
                        isActive
                          ? 'text-foreground bg-accent'
                          : 'text-foreground/60'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`h-5 w-5 transition-transform ${homeDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {homeDropdownOpen && (
                      <div className="ml-4 mt-2 space-y-1">
                        {homeSections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => handleSectionClick(section.id)}
                            className="w-full text-left px-4 py-2 text-sm text-foreground/70 hover:bg-accent hover:text-foreground rounded-md transition-colors"
                          >
                            {section.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              
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

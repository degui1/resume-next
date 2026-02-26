import { Locale } from '@/lib/i18n/locales';
import { Dictionary } from '@/lib/i18n/get-dictionary';

interface FooterProps {
  lang: Locale;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          © {currentYear} Personal Portfolio. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}

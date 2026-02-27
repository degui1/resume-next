'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { hasLocale, defaultLocale, type Locale } from '@/lib/i18n/locales'

// Translations embedded in the component
const translations = {
  en: {
    title: '404',
    heading: 'Page Not Found',
    description: "The page you're looking for doesn't exist or has been moved.",
    backButton: 'Go back home'
  },
  pt: {
    title: '404',
    heading: 'Página Não Encontrada',
    description: 'A página que você está procurando não existe ou foi movida.',
    backButton: 'Voltar para o início'
  }
} as const;

export default function NotFound() {
  const pathname = usePathname();
  
  // Extract language from pathname (e.g., /en/... or /pt/...)
  const pathSegments = pathname?.split('/').filter(Boolean) || [];
  const langFromPath = pathSegments[0];
  const lang: Locale = hasLocale(langFromPath) ? langFromPath : defaultLocale;
  
  const dict = translations[lang];

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
        {dict.title}
      </h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
        {dict.heading}
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {dict.description}
      </p>
      <Button asChild className="mt-6">
        <Link href={`/${lang}`}>{dict.backButton}</Link>
      </Button>
    </div>
  )
}

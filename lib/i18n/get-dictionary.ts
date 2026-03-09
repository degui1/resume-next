import type { Locale } from './locales';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[['en', 'pt'].includes(locale) ? locale : 'en']();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

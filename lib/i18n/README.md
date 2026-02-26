# Internationalization (i18n) Implementation

This project uses Next.js App Router's built-in internationalization support with Portuguese (pt) and English (en) languages.

## Structure

```
lib/i18n/
├── dictionaries/
│   ├── en.json          # English translations
│   └── pt.json          # Portuguese translations
├── get-dictionary.ts    # Dictionary loader function
├── locales.ts          # Locale configuration
└── index.ts            # Public exports
```

## How It Works

### 1. Middleware (middleware.ts)
- Detects user's preferred language from Accept-Language header
- Redirects to locale-prefixed URLs (e.g., `/en/about`, `/pt/about`)
- Automatically handles locale routing

### 2. Dynamic Routes
All pages are nested under `app/[lang]/` to support dynamic locale parameter:
- `app/[lang]/page.tsx` - Home page
- `app/[lang]/about/page.tsx` - About page
- `app/[lang]/links/page.tsx` - Links page

### 3. Dictionary System
Translations are stored in JSON files and loaded server-side:

```typescript
import { getDictionary } from '@/lib/i18n/get-dictionary';

const dict = await getDictionary(lang);
console.log(dict.navigation.home); // "Home" or "Início"
```

### 4. Language Switcher
The Navigation component includes a language toggle button that switches between English and Portuguese.

## Adding New Translations

1. Add the key to both `en.json` and `pt.json`:

```json
// en.json
{
  "newSection": {
    "title": "New Section"
  }
}

// pt.json
{
  "newSection": {
    "title": "Nova Seção"
  }
}
```

2. Use in your component:

```typescript
export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return <h1>{dict.newSection.title}</h1>;
}
```

## Supported Locales

- `en` - English (default)
- `pt` - Portuguese

To add more locales, update `lib/i18n/locales.ts` and create corresponding dictionary files.

## Static Generation

The root layout uses `generateStaticParams()` to pre-render all locale versions at build time for optimal performance.

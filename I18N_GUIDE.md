# Internationalization Guide

## Overview

This Next.js application now supports internationalization (i18n) with English and Portuguese languages following the official Next.js App Router documentation patterns.

## Implementation Details

### 1. Middleware (Proxy)
**File:** `middleware.ts`

The middleware automatically:
- Detects the user's preferred language from the `Accept-Language` header
- Redirects users to locale-prefixed URLs (e.g., `/en/about`, `/pt/about`)
- Handles locale routing transparently

### 2. Localization Configuration
**File:** `lib/i18n/locales.ts`

Defines supported locales:
```typescript
export const locales = ['en', 'pt'] as const;
export const defaultLocale: Locale = 'en';
```

### 3. Dictionary System
**Files:** 
- `lib/i18n/dictionaries/en.json` - English translations
- `lib/i18n/dictionaries/pt.json` - Portuguese translations
- `lib/i18n/get-dictionary.ts` - Dictionary loader

All translations are stored in JSON files and loaded server-side for optimal performance.

### 4. Dynamic Route Structure
All pages are nested under `app/[lang]/`:
```
app/
└── [lang]/
    ├── layout.tsx
    ├── page.tsx
    ├── about/
    │   └── page.tsx
    └── links/
        └── page.tsx
```

## Usage Examples

### In Server Components (Pages/Layouts)

```typescript
import { Locale } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div>
      <h1>{dict.navigation.home}</h1>
      <p>{dict.home.hero.description}</p>
    </div>
  );
}
```

### In Client Components

Pass the dictionary as a prop from the parent server component:

```typescript
'use client';

import { Dictionary } from '@/lib/i18n/get-dictionary';

interface MyComponentProps {
  dict: Dictionary;
}

export function MyComponent({ dict }: MyComponentProps) {
  return <h1>{dict.navigation.home}</h1>;
}
```

### Language Switcher

The Navigation component includes a language toggle button that switches between locales by updating the URL.

## Adding New Translations

1. **Add to English dictionary** (`lib/i18n/dictionaries/en.json`):
```json
{
  "mySection": {
    "title": "My Title",
    "description": "My description"
  }
}
```

2. **Add to Portuguese dictionary** (`lib/i18n/dictionaries/pt.json`):
```json
{
  "mySection": {
    "title": "Meu Título",
    "description": "Minha descrição"
  }
}
```

3. **Use in your component**:
```typescript
const dict = await getDictionary(lang);
<h1>{dict.mySection.title}</h1>
```

## URL Structure

- English: `http://localhost:3000/en/about`
- Portuguese: `http://localhost:3000/pt/about`

When users visit the root URL (`/`), they are automatically redirected to their preferred language based on browser settings.

## Static Generation

The application uses `generateStaticParams()` in the root layout to pre-render all locale versions at build time:

```typescript
export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}
```

This ensures optimal performance with static HTML generation for all supported languages.

## Testing

1. **Test English version:**
   ```
   http://localhost:3000/en
   ```

2. **Test Portuguese version:**
   ```
   http://localhost:3000/pt
   ```

3. **Test automatic detection:**
   - Visit `http://localhost:3000/`
   - Change your browser's language preference
   - You'll be redirected to the appropriate locale

## Adding More Languages

To add a new language (e.g., Spanish):

1. Update `lib/i18n/locales.ts`:
```typescript
export const locales = ['en', 'pt', 'es'] as const;
```

2. Create `lib/i18n/dictionaries/es.json` with all translations

3. Update `lib/i18n/get-dictionary.ts`:
```typescript
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
};
```

4. Rebuild the application

## Benefits

✅ SEO-friendly with separate URLs for each language
✅ Server-side rendering with zero client-side JavaScript for translations
✅ Automatic language detection from browser settings
✅ Type-safe with TypeScript
✅ Static generation for optimal performance
✅ Easy to maintain with JSON dictionary files

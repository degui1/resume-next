# About Page Structure

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     About Page                               │
│                  (app/[lang]/about/page.tsx)                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Uses getDictionary(lang)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Dictionary System (i18n)                        │
│                                                              │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │   en.json            │    │   pt.json            │      │
│  │                      │    │                      │      │
│  │  about: {            │    │  about: {            │      │
│  │    jobs: [...]       │    │    jobs: [...]       │      │
│  │    thesis: {...}     │    │    thesis: {...}     │      │
│  │  }                   │    │  }                   │      │
│  └──────────────────────┘    └──────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Passes data to components
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Components                              │
│                                                              │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │   JobSection         │    │   ThesisSection      │      │
│  │   - Displays job     │    │   - Displays thesis  │      │
│  │   - Uses dict labels │    │   - Uses dict labels │      │
│  └──────────────────────┘    └──────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **User visits page** → `/en/about` or `/pt/about`
2. **Page loads** → `getDictionary(lang)` fetches appropriate dictionary
3. **Data extracted** → `dict.about.jobs` and `dict.about.thesis`
4. **Components render** → JobSection and ThesisSection receive translated data
5. **Labels translated** → Component labels use `dict.about.experience.*`

## Before vs After

### Before (Mock Data)
```typescript
// ❌ Hardcoded in mockData.ts
export const jobs: Job[] = [
  {
    id: "1",
    company: "Apdata do Brasil",
    role: "Software Developer",
    // ... hardcoded English only
  }
];

// ❌ Page imports mock data
import { jobs, thesis } from '@/lib/data/mockData';
```

### After (i18n System)
```typescript
// ✅ Stored in dictionary files (both languages)
// en.json
{
  "about": {
    "jobs": [
      {
        "id": "1",
        "company": "Apdata do Brasil",
        "role": "Software Developer",
        // ... English version
      }
    ]
  }
}

// pt.json
{
  "about": {
    "jobs": [
      {
        "id": "1",
        "company": "Apdata do Brasil",
        "role": "Desenvolvedor de Software",
        // ... Portuguese version
      }
    ]
  }
}

// ✅ Page uses dictionary
const dict = await getDictionary(lang);
dict.about.jobs.map((job) => <JobSection job={job} />)
```

## Key Improvements

### 1. Centralized Translations
All content in one place per language, following the existing i18n pattern.

### 2. Easy to Add New Jobs
Just add to both dictionary files - no code changes needed.

### 3. Type Safety
TypeScript ensures consistency between languages.

### 4. Consistent Pattern
Same approach used throughout the app (navigation, home, links, etc.).

### 5. No Mock Data Dependency
Real, production-ready content instead of mock data.

## Component Updates

### JobSection Component
```typescript
// Now uses translated labels
<h4>{dict.about.experience.keyFeatures}</h4>
<h4>{dict.about.experience.mainContributions}</h4>
<h4>{dict.about.experience.technologies}</h4>
```

### ThesisSection Component
```typescript
// Now uses translated labels
<h4>{dict.about.research.description}</h4>
<h4>{dict.about.experience.technologies}</h4>
<h4>{dict.about.research.results}</h4>
```

## Translation Keys

### Experience Section
- `about.experience.title` - "Professional Experience" / "Experiência Profissional"
- `about.experience.keyFeatures` - "Key Features" / "Principais Características"
- `about.experience.mainContributions` - "Main Contributions" / "Principais Contribuições"
- `about.experience.technologies` - "Technologies" / "Tecnologias"

### Research Section
- `about.research.title` - "Academic Research" / "Pesquisa Acadêmica"
- `about.research.description` - "Description" / "Descrição"
- `about.research.results` - "Results" / "Resultados"

## File Structure

```
lib/i18n/
├── dictionaries/
│   ├── en.json          ← Add jobs here (English)
│   └── pt.json          ← Add jobs here (Portuguese)
├── get-dictionary.ts
├── locales.ts
└── index.ts

app/[lang]/about/
└── page.tsx             ← Uses dict.about.jobs & dict.about.thesis

components/about/
├── JobSection.tsx       ← Renders individual job
└── ThesisSection.tsx    ← Renders thesis info

docs/
├── ABOUT_PAGE_I18N.md   ← How to add new jobs
└── ABOUT_PAGE_STRUCTURE.md ← This file
```

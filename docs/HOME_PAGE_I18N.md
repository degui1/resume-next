# Home Page Internationalization Guide

## Overview

The Home page Hero section now uses the i18n system for profile information and highlights. This makes it easy to maintain translations and update content without touching component code.

## Structure

All Hero section content is stored in the dictionary files under `home.hero`:
- `lib/i18n/dictionaries/en.json` - English translations
- `lib/i18n/dictionaries/pt.json` - Portuguese translations

## Profile Information

The profile data is stored in `home.hero.profile` and includes:

### English (`en.json`)
```json
{
  "home": {
    "hero": {
      "profile": {
        "name": "Guilherme Gonçalves",
        "title": "Full Stack Developer & Tech Educator",
        "description": "Building amazing web experiences with modern technologies and teaching others to do the same.",
        "location": "São Paulo, Brazil",
        "role": "Software Developer"
      }
    }
  }
}
```

### Portuguese (`pt.json`)
```json
{
  "home": {
    "hero": {
      "profile": {
        "name": "Guilherme Gonçalves",
        "title": "Desenvolvedor Full Stack & Educador em Tecnologia",
        "description": "Construindo experiências web incríveis com tecnologias modernas e ensinando outros a fazer o mesmo.",
        "location": "São Paulo, Brasil",
        "role": "Desenvolvedor de Software"
      }
    }
  }
}
```

## Highlights Section

Highlights are stored in `home.hero.highlights` as an array. Each highlight has:
- `id`: Unique identifier
- `icon`: Icon name (briefcase, users, award, globe, etc.)
- `text`: The highlight text

### Adding a New Highlight

To add a new highlight, add it to BOTH language files:

#### English (`en.json`)
```json
{
  "home": {
    "hero": {
      "highlights": [
        {
          "id": "5",
          "icon": "code",
          "text": "Open source contributor"
        }
      ]
    }
  }
}
```

#### Portuguese (`pt.json`)
```json
{
  "home": {
    "hero": {
      "highlights": [
        {
          "id": "5",
          "icon": "code",
          "text": "Contribuidor open source"
        }
      ]
    }
  }
}
```

### Available Icons

The HighlightItem component supports these Lucide React icons:
- `briefcase` - Briefcase icon
- `users` - Users icon
- `award` - Award icon
- `globe` - Globe icon
- Any other Lucide React icon name (lowercase)

To add more icons, update the `iconMap` in `components/home/HighlightItem.tsx`.

## Updating Profile Information

To update profile information, simply edit the `home.hero.profile` object in both dictionary files.

### Example: Updating Title

1. Open `lib/i18n/dictionaries/en.json`
2. Find `home.hero.profile.title`
3. Update the value:
```json
{
  "home": {
    "hero": {
      "profile": {
        "title": "Senior Full Stack Developer"
      }
    }
  }
}
```

4. Open `lib/i18n/dictionaries/pt.json`
5. Update the Portuguese version:
```json
{
  "home": {
    "hero": {
      "profile": {
        "title": "Desenvolvedor Full Stack Sênior"
      }
    }
  }
}
```

## Field Descriptions

### Profile Fields

- `name` (required): Full name
- `title` (required): Professional title/headline
- `description` (required): Brief professional description
- `location` (required): Location (city, country)
- `role` (required): Current role/position

### Highlight Fields

- `id` (required): Unique identifier (string)
- `icon` (required): Icon name from Lucide React
- `text` (required): Highlight text to display

## Benefits of This Approach

1. **Easy to maintain**: All translations in one place
2. **Type-safe**: TypeScript ensures consistency
3. **No code changes**: Updating content doesn't require modifying components
4. **Consistent pattern**: Follows the same i18n pattern used throughout the app
5. **No mock data**: Real, translatable content instead of hardcoded mocks

## What Still Uses Mock Data

The following items still use mock data from `lib/data/mockData.ts`:
- `profileImage`: Image path (not translatable)
- `email`: Contact email (not translatable)
- `socialLinks`: Social media links (not translatable)
- `contentTopics`: Content topics array (consider moving to i18n if needed)

These are passed separately to components as they don't require translation.

## Example: Complete Hero Section Update

Let's say you want to update your profile and add a new highlight:

### Step 1: Update Profile (English)
```json
{
  "home": {
    "hero": {
      "profile": {
        "name": "Guilherme Gonçalves",
        "title": "Lead Full Stack Developer",
        "description": "Passionate about building scalable web applications and mentoring developers.",
        "location": "São Paulo, Brazil",
        "role": "Tech Lead"
      }
    }
  }
}
```

### Step 2: Update Profile (Portuguese)
```json
{
  "home": {
    "hero": {
      "profile": {
        "name": "Guilherme Gonçalves",
        "title": "Desenvolvedor Full Stack Líder",
        "description": "Apaixonado por construir aplicações web escaláveis e mentorar desenvolvedores.",
        "location": "São Paulo, Brasil",
        "role": "Líder Técnico"
      }
    }
  }
}
```

### Step 3: Add New Highlight (English)
```json
{
  "home": {
    "hero": {
      "highlights": [
        {
          "id": "1",
          "icon": "briefcase",
          "text": "CTO at American startup"
        },
        {
          "id": "2",
          "icon": "users",
          "text": "Educator with 117k+ followers"
        },
        {
          "id": "3",
          "icon": "award",
          "text": "Course author with 50k+ students"
        },
        {
          "id": "4",
          "icon": "globe",
          "text": "Worked in 15+ countries"
        },
        {
          "id": "5",
          "icon": "code",
          "text": "500+ open source contributions"
        }
      ]
    }
  }
}
```

### Step 4: Add New Highlight (Portuguese)
```json
{
  "home": {
    "hero": {
      "highlights": [
        {
          "id": "1",
          "icon": "briefcase",
          "text": "CTO em startup americana"
        },
        {
          "id": "2",
          "icon": "users",
          "text": "Educador com 117k+ seguidores"
        },
        {
          "id": "3",
          "icon": "award",
          "text": "Autor de cursos com 50k+ alunos"
        },
        {
          "id": "4",
          "icon": "globe",
          "text": "Trabalhou em 15+ países"
        },
        {
          "id": "5",
          "icon": "code",
          "text": "500+ contribuições open source"
        }
      ]
    }
  }
}
```

That's it! The changes will automatically appear on the home page in both languages.

## Migration Summary

### Before (Mock Data)
```typescript
// ❌ Hardcoded in mockData.ts
export const profile: Profile = {
  name: "Guilherme Gonçalves",
  title: "Full Stack Developer & Tech Educator",
  // ... English only
};

export const highlights: Highlight[] = [
  { id: "1", icon: "briefcase", text: "CTO em startup americana" }
  // ... Portuguese only
];
```

### After (i18n System)
```typescript
// ✅ Stored in dictionary files (both languages)
// Components automatically use the correct language
const profile = dict.home.hero.profile;
const highlights = dict.home.hero.highlights;
```

## Related Documentation

- [About Page I18N Guide](./ABOUT_PAGE_I18N.md) - How to manage job experiences
- [I18N Guide](../I18N_GUIDE.md) - General internationalization guide
- [i18n README](../lib/i18n/README.md) - Technical i18n implementation details

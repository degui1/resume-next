# About Page Internationalization Guide

## Overview

The About page now uses the i18n system for all content, including job experiences and thesis information. This makes it easy to maintain translations and add new content.

## Structure

All About page content is stored in the dictionary files:
- `lib/i18n/dictionaries/en.json` - English translations
- `lib/i18n/dictionaries/pt.json` - Portuguese translations

## Adding a New Job Experience

To add a new job, you need to add it to BOTH language files in the same position in the array.

### Step 1: Add to English Dictionary (`en.json`)

Navigate to `lib/i18n/dictionaries/en.json` and add a new job object to the `about.jobs` array:

```json
{
  "about": {
    "jobs": [
      {
        "id": "4",
        "company": "Company Name",
        "role": "Job Title",
        "period": "2023 - Present",
        "features": [
          "Feature or responsibility 1",
          "Feature or responsibility 2"
        ],
        "contributions": [
          "Key contribution 1",
          "Key contribution 2"
        ],
        "technologies": ["Tech1", "Tech2", "Tech3"]
      }
    ]
  }
}
```

### Step 2: Add to Portuguese Dictionary (`pt.json`)

Navigate to `lib/i18n/dictionaries/pt.json` and add the SAME job with Portuguese translations:

```json
{
  "about": {
    "jobs": [
      {
        "id": "4",
        "company": "Nome da Empresa",
        "role": "Título do Cargo",
        "period": "2023 - Presente",
        "features": [
          "Característica ou responsabilidade 1",
          "Característica ou responsabilidade 2"
        ],
        "contributions": [
          "Contribuição principal 1",
          "Contribuição principal 2"
        ],
        "technologies": ["Tech1", "Tech2", "Tech3"]
      }
    ]
  }
}
```

### Important Notes

1. **ID must be unique**: Each job must have a unique `id` field
2. **Same position**: Add the job in the same array position in both files
3. **Same structure**: Both versions must have the same fields
4. **Technologies**: Technology names typically stay the same in both languages (React, Node.js, etc.)

## Updating Thesis Information

To update the thesis section, modify the `about.thesis` object in both dictionary files:

### English (`en.json`)
```json
{
  "about": {
    "thesis": {
      "title": "Your Thesis Title",
      "description": "Description of your research",
      "technologies": ["Python", "TensorFlow"],
      "results": [
        "Result 1",
        "Result 2"
      ],
      "link": "https://example.com/thesis.pdf"
    }
  }
}
```

### Portuguese (`pt.json`)
```json
{
  "about": {
    "thesis": {
      "title": "Título da Sua Tese",
      "description": "Descrição da sua pesquisa",
      "technologies": ["Python", "TensorFlow"],
      "results": [
        "Resultado 1",
        "Resultado 2"
      ],
      "link": "https://example.com/thesis.pdf"
    }
  }
}
```

## Field Descriptions

### Job Object Fields

- `id` (required): Unique identifier for the job
- `company` (required): Company name
- `role` (required): Job title/position
- `period` (required): Time period (e.g., "2022 - 2024" or "2024 - Present")
- `features` (optional): Array of key features or responsibilities
- `contributions` (optional): Array of main contributions or achievements
- `technologies` (optional): Array of technologies used

### Thesis Object Fields

- `title` (required): Thesis title
- `description` (required): Brief description of the research
- `technologies` (optional): Array of technologies used in the research
- `results` (optional): Array of research results or outcomes
- `link` (optional): URL to the thesis document

## Benefits of This Approach

1. **Easy to maintain**: All translations in one place
2. **Type-safe**: TypeScript ensures consistency
3. **No code changes**: Adding content doesn't require modifying components
4. **Consistent pattern**: Follows the same i18n pattern used throughout the app
5. **No mock data**: Real, translatable content instead of hardcoded mocks

## Example: Adding a New Job

Let's say you want to add a new job at "Tech Startup Inc." as a "Senior Developer" from 2023 to Present.

1. Open `lib/i18n/dictionaries/en.json`
2. Find the `about.jobs` array
3. Add at the beginning (most recent first):

```json
{
  "id": "4",
  "company": "Tech Startup Inc.",
  "role": "Senior Developer",
  "period": "2023 - Present",
  "features": [
    "Lead development of core platform features",
    "Architect scalable microservices"
  ],
  "contributions": [
    "Reduced API response time by 60%",
    "Implemented real-time notification system"
  ],
  "technologies": ["React", "Go", "PostgreSQL", "Redis"]
}
```

4. Open `lib/i18n/dictionaries/pt.json`
5. Add the same job with Portuguese translations:

```json
{
  "id": "4",
  "company": "Tech Startup Inc.",
  "role": "Desenvolvedor Sênior",
  "period": "2023 - Presente",
  "features": [
    "Liderar desenvolvimento de recursos principais da plataforma",
    "Arquitetar microsserviços escaláveis"
  ],
  "contributions": [
    "Reduzido tempo de resposta da API em 60%",
    "Implementado sistema de notificações em tempo real"
  ],
  "technologies": ["React", "Go", "PostgreSQL", "Redis"]
}
```

That's it! The new job will automatically appear on the About page in both languages.

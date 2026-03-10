# Quick Content Update Guide

This is a quick reference for updating content on your portfolio website. All content is managed through JSON files in `lib/i18n/dictionaries/`.

## 📝 Update Profile Information

**Files to edit:**
- `lib/i18n/dictionaries/en.json` → `home.hero.profile`
- `lib/i18n/dictionaries/pt.json` → `home.hero.profile`

**What you can change:**
- Name
- Title/headline
- Description
- Location
- Role

**Example:**
```json
"profile": {
  "name": "Your Name",
  "title": "Your Title",
  "description": "Your description",
  "location": "Your City, Country",
  "role": "Your Role"
}
```

## ⭐ Add/Update Highlights

**Files to edit:**
- `lib/i18n/dictionaries/en.json` → `home.hero.highlights`
- `lib/i18n/dictionaries/pt.json` → `home.hero.highlights`

**Example:**
```json
"highlights": [
  {
    "id": "1",
    "icon": "briefcase",
    "text": "Your highlight text"
  }
]
```

**Available icons:** briefcase, users, award, globe, code, star, trophy, etc.

## 💼 Add a New Job

**Files to edit:**
- `lib/i18n/dictionaries/en.json` → `about.jobs`
- `lib/i18n/dictionaries/pt.json` → `about.jobs`

**Template:**
```json
{
  "id": "unique-id",
  "company": "Company Name",
  "role": "Job Title",
  "period": "2023 - Present",
  "features": [
    "Feature 1",
    "Feature 2"
  ],
  "contributions": [
    "Contribution 1",
    "Contribution 2"
  ],
  "technologies": ["Tech1", "Tech2"]
}
```

**Important:** Add to the BEGINNING of the array (most recent first)

## 🎓 Update Thesis/Research

**Files to edit:**
- `lib/i18n/dictionaries/en.json` → `about.thesis`
- `lib/i18n/dictionaries/pt.json` → `about.thesis`

**Template:**
```json
"thesis": {
  "title": "Thesis Title",
  "description": "Brief description",
  "technologies": ["Tech1", "Tech2"],
  "results": [
    "Result 1",
    "Result 2"
  ],
  "link": "https://link-to-thesis.pdf"
}
```

## 🔄 Workflow

1. **Edit English version** (`en.json`)
2. **Edit Portuguese version** (`pt.json`)
3. **Save both files**
4. **Test on website** (switch between languages)

## ⚠️ Important Rules

1. **Always update BOTH files** (en.json and pt.json)
2. **Keep the same structure** in both languages
3. **Use unique IDs** for jobs and highlights
4. **Most recent items first** in arrays
5. **Test both languages** after changes

## 📍 File Locations

```
lib/i18n/dictionaries/
├── en.json    ← English content
└── pt.json    ← Portuguese content
```

## 🎯 Common Tasks

### Change Your Job Title
1. Open `en.json` and `pt.json`
2. Find `home.hero.profile.title`
3. Update the text
4. Save both files

### Add a New Highlight
1. Open `en.json` and `pt.json`
2. Find `home.hero.highlights` array
3. Add new object with unique ID
4. Save both files

### Add Recent Job Experience
1. Open `en.json` and `pt.json`
2. Find `about.jobs` array
3. Add new job at the BEGINNING
4. Save both files

### Update Your Description
1. Open `en.json` and `pt.json`
2. Find `home.hero.profile.description`
3. Update the text
4. Save both files

## 🚀 Quick Example: Adding a New Job

### Step 1: English (`en.json`)
```json
"jobs": [
  {
    "id": "4",
    "company": "New Company",
    "role": "Senior Developer",
    "period": "2025 - Present",
    "features": ["Lead team", "Design architecture"],
    "contributions": ["Improved performance by 50%"],
    "technologies": ["React", "Node.js"]
  },
  // ... existing jobs
]
```

### Step 2: Portuguese (`pt.json`)
```json
"jobs": [
  {
    "id": "4",
    "company": "Nova Empresa",
    "role": "Desenvolvedor Sênior",
    "period": "2025 - Presente",
    "features": ["Liderar equipe", "Projetar arquitetura"],
    "contributions": ["Melhorado desempenho em 50%"],
    "technologies": ["React", "Node.js"]
  },
  // ... existing jobs
]
```

### Step 3: Done!
The new job will appear on your About page in both languages.

## 📚 Need More Help?

- **Detailed guides:** See `docs/HOME_PAGE_I18N.md` and `docs/ABOUT_PAGE_I18N.md`
- **Architecture:** See `docs/ABOUT_PAGE_STRUCTURE.md`
- **Migration info:** See `docs/I18N_MIGRATION_SUMMARY.md`

## 💡 Tips

- Use a JSON validator to check syntax before saving
- Keep descriptions concise and professional
- Use consistent terminology across languages
- Test on both desktop and mobile
- Check both language versions after updates

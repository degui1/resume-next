# Documentation Index

Welcome to the portfolio website documentation. This guide will help you understand and maintain the project.

## 📚 Quick Start Guides

### For Content Updates
- **[Quick Content Update Guide](./QUICK_CONTENT_UPDATE_GUIDE.md)** ⭐ START HERE
  - Fast reference for updating profile, jobs, and highlights
  - No technical knowledge required
  - Step-by-step examples

### For Developers
- **[I18N Migration Summary](./I18N_MIGRATION_SUMMARY.md)**
  - Overview of the i18n system migration
  - Architecture changes
  - Benefits and improvements

## 🌍 Internationalization (i18n)

### Page-Specific Guides
- **[Home Page I18N Guide](./HOME_PAGE_I18N.md)**
  - Update profile information
  - Add/edit highlights
  - Manage hero section content

- **[About Page I18N Guide](./ABOUT_PAGE_I18N.md)**
  - Add new job experiences
  - Update thesis information
  - Manage professional experience

### Technical Documentation
- **[About Page Structure](./ABOUT_PAGE_STRUCTURE.md)**
  - Architecture overview
  - Data flow diagrams
  - Component relationships

- **[I18N Guide](../I18N_GUIDE.md)** (Root level)
  - General internationalization guide
  - Adding new languages
  - Translation best practices

- **[i18n README](../lib/i18n/README.md)** (Technical)
  - Implementation details
  - Dictionary system
  - Middleware configuration

## 🔧 Technical Features

### API Integration
- **[API Error Handling](./API_ERROR_HANDLING.md)**
  - Error handling strategies
  - Retry mechanisms
  - User feedback

- **[Caching Strategy](./CACHING_STRATEGY.md)**
  - Cache implementation
  - Performance optimization
  - Data freshness

### Localization
- **[YouTube Localization](./YOUTUBE_LOCALIZATION.md)**
  - YouTube API integration
  - Video content localization
  - Channel information

## 📖 Documentation Structure

```
docs/
├── README.md                          ← You are here
├── QUICK_CONTENT_UPDATE_GUIDE.md     ← Quick reference
├── HOME_PAGE_I18N.md                 ← Home page content
├── ABOUT_PAGE_I18N.md                ← About page content
├── ABOUT_PAGE_STRUCTURE.md           ← Architecture
├── I18N_MIGRATION_SUMMARY.md         ← Migration overview
├── API_ERROR_HANDLING.md             ← API errors
├── CACHING_STRATEGY.md               ← Caching
└── YOUTUBE_LOCALIZATION.md           ← YouTube integration
```

## 🎯 Common Tasks

### I Want To...

#### Update My Profile
→ [Quick Content Update Guide](./QUICK_CONTENT_UPDATE_GUIDE.md#-update-profile-information)

#### Add a New Job
→ [Quick Content Update Guide](./QUICK_CONTENT_UPDATE_GUIDE.md#-add-a-new-job)

#### Add a Highlight
→ [Quick Content Update Guide](./QUICK_CONTENT_UPDATE_GUIDE.md#-addupdate-highlights)

#### Understand the Architecture
→ [About Page Structure](./ABOUT_PAGE_STRUCTURE.md)

#### Add a New Language
→ [I18N Guide](../I18N_GUIDE.md)

#### Understand i18n System
→ [I18N Migration Summary](./I18N_MIGRATION_SUMMARY.md)

## 🚀 Getting Started

### For Content Editors
1. Read the [Quick Content Update Guide](./QUICK_CONTENT_UPDATE_GUIDE.md)
2. Edit files in `lib/i18n/dictionaries/`
3. Test changes on the website

### For Developers
1. Read the [I18N Migration Summary](./I18N_MIGRATION_SUMMARY.md)
2. Review [About Page Structure](./ABOUT_PAGE_STRUCTURE.md)
3. Check page-specific guides as needed

## 📝 Content Files

All translatable content is stored in:
```
lib/i18n/dictionaries/
├── en.json    ← English translations
└── pt.json    ← Portuguese translations
```

## 🔍 Finding Information

### By Topic

**Profile & Hero Section**
- [Home Page I18N Guide](./HOME_PAGE_I18N.md)
- [Quick Content Update Guide](./QUICK_CONTENT_UPDATE_GUIDE.md)

**Job Experiences**
- [About Page I18N Guide](./ABOUT_PAGE_I18N.md)
- [Quick Content Update Guide](./QUICK_CONTENT_UPDATE_GUIDE.md)

**Architecture & Design**
- [About Page Structure](./ABOUT_PAGE_STRUCTURE.md)
- [I18N Migration Summary](./I18N_MIGRATION_SUMMARY.md)

**API & Performance**
- [API Error Handling](./API_ERROR_HANDLING.md)
- [Caching Strategy](./CACHING_STRATEGY.md)

### By Role

**Content Editor**
1. [Quick Content Update Guide](./QUICK_CONTENT_UPDATE_GUIDE.md)
2. [Home Page I18N Guide](./HOME_PAGE_I18N.md)
3. [About Page I18N Guide](./ABOUT_PAGE_I18N.md)

**Developer**
1. [I18N Migration Summary](./I18N_MIGRATION_SUMMARY.md)
2. [About Page Structure](./ABOUT_PAGE_STRUCTURE.md)
3. [API Error Handling](./API_ERROR_HANDLING.md)
4. [Caching Strategy](./CACHING_STRATEGY.md)

**Translator**
1. [I18N Guide](../I18N_GUIDE.md)
2. [Home Page I18N Guide](./HOME_PAGE_I18N.md)
3. [About Page I18N Guide](./ABOUT_PAGE_I18N.md)

## 💡 Best Practices

### Content Updates
- Always update both language files (en.json and pt.json)
- Keep the same structure in both languages
- Use unique IDs for array items
- Test both language versions after changes

### Development
- Follow the existing i18n pattern
- Keep components simple and focused
- Use TypeScript for type safety
- Document new features

### Translation
- Maintain consistent terminology
- Keep translations natural, not literal
- Preserve formatting and structure
- Test in context, not just in files

## 🆘 Need Help?

1. **Check the relevant guide** in this documentation
2. **Review examples** in the dictionary files
3. **Look at existing implementations** in components
4. **Test changes** in both languages

## 🔄 Recent Updates

- ✅ Migrated About page to i18n system
- ✅ Migrated Home page Hero section to i18n
- ✅ Created comprehensive documentation
- ✅ Added quick reference guides

## 📞 Support

For questions or issues:
1. Check this documentation first
2. Review the code examples
3. Test in a development environment
4. Verify both language versions

---

**Last Updated:** March 2026
**Documentation Version:** 1.0

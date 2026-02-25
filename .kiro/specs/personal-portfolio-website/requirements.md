# Requirements Document

## Introduction

This document defines the requirements for a personal portfolio website built with Next.js (App Router) and TypeScript. The website will showcase professional achievements, YouTube content, and career history through a clean, Notion-inspired interface. The site will feature three main pages: Home (presentation), About (professional career), and Links (social media hub).

## Glossary

- **Portfolio_System**: The complete Next.js application including all pages, components, and data management
- **Home_Page**: The landing page featuring an enhanced hero section and YouTube content section
- **About_Page**: The professional career page displaying job history and thesis information
- **Links_Page**: The social media hub page displaying enhanced GitHub projects, LinkedIn posts, social media links, and featured YouTube content
- **Navigation_Component**: The header/navbar component for site navigation
- **Card_Component**: A reusable UI component for displaying content in card format
- **Video_Card**: A card displaying YouTube video thumbnail and title
- **Statistics_Card**: A card displaying a key metric (e.g., YouTube subscribers, years of experience)
- **Highlight_Item**: A bullet point with icon displaying a key achievement or highlight
- **YouTube_Section**: A section displaying YouTube channel information, featured videos, and content topics
- **Project_Card**: A card displaying GitHub project information including name, description, stars, and technologies
- **Social_Section**: A section on the Links_Page displaying enhanced social media information with featured content
- **Link_Card**: A card displaying a social media link
- **Job_Section**: A section displaying information about a specific job or role
- **Mock_Data**: Static arrays of objects used for development and testing
- **Responsive_Layout**: A layout that adapts to different screen sizes (desktop and mobile)
- **Theme**: The visual styling system based on Notion's light theme

## Requirements

### Requirement 1: Project Foundation

**User Story:** As a developer, I want a properly structured Next.js project with TypeScript, so that I can build a maintainable portfolio website.

#### Acceptance Criteria

1. THE Portfolio_System SHALL use Next.js with App Router architecture
2. THE Portfolio_System SHALL use TypeScript for all application code
3. THE Portfolio_System SHALL include a component library (shadcn/ui, Radix UI, or equivalent)
4. THE Portfolio_System SHALL use TailwindCSS or CSS Modules for styling
5. THE Portfolio_System SHALL organize components in a reusable component structure

### Requirement 2: Visual Theme

**User Story:** As a visitor, I want a clean and comfortable visual experience, so that I can easily consume the content.

#### Acceptance Criteria

1. THE Theme SHALL use white or off-white background colors
2. THE Theme SHALL use dark typography (black or dark gray) for text content
3. THE Theme SHALL prioritize neutral tones over strong colors
4. THE Theme SHALL follow Notion's light theme design principles
5. THE Theme SHALL maintain visual comfort through minimal design patterns

### Requirement 3: Responsive Design

**User Story:** As a visitor, I want the website to work on any device, so that I can view content on desktop or mobile.

#### Acceptance Criteria

1. THE Responsive_Layout SHALL adapt to desktop screen sizes
2. THE Responsive_Layout SHALL adapt to mobile screen sizes
3. THE Responsive_Layout SHALL maintain readability across all viewport sizes
4. THE Responsive_Layout SHALL preserve visual hierarchy on all devices

### Requirement 4: Navigation System

**User Story:** As a visitor, I want to navigate between pages easily, so that I can access different sections of the portfolio.

#### Acceptance Criteria

1. THE Navigation_Component SHALL display links to Home_Page, About_Page, and Links_Page
2. THE Navigation_Component SHALL appear on all pages
3. WHEN a visitor clicks a navigation link, THE Portfolio_System SHALL navigate to the corresponding page
4. THE Navigation_Component SHALL indicate the current active page

### Requirement 5: Home Page Structure

**User Story:** As a visitor, I want to see a comprehensive overview of the portfolio owner, so that I can quickly understand their profile and content.

#### Acceptance Criteria

1. THE Home_Page SHALL display an enhanced hero section with comprehensive developer information
2. THE Home_Page SHALL display a YouTube_Section showcasing content creation journey
3. THE Home_Page SHALL arrange sections in the following order: hero, YouTube

### Requirement 6: Enhanced Hero Section

**User Story:** As a visitor, I want to see comprehensive information about the portfolio owner in the hero section, so that I can immediately understand their profile, achievements, and availability.

#### Acceptance Criteria

1. THE Home_Page SHALL display a large, prominent profile picture in the hero section
2. THE Home_Page SHALL display the developer's name and title in the hero section
3. THE Home_Page SHALL display a detailed description or bio in the hero section
4. THE Home_Page SHALL display location and role information (e.g., "Pádua, Itália" and "CTO") in the hero section
5. THE Home_Page SHALL display key highlights as Highlight_Item components with icons
6. THE Home_Page SHALL display Statistics_Card components showing YouTube subscribers, years of experience, course students, and countries worked
7. THE Home_Page SHALL display call-to-action buttons (e.g., "Ver Cursos", "Ler Blog") in the hero section
8. THE Home_Page SHALL display availability status (e.g., "Disponível para mentorias") in the hero section

### Requirement 7: Statistics Display

**User Story:** As a visitor, I want to see key metrics about the portfolio owner, so that I can understand their reach and experience at a glance.

#### Acceptance Criteria

1. WHEN the Home_Page renders, THE Portfolio_System SHALL display Statistics_Card components from Mock_Data
2. THE Statistics_Card SHALL display a metric label (e.g., "Inscritos YouTube")
3. THE Statistics_Card SHALL display a metric value (e.g., "117K+")
4. THE Portfolio_System SHALL display statistics for YouTube subscribers, years of experience, course students, and countries worked
5. THE Portfolio_System SHALL arrange Statistics_Card components in a grid layout within the hero section

### Requirement 8: Highlights Display

**User Story:** As a visitor, I want to see key achievements and highlights, so that I can quickly understand the portfolio owner's main accomplishments.

#### Acceptance Criteria

1. WHEN the Home_Page renders, THE Portfolio_System SHALL display Highlight_Item components from Mock_Data
2. THE Highlight_Item SHALL display an icon representing the highlight category
3. THE Highlight_Item SHALL display descriptive text (e.g., "CTO em startup americana", "Educador com 117k+ seguidores")
4. THE Portfolio_System SHALL arrange Highlight_Item components as bullet points within the hero section

### Requirement 9: YouTube Section Structure

**User Story:** As a visitor, I want to understand the portfolio owner's content creation journey, so that I can explore their YouTube presence and content topics.

#### Acceptance Criteria

1. THE YouTube_Section SHALL display a section title
2. THE YouTube_Section SHALL display a brief introduction explaining the content the developer creates
3. THE YouTube_Section SHALL display Video_Card components for featured videos
4. THE YouTube_Section SHALL display channel information including subscriber count
5. THE YouTube_Section SHALL display content topics as chips or tags (e.g., "Algorithms", "Data Structures", "Career in Tech")
6. WHERE multiple YouTube channels exist, THE YouTube_Section SHALL display a list of channels with subscriber counts
7. THE YouTube_Section SHALL display a button to redirect to the YouTube channel
8. THE YouTube_Section SHALL present information in a narrative format that tells the content creation story

### Requirement 10: YouTube Video Display

**User Story:** As a visitor, I want to see featured YouTube videos, so that I can explore the portfolio owner's content.

#### Acceptance Criteria

1. WHEN the YouTube_Section renders, THE Portfolio_System SHALL display Video_Card components from Mock_Data
2. THE Video_Card SHALL display a video thumbnail image
3. THE Video_Card SHALL display a video title
4. WHEN a visitor clicks a Video_Card, THE Portfolio_System SHALL navigate to the corresponding YouTube video
5. THE Portfolio_System SHALL arrange Video_Card components in a grid layout within the YouTube_Section

### Requirement 11: Enhanced Social Links Section

**User Story:** As a visitor, I want to see detailed social media information with featured content on the Links page, so that I can explore the portfolio owner's presence across platforms.

#### Acceptance Criteria

1. THE Links_Page SHALL display enhanced information for GitHub and LinkedIn
2. THE Links_Page SHALL display standard links for other social media platforms
3. THE Links_Page SHALL arrange social media information in a visually organized layout

### Requirement 12: GitHub Integration

**User Story:** As a visitor, I want to see featured GitHub projects on the Links page, so that I can explore the portfolio owner's code repositories.

#### Acceptance Criteria

1. WHEN the Links_Page renders, THE Portfolio_System SHALL display Project_Card components from Mock_Data
2. THE Project_Card SHALL display the project name
3. THE Project_Card SHALL display the project description
4. THE Project_Card SHALL display the number of stars
5. THE Project_Card SHALL display technologies used as tags or chips
6. THE Links_Page SHALL display a link to the full GitHub profile
7. WHEN a visitor clicks a Project_Card, THE Portfolio_System SHALL navigate to the corresponding GitHub repository

### Requirement 13: LinkedIn Integration

**User Story:** As a visitor, I want to see recent LinkedIn activity on the Links page, so that I can understand the portfolio owner's professional engagement.

#### Acceptance Criteria

1. THE Links_Page SHALL display recent LinkedIn posts or highlights
2. THE LinkedIn post preview SHALL display engagement metrics (likes, comments, shares)
3. THE Links_Page SHALL display a link to the full LinkedIn profile
4. WHEN a visitor clicks a LinkedIn post preview, THE Portfolio_System SHALL navigate to the corresponding LinkedIn post

### Requirement 14: About Page Structure

**User Story:** As a visitor, I want to read about the portfolio owner's professional career, so that I can understand their work history.

#### Acceptance Criteria

1. THE About_Page SHALL display Job_Section components for each job or role
2. THE About_Page SHALL display a separate section for thesis information
3. THE About_Page SHALL use a layout optimized for long-form content readability
4. THE About_Page SHALL organize Job_Section components chronologically or by company

### Requirement 15: Job History Display

**User Story:** As a visitor, I want to see detailed job information, so that I can understand the portfolio owner's professional experience.

#### Acceptance Criteria

1. WHEN the About_Page renders, THE Portfolio_System SHALL display Job_Section components from Mock_Data
2. THE Job_Section SHALL display the role title
3. THE Job_Section SHALL display the employment period
4. THE Job_Section SHALL display key features and main contributions as a list
5. THE Job_Section SHALL visually separate each job from others

### Requirement 16: Thesis Display

**User Story:** As a visitor, I want to read about the portfolio owner's thesis, so that I can understand their academic work.

#### Acceptance Criteria

1. THE About_Page SHALL display a thesis section separate from Job_Section components
2. THE thesis section SHALL display the thesis topic
3. THE thesis section SHALL display the project description
4. THE thesis section SHALL display technologies used
5. THE thesis section SHALL display results or outcomes

### Requirement 17: Links Page Structure

**User Story:** As a visitor, I want to access the portfolio owner's social media profiles and featured content, so that I can connect with them on various platforms and explore their work.

#### Acceptance Criteria

1. THE Links_Page SHALL display an enhanced GitHub section with featured projects showing name, description, stars, and technologies
2. THE Links_Page SHALL display an enhanced LinkedIn section with recent posts showing content preview and engagement metrics
3. THE Links_Page SHALL display Link_Card components for other social media profiles
4. THE Links_Page SHALL display a section for most viewed YouTube videos
5. THE Links_Page SHALL display a direct link to the YouTube channel
6. THE Links_Page SHALL arrange sections in the following order: GitHub projects, LinkedIn posts, other social links, YouTube videos
7. THE Links_Page SHALL use a Linktree-style layout integrated with the site's design

### Requirement 18: Social Media Links

**User Story:** As a visitor, I want to click on social media links, so that I can visit the portfolio owner's profiles.

#### Acceptance Criteria

1. WHEN the Links_Page renders, THE Portfolio_System SHALL display Link_Card components from Mock_Data
2. THE Link_Card SHALL include links to GitHub, LinkedIn, YouTube, and other social networks
3. WHEN a visitor clicks a Link_Card, THE Portfolio_System SHALL navigate to the corresponding external URL
4. THE Portfolio_System SHALL arrange Link_Card components in a clickable card layout

### Requirement 19: Featured YouTube Content

**User Story:** As a visitor, I want to see the most viewed YouTube videos, so that I can discover popular content.

#### Acceptance Criteria

1. THE Links_Page SHALL display a section showing most viewed YouTube videos
2. THE Links_Page SHALL display a direct link to the YouTube channel
3. WHEN a visitor clicks a featured video, THE Portfolio_System SHALL navigate to the corresponding YouTube video

### Requirement 20: Reusable Components

**User Story:** As a developer, I want reusable components, so that I can maintain consistency and reduce code duplication.

#### Acceptance Criteria

1. THE Portfolio_System SHALL provide a Card_Component that can be reused across pages
2. THE Portfolio_System SHALL provide Section components that can be reused for content organization
3. THE Portfolio_System SHALL provide a Footer component that appears on all pages
4. THE Card_Component SHALL accept props for customization
5. THE Section components SHALL accept props for customization

### Requirement 21: Mock Data Management

**User Story:** As a developer, I want mock data for development, so that I can build and test the interface without backend dependencies.

#### Acceptance Criteria

1. THE Portfolio_System SHALL include Mock_Data arrays for jobs
2. THE Portfolio_System SHALL include Mock_Data arrays for highlights
3. THE Portfolio_System SHALL include Mock_Data arrays for statistics
4. THE Portfolio_System SHALL include Mock_Data arrays for videos
5. THE Portfolio_System SHALL include Mock_Data arrays for YouTube channels
6. THE Portfolio_System SHALL include Mock_Data arrays for GitHub projects
7. THE Portfolio_System SHALL include Mock_Data arrays for LinkedIn posts
8. THE Portfolio_System SHALL include Mock_Data arrays for social media links
9. THE Mock_Data SHALL use TypeScript interfaces or types for type safety

### Requirement 22: Base Layout System

**User Story:** As a developer, I want a base layout system, so that I can maintain consistent page structure across the site.

#### Acceptance Criteria

1. THE Portfolio_System SHALL provide a base layout that includes Navigation_Component
2. THE Portfolio_System SHALL provide a base layout that includes Footer component
3. THE base layout SHALL wrap all page content
4. THE base layout SHALL maintain consistent spacing and structure across pages

### Requirement 23: Folder Structure

**User Story:** As a developer, I want a well-organized folder structure, so that I can easily locate and maintain code.

#### Acceptance Criteria

1. THE Portfolio_System SHALL organize components in a dedicated components directory
2. THE Portfolio_System SHALL organize pages using Next.js App Router conventions
3. THE Portfolio_System SHALL organize Mock_Data in a dedicated data or constants directory
4. THE Portfolio_System SHALL organize types or interfaces in a dedicated types directory
5. THE Portfolio_System SHALL organize styles in a dedicated styles directory

### Requirement 24: Working Starter Code

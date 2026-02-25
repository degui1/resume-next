# Design Document: Personal Portfolio Website

## Overview

This design document outlines the technical architecture for a personal portfolio website built with Next.js 14+ (App Router), TypeScript, and TailwindCSS. The application follows a component-based architecture with three main pages (Home, About, Links) and emphasizes reusability, type safety, and responsive design.

The portfolio showcases professional achievements through an enhanced hero section with statistics and highlights, features a narrative-driven YouTube content section with channel information and topics on the Home page. The Links page serves as a comprehensive social media hub with rich integration including GitHub projects with detailed information, LinkedIn activity previews with engagement metrics, other social platform links, and most viewed YouTube videos. The About page displays career history.

### Key Design Principles

- **Component Reusability**: Shared components (Card, Section, Navigation, Footer) used across all pages
- **Type Safety**: TypeScript interfaces for all data structures and component props
- **Responsive First**: Mobile-first design approach with TailwindCSS breakpoints
- **Static Generation**: Leveraging Next.js App Router for optimal performance
- **Clean Architecture**: Clear separation between UI components, data, and page layouts
- **Content Showcase**: Emphasis on storytelling and visual presentation of achievements and content

## Architecture

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript 5+
- **Styling**: TailwindCSS 3+
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Icons**: lucide-react (consistent with shadcn/ui ecosystem)

### Application Structure

```
portfolio-website/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Navigation & Footer
│   ├── page.tsx                 # Home page
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── links/
│   │   └── page.tsx            # Links page
│   └── globals.css             # Global styles & Tailwind imports
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── StatisticsCard.tsx
│   │   ├── HighlightItem.tsx
│   │   ├── VideoCard.tsx
│   │   └── YouTubeChannelInfo.tsx
│   ├── about/
│   │   ├── JobSection.tsx
│   │   └── ThesisSection.tsx
│   └── links/
│       ├── LinkCard.tsx
│       ├── ProjectCard.tsx
│       └── LinkedInPostCard.tsx
├── lib/
│   ├── data/
│   │   └── mockData.ts         # All mock data arrays
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── utils.ts                # Utility functions (cn helper)
├── public/
│   └── images/                 # Static images
└── tailwind.config.ts          # Tailwind configuration
```

### Routing Architecture

The application uses Next.js App Router with file-based routing:

- `/` → Home page (app/page.tsx)
- `/about` → About page (app/about/page.tsx)
- `/links` → Links page (app/links/page.tsx)

All pages share a common root layout (app/layout.tsx) that includes:
- Navigation component (header)
- Footer component
- Global metadata and fonts
- Consistent spacing and max-width container

### State Management

This application uses a **static data approach** with no client-side state management library needed:

- All data is defined in `lib/data/mockData.ts` as typed arrays
- Components receive data via props (server components by default)
- No dynamic state changes or user interactions that require state management
- Future backend integration can replace mock data imports with API calls

## Components and Interfaces

### Layout Components

#### Navigation Component

**Purpose**: Provides site-wide navigation with active page indication

**Location**: `components/layout/Navigation.tsx`

**Props**: None (uses Next.js `usePathname` for active state)

**Structure**:
```typescript
- Container with max-width and padding
- Logo/Name (links to home)
- Navigation links: Home, About, Links
- Active state styling using pathname matching
- Responsive: Horizontal on desktop, hamburger menu on mobile
```

**Styling**:
- Sticky or fixed positioning at top
- White/off-white background with subtle border
- Active link highlighted with underline or background
- Smooth transitions on hover

#### Footer Component

**Purpose**: Displays copyright and optional social links

**Location**: `components/layout/Footer.tsx`

**Props**: None

**Structure**:
```typescript
- Container with max-width and padding
- Copyright text with current year
- Optional: Quick links to social media
- Minimal, unobtrusive design
```

### Home Page Components

#### HeroSection Component

**Purpose**: Displays comprehensive developer profile with picture, bio, highlights, statistics, and CTAs

**Location**: `components/home/HeroSection.tsx`

**Props**:
```typescript
interface HeroSectionProps {
  profile: Profile;
  highlights: Highlight[];
  statistics: Statistic[];
}
```

**Structure**:
- Large profile picture with availability badge overlay
- Name, title, location, and role information
- Detailed bio/description text
- Highlight items with icons (4-5 key achievements)
- Statistics grid (4 cards showing key metrics)
- Multiple CTA buttons (e.g., "Ver Cursos", "Ler Blog")
- Responsive layout: stacks on mobile, multi-column on desktop

#### StatisticsCard Component

**Purpose**: Displays a key metric with icon

**Location**: `components/home/StatisticsCard.tsx`

**Props**:
```typescript
interface StatisticsCardProps {
  statistic: Statistic;
}
```

**Structure**:
- Uses base Card component from shadcn/ui
- Icon representing the metric type
- Large metric value (e.g., "117K+")
- Metric label (e.g., "Inscritos YouTube")
- Compact, grid-friendly design

#### HighlightItem Component

**Purpose**: Displays a key achievement or highlight with icon

**Location**: `components/home/HighlightItem.tsx`

**Props**:
```typescript
interface HighlightItemProps {
  highlight: Highlight;
}
```

**Structure**:
- Icon on the left
- Descriptive text on the right
- Bullet point or list item styling
- Inline layout

#### VideoCard Component

**Purpose**: Displays YouTube video thumbnail and title

**Location**: `components/home/VideoCard.tsx`

**Props**:
```typescript
interface VideoCardProps {
  video: Video;
}
```

**Structure**:
- Uses base Card component from shadcn/ui
- Thumbnail image with aspect ratio 16:9
- Video title below thumbnail
- Hover effect: slight scale or shadow increase
- Click: Opens YouTube video in new tab

#### YouTubeChannelInfo Component

**Purpose**: Displays YouTube channel information with topics and subscriber count

**Location**: `components/home/YouTubeChannelInfo.tsx`

**Props**:
```typescript
interface YouTubeChannelInfoProps {
  channels: YouTubeChannel[];
  topics: string[];
}
```

**Structure**:
- Channel list with names, handles, and subscriber counts
- Content topics displayed as chips/badges
- Subscriber count prominently displayed
- "Visit Channel" CTA button
- Sidebar or card layout within YouTube section

### YouTube Section Layout

The YouTube section is designed as a narrative content showcase:

**Structure**:
- Section title (h2): "My Content Creation Journey" or similar
- Introduction paragraph explaining the content focus
- Featured videos grid (3-4 videos in responsive grid)
- Channel information sidebar or card:
  - Channel name and handle
  - Subscriber count prominently displayed
  - Content topics as badge/chip components
  - Multiple channels listed if applicable
- "Visit Channel" CTA button
- Narrative flow that tells the story of content creation

**Layout Pattern**:
- Desktop: Videos in 3-column grid, channel info in sidebar or below
- Mobile: Stacked layout with videos in single column

### About Page Components

#### JobSection Component

**Purpose**: Displays information about a job or role

**Location**: `components/about/JobSection.tsx`

**Props**:
```typescript
interface JobSectionProps {
  job: Job;
}
```

**Structure**:
- Company name and logo (optional)
- Role title (h3)
- Employment period (dates)
- Key features/contributions as bullet list
- Technologies used (optional tags)
- Visual separator between jobs (border or spacing)

#### ThesisSection Component

**Purpose**: Displays thesis information

**Location**: `components/about/ThesisSection.tsx`

**Props**:
```typescript
interface ThesisSectionProps {
  thesis: Thesis;
}
```

**Structure**:
- Thesis title (h3)
- Project description (paragraph)
- Technologies used (tags or list)
- Results/outcomes (paragraph or list)
- Link to thesis document (optional)

### Links Page Components

#### LinkCard Component

**Purpose**: Displays a social media link

**Location**: `components/links/LinkCard.tsx`

**Props**:
```typescript
interface LinkCardProps {
  link: SocialLink;
}
```

**Structure**:
- Uses base Card component
- Platform icon (from lucide-react)
- Platform name
- Username or handle (optional)
- Full-width clickable card
- Hover effect: background color change
- Click: Opens external URL in new tab

#### ProjectCard Component

**Purpose**: Displays GitHub project information

**Location**: `components/links/ProjectCard.tsx`

**Props**:
```typescript
interface ProjectCardProps {
  project: GitHubProject;
}
```

**Structure**:
- Uses base Card component
- Project name as heading
- Project description text
- Star count with icon
- Technology tags/chips
- Hover effect: border or shadow change
- Click: Opens GitHub repository in new tab

#### LinkedInPostCard Component

**Purpose**: Displays LinkedIn post preview with engagement metrics

**Location**: `components/links/LinkedInPostCard.tsx`

**Props**:
```typescript
interface LinkedInPostCardProps {
  post: LinkedInPost;
}
```

**Structure**:
- Uses base Card component
- Content preview (truncated text)
- Engagement metrics (likes, comments, shares)
- Post date
- Hover effect: background change
- Click: Opens LinkedIn post in new tab

### Reusable UI Components

The application uses shadcn/ui components, which are copied into the project and customizable:

- **Card**: Base card component with variants (default, outlined)
- **Button**: Button component with variants (default, outline, ghost)
- **Badge**: Badge/chip component for tags and labels (used for topics, technologies, availability)
- **Separator**: Horizontal divider for sections

## Data Models

### TypeScript Interfaces

**Location**: `lib/types/index.ts`

```typescript
// Highlight data structure
export interface Highlight {
  id: string;
  icon: string;
  text: string;
}

// Statistic data structure
export interface Statistic {
  id: string;
  label: string;
  value: string;
  icon: string;
}

// Video data structure
export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  views?: number;
}

// YouTube channel data structure
export interface YouTubeChannel {
  id: string;
  name: string;
  handle: string;
  subscribers: string;
  url: string;
}

// GitHub project data structure
export interface GitHubProject {
  id: string;
  name: string;
  description: string;
  stars: number;
  url: string;
  technologies: string[];
}

// LinkedIn post data structure
export interface LinkedInPost {
  id: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  url: string;
  date: string;
}

// Job data structure
export interface Job {
  id: string;
  company: string;
  role: string;
  period: string;
  startDate: string;
  endDate?: string;
  features: string[];
  contributions: string[];
  technologies?: string[];
  logo?: string;
}

// Thesis data structure
export interface Thesis {
  title: string;
  description: string;
  technologies: string[];
  results: string[];
  link?: string;
}

// Social link data structure
export interface SocialLink {
  id: string;
  platform: string;
  username?: string;
  url: string;
  icon: string;
}

// Profile data structure
export interface Profile {
  name: string;
  title: string;
  description: string;
  profileImage: string;
  location: string;
  role: string;
  availability: string;
  email?: string;
}
```

### Mock Data Structure

**Location**: `lib/data/mockData.ts`

```typescript
import { 
  Video, 
  Highlight, 
  Statistic, 
  YouTubeChannel, 
  GitHubProject, 
  LinkedInPost, 
  Job, 
  Thesis, 
  SocialLink, 
  Profile 
} from '@/lib/types';

export const profile: Profile = {
  name: "John Doe",
  title: "Full Stack Developer & Tech Educator",
  description: "Building amazing web experiences with modern technologies and teaching others to do the same.",
  profileImage: "/images/profile.jpg",
  location: "Pádua, Itália",
  role: "CTO",
  availability: "Disponível para mentorias",
  email: "john@example.com"
};

export const highlights: Highlight[] = [
  {
    id: "1",
    icon: "briefcase",
    text: "CTO em startup americana"
  },
  {
    id: "2",
    icon: "users",
    text: "Educador com 117k+ seguidores"
  },
  {
    id: "3",
    icon: "award",
    text: "Autor de cursos com 50k+ alunos"
  },
  {
    id: "4",
    icon: "globe",
    text: "Trabalhou em 15+ países"
  }
];

export const statistics: Statistic[] = [
  {
    id: "1",
    label: "Inscritos YouTube",
    value: "117K+",
    icon: "youtube"
  },
  {
    id: "2",
    label: "Anos de Experiência",
    value: "10+",
    icon: "calendar"
  },
  {
    id: "3",
    label: "Alunos em Cursos",
    value: "50K+",
    icon: "graduation-cap"
  },
  {
    id: "4",
    label: "Países Trabalhados",
    value: "15+",
    icon: "map-pin"
  }
];

export const videos: Video[] = [
  {
    id: "1",
    title: "Introduction to Next.js",
    thumbnail: "/images/video1.jpg",
    url: "https://youtube.com/watch?v=...",
    views: 10000
  },
  {
    id: "2",
    title: "TypeScript Best Practices",
    thumbnail: "/images/video2.jpg",
    url: "https://youtube.com/watch?v=...",
    views: 15000
  },
  {
    id: "3",
    title: "Building Scalable APIs",
    thumbnail: "/images/video3.jpg",
    url: "https://youtube.com/watch?v=...",
    views: 8000
  }
];

export const youtubeChannels: YouTubeChannel[] = [
  {
    id: "1",
    name: "Tech with John",
    handle: "@techwjohn",
    subscribers: "117K",
    url: "https://youtube.com/@techwjohn"
  }
];

export const contentTopics: string[] = [
  "Algorithms",
  "Data Structures",
  "Career in Tech",
  "System Design",
  "Web Development"
];

export const githubProjects: GitHubProject[] = [
  {
    id: "1",
    name: "awesome-react-hooks",
    description: "A collection of useful React hooks for common use cases",
    stars: 1250,
    url: "https://github.com/johndoe/awesome-react-hooks",
    technologies: ["React", "TypeScript", "Hooks"]
  },
  {
    id: "2",
    name: "next-auth-template",
    description: "Production-ready Next.js authentication template",
    stars: 890,
    url: "https://github.com/johndoe/next-auth-template",
    technologies: ["Next.js", "NextAuth", "Prisma"]
  },
  {
    id: "3",
    name: "api-rate-limiter",
    description: "Flexible rate limiting middleware for Node.js APIs",
    stars: 450,
    url: "https://github.com/johndoe/api-rate-limiter",
    technologies: ["Node.js", "Express", "Redis"]
  }
];

export const linkedinPosts: LinkedInPost[] = [
  {
    id: "1",
    content: "Just launched a new course on advanced TypeScript patterns! Check it out...",
    likes: 245,
    comments: 32,
    shares: 18,
    url: "https://linkedin.com/posts/johndoe/...",
    date: "2024-01-15"
  },
  {
    id: "2",
    content: "Excited to share that our startup just reached 10k users! Here's what we learned...",
    likes: 512,
    comments: 67,
    shares: 45,
    url: "https://linkedin.com/posts/johndoe/...",
    date: "2024-01-10"
  }
];

export const jobs: Job[] = [
  {
    id: "1",
    company: "Tech Company",
    role: "Senior Developer",
    period: "2022 - Present",
    startDate: "2022-01",
    features: ["Led team of 5 developers", "Architected new platform"],
    contributions: ["Improved performance by 50%", "Reduced bugs by 30%"],
    technologies: ["React", "Node.js", "PostgreSQL"]
  },
  // ... more jobs
];

export const thesis: Thesis = {
  title: "Machine Learning for Web Applications",
  description: "Research on applying ML models to improve user experience",
  technologies: ["Python", "TensorFlow", "React"],
  results: ["Published in conference", "Implemented in production"]
};

export const socialLinks: SocialLink[] = [
  {
    id: "1",
    platform: "GitHub",
    username: "johndoe",
    url: "https://github.com/johndoe",
    icon: "github"
  },
  {
    id: "2",
    platform: "LinkedIn",
    username: "johndoe",
    url: "https://linkedin.com/in/johndoe",
    icon: "linkedin"
  },
  {
    id: "3",
    platform: "YouTube",
    username: "@techwjohn",
    url: "https://youtube.com/@techwjohn",
    icon: "youtube"
  },
  // ... more links
];
```

### Page Layouts

#### Home Page Layout

```
┌─────────────────────────────────────┐
│         Navigation                   │
├─────────────────────────────────────┤
│                                      │
│  Enhanced Hero Section               │
│  ┌──────────┐  Name                 │
│  │          │  Title                │
│  │  Profile │  Location | Role      │
│  │   Img    │  [Availability Badge] │
│  │          │                        │
│  └──────────┘  Description/Bio      │
│                                      │
│  Highlights:                         │
│  • Icon  Highlight 1                │
│  • Icon  Highlight 2                │
│  • Icon  Highlight 3                │
│  • Icon  Highlight 4                │
│                                      │
│  Statistics Grid:                    │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │117K+   │ │10+     │ │50K+    │  │
│  │YouTube │ │Years   │ │Students│  │
│  └────────┘ └────────┘ └────────┘  │
│  ┌────────┐                         │
│  │15+     │                         │
│  │Countries│                        │
│  └────────┘                         │
│                                      │
│  [Ver Cursos] [Ler Blog]            │
│                                      │
├─────────────────────────────────────┤
│  YouTube Section                     │
│  Title: "My Content Creation Journey"│
│  Introduction text...                │
│                                      │
│  Featured Videos:                    │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │Video 1 │ │Video 2 │ │Video 3 │  │
│  └────────┘ └────────┘ └────────┘  │
│                                      │
│  Channel Info:                       │
│  📺 Tech with John (@techwjohn)     │
│  117K subscribers                    │
│                                      │
│  Topics: [Algorithms] [Data Struct] │
│          [Career] [System Design]   │
│                                      │
│  [Visit Channel]                     │
│                                      │
├─────────────────────────────────────┤
│         Footer                       │
└─────────────────────────────────────┘
```

#### About Page Layout

```
┌─────────────────────────────────────┐
│         Navigation                   │
├─────────────────────────────────────┤
│                                      │
│  Page Title: About                   │
│                                      │
│  Job Section 1                       │
│  ─────────────────────────────────  │
│  Company | Role | Period            │
│  • Feature 1                         │
│  • Feature 2                         │
│                                      │
│  Job Section 2                       │
│  ─────────────────────────────────  │
│  Company | Role | Period            │
│  • Feature 1                         │
│  • Feature 2                         │
│                                      │
│  Thesis Section                      │
│  ─────────────────────────────────  │
│  Title                               │
│  Description                         │
│  Technologies: [tags]                │
│  Results: ...                        │
│                                      │
├─────────────────────────────────────┤
│         Footer                       │
└─────────────────────────────────────┘
```

#### Links Page Layout

```
┌─────────────────────────────────────┐
│         Navigation                   │
├─────────────────────────────────────┤
│                                      │
│  Page Title: Links                   │
│                                      │
│  GitHub Projects:                    │
│  ┌────────────────────────────────┐ │
│  │ awesome-react-hooks            │ │
│  │ Description...                 │ │
│  │ ⭐ 1.2K  [React] [TypeScript]  │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ next-auth-template             │ │
│  │ Description...                 │ │
│  │ ⭐ 890  [Next.js] [Prisma]     │ │
│  └────────────────────────────────┘ │
│  [View GitHub Profile]              │
│                                      │
│  LinkedIn Activity:                  │
│  ┌────────────────────────────────┐ │
│  │ Just launched a new course...  │ │
│  │ 👍 245  💬 32  🔄 18           │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ Excited to share...            │ │
│  │ 👍 512  💬 67  🔄 45           │ │
│  └────────────────────────────────┘ │
│  [View LinkedIn Profile]            │
│                                      │
│  Other Social Links:                 │
│  ┌─────────────────────────────┐   │
│  │ 🐙 GitHub                    │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 💼 LinkedIn                  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 📺 YouTube                   │   │
│  └─────────────────────────────┘   │
│                                      │
│  Most Viewed Videos                  │
│  ┌────────┐ ┌────────┐             │
│  │Video 1 │ │Video 2 │             │
│  └────────┘ └────────┘             │
│                                      │
├─────────────────────────────────────┤
│         Footer                       │
└─────────────────────────────────────┘
```

## Styling Approach

### Theme Configuration

The Notion-inspired light theme uses the following color palette in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      background: '#ffffff',
      foreground: '#37352f',
      card: {
        DEFAULT: '#ffffff',
        foreground: '#37352f',
      },
      muted: {
        DEFAULT: '#f7f6f3',
        foreground: '#787774',
      },
      border: '#e9e9e7',
      accent: {
        DEFAULT: '#f7f6f3',
        foreground: '#37352f',
      },
    },
  },
}
```

### Typography

- **Font Family**: System font stack or Inter/Geist Sans
- **Headings**: Font weight 600-700, appropriate sizing (h1: 2.5rem, h2: 2rem, h3: 1.5rem)
- **Body Text**: Font weight 400, size 1rem, line height 1.6
- **Color**: Dark gray (#37352f) for primary text, lighter gray (#787774) for secondary

### Spacing and Layout

- **Max Width**: 1200px for main content container
- **Padding**: Consistent horizontal padding (px-4 sm:px-6 lg:px-8)
- **Section Spacing**: Vertical spacing between sections (py-12 sm:py-16)
- **Card Spacing**: Gap between cards (gap-4 sm:gap-6)

### Responsive Breakpoints

Using TailwindCSS default breakpoints:
- **sm**: 640px (tablet)
- **md**: 768px (small desktop)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

### Component Styling Patterns

**Cards**:
- White background with subtle border
- Rounded corners (rounded-lg)
- Padding (p-4 sm:p-6)
- Hover effect: shadow increase or border color change
- Transition: smooth (transition-all duration-200)

**Buttons**:
- Primary: Dark background with white text
- Secondary: White background with dark border
- Hover: Slight opacity or background change
- Padding: px-6 py-2
- Rounded: rounded-md

**Navigation**:
- Sticky positioning (sticky top-0)
- White background with border-bottom
- Z-index for layering (z-50)
- Backdrop blur for modern effect (backdrop-blur-sm)

## Responsive Design Strategy

### Mobile-First Approach

1. **Base styles** target mobile devices (320px+)
2. **Progressive enhancement** adds complexity at larger breakpoints
3. **Touch-friendly** targets (minimum 44x44px for interactive elements)

### Layout Adaptations

**Navigation**:
- Mobile: Hamburger menu or horizontal scroll
- Desktop: Full horizontal navigation bar

**Hero Section**:
- Mobile: Stacked (image above text)
- Desktop: Side-by-side (image left, text right)

**Card Grids**:
- Mobile: Single column
- Tablet: 2 columns
- Desktop: 3 columns

**Typography**:
- Mobile: Smaller font sizes (scale down by 10-20%)
- Desktop: Full-size typography

### Image Optimization

- Use Next.js Image component for automatic optimization
- Provide multiple sizes for responsive images
- Lazy loading for below-the-fold images
- WebP format with fallbacks


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection

After analyzing all acceptance criteria from the updated requirements, I identified the following redundancies and consolidations:

**Redundancies Eliminated:**
- Requirements 7.1 and 8.1 both test that components render from mock data arrays - consolidated into properties for each component type
- Requirements 7.2, 7.3, 8.2, 8.3 test that card components display their fields - consolidated into single properties per component type
- Requirements 12.2, 12.3, 12.4, 12.5 test that Project_Card displays individual fields - consolidated into one comprehensive property
- Requirements 13.2 tests engagement metrics display - consolidated with LinkedIn post rendering property
- Mock data existence tests (21.2, 21.3, 21.6, 21.7, 21.8) - consolidated into one example test

**Properties Combined:**
- Video card rendering and field display combined into comprehensive video card property
- Statistics card rendering and field display combined into comprehensive statistics property
- Highlight item rendering and field display combined into comprehensive highlight property
- Project card rendering and field display combined into comprehensive project property
- LinkedIn post rendering and engagement metrics combined into comprehensive LinkedIn property

The following properties represent the unique, non-redundant testable behaviors:

### Property 1: Responsive layout adapts to viewport sizes

For any page in the application and any viewport width (mobile: 320-767px, desktop: 768px+), the layout should render without horizontal overflow and maintain appropriate element positioning for that breakpoint.

**Validates: Requirements 3.1, 3.2**

### Property 2: Navigation appears on all pages

For any page route in the application (/, /about, /links), rendering that page should include the Navigation component in the DOM.

**Validates: Requirements 4.2**

### Property 3: Navigation links route correctly

For any navigation link (Home, About, Links), clicking that link should navigate to the corresponding page route.

**Validates: Requirements 4.3**

### Property 4: Active page indication

For any page route, the Navigation component should apply active styling to the link corresponding to the current route.

**Validates: Requirements 4.4**

### Property 5: Highlight items render with icon and text

For any highlight in the highlights mock data array, the Home page should render a Highlight_Item component that displays both the icon and the descriptive text.

**Validates: Requirements 6.5, 8.1, 8.2, 8.3**

### Property 6: Statistics cards render with all fields

For any statistic in the statistics mock data array, the Home page should render a Statistics_Card component that displays the icon, label, and value.

**Validates: Requirements 6.6, 7.1, 7.2, 7.3**

### Property 7: Content topics render as chips

For any topic string in the content topics array, the YouTube section should render that topic as a chip or badge element.

**Validates: Requirements 9.5**

### Property 8: YouTube channels render with subscriber counts

For any channel in the YouTube channels mock data array, the YouTube section should render a list item displaying the channel name, handle, and subscriber count.

**Validates: Requirements 9.6**

### Property 9: Video cards render and display required fields

For any video in the videos mock data array, the Home page should render a Video_Card component that displays both the thumbnail image and the video title.

**Validates: Requirements 10.1, 10.2, 10.3**

### Property 10: Video card navigation

For any video object, clicking the Video_Card should navigate to the video's URL.

**Validates: Requirements 10.4**

### Property 11: Job sections render from mock data

For any job in the jobs mock data array, the About page should render a Job_Section component containing that job's data.

**Validates: Requirements 15.1**

### Property 12: Job section displays required fields

For any job object, rendering a Job_Section with that job should display the role title, employment period, features list, and contributions list in the DOM.

**Validates: Requirements 15.2, 15.3, 15.4**

### Property 13: Job sections maintain order

For any ordering of jobs in the mock data array, the About page should render Job_Section components in the same order as they appear in the array.

**Validates: Requirements 14.4**

### Property 14: Project cards render with all fields

For any project in the GitHub projects mock data array, the Links page should render a Project_Card component that displays the project name, description, star count, and all technology tags.

**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

### Property 15: Project card navigation

For any project object, clicking the Project_Card should navigate to the project's GitHub repository URL.

**Validates: Requirements 12.7**

### Property 16: LinkedIn posts render with engagement metrics

For any LinkedIn post in the LinkedIn posts mock data array, the Links page should render a post preview that displays the content preview and all engagement metrics (likes, comments, shares).

**Validates: Requirements 13.1, 13.2**

### Property 17: LinkedIn post navigation

For any LinkedIn post object, clicking the post preview should navigate to the post's LinkedIn URL.

**Validates: Requirements 13.4**

### Property 18: Link cards render from mock data

For any social link in the socialLinks mock data array, the Links page should render a Link_Card component containing that link's data.

**Validates: Requirements 18.1**

### Property 19: Link card navigation

For any social link object, clicking the Link_Card should navigate to the link's URL.

**Validates: Requirements 18.3**

### Property 20: Featured video navigation

For any featured video on the Links page, clicking that video should navigate to the video's URL.

**Validates: Requirements 19.3**

### Property 21: Footer appears on all pages

For any page route in the application (/, /about, /links), rendering that page should include the Footer component in the DOM.

**Validates: Requirements 20.3**

### Property 22: Card component accepts customization props

For any set of valid props passed to the Card component, the component should render without errors and apply the provided customizations.

**Validates: Requirements 20.4**

### Property 23: Section components accept customization props

For any set of valid props passed to Section components, the components should render without errors and apply the provided customizations.

**Validates: Requirements 20.5**

### Property 24: Base layout wraps page content

For any page in the application, the page content should be wrapped by the base layout component.

**Validates: Requirements 22.3**

### Property 25: Consistent layout structure

For any page in the application, the base layout should apply consistent container classes and spacing.

**Validates: Requirements 22.4**

## Error Handling

### Component Error Boundaries

The application should implement error boundaries at key levels:

1. **Root Error Boundary**: Catches errors in the entire application
   - Location: `app/error.tsx`
   - Displays user-friendly error message
   - Provides option to retry or return home

2. **Page-Level Error Boundaries**: Catches errors in specific pages
   - Location: `app/[page]/error.tsx`
   - Allows other pages to continue functioning
   - Logs errors for debugging

### Data Validation

Mock data should be validated at import time:

```typescript
// lib/data/validation.ts
import { Video, Achievement, Job, SocialLink } from '@/lib/types';

export function validateVideos(videos: Video[]): void {
  videos.forEach(video => {
    if (!video.id || !video.title || !video.thumbnail || !video.url) {
      throw new Error(`Invalid video data: ${JSON.stringify(video)}`);
    }
  });
}

// Similar validators for other data types
```

### Missing Data Handling

Components should gracefully handle missing or incomplete data:

- **Missing Images**: Display placeholder or fallback image
- **Missing Text**: Display "N/A" or hide the field
- **Empty Arrays**: Display "No items to display" message
- **Invalid URLs**: Disable link or show warning

### Network Error Handling

For future API integration:

- Implement retry logic with exponential backoff
- Display loading states during data fetching
- Show error messages with retry options
- Cache data locally when possible

## Testing Strategy

### Dual Testing Approach

This application requires both unit tests and property-based tests for comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties across all inputs

Together, these approaches provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness.

### Property-Based Testing

**Library**: fast-check (for TypeScript/JavaScript)

**Configuration**:
- Minimum 100 iterations per property test
- Each test must reference its design document property
- Tag format: `Feature: personal-portfolio-website, Property {number}: {property_text}`

**Example Property Test**:

```typescript
import fc from 'fast-check';
import { render } from '@testing-library/react';
import { StatisticsCard } from '@/components/home/StatisticsCard';
import { Statistic } from '@/lib/types';

// Feature: personal-portfolio-website, Property 6: Statistics cards render with all fields
describe('Property 6: Statistics cards render with all fields', () => {
  it('should display icon, label, and value for any statistic', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string(),
          label: fc.string({ minLength: 1 }),
          value: fc.string({ minLength: 1 }),
          icon: fc.string({ minLength: 1 }),
        }),
        (statistic: Statistic) => {
          const { container } = render(<StatisticsCard statistic={statistic} />);
          const content = container.textContent;
          
          expect(content).toContain(statistic.label);
          expect(content).toContain(statistic.value);
          // Icon should be rendered (check for icon element or class)
          const iconElement = container.querySelector('[data-icon]');
          expect(iconElement).toBeInTheDocument();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: personal-portfolio-website, Property 14: Project cards render with all fields
describe('Property 14: Project cards render with all fields', () => {
  it('should display name, description, stars, and all technologies for any project', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string(),
          name: fc.string({ minLength: 1 }),
          description: fc.string({ minLength: 1 }),
          stars: fc.nat(),
          url: fc.webUrl(),
          technologies: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
        }),
        (project: GitHubProject) => {
          const { container } = render(<ProjectCard project={project} />);
          const content = container.textContent;
          
          expect(content).toContain(project.name);
          expect(content).toContain(project.description);
          expect(content).toContain(project.stars.toString());
          
          // All technologies should be displayed
          project.technologies.forEach(tech => {
            expect(content).toContain(tech);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing

**Library**: Jest + React Testing Library

**Focus Areas**:
1. **Component Rendering**: Test that components render without errors
2. **User Interactions**: Test click handlers, navigation, form submissions
3. **Edge Cases**: Empty data arrays, missing fields, invalid data
4. **Integration**: Test page composition and data flow

**Example Unit Tests**:

```typescript
// Home page structure test
describe('Home Page', () => {
  it('should display all required sections in correct order', () => {
    const { container } = render(<HomePage />);
    const sections = container.querySelectorAll('section');
    
    expect(sections[0]).toHaveAttribute('data-section', 'hero');
    expect(sections[1]).toHaveAttribute('data-section', 'youtube');
  });
  
  it('should display enhanced hero section with all elements', () => {
    const { getByText, container } = render(<HomePage />);
    
    // Profile picture
    const profileImg = container.querySelector('img[alt*="profile"]');
    expect(profileImg).toBeInTheDocument();
    
    // Availability badge
    expect(getByText(/disponível/i)).toBeInTheDocument();
    
    // Statistics grid
    expect(getByText(/inscritos youtube/i)).toBeInTheDocument();
    expect(getByText(/anos de experiência/i)).toBeInTheDocument();
    
    // CTA buttons
    expect(getByText(/ver cursos/i)).toBeInTheDocument();
    expect(getByText(/ler blog/i)).toBeInTheDocument();
  });
});

// Mock data validation test
describe('Mock Data', () => {
  it('should include all required data arrays', () => {
    expect(videos).toBeDefined();
    expect(videos.length).toBeGreaterThan(0);
    expect(highlights).toBeDefined();
    expect(highlights.length).toBeGreaterThan(0);
    expect(statistics).toBeDefined();
    expect(statistics.length).toBeGreaterThan(0);
    expect(youtubeChannels).toBeDefined();
    expect(youtubeChannels.length).toBeGreaterThan(0);
    expect(githubProjects).toBeDefined();
    expect(githubProjects.length).toBeGreaterThan(0);
    expect(linkedinPosts).toBeDefined();
    expect(linkedinPosts.length).toBeGreaterThan(0);
    expect(jobs).toBeDefined();
    expect(jobs.length).toBeGreaterThan(0);
    expect(socialLinks).toBeDefined();
    expect(socialLinks.length).toBeGreaterThan(0);
  });
});

// Navigation test
describe('Navigation Component', () => {
  it('should display links to all main pages', () => {
    const { getByText } = render(<Navigation />);
    
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('About')).toBeInTheDocument();
    expect(getByText('Links')).toBeInTheDocument();
  });
});

// YouTube Section test
describe('YouTube Section', () => {
  it('should display section title and introduction', () => {
    const { getByText } = render(<YouTubeSection />);
    
    expect(getByText(/content creation/i)).toBeInTheDocument();
    expect(getByText(/visit channel/i)).toBeInTheDocument();
  });
  
  it('should display content topics as chips', () => {
    const { container } = render(<YouTubeSection />);
    const chips = container.querySelectorAll('[data-chip]');
    
    expect(chips.length).toBeGreaterThan(0);
  });
});

// Links Page test
describe('Links Page', () => {
  it('should display GitHub subsection with projects', () => {
    const { getByText, container } = render(<LinksPage />);
    
    expect(getByText(/github/i)).toBeInTheDocument();
    expect(getByText(/view github profile/i)).toBeInTheDocument();
    
    const projectCards = container.querySelectorAll('[data-project-card]');
    expect(projectCards.length).toBeGreaterThan(0);
  });
  
  it('should display LinkedIn subsection with posts', () => {
    const { getByText, container } = render(<LinksPage />);
    
    expect(getByText(/linkedin/i)).toBeInTheDocument();
    expect(getByText(/view linkedin profile/i)).toBeInTheDocument();
    
    const postCards = container.querySelectorAll('[data-linkedin-post]');
    expect(postCards.length).toBeGreaterThan(0);
  });
  
  it('should display other social links', () => {
    const { container } = render(<LinksPage />);
    
    const linkCards = container.querySelectorAll('[data-link-card]');
    expect(linkCards.length).toBeGreaterThan(0);
  });
  
  it('should display most viewed videos section', () => {
    const { getByText, container } = render(<LinksPage />);
    
    expect(getByText(/most viewed/i)).toBeInTheDocument();
    const videoCards = container.querySelectorAll('[data-video-card]');
    expect(videoCards.length).toBeGreaterThan(0);
  });
});

// Error handling test
describe('ProjectCard Error Handling', () => {
  it('should handle empty technologies array', () => {
    const projectWithoutTech = {
      id: '1',
      name: 'Test Project',
      description: 'Test description',
      stars: 100,
      url: 'https://github.com/test/project',
      technologies: []
    };
    
    const { container } = render(<ProjectCard project={projectWithoutTech} />);
    
    expect(container).toBeInTheDocument();
    expect(container.textContent).toContain('Test Project');
  });
});

// Statistics Card test
describe('StatisticsCard', () => {
  it('should display all statistic fields', () => {
    const stat = {
      id: '1',
      label: 'Test Metric',
      value: '100+',
      icon: 'test-icon'
    };
    
    const { getByText } = render(<StatisticsCard statistic={stat} />);
    
    expect(getByText('Test Metric')).toBeInTheDocument();
    expect(getByText('100+')).toBeInTheDocument();
  });
});

// Highlight Item test
describe('HighlightItem', () => {
  it('should display icon and text', () => {
    const highlight = {
      id: '1',
      icon: 'briefcase',
      text: 'Test achievement'
    };
    
    const { getByText, container } = render(<HighlightItem highlight={highlight} />);
    
    expect(getByText('Test achievement')).toBeInTheDocument();
    const icon = container.querySelector('[data-icon]');
    expect(icon).toBeInTheDocument();
  });
});
```

### Test Coverage Goals

- **Component Coverage**: 80%+ line coverage for all components
- **Property Coverage**: All 25 properties must have corresponding property tests
- **Integration Coverage**: All pages must have integration tests
- **Edge Case Coverage**: All error handling paths must be tested

### Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run only property tests
npm test -- --testPathPattern=properties

# Run only unit tests
npm test -- --testPathPattern=unit
```

### Continuous Integration

Tests should run automatically on:
- Every commit (pre-commit hook)
- Every pull request (CI pipeline)
- Before deployment (pre-deploy check)

Minimum requirements for passing:
- All tests pass
- Coverage thresholds met (80%+)
- No TypeScript errors
- No linting errors


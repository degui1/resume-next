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
    company: "Tech Startup Inc",
    role: "Chief Technology Officer",
    period: "2022 - Present",
    startDate: "2022-01",
    features: [
      "Led team of 5 developers",
      "Architected new platform from scratch",
      "Established engineering best practices"
    ],
    contributions: [
      "Improved performance by 50%",
      "Reduced bugs by 30%",
      "Scaled system to 10k users"
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "AWS"]
  },
  {
    id: "2",
    company: "Digital Agency Co",
    role: "Senior Full Stack Developer",
    period: "2019 - 2022",
    startDate: "2019-03",
    endDate: "2022-01",
    features: [
      "Developed client projects",
      "Mentored junior developers",
      "Led technical architecture decisions"
    ],
    contributions: [
      "Delivered 15+ successful projects",
      "Improved team productivity by 40%",
      "Implemented CI/CD pipeline"
    ],
    technologies: ["Vue.js", "Django", "MySQL", "Docker"]
  }
];

export const thesis: Thesis = {
  title: "Machine Learning for Web Applications",
  description: "Research on applying ML models to improve user experience in web applications through predictive analytics and personalization.",
  technologies: ["Python", "TensorFlow", "React", "Flask"],
  results: [
    "Published in international conference",
    "Implemented in production system",
    "Improved user engagement by 35%"
  ],
  link: "https://example.com/thesis.pdf"
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
  {
    id: "4",
    platform: "Twitter",
    username: "@johndoe",
    url: "https://twitter.com/johndoe",
    icon: "twitter"
  }
];

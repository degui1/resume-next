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
  name: "Guilherme Gonçalves",
  title: "Full Stack Developer & Tech Educator",
  description: "Building amazing web experiences with modern technologies and teaching others to do the same.",
  profileImage: "/images/profile.jpg",
  location: "São Paulo, Brazil",
  role: "Software Developer",
  availability: "Disponível",
  email: "gui.denez56@gmail.com"
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
    name: "Guilherme Gonçalves",
    handle: "@guilhermegoncalves6743",
    subscribers: "11",
    url: "https://www.youtube.com/@guilhermegoncalves6743"
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
    name: "portfolio-website",
    description: "Modern portfolio website built with Next.js 14, TypeScript, and Tailwind CSS featuring internationalization and responsive design",
    stars: 0,
    forks: 0,
    language: "TypeScript",
    updatedAt: new Date().toISOString(),
    url: "https://github.com/degui1/portfolio-website",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "React"]
  },
  {
    id: "2",
    name: "apdata-projects",
    description: "Enterprise-level HR and workforce management solutions with cloud migration, OCR integration, and automated workflows",
    stars: 0,
    forks: 0,
    language: "JavaScript",
    updatedAt: new Date().toISOString(),
    url: "https://github.com/degui1",
    technologies: ["React", "Node.js", "Delphi", "AWS", "OCR"]
  },
  {
    id: "3",
    name: "academic-research",
    description: "Research projects and implementations from academic work, including algorithms and data structures",
    stars: 0,
    forks: 0,
    language: "Python",
    updatedAt: new Date().toISOString(),
    url: "https://github.com/degui1",
    technologies: ["Python", "Algorithms", "Data Structures"]
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
    company: "Apdata do Brasil",
    role: "Software Developer",
    period: "2024 - Present",
    startDate: "2024-09",
    features: [
      "Larger architectural challenges",
      "Mentor junior developers",
      "Lead cross-functional initiatives",
      "Continue driving innovation in Apdata's cloud platform"
    ],
    contributions: [
      "Added contractor-specific appointment functionality with cost center, payroll, and activity tracking",
      "Developed new independent on-call (sobreaviso) routine",
      "Eliminated technical restrictions from legacy system",
      "Provided more flexible solution for workforce scheduling",
      "Enhanced user experience and feature completeness",
      "Updated critical production packages and removed unused dependencies, reducing bundle size",
      "Improved security and performance across the platform",
      "Established design system consistency",
      "Modernized project architecture",
      "Improved code organization and maintainability",
      "Implemented workflow form launch for OCR document reading",
      "Automated field population from OCR-extracted medical certificate data",
      "Streamlined document processing workflow",
      "Created cadastral validation for CFO (Conselho Federal de Odontologia)",
      "Automated professional credential verification for dentists",
      "Created cadastral validation for CFM (Conselho Federal de Medicina)",
      "Professional credential verification for physicians",
      "Integrated chatbot functionality into platform",
    ],
    technologies: ["React", "Node.js", "Delphi", "Docker", "Nest.js", "AWS", "Linux", "Kiro", "SQL Server", "Oracle", "OCR"]
  },
  {
    id: "2",
    company: "Apdata do Brasil",
    role: "Junior Software Developer",
    period: "2022 - 2024",
    startDate: "2022-11",
    features: [
      "Larger architectural challenges",
      "Mentor junior developers",
      "Lead cross-functional initiatives",
      "Continue driving innovation in Apdata's cloud platform"
    ],
    contributions: [
      "Added contractor-specific appointment functionality with cost center, payroll, and activity tracking",
      "Developed new independent on-call (sobreaviso) routine",
      "Eliminated technical restrictions from legacy system",
      "Provided more flexible solution for workforce scheduling",
      "Enhanced user experience and feature completeness",
      "Updated critical production packages and removed unused dependencies, reducing bundle size",
      "Improved security and performance across the platform",
      "Established design system consistency",
      "Modernized project architecture",
      "Improved code organization and maintainability",
      "Implemented workflow form launch for OCR document reading",
      "Automated field population from OCR-extracted medical certificate data",
      "Streamlined document processing workflow",
      "Created cadastral validation for CFO (Conselho Federal de Odontologia)",
      "Automated professional credential verification for dentists",
      "Created cadastral validation for CFM (Conselho Federal de Medicina)",
      "Professional credential verification for physicians",
      "Integrated chatbot functionality into platform",
    ],
    technologies: ["React", "Node.js", "Delphi", "Nest.js", "AWS", "Linux", "Kiro", "SQL Server", "Oracle", "OCR"]
  },
  {
    id: "3",
    company: "Grupo Melo Cordeiro",
    role: "Intern Software Developer",
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
    username: "degui1",
    url: "https://github.com/degui1",
    icon: "github"
  },
  {
    id: "2",
    platform: "LinkedIn",
    username: "guilherme-gonçalves-50a48b1bb",
    url: "https://linkedin.com/in/guilherme-gonçalves-50a48b1bb",
    icon: "linkedin"
  },
  {
    id: "3",
    platform: "YouTube",
    username: "@guilhermegoncalves6743",
    url: "https://youtube.com/@guilhermegoncalves6743",
    icon: "youtube"
  },
  // {
  //   id: "4",
  //   platform: "Twitter",
  //   username: "@johndoe",
  //   url: "https://twitter.com/johndoe",
  //   icon: "twitter"
  // }
];

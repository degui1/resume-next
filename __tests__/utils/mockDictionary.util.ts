import { Dictionary } from '@/lib/i18n/get-dictionary';

export const mockDictionary: Dictionary = {
  navigation: {
    home: "Home",
    about: "About",
    links: "Links",
    sections: {
      hero: "Hero",
      content: "Content",
      experience: "Experience",
      skills: "Skills",
      projects: "Projects",
      testimonials: "Testimonials",
      contact: "Contact"
    }
  },
  home: {
    hero: {
      greeting: "Hello, I'm",
      description: "Software Engineer passionate about creating innovative solutions and sharing knowledge through content creation."
    },
    highlights: {
      title: "Highlights"
    },
    statistics: {
      title: "Statistics"
    },
    content: {
      title: "My Content Creation Journey",
      description: "I create educational content about software development, algorithms, and career growth in tech. My goal is to make complex topics accessible and help developers level up their skills.",
      featuredVideos: "Featured Videos",
      views: "views",
      subscribers: "subscribers",
      videos: "videos"
    },
    contact: {
      title: "Title",
      emailPlaceholder: "example@email.com",
      findMe: "Find me",
      moreDetails: "More details",
      orButton: "Or",
      submitButton: "Submit",
      subtitle: "Subtitle" 
    },
    experience: {
      title: "Experience",
      description: "Description",
      education: "Education",
      work: "Work"
    },
    projects: {
      viewProject: "View project",
      description: "Description",
      forks: "Forks",
      language: "Language",
      lastUpdated: "Last updated",
      stars: "Stars",
      title: "Title",
      viewOnGitHub: "View on Github"
    },
    skills: {
      title: "Title",
      description: "Description"
    },
    testimonials: {
      title: "Title",
      description: "Description"
    }
  },
  about: {
    title: "About",
    description: "Over 3+ years at Apdata, I've contributed to the global-antares platform focusing on modernizing the cloud platform, time tracking systems, and OCR document processing. My work spans frontend development (React, TypeScript), infrastructure improvements, and complex business logic implementation (Delphi, C#) for HR and workforce management systems.",
    experience: {
      title: "Professional Experience",
      present: "Present",
      contributions: 'Contributions'
    },
    research: {
      title: "Academic Research"
    }
  },
  links: {
    title: "Links",
    description: "Connect with me on various platforms and explore my projects.",
    projects: "Projects",
    social: "Social Media",
    posts: "Recent Posts"
  },
  footer: {
    rights: "All rights reserved."
  },
  github: {
    errors: {
      authentication: "Authentication",
      generic: "Generic",
      network: "Network",
      notFound: "Not found",
      rateLimit: "Rate limit",
      validation: "Validation"
    }
  }
};

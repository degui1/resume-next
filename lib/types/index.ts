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
  forks: number;
  url: string;
  technologies: string[];
  language: string | null;
  updatedAt: string; // ISO 8601 format
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

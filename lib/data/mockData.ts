import {
  Profile,
  SocialLink
} from '@/lib/types';

export const profile: Profile = {
  name: "Guilherme Gonçalves",
  title: "Full Stack Developer & Tech Educator",
  description: "Building amazing web experiences with modern technologies and teaching others to do the same.",
  profileImage: "/images/profile2.jpg",
  location: "São Paulo, Brazil",
  role: "Software Developer",
  availability: "Disponível",
  email: "gui.denez56@gmail.com"
};

export const contentTopics: string[] = [
  "Algorithms",
  "Data Structures",
  "Career in Tech",
  "System Design",
  "Web Development"
];

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
];

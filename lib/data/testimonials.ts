export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image?: string;
  text: string;
  linkedinUrl?: string;
  date?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'João Silva',
    role: 'Tech Lead',
    company: 'Tech Company',
    text: 'Guilherme é um desenvolvedor excepcional com forte capacidade técnica e excelente trabalho em equipe. Sua dedicação e habilidade em resolver problemas complexos são impressionantes.',
    linkedinUrl: 'https://linkedin.com/in/example',
    date: '2024-01'
  },
  {
    id: '2',
    name: 'Maria Santos',
    role: 'Product Manager',
    company: 'Startup XYZ',
    text: 'Trabalhei com Guilherme em diversos projetos e sempre me impressionou sua capacidade de entregar soluções de alta qualidade. Profissional comprometido e sempre disposto a ajudar a equipe.',
    linkedinUrl: 'https://linkedin.com/in/example',
    date: '2023-11'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    role: 'Senior Developer',
    company: 'Digital Agency',
    text: 'Guilherme demonstra excelente conhecimento técnico e capacidade de aprendizado rápido. É um prazer trabalhar com alguém tão dedicado e profissional.',
    linkedinUrl: 'https://linkedin.com/in/example',
    date: '2023-09'
  }
];

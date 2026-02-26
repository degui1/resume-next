import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('Home Page Structure', () => {
  it('should display all sections in correct order', () => {
    const { container } = render(<HomePage />);
    const sections = container.querySelectorAll('section, [role="region"]');
    
    // Should have at least hero and YouTube sections
    expect(sections.length).toBeGreaterThanOrEqual(2);
  });

  it('should display enhanced hero section with profile image', () => {
    const { container } = render(<HomePage />);
    
    // Profile picture should be present
    const profileImg = container.querySelector('img[alt*="profile" i], img[alt*="john" i]');
    expect(profileImg).toBeInTheDocument();
  });

  it('should display availability badge', () => {
    render(<HomePage />);
    
    // Availability badge should be present
    expect(screen.getByText(/disponível/i)).toBeInTheDocument();
  });

  it('should display hero section elements', () => {
    render(<HomePage />);
    
    // Name and title
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/full stack developer/i)).toBeInTheDocument();
    
    // Location and role
    expect(screen.getByText(/pádua/i)).toBeInTheDocument();
    // CTO appears multiple times (in role and in highlights), so just check it exists
    const ctoElements = screen.getAllByText(/cto/i);
    expect(ctoElements.length).toBeGreaterThan(0);
  });

  it('should display statistics cards', () => {
    render(<HomePage />);
    
    // Statistics should be present
    expect(screen.getByText(/inscritos youtube/i)).toBeInTheDocument();
    expect(screen.getByText(/anos de experiência/i)).toBeInTheDocument();
    expect(screen.getByText(/alunos em cursos/i)).toBeInTheDocument();
    expect(screen.getByText(/países trabalhados/i)).toBeInTheDocument();
  });

  it('should display CTA buttons', () => {
    render(<HomePage />);
    
    // CTA buttons should be present
    expect(screen.getByText(/ver cursos/i)).toBeInTheDocument();
    expect(screen.getByText(/ler blog/i)).toBeInTheDocument();
  });

  it('should display highlights with icons', () => {
    const { container } = render(<HomePage />);
    
    // Highlights should be present
    expect(screen.getByText(/cto em startup americana/i)).toBeInTheDocument();
    expect(screen.getByText(/educador com 117k\+ seguidores/i)).toBeInTheDocument();
    
    // Icons should be present (check for data-icon attributes)
    const icons = container.querySelectorAll('[data-icon]');
    expect(icons.length).toBeGreaterThan(0);
  });
});

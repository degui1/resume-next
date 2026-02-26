import { render, screen } from '@testing-library/react';
import { HighlightItem } from '@/components/home/HighlightItem';

describe('HighlightItem Component', () => {
  it('should display icon and text', () => {
    const highlight = {
      id: '1',
      icon: 'briefcase',
      text: 'Test achievement',
    };
    
    const { container } = render(<HighlightItem highlight={highlight} />);
    
    // Text should be displayed
    expect(screen.getByText('Test achievement')).toBeInTheDocument();
    
    // Icon should be rendered with data-icon attribute
    const iconElement = container.querySelector('[data-icon="briefcase"]');
    expect(iconElement).toBeInTheDocument();
  });

  it('should display briefcase icon correctly', () => {
    const highlight = {
      id: '1',
      icon: 'briefcase',
      text: 'CTO em startup americana',
    };
    
    const { container } = render(<HighlightItem highlight={highlight} />);
    
    expect(screen.getByText('CTO em startup americana')).toBeInTheDocument();
    
    const iconElement = container.querySelector('[data-icon="briefcase"]');
    expect(iconElement).toBeInTheDocument();
  });

  it('should display users icon correctly', () => {
    const highlight = {
      id: '2',
      icon: 'users',
      text: 'Educador com 117k+ seguidores',
    };
    
    const { container } = render(<HighlightItem highlight={highlight} />);
    
    expect(screen.getByText('Educador com 117k+ seguidores')).toBeInTheDocument();
    
    const iconElement = container.querySelector('[data-icon="users"]');
    expect(iconElement).toBeInTheDocument();
  });

  it('should display award icon correctly', () => {
    const highlight = {
      id: '3',
      icon: 'award',
      text: 'Autor de cursos com 50k+ alunos',
    };
    
    const { container } = render(<HighlightItem highlight={highlight} />);
    
    expect(screen.getByText('Autor de cursos com 50k+ alunos')).toBeInTheDocument();
    
    const iconElement = container.querySelector('[data-icon="award"]');
    expect(iconElement).toBeInTheDocument();
  });

  it('should display globe icon correctly', () => {
    const highlight = {
      id: '4',
      icon: 'globe',
      text: 'Trabalhou em 15+ países',
    };
    
    const { container } = render(<HighlightItem highlight={highlight} />);
    
    expect(screen.getByText('Trabalhou em 15+ países')).toBeInTheDocument();
    
    const iconElement = container.querySelector('[data-icon="globe"]');
    expect(iconElement).toBeInTheDocument();
  });

  it('should handle unknown icon gracefully', () => {
    const highlight = {
      id: '5',
      icon: 'unknown-icon',
      text: 'Some achievement',
    };
    
    const { container } = render(<HighlightItem highlight={highlight} />);
    
    // Should still render the text
    expect(screen.getByText('Some achievement')).toBeInTheDocument();
    
    // Should have a fallback icon with the unknown icon name
    const iconElement = container.querySelector('[data-icon="unknown-icon"]');
    expect(iconElement).toBeInTheDocument();
  });

  it('should render icon and text in correct layout', () => {
    const highlight = {
      id: '1',
      icon: 'briefcase',
      text: 'Test achievement',
    };
    
    const { container } = render(<HighlightItem highlight={highlight} />);
    
    // Should have flex layout
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('items-center');
  });
});

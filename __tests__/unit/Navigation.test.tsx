import { render, screen } from '@testing-library/react';
import { Navigation } from '@/components/layout/Navigation';

// Mock usePathname from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Navigation Component', () => {
  beforeEach(() => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/');
  });

  it('should display all navigation links', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
  });

  it('should apply active state styling to current page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/about');
    
    render(<Navigation />);
    
    const aboutLink = screen.getByText('About').closest('a');
    // Active links have border-b-2 and border-foreground classes
    expect(aboutLink).toHaveClass('border-b-2');
    expect(aboutLink).toHaveClass('border-foreground');
  });

  it('should apply active state styling to home page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/');
    
    render(<Navigation />);
    
    const homeLink = screen.getByText('Home').closest('a');
    // Active links have border-b-2 and border-foreground classes
    expect(homeLink).toHaveClass('border-b-2');
    expect(homeLink).toHaveClass('border-foreground');
  });

  it('should apply active state styling to links page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/links');
    
    render(<Navigation />);
    
    const linksLink = screen.getByText('Links').closest('a');
    // Active links have border-b-2 and border-foreground classes
    expect(linksLink).toHaveClass('border-b-2');
    expect(linksLink).toHaveClass('border-foreground');
  });
});

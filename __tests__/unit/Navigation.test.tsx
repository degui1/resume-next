import { render, screen } from '@testing-library/react';
import { Navigation } from '@/components/layout/Navigation';
import { mockDictionary } from '../utils/mockDictionary.util';

// Mock usePathname from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Navigation Component', () => {
  beforeEach(() => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/en');
  });

  it('should display all navigation links', () => {
    render(<Navigation lang="en" dict={mockDictionary} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
  });

  it('should apply active state styling to current page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/en/about');
    
    render(<Navigation lang="en" dict={mockDictionary} />);
    
    const aboutLink = screen.getByText('About').closest('a');
    // Active links have border-b-2 and border-foreground classes
    expect(aboutLink).toHaveClass('border-b-2');
    expect(aboutLink).toHaveClass('border-foreground');
  });

  it('should apply active state styling to home page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/en');
    
    render(<Navigation lang="en" dict={mockDictionary} />);
    
    const homeButton = screen.getByText('Home').closest('button');
    // Active links have border-b-2 and border-foreground classes
    expect(homeButton).toHaveClass('border-b-2');
    expect(homeButton).toHaveClass('border-foreground');
  });

  it('should apply active state styling to links page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/en/links');
    
    render(<Navigation lang="en" dict={mockDictionary} />);
    
    const linksLink = screen.getByText('Links').closest('a');
    // Active links have border-b-2 and border-foreground classes
    expect(linksLink).toHaveClass('border-b-2');
    expect(linksLink).toHaveClass('border-foreground');
  });
});

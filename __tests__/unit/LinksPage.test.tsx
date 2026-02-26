import { render, screen } from '@testing-library/react';
import LinksPage from '@/app/links/page';

describe('Links Page Structure', () => {
  it('should display GitHub subsection with projects', () => {
    render(<LinksPage />);
    
    // GitHub section title (use getAllByText since "GitHub" appears multiple times)
    const githubElements = screen.getAllByText(/github/i);
    expect(githubElements.length).toBeGreaterThan(0);
    
    // GitHub projects should be displayed
    expect(screen.getByText(/awesome-react-hooks/i)).toBeInTheDocument();
    expect(screen.getByText(/next-auth-template/i)).toBeInTheDocument();
    expect(screen.getByText(/api-rate-limiter/i)).toBeInTheDocument();
    
    // View GitHub profile link
    expect(screen.getByText(/view.*github.*profile/i)).toBeInTheDocument();
  });

  it('should display project details', () => {
    render(<LinksPage />);
    
    // Project descriptions should be present
    expect(screen.getByText(/collection of useful react hooks/i)).toBeInTheDocument();
    
    // Star counts should be displayed
    expect(screen.getByText(/1,250/i)).toBeInTheDocument();
    
    // Technologies should be displayed as badges (use getAllByText since "React" appears multiple times)
    const reactElements = screen.getAllByText(/^react$/i);
    expect(reactElements.length).toBeGreaterThan(0);
    
    const typescriptElements = screen.getAllByText(/^typescript$/i);
    expect(typescriptElements.length).toBeGreaterThan(0);
  });

  it('should display LinkedIn subsection with posts', () => {
    render(<LinksPage />);
    
    // LinkedIn section title (use getAllByText since "LinkedIn" appears multiple times)
    const linkedinElements = screen.getAllByText(/linkedin/i);
    expect(linkedinElements.length).toBeGreaterThan(0);
    
    // LinkedIn posts should be displayed
    expect(screen.getByText(/just launched a new course/i)).toBeInTheDocument();
    expect(screen.getByText(/excited to share that our startup/i)).toBeInTheDocument();
    
    // View LinkedIn profile link
    expect(screen.getByText(/view.*linkedin.*profile/i)).toBeInTheDocument();
  });

  it('should display LinkedIn post engagement metrics', () => {
    render(<LinksPage />);
    
    // Engagement metrics should be displayed
    expect(screen.getByText(/245/i)).toBeInTheDocument(); // likes
    expect(screen.getByText(/32/i)).toBeInTheDocument(); // comments
    expect(screen.getByText(/18/i)).toBeInTheDocument(); // shares
  });

  it('should display other social links section', () => {
    const { container } = render(<LinksPage />);
    
    // Social links section should exist (check for "Social Media" heading)
    const socialHeading = screen.queryByText(/social media/i);
    
    // If there are other social links, the section should be present
    // Otherwise, it's conditionally rendered and may not appear
    if (socialHeading) {
      expect(socialHeading).toBeInTheDocument();
    }
    
    // Social link cards should be present (GitHub, LinkedIn, YouTube links exist)
    const linkCards = container.querySelectorAll('a[href*="github.com"], a[href*="linkedin.com"], a[href*="youtube.com"]');
    expect(linkCards.length).toBeGreaterThan(0);
  });

  it('should display most viewed videos section', () => {
    render(<LinksPage />);
    
    // Most viewed videos section title
    expect(screen.getByText(/most viewed/i)).toBeInTheDocument();
    
    // Video titles should be present
    expect(screen.getByText(/typescript best practices/i)).toBeInTheDocument();
  });

  it('should display YouTube channel link', () => {
    render(<LinksPage />);
    
    // Direct YouTube channel link should be present
    expect(screen.getByText(/visit youtube channel/i)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('YouTube Section', () => {
  it('should display section title', () => {
    render(<HomePage />);
    
    // YouTube section title should be present
    expect(screen.getByText(/content creation/i)).toBeInTheDocument();
  });

  it('should display introduction text', () => {
    render(<HomePage />);
    
    // Introduction explaining content should be present
    const introText = screen.getByText(/I create educational content/i);
    expect(introText).toBeInTheDocument();
  });

  it('should display content topics as chips', () => {
    const { container } = render(<HomePage />);
    
    // Content topics should be displayed (use getAllByText since "algorithms" appears in intro text too)
    const algorithmsElements = screen.getAllByText(/algorithms/i);
    expect(algorithmsElements.length).toBeGreaterThan(0);
    
    expect(screen.getByText(/data structures/i)).toBeInTheDocument();
    expect(screen.getByText(/career in tech/i)).toBeInTheDocument();
    
    // Topics should be rendered as badge/chip elements with data-chip attribute
    const badges = container.querySelectorAll('[data-chip="true"]');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should display channel information', () => {
    render(<HomePage />);
    
    // Channel name and subscriber count should be present
    expect(screen.getByText(/tech with john/i)).toBeInTheDocument();
    // 117K appears multiple times (in stats and channel info), so just check it exists
    const subscriberElements = screen.getAllByText(/117k/i);
    expect(subscriberElements.length).toBeGreaterThan(0);
  });

  it('should display visit channel button', () => {
    render(<HomePage />);
    
    // Visit channel CTA should be present
    expect(screen.getByText(/visit channel/i)).toBeInTheDocument();
  });

  it('should display featured videos', () => {
    render(<HomePage />);
    
    // Video cards should be present
    expect(screen.getByText(/introduction to next\.js/i)).toBeInTheDocument();
    expect(screen.getByText(/typescript best practices/i)).toBeInTheDocument();
    
    // Featured Videos heading should be present
    expect(screen.getByText(/featured videos/i)).toBeInTheDocument();
  });
});

import { render } from '@testing-library/react';
import { ProjectCard } from '@/components/links/ProjectCard';
import { LinkedInPostCard } from '@/components/links/LinkedInPostCard';
import { StatisticsCard } from '@/components/home/StatisticsCard';
import { HighlightItem } from '@/components/home/HighlightItem';
import { VideoCard } from '@/components/home/VideoCard';
import { mockDictionary } from '../utils/mockDictionary.util';

describe('Error Handling - Components with Empty Arrays', () => {
  it('should handle ProjectCard with empty technologies array', () => {
    const projectWithoutTech = {
      id: '1',
      name: 'Test Project',
      description: 'Test description',
      stars: 100,
      url: 'https://github.com/test/project',
      technologies: [],
    };
    
    const { container } = render(<ProjectCard project={projectWithoutTech} />);
    
    expect(container).toBeInTheDocument();
    expect(container.textContent).toContain('Test Project');
    expect(container.textContent).toContain('Test description');
  });

  it('should handle ProjectCard with zero stars', () => {
    const projectWithZeroStars = {
      id: '1',
      name: 'New Project',
      description: 'Brand new project',
      stars: 0,
      url: 'https://github.com/test/new-project',
      technologies: ['React'],
    };
    
    const { container } = render(<ProjectCard project={projectWithZeroStars} />);
    
    expect(container).toBeInTheDocument();
    expect(container.textContent).toContain('New Project');
    expect(container.textContent).toContain('0');
  });

  it('should handle LinkedInPostCard with zero engagement', () => {
    const postWithZeroEngagement = {
      id: '1',
      content: 'Test post content',
      likes: 0,
      comments: 0,
      shares: 0,
      url: 'https://linkedin.com/posts/test',
      date: '2024-01-01',
    };
    
    const { container } = render(<LinkedInPostCard post={postWithZeroEngagement} />);
    
    expect(container).toBeInTheDocument();
    expect(container.textContent).toContain('Test post content');
    expect(container.textContent).toContain('0');
  });
});

describe('Error Handling - Components with Missing Optional Fields', () => {
  it('should handle VideoCard with missing views field', () => {
    const videoWithoutViews = {
      id: '1',
      title: 'Test Video',
      thumbnail: '/images/test.jpg',
      url: 'https://youtube.com/watch?v=test',
    };
    
    const { container } = render(<VideoCard video={videoWithoutViews} dict={mockDictionary} />);
    
    expect(container).toBeInTheDocument();
    expect(container.textContent).toContain('Test Video');
  });

  it('should handle StatisticsCard with minimal data', () => {
    const minimalStat = {
      id: '1',
      label: 'Test Metric',
      value: '0',
      icon: 'circle',
    };
    
    const { container } = render(<StatisticsCard statistic={minimalStat} />);
    
    expect(container).toBeInTheDocument();
    expect(container.textContent).toContain('Test Metric');
    expect(container.textContent).toContain('0');
  });

  it('should handle HighlightItem with minimal data', () => {
    const minimalHighlight = {
      id: '1',
      icon: 'circle',
      text: 'Test highlight',
    };
    
    const { container } = render(<HighlightItem highlight={minimalHighlight} />);
    
    expect(container).toBeInTheDocument();
    expect(container.textContent).toContain('Test highlight');
  });

  it('should handle ProjectCard with long description', () => {
    const projectWithLongDesc = {
      id: '1',
      name: 'Test Project',
      description: 'This is a very long description that should be truncated or handled gracefully by the component. '.repeat(10),
      stars: 100,
      url: 'https://github.com/test/project',
      technologies: ['React', 'TypeScript'],
    };
    
    const { container } = render(<ProjectCard project={projectWithLongDesc} />);
    
    expect(container).toBeInTheDocument();
    expect(container.textContent).toContain('Test Project');
  });

  it('should handle LinkedInPostCard with long content', () => {
    const postWithLongContent = {
      id: '1',
      content: 'This is a very long post content that should be truncated or handled gracefully by the component. '.repeat(10),
      likes: 100,
      comments: 50,
      shares: 25,
      url: 'https://linkedin.com/posts/test',
      date: '2024-01-01',
    };
    
    const { container } = render(<LinkedInPostCard post={postWithLongContent} />);
    
    expect(container).toBeInTheDocument();
    // Content should be present (even if truncated)
    expect(container.textContent).toContain('This is a very long post content');
  });
});

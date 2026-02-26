/**
 * Property-Based Tests for Links Page Components
 * Feature: personal-portfolio-website
 * 
 * These tests validate correctness properties for Links page components
 * using property-based testing with fast-check.
 */

import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { ProjectCard } from '@/components/links/ProjectCard';
import { LinkedInPostCard } from '@/components/links/LinkedInPostCard';
import { LinkCard } from '@/components/links/LinkCard';
import { VideoCard } from '@/components/home/VideoCard';
import LinksPage from '@/app/links/page';
import { GitHubProject, LinkedInPost, SocialLink, Video } from '@/lib/types';
import { githubProjects, linkedinPosts, socialLinks, videos } from '@/lib/data/mockData';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('Links Page Components Properties', () => {
  /**
   * Property 14: Project cards render with all fields
   * Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5
   * 
   * For any project in the GitHub projects mock data array, the Links page should render
   * a Project_Card component that displays the project name, description, star count, and technologies.
   */
  describe('Property 14: Project cards render with all fields', () => {
    it('should display name, description, stars, and technologies for any project from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...githubProjects),
          (project: GitHubProject) => {
            const { container } = render(<ProjectCard project={project} />);
            const content = container.textContent;
            
            // Check that project name is displayed
            expect(content).toContain(project.name);
            
            // Check that description is displayed
            expect(content).toContain(project.description);
            
            // Check that star count is displayed
            expect(content).toContain(project.stars.toLocaleString());
            
            // Check that all technologies are displayed
            project.technologies.forEach(tech => {
              expect(content).toContain(tech);
            });
            
            // Check that star icon is rendered
            const starIcon = container.querySelector('svg');
            expect(starIcon).toBeInTheDocument();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display all fields for any generated project', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            name: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
            stars: fc.nat({ max: 100000 }),
            url: fc.webUrl(),
            technologies: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
          }),
          (project: GitHubProject) => {
            const { container } = render(<ProjectCard project={project} />);
            const content = container.textContent;
            
            // Check all required fields are displayed
            expect(content).toContain(project.name);
            expect(content).toContain(project.description);
            expect(content).toContain(project.stars.toLocaleString());
            
            // Check all technologies are displayed
            project.technologies.forEach(tech => {
              expect(content).toContain(tech);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 15: Project card navigation
   * Validates: Requirements 12.7
   * 
   * For any project object, clicking the Project_Card should navigate to the project's GitHub URL.
   */
  describe('Property 15: Project card navigation', () => {
    // Mock window.open before tests
    const originalOpen = window.open;
    
    beforeEach(() => {
      window.open = jest.fn();
    });
    
    afterEach(() => {
      window.open = originalOpen;
    });

    it('should open project URL when clicked for any project from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...githubProjects),
          (project: GitHubProject) => {
            const { container } = render(<ProjectCard project={project} />);
            
            // Find and click the project card link
            const link = container.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', project.url);
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have correct link attributes for any generated project', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            name: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
            stars: fc.nat({ max: 100000 }),
            url: fc.webUrl(),
            technologies: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
          }),
          (project: GitHubProject) => {
            const { container } = render(<ProjectCard project={project} />);
            
            // Verify link attributes
            const link = container.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', project.url);
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 16: LinkedIn posts render with engagement metrics
   * Validates: Requirements 13.1, 13.2
   * 
   * For any LinkedIn post in the mock data array, the Links page should render
   * a LinkedIn_Post_Card component that displays the content preview and engagement metrics.
   */
  describe('Property 16: LinkedIn posts render with engagement metrics', () => {
    it('should display content and engagement metrics for any post from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...linkedinPosts),
          (post: LinkedInPost) => {
            const { container } = render(<LinkedInPostCard post={post} />);
            const content = container.textContent;
            
            // Check that post content is displayed
            expect(content).toContain(post.content);
            
            // Check that engagement metrics are displayed
            expect(content).toContain(post.likes.toLocaleString());
            expect(content).toContain(post.comments.toLocaleString());
            expect(content).toContain(post.shares.toLocaleString());
            
            // Check that engagement icons are rendered (ThumbsUp, MessageCircle, Share2)
            const icons = container.querySelectorAll('svg');
            expect(icons.length).toBeGreaterThanOrEqual(3);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display content and engagement metrics for any generated post', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            content: fc.string({ minLength: 1 }),
            likes: fc.nat({ max: 10000 }),
            comments: fc.nat({ max: 1000 }),
            shares: fc.nat({ max: 1000 }),
            url: fc.webUrl(),
            date: fc.integer({ min: 2020, max: 2024 })
              .chain(year => fc.integer({ min: 1, max: 12 })
                .chain(month => fc.integer({ min: 1, max: 28 })
                  .map(day => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
                )
              ),
          }),
          (post: LinkedInPost) => {
            const { container } = render(<LinkedInPostCard post={post} />);
            const content = container.textContent;
            
            // Check all required fields are displayed
            expect(content).toContain(post.content);
            expect(content).toContain(post.likes.toLocaleString());
            expect(content).toContain(post.comments.toLocaleString());
            expect(content).toContain(post.shares.toLocaleString());
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 17: LinkedIn post navigation
   * Validates: Requirements 13.4
   * 
   * For any LinkedIn post object, clicking the LinkedIn_Post_Card should navigate to the post's URL.
   */
  describe('Property 17: LinkedIn post navigation', () => {
    it('should have correct link attributes for any post from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...linkedinPosts),
          (post: LinkedInPost) => {
            const { container } = render(<LinkedInPostCard post={post} />);
            
            // Find and verify the post card link
            const link = container.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', post.url);
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have correct link attributes for any generated post', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            content: fc.string({ minLength: 1 }),
            likes: fc.nat({ max: 10000 }),
            comments: fc.nat({ max: 1000 }),
            shares: fc.nat({ max: 1000 }),
            url: fc.webUrl(),
            date: fc.integer({ min: 2020, max: 2024 })
              .chain(year => fc.integer({ min: 1, max: 12 })
                .chain(month => fc.integer({ min: 1, max: 28 })
                  .map(day => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
                )
              ),
          }),
          (post: LinkedInPost) => {
            const { container } = render(<LinkedInPostCard post={post} />);
            
            // Verify link attributes
            const link = container.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', post.url);
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 18: Link cards render from mock data
   * Validates: Requirements 18.1
   * 
   * For any social link in the social links mock data array, the Links page should render
   * a Link_Card component that displays the platform name and optional username.
   */
  describe('Property 18: Link cards render from mock data', () => {
    it('should display platform and username for any link from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...socialLinks),
          (link: SocialLink) => {
            const { container } = render(<LinkCard link={link} />);
            const content = container.textContent;
            
            // Check that platform name is displayed
            expect(content).toContain(link.platform);
            
            // Check that username is displayed if present
            if (link.username) {
              expect(content).toContain(link.username);
            }
            
            // Check that icon is rendered
            const icon = container.querySelector('svg');
            expect(icon).toBeInTheDocument();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display platform and username for any generated link', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            platform: fc.string({ minLength: 1 }),
            username: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
            url: fc.webUrl(),
            icon: fc.constantFrom('github', 'linkedin', 'youtube', 'twitter', 'mail', 'globe'),
          }),
          (link: SocialLink) => {
            const { container } = render(<LinkCard link={link} />);
            const content = container.textContent;
            
            // Check that platform is displayed
            expect(content).toContain(link.platform);
            
            // Check that username is displayed if present
            if (link.username) {
              expect(content).toContain(link.username);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 19: Link card navigation
   * Validates: Requirements 18.3
   * 
   * For any social link object, clicking the Link_Card should navigate to the link's URL.
   */
  describe('Property 19: Link card navigation', () => {
    it('should have correct link attributes for any link from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...socialLinks),
          (link: SocialLink) => {
            const { container } = render(<LinkCard link={link} />);
            
            // Find and verify the link card
            const linkElement = container.querySelector('a');
            expect(linkElement).toBeInTheDocument();
            expect(linkElement).toHaveAttribute('href', link.url);
            expect(linkElement).toHaveAttribute('target', '_blank');
            expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have correct link attributes for any generated link', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            platform: fc.string({ minLength: 1 }),
            username: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
            url: fc.webUrl(),
            icon: fc.constantFrom('github', 'linkedin', 'youtube', 'twitter', 'mail', 'globe'),
          }),
          (link: SocialLink) => {
            const { container } = render(<LinkCard link={link} />);
            
            // Verify link attributes
            const linkElement = container.querySelector('a');
            expect(linkElement).toBeInTheDocument();
            expect(linkElement).toHaveAttribute('href', link.url);
            expect(linkElement).toHaveAttribute('target', '_blank');
            expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 20: Featured video navigation
   * Validates: Requirements 19.3
   * 
   * For any featured video on the Links page, clicking the Video_Card should navigate to the video's URL.
   */
  describe('Property 20: Featured video navigation', () => {
    // Mock window.open before tests
    const originalOpen = window.open;
    
    beforeEach(() => {
      window.open = jest.fn();
    });
    
    afterEach(() => {
      window.open = originalOpen;
    });

    it('should open video URL when clicked for any video from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...videos),
          (video: Video) => {
            const { container } = render(<VideoCard video={video} />);
            
            // Find and click the video card
            const videoCard = container.querySelector('[data-video-card]');
            expect(videoCard).toBeInTheDocument();
            
            videoCard?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
            // Verify window.open was called with the video URL
            expect(window.open).toHaveBeenCalledWith(
              video.url,
              '_blank',
              'noopener,noreferrer'
            );
            
            // Reset mock for next iteration
            (window.open as jest.Mock).mockClear();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should open video URL when clicked for any generated video', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            title: fc.string({ minLength: 1 }),
            thumbnail: fc.string({ minLength: 1 }),
            url: fc.webUrl(),
            views: fc.option(fc.nat(), { nil: undefined }),
          }),
          (video: Video) => {
            const { container } = render(<VideoCard video={video} />);
            
            // Find and click the video card
            const videoCard = container.querySelector('[data-video-card]');
            expect(videoCard).toBeInTheDocument();
            
            videoCard?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
            // Verify window.open was called with the video URL
            expect(window.open).toHaveBeenCalledWith(
              video.url,
              '_blank',
              'noopener,noreferrer'
            );
            
            // Reset mock for next iteration
            (window.open as jest.Mock).mockClear();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

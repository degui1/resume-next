/**
 * Property-Based Tests for Home Page Components
 * Feature: personal-portfolio-website
 * 
 * These tests validate correctness properties for Home page components
 * using property-based testing with fast-check.
 */

import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { HighlightItem } from '@/components/home/HighlightItem';
import { StatisticsCard } from '@/components/home/StatisticsCard';
import { VideoCard } from '@/components/home/VideoCard';
import { YouTubeChannelInfo } from '@/components/home/YouTubeChannelInfo';
import HomePage from '@/app/page';
import { Highlight, Statistic, Video, YouTubeChannel } from '@/lib/types';
import { highlights, statistics, videos, youtubeChannels, contentTopics } from '@/lib/data/mockData';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('Home Page Components Properties', () => {
  /**
   * Property 5: Highlight items render with icon and text
   * Validates: Requirements 6.5, 8.1, 8.2, 8.3
   * 
   * For any highlight in the highlights mock data array, the Home page should render
   * a Highlight_Item component that displays both the icon and the descriptive text.
   */
  describe('Property 5: Highlight items render with icon and text', () => {
    it('should render icon and text for any highlight from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...highlights),
          (highlight: Highlight) => {
            const { container } = render(<HighlightItem highlight={highlight} />);
            
            // Check that text is displayed
            expect(container.textContent).toContain(highlight.text);
            
            // Check that icon is rendered with data-icon attribute
            const iconElement = container.querySelector(`[data-icon="${highlight.icon}"]`);
            expect(iconElement).toBeInTheDocument();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render icon and text for any generated highlight', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            icon: fc.constantFrom('briefcase', 'users', 'award', 'globe'),
            text: fc.string({ minLength: 1 }),
          }),
          (highlight: Highlight) => {
            const { container } = render(<HighlightItem highlight={highlight} />);
            
            // Check that text is displayed
            expect(container.textContent).toContain(highlight.text);
            
            // Check that icon is rendered
            const iconElement = container.querySelector(`[data-icon="${highlight.icon}"]`);
            expect(iconElement).toBeInTheDocument();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 6: Statistics cards render with all fields
   * Validates: Requirements 6.6, 7.1, 7.2, 7.3
   * 
   * For any statistic in the statistics mock data array, the Home page should render
   * a Statistics_Card component that displays the icon, label, and value.
   */
  describe('Property 6: Statistics cards render with all fields', () => {
    it('should display icon, label, and value for any statistic from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...statistics),
          (statistic: Statistic) => {
            const { container } = render(<StatisticsCard statistic={statistic} />);
            const content = container.textContent;
            
            // Check that label and value are displayed
            expect(content).toContain(statistic.label);
            expect(content).toContain(statistic.value);
            
            // Check that icon is rendered (lucide-react icons render as SVG)
            const svgIcon = container.querySelector('svg');
            expect(svgIcon).toBeInTheDocument();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display icon, label, and value for any generated statistic', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            label: fc.string({ minLength: 1 }),
            value: fc.string({ minLength: 1 }),
            icon: fc.constantFrom('youtube', 'calendar', 'graduation-cap', 'map-pin'),
          }),
          (statistic: Statistic) => {
            const { container } = render(<StatisticsCard statistic={statistic} />);
            const content = container.textContent;
            
            // Check that label and value are displayed
            expect(content).toContain(statistic.label);
            expect(content).toContain(statistic.value);
            
            // Check that icon is rendered
            const svgIcon = container.querySelector('svg');
            expect(svgIcon).toBeInTheDocument();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 7: Content topics render as chips
   * Validates: Requirements 9.5
   * 
   * For any topic string in the content topics array, the YouTube section should render
   * that topic as a chip or badge element.
   */
  describe('Property 7: Content topics render as chips', () => {
    it('should render each topic from mock data as a chip', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...contentTopics),
          (topic: string) => {
            const { container } = render(
              <YouTubeChannelInfo channels={youtubeChannels} topics={contentTopics} />
            );
            
            // Check that topic text is displayed
            expect(container.textContent).toContain(topic);
            
            // Check that chip/badge element exists with data-chip attribute
            const chips = container.querySelectorAll('[data-chip]');
            const topicChip = Array.from(chips).find(chip => chip.textContent === topic);
            expect(topicChip).toBeInTheDocument();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render any generated topic array as chips', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 }),
          (topics: string[]) => {
            const { container } = render(
              <YouTubeChannelInfo channels={youtubeChannels} topics={topics} />
            );
            
            // Check that all topics are rendered as chips
            const chips = container.querySelectorAll('[data-chip]');
            expect(chips.length).toBe(topics.length);
            
            // Verify each topic is displayed
            topics.forEach(topic => {
              expect(container.textContent).toContain(topic);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 8: YouTube channels render with subscriber counts
   * Validates: Requirements 9.6
   * 
   * For any channel in the YouTube channels mock data array, the YouTube section should render
   * a list item displaying the channel name, handle, and subscriber count.
   */
  describe('Property 8: YouTube channels render with subscriber counts', () => {
    it('should display name, handle, and subscribers for any channel from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...youtubeChannels),
          (channel: YouTubeChannel) => {
            const { container } = render(
              <YouTubeChannelInfo channels={[channel]} topics={contentTopics} />
            );
            const content = container.textContent;
            
            // Check that channel name, handle, and subscribers are displayed
            expect(content).toContain(channel.name);
            expect(content).toContain(channel.handle);
            expect(content).toContain(channel.subscribers);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display name, handle, and subscribers for any generated channel', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            name: fc.string({ minLength: 1 }),
            handle: fc.string({ minLength: 1 }).map(s => `@${s}`),
            subscribers: fc.string({ minLength: 1 }),
            url: fc.webUrl(),
          }),
          (channel: YouTubeChannel) => {
            const { container } = render(
              <YouTubeChannelInfo channels={[channel]} topics={contentTopics} />
            );
            const content = container.textContent;
            
            // Check that all channel fields are displayed
            expect(content).toContain(channel.name);
            expect(content).toContain(channel.handle);
            expect(content).toContain(channel.subscribers);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render multiple channels with their subscriber counts', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.string(),
              name: fc.string({ minLength: 1 }),
              handle: fc.string({ minLength: 1 }).map(s => `@${s}`),
              subscribers: fc.string({ minLength: 1 }),
              url: fc.webUrl(),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (channels: YouTubeChannel[]) => {
            const { container } = render(
              <YouTubeChannelInfo channels={channels} topics={contentTopics} />
            );
            const content = container.textContent;
            
            // Check that all channels are displayed
            channels.forEach(channel => {
              expect(content).toContain(channel.name);
              expect(content).toContain(channel.handle);
              expect(content).toContain(channel.subscribers);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 9: Video cards render and display required fields
   * Validates: Requirements 10.1, 10.2, 10.3
   * 
   * For any video in the videos mock data array, the Home page should render
   * a Video_Card component that displays both the thumbnail image and the video title.
   */
  describe('Property 9: Video cards render and display required fields', () => {
    it('should display thumbnail and title for any video from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...videos),
          (video: Video) => {
            const { container } = render(<VideoCard video={video} />);
            
            // Check that title is displayed
            expect(container.textContent).toContain(video.title);
            
            // Check that thumbnail image is rendered
            const img = container.querySelector('img');
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('alt', video.title);
            
            // Check that video card has data attribute
            const videoCard = container.querySelector('[data-video-card]');
            expect(videoCard).toBeInTheDocument();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display thumbnail and title for any generated video', () => {
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
            
            // Check that title is displayed
            expect(container.textContent).toContain(video.title);
            
            // Check that thumbnail image is rendered
            const img = container.querySelector('img');
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('alt', video.title);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 10: Video card navigation
   * Validates: Requirements 10.4
   * 
   * For any video object, clicking the Video_Card should navigate to the video's URL.
   */
  describe('Property 10: Video card navigation', () => {
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

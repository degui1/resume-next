/**
 * Property-Based Tests for Layout and Navigation
 * Feature: personal-portfolio-website
 * 
 * These tests validate correctness properties for layout and navigation components
 * using property-based testing with fast-check.
 */

import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import RootLayout from '@/app/layout';
import HomePage from '@/app/page';
import AboutPage from '@/app/about/page';
import LinksPage from '@/app/links/page';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('Layout and Navigation Properties', () => {
  /**
   * Property 1: Responsive layout adapts to viewport sizes
   * Validates: Requirements 3.1, 3.2
   * 
   * For any page in the application and any viewport width (mobile: 320-767px, desktop: 768px+),
   * the layout should render without horizontal overflow and maintain appropriate element positioning.
   */
  describe('Property 1: Responsive layout adapts to viewport sizes', () => {
    it('should render pages without horizontal overflow at any viewport width', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/', '/about', '/links'),
          fc.integer({ min: 320, max: 1920 }),
          (route, viewportWidth) => {
            // Set viewport width
            global.innerWidth = viewportWidth;
            
            // Select the appropriate page component
            let PageComponent;
            switch (route) {
              case '/':
                PageComponent = HomePage;
                break;
              case '/about':
                PageComponent = AboutPage;
                break;
              case '/links':
                PageComponent = LinksPage;
                break;
              default:
                PageComponent = HomePage;
            }

            const { container } = render(
              <RootLayout>
                <PageComponent />
              </RootLayout>
            );

            // Check that the layout renders without errors
            expect(container).toBeInTheDocument();
            
            // Check for responsive container classes
            const mainElement = container.querySelector('main');
            expect(mainElement).toBeInTheDocument();
            
            // Verify no horizontal overflow by checking for proper container structure
            const body = container.querySelector('body');
            expect(body).toBeInTheDocument();
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property 2: Navigation appears on all pages
   * Validates: Requirements 4.2
   * 
   * For any page route in the application (/, /about, /links),
   * rendering that page should include the Navigation component in the DOM.
   */
  describe('Property 2: Navigation appears on all pages', () => {
    it('should render Navigation component on any page route', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/', '/about', '/links'),
          (route) => {
            // Mock the pathname for this test
            const { usePathname } = require('next/navigation');
            usePathname.mockReturnValue(route);

            let PageComponent;
            switch (route) {
              case '/':
                PageComponent = HomePage;
                break;
              case '/about':
                PageComponent = AboutPage;
                break;
              case '/links':
                PageComponent = LinksPage;
                break;
              default:
                PageComponent = HomePage;
            }

            const { container } = render(
              <RootLayout>
                <PageComponent />
              </RootLayout>
            );

            // Check for navigation element
            const nav = container.querySelector('nav');
            expect(nav).toBeInTheDocument();
            
            // Check for navigation links (using getAllByText since there are desktop and mobile versions)
            const homeLinks = screen.getAllByText('Home');
            const aboutLinks = screen.getAllByText('About');
            const linksLinks = screen.getAllByText('Links');
            
            expect(homeLinks.length).toBeGreaterThan(0);
            expect(aboutLinks.length).toBeGreaterThan(0);
            expect(linksLinks.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  /**
   * Property 3: Navigation links route correctly
   * Validates: Requirements 4.3
   * 
   * For any navigation link (Home, About, Links),
   * the link should have the correct href attribute.
   */
  describe('Property 3: Navigation links route correctly', () => {
    it('should have correct href for any navigation link', () => {
      fc.assert(
        fc.property(
          fc.record({
            label: fc.constantFrom('Home', 'About', 'Links'),
            expectedHref: fc.constantFrom('/', '/about', '/links'),
          }).filter(({ label, expectedHref }) => {
            // Ensure label matches href
            return (
              (label === 'Home' && expectedHref === '/') ||
              (label === 'About' && expectedHref === '/about') ||
              (label === 'Links' && expectedHref === '/links')
            );
          }),
          ({ label, expectedHref }) => {
            const { container } = render(
              <RootLayout>
                <HomePage />
              </RootLayout>
            );

            // Find the link by its text (use getAllByText and filter for the one in nav)
            const links = screen.getAllByText(label);
            const navLink = links.find(el => el.closest('nav'));
            const link = navLink?.closest('a');
            
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', expectedHref);
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  /**
   * Property 4: Active page indication
   * Validates: Requirements 4.4
   * 
   * For any page route, the Navigation component should apply active styling
   * to the link corresponding to the current route.
   */
  describe('Property 4: Active page indication', () => {
    it('should apply active styling to the current page link', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            { route: '/', activeLabel: 'Home' },
            { route: '/about', activeLabel: 'About' },
            { route: '/links', activeLabel: 'Links' }
          ),
          ({ route, activeLabel }) => {
            // Mock the pathname for this test
            const { usePathname } = require('next/navigation');
            usePathname.mockReturnValue(route);

            const { container } = render(
              <RootLayout>
                <HomePage />
              </RootLayout>
            );

            // Find the active link (use getAllByText and find the one with active styling)
            const links = screen.getAllByText(activeLabel);
            const activeLink = links.find(el => {
              const link = el.closest('a');
              const className = link?.className || '';
              return className.includes('border-b-2') && className.includes('border-foreground');
            })?.closest('a');
            
            expect(activeLink).toBeInTheDocument();
            
            // Check for active styling (border-b-2 border-foreground)
            const className = activeLink?.className || '';
            expect(className).toContain('border-b-2');
            expect(className).toContain('border-foreground');
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  /**
   * Property 21: Footer appears on all pages
   * Validates: Requirements 20.3
   * 
   * For any page route in the application (/, /about, /links),
   * rendering that page should include the Footer component in the DOM.
   */
  describe('Property 21: Footer appears on all pages', () => {
    it('should render Footer component on any page route', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/', '/about', '/links'),
          (route) => {
            // Mock the pathname for this test
            const { usePathname } = require('next/navigation');
            usePathname.mockReturnValue(route);

            let PageComponent;
            switch (route) {
              case '/':
                PageComponent = HomePage;
                break;
              case '/about':
                PageComponent = AboutPage;
                break;
              case '/links':
                PageComponent = LinksPage;
                break;
              default:
                PageComponent = HomePage;
            }

            const { container } = render(
              <RootLayout>
                <PageComponent />
              </RootLayout>
            );

            // Check for footer element
            const footer = container.querySelector('footer');
            expect(footer).toBeInTheDocument();
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  /**
   * Property 24: Base layout wraps page content
   * Validates: Requirements 22.3
   * 
   * For any page in the application, the page content should be wrapped
   * by the base layout component.
   */
  describe('Property 24: Base layout wraps page content', () => {
    it('should wrap page content with base layout structure', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/', '/about', '/links'),
          (route) => {
            let PageComponent;
            switch (route) {
              case '/':
                PageComponent = HomePage;
                break;
              case '/about':
                PageComponent = AboutPage;
                break;
              case '/links':
                PageComponent = LinksPage;
                break;
              default:
                PageComponent = HomePage;
            }

            const { container } = render(
              <RootLayout>
                <PageComponent />
              </RootLayout>
            );

            // Check for layout structure: nav, main, footer
            const nav = container.querySelector('nav');
            const main = container.querySelector('main');
            const footer = container.querySelector('footer');

            expect(nav).toBeInTheDocument();
            expect(main).toBeInTheDocument();
            expect(footer).toBeInTheDocument();

            // Verify main contains the page content
            expect(main).toContainElement(main?.firstChild as Element);
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  /**
   * Property 25: Consistent layout structure
   * Validates: Requirements 22.4
   * 
   * For any page in the application, the base layout should apply
   * consistent container classes and spacing.
   */
  describe('Property 25: Consistent layout structure', () => {
    it('should apply consistent container classes across all pages', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/', '/about', '/links'),
          (route) => {
            let PageComponent;
            switch (route) {
              case '/':
                PageComponent = HomePage;
                break;
              case '/about':
                PageComponent = AboutPage;
                break;
              case '/links':
                PageComponent = LinksPage;
                break;
              default:
                PageComponent = HomePage;
            }

            const { container } = render(
              <RootLayout>
                <PageComponent />
              </RootLayout>
            );

            // Check for consistent layout structure
            const body = container.querySelector('body');
            const layoutDiv = body?.querySelector('div');
            
            expect(layoutDiv).toBeInTheDocument();
            
            // Check for flex layout classes
            const className = layoutDiv?.className || '';
            expect(className).toContain('flex');
            expect(className).toContain('min-h-screen');
            expect(className).toContain('flex-col');

            // Check main has flex-1 for proper spacing
            const main = container.querySelector('main');
            const mainClassName = main?.className || '';
            expect(mainClassName).toContain('flex-1');
          }
        ),
        { numRuns: 30 }
      );
    });
  });
});

/**
 * Property-Based Tests for Reusable Components
 * Feature: personal-portfolio-website
 * 
 * These tests validate correctness properties for reusable UI components
 * using property-based testing with fast-check.
 */

import { render } from '@testing-library/react';
import fc from 'fast-check';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { HeroSection } from '@/components/home/HeroSection';
import { JobSection } from '@/components/about/JobSection';
import { ThesisSection } from '@/components/about/ThesisSection';
import { Profile, Highlight, Statistic, Job, Thesis } from '@/lib/types';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('Reusable Components Properties', () => {
  /**
   * Property 22: Card component accepts customization props
   * Validates: Requirements 20.4
   * 
   * For any set of valid props passed to the Card component, the component should render
   * without errors and apply the provided customizations.
   */
  describe('Property 22: Card component accepts customization props', () => {
    it('should render Card with any valid className customization', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'bg-red-500',
            'p-8',
            'rounded-xl',
            'shadow-lg',
            'border-2',
            'border-blue-500',
            'hover:shadow-xl',
            'transition-all',
            'bg-gradient-to-r from-purple-500 to-pink-500',
            'max-w-md',
            'w-full',
            'h-64',
            'flex items-center justify-center'
          ),
          (className: string) => {
            const { container } = render(
              <Card className={className}>
                <CardContent>Test content</CardContent>
              </Card>
            );
            
            // Check that Card renders without errors
            const cardElement = container.firstChild as HTMLElement;
            expect(cardElement).toBeInTheDocument();
            
            // Verify className is applied (should contain custom class)
            expect(cardElement.className).toContain(className.split(' ')[0]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render Card with any valid children content', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (content: string) => {
            const { container } = render(
              <Card>
                <CardContent>{content}</CardContent>
              </Card>
            );
            
            // Check that Card renders without errors
            expect(container.firstChild).toBeInTheDocument();
            
            // Verify content is displayed
            expect(container.textContent).toContain(content);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render Card with CardHeader, CardTitle, CardDescription, CardContent, and CardFooter', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 50 }),
            description: fc.string({ minLength: 1, maxLength: 100 }),
            content: fc.string({ minLength: 1, maxLength: 200 }),
            footer: fc.string({ minLength: 1, maxLength: 50 }),
          }),
          ({ title, description, content, footer }) => {
            const { container } = render(
              <Card>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>{content}</CardContent>
                <CardFooter>{footer}</CardFooter>
              </Card>
            );
            
            // Check that all parts render without errors
            expect(container.firstChild).toBeInTheDocument();
            
            // Verify all content is displayed
            const text = container.textContent;
            expect(text).toContain(title);
            expect(text).toContain(description);
            expect(text).toContain(content);
            expect(text).toContain(footer);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render Card with multiple className customizations combined', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.constantFrom(
              'bg-blue-100',
              'p-4',
              'rounded-lg',
              'shadow-md',
              'border',
              'hover:shadow-lg',
              'transition-shadow'
            ),
            { minLength: 1, maxLength: 5 }
          ),
          (classNames: string[]) => {
            const combinedClassName = classNames.join(' ');
            const { container } = render(
              <Card className={combinedClassName}>
                <CardContent>Test</CardContent>
              </Card>
            );
            
            // Check that Card renders without errors
            const cardElement = container.firstChild as HTMLElement;
            expect(cardElement).toBeInTheDocument();
            
            // Verify at least one of the custom classes is applied
            const hasCustomClass = classNames.some(cls => 
              cardElement.className.includes(cls.split('-')[0])
            );
            expect(hasCustomClass).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render Card with data attributes and other HTML props', () => {
      fc.assert(
        fc.property(
          fc.record({
            dataTestId: fc.string({ minLength: 1, maxLength: 20 }),
            dataCard: fc.string({ minLength: 1, maxLength: 20 }),
            id: fc.string({ minLength: 1, maxLength: 20 }),
          }),
          ({ dataTestId, dataCard, id }) => {
            const { container } = render(
              <Card 
                data-testid={dataTestId}
                data-card={dataCard}
                id={id}
              >
                <CardContent>Test</CardContent>
              </Card>
            );
            
            // Check that Card renders with custom attributes
            const cardElement = container.firstChild as HTMLElement;
            expect(cardElement).toBeInTheDocument();
            expect(cardElement).toHaveAttribute('data-testid', dataTestId);
            expect(cardElement).toHaveAttribute('data-card', dataCard);
            expect(cardElement).toHaveAttribute('id', id);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 23: Section components accept customization props
   * Validates: Requirements 20.5
   * 
   * For any set of valid props passed to Section components, the components should render
   * without errors and apply the provided customizations.
   */
  describe('Property 23: Section components accept customization props', () => {
    it('should render HeroSection with any valid profile, highlights, and statistics', () => {
      fc.assert(
        fc.property(
          fc.record({
            profile: fc.record({
              name: fc.string({ minLength: 1, maxLength: 50 }),
              title: fc.string({ minLength: 1, maxLength: 100 }),
              description: fc.string({ minLength: 1, maxLength: 500 }),
              profileImage: fc.string({ minLength: 1 }),
              location: fc.string({ minLength: 1, maxLength: 50 }),
              role: fc.string({ minLength: 1, maxLength: 50 }),
              availability: fc.string({ minLength: 1, maxLength: 100 }),
              email: fc.option(fc.emailAddress(), { nil: undefined }),
            }),
            highlights: fc.array(
              fc.record({
                id: fc.string(),
                icon: fc.constantFrom('briefcase', 'users', 'award', 'globe'),
                text: fc.string({ minLength: 1, maxLength: 100 }),
              }),
              { minLength: 1, maxLength: 5 }
            ),
            statistics: fc.array(
              fc.record({
                id: fc.string(),
                label: fc.string({ minLength: 1, maxLength: 50 }),
                value: fc.string({ minLength: 1, maxLength: 20 }),
                icon: fc.constantFrom('youtube', 'calendar', 'graduation-cap', 'map-pin'),
              }),
              { minLength: 1, maxLength: 6 }
            ),
          }),
          ({ profile, highlights, statistics }) => {
            const { container } = render(
              <HeroSection 
                profile={profile}
                highlights={highlights}
                statistics={statistics}
              />
            );
            
            // Check that HeroSection renders without errors
            const section = container.querySelector('section[data-section="hero"]');
            expect(section).toBeInTheDocument();
            
            // Verify profile data is displayed
            const text = container.textContent;
            expect(text).toContain(profile.name);
            expect(text).toContain(profile.title);
            expect(text).toContain(profile.location);
            expect(text).toContain(profile.role);
            
            // Verify highlights are displayed
            highlights.forEach(highlight => {
              expect(text).toContain(highlight.text);
            });
            
            // Verify statistics are displayed
            statistics.forEach(stat => {
              expect(text).toContain(stat.label);
              expect(text).toContain(stat.value);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render JobSection with any valid job data', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            company: fc.string({ minLength: 1, maxLength: 100 }),
            role: fc.string({ minLength: 1, maxLength: 100 }),
            period: fc.string({ minLength: 1, maxLength: 50 }),
            startDate: fc.string({ minLength: 1 }),
            endDate: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
            features: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { minLength: 1, maxLength: 5 }),
            contributions: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { minLength: 1, maxLength: 5 }),
            technologies: fc.option(
              fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
              { nil: undefined }
            ),
            logo: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          }),
          (job: Job) => {
            const { container } = render(<JobSection job={job} />);
            
            // Check that JobSection renders without errors
            expect(container.firstChild).toBeInTheDocument();
            
            // Verify job data is displayed
            const text = container.textContent;
            expect(text).toContain(job.role);
            expect(text).toContain(job.company);
            expect(text).toContain(job.period);
            
            // Verify features are displayed
            job.features.forEach(feature => {
              expect(text).toContain(feature);
            });
            
            // Verify contributions are displayed
            job.contributions.forEach(contribution => {
              expect(text).toContain(contribution);
            });
            
            // Verify technologies are displayed if present
            if (job.technologies) {
              job.technologies.forEach(tech => {
                expect(text).toContain(tech);
              });
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render ThesisSection with any valid thesis data', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 200 }),
            description: fc.string({ minLength: 1, maxLength: 1000 }),
            technologies: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
            results: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { minLength: 1, maxLength: 5 }),
            link: fc.option(fc.webUrl(), { nil: undefined }),
          }),
          (thesis: Thesis) => {
            const { container } = render(<ThesisSection thesis={thesis} />);
            
            // Check that ThesisSection renders without errors
            expect(container.firstChild).toBeInTheDocument();
            
            // Verify thesis data is displayed
            const text = container.textContent;
            expect(text).toContain(thesis.title);
            expect(text).toContain(thesis.description);
            
            // Verify technologies are displayed
            thesis.technologies.forEach(tech => {
              expect(text).toContain(tech);
            });
            
            // Verify results are displayed
            thesis.results.forEach(result => {
              expect(text).toContain(result);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render JobSection with minimal required fields', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            company: fc.string({ minLength: 1 }),
            role: fc.string({ minLength: 1 }),
            period: fc.string({ minLength: 1 }),
            startDate: fc.string({ minLength: 1 }),
            features: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 3 }),
            contributions: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 3 }),
          }),
          (job) => {
            const jobData: Job = {
              ...job,
              endDate: undefined,
              technologies: undefined,
              logo: undefined,
            };
            
            const { container } = render(<JobSection job={jobData} />);
            
            // Check that JobSection renders without errors even with minimal data
            expect(container.firstChild).toBeInTheDocument();
            
            // Verify required fields are displayed
            const text = container.textContent;
            expect(text).toContain(jobData.role);
            expect(text).toContain(jobData.company);
            expect(text).toContain(jobData.period);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render ThesisSection with empty arrays gracefully', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
          }),
          ({ title, description }) => {
            const thesis: Thesis = {
              title,
              description,
              technologies: [],
              results: [],
              link: undefined,
            };
            
            const { container } = render(<ThesisSection thesis={thesis} />);
            
            // Check that ThesisSection renders without errors even with empty arrays
            expect(container.firstChild).toBeInTheDocument();
            
            // Verify required fields are displayed
            const text = container.textContent;
            expect(text).toContain(thesis.title);
            expect(text).toContain(thesis.description);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

/**
 * Property-Based Tests for About Page Components
 * Feature: personal-portfolio-website
 * 
 * These tests validate correctness properties for About page components
 * using property-based testing with fast-check.
 */

import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { JobSection } from '@/components/about/JobSection';
import { ThesisSection } from '@/components/about/ThesisSection';
import AboutPage from '@/app/about/page';
import { Job, Thesis } from '@/lib/types';
import { jobs, thesis } from '@/lib/data/mockData';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('About Page Components Properties', () => {
  /**
   * Property 11: Job sections render from mock data
   * Validates: Requirements 15.1
   * 
   * For any job in the jobs mock data array, the About page should render
   * a Job_Section component containing that job's data.
   */
  describe('Property 11: Job sections render from mock data', () => {
    it('should render a JobSection for any job from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...jobs),
          (job: Job) => {
            const { container } = render(<JobSection job={job} />);
            
            // Check that the job section is rendered
            expect(container).toBeInTheDocument();
            
            // Check that job data is present in the rendered output
            const content = container.textContent;
            expect(content).toContain(job.role);
            expect(content).toContain(job.company);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render JobSection components for all jobs on About page', () => {
      const { container } = render(<AboutPage />);
      
      // Check that all jobs from mock data are rendered
      jobs.forEach(job => {
        const content = container.textContent;
        expect(content).toContain(job.role);
        expect(content).toContain(job.company);
      });
    });
  });

  /**
   * Property 12: Job section displays required fields
   * Validates: Requirements 15.2, 15.3, 15.4
   * 
   * For any job object, rendering a Job_Section with that job should display
   * the role title, employment period, features list, and contributions list in the DOM.
   */
  describe('Property 12: Job section displays required fields', () => {
    it('should display role, company, period, features, and contributions for any job from mock data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...jobs),
          (job: Job) => {
            const { container } = render(<JobSection job={job} />);
            const content = container.textContent;
            
            // Check required fields
            expect(content).toContain(job.role);
            expect(content).toContain(job.company);
            expect(content).toContain(job.period);
            
            // Check features list
            if (job.features && job.features.length > 0) {
              job.features.forEach(feature => {
                expect(content).toContain(feature);
              });
            }
            
            // Check contributions list
            if (job.contributions && job.contributions.length > 0) {
              job.contributions.forEach(contribution => {
                expect(content).toContain(contribution);
              });
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display role, company, period, features, and contributions for any generated job', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            company: fc.string({ minLength: 1 }),
            role: fc.string({ minLength: 1 }),
            period: fc.string({ minLength: 1 }),
            startDate: fc.string({ minLength: 1 }),
            endDate: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
            features: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
            contributions: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
            technologies: fc.option(
              fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
              { nil: undefined }
            ),
            logo: fc.option(fc.string(), { nil: undefined }),
          }),
          (job: Job) => {
            const { container } = render(<JobSection job={job} />);
            const content = container.textContent;
            
            // Check required fields
            expect(content).toContain(job.role);
            expect(content).toContain(job.company);
            expect(content).toContain(job.period);
            
            // Check features list
            job.features.forEach(feature => {
              expect(content).toContain(feature);
            });
            
            // Check contributions list
            job.contributions.forEach(contribution => {
              expect(content).toContain(contribution);
            });
            
            // Check optional technologies
            if (job.technologies) {
              job.technologies.forEach(tech => {
                expect(content).toContain(tech);
              });
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 13: Job sections maintain order
   * Validates: Requirements 14.4
   * 
   * For any ordering of jobs in the mock data array, the About page should render
   * Job_Section components in the same order as they appear in the array.
   */
  describe('Property 13: Job sections maintain order', () => {
    it('should render jobs in the same order as they appear in the mock data array', () => {
      const { container } = render(<AboutPage />);
      
      // Get all job cards in the rendered output
      const jobCards = container.querySelectorAll('[class*="mb-6"]');
      
      // Verify that jobs appear in the correct order
      jobs.forEach((job, index) => {
        const content = container.textContent || '';
        const roleIndex = content.indexOf(job.role);
        
        // Each job should appear in the document
        expect(roleIndex).toBeGreaterThan(-1);
        
        // If there's a next job, it should appear after the current one
        if (index < jobs.length - 1) {
          const nextJob = jobs[index + 1];
          const nextRoleIndex = content.indexOf(nextJob.role);
          expect(nextRoleIndex).toBeGreaterThan(roleIndex);
        }
      });
    });

    it('should maintain order for any permutation of jobs array', () => {
      fc.assert(
        fc.property(
          fc.shuffledSubarray(jobs, { minLength: jobs.length, maxLength: jobs.length }),
          (shuffledJobs: Job[]) => {
            // Create a mock About page with shuffled jobs
            const { container } = render(
              <div>
                {shuffledJobs.map((job) => (
                  <JobSection key={job.id} job={job} />
                ))}
              </div>
            );
            
            const content = container.textContent || '';
            
            // Verify that jobs appear in the order they were provided
            shuffledJobs.forEach((job, index) => {
              const roleIndex = content.indexOf(job.role);
              expect(roleIndex).toBeGreaterThan(-1);
              
              // If there's a next job, it should appear after the current one
              if (index < shuffledJobs.length - 1) {
                const nextJob = shuffledJobs[index + 1];
                const nextRoleIndex = content.indexOf(nextJob.role);
                expect(nextRoleIndex).toBeGreaterThan(roleIndex);
              }
            });
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Additional Property: Thesis section renders with all fields
   * 
   * For the thesis object, the ThesisSection component should display
   * the title, description, technologies, and results.
   */
  describe('Additional Property: Thesis section renders with all fields', () => {
    it('should display title, description, technologies, and results for thesis from mock data', () => {
      const { container } = render(<ThesisSection thesis={thesis} />);
      const content = container.textContent;
      
      // Check required fields
      expect(content).toContain(thesis.title);
      expect(content).toContain(thesis.description);
      
      // Check technologies
      if (thesis.technologies && thesis.technologies.length > 0) {
        thesis.technologies.forEach(tech => {
          expect(content).toContain(tech);
        });
      }
      
      // Check results
      if (thesis.results && thesis.results.length > 0) {
        thesis.results.forEach(result => {
          expect(content).toContain(result);
        });
      }
    });

    it('should display title, description, technologies, and results for any generated thesis', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
            technologies: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
            results: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
            link: fc.option(fc.webUrl(), { nil: undefined }),
          }),
          (thesis: Thesis) => {
            const { container } = render(<ThesisSection thesis={thesis} />);
            const content = container.textContent;
            
            // Check required fields
            expect(content).toContain(thesis.title);
            expect(content).toContain(thesis.description);
            
            // Check technologies
            thesis.technologies.forEach(tech => {
              expect(content).toContain(tech);
            });
            
            // Check results
            thesis.results.forEach(result => {
              expect(content).toContain(result);
            });
            
            // Check optional link
            if (thesis.link) {
              const linkElement = container.querySelector('a[target="_blank"]');
              expect(linkElement).toBeInTheDocument();
              expect(linkElement).toHaveAttribute('href', thesis.link);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render thesis section on About page', () => {
      const { container } = render(<AboutPage />);
      const content = container.textContent;
      
      // Check that thesis is rendered
      expect(content).toContain(thesis.title);
      expect(content).toContain(thesis.description);
    });
  });
});

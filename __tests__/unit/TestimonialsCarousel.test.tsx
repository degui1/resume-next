import { render, screen, fireEvent } from '@testing-library/react';
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel';

const mockTestimonials = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Software Engineer',
    company: 'Tech Corp',
    text: 'Great work on the project!',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Product Manager',
    company: 'Innovation Inc',
    text: 'Excellent collaboration and delivery.',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    role: 'Tech Lead',
    company: 'StartupXYZ',
    text: 'Outstanding technical skills.',
  },
];

const mockDict = {};

describe('TestimonialsCarousel', () => {
  it('should render the first testimonial by default', () => {
    render(<TestimonialsCarousel testimonials={mockTestimonials} dict={mockDict} />);
    
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'blockquote' && content.includes('Great work on the project!');
    })).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
  });

  it('should navigate to next testimonial when next button is clicked', () => {
    render(<TestimonialsCarousel testimonials={mockTestimonials} dict={mockDict} />);
    
    const nextButton = screen.getByLabelText('Next testimonial');
    fireEvent.click(nextButton);
    
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'blockquote' && content.includes('Excellent collaboration and delivery.');
    })).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should navigate to previous testimonial when previous button is clicked', () => {
    render(<TestimonialsCarousel testimonials={mockTestimonials} dict={mockDict} />);
    
    // First go to next
    const nextButton = screen.getByLabelText('Next testimonial');
    fireEvent.click(nextButton);
    
    // Then go back to previous
    const previousButton = screen.getByLabelText('Previous testimonial');
    fireEvent.click(previousButton);
    
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'blockquote' && content.includes('Great work on the project!');
    })).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should loop back to first testimonial after last when clicking next', () => {
    render(<TestimonialsCarousel testimonials={mockTestimonials} dict={mockDict} />);
    
    const nextButton = screen.getByLabelText('Next testimonial');
    
    // Click next 3 times to go through all testimonials
    fireEvent.click(nextButton); // Now at index 1
    fireEvent.click(nextButton); // Now at index 2
    fireEvent.click(nextButton); // Should loop back to index 0
    
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'blockquote' && content.includes('Great work on the project!');
    })).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should loop to last testimonial when clicking previous from first', () => {
    render(<TestimonialsCarousel testimonials={mockTestimonials} dict={mockDict} />);
    
    const previousButton = screen.getByLabelText('Previous testimonial');
    fireEvent.click(previousButton);
    
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'blockquote' && content.includes('Outstanding technical skills.');
    })).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('should display correct position indicators', () => {
    render(<TestimonialsCarousel testimonials={mockTestimonials} dict={mockDict} />);
    
    // Check initial counter
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    
    // Navigate to next
    const nextButton = screen.getByLabelText('Next testimonial');
    fireEvent.click(nextButton);
    
    // Check updated counter
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('should navigate to specific testimonial when clicking dot indicator', () => {
    render(<TestimonialsCarousel testimonials={mockTestimonials} dict={mockDict} />);
    
    // Click on the third dot (index 2)
    const thirdDot = screen.getByLabelText('Go to testimonial 3');
    fireEvent.click(thirdDot);
    
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'blockquote' && content.includes('Outstanding technical skills.');
    })).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  it('should render testimonial without image using initial', () => {
    render(<TestimonialsCarousel testimonials={mockTestimonials} dict={mockDict} />);
    
    // Check that the initial "J" is rendered for John Doe (no image provided)
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('should render all navigation controls', () => {
    render(<TestimonialsCarousel testimonials={mockTestimonials} dict={mockDict} />);
    
    expect(screen.getByLabelText('Previous testimonial')).toBeInTheDocument();
    expect(screen.getByLabelText('Next testimonial')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to testimonial 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to testimonial 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to testimonial 3')).toBeInTheDocument();
  });
});

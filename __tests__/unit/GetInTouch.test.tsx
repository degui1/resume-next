import { render, screen, fireEvent } from '@testing-library/react';
import { GetInTouch } from '@/components/home/GetInTouch';
import { mockDictionary } from '../utils/mockDictionary.util';

describe('GetInTouch Component', () => {
  const defaultProps = {
    dict: mockDictionary,
    githubUrl: 'https://github.com/testuser',
    linkedinUrl: 'https://linkedin.com/in/testuser',
    contactEmail: 'test@example.com',
    lang: 'en',
  };

  it('should render contact form with email input', () => {
    render(<GetInTouch {...defaultProps} />);
    
    const emailInput = screen.getByPlaceholderText(mockDictionary.home.contact.emailPlaceholder);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
  });

  it('should render title and subtitle', () => {
    render(<GetInTouch {...defaultProps} />);
    
    expect(screen.getByText(mockDictionary.home.contact.title)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.home.contact.subtitle)).toBeInTheDocument();
  });

  it('should render social links when provided', () => {
    render(<GetInTouch {...defaultProps} />);
    
    const githubLink = screen.getByLabelText('GitHub');
    const linkedinLink = screen.getByLabelText('LinkedIn');
    const emailLink = screen.getByLabelText('Email');
    
    expect(githubLink).toHaveAttribute('href', 'https://github.com/testuser');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/testuser');
    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
  });

  it('should not render GitHub link when not provided', () => {
    const propsWithoutGithub = { ...defaultProps, githubUrl: undefined };
    render(<GetInTouch {...propsWithoutGithub} />);
    
    const githubLink = screen.queryByLabelText('GitHub');
    expect(githubLink).not.toBeInTheDocument();
  });

  it('should not render LinkedIn link when not provided', () => {
    const propsWithoutLinkedin = { ...defaultProps, linkedinUrl: undefined };
    render(<GetInTouch {...propsWithoutLinkedin} />);
    
    const linkedinLink = screen.queryByLabelText('LinkedIn');
    expect(linkedinLink).not.toBeInTheDocument();
  });

  it('should update email input value on change', () => {
    render(<GetInTouch {...defaultProps} />);
    
    const emailInput = screen.getByPlaceholderText(mockDictionary.home.contact.emailPlaceholder) as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    
    expect(emailInput.value).toBe('user@example.com');
  });

  it('should validate email format with HTML5 validation', () => {
    render(<GetInTouch {...defaultProps} />);
    
    const emailInput = screen.getByPlaceholderText(mockDictionary.home.contact.emailPlaceholder);
    
    // HTML5 email validation is handled by the browser
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('should validate required field with HTML5 validation', () => {
    render(<GetInTouch {...defaultProps} />);
    
    const emailInput = screen.getByPlaceholderText(mockDictionary.home.contact.emailPlaceholder);
    
    // HTML5 required validation is handled by the browser
    expect(emailInput).toHaveAttribute('required');
  });

  it('should render submit button', () => {
    render(<GetInTouch {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: mockDictionary.home.contact.submitButton });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should render link to links page', () => {
    render(<GetInTouch {...defaultProps} />);
    
    const linksPageLink = screen.getByRole('link', { name: new RegExp(mockDictionary.home.contact.moreDetails, 'i') });
    expect(linksPageLink).toBeInTheDocument();
    expect(linksPageLink).toHaveAttribute('href', '/en/links');
  });

  it('should use default contact email when not provided', () => {
    const propsWithoutEmail = { ...defaultProps, contactEmail: undefined };
    render(<GetInTouch {...propsWithoutEmail} />);
    
    const emailLink = screen.getByLabelText('Email');
    expect(emailLink).toHaveAttribute('href', 'mailto:your-email@example.com');
  });

  it('should render form element', () => {
    render(<GetInTouch {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: mockDictionary.home.contact.submitButton });
    const form = submitButton.closest('form');
    
    expect(form).toBeInTheDocument();
  });
});

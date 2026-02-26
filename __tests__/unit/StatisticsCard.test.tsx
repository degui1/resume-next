import { render, screen } from '@testing-library/react';
import { StatisticsCard } from '@/components/home/StatisticsCard';

describe('StatisticsCard Component', () => {
  it('should display all statistic fields', () => {
    const stat = {
      id: '1',
      label: 'Test Metric',
      value: '100+',
      icon: 'youtube',
    };
    
    const { container } = render(<StatisticsCard statistic={stat} />);
    
    // Label should be displayed
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    
    // Value should be displayed
    expect(screen.getByText('100+')).toBeInTheDocument();
    
    // Icon should be rendered
    const iconElement = container.querySelector('svg');
    expect(iconElement).toBeInTheDocument();
  });

  it('should display YouTube icon correctly', () => {
    const stat = {
      id: '1',
      label: 'YouTube Subscribers',
      value: '117K+',
      icon: 'youtube',
    };
    
    render(<StatisticsCard statistic={stat} />);
    
    expect(screen.getByText('YouTube Subscribers')).toBeInTheDocument();
    expect(screen.getByText('117K+')).toBeInTheDocument();
  });

  it('should display calendar icon correctly', () => {
    const stat = {
      id: '2',
      label: 'Years of Experience',
      value: '10+',
      icon: 'calendar',
    };
    
    render(<StatisticsCard statistic={stat} />);
    
    expect(screen.getByText('Years of Experience')).toBeInTheDocument();
    expect(screen.getByText('10+')).toBeInTheDocument();
  });

  it('should display graduation cap icon correctly', () => {
    const stat = {
      id: '3',
      label: 'Course Students',
      value: '50K+',
      icon: 'graduation-cap',
    };
    
    render(<StatisticsCard statistic={stat} />);
    
    expect(screen.getByText('Course Students')).toBeInTheDocument();
    expect(screen.getByText('50K+')).toBeInTheDocument();
  });

  it('should display map pin icon correctly', () => {
    const stat = {
      id: '4',
      label: 'Countries Worked',
      value: '15+',
      icon: 'map-pin',
    };
    
    render(<StatisticsCard statistic={stat} />);
    
    expect(screen.getByText('Countries Worked')).toBeInTheDocument();
    expect(screen.getByText('15+')).toBeInTheDocument();
  });

  it('should handle unknown icon gracefully', () => {
    const stat = {
      id: '5',
      label: 'Unknown Metric',
      value: '999',
      icon: 'unknown-icon',
    };
    
    const { container } = render(<StatisticsCard statistic={stat} />);
    
    // Should still render the component
    expect(screen.getByText('Unknown Metric')).toBeInTheDocument();
    expect(screen.getByText('999')).toBeInTheDocument();
    
    // Should have a fallback icon
    const iconElement = container.querySelector('svg');
    expect(iconElement).toBeInTheDocument();
  });
});

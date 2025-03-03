import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AnalogueClock } from '../../components';

describe('AnalogueClock Component', () => {
  test('renders with default values', () => {
    render(<AnalogueClock hour={3} />);
    
    // The component should render
    const clockElement = screen.getByText('3'); // Hour value
    expect(clockElement).toBeInTheDocument();
    
    // Check for clock hands
    const clockFace = screen.getByRole('img', { hidden: true });
    expect(clockFace).toBeInTheDocument();
  });
  
  test('renders with custom hour and minute', () => {
    render(<AnalogueClock hour={7} minute={15} />);
    
    // The component should render with hour 7
    expect(screen.getByText('7')).toBeInTheDocument();
  });
  
  test('renders with custom size', () => {
    const customSize = 200;
    const { container } = render(<AnalogueClock hour={9} size={customSize} />);
    
    // The clock container should have the custom size
    const clockContainer = container.querySelector('.relative');
    expect(clockContainer).toHaveAttribute('style', expect.stringContaining(`${customSize}px`));
  });
  
  test('handles hour wrapping (12 to 1)', () => {
    render(<AnalogueClock hour={12} />);
    
    // Should display 12 instead of 0
    expect(screen.getByText('12')).toBeInTheDocument();
  });
  
  test('handles all hour positions', () => {
    const { rerender } = render(<AnalogueClock hour={1} />);
    
    // Test for each hour position
    for (let hour = 1; hour <= 12; hour++) {
      rerender(<AnalogueClock hour={hour} />);
      expect(screen.getByText(hour.toString())).toBeInTheDocument();
    }
  });
}); 
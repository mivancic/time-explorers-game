import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { NameInputScreen } from '../../screens';

describe('NameInputScreen Component', () => {
  const defaultProps = {
    playerName: '',
    characterChoice: 'boy',
    onNameChange: jest.fn(),
    onSubmit: jest.fn(),
    onBack: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders name input form correctly for boy character', () => {
    render(<NameInputScreen {...defaultProps} />);
    
    // Check title and prompt
    expect(screen.getByText('Tvoje ime')).toBeInTheDocument();
    expect(screen.getByText(/Kako se zoveš\? Marko\?/i)).toBeInTheDocument();
    
    // Check input field
    const inputField = screen.getByPlaceholderText('Marko');
    expect(inputField).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByText('Natrag')).toBeInTheDocument();
    expect(screen.getByText('Nastavi')).toBeInTheDocument();
    
    // Check character info
    expect(screen.getByText(/Odabrani lik: Marko/i)).toBeInTheDocument();
  });
  
  test('renders name input form correctly for girl character', () => {
    render(<NameInputScreen {...defaultProps} characterChoice="girl" />);
    
    // Check prompt for girl
    expect(screen.getByText(/Kako se zoveš\? Ana\?/i)).toBeInTheDocument();
    
    // Check input field
    expect(screen.getByPlaceholderText('Ana')).toBeInTheDocument();
    
    // Check character info
    expect(screen.getByText(/Odabrani lik: Ana/i)).toBeInTheDocument();
  });
  
  test('handles name input changes', () => {
    render(<NameInputScreen {...defaultProps} />);
    
    // Get input field
    const inputField = screen.getByPlaceholderText('Marko');
    
    // Change input value
    fireEvent.change(inputField, { target: { value: 'Test Player' } });
    
    // Check that onNameChange was called with new value
    expect(defaultProps.onNameChange).toHaveBeenCalledWith('Test Player');
  });
  
  test('handles form submission', () => {
    render(<NameInputScreen {...defaultProps} />);
    
    // Get form using container query since the form doesn't have a role anymore
    const form = document.querySelector('form');
    
    // Submit form
    fireEvent.submit(form);
    
    // Check that onSubmit was called
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
  
  test('handles continue button click', () => {
    render(<NameInputScreen {...defaultProps} />);
    
    // Get continue button
    const continueButton = screen.getByText('Nastavi');
    
    // Click continue button
    fireEvent.click(continueButton);
    
    // Check that onSubmit was called
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
  
  test('handles back button click', () => {
    render(<NameInputScreen {...defaultProps} />);
    
    // Get back button
    const backButton = screen.getByText('Natrag');
    
    // Click back button
    fireEvent.click(backButton);
    
    // Check that onBack was called
    expect(defaultProps.onBack).toHaveBeenCalled();
  });
  
  test('shows error for too long names', () => {
    render(<NameInputScreen {...defaultProps} />);
    
    // Get input field
    const inputField = screen.getByPlaceholderText('Marko');
    
    // Enter a very long name
    fireEvent.change(inputField, { 
      target: { value: 'This Name Is Way Too Long For The Game To Handle Properly' } 
    });
    
    // Submit form
    const form = document.querySelector('form');
    fireEvent.submit(form);
    
    // Check for error message
    expect(screen.getByText(/Ime ne smije biti duže od 20 znakova/i)).toBeInTheDocument();
    
    // Check that onSubmit was not called
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });
  
  test('handles Enter key press', () => {
    render(<NameInputScreen {...defaultProps} />);
    
    // Get input field
    const inputField = screen.getByPlaceholderText('Marko');
    
    // Press Enter key
    fireEvent.keyPress(inputField, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // Check that onSubmit was called
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
}); 
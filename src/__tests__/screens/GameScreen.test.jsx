import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { GameScreen } from '../../screens';

// Mock components
jest.mock('../../components/ClockAnimation', () => {
  return function MockClockAnimation({ startHour, startMinute, endHour, endMinute }) {
    return (
      <div data-testid="clock-animation">
        Clock Animation: {startHour}:{startMinute} to {endHour}:{endMinute}
      </div>
    );
  };
});

describe('GameScreen Component', () => {
  const mockGameState = {
    score: 100,
    level: 2,
    totalLevels: 5,
    timeLeft: 30,
    levelProgress: 3,
    questionsPerLevel: 10,
    levelCompletionThreshold: 70,
    correctAnswers: 8,
    totalQuestions: 12,
    showHint: false,
    averageTime: 12.5,
    questionsAnswered: 12,
    currentQuestion: {
      question: 'What time will it be in 2 hours from now?',
      answer: '10:30',
      hint: 'Add 2 hours to current time',
      answerType: 'time',
      data: {
        startHour: 8,
        startMinute: 30,
        endHour: 10,
        endMinute: 30,
        customAnswer: [{
          type: 'minutes',
          value: 120
        }]
      }
    },
    clockData: {
      startHour: 8, 
      startMinute: 30,
      endHour: 10,
      endMinute: 30
    },
    setUserAnswer: jest.fn(),
    setShowHint: jest.fn(),
    checkAnswer: jest.fn(),
    saveGame: jest.fn(),
    setFeedback: jest.fn(),
    feedback: '',
  };
  
  const mockProps = {
    gameState: mockGameState,
    onSaveAndExit: jest.fn(),
    onExit: jest.fn(),
    handleKeyPress: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders game screen with question and options', () => {
    const { getByText, getByTestId } = render(<GameScreen {...mockProps} />);
    
    // Check score, level, and time display
    expect(getByText(/Bodovi: 100/i)).toBeInTheDocument();
    expect(getByText(/Razina: 2\/5/i)).toBeInTheDocument();
    expect(getByText(/Vrijeme: 30s/i)).toBeInTheDocument();
    
    // Check progress display
    expect(getByText(/Napredak: 3 \/ 10 pitanja/i)).toBeInTheDocument();
    
    // Check question
    expect(getByText('What time will it be in 2 hours from now?')).toBeInTheDocument();
    
    // Check clock animation
    expect(getByTestId('clock-animation')).toBeInTheDocument();
    
    // Check action buttons
    expect(getByText('Pomoć')).toBeInTheDocument();
    expect(getByText('Provjeri')).toBeInTheDocument();
    expect(getByText('Spremi i izađi')).toBeInTheDocument();
    expect(getByText('Izađi bez spremanja')).toBeInTheDocument();
  });
  
  test('selecting an option enables the check button', () => {
    const { getByText, getAllByRole } = render(<GameScreen {...mockProps} />);
    
    // Check button should be disabled initially
    const checkButton = getByText('Provjeri');
    expect(checkButton).toBeDisabled();
    
    // Select an option
    const options = getAllByRole('radio');
    fireEvent.click(options[0]);
    
    // Check button should be enabled
    expect(checkButton).not.toBeDisabled();
    
    // Check that setUserAnswer was called
    expect(mockGameState.setUserAnswer).toHaveBeenCalled();
  });
  
  test('clicking hint button shows hint', () => {
    const { getByText } = render(<GameScreen {...mockProps} />);
    
    // Click hint button
    const hintButton = getByText('Pomoć');
    fireEvent.click(hintButton);
    
    // Check that setShowHint was called
    expect(mockGameState.setShowHint).toHaveBeenCalledWith(true);
  });
  
  test('clicking check button checks answer', () => {
    const { getByText, getAllByRole } = render(<GameScreen {...mockProps} />);
    
    // Select an option
    const options = getAllByRole('radio');
    fireEvent.click(options[0]);
    
    // Click check button
    const checkButton = getByText('Provjeri');
    fireEvent.click(checkButton);
    
    // Check that checkAnswer was called
    expect(mockGameState.checkAnswer).toHaveBeenCalled();
  });
  
  test('save and exit button works', () => {
    const { getByText } = render(<GameScreen {...mockProps} />);
    
    // Click save and exit button
    const saveButton = getByText('Spremi i izađi');
    fireEvent.click(saveButton);
    
    // Check that saveGame and onSaveAndExit were called
    expect(mockGameState.saveGame).toHaveBeenCalled();
    expect(mockProps.onSaveAndExit).toHaveBeenCalled();
  });
  
  test('exit button works', () => {
    const { getByText } = render(<GameScreen {...mockProps} />);
    
    // Click exit button
    const exitButton = getByText('Izađi bez spremanja');
    fireEvent.click(exitButton);
    
    // Check that onExit was called
    expect(mockProps.onExit).toHaveBeenCalled();
  });
  
  test('animation toggle works', () => {
    const { getByText, getByTestId, queryByTestId } = render(<GameScreen {...mockProps} />);
    
    // Check that animation is visible initially
    expect(getByTestId('clock-animation')).toBeInTheDocument();
    
    // Click animation toggle button
    const toggleButton = getByText('Sakrij sat');
    fireEvent.click(toggleButton);
    
    // Animation should be hidden
    expect(queryByTestId('clock-animation')).not.toBeInTheDocument();
    expect(getByText('Prikaži sat')).toBeInTheDocument();
    
    // Click toggle button again
    fireEvent.click(getByText('Prikaži sat'));
    
    // Animation should be visible again
    expect(getByTestId('clock-animation')).toBeInTheDocument();
  });
}); 
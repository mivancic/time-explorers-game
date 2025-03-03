import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TimeExplorers from '../TimeExplorers';
import { loadGameProgress } from '../data/storage';
import audioService from '../services/AudioService';

// Mock dependencies
jest.mock('../data/storage', () => ({
  loadGameProgress: jest.fn(),
  saveGameProgress: jest.fn(),
  saveScore: jest.fn(),
  getUserSettings: jest.fn(),
  saveUserSettings: jest.fn(),
  getScores: jest.fn(() => []),
}));

jest.mock('../services/AudioService', () => ({
  init: jest.fn().mockResolvedValue(true),
  play: jest.fn(),
  setEnabled: jest.fn(),
  setVolume: jest.fn(),
  isEnabled: jest.fn(() => true),
  getVolume: jest.fn(() => 0.8),
}));

// Mock questionManager
jest.mock('../data/questionManager', () => ({
  initForLevel: jest.fn(),
  getRandomQuestion: jest.fn(() => ({
    id: 'question1',
    question: 'What time is it?',
    answer: '8:30',
    hint: 'Look at the clock',
    answerType: 'time',
    data: {
      startHour: 8,
      startMinute: 0,
      endHour: 8,
      endMinute: 30
    }
  })),
  resetUsedQuestions: jest.fn(),
  areAllQuestionsUsed: jest.fn(() => false),
  getTotalQuestionsForLevel: jest.fn(() => 10),
}));

describe('TimeExplorers Application', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    loadGameProgress.mockReturnValue(null);
    
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    global.localStorage = localStorageMock;
    
    // Mock window location
    delete window.location;
    window.location = { reload: jest.fn() };
    
    // Mock document visibility
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    
    // Mock timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Test 1: Application Startup
  test('Application loads correctly with character selection screen', () => {
    render(<TimeExplorers />);
    
    // Character selection screen should be visible
    expect(screen.getByText('Vremenski Istraživači')).toBeInTheDocument();
    expect(screen.getByText('Odaberi svog lika:')).toBeInTheDocument();
    expect(screen.getByText('Marko')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    
    // Config and scoreboard buttons should be visible
    expect(screen.getByText('Postavke')).toBeInTheDocument();
    expect(screen.getByText('Rezultati')).toBeInTheDocument();
  });

  // Test 2: Character Selection
  test('Selecting a character navigates to name input screen', () => {
    render(<TimeExplorers />);
    
    // Click on a character
    fireEvent.click(screen.getByText('Marko'));
    
    // Should navigate to name input screen
    expect(screen.getByText('Tvoje ime')).toBeInTheDocument();
    expect(screen.getByText(/Kako se zoveš/i)).toBeInTheDocument();
  });

  // Test 3: Name Input
  test('Entering a name and submitting navigates to start screen', async () => {
    render(<TimeExplorers />);
    
    // Select character
    fireEvent.click(screen.getByText('Marko'));
    
    // Enter name
    const nameInput = screen.getByPlaceholderText('Marko');
    fireEvent.change(nameInput, { target: { value: 'TestPlayer' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Nastavi'));
    
    // Should navigate to start screen
    expect(await screen.findByText(/Započni novu igru/i)).toBeInTheDocument();
  });

  // Test 4: Game Screen Navigation
  test('Clicking start game navigates to game screen', async () => {
    render(<TimeExplorers />);
    
    // Navigate to start screen
    fireEvent.click(screen.getByText('Marko'));
    const nameInput = screen.getByPlaceholderText('Marko');
    fireEvent.change(nameInput, { target: { value: 'TestPlayer' } });
    fireEvent.click(screen.getByText('Nastavi'));
    
    // Wait for start screen
    const startButton = await screen.findByText(/Započni novu igru/i);
    
    // Start new game
    fireEvent.click(startButton);
    
    // Should navigate to game screen
    expect(await screen.findByText(/Bodovi:/i)).toBeInTheDocument();
    expect(screen.getByText(/Razina:/i)).toBeInTheDocument();
    expect(screen.getByText(/Vrijeme:/i)).toBeInTheDocument();
  });

  // Test 5: Config Screen
  test('Navigating to config screen shows settings', async () => {
    render(<TimeExplorers />);
    
    // Navigate to config screen
    fireEvent.click(screen.getByText('Postavke'));
    
    // Check config screen elements
    expect(await screen.findByText(/Postavke igre/i)).toBeInTheDocument();
  });

  // Test 6: Scoreboard Screen
  test('Navigating to scoreboard screen shows results', async () => {
    render(<TimeExplorers />);
    
    // Navigate to scoreboard screen
    fireEvent.click(screen.getByText('Rezultati'));
    
    // Check scoreboard elements
    expect(await screen.findByText(/Rezultati igrača/i)).toBeInTheDocument();
  });
}); 
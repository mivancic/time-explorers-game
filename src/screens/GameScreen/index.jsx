import React, { useState, useEffect, useCallback } from 'react';
import { ClockAnimation } from '../../components';

/**
 * GameScreen component renders the main game screen where questions are answered
 * 
 * @param {Object} props - Component props
 * @param {Object} props.gameState - Game state object from useGameState hook
 * @param {Function} props.onSaveAndExit - Handler for saving and exiting
 * @param {Function} props.onExit - Handler for exiting without saving
 * @param {Function} props.handleKeyPress - Handler for keyboard input
 */
const GameScreen = ({ 
  gameState, 
  onSaveAndExit, 
  onExit, 
  handleKeyPress 
}) => {
  // State for radio button options
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  // State to track if answer is being checked (for locking UI)
  const [isChecking, setIsChecking] = useState(false);
  // State for animation control
  const [showAnimation, setShowAnimation] = useState(true);

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = useCallback((array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Generate appropriate options based on question type
  const generateOptions = useCallback((question) => {
    const correctAnswer = question.answer;
    let answerOptions = [];
    
    if (question.answerType === 'hour') {
      // For hour-based questions - generate numbers around the correct answer
      const correctNum = parseInt(correctAnswer, 10);
      // Create an array with the correct answer and 3 other options
      answerOptions = [
        correctNum,
        correctNum + Math.floor(Math.random() * 2) + 1,
        correctNum - Math.floor(Math.random() * 2) - 1,
        correctNum + Math.floor(Math.random() * 3) + 2
      ];
    } 
    else if (question.answerType === 'time') {
      // For time format questions (e.g., "8:30")
      const correctTime = correctAnswer.toString();
      const [correctHour, correctMin] = correctTime.split(':').map(num => parseInt(num, 10));
      
      // Generate options with slight variations
      answerOptions = [
        correctTime,
        `${correctHour + 1}:${correctMin.toString().padStart(2, '0')}`,
        `${correctHour}:${((correctMin + 15) % 60).toString().padStart(2, '0')}`,
        `${correctHour - 1 || 12}:${correctMin.toString().padStart(2, '0')}`
      ];
    }
    else if (question.answerType === 'custom' && question.data.customAnswer) {
      // For custom answer types
      const answerData = question.data.customAnswer[0];
      if (answerData.type === 'minutes') {
        // For duration answers in minutes
        const correctMin = answerData.value;
        answerOptions = [
          `${correctMin} minuta`,
          `${correctMin + 5} minuta`,
          `${correctMin - 5 > 0 ? correctMin - 5 : correctMin + 10} minuta`,
          `${correctMin + 10} minuta`
        ];
      }
    }
    
    // Shuffle options
    answerOptions = shuffleArray(answerOptions);
    
    setOptions(answerOptions);
    setSelectedOption(''); // Reset selection
  }, [shuffleArray]);

  // Generate answer options whenever current question changes
  useEffect(() => {
    if (!gameState.currentQuestion) return;
    
    // Generate options based on question type
    generateOptions(gameState.currentQuestion);
    setIsChecking(false);
    setShowAnimation(true);
  }, [gameState.currentQuestion, generateOptions]);

  // Add keyboard event listener
  useEffect(() => {
    if (handleKeyPress) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [handleKeyPress]);

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (isChecking) return; // Don't allow selection while checking
    
    setSelectedOption(option);
    // Set the answer in the gameState
    if (gameState.currentQuestion.answerType === 'hour') {
      gameState.setUserAnswer(option.toString());
    } else if (gameState.currentQuestion.answerType === 'time') {
      gameState.setUserAnswer(option);
    } else {
      // For custom types
      gameState.setUserAnswer(option);
    }
  };

  // Handle check answer
  const handleCheckAnswer = () => {
    if (selectedOption === '') {
      // If no option selected, show feedback
      gameState.setFeedback("Molim odaberi odgovor!");
      return;
    }
    
    // Lock the UI during answer checking
    setIsChecking(true);
    gameState.checkAnswer();
  };

  // Handle save and exit
  const handleSaveAndExit = () => {
    // First save the current game state
    gameState.saveGame();
    // Then call the onSaveAndExit prop to exit
    onSaveAndExit();
  };

  // Toggle animation visibility
  const toggleAnimation = () => {
    setShowAnimation(!showAnimation);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md mx-auto" data-test="game-container">
      <div className="flex justify-between mb-4">
        <div className="text-lg font-bold" data-test="game-display-score">Bodovi: {gameState.score}</div>
        <div className="text-lg font-bold" data-test="game-text-level">Razina: {gameState.level}/{gameState.totalLevels}</div>
        <div className={`text-lg font-bold ${gameState.timeLeft < 10 ? 'text-red-500' : ''}`} data-test="game-display-time">
          Vrijeme: {gameState.timeLeft}s
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-1" data-test="game-progress-bar-container">
        <div 
          className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, (gameState.levelProgress / gameState.questionsPerLevel) * 100)}%` }}
          data-test="game-progress-bar"
        ></div>
      </div>
      <div className="text-xs text-center mb-4" data-test="game-text-progress">
        Napredak: {gameState.levelProgress} / {gameState.questionsPerLevel} pitanja 
        (potrebno {gameState.levelCompletionThreshold}% za prelazak razine)
      </div>
      
      <div className="mb-6 p-4 bg-blue-100 rounded-lg" data-test="game-container-question">
        <p className="text-lg mb-3" data-test="game-text-question">{gameState.currentQuestion?.question}</p>
        
        {/* Clock Animation with toggle button */}
        <div className="relative" data-test="game-container-clock">
          {showAnimation && (
            <ClockAnimation 
              startHour={gameState.clockData.startHour}
              startMinute={gameState.clockData.startMinute}
              endHour={gameState.clockData.endHour}
              endMinute={gameState.clockData.endMinute}
            />
          )}
          <button 
            onClick={toggleAnimation}
            className="absolute top-0 right-0 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            data-test="game-button-toggle-clock"
          >
            {showAnimation ? 'Sakrij sat' : 'Prikaži sat'}
          </button>
        </div>
      </div>
      
      {gameState.showHint && (
        <div className="mb-4 p-2 bg-yellow-100 rounded border border-yellow-200">
          <p className="text-sm text-yellow-800">Pomoć: {gameState.currentQuestion?.hint}</p>
        </div>
      )}
      
      {/* Radio button options in two columns */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          {options.map((option, index) => (
            <div 
              key={index} 
              className={`p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedOption === option 
                  ? 'bg-blue-100 border-blue-500' 
                  : isChecking 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:bg-gray-50'
              }`}
              onClick={() => handleOptionSelect(option)}
              data-test={`game-option-container-${index}`}
            >
              <label className={`flex items-center cursor-pointer w-full ${isChecking ? 'cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  name="answer"
                  checked={selectedOption === option}
                  onChange={() => handleOptionSelect(option)}
                  className="mr-3"
                  disabled={isChecking}
                  data-test={`game-input-answer-${index}`}
                />
                <span>{option}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 disabled:opacity-50"
          onClick={() => gameState.setShowHint(true)}
          disabled={isChecking || gameState.showHint}
          data-test="game-button-hint"
        >
          Pomoć
        </button>
        <button
          className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 disabled:opacity-50"
          onClick={handleCheckAnswer}
          disabled={isChecking || selectedOption === ''}
          data-test="game-button-check"
        >
          Provjeri
        </button>
      </div>
      
      {gameState.feedback && (
        <div 
          className={`mt-4 p-2 rounded text-center ${gameState.feedback.startsWith('Točno') ? 'bg-green-100' : 'bg-red-100'}`}
          data-test="game-container-feedback"
        >
          {gameState.feedback}
        </div>
      )}
      
      <div className="mt-4 text-center">
        <p>Točno: {gameState.correctAnswers} / Ukupno: {gameState.totalQuestions}</p>
        {gameState.questionsAnswered > 0 && (
          <p className="text-sm text-gray-600">
            Prosječno vrijeme: {Math.round(gameState.averageTime * 10) / 10} sekundi
          </p>
        )}
      </div>
      
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={handleSaveAndExit}
          className="text-sm bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Spremi i izađi
        </button>
        <button
          onClick={onExit}
          className="text-sm bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Izađi bez spremanja
        </button>
      </div>
    </div>
  );
};

export default GameScreen; 
import React, { useState, useEffect, useRef } from 'react';
import useGameState from './hooks/useGameState';
import { loadGameProgress } from './data/storage';

// Import screens from the new structure
import {
  CharacterSelectScreen,
  ConfigScreen,
  GameScreen,
  NameInputScreen,
  ScoreboardScreen,
  StartScreen,
  SuccessScreen
} from './screens';

// Main app component
const TimeExplorers = () => {
  // Use our custom hook for game state
  const gameState = useGameState();
  // State to track if saved game exists
  const [savedGameExists, setSavedGameExists] = useState(false);
  // Ref for timeouts to properly clean them up
  const timeoutRef = useRef(null);
  // State to track if document is visible
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  
  // Check if saved game exists
  useEffect(() => {
    const savedGame = loadGameProgress();
    setSavedGameExists(savedGame !== null);
  }, [gameState.gameState]);
  
  // Setup visibility change detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState.gameState !== 'playing' || !isDocumentVisible) return;
    
    const timer = setInterval(() => {
      gameState.setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          gameState.setFeedback(`Vrijeme je isteklo! Točan odgovor je ${gameState.currentQuestion.answer}.`);
          
          // Use ref to store timeout and clear previous if exists
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          timeoutRef.current = setTimeout(() => {
            // Just go to next question without counting as wrong answer
            gameState.nextQuestion(false); // Pass false to not count as incorrect
          }, 2000);
          
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(timer);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [gameState.gameState, gameState.currentQuestion, isDocumentVisible, gameState]);

  // Handle keyboard input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && gameState.gameState === 'playing') {
      gameState.checkAnswer();
    }
  };
  
  // Show config page
  const showConfig = () => {
    gameState.setGameState('config');
  };
  
  // Show scoreboard
  const showScoreboard = () => {
    gameState.setGameState('scoreboard');
  };
  
  // Continue saved game
  const continueGame = () => {
    gameState.setGameState('playing');
  };
  
  // Handle character selection
  const handleCharacterChoice = (choice) => {
    gameState.setCharacterChoice(choice);
    gameState.setGameState('nameInput');
  };
  
  // Handle name input completion
  const handleNameSubmit = () => {
    // Set playerName to empty string if nothing was entered
    if (gameState.playerName === undefined || gameState.playerName === null) {
      gameState.setPlayerName('');
    }
    gameState.setGameState('start');
  };

  // Handle back to character selection
  const handleBackToCharacterSelect = () => {
    gameState.setCharacterChoice(null);
    gameState.setGameState('start');
  };
  
  // Handle saving and exiting
  const handleSaveAndExit = () => {
    // First save the current game state
    gameState.saveGame();
    // Then reset the game state to start screen
    gameState.setGameState('start');
    gameState.setCurrentQuestion(null);
  };
  
  // Handle exit without saving
  const handleExit = () => {
    gameState.setGameState('start');
    gameState.setCurrentQuestion(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-blue-50">
      {/* Config Screen */}
      {gameState.gameState === 'config' && (
        <ConfigScreen 
          onSave={gameState.applySettings}
          onCancel={() => gameState.setGameState('start')}
        />
      )}
      
      {/* Scoreboard Screen */}
      {gameState.gameState === 'scoreboard' && (
        <ScoreboardScreen 
          onClose={() => gameState.setGameState('start')}
        />
      )}
      
      {/* Character Selection Screen */}
      {!gameState.characterChoice && gameState.gameState === 'start' && (
        <CharacterSelectScreen 
          onCharacterSelect={handleCharacterChoice}
          onConfigClick={showConfig}
          onScoreboardClick={showScoreboard}
        />
      )}
      
      {/* Name Input Screen */}
      {gameState.characterChoice && gameState.gameState === 'nameInput' && (
        <NameInputScreen 
          playerName={gameState.playerName}
          characterChoice={gameState.characterChoice}
          onNameChange={(value) => gameState.setPlayerName(value)}
          onSubmit={handleNameSubmit}
          onBack={handleBackToCharacterSelect}
        />
      )}
      
      {/* Start Screen */}
      {gameState.characterChoice && gameState.gameState === 'start' && (
        <StartScreen
          characterName={gameState.characterName}
          savedGameExists={savedGameExists}
          onStartNewGame={gameState.startGame}
          onContinueGame={continueGame}
          onConfigClick={showConfig}
          onScoreboardClick={showScoreboard}
        />
      )}
      
      {/* Game Screen */}
      {gameState.gameState === 'playing' && (
        <GameScreen
          gameState={gameState}
          onSaveAndExit={handleSaveAndExit}
          onExit={handleExit}
          handleKeyPress={handleKeyPress}
        />
      )}
      
      {/* Success Screen */}
      {gameState.gameState === 'success' && (
        <SuccessScreen
          score={gameState.score}
          correctAnswers={gameState.correctAnswers}
          totalQuestions={gameState.totalQuestions}
          averageTime={gameState.averageTime}
          onReturnToStart={() => gameState.setGameState('start')}
          onViewScoreboard={showScoreboard}
        />
      )}
    </div>
  );
};

export default TimeExplorers;
import React from 'react';

/**
 * StartScreen component displays the main menu after character selection
 * 
 * @param {Object} props - Component props
 * @param {string} props.characterName - Player character name
 * @param {boolean} props.savedGameExists - Whether a saved game exists
 * @param {Function} props.onStartNewGame - Function to start a new game
 * @param {Function} props.onContinueGame - Function to continue saved game
 * @param {Function} props.onConfigClick - Function for config button
 * @param {Function} props.onScoreboardClick - Function for scoreboard button
 */
const StartScreen = ({ 
  characterName, 
  savedGameExists, 
  onStartNewGame, 
  onContinueGame, 
  onConfigClick, 
  onScoreboardClick 
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md text-center" data-test="game-start-container">
      <h1 className="text-3xl font-bold mb-6 text-blue-600" data-test="game-start-text-title">Vremenski Istraživači</h1>
      <p className="mb-6" data-test="game-start-text-prompt">Pomozi {characterName} naučiti o vremenu!</p>
      
      <div className="flex flex-col space-y-4">
        <button
          className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600"
          onClick={onStartNewGame}
          data-test="game-button-start"
        >
          Nova igra
        </button>
        
        {savedGameExists && (
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600"
            onClick={onContinueGame}
            data-test="game-button-continue"
          >
            Nastavi igru
          </button>
        )}
        
        <div className="flex justify-around mt-4">
          <button
            onClick={onConfigClick}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
            data-test="nav-button-settings"
          >
            Postavke
          </button>
          <button
            onClick={onScoreboardClick}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
            data-test="nav-button-results"
          >
            Rezultati
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen; 
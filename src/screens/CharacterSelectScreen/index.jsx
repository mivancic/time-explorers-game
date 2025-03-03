import React from 'react';

/**
 * CharacterSelectScreen component allows the player to choose a character
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onCharacterSelect - Function to call when character is selected
 * @param {Function} props.onConfigClick - Function to call when config button is clicked
 * @param {Function} props.onScoreboardClick - Function to call when scoreboard button is clicked
 */
const CharacterSelectScreen = ({ 
  onCharacterSelect, 
  onConfigClick, 
  onScoreboardClick 
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md text-center mx-auto" data-test="char-select-container">
      <h1 className="text-3xl font-bold mb-6 text-blue-600" data-test="char-select-text-title">Vremenski Istraživači</h1>
      <p className="mb-6 text-lg" data-test="char-select-text-prompt">Odaberi svog lika:</p>
      
      <div className="grid grid-cols-2 gap-6 mb-8" data-test="char-select-container-buttons">
        <div 
          className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => onCharacterSelect('boy')}
          data-test="char-select-character-boy"
        >
          <div className="w-32 h-32 bg-blue-100 rounded-full mb-2 flex items-center justify-center">
            <span className="text-5xl">👦</span>
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 w-full"
            data-test="char-select-button-marko"
          >
            Marko
          </button>
        </div>
        
        <div 
          className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => onCharacterSelect('girl')}
          data-test="char-select-character-girl"
        >
          <div className="w-32 h-32 bg-pink-100 rounded-full mb-2 flex items-center justify-center">
            <span className="text-5xl">👧</span>
          </div>
          <button
            className="bg-pink-500 text-white py-2 px-6 rounded-full hover:bg-pink-600 w-full"
            data-test="char-select-button-ana"
          >
            Ana
          </button>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center space-x-6" data-test="char-select-container-nav">
        <button
          onClick={onConfigClick}
          className="text-sm bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded transition-colors"
          data-test="nav-button-settings"
        >
          Postavke
        </button>
        <button
          onClick={onScoreboardClick}
          className="text-sm bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded transition-colors"
          data-test="nav-button-results"
        >
          Rezultati
        </button>
      </div>
      
      <div className="mt-6 text-xs text-gray-500" data-test="char-select-text-version">
        Verzija 1.0.0 - Vremenski Istraživači
      </div>
    </div>
  );
};

export default CharacterSelectScreen; 
import React, { useState, useEffect, useRef } from 'react';

/**
 * NameInputScreen component allows the player to enter their name
 * 
 * @param {Object} props - Component props
 * @param {string} props.playerName - Current player name value
 * @param {string} props.characterChoice - Selected character ('boy' or 'girl')
 * @param {Function} props.onNameChange - Function to handle name input changes
 * @param {Function} props.onSubmit - Function to handle submit button click
 * @param {Function} props.onBack - Function to go back to character selection
 */
const NameInputScreen = ({ 
  playerName, 
  characterChoice, 
  onNameChange, 
  onSubmit,
  onBack
}) => {
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  
  // Focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input if needed
    if (playerName.trim().length > 20) {
      setError('Ime ne smije biti duže od 20 znakova');
      return;
    }
    
    // Clear any errors and submit
    setError('');
    onSubmit();
  };
  
  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md text-center mx-auto" data-test="name-input-container">
      <h1 className="text-3xl font-bold mb-6 text-blue-600" data-test="name-text-title">Tvoje ime</h1>
      
      <div className="mb-4 flex justify-center" data-test="name-input-avatar-container">
        <div className="w-24 h-24 bg-blue-100 rounded-full mb-2 flex items-center justify-center" data-test="name-input-avatar">
          <span className="text-4xl">{characterChoice === 'boy' ? '👦' : '👧'}</span>
        </div>
      </div>
      
      <p className="mb-4" data-test="name-input-text-prompt">
        Kako se zoveš? {characterChoice === 'boy' ? 'Marko' : 'Ana'}?
        <br />
        <span className="text-sm text-gray-500">(Možeš ostaviti prazno za zadano ime)</span>
      </p>
      
      <form onSubmit={handleSubmit} className="mb-6" data-test="name-input-form">
        <div className="mb-4">
          <input
            ref={inputRef}
            type="text"
            value={playerName}
            onChange={(e) => {
              onNameChange(e.target.value);
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={characterChoice === 'boy' ? 'Marko' : 'Ana'}
            className="w-full p-3 border rounded text-center text-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            maxLength={20}
            data-test="name-input-field"
          />
          {error && <p className="text-red-500 text-sm mt-1" data-test="name-input-error">{error}</p>}
        </div>
        
        <div className="flex justify-center space-x-4" data-test="name-input-buttons">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-full hover:bg-gray-400"
            data-test="name-button-back"
          >
            Natrag
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600"
            data-test="name-button-continue"
          >
            Nastavi
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-xs text-gray-500" data-test="name-input-text-character">
        Odabrani lik: {characterChoice === 'boy' ? 'Marko' : 'Ana'}
      </div>
    </div>
  );
};

export default NameInputScreen; 
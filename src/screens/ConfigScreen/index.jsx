import React, { useState, useEffect } from 'react';
import defaultConfig from '../../data/config';
import { getUserSettings, saveUserSettings } from '../../data/storage';

/**
 * ConfigScreen component provides configuration options for the game
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSave - Function to call when settings are saved
 * @param {Function} props.onCancel - Function to call when canceling changes
 */
const ConfigScreen = ({ onSave, onCancel }) => {
  const [settings, setSettings] = useState({...defaultConfig});
  const [playerName, setPlayerName] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = getUserSettings();
    if (savedSettings) {
      setSettings(savedSettings);
      // If player name was saved, load it
      if (savedSettings.playerName) {
        setPlayerName(savedSettings.playerName);
      }
    }
  }, []);

  const handleSave = () => {
    // Validate settings
    if (settings.levelCompletionThreshold < 50 || settings.levelCompletionThreshold > 100) {
      setMessage('Prag za završetak razine mora biti između 50% i 100%.');
      return;
    }

    if (settings.questionsPerLevel < 3 || settings.questionsPerLevel > 10) {
      setMessage('Broj pitanja po razini mora biti između 3 i 10.');
      return;
    }

    // Show saving indicator
    setIsSaving(true);

    // Prepare settings to save
    const settingsToSave = {
      ...settings,
      playerName: playerName || null
    };

    // Save settings
    const success = saveUserSettings(settingsToSave);
    
    if (success) {
      setMessage('Postavke su uspješno spremljene!');
      setTimeout(() => {
        setIsSaving(false);
        if (onSave) onSave(settingsToSave);
      }, 1000);
    } else {
      setMessage('Došlo je do greške prilikom spremanja postavki.');
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({...defaultConfig});
    setPlayerName('');
    setMessage('Postavke su vraćene na zadane vrijednosti.');
  };

  const handleVolumeChange = (value) => {
    setSettings({
      ...settings,
      sounds: {
        ...settings.sounds,
        volume: parseInt(value)
      }
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md" data-test="settings-container">
      <h2 className="text-2xl font-bold mb-4 text-blue-600" data-test="settings-text-title">Postavke igre</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tvoje ime:
        </label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Unesi svoje ime"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          maxLength={20}
          data-test="settings-input-name"
        />
        <p className="text-sm text-gray-500 mt-1">
          Ostavi prazno za korištenje zadanog imena lika
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Prag za završetak razine:
        </label>
        <div className="flex items-center">
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={settings.levelCompletionThreshold}
            onChange={(e) => setSettings({
              ...settings, 
              levelCompletionThreshold: parseInt(e.target.value)
            })}
            className="mr-3 w-2/3"
          />
          <span className="text-lg font-semibold">{settings.levelCompletionThreshold}%</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Postotak točnih odgovora potreban za prelazak na sljedeću razinu
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Broj pitanja po razini:
        </label>
        <select
          value={settings.questionsPerLevel}
          onChange={(e) => setSettings({
            ...settings, 
            questionsPerLevel: parseInt(e.target.value)
          })}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Vremensko ograničenje:
        </label>
        <div className="flex items-center">
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={settings.timeLimit}
            onChange={(e) => setSettings({
              ...settings, 
              timeLimit: parseInt(e.target.value)
            })}
            className="mr-3 w-2/3"
          />
          <span className="text-lg font-semibold">{settings.timeLimit} s</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={settings.sounds.enabled}
            onChange={(e) => setSettings({
              ...settings,
              sounds: {
                ...settings.sounds,
                enabled: e.target.checked
              }
            })}
            className="mr-2"
          />
          <span className="text-gray-700">Zvukovi uključeni</span>
        </label>
        
        {settings.sounds.enabled && (
          <div className="ml-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Glasnoća:
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={settings.sounds.volume}
                onChange={(e) => handleVolumeChange(e.target.value)}
                className="mr-3 w-2/3"
              />
              <span className="text-lg font-semibold">{settings.sounds.volume}%</span>
            </div>
          </div>
        )}
      </div>
      
      {message && (
        <div className={`mb-4 p-2 rounded text-center ${
          message.includes('greške') ? 'bg-red-100 text-red-800' : 
          message.includes('uspješno') ? 'bg-green-100 text-green-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {message}
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          disabled={isSaving}
          data-test="settings-button-reset"
        >
          Vrati zadane
        </button>
        <div>
          <button
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 mr-2"
            disabled={isSaving}
            data-test="settings-button-cancel"
          >
            Odustani
          </button>
          <button
            onClick={handleSave}
            className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSaving}
            data-test="settings-button-save"
          >
            {isSaving ? 'Spremanje...' : 'Spremi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen; 
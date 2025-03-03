import React, { useEffect } from 'react';
import TimeExplorers from './TimeExplorers';
import audioService from './services/AudioService';

/**
 * Main App component
 * Initializes global services and renders the Time Explorers game
 */
const App = () => {
  // Initialize audio service when the app starts
  useEffect(() => {
    audioService.init().catch(error => {
      console.warn('Audio initialization failed:', error);
    });
  }, []);

  return (
    <div className="app" data-test="app-container">
      <TimeExplorers />
    </div>
  );
};

export default App; 
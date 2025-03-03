// Storage utilities for game progress
const STORAGE_KEY = 'timeExplorersGameData';

// Save game progress to localStorage
export const saveGameProgress = (data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
    return true;
  } catch (error) {
    console.error('Error saving game progress:', error);
    return false;
  }
};

// Load game progress from localStorage
export const loadGameProgress = () => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error('Error loading game progress:', error);
    return null;
  }
};

// Clear game progress from localStorage
export const clearGameProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing game progress:', error);
    return false;
  }
};

// Get scores from localStorage
export const getScores = () => {
  try {
    const scores = localStorage.getItem('timeExplorersScores');
    return scores ? JSON.parse(scores) : [];
  } catch (error) {
    console.error('Error getting scores:', error);
    return [];
  }
};

// Save score to localStorage
export const saveScore = (scoreData) => {
  try {
    const scores = getScores();
    scores.push({
      ...scoreData,
      date: new Date().toISOString()
    });
    
    // Sort scores by points (descending)
    scores.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores
    const topScores = scores.slice(0, 10);
    
    localStorage.setItem('timeExplorersScores', JSON.stringify(topScores));
    return true;
  } catch (error) {
    console.error('Error saving score:', error);
    return false;
  }
};

// Get user settings
export const getUserSettings = () => {
  try {
    const settings = localStorage.getItem('timeExplorersSettings');
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error getting user settings:', error);
    return null;
  }
};

// Save user settings
export const saveUserSettings = (settings) => {
  try {
    localStorage.setItem('timeExplorersSettings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving user settings:', error);
    return false;
  }
}; 
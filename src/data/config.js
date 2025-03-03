// Game configuration settings
const defaultConfig = {
  // Completion threshold for each level (percentage needed to advance)
  levelCompletionThreshold: 80,
  
  // Default number of questions per level
  questionsPerLevel: 5,
  
  // Total number of levels in the game
  totalLevels: 3,
  
  // Time limit for each question (in seconds)
  timeLimit: 30,
  
  // Default player names
  defaultPlayers: {
    boy: "Marko",
    girl: "Ana"
  },
  
  // Sound effects
  sounds: {
    enabled: true,
    volume: 80
  }
};

export default defaultConfig; 
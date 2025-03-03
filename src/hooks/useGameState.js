import { useState, useEffect, useCallback } from 'react';
import questionManager from '../data/questionManager';
import defaultConfig from '../data/config';
import { saveGameProgress, loadGameProgress, saveScore } from '../data/storage';
import audioService from '../services/AudioService';

const useGameState = (initialConfig = defaultConfig) => {
  // Game state
  const [gameState, setGameState] = useState('start'); // start, nameInput, config, playing, success, gameover
  const [config, setConfig] = useState(initialConfig);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [level, setLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [characterChoice, setCharacterChoice] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [averageTime, setAverageTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  
  // Clock animation data
  const [clockData, setClockData] = useState({
    startHour: 8,
    startMinute: 0,
    endHour: 9,
    endMinute: 0
  });
  
  // Initialize audio service
  useEffect(() => {
    // Initialize audio service when component mounts
    audioService.init().then(() => {
      // Set initial audio settings from config
      audioService.setEnabled(config.sounds.enabled);
      audioService.setVolume(config.sounds.volume / 100); // Convert percentage to 0-1 range
    });
  }, [config.sounds.enabled, config.sounds.volume]);
  
  // Audio feedback using our service
  const playSound = useCallback((type) => {
    if (!config.sounds.enabled) return;
    
    switch (type) {
      case 'success':
        audioService.play('success');
        break;
      case 'incorrect':
        audioService.play('error');
        break;
      case 'click':
        audioService.play('click');
        break;
      case 'levelUp':
        audioService.play('levelUp');
        break;
      case 'timeOut':
        audioService.play('timeOut');
        break;
      default:
        console.log(`Sound type "${type}" not recognized`);
        break;
    }
  }, [config.sounds.enabled]);
  
  // Load saved game if exists
  useEffect(() => {
    const savedGame = loadGameProgress();
    if (savedGame) {
      // Only restore if we're at the start screen
      if (gameState === 'start') {
        setGameState(savedGame.gameState !== 'playing' ? 'start' : 'playing');
        setScore(savedGame.score || 0);
        setLevel(savedGame.level || 1);
        setLevelProgress(savedGame.levelProgress || 0);
        setTotalQuestions(savedGame.totalQuestions || 0);
        setCorrectAnswers(savedGame.correctAnswers || 0);
        setCharacterChoice(savedGame.characterChoice || null);
        setPlayerName(savedGame.playerName || '');
        
        if (savedGame.gameState === 'playing') {
          questionManager.initForLevel(savedGame.level, getCharacterName());
          nextQuestion();
        }
      }
    }
  }, [gameState]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Get character name (custom or default)
  const getCharacterName = useCallback(() => {
    if (playerName) return playerName;
    return characterChoice === 'boy' ? config.defaultPlayers.boy : config.defaultPlayers.girl;
  }, [characterChoice, config.defaultPlayers, playerName]);
  
  // Start a new game
  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setLevelProgress(0);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setAverageTime(0);
    setTotalTime(0);
    setQuestionsAnswered(0);
    
    // Play start sound
    playSound('click');
    
    // Initialize question manager with level 1
    questionManager.initForLevel(1, getCharacterName());
    nextQuestion();
    
    // Save initial game state
    saveGame();
  }, [getCharacterName, playSound]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Save current game state
  const saveGame = useCallback(() => {
    const gameData = {
      gameState,
      score,
      level,
      levelProgress,
      totalQuestions,
      correctAnswers,
      characterChoice,
      playerName,
      averageTime,
      totalTime,
      questionsAnswered
    };
    
    saveGameProgress(gameData);
  }, [
    gameState, score, level, levelProgress, totalQuestions, 
    correctAnswers, characterChoice, playerName,
    averageTime, totalTime, questionsAnswered
  ]);
  
  // Generate next question
  const nextQuestion = useCallback((countAsAnswered = true) => {
    const newQuestion = questionManager.getRandomQuestion();
    
    // If we've used all questions and not met the threshold, generate new questions
    if (!newQuestion) {
      questionManager.resetUsedQuestions();
      questionManager.initForLevel(level, getCharacterName());
      const freshQuestion = questionManager.getRandomQuestion();
      setCurrentQuestion(freshQuestion);
    } else {
      setCurrentQuestion(newQuestion);
    }
    
    // If we should count this as answered and we had a current question
    // (this avoids counting the initial question load as a skipped question)
    if (countAsAnswered && currentQuestion) {
      setTotalQuestions(prev => prev + 1);
    }
    
    setUserAnswer('');
    setTimeLeft(config.timeLimit);
    setShowHint(false);
    setQuestionStartTime(Date.now());
    
    // Set clock data based on question
    if (newQuestion && newQuestion.data) {
      const data = newQuestion.data;
      setClockData({
        startHour: data.startHour || 8,
        startMinute: data.startMinute || 0,
        endHour: data.endHour || 9,
        endMinute: data.endMinute || 0
      });
    }
    
    // Save game state
    saveGame();
  }, [level, config.timeLimit, getCharacterName, saveGame, currentQuestion]);
  
  // Check if level is complete
  const checkLevelCompletion = useCallback(() => {
    // Calculate completion percentage
    const levelCompletion = (levelProgress / config.questionsPerLevel) * 100;
    
    // Check if we've reached the threshold to complete the level
    if (levelCompletion >= config.levelCompletionThreshold) {
      // If we're at the last level, game over (success)
      if (level >= config.totalLevels) {
        setGameState('success');
        playSound('levelUp');
        
        // Save final score
        saveScore({
          playerName: getCharacterName(),
          score,
          level,
          correctAnswers,
          totalQuestions,
          averageTime: Math.round(averageTime * 10) / 10
        });
      } else {
        // Move to next level
        setLevel(prev => prev + 1);
        setLevelProgress(0);
        
        // Play level up sound
        playSound('levelUp');
        
        // Initialize question manager with new level
        questionManager.initForLevel(level + 1, getCharacterName());
        
        setFeedback(`Bravo! Prešao si na razinu ${level + 1}!`);
        setTimeout(() => {
          nextQuestion();
        }, 2000);
      }
    } else {
      nextQuestion();
    }
  }, [
    level, levelProgress, config.questionsPerLevel, 
    config.levelCompletionThreshold, config.totalLevels,
    getCharacterName, score, correctAnswers, totalQuestions, 
    averageTime, nextQuestion, playSound
  ]);
  
  // Check the user's answer
  const checkAnswer = useCallback(() => {
    if (!currentQuestion) return;
    
    // Calculate time taken to answer
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    
    // Update average time
    const newQuestionsAnswered = questionsAnswered + 1;
    const newTotalTime = totalTime + timeTaken;
    setQuestionsAnswered(newQuestionsAnswered);
    setTotalTime(newTotalTime);
    setAverageTime(newTotalTime / newQuestionsAnswered);
    
    // Get user input
    const userInput = userAnswer.trim();
    
    // Handle different answer types
    let isCorrect = false;
    
    if (currentQuestion.answerType === 'hour') {
      // For simple hour answers
      const userNum = parseInt(userInput, 10);
      
      if (isNaN(userNum)) {
        setFeedback("Molim unesi broj!");
        return;
      }
      
      isCorrect = userNum === currentQuestion.answer;
    } 
    else if (currentQuestion.answerType === 'time') {
      // For time format answers (e.g., "8:30")
      // Accept different formats (8:30, 8.30, 8,30)
      const normalizedInput = userInput.replace(',', ':').replace('.', ':');
      const normalizedAnswer = String(currentQuestion.answer).replace(',', ':').replace('.', ':');
      
      isCorrect = normalizedInput === normalizedAnswer;
    }
    else if (currentQuestion.answerType === 'custom' && currentQuestion.data.customAnswer) {
      // For custom answer formats
      const answerData = currentQuestion.data.customAnswer[0];
      if (answerData.type === 'minutes') {
        // For duration answers in minutes
        // Accept "X minutes" or just "X"
        const minutesMatch = userInput.match(/(\d+)\s*min/);
        const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : parseInt(userInput, 10);
        
        if (!isNaN(minutes)) {
          isCorrect = minutes === answerData.value;
        }
      }
    }
    
    if (isCorrect) {
      // Calculate points based on time left
      const pointsEarned = Math.max(1, Math.floor(timeLeft / 5));
      setScore(prev => prev + pointsEarned);
      setCorrectAnswers(prev => prev + 1);
      setLevelProgress(prev => prev + 1);
      setFeedback(`Točno! +${pointsEarned} bodova`);
      playSound('success');
      
      setTimeout(() => {
        checkLevelCompletion();
      }, 1500);
    } else {
      setFeedback(`Nije točno. Točan odgovor je ${currentQuestion.answer}. Idemo probati drugi zadatak!`);
      playSound('incorrect');
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
    
    // Save game state after answer
    saveGame();
  }, [
    currentQuestion, userAnswer, timeLeft, questionStartTime,
    questionsAnswered, totalTime, playSound, checkLevelCompletion,
    nextQuestion, saveGame
  ]);
  
  // Apply settings 
  const applySettings = useCallback((newSettings) => {
    setConfig(newSettings);
    
    // Update audio settings
    if (newSettings.sounds) {
      audioService.setEnabled(newSettings.sounds.enabled);
      audioService.setVolume(newSettings.sounds.volume / 100);
    }
    
    setGameState('start');
    
    if (newSettings.playerName) {
      setPlayerName(newSettings.playerName);
    }
    
    // Play click sound
    playSound('click');
  }, [playSound]);
  
  return {
    // State
    gameState,
    score,
    currentQuestion,
    userAnswer,
    feedback,
    timeLeft,
    level,
    totalQuestions,
    correctAnswers,
    showHint,
    characterChoice,
    clockData,
    levelProgress,
    config,
    playerName,
    averageTime,
    
    // Computed values
    totalLevels: config.totalLevels,
    questionsPerLevel: config.questionsPerLevel,
    levelCompletionThreshold: config.levelCompletionThreshold,
    characterName: getCharacterName(),
    
    // Actions
    setGameState,
    setUserAnswer,
    setShowHint,
    setCharacterChoice,
    setPlayerName,
    setCurrentQuestion,
    setFeedback,
    startGame,
    checkAnswer,
    nextQuestion,
    saveGame,
    applySettings,
    playSound,
    
    // Time tracking
    setTimeLeft,
  };
};

export default useGameState; 
import React from 'react';

/**
 * SuccessScreen component displays the game completion screen with results
 * 
 * @param {Object} props - Component props
 * @param {number} props.score - Player's final score
 * @param {number} props.correctAnswers - Number of correct answers
 * @param {number} props.totalQuestions - Total number of questions answered
 * @param {number} props.averageTime - Average time taken to answer questions
 * @param {Function} props.onReturnToStart - Function to return to start screen
 * @param {Function} props.onViewScoreboard - Function to view scoreboard
 */
const SuccessScreen = ({ 
  score, 
  correctAnswers, 
  totalQuestions, 
  averageTime, 
  onReturnToStart, 
  onViewScoreboard 
}) => {
  // Calculate statistics
  const percentageCorrect = Math.round((correctAnswers / totalQuestions) * 100) || 0;
  const formattedAvgTime = Math.round(averageTime * 10) / 10;

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md text-center">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Čestitamo!</h1>
      <p className="mb-6">Uspješno si završio/la sve razine!</p>
      
      <div className="p-4 bg-green-100 rounded-lg mb-6">
        <h2 className="text-xl font-bold text-green-800 mb-2">Tvoj rezultat:</h2>
        <p className="text-lg">Ukupni bodovi: <span className="font-bold">{score}</span></p>
        <p>Točni odgovori: {correctAnswers} od {totalQuestions}</p>
        <p>Postotak točnih: {percentageCorrect}%</p>
        <p>Prosječno vrijeme: {formattedAvgTime} sekundi</p>
      </div>
      
      <div className="flex justify-around">
        <button
          className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600"
          onClick={onReturnToStart}
        >
          Povratak na početak
        </button>
        <button
          className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600"
          onClick={onViewScoreboard}
        >
          Vidi rezultate
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen; 